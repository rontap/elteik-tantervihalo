import {Drawer, Subject} from "./model";
import {Badge} from "react-bootstrap";

const SubjectHandler: any = {};

SubjectHandler.creditParser = (subject: Subject): number => {
    if (!subject.credits) return -1;
    if (subject.credits.total) return subject.credits.total;

    //@ts-ignore
    return subject.credits.lecture + subject.credits.labor + subject.credits.practice + subject.credits.consultation;
}

SubjectHandler.creditComponent = (subject: Subject) => {
    const credits = SubjectHandler.creditParser(subject);

    return <abbr
        title={
            `LECTURE ${subject.credits.lecture}
LAB ${subject.credits.labor}
PRACTICE ${subject.credits.practice}
CONSULATTION ${subject.credits.consultation}
====
TOTAL ${credits}
    `}
    >
        {credits}
    </abbr>
}
SubjectHandler.heightDecider = (subject: Subject): string => {
    return "cr--" + SubjectHandler.creditParser(subject);
}

SubjectHandler.electiveDecider = (subject: Subject): boolean => {
    return subject.elective ?? true;
}

SubjectHandler.assessmentParser = (subject: Subject): string => {
    let out = "";
    if (subject.assessment.combined) out += "K";


    return out;
}
SubjectHandler.normaliseCode = (str: string): string => {
    return str.replace(/" "/g, "_");
}
export default function SubjectRender({subject,thesis, model, open, focus, deFocus, isFocus}: any) {
    //console.log(subject);
    subject._renderedOnce = false;
    const outerClass = [
        "subjectOuter",
        thesis && "item-thesis",
        isFocus && "item-focus",
        Drawer.getColorForModule(subject),
        SubjectHandler.heightDecider(subject),
        SubjectHandler.electiveDecider(subject) ? "elective" : "non-elective",
        subject.discontinued ? "subject-discontinued" : "",
        subject._everyReq?.map((req: string) => "req--" + SubjectHandler.normaliseCode(req)).join(" ")
    ]
    return <div
        className={outerClass.join(" ")}>
        <div className={`subjectInner`}
             onContextMenu={e => {
                 e.preventDefault()
                 focus()
             }}

             onClick={open}>
            <code>
                {subject.code || "Unkown Code"}
                {subject.discontinued ? " | Discontinued" : ""}

                {/*<span className={"assesmentType badgeContainer margin-left-5"}>*/}
                    {subject.credits.lecture > 0 &&
                        // <div className={"moduleFixin"} bg={"warning"}
                        //        title="Előadás számonkérés">
                            <span className={""}> | EA</span>
                        // </div>
                    }
                    {subject.credits.practice + subject.credits.labor > 0 &&
                        // <span className={"moduleFixin"} bg={"danger"}
                        //        title="Gyakorlat Számonkérés">
                            <span className={""}> | GY</span>
                        // </span>
                    }
                {/*</span>*/}
            </code>

            <br/>
            <div className={"subjectName"}>
                {subject.name || "Unknown Name"}

            </div>
            <span className={"subjectSmall"}>


                <span className={"credits"}>
                Kredit {SubjectHandler.creditComponent(subject)}
                </span>
                <br/><br/>
                <div className={"badgeContainer"}>
                    {
                        subject.module !== "Törzsanyag" && <Badge pill className={"moduleFixin"}
                                                                  title={subject.module}>
                            <span className={"limLength"}>{subject.module}</span>
                        </Badge>
                    }
                    {subject.topic &&
                        <Badge pill className={"topicFixin"} bg={model.topics.theme(subject)}>
                            {subject.topic}
                        </Badge>
                    }
                    {
                        SubjectHandler.electiveDecider(subject) &&
                        <Badge pill bg={"secondary"}>Választható</Badge>

                    }
                        </div>


                {SubjectHandler.electiveDecider(subject)}
                        </span>

        </div>
    </div>;

}