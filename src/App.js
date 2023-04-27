import { useAccount } from 'wagmi';
import NavBar from './Components/NavBar';
import Assets from './Pages/Assets';
import Discover from './Pages/Discover';
import Swaps from './Pages/Swaps';
import logo from './logo.svg';
import {BrowserRouter,Route,Routes} from "react-router-dom"
import Fallback from './Components/Fallback';

function App() {
  
  const{address}=useAccount();
  return (
    <div className="App" style={{overflowX:'hidden'}}>
      <BrowserRouter>
      <NavBar/>
      {address ? (<Routes>
        <Route exact path="/discover" element={<Discover/>}/>
        <Route exact path="/myassets" element={<Assets/>}/>
        <Route exact path="/swaps" element={<Swaps/>}/>
      </Routes>):(<Fallback/>)}
      
      </BrowserRouter>
    </div>
  );
}

export default App;
