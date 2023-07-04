import React from "react";
import "./App.css";
import { RouteMain } from "./routes/Route";
import { Navbar } from "./components/ui/Navbar";
import { useSelector } from "react-redux";

function App() {
  const { adminUser } = useSelector((state) => state.admin);
  return (
    <div className="App">
      {adminUser.token && <Navbar />}
      <RouteMain />
    </div>
  );
}

export default App;
