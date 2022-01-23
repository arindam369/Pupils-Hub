const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
    dp_image: {
        type: String
    },
    college: {
        type: String
    },
    dept: {
        type: String
    },
    batch: {
        type: String
    },
    bloodGroup: {
        type: String
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

// generating auth token for logging users :
const SECRET = "This is my little secret";
userSchema.methods.generateAuthToken = async function(){
    const authenticatedUser = this;
    const token = jwt.sign({_id: authenticatedUser._id.toString()},SECRET,{expiresIn:"2 hour"});
    authenticatedUser.tokens = authenticatedUser.tokens.concat({token});
    await authenticatedUser.save();
    return token;
}



// check login credentials :
userSchema.statics.checkLoginCredentials = async (email,pass)=>{
    const registeredUser = await User.findOne({email});
    if(!registeredUser){
        throw new Error("Authentication Failed ..not registered");
    }
    const isMatch = await bcrypt.compare(pass,registeredUser.pass);
    if(!isMatch){
        throw new Error("Authentication Failed ... pass mismatched");
    }
    return registeredUser;
}



// hashing passwords before saving user
userSchema.pre("save",async function(next){
    const user = this;

    if(user.isModified("pass")){    // if user creates an account or change their password..only that time the pass should be hashed
        user.pass =  await bcrypt.hash(user.pass,8);
    }
    next();
})


const User = mongoose.model('User', userSchema);

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

module.exports = User;