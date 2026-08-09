import React from "react";
import ReactDOM from "react-dom/client";  
import 'bootstrap/dist/css/bootstrap.min.css';

export class Splash extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="splashSec">
                <div className="intro row">
                    <div className="text col-6">
                        <h1>Learn by building things that work.</h1>
                        <p>Short, practical courses in design, code and 3D — taught by people who ship. Start free, finish something real.</p>
                        <button className="btn">Get Started for free</button>
                        <button className="btn">Browse Categories <i className="lni lni-arrow-right"></i></button>
                    </div>
                    <div className="img col-6"></div>
                </div>
                <div className="banner">
                    <img alt="banner"/>
                </div>
                <div className="popularClass">
                    <h3>Popular right now</h3>
                    <div className="popCards row">
                        <div className="card col-4">
                            <img src=".." className="card-img-top" alt="class picture"/>
                            <div className="card-body">
                                <div className="courseCat row">
                                    <h6 className="card-subtitle mb-2 text-muted col-4">Bestseller</h6>
                                    <h6 className="card-subtitle mb-2 text-muted col-4">Beginner</h6>
                                </div>
                                <h5 className="card-title">RIZZ Masterclass 101</h5>
                                <p className="card-text">Thabo Seripe</p>
                                
                            </div>
                            <div className="row bottomText card-footer text-muted">
                                <p className="col-9"><b>1.8</b> (1 204)</p>
                                <p className="col-3">R3.50</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="banner">
                    <img alt="banner"/>
                </div>
                <div className="row theMovement">
                    <h3>Be part of a movement of learners changing their lives every day.</h3>
                    <div className="card col-4">
                        <div className=" card-body">
                            <p>Nexora gives you the ability to be persistent. I learned exactly what I needed to know in the real world. It helped me sell myself to get a new role.</p>
                            <div className=" row">
                                <img className="col-4" alt="user"/>
                                <div className="col-8">
                                    <p><b>Thabo Syrup</b></p>
                                    <p><sub><i>Prompt engineer at UP</i></sub></p>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row freeTrail">
                    <div className="col-6">
                        <img alt="freeTrail"/>
                    </div>
                    <center className="col-6">
                        <h2>Start with one free course.</h2>
                        <p>Create an account in under thirty seconds.</p>
                        <button className="btn">Get Started for free</button>
                    </center>
                </div>
            </div>
        );
    }
}