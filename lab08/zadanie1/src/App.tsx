import { useState } from 'react'
import './App.css'
import ColorSelector from './ColorSelector';

function App() {
  let allColors = ["red", "green", "blue", "yellow", "purple", "orange", "pink"];

  const [bgColor, setBgColor] = useState<string>("black");

  const handleChildColor = (color: string) => {
    console.log("Wybrany kolor: ", color);
    setBgColor(color);
  }

  return (
    <div className="App" style={{backgroundColor: bgColor}}>
      <h1>Wybór koloru</h1>
      <ColorSelector allColors={allColors} handleChildColor={handleChildColor}/>
    </div>
  )
}

export default App