import "../App.css";
import { useState, useRef } from "react";
import axios from "axios";

let API_BASE_URL = "http://localhost:8080";

const ClassForm = () => {
    const [classData, setClassData] = useState({
        name: "",
        instructor: "",
        location: "",
        description: "",
    });
    const [responseMessage, setResponseMessage] = useState("");
    const [emptyErrMessage, setEmptyErrMessage] = useState("");

    const popupRef = useRef<HTMLDivElement | null>(null);

    // handle input changes for the form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setClassData((prev) => ({ ...prev, [name]: value }));
    };

    // open the popup and modify styles
    const openCreateClass = () => {
        resetForm();
        if (popupRef.current) {
            popupRef.current.style.display = "block";
            setTimeout(() => {
                popupRef.current?.classList.add("open-popup"); // Add animation class
            }, 6); // Small delay ensures browser renders visibility before animation
        }
    };

    // close the popup and modify styles
    const closePopUp = () => {
        if (popupRef.current) {
            popupRef.current.style.display = "none";
            popupRef.current.classList.remove("open-popup");
        }
    };

    // Reset form data
    const resetForm = () => {
        setClassData({
            name: "",
            instructor: "",
            location: "",
            description: "",
        });
        setEmptyErrMessage("");
    };

    // submit the form
    const createClass = async () => {
        if (!classData.name || !classData.instructor || !classData.location || !classData.description) {
            setEmptyErrMessage("all fields are required!");
            return;
        }

        setEmptyErrMessage("");
        try {
            const response = await axios.post(`${API_BASE_URL}/classrooms`, classData);
            setResponseMessage(`classroom created with id: ${response.data.id}`);
            closePopUp();
        } catch (error) {
            setResponseMessage("failed to create classroom");
        }
    };

    return (
        <div>
            <p/>
            <button onClick={openCreateClass}>create new class</button>
            <div ref={popupRef} className="popup" id="popup">
                <h2>new class details</h2>
                <input
                    name="name"
                    placeholder="class name"
                    value={classData.name}
                    onChange={handleInputChange}
                />
                <input
                    name="instructor"
                    placeholder="instructor"
                    value={classData.instructor}
                    onChange={handleInputChange}
                />
                <input
                    name="location"
                    placeholder="location"
                    value={classData.location}
                    onChange={handleInputChange}
                />
                <input
                    name="description"
                    placeholder="description"
                    value={classData.description}
                    onChange={handleInputChange}
                />
                <p/>
                <button onClick={createClass}>create class</button>
                {emptyErrMessage && <div style={{ color: "red" }}>{emptyErrMessage}</div>}
                <button onClick={closePopUp}>close</button>
            </div>
        </div>
    );
};

export default ClassForm;

