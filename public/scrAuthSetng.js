'use strict'
document.addEventListener("DOMContentLoaded",()=>{
    
const author = document.querySelector(".author");

const group  = document.querySelector(".group")
const teacher  = document.querySelector(".teacher")
const audience  = document.querySelector(".audience")

const grTeachAud = document.querySelector("#grTeachAud")
const form = document.querySelectorAll(".form")



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

// //
function clickButton(num){
    document.querySelectorAll(".click")[num].addEventListener("click", e => {
        form[num].classList.add("form-on")
    })
}


// Ката функциясы
const isError = document.querySelectorAll(".isError")
const isClose = document.querySelectorAll(".isClose")
const spanData = document.querySelectorAll(".spanData")



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



// // // // // // // // // // // authSetng.js connect

// Группа тизмеси орнотуу || настройка
// Получение всех пользователей
const groupFun = author.querySelector(".group")
async function getGroups() {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/groups/", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        
        const groups = await response.json();
        let rows = groupFun.querySelector("tbody"); 
        rows.innerHTML = ""
        // rows = ""
        groups.forEach(group => {
            // добавляем полученные элементы в таблицу
            rows.append(rowGroup(group));
        });
    }
}

// Получение по курсу
async function getGroupsKurs(groupKurs) {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/groupsKurs", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json"},
        body :JSON.stringify({
            kurs:parseInt(groupKurs)
        })
    })
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        
        const groupsKurs = await response.json();
        let rows = groupFun.querySelector("tbody"); 
        rows.innerHTML = ""
        groupsKurs.forEach(group => {
            // добавляем полученные элементы в таблицу
            rows.append(rowGroup(group));
        });
    }
}

// Получение одного пользователя
async function getGroup(id) {
    const response = await fetch("/api/groups/" + id, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const group = await response.json();
        const form = document.forms.groupForm;
        form.elements["id"].value = group._id;
        form.elements["name"].value = group.name;
        form.elements["kurs"].value = group.kurs;
        form.elements["quantity"].value = group.quantity;
    }
}

// Добавление пользователя
async function createGroup(groupName,groupKurs,groupQuantity){

    if(groupName == "" || groupKurs == "" || groupQuantity == ""){
        const data = `  Бош ячейкаларды толтуруңуз`
        isErrorFunc(data ,0)
        return
    }
    const response = await fetch("/api/groups",{
        method:"POST",
        headers:{"Accept":"application/json", "Content-Type": "application/json"},
        body :JSON.stringify({
            name:groupName.toUpperCase(),
            kurs:parseInt(groupKurs),
            quantity:parseInt(groupQuantity),
        })
    });
    if(response.ok === true){
        const group = await response.json();
        resetGroup()
        if(typeof group == "object"){
            groupFun.querySelector("tbody").append(rowGroup(group))
        }else{
            isErrorFunc(group,0)
        }
    }

}

// Изменение пользователя
async function editGroup(groupId, groupName, groupKurs, groupQuantity) {
    const response = await fetch("api/groups", {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            id: groupId,
            name: groupName.toUpperCase(),
            kurs: parseInt(groupKurs, 10),
            quantity:parseInt(groupQuantity),
        })
    });
    if (response.ok === true) {
        const group = await response.json();
        resetGroup();
        groupFun.querySelector(`tr[data-rowid='${group._id}']`).replaceWith(rowGroup(group));
    }
}

// удалить группа
async function deleteUser(id) {
    const response = await fetch("/api/groups/" + id, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const group = await response.json();
        groupFun.querySelector(`tr[data-rowid='${group._id}']`).remove();
    }
}

// сброс формы
function resetGroup() {
    const form = document.forms["groupForm"];
    form.reset();
    form.elements["id"].value = 0;
}

// создание строки для таблицы
function rowGroup(group) {
   
    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", group._id);

    const nameTd = document.createElement("td");
    nameTd.append(group.name);
    tr.append(nameTd);

    const ageTd = document.createElement("td");
    ageTd.append(group.kurs);
    tr.append(ageTd);
    const quantityTd = document.createElement("td");
    quantityTd.append(group.quantity);
    tr.append(quantityTd);
       
    const linksTd = document.createElement("td");

    const editLink = document.createElement("a");
    editLink.setAttribute("data-id", group._id);
    editLink.setAttribute("style", "cursor:pointer;padding:15px;");
    editLink.append("Өзгөртүү");
    editLink.addEventListener("click", e => {

        e.preventDefault();
        form[0].classList.add("form-on")
        getGroup(group._id);
    });
    linksTd.append(editLink);

    const removeLink = document.createElement("a");
    removeLink.setAttribute("data-id", group._id);
    removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
    removeLink.append("Өчүрүү");
    removeLink.addEventListener("click", e => {

        e.preventDefault();
        deleteUser(group._id);
        timer()


    });

    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    return tr;
}

