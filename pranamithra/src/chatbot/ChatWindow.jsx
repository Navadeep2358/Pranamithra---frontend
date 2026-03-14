import { useState, useRef, useEffect } from "react";
import "./ChatWindow.css";

const API = "https://pranamithra-backend-aakk.onrender.com";

export default function ChatWindow({ closeChat, user }) {

const [messages,setMessages]=useState([
{sender:"bot",text:"Hi 👋 I am Bot-Mithra. Type hi to begin."}
]);

const [selectedDoctor,setSelectedDoctor]=useState(null);
const [selectedDate,setSelectedDate]=useState(null);
const [selectedSlot,setSelectedSlot]=useState(null);

const [input,setInput]=useState("");
const [loading,setLoading]=useState(false);

const [isQueryMode,setIsQueryMode]=useState(false);

const bottomRef=useRef(null);

useEffect(()=>{
bottomRef.current?.scrollIntoView({behavior:"smooth"});
},[messages]);

/* ================= SEND MESSAGE ================= */

const sendMessage=(text)=>{

if(!text||!text.trim()) return;

setMessages(prev=>[...prev,{sender:"user",text}]);
setInput("");

if(!user){
handleLex(text);
return;
}

if(user.role==="doctor"){
handleDoctorBot(text);
}

if(user.role==="customer"){
handleCustomerBot(text);
}

};

/* ================= DOCTOR MENU ================= */

const showDoctorMenu=()=>{
setMessages(prev=>[
...prev,
{
sender:"bot",
text:"What would you like to do next?",
buttons:[
{label:"My Slots",value:"MY_SLOTS"},
{label:"My Appointments",value:"MY_APPOINTMENTS"},
{label:"Send Query",value:"SEND_QUERY"},
{label:"End Chat",value:"END_CHAT"}
]
}
]);
};

/* ================= CUSTOMER MENU ================= */

const showCustomerMenu=()=>{
setMessages(prev=>[
...prev,
{
sender:"bot",
text:"What would you like to do next?",
buttons:[
{label:"Book Appointment",value:"BOOK_APPOINTMENT"},
{label:"My Bookings",value:"MY_BOOKINGS"},
{label:"Send Query",value:"SEND_QUERY"},
{label:"End Chat",value:"END_CHAT"}
]
}
]);
};

/* ================= DOCTOR BOT ================= */

const handleDoctorBot=async(text)=>{

const lower=text.toLowerCase();

if(lower==="hi"||lower==="hello"){

setMessages(prev=>[
...prev,
{
sender:"bot",
text:`Hello Dr. ${user.name} 👋`,
buttons:[
{label:"My Slots",value:"MY_SLOTS"},
{label:"My Appointments",value:"MY_APPOINTMENTS"},
{label:"Send Query",value:"SEND_QUERY"},
{label:"End Chat",value:"END_CHAT"}
]
}
]);

return;
}

/* SEND QUERY */

if(text==="SEND_QUERY"){

setIsQueryMode(true);

setMessages(prev=>[
...prev,
{sender:"bot",text:"Please type your query and press Send."}
]);

return;
}

if(isQueryMode){

try{

await fetch(`${API}/send-query`,{
method:"POST",
headers:{"Content-Type":"application/json"},
credentials:"include",
body:JSON.stringify({message:text})
});

setMessages(prev=>[
...prev,
{sender:"bot",text:"Your query has been submitted successfully ✅"}
]);

}catch{

setMessages(prev=>[
...prev,
{sender:"bot",text:"Failed to submit query."}
]);

}

setIsQueryMode(false);
showDoctorMenu();
return;
}

/* MY APPOINTMENTS */

if(text==="MY_APPOINTMENTS"){

try{

const res=await fetch(`${API}/doctor/appointments`,{credentials:"include"});
const data=await res.json();

if(!data.length){

setMessages(prev=>[
...prev,
{sender:"bot",text:"No appointments found."}
]);

showDoctorMenu();
return;
}

const cards=data.map(a=>({
sender:"bot",
customAppointment:{
id:a.id,
name:a.customer_name,
date:a.appointment_date,
slot:a.slot_time
}
}));

setMessages(prev=>[...prev,...cards]);
showDoctorMenu();

}catch{

setMessages(prev=>[
...prev,
{sender:"bot",text:"Unable to fetch appointments."}
]);

showDoctorMenu();

}

return;
}

if(text==="END_CHAT"){
closeChat();
}

};

/* ================= CUSTOMER BOT ================= */

const handleCustomerBot=async(text)=>{

const lower=text.toLowerCase();

/* GREETING */

if(lower==="hi"||lower==="hello"){

setMessages(prev=>[
...prev,
{
sender:"bot",
text:`Hello ${user.name} 👋`,
buttons:[
{label:"Book Appointment",value:"BOOK_APPOINTMENT"},
{label:"My Bookings",value:"MY_BOOKINGS"},
{label:"Send Query",value:"SEND_QUERY"},
{label:"End Chat",value:"END_CHAT"}
]
}
]);

return;
}

/* SEND QUERY */

if(text==="SEND_QUERY"){

setIsQueryMode(true);

setMessages(prev=>[
...prev,
{sender:"bot",text:"Please type your query for admin and press Send."}
]);

return;
}

if(isQueryMode){

try{

await fetch(`${API}/send-query`,{
method:"POST",
headers:{"Content-Type":"application/json"},
credentials:"include",
body:JSON.stringify({message:text})
});

setMessages(prev=>[
...prev,
{sender:"bot",text:"Your query has been sent to admin successfully ✅"}
]);

}catch{

setMessages(prev=>[
...prev,
{sender:"bot",text:"Failed to send query."}
]);

}

setIsQueryMode(false);
showCustomerMenu();
return;
}

/* ================= BOOK APPOINTMENT ================= */

if(text==="BOOK_APPOINTMENT"){

try{

const res=await fetch(`${API}/customer/doctors`,{credentials:"include"});
const doctors=await res.json();

if(!doctors.length){

setMessages(prev=>[
...prev,
{sender:"bot",text:"No doctors available."}
]);

return;
}

setMessages(prev=>[
...prev,
{
sender:"bot",
text:"Select a doctor:",
buttons:doctors.map(d=>({
label:`${d.full_name} (${d.specialization})`,
value:`DOC_${d.id}`
}))
}
]);

}catch{

setMessages(prev=>[
...prev,
{sender:"bot",text:"Unable to fetch doctors."}
]);

}

return;
}

/* ================= SELECT DOCTOR ================= */

if(text.startsWith("DOC_")){

const doctorId=text.replace("DOC_","");
setSelectedDoctor(doctorId);

try{

const res=await fetch(`${API}/customer/doctor-dates/${doctorId}`,{credentials:"include"});
const data=await res.json();

if(!data.dates.length){

setMessages(prev=>[
...prev,
{sender:"bot",text:"No appointments available for this doctor."}
]);

return;
}

setMessages(prev=>[
...prev,
{
sender:"bot",
text:"Select Date:",
buttons:data.dates.map(d=>({
label:d,
value:`DATE_${d}`
}))
}
]);

}catch{

setMessages(prev=>[
...prev,
{sender:"bot",text:"Unable to fetch dates."}
]);

}

return;
}

/* ================= SELECT DATE ================= */

if(text.startsWith("DATE_")){

const date=text.replace("DATE_","");
setSelectedDate(date);

try{

const res=await fetch(`${API}/doctor/available-slots?doctorId=${selectedDoctor}&date=${date}`,{credentials:"include"});
const slots=await res.json();

if(!slots.length){

setMessages(prev=>[
...prev,
{sender:"bot",text:"No appointments available on this day."}
]);

return;
}

setMessages(prev=>[
...prev,
{
sender:"bot",
text:"Select Slot:",
buttons:slots.map(s=>({
label:s,
value:`SLOT_${s}`
}))
}
]);

}catch{

setMessages(prev=>[
...prev,
{sender:"bot",text:"Unable to fetch slots."}
]);

}

return;
}

/* ================= SELECT SLOT ================= */

if(text.startsWith("SLOT_")){

const slot=text.replace("SLOT_","");
setSelectedSlot(slot);

setMessages(prev=>[
...prev,
{
sender:"bot",
text:`Please accept Terms & Conditions to continue.`,
buttons:[
{label:"Accept",value:"ACCEPT_TERMS"},
{label:"Decline",value:"DECLINE_TERMS"}
]
}
]);

return;
}

/* DECLINE */

if(text==="DECLINE_TERMS"){

setMessages(prev=>[
...prev,
{sender:"bot",text:"Booking cancelled."}
]);

showCustomerMenu();
return;
}

/* ACCEPT */

if(text==="ACCEPT_TERMS"){

setMessages(prev=>[
...prev,
{
sender:"bot",
text:`Booking Summary

Doctor ID: ${selectedDoctor}
Date: ${selectedDate}
Slot: ${selectedSlot}

Confirm booking?`,
buttons:[
{label:"Book",value:"FINAL_BOOK"},
{label:"Cancel",value:"CANCEL_BOOK"}
]
}
]);

return;
}

/* FINAL BOOK */

if(text==="FINAL_BOOK"){

try{

const res=await fetch(`${API}/book-appointment`,{
method:"POST",
headers:{"Content-Type":"application/json"},
credentials:"include",
body:JSON.stringify({
doctorId:selectedDoctor,
slotTime:selectedSlot,
duration:20,
amount:0,
date:selectedDate
})
});

if(!res.ok) throw new Error();

setMessages(prev=>[
...prev,
{sender:"bot",text:"Appointment booked successfully 🎉"}
]);

}catch{

setMessages(prev=>[
...prev,
{sender:"bot",text:"Booking failed."}
]);

}

showCustomerMenu();
return;
}

/* ================= MY BOOKINGS ================= */

if(text==="MY_BOOKINGS"){

try{

const res=await fetch(`${API}/appointments/my`,{credentials:"include"});
const data=await res.json();

if(!data.length){

setMessages(prev=>[
...prev,
{sender:"bot",text:"No bookings found."}
]);

return;
}

const cards=data.map(app=>({
sender:"bot",
customAppointment:{
id:app.id,
name:app.doctor_name,
date:app.appointment_date,
slot:app.slot_time
}
}));

setMessages(prev=>[...prev,...cards]);

}catch{

setMessages(prev=>[
...prev,
{sender:"bot",text:"Unable to fetch bookings."}
]);

}

return;
}

if(text==="END_CHAT"){
closeChat();
}

};

/* ================= LEX ================= */

const handleLex=async(text)=>{

setLoading(true);

try{

const res=await fetch(`${API}/api/chat`,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({message:text})
});

const data=await res.json();

setMessages(prev=>[
...prev,
{sender:"bot",text:data.reply}
]);

}catch{

setMessages(prev=>[
...prev,
{sender:"bot",text:"Bot unavailable."}
]);

}

setLoading(false);

};

