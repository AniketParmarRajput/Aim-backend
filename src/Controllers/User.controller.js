import User from "../Model/User.model.js";

// =============================
// GET ALL EMPLOYEES
// =============================
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

// =============================
// CREATE EMPLOYEE
// =============================
export const createEmployee = async (req, res) => {
  try {
    const { name, email, role, position,password } = req.body;
    console.log("Creating Employee with data: ", req);

    // Validate required fields
    if (!name || !email || !role || !position || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Create employee
    const newEmployee = await User.create({ name, email, role, position,password });

    return res.status(201).json({ success: true, data: newEmployee });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =============================
// Export as default object
// =============================
export default { getEmployees, createEmployee };
