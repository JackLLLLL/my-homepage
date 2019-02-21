import React from 'react';

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
        </header>
    )
}

export default Header;