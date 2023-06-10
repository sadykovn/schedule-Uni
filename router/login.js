import { Router } from "express"
import { Schema,model } from "mongoose"
import { generateJWTToken } from "../services/token.js"
// import flash from "connect-flash"

const LoginShema = new Schema({
    login: {type: String},
    password: {type: String}
})

const Login = model("login",LoginShema)

const router = Router()


router.post("/login", async(req,res)=>{
    const {login,password} = req.body
    if(!req.body)return res.sendStatus(400)
    const getLogin = await Login.findOne({login,password})

    if(getLogin) {
        const token = generateJWTToken(getLogin._id)
        res.cookie("token",token,{httpOnly:true,secure:true})
        req.flash("loginOpen","Ийгиликтүү кошулду")
        res.redirect("/homeSetng")
    }
    else {
        req.flash("loginError","Логин же пароль туура эмес")
        res.redirect("/gear")
    }

    
})

export default router
