const express = require("express");
const app = express();
const router = new express.Router();
const Announcement = require("../models/announcement");
const bodyParser = require("body-parser");
const adminAuth = require("../middleware/adminAuth");


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(bodyParser.json());


// creating an announcement ============================
router.post("/announcements",adminAuth,(req, res) => {
    const newAnnouncement = new Announcement(req.body);
    newAnnouncement.save().then((result) => {
        console.log("New Announcement created Successfully. ", result);
        res.send(result);
    }).catch((error) => {
        console.log("Announcement Creation Failed. Error : ", error);
        res.status(400).send(error);
    })
})

// reading all Announcements ===========================
router.get("/announcements",(req, res) => {
    Announcement.find({}).then((result) => {
        // console.log("All Announcements : ", result);
        res.send(result);
    }).catch((error) => {
        // console.log("Reading all announcements failed.", error);
        res.status(400).send(error);
    })
})


// deleting a particular announcement ===========================
router.delete("/announcements/:id",adminAuth,async (req,res)=>{
    try{
        const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);
        if(!deletedAnnouncement){
            res.send("Announcement not found in database");
        }
        res.send("Successfully deleted ! " + deletedAnnouncement);
    }
    catch(error){
        res.status(400).send(error);
    }
})


module.exports = router;