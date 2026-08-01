import User from "../Model/User.model.js";
import  {sendWelcomeEmail}  from "../utils/sendWelcomeEmail.js";

// =============================
// GET ALL EMPLOYEES
// =============================
export const getEmployees = async (req, res) => {
  try {
    const employees = await User.findAll();

    return res.json({ success: true, data: employees });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =============================
// CREATE EMPLOYEE
// =============================
export const createEmployee = async (req, res) => {
  try {
    const { name, email, role, position, password, mobile } = req.body;
console.log(req.body);
    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Name, email and password are required" });
    }

    // Create employee
    const newEmployee = await User.create({
      name,
      email,
      role: role || "customer",
      position: position || "Customer",
      password,
      mobile: mobile || null,
    });
    
     await sendWelcomeEmail(
      email,
      name
    );

    return res.status(201).json({ success: true, data: newEmployee });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    console.log(req.body);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: req.body,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteEmployee = async (req, res) => {
  console.log(req.params);
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id: id } });
    if (deleted) {
      return res.status(200).json({ success: true, message: "Employee deleted successfully" });
    } else {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
  }
  catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const getByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getByEmployeeID = async (req,res) =>{
  console.log(req.params);
  try{
    const {id} =req.params;
    const employees = await User.findOne({
        where: { id: id }
    })
    if(!employees){
    return res.status(404).json({success:false,  message: "Employee not found"})
    }
    return res.status(200).json({
      success:true,
      data:employees,
     message: "Fetched successfully"
    })

  }catch(error){
return res.status(500).json({success:false, message:error.message})
  }
  

}

// =============================
// Export as default object
// =============================
export default { getEmployees, createEmployee, deleteEmployee, getByEmail, getByEmployeeID, updatePassword };
