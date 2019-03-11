import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Tooltip } from 'antd';

const Header = ({ title }) => {
    return (
        <header className="header" style={{ 
            width: '100%',
            flex: '0 0 auto',
            display: 'flex',
            justifyContent: 'center',
        }}>
            <span style={{ 
                    fontSize: '8vmin', 
                    color: 'white',
                    fontFamily: 'Righteous',
                }}>
                { title }
            </span>
            
            <div className="menu" style={{ position: 'absolute', right: '5vw' }}>
                <Link key="home" to='/'>
                    <Tooltip title='Homepage'>
                        <Icon type="home" style={{ color: 'white', fontSize: '5vmin', marginTop: '10vh', marginRight: '5vw' }} />
                    </Tooltip>
                </Link>
                <Link key="resume" to='/resume'>
                    <Tooltip title='Resume'>
                        <Icon type="solution" style={{ color: 'white', fontSize: '5vmin', marginTop: '10vh', marginRight: '5vw' }} />
                    </Tooltip>
                </Link>
                <a key="blog" href='https://www.jacklllll.xyz/blog'>
                    <Tooltip title='Blog'>
                        <Icon type="bulb" style={{ color: 'white', fontSize: '5vmin', marginTop: '10vh', marginRight: '5vw' }} />
                    </Tooltip>
                </a>
            </div>
            
        </header>
    )
}

export default Header;