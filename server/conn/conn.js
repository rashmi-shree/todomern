const mongoose = require('mongoose');

const conn = async(req, res) => {
    try{
        await mongoose
        .connect("mongodb+srv://rashmi:rose@cluster0.ytxnypn.mongodb.net/")
        .then(()=>{
            console.log("connected");
        })
    }catch(err){
        res.status(400).json({
            message:"Not connected"
        })
    }
}
conn(); 