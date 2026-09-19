import jwt from "jsonwebtoken";

const isverify = (req, res, next) => {
    // Support: httpOnly cookie `token`, JS-accessible `access_token`, and Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const token = req.cookies?.token || req.cookies?.access_token || bearerToken;

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
