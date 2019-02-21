import React, { Component } from 'react';
import { Carousel, Icon, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { randomColor } from 'randomcolor';
import Header from '../components/Header';
import Background from '../components/Background';
import Footer from '../components/Footer';
import MouseFollower from '../components/MouseFollower';
import HoverFont from '../components/HoverFont';
import img from '../images/background.jpg';
import cursor from '../images/planet.ico';


class HomePage extends Component {
    constructor () {
        super();

        this.state = {
            mouseX: -100,
            mouseY: -100,
        }

        this.introduction = `Hi_there!_🐱_Welcome_to_my_homepage._You_can_call_me_Jiakang_Liang,_or_just_Jack._
            _I'm_an_undergraduate_student_of_both_Simon_Fraser_University🇨🇦_and_Zhejiang_University🇨🇳._
            _And_I_am_going_to_work_soon._You_can_find_my_resume_on_the_top_right_corner_and_contact_me_by_methods_below._
            _My_website_is_still_under_🚧construction🚧._Blog_and_other_features_are_on_their_way🌠_..._
        `;
    }

    onMouseMove = (e) => {
        this.setState({
            mouseX: e.clientX,
            mouseY: e.clientY,
        })
    }

    renderIntro = () => {
        const intro = this.introduction.replace(/\s/g, ' ').split('_');
        const result = [];
        let i=0;

        intro.forEach(element => {
            if (element === '             ') {
                result.push(<br key={i++}/>)
            } else {
                result.push(
                    <HoverFont key={i++ } nextColor={randomColor({luminosity: 'bright'})} style={{ fontSize: '5vmin' }} >
                        {element} &nbsp;
                    </HoverFont>
                )
            }
        });

        return result;
    }
    
    render () {
        return (
            <div className="App" onMouseMove={this.onMouseMove} onTouchMove={this.onMouseMove} style={{ cursor: `url("${cursor}"), auto`, }}>
                <Background img={img} />
                <Header title={`JackLLLLL's Homepage`} />
                <MouseFollower mouseX={this.state.mouseX} mouseY={this.state.mouseY}/>
    
                <div className="App-content">
                    <Link key="resume" to='/resume'>
                        <Tooltip title='My Resume'>
                            <Icon type="solution" style={{ color: 'white', fontSize: '5vmin', position: 'fixed', right: '4vw', top: '10vh' }} />
                        </Tooltip>
                    </Link>

                    <div style={{ 
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        flexGrow: 0,
                        margin: '10vh 5vw',
                     }}>
                        { this.renderIntro() }
                    </div>
                   
                </div>
    
                <Footer/>
            </div>
        )
    }
}

export default HomePage;