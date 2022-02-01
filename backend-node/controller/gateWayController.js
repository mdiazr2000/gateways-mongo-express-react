const Gateway = require("../model/gateway");

// Node.js require:

const addFormats = require("ajv-formats");

const Ajv = require("ajv")
const betterAjvErrors = require('better-ajv-errors').default;

const ajv = new Ajv()
addFormats(ajv)


const deviceRequest = {
    type: "object",
    properties: {
        uid_number:  {type: "string"},
        vendor:  {type: "string"},
        date_created: {
            "type": "string",
            "format": "date"
        },
        status: {
            enum: ["online", "offline"]
        }
    },
    required: ["uid_number", "vendor"],
    additionalProperties: false
}

const deviceArrayRequest = {
    "type": "array",
    "items" : deviceRequest
}

const requestCreateGateWay = {
    type: "object",
    properties: {
        serial_number: {type: "string"},
        name: {type: "string"},
        ip_address: {
            "type": "string",
            "format": "ipv4"
        },
        devices: deviceArrayRequest
    },
    required: ["serial_number", "name", "ip_address"],
    additionalProperties: false
}


const registerGateway = async (gateWay) => {

    // Our register logic starts here
    const data = gateWay;
    try {

        // Validate user input

        const validate = ajv.compile(requestCreateGateWay);
        const valid = await ajv.validate(requestCreateGateWay, data);
        if (!valid)
        {
            const output = betterAjvErrors(requestCreateGateWay, data, validate.errors, {format: "js"});
            return {
                status: 400,
                message: "Validation errors",
                errors: output
            }
        }

       await Gateway.init();

       let gateWayCreated = null;
       try {
           const foundGateway = await Gateway.findOne({'serial_number': data.serial_number}).exec();
           if (foundGateway) {
               return {
                   status: 500,
                   message: "Validation errors",
                   errors: "It exists already a document with that serial number"
               }
           }
           gateWayCreated = await Gateway.create(data);
       } catch (error) {

           return {
               status: 500,
               message: error.message,
               errors: error
           }
       }

        return {
            status: 200,
            gateway: gateWayCreated,
            message: "Inserted Gateway successfully"
        }

    } catch (err) {
        return {
            status: 500,
            message: "Error trying to save gateway",
            errors: err
        }
    }

}

const updateGateway = async (id, gateWayForUpdate) => {

    // Our register logic starts here
    const data = gateWayForUpdate;
    try {

        // Validate user input

        const validate = ajv.compile(requestCreateGateWay);
        const valid = await ajv.validate(requestCreateGateWay, data);
        if (!valid)
        {
            const output = betterAjvErrors(requestCreateGateWay, data, validate.errors, {format: "js"});
            return {
                status: 400,
                message: "Validation errors",
                errors: output
            }
        }

        await Gateway.init();

        let gatewayUpdated = null;
        try {
            const foundGateway = await Gateway.findOne(
                {'serial_number': gateWayForUpdate.serial_number, '_id':  { $ne: id}  });
            if (foundGateway) {
                return {
                    status: 500,
                    message: "Validation errors",
                    errors: "Exists already a document with that serial number"
                }
            }

            gatewayUpdated = await Gateway.findByIdAndUpdate(id, gateWayForUpdate, {new: true})

        } catch (error) {
            return {
                status: 500,
                message: error.message,
                errors: error
            }
        }

        return {
            status: 200,
            gateway: gatewayUpdated,
            message: "Updated Gateway successfully"
        }

    } catch (err) {
        return {
            status: 500,
            message: "Error trying to update gateway",
            errors: err
        }
    }

}

const deleteGateway = async (gatewayId) => {

        try {
           const res = await Gateway.deleteOne({ '_id': gatewayId });

           let message = res.deletedCount
               ? "Deleted " +res.deletedCount+ " Gateway successfully"
               : "Not Found a Gateway with that ID"
           ;
            return {
                status: 200,
                gatewayId: gatewayId,
                message: message
            }

        } catch (e) {
            return {
                status: 500,
                message: "Error deleting gateway",
                errors: e
            }
        }


}

