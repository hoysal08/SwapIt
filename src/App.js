import { useAccount } from "wagmi";
import NavBar from "./Components/NavBar";
import Assets from "./Pages/Assets";
import Discover from "./Pages/Discover";
import Swaps from "./Pages/Swaps";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Fallback from "./Components/Fallback";
import Connect from "./Pages/Connect";

function App() {
  const { address } = useAccount();
  return (
    <div className="App" style={{ overflowX: "hidden", overflowY: "hidden" }}>
      <BrowserRouter>
        <NavBar />
        {address ? (
          <Routes>
            <Route exact path="/discover" element={<Discover />} />
            <Route exact path="/myassets" element={<Assets />} />
            <Route exact path="/swaps" element={<Swaps />} />
            <Route exact path="/connect" element={<Connect />} />
          </Routes>
        ) : (
          <Fallback />
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
