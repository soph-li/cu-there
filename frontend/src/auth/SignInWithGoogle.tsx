import { User, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../../../backend/firebase";
import { useState, useEffect } from "react";

const SignInWithGoogle = () => {
    const [user, setUser] = useState<User | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // detect if user signed in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log("user info:", user); // You can use the user info as needed
        } catch (error) {
            console.error("error signing in with Google:", error);
        }
    };

    const handleSignOut = async() => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("error signing out: ", error);
        }
    };

    return (
        <div className='sign-in' style={{ position: "relative" }}>
            {user ? (
                <div>
                    <button
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        style={{ cursor: "pointer" }}
                    >
                        Hi, {user.displayName ? user.displayName : "Guest"}
                    </button>
                    {dropdownOpen && (
                        <div
                            style={{
                                position: "absolute",
                                top: "100%",
                                right: 0,
                                background: "#fff",
                                borderRadius: "5px",
                                zIndex: 10,
                            }}
                        >
                            <button
                                onClick={handleSignOut}
                                style={{
                                    display: "block",
                                    width: "100%",
                                    padding: "10px",
                                    border: "none",
                                    background: "none",
                                    textAlign: "left",
                                    cursor: "pointer",
                                }}
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button onClick={handleGoogleSignIn}>Sign In</button>
            )}
        </div>
    );
};

export default SignInWithGoogle;
