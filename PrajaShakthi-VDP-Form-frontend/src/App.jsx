import "./App.css";
import DevelopmentForm from "./components/DevelopmentForm";
import SubmissionList from './components/SubmissionList' // Import the new component

function App() {
  return (
    <>
      <DevelopmentForm />
      <hr style={{ margin: "3rem 0" }} />
      <SubmissionList />
    </>
  );
}

export default App;
