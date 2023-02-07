const _mod = require('./static/ELTE_PTI_BSC_2018c.json');


const $ = document.querySelectorAll;

enum Launch {
    EVERY,
    SPRING,
    AUTUMN,
    //TODO
}

interface Subject {
    module: string;
    code: string;
    name: string;
    launch: Launch;
    discontinued?: boolean;
    credits: {
        "lecture": number | null,
        "labor": number | null,
        "practice": number | null,
        "consultation": number | null,
        "total": number | null
    },
    assessment: {
        combined?: boolean,
        grade?: any
    };
    recommendedSemester: number[];
    requirements: []; // todo, also include strong/weak
    optional: boolean;
    topic: string;
    _renderedOnce?: boolean;
    _everyReq?: string[];

}

enum Status {
    SKIPPING,
    TODO,
    MAYBE,
    WANTS,
    TAKEN,
    COMPLETED,
    ACCEPTED,
}

type Semester = Number;
type Grade = Number;

interface UserSubject extends Subject {
    status: Status,
    takingAt?: Semester,
    grade?: Grade,
}

class _Drawer {
    constructor() {

    }


    moduleStyle: string[] = [];

    getColorForModule(subject: Subject) {
        const index = this.moduleStyle.indexOf(subject.module);
        if (index === -1) this.moduleStyle.push(subject.module);

        return Colors.style[index] ?? "type-n";
    }
}

const Colors = {
    style: ["type-main", "type-1", "type-2", "type-3"],
    //base: ["#E57373", "#AB47BC", "#64B5F6", "#4DB6AC"]
    base: ["topic-main", "topic-1", "topic-2", "topic-3"],
    bootstrap: ["success","danger","warning","info"],
}

const Drawer = new _Drawer();


interface Topic {
    subject?: Subject;
    name: string;
    description: string;
    theme?: string;
}

class Topics {

    static defaultTheme = "secondary";
    topics: Map<string, Topic> = new Map();

    constructor(jsobj: any) {
        const keys = Object.keys(jsobj);

        keys.forEach((key, i) => {
                const value = jsobj[key];
                const valueCp = window.structuredClone(value);
                this.topics.set(key, {
                    name: key,
                    subject: valueCp,
                    description: value.name,
                    theme: Colors.bootstrap[i]
                })
            }
        )
    }

    theme(subject: Subject) {

        const module = this.topics.get(subject.topic);
        if (!module) return Topics.defaultTheme;

        return module.theme;
    }
}

class Model {
    subjects: Subject[] = [];
    topics?: Topics;

    constructor(subjects?: Subject[]) {
        this.subjects = subjects ?? [];

        for (let i = 0; i < this.subjects?.length; i++) {
            this.getPreviousSubjects(this.subjects[i], this.subjects[i] );
        }
    }

    subjectsBySem(semester: number, onlySingle: boolean = false, onlyFirst: boolean = false): Model {
        const filtered = this.subjects.filter(
            subject => {
                if (onlyFirst) return subject.recommendedSemester[0] === semester;

                if (!subject.recommendedSemester.includes(semester)) return false;

                if (onlySingle) return subject.recommendedSemester.length === 1;
                else return true;
            }
        )
        return new Model(filtered);
    }

    subjectFilterRendered() {
        const filtered = this.subjects.filter(
            subject => !subject._renderedOnce
        )
        return new Model(filtered);
    }

    getSubjectByCode(code: string): Subject | undefined {
        return this.subjects.find(el => el.code === code);
    }


    getPreviousSubjects(subject: Subject, propagateSubject: Subject ) {
            if (subject._everyReq) {
                if (!subject._everyReq.includes(propagateSubject.code)) {
                    subject._everyReq.push(propagateSubject.code);
                }
            } else {
                subject._everyReq = [propagateSubject.code];
            }

        subject.requirements.forEach((requirementList: string[]) => {
                requirementList.forEach(requirement => {
                    const requiredSubject = this.getSubjectByCode(requirement)
                    if (requiredSubject) {
                        this.getPreviousSubjects(requiredSubject, propagateSubject)
                    }
                })
            }
        )



    }


}

export default Model;
export {Topics, Drawer, $};
export type {Subject}