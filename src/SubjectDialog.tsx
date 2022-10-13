import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";

export default function SubjectDialog({subject, openState, onClose}: any) {
    const [open, setOpen] = useState(false);

    useEffect(function () {
        setOpen(true);
    }, [subject])

    if (!subject) return <></>;

    return <div id={"dialogLike"} className={open ? "dialog-open" : "dialog-closed"}>
        <div className={"subjectInner"}>
            <h2>{subject.name}</h2>
            <table>
                <tr>
                    <td>Kód</td>
                    <td>{subject.code}</td>
                </tr>
                <tr>
                    <td>Kód</td>
                    <td>{subject.code}</td>
                </tr>
                <tr>
                    <td>Értékelés</td>
                    <td>
                        {subject.assessment.combined && "Kombinált jegy "}
                        |
                        {subject.assessment.grade}
                    </td>
                </tr>

                <tr>
                    <td>Ajánlott szemeszter</td>
                    <td>{subject.recommendedSemester.join(",")}</td>
                </tr>
            </table>

            {subject.elective ? "" : "Kötelező "} |
            {subject.discontinued ? "Discontinued " : ""} |
            {subject.topic} Ismeretkör

        </div>
        <form method="dialog">
            <Button variant="primary" onClick={() => {
                onClose();
                setOpen(false)
            }}>OK
            </Button>
        </form>
    </div>
};