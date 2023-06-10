
const index = document.querySelector(".index");

const group  = document.querySelector(".group")
const teacher  = document.querySelector(".teacher")
const audience  = document.querySelector(".audience")

const grTeachAud = document.querySelector("#grTeachAud")

function block(grTeachAudEquals,dataNone1,dataNone2,dataBlock){
    if(grTeachAud.value == grTeachAudEquals){
        dataBlock.style.cssText = "display:block;"
        dataNone1.style.cssText = "display:none;"
        dataNone2.style.cssText = "display:none;"
    }
}
grTeachAud.addEventListener("change",()=>{
    block("group",teacher,audience,group)
    block("teacher",audience,group,teacher)
    block("audience",group,teacher,audience)
})

function clearTd(classBlock){
    const tbody = classBlock.querySelector("tbody")
    const td = tbody.querySelectorAll("td") 
    // console.log(td[0].innerHTML)
    for (let element of td){
        if(element.innerHTML == 4){
            continue
        }else if(element.innerHTML == 3){
            continue
        }else if(element.innerHTML == 2){
            continue
        }else if(element.innerHTML == 1){
            continue
        }
        element.innerHTML = ''
    }
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
        let groupIndex = index.querySelector("#group"); 
        groupIndex.innerHTML = "<option value ='' hidden>Выберите группу</option>"
        kursGroups.forEach(group => {
            // добавляем полученные элементы в таблицу
            const nameTd = document.createElement("option");
            nameTd.setAttribute("value", group.name);
            nameTd.append(group.name);
            groupIndex.append(nameTd);
        });
    }
}


async function getIndex(group,semester) {
    const indexFun = index.querySelector(".group")
    const tbody = indexFun.querySelector("tbody");

    const swiperWrapper = indexFun.querySelector(".swiper-wrapper")
    swiperWrapper.style.opacity = "1";
    tbody.style.display = "contents";



    // отправляет запрос и получаем ответ
    const response = await fetch("/api/index/group", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body :JSON.stringify({
            group:group,
            semester:semester,
        })
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const groupSchedules = await response.json();
        groupSchedules.forEach(schedule => {
            // добавляем полученные элементы в таблицу
            const tr = tbody.querySelector(`tr[data-pair='${schedule.pair}']`)
            const td = tr.querySelector(`td[data-day='${schedule.day}']`)
            const br = document.createElement("br")
            
            // function phone
            const divDay = indexFun.querySelector(`div[data-day='${schedule.day}']`)
            const divPair = divDay.querySelector(`div[data-pair='${schedule.pair}']`)
            const spanLesson = divPair.querySelector('span')
            const spanEduction = divPair.querySelector('.education')
            
            const pTeacher = divPair.querySelector('.slide_teacher_name')
            const spanTeacher = pTeacher.querySelector('span')

            const pTime = divPair.querySelector('.slide_time')
            const spantime = pTime.querySelector('span')
            
            const pAudience = divPair.querySelector('.slide_audience_name')
            const sAudience = pAudience.querySelector('span')
            spanEduction.innerHTML = "";
            spanLesson.innerHTML = schedule.lesson


            td.append(schedule.lesson);

            if (schedule.lecture == "pr"){
                spanEduction.innerHTML = "Пр";
                td.append("(Пр)");

            }else if(schedule.lecture == "lk"){
                spanEduction.innerHTML = "Лк";
                spanEduction.style.background = "red"
                td.append("(Лк)");


            }else if(schedule.lecture == "lb"){
                spanEduction.innerHTML = "Лб";
                td.append("(Лб)");
            }


            td.append(br);
            getTeacher(schedule.teacherId).then((data)=>{
                spanTeacher.innerHTML = data
                td.append(data);
            }).then(()=>{
                getRoom(schedule.roomId).then((data)=>{
                    if (data) {
                        td.append(`[${data}]`);
                    }
                    sAudience.innerHTML = data
                    spantime.innerHTML = `${schedule.firstTime} - ${schedule.secondTime}`
                })
            })

        });

    }
}

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




function slcGetIndex(group,semester){
    if(group && semester){
        getIndex(group,semester)
    }
}


const kursSched = group.querySelector("#kurs")
const slctSemester = group.querySelector("#semester")
const slctGroup = group.querySelector("#group")