// сброс значений формы
groupFun.querySelector("#reset").addEventListener("click", e => {
    e.preventDefault();
    
    form[0].classList.remove("form-on")
    resetGroup();
})
clickButton(0)


// отправка формы
document.forms["groupForm"].addEventListener("submit",(event)=>{
    event.preventDefault();
    const form = document.forms["groupForm"];
    const id = form.elements["id"].value;
    const name = form.elements["name"].value;
    const kurs = form.elements["kurs"].value;
    const quantity = form.elements["quantity"].value;
    if(id == 0){
        createGroup(name,kurs,quantity)
    }else{
        editGroup(id,name,kurs,quantity)
    }
    if(id && name && kurs,quantity){
        const formDob = document.querySelectorAll(".form")[0]
        formDob.classList.remove("form-on")
        timer()
    }


})


getGroups()

const slctKurs = groupFun.querySelector("#kurs")
slctKurs.addEventListener("change",()=>{
    if(slctKurs.value == ""){
    getGroups()
    }
    else{
    getGroupsKurs(slctKurs.value)
    const form = document.forms["groupForm"];
    form.elements["kurs"].value = slctKurs.value;
    }
})






// Мугалим тизмеси орнотуу || настройка
// Получение всех пользователей
const teacherFun = author.querySelector(".teacher")
async function getTeachers() {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/teachers/", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        
        const teachers = await response.json();
        let rows = teacherFun.querySelector("tbody"); 
        rows.innerHTML = ""
        // rows = ""
        teachers.forEach(teacher => {
            // добавляем полученные элементы в таблицу
            rows.append(rowTeacher(teacher));
        });
    }
}


// Получение одного пользователя
async function getTeacher(id) {
    const response = await fetch("/api/teachers/" + id, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const teacher = await response.json();
        const form = document.forms["teacherForm"];
        form.elements["id"].value = teacher._id;
        form.elements["firstname"].value = teacher.firstname;
        form.elements["secondname"].value = teacher.secondname;
        form.elements["thirdname"].value = teacher.thirdname;
    }
}

// Добавление пользователя
async function createTeacher(teacherFirstname,teacherSecondname,teacherThirdname){

    if(teacherFirstname == "" || teacherSecondname == "" || teacherThirdname == ""){
        const data = `  Бош ячейкаларды толтуруңуз`
        isErrorFunc(data, 1)
        return
    }
    const response = await fetch("/api/teachers",{
        method:"POST",
        headers:{"Accept":"application/json", "Content-Type": "application/json"},
        body :JSON.stringify({
            firstname:teacherFirstname,
            secondname:teacherSecondname,
            thirdname:teacherThirdname
        })
    });
    if(response.ok === true){
        const teacher = await response.json();
        resetTeacher()
        if(typeof teacher == "object"){
            teacherFun.querySelector("tbody").append(rowTeacher(teacher))
        }else{
            isErrorFunc(teacher,1)
        }
        
    }

}

// Изменение пользователя
async function editTeacher(teacherId, teacherFirstname, teacherSecondname,teacherThirdname) {
    const response = await fetch("api/teachers", {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            id: teacherId,
            firstname: teacherFirstname,
            secondname: teacherSecondname,
            thirdname:teacherThirdname
        })
    });
    if (response.ok === true) {
        const teacher = await response.json();
        resetTeacher();
        teacherFun.querySelector(`tr[data-rowid='${teacher._id}']`).replaceWith(rowTeacher(teacher));
    }
}
// удалить группа
async function deleteTeacher(id) {
    const response = await fetch("/api/teachers/" + id, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const teacher = await response.json();
        teacherFun.querySelector(`tr[data-rowid='${teacher._id}']`).remove();
    }
}

// сброс формы
function resetTeacher() {
    const form = document.forms["teacherForm"];
    form.reset();
    form.elements["id"].value = 0;
}

