import Prizing from "../Model/Prizing.model.js";

export const addPrizing = async (req, res) => {
    try {
        const { itemName, amount, description } = req.body;

        // multer puts file info in req.file
        const image = req.file ? req.file.path : null;

        // Validation
        if (!itemName || !amount || !description || !image) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const createPrizing = await Prizing.create({
            itemName,
            amount,
            description,
            image
        });

        return res.status(201).json({
            success: true,
            message: "Prizing added successfully",
            data: createPrizing
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getPrizing = async(req,res) =>{
    try{
        const prizing = Prizing.findAll();
        res.status(200).json({success:"true", message:"done",data:prizing})
    }
    catch(err){
        res.status(500).json({success:"false", message:"internal error"})
    }
}

export default { addPrizing , getPrizing};