kursSched.addEventListener("change",()=>{
    getGroupsName(kursSched);
    const tbody = group.querySelector("tbody")
    const swiperWrapper = group.querySelector(".swiper-wrapper")
    tbody.style.display = "none"
    swiperWrapper.style.opacity = "0"


})

slctSemester.addEventListener("change",()=>{
    clearTd(group)
    slcGetIndex(slctGroup.value,slctSemester.value)
})
    clearTd(group)
slctGroup.addEventListener("change",()=>{
    clearTd(group)
    slcGetIndex(slctGroup.value,slctSemester.value)
})







// // // // // // // // Teacher

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
        let teacherSched = teacher.querySelector("#teacher"); 
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


function funcForEach(data){
    data.forEach(index =>{
        index.innerHTML = ""
    })
}

async function getTeacherSched(teacherId,semester) {

    const tbody = teacher.querySelector("tbody");
    tbody.style.display = "contents";

    const lesson = teacher.querySelectorAll(".lesson")
    const education = teacher.querySelectorAll(".education")
    const teacherName = teacher.querySelectorAll(".teacher_name")
    const audienceName = teacher.querySelectorAll(".audience_name")
    const time = teacher.querySelectorAll(".time")
    funcForEach(lesson)
    funcForEach(education)
    funcForEach(teacherName)
    funcForEach(audienceName)
    funcForEach(time)
    
    const swiperWrapper = teacher.querySelector(".swiper-wrapper")
    swiperWrapper.style.opacity = "1";

    const response = await fetch("/api/index/teacher", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body :JSON.stringify({
            teacherId:teacherId,
            semester:semester
        })
    });
    if (response.ok === true) {
        // получаем данные
        const teacherSchedules = await response.json();
        teacherSchedules.forEach(schedule => {
            // добавляем полученные элементы в таблицу
            const tr = tbody.querySelector(`tr[data-pair='${schedule.pair}']`)
            const td = tr.querySelector(`td[data-day='${schedule.day}']`)
            const br = document.createElement("br")

            td.append(schedule.lesson);
            
            const divDay = teacher.querySelector(`div[data-day='${schedule.day}']`)
            const divPair = divDay.querySelector(`div[data-pair='${schedule.pair}']`)
            const spanLesson = divPair.querySelector('.lesson')
            const spanEduction = divPair.querySelector('.education')
            const spanTime = divPair.querySelector('.time')
        
            const spanTeacher = divPair.querySelector('.teacher_name')
            
            const sAudience = divPair.querySelector('.audience_name')
            spanEduction.innerHTML = "";
            spanLesson.innerHTML = schedule.lesson
            spanTime.innerHTML = `${schedule.firstTime} - ${schedule.secondTime}`



            if (schedule.lecture == "pr"){
                spanEduction.innerHTML = "Пр";
                spanEduction.style.background = "#636f83"
                td.append("(Пр)");

            }else if(schedule.lecture == "lk"){
                spanEduction.innerHTML = "Лк";
                spanEduction.style.background = "red"
                td.append("(Лк)");


            }else if(schedule.lecture == "lb"){
                spanEduction.innerHTML = "Лб";
                spanEduction.style.background = "#636f83"
                td.append("(Лб)");
            }


            td.append(br);
            
            getRoom(schedule.roomId).then((data)=>{
                spanTeacher.innerHTML = schedule.group
                sAudience.innerHTML = data
                td.append(schedule.group);
                if (data) {
                    td.append(`[${data}]`);
                }
            })


        });
        

    }
}


function slcGetIndexTeacher(teacher,semester){
    if(teacher && semester){
        getTeacherSched(teacher,semester)
    }
}


const slctSemesterTeacher = teacher.querySelector("#semester")
const slctTeacher = teacher.querySelector("#teacher")

slctSemesterTeacher.addEventListener("change",()=>{
    clearTd(teacher)
    slcGetIndexTeacher(slctTeacher.value,slctSemesterTeacher.value)
})
slctTeacher.addEventListener("change",()=>{
    clearTd(teacher)
    slcGetIndexTeacher(slctTeacher.value,slctSemesterTeacher.value)
})





// // // // // //  //  // // // // // // // // // audience


