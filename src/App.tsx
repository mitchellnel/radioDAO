import React from "react";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Main from "./components/Main/Main";
import Voting from "./components/Voting/Voting";
import Collection from "./components/Collection/Collection";
import Marketplace from "./components/Marketplace/Marketplace";

function App() {
  return (
    <div className="app-main-div">
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/voting" element={<Voting />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
