const JWT = require("jsonwebtoken");
const User = require("../models/user");

exports.protect = (role) => {
    return async (req, res, next) => {
        let token;
        if (req.headers.token && req.headers.token.startsWith("Bearer")) {
            token = req.headers.token.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({
                success: false,
                data: "No authorize to access this route",
            });
        }
        try {
            //  verify token
            const decoded = JWT.verify(token, process.env.JWT_SECRET);
            let user = await User.findById(decoded.id);
            if ((role === "client" && !!user.role) || role === user.role) {
                req.user = user._id;
                next();
            } else {
                return res.status(401).json({
                    success: false,
                    data: "No authorize to access this route",
                });
            }
        } catch (err) {
            return res.status(401).json({
                success: false,
                data: "No authorize to access this route",
            });
        }
    };
};
