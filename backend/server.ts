import path from "path";
import express, { Express } from "express";
import cors from "cors";
import fetch from "node-fetch";
import { db } from './firebase';
import {doc, addDoc, collection, updateDoc, deleteDoc, getDocs, getFirestore, getDoc} from 'firebase/firestore';

const app: Express = express();
const hostname = "0.0.0.0";
const port = 8080;

app.use(cors());
app.use(express.json());

type AttendanceRecord = {
    student: string;
    status: "present" | "absent";
}

type AttendanceRecords = {
    [date: string]: AttendanceRecord[];
}

type Classroom = {
    name: string;
    id: number;
    description?: string;
    location?: string;
    instructor: string;
    code: string;
    students: string[];
    attendanceRecords: AttendanceRecords;
};

// add a new classroom
app.post("/classrooms", async (req, res) => {
    const classroomData = req.body;

    try {
        const docRef = await addDoc(collection(db, "classrooms"), classroomData);
        res.status(201).send({ id: docRef.id, ...classroomData });
    } catch (error) {
        console.error("error creating classroom: ", error);
        res.status(500).send({ error: "failed to create classroom." });
    }
});

// fetch a classroom by id
app.get("/classrooms/:id", async (req, res) => {
    const classroomId = req.params.id;

    try {
        const docRef = doc(db, "classrooms", classroomId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            res.status(200).send({ id: classroomId, ...docSnap.data() });
        } else {
            res.status(404).send({ error: "classoom not found." });
        }
    } catch (error) {
        console.error("error fetching classroom: ", error);
        res.status(500).send({ error: "failed to fetch classroom." });
    }
});

// update a classroom by id
app.put("/classrooms/:id", async (req, res) => {
    const classroomId = req.params.id;
    const updatedData = req.body;

    try {
        const docRef = doc(db, "classrooms", classroomId);
        await updateDoc(docRef, updatedData);
        res.status(200).send({ message: "classroom updated successfuly." });
    } catch (error) {
        console.error("error updating classroom: ", error);
        res.status(500).send({ error: "failed to update classroom." });
    }
});

// delete a classroom by id
app.delete("/classrooms/:id", async (req, res) => {
    const classroomId = req.params.id;
    
    try {
        const docRef = doc(db, "classrooms", classroomId);
        await deleteDoc(docRef);
        res.status(200).send({ message: `classroom with id ${classroomId} deleted successfully.` });
    } catch (error) {
        console.error("error deleting classroom: ", error);
        res.status(500).send({ error: "failed to delete classroom." });
    }
});

app.listen(port, hostname, () => {
    console.log(`Server listening on port ${port}`);
});
