import rateLimit from "express-rate-limit";

const ApiLimit =rateLimit({
    windowMs: 60 * 60 * 1000,
    max:100,
     message: {
    success: false,
    message: "API limit exceeded. Please try again later.",
  },
   standardHeaders: true,
  legacyHeaders: false,
});
 export default  ApiLimit;