import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import HomePage from './containers/HomePage';
import ResumePage from './containers/ResumePage';
// import BlogPage from './containers/BlogPage';


class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/resume" component={ResumePage} key="resumepage"/>
                    {/* <Route exact path="/blog" component={BlogPage} key="blogpage"/> */}
                    <Route path="/" component={HomePage} key="homepage"/>
                </Switch>
            </BrowserRouter> 
        )
    }
}

export default App;
