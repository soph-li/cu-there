import "../App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import ClassForm from "../components/ClassForm";
import ClassCard from "../components/ClassCard";

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
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);

    // fetch all classrooms
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/classrooms`);
                setClassrooms(response.data);
            } catch (error) {
                console.error("Error fetching classrooms:", error);
            }
        };
        fetchClasses();
    }, []);

    // handle delete
    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${API_BASE_URL}/classrooms/${id}`);
            setClassrooms(classrooms.filter((classroom) => classroom.id !== id));
        } catch (error) {
            console.error("Error deleting classroom:", error);
        }
    };

    // handle update
    const handleUpdate = async (id: string) => {
        const updatedData = { name: "Updated Name" }; // Example update
        try {
            await axios.put(`${API_BASE_URL}/classrooms/${id}`, updatedData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setClassrooms((prev) =>
                prev.map((classroom) =>
                    classroom.id === id ? { ...classroom, ...updatedData } : classroom
                )
            );
        } catch (error) {
            console.error("Error updating classroom:", error);
        }
    };

    return (
        <>
            <div className='center-bot'><ClassForm /></div>
            <div className="grid-container">
                {classrooms.map((classroom) => (
                    <ClassCard
                        key={classroom.id}
                        classroom={classroom}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                    />
                ))}
            </div>
        </>
    );
};

export default ClassroomManager;