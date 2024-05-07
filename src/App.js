import Header from "./Components/Header";
import Stamp from "./Components/Stamp";
import LoadingCircle from "./Components/Loader";
import './App.css';

function App() {
  return (
    <div className="App">
        <Header />
        <div style={{ height: '50px'}} />
        <Stamp
            points={8}
            title="Ownership verification"
            subtitle="Verify ownership of the smart contract address."
        />
        <LoadingCircle />
    </div>
  );
}

export default App;
