import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import GoToList from "./pages/GoToList";
import MapPage from "./pages/MapPage";
import Profile from "./pages/Profile";
import Navbar from './components/Navbar';




function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
       
        <Route path="/" element={<Home />} />
        <Route path="/go-to-list" element={<GoToList />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