const addDeviceGateway = async (gatewayId, device) => {

    try {

        const foundGateway = await Gateway.findById(gatewayId, null, {returnOriginal: true});
        if (!foundGateway) {
            return {
                status: 404,
                gatewayId: gatewayId,
                message: "Not Found a Gateway with that Id"
            }
        }

        const validate = ajv.compile(deviceRequest);
        const valid = await ajv.validate(deviceRequest, device);
        if (!valid)
        {
            const output = betterAjvErrors(deviceRequest, device, validate.errors, {format: "js"});
            return {
                status: 400,
                message: "Validation errors",
                errors: output
            }
        }

        // adding device to an existing gateway
        foundGateway.devices.push(device);
        foundGateway.save();

        return {
            status: 200,
            gateway: foundGateway,
            message: "Added device to Gateway successfully"
        }

    } catch (e) {
        return {
            status: 500,
            message: "Error adding device to a gateway",
            errors: e
        }
    }


}

const editDeviceGateway = async (gatewayId, idDevice,  device) => {

    try {

        const foundGateway = await Gateway.findById(gatewayId, null, {returnOriginal: true});
        if (!foundGateway) {
            return {
                status: 404,
                gatewayId: gatewayId,
                errors: "Not Found a Gateway with that Id "+gatewayId
            }
        }

        const validate = ajv.compile(deviceRequest);
        const valid = await ajv.validate(deviceRequest, device);
        if (!valid)
        {
            const output = betterAjvErrors(deviceRequest, device, validate.errors, {format: "js"});
            return {
                status: 400,
                message: "Validation errors",
                errors: output
            }
        }

        // adding device to an existing gateway
        const foundIndexDevice =  foundGateway.devices.findIndex(item => item._id == idDevice);

        if (foundIndexDevice == -1) {
            return {
                status: 404,
                deviceId: idDevice,
                errors: "Not Found a device with that Id "+idDevice
            }
        }

        foundGateway.devices.splice(foundIndexDevice,1,device);
        foundGateway.save();

        return {
            status: 200,
            gateway: foundGateway,
            message: "Edited device to Gateway successfully"
        }

    } catch (e) {
        return {
            status: 500,
            message: "Error adding device to a gateway",
            errors: e
        }
    }


}

const deleteDevice = async (gatewayId, deviceId) => {

    try {

        const foundGateway = await Gateway.findById(gatewayId, null, {returnOriginal: true});
        if (!foundGateway) {
            return {
                status: 404,
                gatewayId: gatewayId,
                message: "Not Found a Gateway with that Id"
            }
        }
        let indexDeviceId = foundGateway.devices.findIndex(item => item._id == deviceId);
        if (indexDeviceId == -1) {
            return {
                status: 404,
                gatewayId: deviceId,
                message: "Not Found a Device with that Id"
            }
        }

        foundGateway.devices.splice(indexDeviceId, 1);
        foundGateway.save();

        return {
            status: 200,
            gatewayId: gatewayId,
            deviceId: deviceId,
            message: "Device removed successfully"
        }

    } catch (e) {
        return {
            status: 500,
            message: "Error deleting device from gateway",
            errors: e
        }
    }


}

const listGateways = async () => {
    const all = await Gateway.find({});
    return {
        status: 200,
        message: "success",
        gateways: all
    }
}

const listDevicesByGateway = async (id) => {
    const gateway = await Gateway.findOne({'_id' :id}, null, {returnOriginal: true});
    return {
        status: 200,
        message: "success",
        devices: gateway.devices
    }
}

exports.registerGateway = registerGateway;
exports.updateGateway = updateGateway;
exports.deleteGateway = deleteGateway;
exports.addDeviceGateway = addDeviceGateway;
exports.deleteDevice = deleteDevice;
exports.listGateways = listGateways;
exports.listDevicesByGateway = listDevicesByGateway;
exports.editDeviceGateway = editDeviceGateway;
