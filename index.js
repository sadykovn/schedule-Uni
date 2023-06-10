import express from "express"
import {engine, create} from "express-handlebars"
import mongoose from "mongoose"
import indexSetng from "./router/index.js"
import authSetng from "./router/authSetng.js"
import schedSetng from "./router/schedSetng.js"
import login from "./router/login.js"
import flash from "connect-flash"
import session from "express-session"
import varMiddleware from "./middleware/var.js"
import cookieParser from "cookie-parser"



// 
const app = express()   

const hbs = create({defaultLayout:"main",extname:"hbs"})

app.engine("hbs",hbs.engine)
app.set("view engine","hbs")
app.set("views","./views")
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(session({secret:"Nurba", resave:false, saveUninitialized:false}))
app.use(flash())
app.use(varMiddleware)

app.use(indexSetng)
app.use(authSetng)
app.use(schedSetng)
app.use(login)


app.get("/",(req,res)=>{
    res.clearCookie("token")
    res.render("index",{gear:true})
})

app.get("/homeSetng",(req,res)=>{
    if(!req.cookies.token){
        res.redirect("/gear")
        return
    }
    res.render("index",{index:true,
        index: true,
        authSetng:true,
        schedSetng:true,
        gear:false,
    })
})

app.get("/gear",(req,res)=>{
    if(req.cookies.token){
        res.redirect("/homeSetng")
        return
    }
    res.render("login",{
    loginError: req.flash("loginError")
    })

})

app.get("/schedSetng",(req,res) =>{
    if(!req.cookies.token){
        res.redirect("/gear")
        return
    }
    res.render("schedSetng",{
        index:true,
        homeSetng:true,
        authSetng:true,
        gear:false,
    })
})

app.get("/authSetng",async(req,res)=>{
    if(!req.cookies.token){
        res.redirect("/gear")
        return
    }
    res.render("authSetng",{index:true,schedSetng:true,homeSetng:true,gear:false})
})





const start = () => {
    try{
        const uri = "mongodb+srv://kumu:8J45H6M2WDzhn8PO@kumu.vfuoppu.mongodb.net/itf"
        mongoose.set("strictQuery",false)
        mongoose.connect(uri)

        mongoose.connection.on("connected",() => {
            console.log("Ulandi");
        })
    }catch (error){
        console.log(error);
    }
}
start()


app.listen(4100,()=>console.log("Ulandi"))