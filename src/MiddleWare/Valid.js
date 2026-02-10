import Joi from "joi";

const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  role: Joi.string().required(),
  position: Joi.string().required(),
  password: Joi.string().min(8).required()
});
const loginSchema = Joi.object({
      email: Joi.string().email().required(),
         position: Joi.string().required(),

})

export const signupValidation = (req, res, next) => {
  try {
    const { error, value } = signupSchema.validate(req.body, {
      abortEarly: true
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    // attach validated data
    req.body = value;

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const loginvalidation =(req,res, next) =>{
    try{
        const {error, value} =loginSchema.validate(req.body,{
            abortEarly
        });
        if(error){
            return res.status(400).json({
                success:false,
                 message: error.details[0].message
            })
        }
        req.body = value;
        next();


    }catch(error){
        console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
    }
}

