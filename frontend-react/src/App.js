import LoginUser from "./views/login/login";
import Register from "./views/register/register";
import Dashboard from "./views/dashboard/dashboard";
import {
    BrowserRouter as Router,Routes,
    Route
} from "react-router-dom";
import {StoreContext} from "storeon/react";
import {store} from "./core/store";
import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import BootstrapNavbar from "./components/header/navBar";
import React from "react";

function App() {

  return (
      <StoreContext.Provider value={store}>
      <div className="App">
          <div className="App-header">

              <BootstrapNavbar/>

          </div>

      </div>
      </StoreContext.Provider>
  );
}

export default App;
