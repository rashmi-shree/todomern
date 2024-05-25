const router = require("express").Router();
const User = require("../models/user");
const List = require("../models/list");
//add
router.post("/addTask", async(req, res)=>{
    try{
        const {title, body, user} = req.body;
        const existingUser = await User.findOne({email:user})
        if(existingUser){
            const list = new List({title, body, user:existingUser._id})
            await list.save().then(()=>res.status(200).json({list}));
            existingUser.list.push(list);
            existingUser.list.push(list);
            existingUser.save()
        }else {
            return res.status(404).json({ message: "User not found" });
        }
    }catch(err){
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

//update
router.put('/updateTask/:id',async (req, res)=>{
    try{
        const {title, body, user} = req.body;
        const existingUser = await User.findOne({email:user})
        if(existingUser){
            const list =await List.findByIdAndUpdate(req.params.id, {title, body});
            list.save().then(()=>res.status(200).json({message:"Task updated"}));
        }else{
            return res.status(404).json({message:"User not found"})
        }
    }catch(err){
        return res.status(500).json({message:"Internal server error"});
    }
})

//delete
router.delete("/deleteTask/:id", async (req,res)=>{
    try{
        const {user} = req.body;
        const existingUser = await User.findOneAndUpdate(
            {email:user},
            {$pull : {list:req.params.id}}
        );
        if(existingUser){
            await List.findByIdAndDelete(req.params.id)
            .then(()=>res.status(200).json({message:"Task deleted"}))
        }else{
            return res.status(404).json({message:"User not found"})
        }
    }catch(err){
        return res.status(500).json({message:"Internal server error"});
    }
})
//get tasks
router.get("/getTasks/:id",async (req, res)=>{
    const list = await List.find({user:req.params.id}).sort({createdAt:-1})
    if(list.length !=0){
        res.status(200).json(({list:list}))
    }else{
        res.status(200).json({message:"No task"})
    }
})
module.exports = router;