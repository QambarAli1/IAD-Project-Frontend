import logo from './logo.svg';
import './App.css';
import Projects from './components/Projects';
import { ToastContainer } from "react-toastify";

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <h2 className='mainHeading' >Project Diary</h2>
      </header>
      <section>
        <Projects />
      </section>

      <ToastContainer />

    </div>
  );
}

export default App;
