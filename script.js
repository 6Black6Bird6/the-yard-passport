// =====================================
// THE YARD EXPERIENCE
// MEMBER PASSPORT SYSTEM
// =====================================


const API_URL =
"https://script.google.com/macros/s/AKfycbwqYmHMe-HAEUab2LbDZwSM8aoi-nnN7x37wf1s3tPJiZMoQH-wE3iHTsyMOw_JYu9vOw/exec";




// DEFAULT MEMBER

let member = {

name:"Welcome",

memberId:"",

xp:0,

visits:0,

events:0,

level:"🍊 NEW EXPLORER"

};





// ================================
// LEVEL DISPLAY
// ================================


function loadMember(){


document
.getElementById("memberName")
.textContent =
member.name;



document
.getElementById("memberId")
.textContent =
"Member ID: " + member.memberId;



document
.querySelector(".level-badge")
.textContent =
member.level;



document
.getElementById("xpValue")
.textContent =
member.xp + " XP";



document
.getElementById("visitCount")
.textContent =
member.visits;



document
.getElementById("eventCount")
.textContent =
member.events;




let progress =
(member.xp / 250) * 100;



if(progress > 100)
progress = 100;



document
.getElementById("xpProgress")
.style.width =
progress + "%";


}






// =================================
// REGISTER NEW MEMBER
// =================================


async function registerMember(){



const name =
document
.getElementById("nameInput")
.value;



const email =
document
.getElementById("emailInput")
.value;



const phone =
document
.getElementById("phoneInput")
.value;



const birthday =
document
.getElementById("birthdayInput")
.value;



const message =
document
.getElementById("loginMessage");



if(!name || !phone){


message.textContent =
"Please enter your name and phone";


return;

}




message.textContent =
"Joining The Yard Tribe 🍊";



try{



const response =
await fetch(


API_URL +

"?action=register" +

"&name=" +
encodeURIComponent(name) +

"&email=" +
encodeURIComponent(email) +

"&phone=" +
encodeURIComponent(phone) +

"&birthday=" +
encodeURIComponent(birthday)


);



const data =
await response.json();



if(data.success){



member = data;


loadMember();



message.textContent =
"Welcome to The Yard 🍸";


}



else{


message.textContent =
data.error;


}



}



catch(error){


console.log(error);


message.textContent =
"Connection failed";


}



}







// =================================
// FIND EXISTING MEMBER
// =================================


async function findPassport(){



const phone =
document
.getElementById("phoneInput")
.value;



const message =
document
.getElementById("loginMessage");



message.textContent =
"Searching Yard Tribe 🍊";



try{



const response =
await fetch(


API_URL +

"?phone=" +

encodeURIComponent(phone)


);



const data =
await response.json();





if(data.error){



message.textContent =
"Member not found";

return;


}




member = data;



loadMember();



message.textContent =
"Passport found 🍸";



}



catch(error){



console.log(error);


message.textContent =
"Connection error";


}



}








// =================================
// BUTTON CONNECTIONS
// =================================



document
.getElementById("joinButton")
.addEventListener(
"click",
registerMember
);



document
.getElementById("findPassport")
.addEventListener(
"click",
findPassport
);







// LOAD DEFAULT CARD

loadMember();