---
title: 服务器配置静态网页时...
date: 2019-03-11 11:59:48
tags: nginx, pm2, serve, static files
---

把hexo生成的html和相关资源scp到cloud server，准备部署静态页面后发生了些问题， 尝试了三种方法nginx， pm2-serve, 还有~~最后成功的~~serve

## pm2-serve
这是最早使用的方法，也在这里耽误了很久。本来想直接通过pm2-serve静态文件夹，然后nginx代理到本地端口的方式，却发现只能访问blog首页。  
在nginx配置里通过'location ^~ /blog/'的方式匹配blog开头的所有路径，  
但在访问jacklllll.xyz/blog/archives/的时候却显示‘EISDIR‘，字面意思好像是访问到了文件夹？于是尝试了一下在url后加上index.html，终于可以成功访问了  
第一反应是想在每条匹配到的url后通过nginx rewrite添加index.html，但查了一会资料还是没什么思绪，于是尝试着换种方法 🙄  

## nginx
看了下网上很多人都直接用nginx root或者alias来读取static files，于是尝试了一下，  
但发现nginx会报错，'cannot start high performance website and proxy server at the same time ...'，大概就是这个意思，不太记得具体的错误信息了  
这条路大概也是走不通了，我在服务器上还跑了homepage，通过nginx listen 443然后proxy，于是会端口冲突，而且不太喜欢把两个东西一个放到pm2一个放到nginx，可能是强迫症吧hhh，也就没有太多尝试  

## npm install serve
serve是一个npm上的包，之前在用create-react-app时用过，后来发现能用pm2-serve代替，现在又回到了这里  
直接serve，nginx还是匹配blog开头的路径，一次成功！  
这么看来serve和pm2-serve还是不太一样，serve会自动找文件夹下面的index.html  
具体为什么就以后再看吧，  
hexo的blog成功建好了～ 🤪

### 2019-03-11 Update
结果发现serve还是没能完美解决，后来看pm2的issues，发现了[相关问题](https://github.com/Unitech/pm2/issues/2941)，于是决定自己改代码解决，创了PR
``` JavaScript
if (file === '/' || file === '' || file.endsWith('/')) {
    file = file === '' ? '/index.html' : file + 'index.html';
}
```

### 2019-03-21 Update
修改了PM2的代码，将404页面导向/404/index.html而不是原来的/404.html  
``` JavaScript
fs.readFile(options.path + '/404/index.html', function (err, content) {
    content = err ? '404 Not Found' : content;
    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end(content, 'utf-8');
});
```
以后不更新PM2的话应该暂时也没问题
