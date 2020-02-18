---
title: Hyperledger Sawtooth上手教程
date: 2019-04-08 14:08:03
tags: 
    - sawtooth
    - blockchain
    - hyperledger
---
*最近做了一个sawtooth的项目, 发现网上关于sawtooth的中文文档很少, 英文的主要是官方文档, 也由于版本更迭太快不甚明朗. 于是打算写一篇关于sawtooth的上手文档, 也算是梳理一下自己的理解吧. 由于并未深入理解, 如果错漏烦请指出.*

## 版本信息
此篇文章基于Sawtooth版本1.0, 截止文章发布之日Sawtooth最新版为1.1.4, 使用到sawtooth的js-sdk版本1.0, 以及zeromq v5.1. 

## Sawtooth简单介绍
sawtooth是Intel开发的一个联盟链框架, 并且是Hyperledger区块链开源项目的成员, 由Linux基金会主导并提供支持. Hyperledger中有另一个较为出名的框架为Hyperledger Fabric, 由IBM开发. ~~我感觉Fabric的生态做得比Sawtooth要好得多包括有Composer作为开发工具以及和AWS的合作等~~ Sawtooth的优势在于他的高度模块化, 包括共识算法, 智能合约等都可以作为模块进行插入或者替换. 在Sawtooth中的智能合约被称为Transaction Processor(TP), 开发者可以使用自己喜欢的语言(Go, JavaScript, Python, C++, Java等), 来开发业务逻辑, 并独立于核心系统. 
关于Sawtooth内部结构以及原理不在这篇文章过多阐述, 详情可以访问[Sawtooth官方文档](https://sawtooth.hyperledger.org/docs/core/releases/latest).  
这里放一张图大致反应内部工作流程,  
![](https://sawtooth.hyperledger.org/docs/core/releases/latest/_images/arch-sawtooth-overview.svg)  
其中Client端我们会使用Sawtooth提供的RESTful API进行交互, Transaction Processing端就是我们要开发的智能合约TP, 中间部分则为Sawtooth Core System, 会将Client端获得的batch(包括txn地址前六位表示的namespace, txn具体参数以及client端的signature)根据txn地址前六位的namespace来判断这是属于哪个TP的txn, 并分发到具体的TP中进行处理. client的signature则用来判断是否为有效的成员, 如果是permissioned blockchain.  
那么下面就来说一下怎么样写一个TP以及怎样提交相应txn.  

## 开发Transaction Processor
在这里开发TP选用了JavaScript的SDK, ~~大概原因是Python会出现版本问题, Go和Rust又不太熟~~, 因此nodeJS是前置要求, 我用的版本是10, 暂时没发现什么问题.  
首先知道Sawtooth的validator的地址, 例如我是本地的4004, 然后就, 连上它~  
``` JavaScript
const { TransactionProcessor } = require('sawtooth-sdk/processor')
const { Handler } = require('./handler')

const VALIDATOR_URL = 'tcp://localhost:4004'

// Initialize Transaction Processor
const tp = new TransactionProcessor(VALIDATOR_URL)
tp.addHandler(new Handler())
tp.start()
```
没什么好细说的, 比较格式化, 这里用到的handler是自己写的逻辑, 具体处理txn用,  
handler是基于TransactionHandler的子类,  
``` JavaScript
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')
class Handler extends TransactionHandler {
    constructor () {
        super(FAMILY, [VERSION], [PREFIX])
    }

    apply (txn, ctx) {
        // Parse the transaction header and payload
        const header = txn.header
        const signer = header.signerPublicKey
        const { action, agreement } = cbor.decode(txn.payload)

        // Call the appropriate function based on the payload's action
        if (action === 'create') {            
            return createAgreement(agreement, signer, ctx)
        }
        return Promise.resolve().then(() => {
            throw new InvalidTransaction(
                'Action must be "create"'
            )
        })
    }
}
```
FAMILY, VERSION, PREFIX都是自定义的数据, 用来鉴别不同的TP.  这里txn的内容用到了cbor加密, 解密出来的两部分action和agreement, 就是我TP中的业务逻辑要用到的, action用来判断case, 多种不同情况要处理的时候需要用到, 这里就只有一个create. agreement则是要'create'的内容, 这里是写进block的具体数据, 含buyer, seller和item.  
``` JavaScript
// Encoding helpers and constants
const getAddress = (key, length = 64) => {
    return createHash('sha512').update(key).digest('hex').slice(0, length)
}
const getAgreementAddress = name => PREFIX + '00' + getAddress(JSON.stringify(name), 62)
const encode = obj => Buffer.from(JSON.stringify(obj, Object.keys(obj).sort()))

const PREFIX = getAddress(FAMILY, 6)

// Add a new agreement to state
const createAgreement = (agreement, signer, ctx) => {
    const address = getAgreementAddress(agreement)

    return ctx.getState([address], TIMEOUT)
        .then(entries => {
            const entry = entries[address]
            if (entry && entry.length > 0) {
                throw new InvalidTransaction('Duplicate agreement')
            }
            // event
            ctx.addEvent(
                'agreement/create',
                [['name', 'agreement'],
                    ['address', address], 
                    ['buyer name', agreement.BuyerName], 
                    ['seller name', agreement.SellerName], 
                    ['house id', agreement.HouseID], 
                    ['creator', signer]],
                null)

            return ctx.setState({
                [address]: encode({ ...agreement, signer })
            }, TIMEOUT)
        })
}
```
这里getAddress其实就是一个hash的过程, 得到一个70位长度的地址, 作为sawtooth中存储的地址, 然后前面用PREFIX来表明namespace. 同时如果成功create, 相当于在entries中写入一条新的数据, 以后会发布一条event, 会在后面用到. 

## 提交txn
提交txn的过程比较复杂, 涉及到单个txn的加header加签名, 然后把多个或者一个txn组成的batch加header加签名, 最后通过RESTful API发送给validator, 这里RESTful API的地址是本地的8008, validator收到后就会根据address分发到不同的TP来进行处理.  
``` JavaScript
const { createHash } = require('crypto')
const request = require('request')
const protobuf = require('sawtooth-sdk/protobuf')
const {
    createContext,
    CryptoFactory,
} = require('sawtooth-sdk/signing')
const cbor = require('cbor')

const context = createContext('secp256k1')
const privateKey = context.newRandomPrivateKey()
const signer = new CryptoFactory(context).newSigner(privateKey)

// Encoding helpers and constants
const getAddress = (key, length = 64) => {
    return createHash('sha512').update(key).digest('hex').slice(0, length)
}
  
const FAMILY = 'somechain'
const PREFIX = getAddress(FAMILY, 6)
const VERSION = '1.0'
const API_URL = 'http://localhost:8008'
const payload = {
    action: 'create',
    agreement: {
        BuyerName: process.argv[2],
        SellerName: process.argv[3],
        HouseID: process.argv[4],
    }
}
const payloadBytes = cbor.encode(payload)

// create transaction header
const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    inputs: [PREFIX],
    outputs: [PREFIX],
    familyName: FAMILY,
    familyVersion: VERSION,
    signerPublicKey: signer.getPublicKey().asHex(),
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: createHash('sha512').update(payloadBytes).digest('hex'),
}).finish()

// create the transaction
const transactionSignature = signer.sign(transactionHeaderBytes)

const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: transactionSignature,
    payload: payloadBytes,
})

const transactions = [transaction]

// create batch header
const batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: transactions.map((txn) => txn.headerSignature),
}).finish()

// create the batch
const batchSignature = signer.sign(batchHeaderBytes)

const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: batchSignature,
    transactions: transactions
})

// encode the batch in batch list
const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
}).finish()

request.post({
    url: `${API_URL}/batches?wait`,
    headers: {'Content-Type': 'application/octet-stream'},
    body: batchListBytes,
}, (err, res, body) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res.statusCode)
        console.log(body)
    }
})
```
由于没有验证签名, 新创建的公私钥可以直接拿来使用, 在这里大量使用到了protobuf, 想详细了解的同学可以直接进入js-sdk的源码里面看protobuf的数据结构, 具体路径为sawtooth-sdk/protobuf, 了解以后这其实也是一个格式化的流程.  

## 加入Event Listener
Event是Sawtooth在1.0版本中新加入的功能, 可以使用例如ZeroMQ来进行事件监听. 这里使用了ZeroMQ的js库, 连接localhost的4004端口, 即validator, 
``` JavaScript
const zmq = require('zeromq')
const { EventSubscription, 
    EventFilter, 
    ClientEventsSubscribeRequest, 
    ClientEventsSubscribeResponse,
    Message,
    EventList, 
} = require('sawtooth-sdk/protobuf')

// Filter to name matching 'agreement'
const filter = EventFilter.create({
    key: "name",
    matchString: "agreement",
    filterType: EventFilter.FilterType.SIMPLE_ANY,
})

const subscription = EventSubscription.create({
    eventType: "agreement/create",
    filters: [
        filter
    ]
})

// Setup a connection to the validator
let socket = zmq.socket('dealer')
socket.connect('tcp://localhost:4004')

// Construct the request
let request = ClientEventsSubscribeRequest.encode({
    subscriptions: [subscription]
}).finish()

// Construct the message wrapper
let correlation_id = "123456789" 
let msg = Message.create({
    correlationId: correlation_id,
    messageType: Message.MessageType.CLIENT_EVENTS_SUBSCRIBE_REQUEST,
    content: request
})

let msg_buffer = Message.encode(msg).finish()
// Send the request
socket.send([msg_buffer])

// Receive the response
socket.on('message', (res) => {
    // Parse the message wrapper
    let msg = Message.decode(res)
})
```
这里会创建一个dealer类型的socket, 从validator获得events. EventSubscription则是用来筛选需要的event, 例如这里简单匹配了所有名字为agreement的事件, 还可以做更复杂的正则匹配, 来匹配地址或者名字. 这里也有一些需要进入protobuf才能了解的数据结构.  

## Sawtooth Core System
关于Sawtooth的核心系统, 可以简单的建立一个最基本的环境, 作为测试用途, 包括一个validator, 一个restful api, 以及一个setting和一个shell. 具体的yaml配置可以[参考这里](https://github.com/delventhalz/transfer-chain-js/blob/master/docker-compose.yaml). 

## 小结
写下来才发现, 其中并没有涵盖很多知识点, 我之前做的更多的可能是官方源码例如sdk的阅读理解, 然后再实验过后发现其中很多东西就是要这样实现, 所以也算是官方文档的具体落实和补充吧. 不过代码本身就是一种语言, 分享一下我自己的实现代码, 希望能有所帮助吧. 🐱  

## 参考链接
* [https://sawtooth.hyperledger.org/docs/core/releases/latest/](https://sawtooth.hyperledger.org/docs/core/releases/latest/)
* [https://github.com/delventhalz/transfer-chain-js](https://github.com/delventhalz/transfer-chain-js)