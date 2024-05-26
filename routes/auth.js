const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

//sign up
router.post("/register", async(req, res)=>{
    try{
        const {email, username, password} = req.body;
        const hashPassword = bcrypt.hashSync(password);
        const user = new User({email, username, password:hashPassword});
        await user.save()
        .then(()=>res.status(200).json({user:user}));
    }catch(err){
        res.status(400).json({message:"User already exists"});
    }
    
})
//signin
router.post("/signin", async(req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email})
        if(!user){
           return res.status(400).json({message:"please sign up first"})
        }
        console.log("user",user);
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Incorrect password"})
        }
        const {password, ...others} = user._doc;
        return res.status(200).json({others})
    }catch(err){
        console.log(err);
        res.status(400).json({message:"error"})
    }
})

module.exports = router;


// router.post("/register", async(req, res)=>{
//     const {email, username, password } = req.body;
//     try{
//         //check for an existing user
//         const existingUser = await User.findOne({$or:[{email},{username}]});
//         if(existingUser){
//             return res.send(400).json({message:"User already exists"})
//         }
//         const user = new User({email, username, password});
//         await user.save().then(()=> res.status(200).json({user:user}));
//     }catch(err){
//         return res.status(500).json({message:"An error occured during registration"});
//     }
//     res.status(400).json({ message: "Bad Request" });
// })