require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(`mongodb+srv://admin-neophytes:${process.env.MONGOOSE_PASS}@cluster0.9lztf.mongodb.net/hostel-management-api?retryWrites=true&w=majority`, {
    useUnifiedTopology: true,
    useNewUrlParser: true
    // useCreateIndex: true
})