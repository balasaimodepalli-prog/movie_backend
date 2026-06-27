import jwt  from "jsonwebtoken";

function generateToken(id){
    return jwt.sign({id},process.env.JWT_SIGNATURE, {expiresIn:'1d'})
}
export default generateToken;