async function getAudience(frame) {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/korpus/"+frame.value, {
        method: "GET",
        headers: { "Accept": "application/json"}
    })
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        
        const audience = await response.json();
        const audienceIndex = index.querySelector("#audience"); 
        audienceIndex.innerHTML = "<option value ='' hidden>Выберите группу</option>"
        audience.forEach(element => {
            // добавляем полученные элементы в таблицу
            const nameTd = document.createElement("option");
            nameTd.setAttribute("value", element._id);
            nameTd.append(element.cabinet);
            audienceIndex.append(nameTd);
        });
    }
}






// // // // // // // //

async function getAudienceSched(audienceId,semester) {
    

    const tbody = audience.querySelector("tbody");
    tbody.style.display = "contents";


    const lesson = audience.querySelectorAll(".lesson")
    const education = audience.querySelectorAll(".education")
    const teacherName = audience.querySelectorAll(".teacher_name")
    const audienceName = audience.querySelectorAll(".audience_name")
    const time = audience.querySelectorAll(".time")
    funcForEach(lesson)
    funcForEach(education)
    funcForEach(teacherName)
    funcForEach(audienceName)
    funcForEach(time)
    
    const swiperWrapper = audience.querySelector(".swiper-wrapper")
    swiperWrapper.style.opacity = "1";

    const response = await fetch("/api/index/audience", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body :JSON.stringify({
            roomId:audienceId,
            semester:semester
        })
    });
    if (response.ok === true) {
        // получаем данные
        const audienceSchedules = await response.json();
        audienceSchedules.forEach(schedule => {
            // добавляем полученные элементы в таблицу
            const tr = tbody.querySelector(`tr[data-pair='${schedule.pair}']`)
            const td = tr.querySelector(`td[data-day='${schedule.day}']`)
            const br = document.createElement("br")
            td.append(schedule.lesson);
            td.append(br);

            const divDay = audience.querySelector(`div[data-day='${schedule.day}']`)
            const divPair = divDay.querySelector(`div[data-pair='${schedule.pair}']`)
            const spanLesson = divPair.querySelector('.lesson')
            const spanEduction = divPair.querySelector('.education')
            
            const spanTeacher = divPair.querySelector('.teacher_name')
            
            const sAudience = divPair.querySelector('.audience_name')
            const spanTime = divPair.querySelector('.time')

            spanEduction.innerHTML = "";
            spanLesson.innerHTML = schedule.lesson
            spanTime.innerHTML = `${schedule.firstTime} - ${schedule.secondTime}`

            
            if (schedule.lecture == "pr"){
                spanEduction.innerHTML = "Пр";
                spanEduction.style.background = "#636f83"
                td.append("(Пр)");

            }else if(schedule.lecture == "lk"){
                spanEduction.innerHTML = "Лк";
                spanEduction.style.background = "red"
                td.append("(Лк)");
                
                
            }else if(schedule.lecture == "lb"){
                spanEduction.innerHTML = "Лб";
                spanEduction.style.background = "#636f83"
                td.append("(Лб)");
            }

            td.append(schedule.group);
            spanTeacher.innerHTML = schedule.group
            getTeacher(schedule.teacherId).then((data)=>{
                sAudience.innerHTML = data
                td.append(data);
            })
        });
        

    }
}


function slcGetIndexAudience(audience,semester){
    if(audience && semester){
        getAudienceSched(audience,semester)
    }
}

const frameSched = audience.querySelector("#frame")



frameSched.addEventListener("change",()=>{
    getAudience(frameSched);
    const tbody = audience.querySelector("tbody")
    tbody.style.display = "none"
    const swiperWrapper = audience.querySelector(".swiper-wrapper")
    swiperWrapper.style.opacity = "0"


})

const slctSemesterAudience = audience.querySelector("#semester")
const slctAudience = audience.querySelector("#audience")

slctSemesterAudience.addEventListener("change",()=>{
    clearTd(audience)
    slcGetIndexAudience(slctAudience.value,slctSemesterAudience.value)
})
slctAudience.addEventListener("change",()=>{
    clearTd(audience)
    slcGetIndexAudience(slctAudience.value,slctSemesterAudience.value)
})

const day = ["Дш", "Шш", "Шр", "Бш", "Жм", "Иш"]
new Swiper(".mySwiper",
{
    // navigation: {
    //     nextEl: ".swiper-button-next",
    //     prevEl: ".swiper-button-prev",
    // },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        renderBullet: (index, className) => {
            return `<span class= '${className}'>${day[index]}</span>`
        }
    },
    keyboard: true,
    mousewheel: true,
    // loop:true        
}
)


