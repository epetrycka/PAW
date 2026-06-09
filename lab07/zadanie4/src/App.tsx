import './App.css'
import Div from './Div'

function App() {

  return (
    <>
      <main>
        <div className='header'>
          <p>Stylowanie dynamiczne</p>
        </div>
        <div className="divs">
          <Div />
          <Div />
          <Div />
        </div>
      </main>
    </>
  )
}

export default App
