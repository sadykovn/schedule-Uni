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



router.get('/api/groupsName/:kurs', async(req,res)=>{
    
    const kurs = req.params.kurs;
    const groupName =  await GetGroupName.find({kurs}).lean()
    res.json(groupName);
    

})

router.get('/api/teachersName', async(req,res)=>{
    

    const teacherName =  await GetTeacher.find({}).lean()
    res.json(teacherName);
    

})

router.get('/api/cabinetName', async(req,res)=>{
    

    const teacherName =  await GetAudience.find({}).lean()
    res.json(teacherName);
    

})

router.get("/api/teacher/:id", async(req, res)=>{
          
    const id = req.params.id;
    // получаем одного пользователя по id
    const teacher = await GetTeacher.findById(id);
    if(teacher) res.json(teacher);
    else res.json("");
});

router.get("/api/room/:id", async(req, res)=>{
          
    const id = req.params.id;
    // получаем одного пользователя по id
    const room = await GetAudience.findById(id);
    if(room) res.json(room);
    else res.json("");
});

router.post("/api/schedules", async(req,res)=>{
    if(!req.body)return res.sendStatus(400)
    const {group,semester,day} = req.body

    const schedule = await GroupSchedule.find({group,semester,day}).lean()
    if(schedule) res.json(schedule);
    else res.sendStatus(404);

    
})

router.post("/api/schedule", async(req, res)=>{
    if(!req.body)return res.sendStatus(400)
    const {id} = req.body;
    // // // // получаем одного пользователя по id
    const schedule = await GroupSchedule.findById(id).lean()
    if(schedule) res.json(schedule);
    else res.sendStatus(404);
});

router.post("/api/clearschedule", async(req, res)=>{
    if(!req.body)return res.sendStatus(400)
    const {id} = req.body
    const newGroup = {
        lesson: "", 
        teacherId: "",
        roomId: "",
        lecture: "",
        firstTime: "",
        secondTime: ""
        };

        const schedule = await GroupSchedule.findOneAndUpdate({_id: id}, newGroup, {new: true});
        if(schedule) res.json(schedule);
        else res.sendStatus(404);
});
// группанын өзгөртүү
router.put("/api/schedule", async (req, res)=>{
    async function schedPut(){
        const newGroup = {
            lesson: lesson,
            teacherId: teacherId,
            roomId: cabinetId,
            lecture: lecture,
            firstTime: firstTime,
            secondTime: secondTime
            };
         // обновляем данные пользователя по id
        const schedule = await GroupSchedule.findOneAndUpdate({_id: id}, newGroup, {new: true});
        if(schedule) res.json(schedule);
        else res.sendStatus(404);
    }



    if(!req.body) return res.sendStatus(400);
    const {id,lesson,teacherId,cabinetId, lecture, firstTime, secondTime} = req.body
    const shedInfo = await GroupSchedule.findById(id)
    const teacher = await GroupSchedule.find({day:shedInfo.day,pair:shedInfo.pair,teacherId})
    const audience = await GroupSchedule.find({day:shedInfo.day,pair:shedInfo.pair,roomId:cabinetId})
    


    if(teacher.length){
        if(
            shedInfo.semester == teacher[0].semester && 
            shedInfo.kurs == teacher[0].kurs && 
            shedInfo.day == teacher[0].day &&
            shedInfo.pair == teacher[0].pair &&
            lesson == teacher[0].lesson &&
            lecture == teacher[0].lecture &&
            firstTime == teacher[0].firstTime &&
            secondTime == teacher[0].secondTime &&
            cabinetId == teacher[0].roomId){
    
                schedPut() 
            }
        else {
            if(teacher.length == 1){
                if(shedInfo.group == teacher[0].group){                  
                    schedPut()
                }
                else{
                    console.log("iselse");
                    // res.json(`  Мындай мугалим ${teacher[0].group} тайпасында жайгашылган `)
                }
            }
            else{
                res.json(`  Мындай мугалим ${teacher[0].group} тайпасында жайгашылган `)
            }
        }
    }
    
    else if (audience.length){
        if(audience.length == 1){
            if(shedInfo.group == audience[0].group){
                schedPut()
            }
            else{
                res.json(`  Мындай аудитория ${audience[0].group} тайпасында жайгашылган `)
            }
        }
        else{
            res.json(`  Мындай аудитория ${audience[0].group} тайпасында жайгашылган `)
        }
    }
    else{
        console.log("audience.length");
        schedPut() 
    }

});
export default router