import "../App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import ClassForm from "../components/ClassForm";
import ClassCard from "../components/ClassCard";
import UpdateForm from "../components/UpdateForm";
import ProtectedRoute from "../auth/ProtectedRoute";
import { auth } from "../../../backend/firebase";

let API_BASE_URL = "http://localhost:8080";

type Classroom = {
    id: string;
    name: string;
    instructor: string;
    location: string;
    description: string;
    code?: string;
    userId: string;
};

const Dashboard = () => {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showDeleteWarn, setShowDeleteWarn] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // fetch all classrooms
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    // fetch ID token
                    const idToken = await user.getIdToken();
                    const response = await axios.get(`${API_BASE_URL}/classrooms`, {
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                        },
                    });

                    // filter classes based on uid
                    const myClassrooms = response.data.filter((classroom: Classroom) => 
                        classroom.userId === user.uid);
                    setClassrooms(myClassrooms);
                } else {
                    console.error("user is not authenticated");
                }
            } catch (error) {
                console.error("error fetching classrooms:", error);
            }
        };
    
        fetchClasses();
    }, []); 

    // handle edit
    const handleEditClick = (id: string) => {
        setEditingId(id);
    };

    const handleUpdateSuccess = (updatedData: Classroom) => {
        setClassrooms((prev) =>
            prev.map((classroom) => classroom.id === updatedData.id ? updatedData : classroom)
        );
    };

    // handle delete
    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${API_BASE_URL}/classrooms/${id}`);
            setClassrooms(classrooms.filter((classroom) => classroom.id !== id));
            setShowDeleteWarn(false);
            setDeletingId(null);
        } catch (error) {
            console.error("error deleting classroom:", error);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeletingId(id);
        setShowDeleteWarn(true);
    };

    const handleCancelDel = () => {
        setShowDeleteWarn(false);
        setDeletingId(null);
    };

    const handleConfirmDel = () => {
        if (deletingId) {
            handleDelete(deletingId);
        }
    };

    return (
        <>
            <ProtectedRoute>
            <div className='form-container'>
                <ClassForm />
            </div>
            <br/>
            <div className='grid-container'>
                {classrooms.length > 0 ? (classrooms.map((classroom) => (
                    <ClassCard
                        key={classroom.id}
                        classroom={classroom}
                        onDelete={handleDeleteClick}
                        onEdit={handleEditClick}
                    />
                ))) : (
                    <div className='center'>
                        <p>you don't have any classes yet! 😡</p>
                    </div>
                )}
            </div>
            
            {editingId && (
                <UpdateForm
                    id={editingId}
                    onClose={() => setEditingId(null)} 
                    onUpdateSuccess={handleUpdateSuccess}
                />
            )}
            
            {showDeleteWarn && (
                <div className='delete-warning-popup'>
                    <p>are you sure?</p>
                    <button onClick={handleConfirmDel}>yes</button>
                    <button onClick={handleCancelDel}>no</button>
                </div>
            )}
            </ProtectedRoute>
        </>
    );
};

export default Dashboard;