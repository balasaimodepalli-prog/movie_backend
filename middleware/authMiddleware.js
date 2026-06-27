import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            const decode = jwt.verify(token, process.env.JWT_SIGNATURE);
            
            req.user = await User.findById(decode.id).select("-password");
            
            return next(); 
        }
        catch (err) {
            return res.status(401).send('error: ' + err.message);
        }
    }

    if (!token) {
        return res.status(401).send('No token');
    }
}

export default protect;
