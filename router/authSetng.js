import { Router } from "express"
import { model } from "mongoose"
import GroupShema from "../models/groupList.js"
import GroupNameShema from "../models/groupName.js";
import TeacherShema from "../models/teacherList.js";
import AudienceShema from "../models/audienceList.js"
const GroupName = new model("groups-name",GroupShema)
const Teacher = new model("teachers",TeacherShema)
const Audience = new model("audiences",AudienceShema)
const GroupSchedule = new model("groups-schedules",GroupNameShema)

const router = Router()


// группанын бардык тизмесин чыгаруу
router.get("/api/groups", async (req, res)=>{
    // получаем всех пользователей
    const groups = await GroupName.find({});
    res.json(groups);
});
// группаны Id аркылуу формага таап берүү
router.get("/api/groups/:id", async(req, res)=>{
          
    const id = req.params.id;
    // получаем одного пользователя по id
    const group = await GroupName.findById(id);
    if(group) res.json(group);
    else res.sendStatus(404);
});

// группаны курсу аркылуу тизмесин чыгаруу
router.post("/api/groupsKurs",async(req,res)=>{
    if(!req.body)return res.sendStatus(400)
    const kurs = req.body.kurs
    // получаем всех пользователей
    const groupsKurs = await GroupName.find({kurs});
    res.json(groupsKurs);
})

// жаңы группа түзүү
router.post("/api/groups",async(req,res)=>{
    if(!req.body)return res.sendStatus(400)
    const {name,kurs,quantity} = req.body
    const condiData = await GroupName.findOne({name})
    if(condiData){
        const err = `   ${GroupName.name} мындай ысым жайгашылган`;
        res.json(err)
        return
    }
    const group = await GroupName.create(req.body)
    const value = {
        group:group.name,
        kurs:group.kurs,
        day:0,
        pair:0,
        lesson:"",
        teacherId:"",
        roomId:"",
        semester:"",
        lecture:"",
        firstTime:"",
        secondTime:"",
    }
    for (let i = 1; i <= 6; i++) {
        
        for (let j = 1; j <=8; j++) {
            if(j>=5){
                value.day = i
                value.pair = j-4
                value.lesson = `day ${i}, pair ${j-4}`
                value.semester = "spring"
                await GroupSchedule.create(value)
            }else{
                value.day = i
                value.pair = j
                value.lesson = `day ${i}, pair ${j}`
                value.semester = "autumn"
                await GroupSchedule.create(value)
            }
            
        }
        
    }
    res.json(group)
    

})

