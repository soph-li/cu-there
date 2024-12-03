import "../App.css";
import { useState } from "react";

type Classroom = {
    id: string;
    name: string;
    instructor: string;
    location: string;
    description: string;
};

interface ClassCardProps {
    classroom: Classroom;
    onEdit: (id: string) => void
    onDelete: (id: string) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classroom, onEdit, onDelete }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(classroom.id);
    }

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(classroom.id);
    }

    return (
        <div
            className={`card ${isFlipped ? "flipped" : ""}`}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className="card-inner">
                {/* front of the card */}
                <div className="card-front">
                    <h3 className='class-name'>{classroom.name}</h3>
                    <p className='class-info'>{classroom.instructor} | {classroom.location}</p>
                    <p className='class-description'>{classroom.description}</p>
                </div>

                {/* back of the card */}
                <div className="card-back">
                    <button onClick={handleEditClick}>edit</button>
                    <p/>
                    <button onClick={handleDeleteClick}>delete</button>
                </div>
            </div>
        </div>
    );
};

export default ClassCard;