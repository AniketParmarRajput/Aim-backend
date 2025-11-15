import User from "../Model/User.model.js";   
export const getEmployees = async (req, res) => {
  try {
    const employees = await User.findAll();
     console.log("Fetched Employees:===================================>");
 console.log(employees);
 console.log("Fetched Employees:===================================>");
    return res.json({ success: true, data: employees });
  
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