/* ================= UI ================= */

return(
<div className="chat-wrapper">

<div className="chat-container">

<div className="chat-header">
<span>Bot-Mithra</span>
<button onClick={closeChat}>✖</button>
</div>

<div className="chat-body">

{messages.map((msg,index)=>(
<div key={index} className={`message-row ${msg.sender}`}>
<div className={`message-bubble ${msg.sender}`}>

{msg.text}

{msg.buttons &&(
<div className="button-container">
{msg.buttons.map((btn,i)=>(
<button
key={i}
className="chat-btn"
onClick={()=>sendMessage(btn.value)}
>
{btn.label}
</button>
))}
</div>
)}

{msg.customAppointment &&(
<div className="appointment-card">
<div>
<strong>{msg.customAppointment.name}</strong>
<div>{msg.customAppointment.date}</div>
<div>{msg.customAppointment.slot}</div>
</div>
</div>
)}

</div>
</div>
))}

{loading&&(
<div className="message-row bot">
<div className="message-bubble bot">Typing...</div>
</div>
)}

<div ref={bottomRef}></div>

</div>

<div className="chat-footer">

<input
value={input}
onChange={(e)=>setInput(e.target.value)}
onKeyDown={(e)=>{if(e.key==="Enter")sendMessage(input)}}
placeholder="Type your message..."
/>

<button
className="send-btn"
onClick={()=>sendMessage(input)}
>
Send
</button>

</div>

</div>

</div>
);

}