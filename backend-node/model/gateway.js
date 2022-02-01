const mongoose = require("mongoose");

const userDeviceSchema = new mongoose.Schema( {
    uid_number: {
        type: String,
        required: [true, 'UID Device number required']
    },
    vendor: {
        type: String,
        required: [true, 'Vendor is required']
    },
   date_created: { type: Date, default: Date.now },
   status: {
        type: String,
        enum : {values: ['online', 'offline'], message: '{VALUE} is not supported enter online or offline'},
        default: 'online'
    },
});

const gatewaysSchema = new mongoose.Schema({
    serial_number: {
        type: String,
        required: [true, 'Serial number required'],
    },
    name: {
        type: String,
        required: [true, 'Gateway name is required']
    },
    ip_address: {
        type: String,
        required: [true, 'Ip Address is required']
    },
    devices: [userDeviceSchema],
});

module.exports = mongoose.model("gateway", gatewaysSchema);