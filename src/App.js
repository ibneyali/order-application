import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import About from "./pages/About";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />}></Route>
          <Route path="/Home" exact element={<Home />}></Route>
          <Route path="/orders" exact element={<Orders />}></Route>
          <Route path="/about" exact element={<About />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
