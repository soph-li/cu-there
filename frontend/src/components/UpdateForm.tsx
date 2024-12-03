import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

type UpdateFormProps = {
    id: string; // id of the card being edited
    onClose: () => void; // callback to close the form
    onUpdateSuccess: (updatedData: any) => void;
};

const UpdateForm: React.FC<UpdateFormProps> = ({ id, onClose, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        instructor: "",
        location: "",
        description: "",
    });

    const [error, setError] = useState("");
    const popupRef = useRef<HTMLDivElement | null>(null);

    // open the popup and modify styles
    const openPopUp = () => {
        if (popupRef.current) {
          popupRef.current.style.display = "block";
          setTimeout(() => {
            popupRef.current?.classList.add("open-popup"); 
          }, 6);
        }
      };
    
    // close the popup and modify styles
    const closePopUp = () => {
        if (popupRef.current) {
          popupRef.current.style.display = "none";
          popupRef.current.classList.remove("open-popup");
        }
        onClose();
      };
      
    // fetch current class data for the card
    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/classrooms/${id}`);
            setFormData(response.data); // prefill form with existing data
            openPopUp();
        } catch (err) {
            setError("failed to load class details");
        }
        };
        fetchData();
    }, [id]);

    // handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
        const response = await axios.put(`${API_BASE_URL}/classrooms/${id}`, formData);
        onUpdateSuccess(response.data); 
        closePopUp();
        } catch (err) {
        setError("failed to update classroom");
        }
    };

    return (
        <div ref={popupRef} className="popup">
        <h2>update class</h2>
        <input
            name="name"
            placeholder="class name"
            value={formData.name}
            onChange={handleInputChange}
        />
        <input
            name="instructor"
            placeholder="instructor"
            value={formData.instructor}
            onChange={handleInputChange}
        />
        <input
            name="location"
            placeholder="location"
            value={formData.location}
            onChange={handleInputChange}
        />
        <input
            name="description"
            placeholder="description"
            value={formData.description}
            onChange={handleInputChange}
        />
        <p />
        <button onClick={handleUpdate}>update</button>
        <button onClick={onClose}>close</button>
        </div>
    );
    };

export default UpdateForm;