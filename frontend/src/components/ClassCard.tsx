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
    onDelete: (id: string) => void;
    onUpdate: (id: string) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classroom, onDelete, onUpdate }) => {
    const [isFlipped, setIsFlipped] = useState(false);

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
                    <button onClick={() => onUpdate(classroom.id)}>update</button>
                    <p/>
                    <button onClick={() => onDelete(classroom.id)}>delete</button>
                </div>
            </div>
        </div>
    );
};

export default ClassCard;