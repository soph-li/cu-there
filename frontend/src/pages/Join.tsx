import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../constants/Navigation";

function Join() {
    const [searchClass, setSearchClass] = useState("");
    const [searchName, setSearchName] = useState("");
    const [emptyErrMessage, setEmptyErrMessage] = useState("");
    const [codeLenMessage, setCodeLenMessage] = useState("");
    const [notFoundMessage, setNotFoundMessage] = useState("");
    const navigate = useNavigate();
    
    const checkIn = () => {

        // check if the name field is empty
        if (!searchClass || !searchName) {
            setEmptyErrMessage("both fields required.");
            return;
        }

        // check if code is 6 characters
        if (searchClass.length != 6) {
            setCodeLenMessage("code must be six characters.");
            return;
        }

        // clear the error if input is valid
        setEmptyErrMessage("");
        setCodeLenMessage("");
        const checkInPath = PATHS.filter(path => path.label === "CheckIn")[0];
        navigate(checkInPath.link);
    }
    return (
        <div className='center'>
            <center>
                <h2>join class here!</h2>
                <input 
                    data-testid='search'
                    type='text'
                    placeholder='enter class code'
                    className = 'search-bar'
                    value ={searchClass}
                    onChange = {(event) => {setSearchClass(event.target.value)}}
                />
                <p/>
                <input
                    data-testid='search'
                    type='text'
                    placeholder='enter name'
                    className='search-bar'
                    value={searchName}
                    onChange = {(event) => {setSearchName(event.target.value)}}
                />
                <p/>
                <button onClick={checkIn}>i'm here!</button>
                {emptyErrMessage && <p style={{ color: "red" }}>{emptyErrMessage}</p>}
                {codeLenMessage && <p style={{ color: "red" }}>{codeLenMessage}</p>}
            </center>
        </div>
    );
};

export default Join;
