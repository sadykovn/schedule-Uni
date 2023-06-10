import { Schema,model } from "mongoose"
const AudienceShema = new Schema({
    cabinet: {type: String},
    korpus: {type: Number},  
})

export default AudienceShema