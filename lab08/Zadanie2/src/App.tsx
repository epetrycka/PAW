import { useEffect, useState } from 'react'
import './App.css'
// import Reset from './Reset.tsx'
// import Enable from './Enable.tsx'

function App() {
  const time = useTimer();

  return (
    <>
      <div className="Timer">
        <h1>{time}</h1>
        <div className="Buttons">
          {/* <Enable /> */}
          {/* <Reset /> */}
        </div>
      </div>
    </>
  )
}

export default App

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');
  return `${paddedMinutes}:${paddedSeconds}`;
}

export function useTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(sec => sec + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return formatTime(seconds);
}