import { useState } from "react";
import "./Friend.css";

const Friend = ({name, phone, email} : {name: string, phone: string, email: string}) => {
    const [showDetails, setShowDetails] = useState(false);
    
    function handleButtonCLick() {
        setShowDetails(!showDetails)
    }

    return (
        <div className="friend-card">
            <div className="friend-name">{name}</div>
            <hr />
            <button className="friend-details" onClick={handleButtonCLick}>{showDetails ? "Hide" : "Show"} Details</button>
            {showDetails && (
                <div>
                    <div className="friend-phone">Phone: <span style={{fontWeight:"400"}}>{phone}</span></div>
                    <div className="friend-email">Email: <span style={{fontWeight:"400"}}>{email}</span></div>
                </div>
            )}
        </div>
    )
}

export default Friend;