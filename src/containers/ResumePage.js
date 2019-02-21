import React, { Component } from 'react';
import { Icon, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { Document, Page, pdfjs } from "react-pdf";
import Header from '../components/Header';
import Background from '../components/Background';
import Footer from '../components/Footer';
import MouseFollower from '../components/MouseFollower';
import img from '../images/background.jpg';
import cursor from '../images/planet.ico';
import resume from '../images/resume.pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


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
            <div className="App" onMouseMove={this.onMouseMove} onTouchMove={this.onMouseMove} style={{ cursor: `url("${cursor}"), auto`, }}>
                <Background img={img} />
                <Header title={`JackLLLLL's Resume`} />
                <MouseFollower mouseX={this.state.mouseX} mouseY={this.state.mouseY}/>
    
                <div className="App-content" >
                    <Link key="home" to='/'>
                        <Tooltip title='Go back homepage'>
                            <Icon type="home" style={{ color: 'white', fontSize: '5vmin', position: 'fixed', right: '4vw', top: '4vw' }} />
                        </Tooltip>
                    </Link>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                        <Document file={resume} onLoadSuccess={this.onDocumentLoadSuccess}  >
                            <Page pageNumber={1} height={window.innerHeight * 0.75} />
                        </Document>
                        <Document file={resume} onLoadSuccess={this.onDocumentLoadSuccess} >
                            <Page pageNumber={2} height={window.innerHeight * 0.75} />
                        </Document>
                    </div>
                </div>
    
                <Footer/>
            </div>
        )
    }
}

export default ResumePage;