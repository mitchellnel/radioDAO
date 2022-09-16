import React from "react";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import theme from "./assets/RadioDAOTheme";
import { ThemeProvider } from "@mui/material/styles";

import Navbar from "./components/Navbar/Navbar";
import Main from "./components/Main/Main";
import Voting from "./components/Voting/Voting";
import Collection from "./components/Collection/Collection";
import Marketplace from "./components/Marketplace/Marketplace";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="app-main-div">
        <BrowserRouter>
          <Navbar />

          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/voting" element={<Voting />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
