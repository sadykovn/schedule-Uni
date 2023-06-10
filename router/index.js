import { Router } from "express"
import { model } from "mongoose"
import GroupShema from "../models/groupList.js"
import TeacherShema from "../models/teacherList.js"
import AudienceShema from "../models/audienceList.js"
import GroupNameShema from "../models/groupName.js"

const GetGroupName = new model("groups-name",GroupShema)
const GetTeacher = new model("teacher",TeacherShema)
const GetAudience = new model("audience",AudienceShema)
const GroupSchedule = new model("groups-schedules",GroupNameShema)



const router = Router()

router.post("/api/index/group", async(req,res)=>{
    if(!req.body)return res.sendStatus(400)
    const {group,semester} = req.body
    const schedule = await GroupSchedule.find({group,semester}).lean()
    if(schedule) res.json(schedule);
    else res.sendStatus(404);

    
})


router.post("/api/index/teacher", async(req,res)=>{
    if(!req.body)return res.sendStatus(400)
    const {teacherId,semester} = req.body
    const schedule = await GroupSchedule.find({semester,teacherId}).lean()
    if(schedule) res.json(schedule);
    else res.sendStatus(404);


    
})
router.post("/api/index/audience", async(req,res)=>{
    if(!req.body)return res.sendStatus(400)
    const {roomId,semester} = req.body
    console.log(roomId);
    const schedule = await GroupSchedule.find({semester,roomId}).lean()
    console.log(schedule);
    if(schedule) res.json(schedule);
    else res.sendStatus(404);


    
})

router.get('/api/korpus/:frame', async(req,res)=>{
    
    const frame = req.params.frame;
    // получаем одного пользователя по id
    const audience = await GetAudience.find({korpus:frame});
    if(audience) res.json(audience);
    else res.sendStatus(404);

})



export default router