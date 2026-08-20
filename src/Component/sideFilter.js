import React from "react";
import ReactDOM from "react-dom/client";  
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styleComp/sideFilter.css';


export default class SideFilter extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return(
            <div className="col-3 Filter">
                <div className="Ratings fill">
                    <h5>Ratings:</h5>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="stars" id="4_stars" value="4_stars"></input>
                        <label className="form-check-label" for="exampleRadios2">
                            <span className="row jsutify-content-end">
                                <i className="col-1 lni lni-star-fat"></i>
                                <i className="col-1 lni lni-star-fat"></i>
                                <i className="col-1 lni lni-star-fat"></i>
                                <i className="col-1 lni lni-star-fat"></i>
                                <sub className="col-5">4.0 & Up</sub>
                            </span>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="stars" id="4_stars" value="4_stars"></input>
                        <label className="form-check-label" for="exampleRadios2">
                            <span className="row jsutify-content-end">
                                <i className="col-1 lni lni-star-fat"></i>
                                <i className="col-1 lni lni-star-fat"></i>
                                <i className="col-1 lni lni-star-fat"></i>
                                <sub className="col-5">3.0 & Up</sub>
                            </span>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="stars" id="4_stars" value="4_stars"></input>
                        <label className="form-check-label" for="exampleRadios2">
                            <span className="row jsutify-content-end">
                                <i className="col-1 lni lni-star-fat"></i>
                                <i className="col-1 lni lni-star-fat"></i>
                                <sub className="col-7">2.0 & Up</sub>
                            </span>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="stars" id="4_stars" value="4_stars"></input>
                        <label className="form-check-label" for="exampleRadios2">
                            <span className="row jsutify-content-end">
                                <i className="col-1 lni lni-star-fat"></i>
                                <sub className="col-8">1.0 & Up</sub>
                            </span>
                        </label>
                    </div>
                </div>
                <div className="video_duration fill">
                    <h5>Video Durarion:</h5>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="0" id="flexCheckDefault"/>
                        <label className="form-check-label" for="flexCheckDefault">
                            0-1 hour <sub>(0)</sub>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="2" id="flexCheckDefault"/>
                        <label className="form-check-label" for="flexCheckDefault">
                            2-3 hour <sub>(0)</sub>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="4" id="flexCheckDefault"/>
                        <label className="form-check-label" for="flexCheckDefault">
                            4-6 hour <sub>(0)</sub>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="6" id="flexCheckDefault"/>
                        <label className="form-check-label" for="flexCheckDefault">
                            6+ hour <sub>(0)</sub>
                        </label>
                    </div>
                </div>
                <div className="topics fill">
                    <h5>Topics:</h5>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="Web_Dev" id="ToicDefalt"/>
                        <label className="form-check-label" for="flexCheckDefault">
                            Web Development <sub>(0)</sub>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="Cloud_Comp" id="ToicDefalt"/>
                        <label className="form-check-label" for="flexCheckDefault">
                            Cloud Computing<sub>(0)</sub>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="Game_Dev" id="ToicDefalt"/>
                        <label className="form-check-label" for="flexCheckDefault">
                            Game Development<sub>(0)</sub>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="3D" id="ToicDefalt"/>
                        <label className="form-check-label" for="flexCheckDefault">
                            3D<sub>(0)</sub>
                        </label>
                    </div>
                </div>
                <div className="subCat fill">
                    <h5>Subcategory:</h5>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="Web_Dev" id="subTopic"/>
                        <label className="form-check-label" for="flexCheckDefault">
                            Javascript<sub>(0)</sub>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="Cloud_Comp" id="subTopic"/>
                        <label className="form-check-label" for="flexCheckDefault">
                           React<sub>(0)</sub>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="Game_Dev" id="subTopic"/>
                        <label className="form-check-label" for="flexCheckDefault">
                            Unity<sub>(0)</sub>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="3D" id="subTopic"/>
                        <label className="form-check-label" for="flexCheckDefault">
                            Blender<sub>(0)</sub>
                        </label>
                    </div>
                </div>
                <div className="levels fill">
                    <h5>Levels:</h5>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="Web_Dev" id="level"/>
                        <label className="form-check-label" for="flexCheckDefault">
                            All Levels<sub>(0)</sub>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="Cloud_Comp" id="level"/>
                        <label className="form-check-label" for="flexCheckDefault">
                           Beginner<sub>(0)</sub>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="Game_Dev" id="level"/>
                        <label className="form-check-label" for="flexCheckDefault">
                            Intermediate<sub>(0)</sub>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="3D" id="level"/>
                        <label className="form-check-label" for="flexCheckDefault">
                            Expert<sub>(0)</sub>
                        </label>
                    </div>
                </div>
                <div className="price fill">
                    <h5>Price:</h5>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="Web_Dev" id="price"/>
                        <label className="form-check-label" for="flexCheckDefault">
                            Free<sub>(0)</sub>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="Cloud_Comp" id="price"/>
                        <label className="form-check-label" for="flexCheckDefault">
                           Paid<sub>(0)</sub>
                        </label>
                    </div>
                </div>
            </div>
        )
    }

}