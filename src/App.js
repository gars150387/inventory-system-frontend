import React from "react";
import "./App.css";
import { RouteMain } from "./routes/Route";
import { Navbar } from "./components/ui/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <RouteMain />
    </div>
  );
}

export default App;
