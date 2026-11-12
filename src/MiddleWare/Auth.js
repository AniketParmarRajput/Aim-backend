import jwt from "jsonwebtoken";

 export const isAuthenticated = (req, res, next) => {
    // Support: Authorization: Bearer <token>, httpOnly cookie `token`, JS cookie `access_token`
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const token = bearerToken || req.cookies?.token || req.cookies?.access_token;

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
