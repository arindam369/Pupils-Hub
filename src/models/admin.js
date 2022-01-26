const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobileNo: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    address: {
        type: String
    },
    avatar: {
        type: Buffer
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})


// generating auth token for logging admins :
const SECRET = "This is my little secret";

adminSchema.methods.generateAuthToken = async function(){
    const authenticatedAdmin = this;
    const token = jwt.sign({_id: authenticatedAdmin._id.toString()},SECRET,{expiresIn:"1 day"});
    authenticatedAdmin.tokens = authenticatedAdmin.tokens.concat({token});
    await authenticatedAdmin.save();
    return token;
}

// check login credentials :
adminSchema.statics.checkLoginCredentials = async (email,pass)=>{
    const registeredAdmin = await Admin.findOne({email});
    if(!registeredAdmin){
        throw new Error("Authentication Failed ..Admin not registered");
    }
    const isMatch = await bcrypt.compare(pass,registeredAdmin.pass);
    if(!isMatch){
        throw new Error("Authentication Failed ... Admin pass mismatched");
    }
    return registeredAdmin;
}


// hashing passwords before saving user
adminSchema.pre("save",async function(next){
    const admin = this;

    if(admin.isModified("pass")){    // if user creates an account or change their password..only that time the pass should be hashed
        admin.pass =  await bcrypt.hash(admin.pass,8);
    }
    next();
})


const Admin = mongoose.model('Admin', adminSchema);

// const user1 = new User({
//     fullname: "Arindam Halder",
//     email: "halderarindam10000@gmail.com",
//     mobileNo: "8777712395",
//     pass: "Hi Arindam"
// })

// user1.save().then((result)=>{
//     console.log("User created Successfully. ",result);
// }).catch((error)=>{
//     console.log("User Creation Failed. Error : ",error);
// })

module.exports = Admin;