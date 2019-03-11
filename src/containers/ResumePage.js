import React, { Component } from 'react';
import { Carousel } from 'antd';
import Header from '../components/Header';
import Background from '../components/Background';
import Footer from '../components/Footer';
import img from '../images/background.jpg';
import cursor_rocket from '../images/rocket.svg';
import cursor_up from '../images/up.ico';
import cursor_down from '../images/down.ico';
import resume1 from '../images/Resume-1.jpg';
import resume2 from '../images/Resume-2.jpg';


class ResumePage extends Component {
    constructor () {
        super();

        this.state = {
            mouseX: -100,
            mouseY: -100,
            numPages: null,
            pageNumber: 1,
        }
    }

    onMouseMove = (e) => {
        this.setState({
            mouseX: e.clientX,
            mouseY: e.clientY,
        })
    }
    
    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    render () {
        return (
            <div className="App" onMouseMove={this.onMouseMove} onTouchMove={this.onMouseMove} style={{ cursor: `url("${cursor_rocket}"), auto`, }}>
                <Background img={img} />
                <Header title={`JackLLLLL's Resume`} />
    
                <div className="App-content" >
                    <Carousel vertical ref={ ref => this.carousel = ref } >
                        <div> <img alt='Resume-1' onClick={ () => this.carousel.next() } src={resume1} style={{ width: '80vw', margin: '10vh auto', cursor: `url("${cursor_down}"), auto` }}/> </div>
                        <div> <img alt='Resume-2' onClick={ () => this.carousel.prev() } src={resume2} style={{ width: '80vw', margin: '10vh auto', cursor: `url("${cursor_up}"), auto` }}/> </div>
                    </Carousel>
                </div>
    
                <Footer/>
            </div>
        )
    }
}

export default ResumePage;