export const addPrizing = async (req,res) =>{
    console.log(req);
    try{
        const {itemName, amount, description, image } =req.body;
        const jj=req.body;
        console.log("Adding Prizing with data: ", req.body);
         console.log("Adding Prizing with data: ", req.file.path);
    return res.status(200).json({ success: true, message: "done", data:jj });
    }
    catch(error){
        return res.status(500).json({ success: false, message: error.message });
    }
}
export default { addPrizing };