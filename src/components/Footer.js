import React from 'react';
import { Popover, Icon, Tooltip } from 'antd';
import qrcode from '../images/qrcode.png';
import wechat from '../images/wechat.jpg';


const Footer = () => {
    return (
        <footer className="footer" style={{ 
            width: '100%',
            flex: '0 0 auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <span style={{ 
                    fontSize: '3vmin', 
                    color: 'white',
                    fontFamily: 'Righteous',
                    marginRight: '2vw',
                }}>
                Designed By JackLLLLL@2019
            </span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '20vmin' }}>
                <Popover placement="top" arrowPointAtCenter content={<img alt="alipay" src={qrcode} style={{ height: '40vh' }}/>}>
                    <Icon type="alipay" style={{ color: 'white', fontSize: '3vmin' }}/>
                </Popover> 
                <Popover placement="top" arrowPointAtCenter content={<img alt="wechat" src={wechat} style={{ height: '40vh' }}/>}>
                    <Icon type="wechat" style={{ color: 'white', fontSize: '3vmin' }}/>
                </Popover>     
                <Tooltip placement="top" arrowPointAtCenter title='Click to my Github'>
                    <a href='https://github.com/JackLLLLL'>
                        <Icon type="github" style={{ color: 'white', fontSize: '3vmin' }}/>
                    </a>
                </Tooltip>
                <Tooltip placement="top" arrowPointAtCenter title='Click to my Linkedin'>
                    <a href='https://www.linkedin.com/in/jiakang-liang-0044b1125/'>
                        <Icon type="linkedin" style={{ color: 'white', fontSize: '3vmin' }}/>
                    </a>
                </Tooltip>
                <Tooltip placement="top" arrowPointAtCenter title='Click to email me'>
                    <a href='mailto:bunnytooth99@gmail.com'>
                        <Icon type="mail" style={{ color: 'white', fontSize: '3vmin' }}/>
                    </a>
                </Tooltip>  
            </div>
        </footer>
    )
}

export default Footer;