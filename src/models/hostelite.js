const mongoose = require("mongoose");

const hosteliteSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    motherName: {
        type: String,
        required: true
    },
    guardianNo: {
        type: String,
        required: true
    },
    DOB: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    dept: {
        type: String,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    roomType:{
        type: String,
        required: true
    },
    message: {
        type: String
    },
    hostelNo:{
        type: Number
    },
    roomNo: {
        type: String
    },
    isPaid: {
        type: Boolean
    }
});


const Hostelite = mongoose.model('Hostelite', hosteliteSchema);

module.exports = Hostelite;