// создание строки для таблицы
function rowTeacher(teacher) {
   
    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", teacher._id);
    
    const firstnameTd = document.createElement("td");
    firstnameTd.append(teacher.firstname);
    tr.append(firstnameTd);

    const secondnameTd = document.createElement("td");
    secondnameTd.append(teacher.secondname);
    tr.append(secondnameTd);

    const thirdnameTd = document.createElement("td");
    thirdnameTd.append(teacher.thirdname);
    tr.append(thirdnameTd);
       
    const linksTd = document.createElement("td");

    const editLink = document.createElement("a");
    editLink.setAttribute("data-id", teacher._id);
    editLink.setAttribute("style", "cursor:pointer;padding:15px;");
    editLink.append("Өзгөртүү");
    editLink.addEventListener("click", e => {

        e.preventDefault();
        form[1].classList.add("form-on")
        getTeacher(teacher._id);
    });
    linksTd.append(editLink);

    const removeLink = document.createElement("a");
    removeLink.setAttribute("data-id", teacher._id);
    removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
    removeLink.append("Өчүрүү");
    removeLink.addEventListener("click", e => {

        e.preventDefault();
        deleteTeacher(teacher._id);
    });

    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    return tr;
}

// сброс значений формы
teacherFun.querySelector("#reset").addEventListener("click", e => {
    e.preventDefault();
    form[1].classList.remove("form-on")
    resetTeacher();
})
clickButton(1)


// отправка формы
document.forms["teacherForm"].addEventListener("submit",(event)=>{
    event.preventDefault();
    const form = document.forms["teacherForm"];
    const id = form.elements["id"].value;
    const firstname = form.elements["firstname"].value;
    const secondname = form.elements["secondname"].value;
    const thirdname = form.elements["thirdname"].value;
    if(id == 0){
        createTeacher(firstname,secondname,thirdname)
    }else{
        editTeacher(id,firstname,secondname,thirdname)
    }
    if(id && firstname && secondname && thirdname){
        const formDob = document.querySelectorAll(".form")[1]
        formDob.classList.remove("form-on")
    }
})


getTeachers()






// Аудитория тизмеси орнотуу || настройка
// Получение всех пользователей

const audienceFun = author.querySelector(".audience")
async function getAudiences() {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/audiences/", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        
        const audiences = await response.json();
        let rows = audienceFun.querySelector("tbody"); 
        rows.innerHTML = ""
        // rows = ""
        audiences.forEach(audience => {
            // добавляем полученные элементы в таблицу
            rows.append(rowAudience(audience));
        });
    }
}
// Получение по курсу
async function getAudiencesKorpus(audienceKorpus) {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/audiencesKorpus", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json"},
        body :JSON.stringify({
            korpus:parseInt(audienceKorpus)
        })
    })
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        
        const audienceKorpus = await response.json();
        let rows = audienceFun.querySelector("tbody"); 
        rows.innerHTML = ""
        audienceKorpus.forEach(audience => {
            // добавляем полученные элементы в таблицу
            rows.append(rowAudience(audience));
        });
    }
}

// Получение одного пользователя
async function getAudience(id) {
    const response = await fetch("/api/audiences/" + id, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const audience = await response.json();
        const form = document.forms["audienceForm"];
        form.elements["id"].value = audience._id;
        form.elements["cabinet"].value = audience.cabinet;
        form.elements["korpus"].value = audience.korpus;
    }
}

// Добавление пользователя
async function createAudience(audienceCabinet,audienceKorpus){

    if(audienceCabinet == "" || audienceKorpus == ""){
        const data = `  Бош ячейкаларды толтуруңуз`
        isErrorFunc(data,2)
        return
    }
    const response = await fetch("/api/audiences",{
        method:"POST",
        headers:{"Accept":"application/json", "Content-Type": "application/json"},
        body :JSON.stringify({
            cabinet:audienceCabinet,
            korpus:audienceKorpus
        })
    });
    if(response.ok === true){
        const audience = await response.json();
        resetAudience()
        if(typeof audience == "object"){
            audienceFun.querySelector("tbody").append(rowAudience(audience))
        }else{
            isErrorFunc(audience,2)
        }
        
    }

}

// Изменение пользователя
async function editAudience(audiencerId, audienceCabinet, audienceKorpus) {
    const response = await fetch("api/audiences", {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            id: audiencerId,
            cabinet: audienceCabinet,
            korpus: audienceKorpus
        })
    });
    if (response.ok === true) {
        const audience = await response.json();
        resetAudience();
        audienceFun.querySelector(`tr[data-rowid='${audience._id}']`).replaceWith(rowAudience(audience));
    }
}
// удалить группа
async function deleteAudience(id) {
    const response = await fetch("/api/audiences/" + id, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const audience = await response.json();
        audienceFun.querySelector(`tr[data-rowid='${audience._id}']`).remove();
    }
}

// сброс формы
function resetAudience() {
    const form = document.forms["audienceForm"];
    form.reset();
    form.elements["id"].value = 0;
}

