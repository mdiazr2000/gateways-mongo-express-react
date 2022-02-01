import React, {useState} from 'react'

import './navBar.css';
import { Navbar,Nav,NavDropdown,Form,FormControl,Button } from 'react-bootstrap';
import LoginUser from "../../views/login/login";
import Register from "../../views/register/register";
import {BrowserRouter as Router, Switch, Route, Link, Routes} from "react-router-dom";
import { useStoreon } from 'storeon/react';
import { useNavigate } from "react-router-dom";
import Dashboard from "../../views/dashboard/dashboard";
import AddGateway from "../../views/gateways/addGateway";
import AddDevice from "../../views/gateways/addDevice";
import EditDevice from "../../views/gateways/editDevice";
import EditGateway from "../../views/gateways/editGateway";
import ErrorView from "../error/errorview";

const BootstrapNavbar = () => {

    let navigate = useNavigate();
    const { dispatch, auth } = useStoreon('auth');
    const [globalError, setGlobalError] = useState('');


    const logout = () => {
        dispatch('removeToken');
        navigate('/')
    };

    return(

        <div style={{width: '100%'}}>
            <div className="row">
                <div className="col-md-12">
                        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                            <Navbar.Brand style={{paddingLeft: '20px'}}>Gateways</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="mr-auto">
                                    {auth.accessToken == '' ? (
                                        <>
                                        <Link className="navbar-brand" to={"/"}>Login</Link>
                                        <Link className="navbar-brand" to={"/register"}>Register</Link>
                                        </>
                                        )
                                        : (
                                           <>
                                           <Link className="navbar-brand" to={"/Dashboard"}>Dashboard</Link>
                                           <span className="logout" onClick={logout}>Logout</span>
                                           </>
                                        )
                                    }
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                </div>
            </div>
            <Routes>
                <Route path = "/"
                       element={ auth.accessToken !== '' ? <Dashboard /> : <LoginUser />}
                />
                <Route path = "/register"
                       element={ auth.accessToken !== '' ? <Dashboard /> : <Register/>}/>
                <Route path = "/dashboard"
                       element={ auth.accessToken !== '' ? <Dashboard /> : <LoginUser/>}
                />
                <Route path = "/add-device"
                       element={ auth.accessToken !== '' ? <AddDevice /> : <LoginUser />}
                />
                <Route path = "/edit-device"
                       element={ auth.accessToken !== '' ? <EditDevice /> : <LoginUser />}
                />

                <Route path = "/add-gateway"
                       element={ auth.accessToken !== '' ? <AddGateway /> : <LoginUser />}
                />
                <Route path = "/edit-gateway"
                       element={ auth.accessToken !== '' ? <EditGateway /> : <LoginUser />}
                />

            </Routes>
        </div>
    )
}
export default BootstrapNavbar;