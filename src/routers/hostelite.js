const express = require("express");
const app = express();
const router = new express.Router();
const Hostelite = require("../models/hostelite");
const bodyParser = require("body-parser");
const adminAuth = require("../middleware/adminAuth");


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(bodyParser.json());


// creating a Hostelite ============================
router.post("/hostelites", (req, res) => {
    
    const newHostelite = new Hostelite(req.body);

    newHostelite.save().then((result) => {
        console.log("New Hostelite created Successfully. ", result);
        res.send(result);
    }).catch((error) => {
        console.log("Application Creation Failed. Error : ", error);
        res.status(400).send(error);
    })
})

// reading all applicant's data ===========================
router.get("/hostelites", (req, res) => {
    Hostelite.find({}).then((result) => {
        console.log("All Hostelites : ", result);
        res.send(result);
    }).catch((error) => {
        console.log("Reading all Hostelites failed.", error);
        res.status(400).send(error);
    })
})

// reading a particular Hostelite's data ====================
router.get("/hostelites/:id", (req, res) => {
    const hostelite_id = req.params.id;
    Hostelite.find({ _id: hostelite_id }).then((foundHostelite) => {
        if (!foundHostelite) {
            res.status(404).send("Hostelite Not found in database");
        }
        res.send(foundHostelite);
    }).catch((error) => {
        res.status(400).send(error);
    })
})

// updating a particular Applicant's data ======================
router.patch("/hostelites/:id", async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ["fullname","email","mobileNo","fatherName","motherName","guardianNo","DOB","address","bloodGroup","college","dept","batch","gender","roomType","hostelNo","roomNo","isPaid"];

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    console.log(isValidOperation);

    if(!isValidOperation){
        return res.status(400).send({error: "Invalid Updates!"});
    }

    try {
        const updatedHostelite = await Hostelite.findById(req.params.id);
        console.log(updatedHostelite);
        updates.forEach((update)=> updatedHostelite[update] = req.body[update]);
        await updatedHostelite.save();
        
        if (!updatedHostelite) {
            res.send("Hostelite not found in database");
        }
        res.send(updatedHostelite);
    }
    catch (error) {
        res.status(400).send(error);
    }
})

// deleting a particular hostelite ===========================
router.delete("/hostelites/:id",async (req,res)=>{
    try{
        const deletedHostelite = await Hostelite.findByIdAndDelete(req.params.id);
        if(!deletedHostelite){
            res.send("Hostelite not found in database");
        }
        res.send("Successfully deleted ! " + deletedHostelite);
    }
    catch(error){
        res.status(400).send(error);
    }
})



module.exports = router;