// группанын атын өзгөртүү
router.put("/api/groups", async (req, res)=>{
          
    if(!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const groupNameList = req.body.name;
    const groupKurs = req.body.kurs;
    const groupQuantity = req.body.quantity;
    const newGroup = {kurs: groupKurs, name: groupNameList, quantity: groupQuantity};
    


    const groupName = await GroupName.findById(id)
    if(groupName.name !== groupNameList){
        const groupNameSchedule = await GroupSchedule.find({group:groupName.name})
        for(let i = 0;i<groupNameSchedule.length;i++){
            const elementOLd = groupNameSchedule[i]
            await GroupSchedule.findOneAndUpdate({_id:elementOLd.id},{group:groupNameList},{new:true})
        }
    }
    const group = await GroupName.findOneAndUpdate({_id: id}, newGroup, {new: true});

    if(group) res.json(group);
    else res.sendStatus(404);
});

// группаны жок кылуу
router.delete("/api/groups/:id", async(req, res)=>{
    const id = req.params.id;
    
    // удаляем по id 
    const group = await GroupName.findByIdAndDelete(id);    
    const groupNameSchedule = await GroupSchedule.find({group:group.name})

    for(let i = 0;i<groupNameSchedule.length;i++){

        const elementOLd = groupNameSchedule[i]

        const elementNew = await GroupSchedule.findByIdAndDelete(elementOLd.id)
    }
    // console.log(dropGroup);
    if(group) res.send(group);
    else res.sendStatus(404);
});







// teacher
// Мугалимдердин бардык тизмесин чыгаруу
router.get("/api/teachers", async (req, res)=>{
    // получаем всех пользователей
    const teachers = await Teacher.find({});
    res.json(teachers);
});
// Мугалимди Id аркылуу формага таап берүү
router.get("/api/teachers/:id", async(req, res)=>{
          
    const id = req.params.id;
    // получаем одного пользователя по id
    const teacher = await Teacher.findById(id);
    if(teacher) res.json(teacher);
    else res.sendStatus(404);
});


// жаңы мугалим түзүү
router.post("/api/teachers",async(req,res)=>{
    if(!req.body)return res.sendStatus(400)
    const {firstname,secondname,thirdname} = req.body
    const condiData = await Teacher.findOne({firstname,secondname,thirdname})

    if(condiData){
        const err = `   ${condiData.firstname} ${condiData.secondname} ${condiData.thirdname} мындай ысым жайгашылган`;
        res.json(err)
        return
    }
    const teacher = await Teacher.create(req.body)
    res.json(teacher)

})

// мугалимдин атын өзгөртүү
router.put("/api/teachers", async (req, res)=>{
          
    if(!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const teacherFirstname = req.body.firstname;
    const teacherSecondname = req.body.secondname;
    const teacherThirdname = req.body.thirdname;
    const newTeacher = {firstname: teacherFirstname, secondname: teacherSecondname,thirdname: teacherThirdname};
    // обновляем данные пользователя по id
    const teacher = await Teacher.findOneAndUpdate({_id: id}, newTeacher, {new: true});

    if(teacher) res.json(teacher);
    else res.sendStatus(404);
});

// мугалимди жок кылуу
router.delete("/api/teachers/:id", async(req, res)=>{
          
    const id = req.params.id;
    // удаляем по id 
    const teacher = await Teacher.findByIdAndDelete(id);    
    if(teacher) res.send(teacher);
    else res.sendStatus(404);
});




// audience
// Аудиториянын бардык тизмесин чыгаруу
router.get("/api/audiences", async (req, res)=>{
    // получаем всех пользователей
    const audiences = await Audience.find({});
    res.json(audiences);
});
// Аудиторияны Id аркылуу формага таап берүү
router.get("/api/audiences/:id", async(req, res)=>{
          
    const id = req.params.id;
    // получаем одного пользователя по id
    const audience = await Audience.findById(id);
    if(audience) res.json(audience);
    else res.sendStatus(404);
});

router.post("/api/audiencesKorpus",async(req,res)=>{
    if(!req.body)return res.sendStatus(400)
    const korpus = req.body.korpus
    // получаем всех пользователей
    const audiencesKorpus = await Audience.find({korpus});
    res.json(audiencesKorpus);
})

// жаңы Аудитория түзүү
router.post("/api/audiences",async(req,res)=>{
    if(!req.body)return res.sendStatus(400)
    const {cabinet,korpus} = req.body
    const condiData = await Audience.findOne({cabinet,korpus})
    if(condiData){
        const err = `  корпус ${condiData.korpus} кабинет ${condiData.cabinet} мындай ысым жайгашылган`;
        res.json(err)
        return
    }

    const audience = await Audience.create(req.body)
    res.json(audience)

})

// Аудиториянын атын өзгөртүү
router.put("/api/audiences", async (req, res)=>{
          
    if(!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const audienceCabinet = req.body.cabinet;
    const audienceKorpus = req.body.korpus;
    const newAudience = {korpus: audienceKorpus, cabinet: audienceCabinet};
    // обновляем данные пользователя по id
    const audience = await Audience.findOneAndUpdate({_id: id}, newAudience, {new: true});

    if(audience) res.json(audience);
    else res.sendStatus(404);
});

// Аудиторияны жок кылуу
router.delete("/api/audiences/:id", async(req, res)=>{
          
    const id = req.params.id;
    // удаляем по id 
    const audience = await Audience.findByIdAndDelete(id);    
    if(audience) res.send(audience);
    else res.sendStatus(404);
});
export default router
