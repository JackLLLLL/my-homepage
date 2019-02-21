import React, { Component } from 'react';


class HoverFont extends Component {
    constructor () {
        super();

        this.state = {
            fontStyle: {
                color: 'white',
            }
        }
    }

    onMouseEnter = () => {
        let fontStyle = {
            color: this.props.nextColor,
        }
        this.setState({
            fontStyle: fontStyle,
        })
    }

    onMouseLeave = () => {
        let fontStyle = {
            color: 'white',
            transition: 'color 2s linear'
        }
        this.setState({
            fontStyle: fontStyle,
        })
    }

    render () {
        return (
            <span style={{ ... this.props.style, ... this.state.fontStyle, fontFamily: 'Righteous', width: 'fit-content', height: 'fit-content' }} 
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                {/* {this.props.content} */}
                { this.props.children }
            </span>
        )
    }
}

export default HoverFont;