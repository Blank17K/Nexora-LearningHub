import React from "react";
import ReactDOM from "react-dom/client";  
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styleComp/about.css';


export default class AboutUs extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="aboutUsSec">
                <div className ="row aboutIntro">
                    <div className="col-6 aboutText">
                        <h1>We think you learn a craft by <span>making things</span>, not by watching someone else make them.</h1>
                        <p>Nexora started as a study group of four people who were tired of finishing courses with nothing to show. Every course here ends with something on your screen that you built.</p>
                    </div>
                    <img className="col-6" alt="About Us" src="./media/imgs/about1.svg"/>
                </div>
                <div className ="row aboutIntro">
                    <img className="col-6" alt="About Us" src="./media/imgs/about2.svg"/>
                    <div className="col-6 aboutText">
                        <h5>Two years ago, I had no experience in Web Development.</h5>
                        <p>"Today, I'm designing products used by thousands of people every day. Nexora gave me the confidence to believe I could build a new career.”</p>
                        <p className="aboutEngTxt">Owen Julies - Full Stack Developer & Nexora teacher</p>
                        <div className="row justify-content-end">
                            <button className="btn owenStr me-3 btnPos">Watch Owens Story</button>
                        </div>
                    </div>
                </div>
                <div className="bannerAbt">
                    <img alt="banner" src="./media/imgs/banner3.svg"/>
                </div>
                <div className="whatWeHold">
                    <h3>What we hold to:</h3>
                    <div className="hold2">
                        <img alt="banner" src="./media/imgs/banner4.svg"/>
                    </div>
                </div>
                <div className="theTeam row justify-content-center">
                    <div className="col teamObj align-self-center">
                        <img alt="Team Member" src="./media/imgs/team1.svg"/>
                        <h6>Lerato M</h6>
                        <p>Role Placeholder</p>
                    </div>
                    <div className="col teamObj align-self-center">
                        <img alt="Team Member" src="./media/imgs/team1.svg"/>
                        <h6>Njabulo N</h6>
                        <p>Role Placeholder</p>
                    </div>
                    <div className="col teamObj align-self-center">
                        <img alt="Team Member" src="./media/imgs/team1.svg"/>
                        <h6>Thabo S</h6>
                        <p>Role Placeholder</p>
                    </div>
                    <div className="col teamObj align-self-center">
                        <img alt="Team Member" src="./media/imgs/team1.svg"/>
                        <h6>Boikanyo T</h6>
                        <p>Role Placeholder</p>
                    </div>
                    <div className="col teamObj align-self-center">
                        <img alt="Team Member" src="./media/imgs/team1.svg"/>
                        <h6>Tadi C</h6>
                        <p>Role Placeholder</p>
                    </div>
                </div>
                <div className="freeCourse row">
                    <div className="txtCourse col-6">
                        <h3>Start with one free course.</h3>
                        <p>Create an account in under thirty seconds.</p>
                    </div>
                    <div className="btnCourse col-6 row justify-content-end">
                        <button className="btn btnPos">Get Started for free</button>
                    </div>
                </div>
                <div className="row theMovement">
                    <h3>Be part of a movement of learners changing their lives every day.</h3>
                    <div className="card col">
                        <div className=" card-body">
                            <p>Nexora gives you the ability to be persistent. I learned exactly what I needed to know in the real world. It helped me sell myself to get a new role.</p>
                            <div className=" row">
                                <img className="col-3" alt="user" src="./media/imgs/engLogo.svg"/>
                                <div className="col-9 txtCardMove">
                                    <p><b>Thabo Syrup</b></p>
                                    <p><sub><i>Prompt engineer at UP</i></sub></p>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="card col ms-3 me-3">
                        <div className=" card-body">
                            <p>Nexora gives you the ability to be persistent. I learned exactly what I needed to know in the real world. It helped me sell myself to get a new role.</p>
                            <div className=" row">
                                <img className="col-3" alt="user" src="./media/imgs/engLogo.svg"/>
                                <div className="col-9 txtCardMove">
                                    <p><b>Thabo Syrup</b></p>
                                    <p><sub><i>Prompt engineer at UP</i></sub></p>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="card col">
                        <div className=" card-body">
                            <p>Nexora gives you the ability to be persistent. I learned exactly what I needed to know in the real world. It helped me sell myself to get a new role.</p>
                            <div className=" row">
                                <img className="col-3" alt="user" src="./media/imgs/engLogo.svg"/>
                                <div className="col-9 txtCardMove">
                                    <p><b>Thabo Syrup</b></p>
                                    <p><sub><i>Prompt engineer at UP</i></sub></p>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="vision row justify-content-center">
                    <div className="text col">
                        <h6>Our Mission</h6>
                        <p>Our mission is to empower people through education by providing accessible, practical, and engaging online learning experiences that help learners achieve their personal and professional goals.</p>
                    </div>
                    <div className="text col">
                        <h6>Our Vision</h6>
                        <p>To become one of the world’s most trusted learning platforms where anyone can discover new passions, develop valuable skills, and build a brighter future through continuous learning.</p>
                    </div>
                </div>
                <div className="banner">
                    <img alt="banner" src="./media/imgs/banner1.svg"/>
                </div>
            </div>
        );
    }
}