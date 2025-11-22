import User from "../Model/User.model.js"
export const checkUser =async(req,res) =>{
   try{
    const {email,password}=req.body
    console.log(req.body)
    const Useremail =await User.findOne({ where: { email } }) 
    if(!Useremail) return res.status(400).json({message:"email not found"})

        const vaildpassword =await User.findOne({where:{password}})
        if(!vaildpassword) return res.status(400).json({message:"password not found"})
        res.status(200).json({message:"Login Succesfully"})
   }
   catch(err){
    res.send({message:"Error Invalids"})

   }
}
export default{checkUser}