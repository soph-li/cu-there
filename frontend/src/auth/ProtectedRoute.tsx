import { useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../../backend/firebase";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const [user, setUser] = useState<User | null>(null);
    

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    if (!user) {
        return (
            <div className='center'>
                <p>please sign in to access this page 😟</p>
            </div>
        )
    }

    return children;
};

export default ProtectedRoute;