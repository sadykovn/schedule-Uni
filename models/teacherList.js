import { Schema,model } from "mongoose"
const TeacherShema = new Schema({
    firstname: {type: String},
    secondname: {type: String},
    thirdname: {type: String},  
})

export default TeacherShema