import "../App.css";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../constants/Navigation";

function HomePage() {
    const navigate = useNavigate();

    const goToJoin = () => {
        const joinPath = PATHS.filter(path => path.label === "Join")[0];
        navigate(joinPath.link);
    }

    return (
        <>
            <div className='center'>
                <center>
                    <h1>CU There</h1>
                    <p>attendance tracking, made easy</p>
                    <button onClick={goToJoin}>join class!</button>
                </center>
            </div>
        </>
    );
}

export default HomePage;
