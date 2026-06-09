import { useState } from 'react'
import './Div.css'

function Div () {
    const [isClicked, setIsClicked] = useState(false);
    const className = isClicked ? "clicked" : "";

    function handleClick() {
        setIsClicked(!isClicked);
    }

    return (
        <>
            <div className={`area ${className}`}  onClick={handleClick}>
            </div>
        </>
    )
}

export default Div