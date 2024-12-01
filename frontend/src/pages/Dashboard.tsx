import "../App.css";
import { useState, useRef } from "react";
import axios from "axios";

let API_BASE_URL = "http://localhost:8080";

type Classroom = {
    id: string;
    name: string;
    instructor: string;
    location: string;
    description: string;
    code?: string;
};

const ClassroomManager = () => {
    const [classData, setClassData] = useState({
        name: "",
        instructor: "",
        location: "",
        description: "",
    });
    const [responseMessage, setResponseMessage] = useState("");
    const [emptyErrMessage, setEmptyErrMessage] = useState("");
    const [popupShown, setPopupShown] = useState(false);

    const popupRef = useRef<HTMLDivElement | null>(null);

    // handle input changes for the form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setClassData((prev) => ({ ...prev, [name]: value }));
    };

    // open the popup and modify styles
    const openCreateClass = () => {
        resetForm();
        setPopupShown(true);
        if (popupRef.current) {
            popupRef.current.style.display = "block"; // Show popup
            popupRef.current.classList.add("open-popup-class"); // Add custom class
        }
    };

    // Close the popup and modify styles
    const closePopUp = () => {
        setPopupShown(false);
        if (popupRef.current) {
            popupRef.current.style.display = "none"; // Hide popup
            popupRef.current.classList.remove("open-popup-class"); // Remove custom class
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

    // Submit the form
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
        <div className="center_top">
            <button onClick={openCreateClass}>create new class</button>
            <div ref={popupRef} className="popup" style={{ display: "none" }}>
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

export default ClassroomManager;

