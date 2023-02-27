import { useReactToPrint } from "react-to-print";
import React, {useRef} from "react";
import ErrorPage from "./ErrorPage";

const Resume = ({result}) => {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${result.fullName} Resume`,
        onAfterPrint: () => alert("Print successul!"),
    });

    if (JSON.stringify(result) === "{}") {
        return <ErrorPage />;
    }

    const replaceWithBr = (string) => {
        return string.replace(/\n/g, "<br />");
    };

    return (
        <>
            <button onClick={handlePrint}>Print page</button>
            <main className="container" ref={componentRef}>
                <header className="header">
                    <div>
                        <h1>{result.fullName}</h1>
                        <p className="resumeTitle headerTitle">
                            {result.currentPosition} ({result.currentTechnologies})
                        </p>
                        <p className="resumeTitle">
                            {result.currentLength} year(s) of work experience.
                        </p>
                    </div>
                    <div>
                        <img 
                            src={result.image_url}
                            alt={result.fullName}
                            className='resumeImage'
                        />
                    </div>
                </header>
                <div className="resumeBody">
                    <div>
                        <h2 className="resumeBodyTitle">Profile Summary</h2>
                        <p 
                            dangerouslySetInnerHTML={{
                                __html: replaceWithBr(result.objective),
                            }}
                            className='resumeBodyContent'
                        />
                    </div>
                    <div>
                        <h2 className="resumeBodyTitle">Work History</h2>
                        {result.workHistory.map((work) => (
                            <p className="resumeBodyContent" key={work.name}>
                                <span style={{fontWeight: "bold"}}>{work.name}</span>
                                {work.position}
                            </p>
                        ))}
                    </div>
                    <div>
                        <h2 className="resumeBodyTitle">Job Profile</h2>
                        <p 
                            dangerouslySetInnerHTML={{
                                __html: replaceWithBr(result.jobResponsibilities),
                            }}
                            className='resumeBodyContent'
                        />
                    </div>
                    <div>
                        <h2 className="resumeBodyTitle">Job Responsibilities</h2>
                        <p 
                            dangerouslySetInnerHTML={{
                                __html: replaceWithBr(result.keypoints),
                            }}
                            className='resumeBodyContent'
                        />
                    </div>
                   
                </div>
            </main>
        </>
    );
};

export default Resume;