import "../App.css";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../constants/Navigation";

const CheckIn = () => {
    const navigate = useNavigate();

    const goToHome = () => {
        const homePath = PATHS.filter(path => path.label === "Home")[0];
        navigate(homePath.link);
    }

    return (
        <>
            <div className='center'>
                <h1>you're in!</h1>
                <button onClick={goToHome}>go home!</button>
            </div>
        </>
    );
};

export default CheckIn;