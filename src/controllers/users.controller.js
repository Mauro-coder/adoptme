import userModel from "../dao/models/User.js";
import { usersService } from "../services/index.js"

const getAllUsers = async(req,res)=>{
    const users = await usersService.getAll();
    res.send({status:"success",payload:users})
}

const getUser = async(req,res)=> {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error",error:"User not found"})
    res.send({status:"success",payload:user})
}

const updateUser =async(req,res)=>{
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error", error:"User not found"})
    const result = await usersService.update(userId,updateBody);
    res.send({status:"success",message:"User updated"})
}

const deleteUser = async(req,res) =>{
    const userId = req.params.uid;
    console.log(userId)
    const result = await usersService.delete(userId);
    res.send({status:"success",message:"User deleted"})
}

const createDocument = async (req,res) =>{
    const files = req.files;
    const {uid}= req.params
    const documents = files.map(file =>{
        return {
            name: files.filename,
            reference:file.path
        }
    })
    await userModel.updateOne({_id:uid},{$push:{documents:{$each:documents}}})
    res.send({status:"success",message:"documents created"})

}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    createDocument,
}