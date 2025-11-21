
export const checkUser =async(req,res) =>{
   try{
    const {email}=req.body
    console.log(req.body)
    if(email == "rajputaniket092@gmail.com"){
        res.send({message:"logic successfully"})
    }
    else{
        res.send({message:"email is not valid"})
    }
   }
   catch(err){
    res.send({message:"Error Invalids"})

   }
}
export default{checkUser}