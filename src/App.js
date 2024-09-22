import './App.css';
import {Routes, Route, BrowserRouter} from "react-router-dom";
import Index from "./pages/index";

export default function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index/>} />
    </Routes>
  </BrowserRouter>
}