import React from 'react';

const Background = ({ img }) => {
    return (
        <div className="background" >
            <img alt='background' src={img} style={{ 
                position: 'fixed',
                top: 0,
                zIndex: -1,
                // height: '100vh',
                backgroundSize: 'cover',
            }} />
        </div>  
    )
}

export default Background;