// создание строки для таблицы
function rowAudience(audience) {
   
    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", audience._id);
    
    const korpusTd = document.createElement("td");
    korpusTd.append(audience.korpus);
    tr.append(korpusTd);

    const cabinetTd = document.createElement("td");
    cabinetTd.append(audience.cabinet);
    tr.append(cabinetTd);
       
    const linksTd = document.createElement("td");

    const editLink = document.createElement("a");
    editLink.setAttribute("data-id", audience._id);
    editLink.setAttribute("style", "cursor:pointer;padding:15px;");
    editLink.append("Өзгөртүү");
    editLink.addEventListener("click", e => {

        e.preventDefault();
        form[2].classList.add("form-on")
        getAudience(audience._id);
    });
    linksTd.append(editLink);

    const removeLink = document.createElement("a");
    removeLink.setAttribute("data-id", audience._id);
    removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
    removeLink.append("Өчүрүү");
    removeLink.addEventListener("click", e => {

        e.preventDefault();
        deleteAudience(audience._id);
    });

    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    return tr;
}

// сброс значений формы
audienceFun.querySelector("#reset").addEventListener("click", e => {
    e.preventDefault();
    form[2].classList.remove("form-on")
    resetAudience();
})
clickButton(2)


// отправка формы
document.forms["audienceForm"].addEventListener("submit",(event)=>{
    event.preventDefault();
    const form = document.forms["audienceForm"];
    const id = form.elements["id"].value;
    const cabinet = form.elements["cabinet"].value;
    const korpus = form.elements["korpus"].value;
    if(id == 0){
        createAudience(cabinet,korpus)
    }else{
        editAudience(id,cabinet,korpus)
    }
    if(id && cabinet && korpus){
        const formDob = document.querySelectorAll(".form")[2]
        formDob.classList.remove("form-on")
    }
})


getAudiences()
const slctKorpus = audienceFun.querySelector("#frame")
slctKorpus.addEventListener("change",()=>{
    if(slctKorpus.value == ""){
    getAudiences()
    const form = document.forms["audienceForm"];
    form.elements["korpus"].value = slctKorpus.value;
    }
    else{
    getAudiencesKorpus(slctKorpus.value)
    const form = document.forms["audienceForm"];
    form.elements["korpus"].value = slctKorpus.value;
    }
})

})


// timer
// 
// 
// 
function timer(){
    const group  = document.querySelector(".group")
    const mainContainer = document.querySelector(".main-container")
    const semicircles = document.querySelectorAll(".semicircle")
    const timer = document.querySelector(".timer")
    const tableComp = group.querySelector(".table_comp")
    tableComp.style.opacity = "0"

    mainContainer.style.transform = "scale(1)";
    semicircles[0].style.transform = "scale(1)"
    semicircles[1].style.transform = "scale(1)"
    semicircles[2].style.transform = "scale(1)"
    // input
    const hr = 0;
    const min = 0;
    const sec = 15;
    
    const hours = hr*3600000;
    const minutes = min*60000;
    const seconds = sec*1000;
    
    const setTime = hours + minutes + seconds;
    const startTime = Date.now()
    const furureTime = startTime + setTime
    
    const timerLoop = setInterval(countDownTimer)
    countDownTimer()
    
    function countDownTimer(){
        const currentTime = Date.now()
        const reaminingTime = furureTime - currentTime
        const angle = (reaminingTime / setTime)*360
        // progress indicator
        if(angle>180){
            semicircles[2].style.display = "none";
            semicircles[0].style.transform = "rotate(180deg)";
            semicircles[1].style.transform = `rotate(${angle}deg)`;
        }else{
            semicircles[2].style.display = "block";
            semicircles[0].style.transform = `rotate(${angle}deg)`;
            semicircles[1].style.transform = `rotate(${angle}deg)`;
        }
    
        // timer
        const secs = Math.floor((reaminingTime / 1000 ) % 60).toLocaleString('en-US',{minimumIntegerDigits:2,useGrouping:false});
    
        timer.innerHTML = `
        <div>${secs}</div> 
        `
    
        // 5sec-condition
        if(reaminingTime<=6000){
            semicircles[0].style.backgroundColor = "red";
            semicircles[1].style.backgroundColor = "red";
            timer.style.color = "red"
        }
    
        // end
        if(reaminingTime<0){
            clearInterval(timerLoop)
            semicircles[0].style.transform = "scale(0)"
            semicircles[1].style.transform = "scale(0)"
            semicircles[2].style.transform = "scale(0)"
            semicircles[0].style.backgroundColor = "#088b8b";
            semicircles[1].style.backgroundColor = "#088b8b";
            timer.style.color = "#088b8b"
            mainContainer.style.transform = "scale(0)"
            tableComp.style.opacity = "1"

    
        }
    }

}