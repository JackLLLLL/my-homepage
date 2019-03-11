import React, { Component } from 'react';
import { randomColor } from 'randomcolor';
import Header from '../components/Header';
import Background from '../components/Background';
import Footer from '../components/Footer';
import MouseFollower from '../components/MouseFollower';
import HoverFont from '../components/HoverFont';
import img from '../images/background.jpg';
import cursor from '../images/planet.ico';
import avator from '../images/avator.gif';


class HomePage extends Component {
    constructor () {
        super();

        this.state = {
            mouseX: -100,
            mouseY: -100,
        }

        this.intro = ['Welcome to my homepage.'];
        this.about = ['About Me', 'Jiakang Liang 梁嘉康', 'Computer Science Bachelor of', 'Zhejiang University', 'Simon Frazer University', 'Interests:', 'Blockchain', 'Computer Vision', 'Travel', 'Dota2', 'and All New Stuff']
    }

    onMouseMove = (e) => {
        this.setState({
            mouseX: e.clientX,
            mouseY: e.clientY,
        })
    }

    renderWords = (words) => {
        const result = [];
        let i=0;

        words.forEach(element => {
            result.push(
                <HoverFont key={i++ } nextColor={randomColor({luminosity: 'bright'})}>
                    {element}
                </HoverFont>
            )
        });

        return result;
    }
    
    render () {
        return (
            <div className="App" onMouseMove={this.onMouseMove} onTouchMove={this.onMouseMove} style={{ cursor: `url("${cursor}"), auto`, }}>
                <Background img={img} />
                <Header title={`JackLLLLL's Homepage`} />
                <MouseFollower mouseX={this.state.mouseX} mouseY={this.state.mouseY}/>
    
                <div className="App-content" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: '10vh' }}>

                    <div style={{ 
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        flexGrow: 0,
                        margin: '10vh 5vw',
                        fontSize: '10vmin'
                     }}>
                        { this.renderWords(this.intro) }
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '2.5vmin' }}>
                        <img alt='avator' src={avator} style={{ width: '40vmin' }} /> 
                        { this.renderWords(this.about) }
                    </div> 
                </div>
    
                <Footer/>
            </div>
        )
    }
}

export default HomePage;