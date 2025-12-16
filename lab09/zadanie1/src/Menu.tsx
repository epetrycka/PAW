import './Menu.css';
import { Link } from 'react-router-dom';

const Menu = () => {
    return (
        <nav>
            <Link to="/">
                <p>Home</p>
            </Link>
            <Link to="/About">
                <p>About</p>
            </Link>
            <Link to="/Contact">
                <p>Contact</p>
            </Link>
        </nav>        
    )
}

export default Menu;