import { Schema,model } from "mongoose"
const GroupNameShema = new Schema({
    group:{type: String},
    kurs:{type: Number},
    day: {type: Number},
    pair: {type: Number},  
    lesson: {type: String},
    teacherId: {type:String},  
    roomId: {type:String},  
    semester:{type:String},
    lecture:{type:String},
    firstTime:{type:String},
    secondTime:{type:String},
})

export default GroupNameShema