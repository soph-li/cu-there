import express, { Express } from "express";
import cors from "cors";
import { db } from './firebase';
import {doc, addDoc, collection, updateDoc, deleteDoc, getDocs, getFirestore, getDoc} from 'firebase/firestore';
import * as admin from 'firebase-admin';

// initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(), // This uses the default service account key
  });
  
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
    userId: string;
    name: string;
    classId: string;
    description: string;
    location: string;
    instructor: string;
    code: string;
    students: string[];
    attendanceRecords: AttendanceRecords;
};

/* class */
// add a new classroom
app.post("/classrooms", async (req, res) => {
    const { userId, ...classroomData} = req.body;
    if (!userId) {
        return res.status(400).send({ error: "userId required."});
    }

    try {
        const docRef = await addDoc(collection(db, "classrooms"), { userId, ...classroomData});
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

// fetch all classrooms
app.get("/classrooms", async (_, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, "classrooms"));
        const classrooms = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.status(200).send(classrooms);
    } catch (error) {
        console.error("error fetching classrooms: ", error);
        res.status(500).send({ error: "failed to fetch classrooms." });
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

app.post('/attendance', async (req, res) => {
    const { classId, code } = req.body;

    try {
        const docRef = await addDoc(collection(db, "attendance"), {
            classId,
            code,
        });
        console.log("attendance created with id: ", docRef.id);
        res.status(201).send({ id: docRef.id }); // return the document ID
    } catch (error) {
        console.error("error creating attendance document: ", error);
        res.status(500).send({ error: "failed to start attendance" });
    }
});

app.delete('/attendance/:id', async (req, res) => {
    const attendId = req.params.id;
    try {
        console.log(attendId);
        const docRef = doc(db, "attendance", attendId);
        console.log("Deleting document at path:", docRef.path);

        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return res.status(404).send({ error: "document not found" });
        }

        await deleteDoc(docRef);
        res.status(200).send({ message: "attendance stopped successfully" });
    } catch (error) {
        console.error("error deleting attendance: ", error);
        res.status(500).send({ error: "failed to stop attendance" });
    }
});

// fetch all attendance codes that exist rn
app.get("/attendance", async (_, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, "attendance"));
        const codes = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.status(200).send(codes);
    } catch (error) {
        console.error("error fetching codes: ", error);
        res.status(500).send({ error: "failed to fetch codes." });
    }
});


app.listen(port, hostname, () => {
    console.log(`Server listening on port ${port}`);
});
