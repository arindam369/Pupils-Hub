const express = require("express");
const app = express();
const router = new express.Router();
const Applicant = require("../models/applicant");
const bodyParser = require("body-parser");
const adminAuth = require("../middleware/adminAuth");


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(bodyParser.json());


// creating an applicant ============================
router.post("/applicants", (req, res) => {
    
    const newApplicant = new Applicant(req.body);

    newApplicant.save().then((result) => {
        console.log("New Applicant created Successfully. ", result);
        res.send(result);
    }).catch((error) => {
        console.log("Application Creation Failed. Error : ", error);
        res.status(400).send(error);
    })
})

// reading all applicant's data ===========================
router.get("/applicants",adminAuth, (req, res) => {
    Applicant.find({}).then((result) => {
        console.log("All Applicants : ", result);
        res.send(result);
    }).catch((error) => {
        console.log("Reading all applicants failed.", error);
        res.status(400).send(error);
    })
})

// reading a particular applicant's data ====================
router.get("/applicants/:id", (req, res) => {
    const applicant_id = req.params.id;
    Applicant.find({ _id: applicant_id }).then((foundApplicant) => {
        if (!foundApplicant) {
            res.status(404).send("Applicant Not found in database");
        }
        res.send(foundApplicant);
    }).catch((error) => {
        res.status(400).send(error);
    })
})

// updating a particular Applicant's data ======================
router.patch("/applicants/:id", async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ["fullname","email","mobileNo","fatherName","motherName","guardianNo","DOB","address","bloodGroup","college","dept","batch","gender","roomType"];

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    console.log(isValidOperation);

    if(!isValidOperation){
        return res.status(400).send({error: "Invalid Updates!"});
    }

    try {
        const updatedApplicant = await Applicant.findById(req.params.id);
        console.log(updatedApplicant);
        updates.forEach((update)=> updatedApplicant[update] = req.body[update]);
        await updatedApplicant.save();
        

        if (!updatedApplicant) {
            res.send("Applicant not found in database");
        }
        res.send(updatedApplicant);
    }
    catch (error) {
        res.status(400).send(error);
    }
})

// deleting a particular user ===========================
router.delete("/applicants/:id",async (req,res)=>{
    try{
        const deletedApplicant = await Applicant.findByIdAndDelete(req.params.id);
        if(!deletedApplicant){
            res.send("Applicant not found in database");
        }
        res.send("Successfully deleted ! " + deletedApplicant);
    }
    catch(error){
        res.status(400).send(error);
    }
})



module.exports = router;