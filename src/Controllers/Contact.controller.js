export const CreateContact = async (req, res) => {
   
  try {
    console.log("++++++++++++++++++++++")
    console.log(req.body);
       console.log("++++++++++++++++++++++")
       const data= req.body;
    return res.status(200).json({ success: true, message: "done" , data:data});
  } catch (error) {
    return res.status(500).json({ success: false, message: "failed" });
  }
};
