'use strict'
document.addEventListener("DOMContentLoaded",()=>{
const isError = document.querySelector(".isError")
const isClose = document.querySelector(".isClose")
const spanData = document.querySelector(".spanData")


        // function isErrorFunc(data){
        //     spanData.innerHTML = data
        //     isError.style.transform = "scale(1)";
        //     isClose.addEventListener("mouseenter",()=>{
        //         isClose.classList.replace("bi-x-octagon","bi-x-octagon-fill")
        //     })
        //     isClose.addEventListener("mouseleave",()=>{
        //         isClose.classList.replace("bi-x-octagon-fill","bi-x-octagon")
        //     })
        //     isClose.addEventListener("click",()=>{
        //         isError.style.transform = "scale(0)";
        //     })
        // }
isClose.addEventListener("mouseenter",()=>{
    isClose.classList.replace("bi-x-octagon","bi-x-octagon-fill")
})
isClose.addEventListener("mouseleave",()=>{
    isClose.classList.replace("bi-x-octagon-fill","bi-x-octagon")
})
isClose.addEventListener("click",()=>{
    isError.style.transform = "scale(0)";
})

// async function getLogin(login, password) {
//     if(!login || !password){
//         const data = `  Бош ячейкаларды толтуруңуз`
//         isErrorFunc(data)
//         return
//     }
//     const response = await fetch("/login", {
//         method: "post",
//         headers: { "Accept": "application/json", "Content-Type": "application/json" },
//         body: JSON.stringify({
//             login: login,
//             password: password
//         })
//     });
//     if (response.ok === true) {
//         const login = await response.json();
//     }
//     if(!login){
//         const data = "Логин же пароль туура эмес"
//         isErrorFunc(data)
//     }
// }
// document.forms["formLogin"].addEventListener("submit",(event)=>{
//     event.preventDefault();
//     const form = document.forms["formLogin"];
//     const login = form.elements["login"].value;
//     const password = form.elements["password"].value
//     getLogin(login,password)
// })



// // // // // // //
})