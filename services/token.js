import jwt from "jsonwebtoken"
const generateJWTToken = adminId => {
    const accessToken = jwt.sign({adminId},"itf_fk",{expiresIn:"30d"})
    return accessToken
} 
export {generateJWTToken}