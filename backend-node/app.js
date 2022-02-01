require("dotenv").config();
require("./config/database").connect();

var userController = require("./controller/userController");

var gatewayController = require("./controller/gateWayController");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const express = require("express");

var cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*'
}));

// Register
app.post("/api/register",  async (req, res) => {

    // Our register logic starts here

        // Get user input
        const { first_name, last_name, email, password } = req.body;

        const responseJson = await userController.registerUser(first_name, last_name, email, password);

        // return new user
        res.status(responseJson.status).json(responseJson);

    // Our register logic ends here
});

// Login
app.post("/api/login", async (req, res) => {


    const { email, password } = req.body;

    const responseJson = await userController.loginUser(email, password);

    // return new user
    res.status(responseJson.status).json(responseJson);

});

const auth = require("./middleware/auth");


// Register
app.post("/api/register-gateway", auth,  async (req, res) => {

    // Our register gateway logic starts here

    const responseJson = await gatewayController.registerGateway(req.body);

    // return new user
    res.status(responseJson.status).json(responseJson);

    // Our register logic ends here
});

// Register
app.post("/api/update-gateway/:id", auth,  async (req, res) => {

    // Our register gateway logic starts here
    const id = req.params.id;
    const responseJson = await gatewayController.updateGateway(id, req.body);

    // return new user
    res.status(responseJson.status).json(responseJson);

    // Our register logic ends here
});

// Delete
app.delete("/api/delete-gateway/:id", auth,  async (req, res) => {

    // Our register gateway logic starts here

    const id = req.params.id;
    const responseJson = await gatewayController.deleteGateway(id);

    // return new user
    res.status(responseJson.status).json(responseJson);

    // Our register logic ends here
});

app.post("/api/add-device-to-gateway/:id", auth,  async (req, res) => {

    const id = req.params.id;
    const device = req.body;
    const responseJson = await gatewayController.addDeviceGateway(id, device);

    // return new user
    res.status(responseJson.status).json(responseJson);
});



app.post("/api/gateway/:gatewayId/edit-device/:deviceId", auth,  async (req, res) => {

    const id = req.params.gatewayId;
    const idDevice = req.params.deviceId;
    const device = req.body;

    const responseJson = await gatewayController.editDeviceGateway(id, idDevice, device);

    // return new user
    res.status(responseJson.status).json(responseJson);
});

app.delete("/api/gateway/:gatewayId/remove-device/:deviceId", auth,  async (req, res) => {

    const id = req.params.gatewayId;
    const deviceId = req.params.deviceId;
    const responseJson = await gatewayController.deleteDevice(id, deviceId);

    // return new user
    res.status(responseJson.status).json(responseJson);
});

app.get("/api/gateways", auth,  async (req, res) => {

    const responseJson = await gatewayController.listGateways();

    res.status(responseJson.status).json(responseJson);
});

app.get("/api/gateway/:gatewayId/devices", auth,  async (req, res) => {

    const id = req.params.gatewayId;
    const responseJson = await gatewayController.listDevicesByGateway(id);

    // return new user
    res.status(responseJson.status).json(responseJson);
});


module.exports = app;