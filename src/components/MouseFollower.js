import React, { Component } from 'react';
import Rocket from '../images/rocket.svg';


class MouseFollower extends Component {
    constructor () {
        super();

        this.state = {
            degree: Math.PI*2,
            radius: 100
        }
    }

    componentDidMount () {
        this.interval = setInterval(() => {
            this.setState({
                degree: this.state.degree < 0 ? this.state.degree + 2 * Math.PI - Math.PI / 50 : this.state.degree - Math.PI / 50,
            })
        }, 20);
    }

    componentWillUnmount () {
        clearInterval(this.interval);
    }

    getX = () => {
        return this.props.mouseX + Math.cos(this.state.degree) * this.state.radius;
    }

    getY = () => {
        return this.props.mouseY + Math.sin(this.state.degree) * this.state.radius;
    }

    render () {
        return (
            <img alt="follower" src={Rocket} style={{ position: 'fixed', top: this.getY(), left: this.getX(), transform: `rotate(${this.state.degree*180/Math.PI-45}deg)` }} />
        )
    }
}

export default MouseFollower;