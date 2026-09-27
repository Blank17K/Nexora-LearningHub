import PlayerHeader from "./playerHeader.js";
import '../styleComp/coursePlayer.css';
import player from '../Assets/Images/player.png';
import coursesInfo from "../Assets/scripts/courseList.js";
import { useState } from "react";
import cert from '../Assets/Images/certificate.png'
function CoursePlayer(){
    const [openModule, setOpenModule] = useState(0);
    const [getCert, setCert] = useState(false);
    const playerInfo = ()=>{
        
        
        return (
            <>
                <div><img className="player" src={player}/></div>
                <div>
                    <p>Module 1 · Lesson 3</p>
                    <h3>Props & composition</h3>
                    <p>Pass data into a component and compose small pieces into a screen. By the end of this lesson your task list renders from an array instead of hard-coded markup.</p>
                    <div className="row">
                        <button className="btn btnSol col">Lesson notes</button>
                        <button className="btn btnSol col ms-2 me-2">Starter Files</button>
                        <button className="btn btnSol col">Ask a question</button>
                        <div className="col-3"></div>
                    </div>
                    <div className="mb-4"></div>
                    <hr/>
                    <div className="row mb-4">
                        <button className="btn btnSol col me-2">Previous</button>
                        <button className="btn btnSol col ">Clear Search</button>
                        <p className="col-6 toR">{`Next: Rendering Lists`}</p>
                    </div>
                </div>

            </>
        );
    }
    const sideNavPlayer = ()=>{
        const course = coursesInfo[0]; 
        return (<>{course.courseModules.map((mod, i) => {
              const isOpen = openModule === i;
              return (
                <div className={`CourseModuleP`} key={i}>
                  <button
                    className="CourseModuleHeader"
                    onClick={() => setOpenModule(isOpen ? null : i)}
                  >
                    <span>
                      <span className={`Arrow ${isOpen ? "open" : ""}`}>▾</span>{" "}
                      {i + 1} · {mod.title}
                    </span>
                    <span>
                      {mod.lessons} lessons · {mod.duration}
                    </span>
                  </button>

                  {isOpen && mod.lessonList.length > 0 && (
                    <ul className="CourseModuleLessons">
                      {mod.lessonList.map((lesson, j) => (
                        <li key={j}>
                          <span>{lesson.name}</span>
                          <span>{lesson.time}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}</>)
    }
    const certificate = ()=>{
        setCert(true);
    }
    const showCert = ()=>{
        return (
            <img alt=""certificate src={cert} className={`imgCert ${getCert?'':'slideoutIn'}`}/>
        )
    }
    return(
        <div className="">
            <PlayerHeader/>
            <div className={`row playerHolder checkoutBack ${getCert?'changeBack':''}`}>
                {showCert()}
                <div className={`col-8 playerInfo ${getCert?'slideR':''}`}>
                    {playerInfo()}
                </div>
                <div className={`col playerNav ${getCert?'slideL':''}`}>
                    {sideNavPlayer()}
                    <button className="btn courseComp mt-4" onClick={certificate}>Get Certificate</button>
                </div>
            </div>
        </div>
    )
}

export default CoursePlayer;