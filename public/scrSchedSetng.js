// 'use strict'
document.addEventListener("DOMContentLoaded",()=>{
const schedule = document.querySelector(".schedule")
const isError = document.querySelectorAll(".isError")
const isClose = document.querySelectorAll(".isClose")
const spanData = document.querySelectorAll(".spanData")
const form = document.querySelector(".form")

// isError function
function isErrorFunc(data, index){
    spanData[index].innerHTML = data
    isError[index].style.transform = "scale(1)";
    isClose[index].addEventListener("mouseenter",()=>{
        isClose[index].classList.replace("bi-x-octagon","bi-x-octagon-fill")
    })
    isClose[index].addEventListener("mouseleave",()=>{
        isClose[index].classList.replace("bi-x-octagon-fill","bi-x-octagon")
    })
    isClose[index].addEventListener("click",()=>{
        isError[index].style.transform = "scale(0)";
    })
}


async function getGroupsName(kurs) {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/groupsName/"+kurs.value, {
        method: "GET",
        headers: { "Accept": "application/json"}
    })
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        
        const kursGroups = await response.json();
        let groupSched = schedule.querySelector("#group"); 
        groupSched.innerHTML = "<option value ='' hidden>Группаны тандаңыз</option>"
        kursGroups.forEach(group => {
            // добавляем полученные элементы в таблицу
            const nameTd = document.createElement("option");
            nameTd.setAttribute("value", group.name);
            nameTd.append(group.name);
            groupSched.append(nameTd);
        });
    }
}



async function getTeachersName() {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/teachersName", {
        method: "GET",
        headers: { "Accept": "application/json"}
    })
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        
        const teachersName = await response.json();
        let teacherSched = schedule.querySelector("#teacher"); 
        teachersName.forEach(teacher => {
            // добавляем полученные элементы в таблицу
            const nameTd = document.createElement("option");
            nameTd.setAttribute("value", teacher._id);
            nameTd.append(`${teacher.firstname} ${teacher.secondname} ${teacher.thirdname}`);
            teacherSched.append(nameTd);
        });
    }
}
getTeachersName()

async function getCabinetName() {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/cabinetName", {
        method: "GET",
        headers: { "Accept": "application/json"}
    })
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        
        const cabinetName = await response.json();
        let cabinetSched = schedule.querySelector("#cabinet"); 
        cabinetName.forEach(cabinet => {
            // добавляем полученные элементы в таблицу
            const nameTd = document.createElement("option");
            nameTd.setAttribute("value", cabinet._id);
            nameTd.append(`${cabinet.korpus}/${cabinet.cabinet}`);
            cabinetSched.append(nameTd);
        });
    }
}
getCabinetName()

async function getSchedules(group,semester,day) {
    const schedFun = schedule.querySelector(".group")
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/schedules/", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body :JSON.stringify({
            group:group,
            semester:semester,
            day:day || 1
        })
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        
        const schedules = await response.json();
        let rows = schedFun.querySelector("tbody");
        rows.innerHTML = ""
        schedules.forEach(schedule => {
            // добавляем полученные элементы в таблицу
            rows.append(rowSchedule(schedule));
        });
    }
}
// Получение одного пользователя
async function getSchedule(id) {
    const response = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body :JSON.stringify({
            id:id,
        })
    });
    if (response.ok === true) {
        const schedule = await response.json();
        const form = document.forms.groupSchedForm;
        form.elements["id"].value = schedule._id;
        form.elements["lesson"].value = schedule.lesson
        form.elements["teacher"].value = schedule.teacherId;
        form.elements["cabinet"].value = schedule.roomId;
        form.elements["lecture"].value = schedule.lecture;
        form.elements["firstTime"].value = schedule.firstTime;
        form.elements["secondTime"].value = schedule.secondTime;

    }
}

async function clearUser(id) {
    const response = await fetch("/api/clearschedule", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body :JSON.stringify({
            id:id,
        })
    });
    if (response.ok === true) {
        const schedule = await response.json();
        resetSchedule();
        document.querySelector(`tr[data-rowid='${schedule._id}']`).replaceWith(rowSchedule(schedule));
    }
}


async function editSchedule(schedId, schedLesson, teacherId,cabinetId,lecture,firstTime,secondTime) {
    if(!schedId || !schedLesson || !teacherId || !cabinetId || !lecture || !firstTime || !secondTime){
        const data = `  Бош ячейкаларды толтуруңуз`
        isErrorFunc(data ,0)
        return
    }

    const group = schedule.querySelector("#group").value
    const response = await fetch("api/schedule", {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            id: schedId,
            lesson: schedLesson,
            teacherId: teacherId,
            cabinetId:cabinetId,
            lecture:lecture,
            firstTime:firstTime,
            secondTime:secondTime,
        })
    });
    if (response.ok === true) {
        const schedule = await response.json();
        if(typeof(schedule) == "object"){
            const formDob = document.querySelector(".form")
            formDob.classList.remove("form-on")
            resetSchedule();
            document.querySelector(`tr[data-rowid='${schedule._id}']`).replaceWith(rowSchedule(schedule));
        }
        else{
            isErrorFunc(schedule ,0)
            return
        }
    }

}




