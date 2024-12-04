import "../App.css";
import { useState } from "react";
import axios from "axios";
import tickImage from '../assets/tick.png';

let API_BASE_URL = "http://localhost:8080";

function Join() {
    const [searchClass, setSearchClass] = useState("");
    const [searchName, setSearchName] = useState("");
    const [emptyErrMessage, setEmptyErrMessage] = useState("");
    const [codeLenMessage, setCodeLenMessage] = useState("");
    const [popupShown, setPopupShown] = useState(false);
    const [codeExists, setCodeExists] = useState(false);
    const [notFoundMessage, setNotFoundMessage] = useState("");
    let popup = document.getElementById("popup");
    
    const checkIn = async () => {

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

        // lol is their code bogus tho???
        try {
            const response = await axios.get(`${API_BASE_URL}/attendance`);
            const codes = response.data;

            const classCodeExists = codes.some((code: { code: string }) => code.code === searchClass);

            if (!classCodeExists) {
                setCodeExists(false);
                setNotFoundMessage("class not found.");
                return;
            }
            setCodeExists(true);
        
        } catch (error) {
            console.error("Error fetching attendance codes:", error);
            setCodeExists(false);  // If there's an error, assume the code doesn't exist
        }

        // clear the error if input is valid
        setEmptyErrMessage("");
        setCodeLenMessage("");
        setNotFoundMessage("");
        
        if (!popupShown) {
            setPopupShown(true);
            popup?.classList.add("open-popup");

        }

        };


    const closePopUp = () => {
        popup?.classList.remove("open-popup");
        resetForm();
    };

    // reset state when details are reentered
    const resetForm = () => {
        setSearchClass("");
        setSearchName("");
        setCodeExists(false);
        setPopupShown(false);
    };

    return (
        <>
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
                {notFoundMessage && <p style={{ color: "red" }}>{notFoundMessage}</p>}
            </center>
        </div>
        <div className="popup" id="popup">
            <img src={tickImage}/>
            <h2>you're in!</h2>
            <p>your details have successfully been submitted.</p>
            <button type="button" onClick={closePopUp}>ok</button>
        </div>
        </>
    );
};

export default Join;
