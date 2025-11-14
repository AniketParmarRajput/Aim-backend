import User from "../Model/User.model.js";   

export const createEmployee = async (req, res) => {
  try {
    const { name, email } = req.body;

    const employee = await User.create({ name, email });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const getEmployees = async (req, res) => {
  try {
    const employees = await User.findAll();
    return res.json({ success: true, data: employees });
    console.log(employees);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



