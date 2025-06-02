import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

export const isAuth = async (req, res, next) => {
    try {
        const token=req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        if(!decodedData) {
            return res.status(401).json({
                message: 'Token expired'
            });
        }
        req.user= await User.findById(decodedData.id);
        next();
    }
    catch (error) {
        res.status(500).json({
            message: 'Authentication failed'
        });
    }
}