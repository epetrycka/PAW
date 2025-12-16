import './App.css'
import {Routes, Route} from 'react-router-dom'
import Home from './views/Home'
import Menu from './Menu'
import About from './views/About'
import Contact from './views/Contact'

function App() {
  return (
    <div>
      <div className="menu">
        <Menu />
      </div>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/About" element={<About />}/>
        <Route path="/Contact" element={<Contact />}/>
      </Routes>
    </div>
  );
}

export default App
