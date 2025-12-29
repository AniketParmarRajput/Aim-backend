import jwt from "jsonwebtoken";

const isverify = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Token missing",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.MY_SECRET_KEY);

        console.log("Decoded token:", decoded);

        req.user = decoded; // user info from token
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid or expired token",
        });
    }
};

export default isverify;