// промис болуп калыптр
function getTeacher(id){
    return new Promise(async(resolve,reject) =>{
        if(id){
            const response = await fetch("/api/teacher/" + id, {
                method: "GET",
                headers: { "Accept": "application/json" }
            });
            if (response.ok === true) {
                const teacher = await response.json();
                if(teacher){
                    const strTeacher = `${teacher.firstname} ${teacher.secondname[0]} ${teacher.thirdname[0]}`;
                    resolve(strTeacher)
                }else{
                    resolve("")
                }
                
            }
        }else{
            resolve("")
        }
    })
}

function getRoom(id){
    return new Promise(async(resolve,reject) =>{
        if(id){
            const response = await fetch("/api/room/" + id, {
                method: "GET",
                headers: { "Accept": "application/json" }
            });
            if (response.ok === true) {
                const room = await response.json();
                if(room){
                    const strRoom = `${room.korpus}/${room.cabinet}`;
                    resolve(strRoom)
                }else{
                    resolve("")
                }
            }
        }else{
            resolve("")
        }
    })
}


// 
function resetSchedule() {
    const form = document.forms["groupSchedForm"];
    form.reset();
}

function rowSchedule(schedule) {

    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", schedule._id);

    const pairTd = document.createElement("td");
    pairTd.append(schedule.pair);
    tr.append(pairTd);
    
    const lessonTd = document.createElement("td");
    lessonTd.append(schedule.lesson);
    tr.append(lessonTd);

    const lecture = document.createElement("td");
    if (schedule.lecture == "pr"){
        lecture.append("практика");
    }else if(schedule.lecture == "lk"){
        lecture.append("лекция");
    }else if(schedule.lecture == "lb"){
        lecture.append("лаброратория");
    }
    tr.append(lecture);

    getTeacher(schedule.teacherId).then((data)=>{
        const teacherIdTd = document.createElement("td");
        teacherIdTd.append(data);
        tr.append(teacherIdTd);
    }).then(()=>{
        getRoom(schedule.roomId).then((data)=>{
            const roomIdTd = document.createElement("td");
            roomIdTd.append(data);
            tr.append(roomIdTd);
        }).then(()=>{
            const time = document.createElement("td");
            time.append(`${schedule.firstTime} - ${schedule.secondTime}`)
            tr.append(time)
            const linksTd = document.createElement("td");
        
            const editLink = document.createElement("a");
            editLink.setAttribute("data-id", schedule._id);
            editLink.setAttribute("style", "cursor:pointer;padding:15px;");
            editLink.append("Өзгөртүү");
            editLink.addEventListener("click", e => {
        
                e.preventDefault();
                form.classList.add("form-on")
                getSchedule(schedule._id);
            });
            linksTd.append(editLink);
            tr.appendChild(linksTd);

            const removeLink = document.createElement("a");
            removeLink.setAttribute("data-id", schedule._id);
            removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
            removeLink.append("Тазалоо");
            removeLink.addEventListener("click", e => {
        
                e.preventDefault();
                clearUser(schedule ._id);
            });
        
            linksTd.append(removeLink);
        })

    })



    
    return tr;
}

document.querySelector("#reset").addEventListener("click", e => {
    e.preventDefault();
    form.classList.remove("form-on")
    resetSchedule();
})


const teacher = document.querySelector("#teacher")


document.forms["groupSchedForm"].addEventListener("submit",(event)=>{
    event.preventDefault();
    const form = document.forms["groupSchedForm"];
    const id = form.elements["id"].value;
    const lesson = form.elements["lesson"].value;
    const teacher = form.elements["teacher"].value
    const cabinet = form.elements["cabinet"].value
    const lecture = form.elements["lecture"].value
    const firstTime = form.elements["firstTime"].value
    const secondTime = form.elements["secondTime"].value

    editSchedule(id,lesson,teacher,cabinet,lecture,firstTime,secondTime)

})






function slcGetSchedule(group,semester){
    if(group && semester){
        getSchedules(group,semester)
    }
}

function clkGetDaySched(group,semester,day){
    if(group && semester && day){
        getSchedules(group,semester,day)
    }
}

const kursSched = schedule.querySelector("#kurs")
const slctSemester = schedule.querySelector("#semester")
const slctGroup = schedule.querySelector("#group")
const result = schedule.querySelector(".result")
const button = result.querySelectorAll("button")

kursSched.addEventListener("change",()=>{
    getGroupsName(kursSched);

})

slctSemester.addEventListener("change",()=>{
    slcGetSchedule(slctGroup.value,slctSemester.value)
})
slctGroup.addEventListener("change",()=>{
    slcGetSchedule(slctGroup.value,slctSemester.value)
})

button[0].addEventListener("click",()=>{
    clkGetDaySched(slctGroup.value,slctSemester.value,1)
})
button[1].addEventListener("click",()=>{
    clkGetDaySched(slctGroup.value,slctSemester.value,2)
})
button[2].addEventListener("click",()=>{
    clkGetDaySched(slctGroup.value,slctSemester.value,3)
})
button[3].addEventListener("click",()=>{
    clkGetDaySched(slctGroup.value,slctSemester.value,4)
})
button[4].addEventListener("click",()=>{
    clkGetDaySched(slctGroup.value,slctSemester.value,5)
})
button[5].addEventListener("click",()=>{
    clkGetDaySched(slctGroup.value,slctSemester.value,6)
})

})