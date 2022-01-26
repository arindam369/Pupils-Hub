const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    announcement: {
        type: String,
        required: true
    }
});


const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;