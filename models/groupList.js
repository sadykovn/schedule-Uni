import { Schema,model } from "mongoose"
const GroupShema = new Schema({
    name: {type: String},
    kurs: {type: Number},
    quantity: {type: Number}
})

export default GroupShema