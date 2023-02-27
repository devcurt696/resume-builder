import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import axios from "axios";

const Home = ({setResult}) => {
    const [fullName, setFullName] = useState("");
    const [currentPosition, setCurrentPosition] = useState("");
    const [currentLength, setCurrentLength] = useState(1);
    const [currentTechnologies, setCurrentTechnologies] = useState("");
    const [headShot, setHeadShot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [companyInfo, setCompanyInfo] = useState([{ name: "", position: ""}]);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("headshotImage", headShot, headShot.name);
        formData.append("fullName", fullName);
        formData.append("currentPosition", currentPosition);
        formData.append("currentLength", currentLength);
        formData.append("currentTechnologies", currentTechnologies);
        formData.append("workHistory", JSON.stringify(companyInfo));
        axios
            .post("http://localhost:4000/resume/create", formData, {})
            .then((res) => {
                if (res.data.message) {
                    setResult(res.data.data);
                    navigate("/resume");
                }
            })
            .catch((err) => console.log(err));
        setLoading(true);
    };
    

    const handleAddCompany = () => {
        setCompanyInfo([...companyInfo, {name: "", position: ""}]);
    };

    const handleRemoveCompany = (index) => {
        const list = [...companyInfo];
        list.splice(index, 1);
        setCompanyInfo(list);
    };

    const handleUpdateCompany = (e, index) => {
        const {name, value} = e.target;
        const list = [...companyInfo];
        list[index][name] = value;
        setCompanyInfo(list);
    }

    if (loading) {
        return <Loading />;
    }
    return (
        <div className="app">
            <h1>CC Tech Resume Builder with ChatGPT</h1>
            <p>Generate a resume</p>
            <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
                <label htmlFor="fullName">Full Name: </label>
                <input type='text' required name="fullName" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)}></input>
                <div className="nestedContiner">
                <div>
                    <label htmlFor="currPos">Current Position</label>
                    <input
                        type='text'
                        required
                        name="currPos"
                        className="currentInput"
                        value={currentPosition}
                        onChange={(e) => setCurrentPosition(e.target.value)}
                    />
                </div>
                <div>
                        <label htmlFor='currentLength'>For how long? (year)</label>
                        <input
                            type='number'
                            required
                            name='currentLength'
                            className='currentInput'
                            value={currentLength}
                            onChange={(e) => setCurrentLength(e.target.value)}
                        />
                    </div>
                <div>
                        <label htmlFor='currentTechnologies'>Technologies used</label>
                        <input
                            type='text'
                            required
                            name='currentTechnologies'
                            className='currentInput'
                            value={currentTechnologies}
                            onChange={(e) => setCurrentTechnologies(e.target.value)}
                        />
                    </div>
                </div>
                <label htmlFor="photo">Upload a photo: </label>
                <input 
                    type='file'
                    name='photo'
                    required
                    id='photo'
                    accept='image/x-png,image/jpeg'
                    onChange={(e) => setHeadShot(e.target.files[0])}
                />

                <h3>Past Employment</h3>
                
                    {companyInfo.map((company, index) => (
                        <div className="nestedContainer" key={index}>
                            <div className="companies">
                              <label htmlFor="name">Company Name: </label>
                                <input
                                    type='text'
                                    name="name"
                                    required
                                    onChange={(e) => handleUpdateCompany(e, index)}
                                />
                            </div>
                            <div className="companies">
                            <label htmlFor="Position">Position held: </label>
                                <input
                                    type='text'
                                    name="position"
                                    required
                                    onChange={(e) => handleUpdateCompany(e, index)}
                                />
                            </div>
                            <div className="btn__group">
                                {companyInfo.length -1 === index && companyInfo.length < 4 && (
                                    <button id="addBtn" onClick={handleAddCompany}>
                                        Add
                                    </button>
                                )}
                                {companyInfo.length > 1 && (
                                    <button id="deleteBtn" onClick={() => handleRemoveCompany(index)}>
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                
                <button>Create Resume</button>
            </form>
        </div>
        
    );
};

export default Home;