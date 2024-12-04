import "../App.css";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';

let API_BASE_URL = "http://localhost:8080";

type Classroom = {
    id: string;
    name: string;
    instructor: string;
    location: string;
    description: string;
};

type Code = {
    id: string;
    classId: string;
    code: string;
}

const ClassPage = () => {
    const { id } = useParams<{ id: string }>();
    const [classroom, setClassroom] = useState<Classroom | null>(null);
    const [code, setCode] = useState<string | null>(null);
    const [codeId, setCodeId] = useState<string | null>(null);

    // fetch class data
    useEffect(() => {
        const fetchClass = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/classrooms/${id}`);
                setClassroom(response.data);
            } catch (error) {
                console.error("Error fetching class details:", error);
            }
        };
        fetchClass();
    }, [id]);

    const generateCode = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleStartAttendance = async () => {
        const newCode = generateCode();
        setCode(newCode);
        
        try {
            const response = await axios.post(`${API_BASE_URL}/attendance`, {
                classId: id,
                code: newCode,
            });
            setCodeId(response.data.id);
            console.log(codeId);
        } catch (error) {
            console.error("error starting attendance: ", error);
        }
    };

    const handleStopAttendance = async () => {
        try {
            console.log("stopping attendance for ID:", codeId);
            await axios.delete(`${API_BASE_URL}/attendance/${codeId}`);
            setCode(null);
            setCodeId(null);
        } catch (error) {
            console.error("error stopping attendance: ", error);
        }
    };

    return (
        <>
            <div>
                {classroom && (
                    <div className='center-top'>
                        <button onClick={handleStartAttendance}>start</button>
                        <button onClick={handleStopAttendance}>stop</button>
                        <h2>{classroom.name}</h2>
                        {code && <h1>{code}</h1>} 
                    </div>
                )}
            </div>
        </>
    );
};

export default ClassPage;