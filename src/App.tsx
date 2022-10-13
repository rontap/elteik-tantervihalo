import React, {useCallback, useEffect, useState} from 'react';
import logo from './logo.svg';
import './md-color-palette.css';
import './App.css';
import Model, {$, Subject, Topics} from "./model";
import SubjectRender from "./SubjectRender";
import SubjectDialog from "./SubjectDialog";
import ControlPanel from "./ControlPanel";

import 'bootstrap/dist/css/bootstrap.min.css';
import SemesterHeader from "./SemesterHeader";

const _mod = require('./static/ELTE_PTI_BSC_2018c.json');

const initModel = (modCore: any): Model => {
    const model = new Model(modCore.subjects);
    model.topics = new Topics(modCore.topics);
    return model;
}

const m = initModel(_mod);
// @ts-ignore
window._model = m;
console.log('model', m);

function App() {

    const [openSubject, setOpenSubject] = useState<null | Subject>(null);
    const [selectSubject, selectOpenSubject] = useState<null | Subject>(null);


    useEffect(function () {
        document.querySelectorAll('.item-on').forEach(htmlEl => {
            htmlEl.classList.remove('item-on')
        })
        if (selectSubject) {
            document.querySelectorAll('.req--' + selectSubject.code).forEach(htmlEl => {
                htmlEl.classList.add('item-on')
            })
        }
    }, [selectSubject]);

    const openSubjectDetails = (subject: Subject) => {
        setOpenSubject(subject);
        selectOpenSubject(subject);
    }
    const closeSubjectDetails = () => {
        setOpenSubject(null);
        selectOpenSubject(null);
    }
    console.log('openSubject', selectSubject);
    return (
        <div id={"AppCore"}>

            <ControlPanel/>

            <hr/>
            <SubjectDialog subject={openSubject} onClose={closeSubjectDetails}/>


            <div className={"semWrapper"}>
                {
                    [1, 2, 3, 4, 5, 6].map(el =>
                        <div className={"semDivider"}>

                            <SemesterHeader nth={el}/>

                            {el === 6 &&
                                <SubjectRender
                                    thesis
                                    model={m} subject={_mod.thesis}
                                    open={() => setOpenSubject(_mod.thesis)}
                                />
                            }

                            {m
                                .subjectsBySem(el, false, true)
                                .subjectFilterRendered()
                                .subjects.map(subject => <SubjectRender
                                    isFocus={subject.code === selectSubject?.code}
                                    model={m} subject={subject}
                                    open={() => openSubjectDetails(subject)}
                                    focus={() => selectOpenSubject(subject)}
                                    deFocus={() => selectOpenSubject(null)}

                                />)
                            }


                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default App;
