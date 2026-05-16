const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");
const { seedDoctors } = require("./services/doctorService"); // inserts default doctors into DB

const app = express();
app.use(express.json());

connectDB().then(async () => {
  await seedDoctors(); // automatically add doctors if DB is empty ex . Dr. Sharma (Dentist), Dr. Mehta (Cardiologist), without manually adding them
});

const metaRoutes = require("./routes/metaRoutes");
const metaWebhook = require("./routes/metaWebhook");
const templateRoutes = require("./routes/templateRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const botRoutes = require("./routes/botRoutes");

app.use("/meta", metaRoutes);
app.use("/meta", metaWebhook);
app.use("/", templateRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/", botRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "WhatsApp Appointment Bot API Running" });
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;





/*

Embedded Signup Test
POST
Embedded Signup Test
BODY
{
  "businessName": "ABC Clinic"
}

SHOWN
{"success":true,"provider":"META_WHATSAPP","businessId":"mock_business_123","phoneNumberId":"mock_phone_456","businessName":"ABC Clinic","onboardingSteps":[{"step":"business_signup","status":"completed"},{"step":"callback_received","status":"completed"},{"step":"token_generated","accessToken":"mock_access_token_abc"},{"step":"webhook_subscribed","webhook":"/meta/webhook"}],"status":"ONBOARDED"}

-----------------------------------------------------------------------------------------------------------
Webhook Verify Test
GET
http://localhost:3000/meta/webhook?hub.mode=subscribe&hub.verify_token=my_verify_token&hub.challenge=12345
SHOWN
12345

------------------------------------------------------------------------------------------------------------
Bot Booking Flow
POST
http://localhost:3000/bot/message
BODY
{
  "message": "I need a skin doctor tomorrow evening",
  "patientName": "Arzan",
  "patientPhone": "9876543210"
}

SHOWN
{"success":true,"intent":"BOOK_APPOINTMENT","doctor":"Dr. Rajesh","specialization":"Skin","slot":"5 PM","status":"BOOKED"}
------------------------------------------------------------------------------------------------------------
View Bookings
POST
http://localhost:3000/bot/message
{
  "message": "Show my upcoming bookings",
  "patientPhone": "9876543210"
}


Shown
{"success":true,"intent":"VIEW_BOOKINGS","bookings":[{"doctor":"Dr. Rajesh","specialization":"Dermatologist","date":"Tomorrow","time":"05:00 PM","status":"BOOKED"}]}

---------------------------------------------------------------------------------------------
Cancel Appointment
POST  
http://localhost:3000/bot/message
{
  "message": "Cancel my appointment",
  "patientPhone": "9876543210"
}

SHOWN
{"success":true,"intent":"CANCEL_APPOINTMENT","status":"CANCELLED","doctor":"Dr. Rajesh","slot":"05:00 PM","date":"Tomorrow"}

------------------------------------------------------------------------------------------------------
Check Slot Availability
POST
http://localhost:3000/bot/message
{
  "message": "Any slots available today?",
  "patientPhone": "9876543210"
}

Shown
{"success":true,"intent":"CHECK_SLOT","availableSlots":[{"doctor":"Dr. Sharma","specialization":"Dentist","availableSlots":["10:00 AM","11:00 AM","04:00 PM"]},{"doctor":"Dr. Mehta","specialization":"Cardiologist","availableSlots":["09:00 AM","09:30 AM","06:00 PM"]},{"doctor":"Dr. Patel","specialization":"Ophthalmologist","availableSlots":["09:00 AM","10:00 AM","03:00 PM"]},{"doctor":"Dr. Rajesh","specialization":"Dermatologist","availableSlots":["10:00 AM","10:30 AM","11:00 AM","05:00 PM"]}]}

----------------------------------------------------------------------------------------------
Invalid Doctor Test
POST
http://localhost:3000/bot/message

{
  "message": "Need brain surgeon tomorrow",
  "patientPhone": "9876543210"
}
SHOWN
{"success":false,"message":"Doctor not found"}

-----------------------------------------------------------------------------------------------------
Duplicate Booking Test
POST
http://localhost:3000/bot/message
BODY
{
  "message": "I need a skin doctor tomorrow evening",
  "patientName": "Arzan",
  "patientPhone": "9876543210"
}
SHOWN
{"success":false,"message":"You already have this appointment booked"}

----------------------------------------------------------------------------------------------
Template Send Test
POST
http://localhost:3000/template/send
{
  "patientName": "Arzan",
  "doctorName": "Rajesh",
  "appointmentDate": "15 May 2026 5:00 PM",
  "hospitalName": "City Hospital",
  "patientPhone": "9876543210",
  "templateType": "confirmation"
}
SHOWN
{"success":true,"provider":"META_WHATSAPP","to":"9876543210","templateType":"confirmation","message":"Hello Arzan, your appointment with Dr.Rajesh is confirmed on 15 May 2026 5:00 PM at City Hospital","messageId":"meta_1778669965117_ebhmouze","status":"SENT"}

----------------------------------------------------------------------------------------------
Webhook Delivery Update
PoST
http://localhost:3000/meta/webhook
{
  "messageId": "meta_1778669965117_ebhmouze",
  "status": "DELIVERED"
}



SHOWN
{"success":true,"updated":{"success":true,"provider":"META_WHATSAPP","to":"9876543210","templateType":"confirmation","message":"Hello Arzan, your appointment with Dr.Rajesh is confirmed on 15 May 2026 5:00 PM at City Hospital","messageId":"meta_1778669965117_ebhmouze","status":"DELIVERED"}}

----------------------------------------------------------------------------------------------
Check Message Status
GET
http://localhost:3000/meta/message-status/meta_1778669965117_ebhmouze
SHOWN
{"success":true,"provider":"META_WHATSAPP","to":"9876543210","templateType":"confirmation","message":"Hello Arzan, your appointment with Dr.Rajesh is confirmed on 15 May 2026 5:00 PM at City Hospital","messageId":"meta_1778669965117_ebhmouze","status":"DELIVERED"}


 */







/*
DUPLICATE BOOKING TEST
Post
http://localhost:3000/bot/message
{
  "message": "I need a skin doctor tomorrow evening",
  "patientName": "Arzan",
  "patientPhone": "9876543210"
}

SHOWN
{"success":false,"message":"You already have this appointment booked"}

--------------------------------------------------------------------------------------------------------------------------------------
BOOKing is full
POST
http://localhost:3000/bot/message
{
  "message": "I need a skin doctor tomorrow evening",
  "patientName": "imran",
  "patientPhone": "8806893223"
}
SHOWN
{"success":false,"message":"Slot already booked","alternativeSlots":["10:00 AM","10:30 AM","11:00 AM"]}

--------------------------------------------------------------------------------------------------------------------------------------
Book same doctor, different slot
Post
http://localhost:3000/bot/message
{
  "message": "I need a skin doctor tomorrow morning",
  "patientName": "imran",
  "patientPhone": "8806893223"
}

SHOWN
{"success":true,"message":"Appointment booked successfully","appointment":{"patientName":"imran","patientPhone":"8806893223","doctorName":"Dr. Rajesh","specialization":"Dermatologist","slot":"10:00 AM","appointmentDate":"Tomorrow","status":"BOOKED","_id":"6a055b083da0a9e45787f74d","createdAt":"2026-05-14T05:18:00.571Z","updatedAt":"2026-05-14T05:18:00.571Z","__v":0}}


--------------------------------------------------------------------------------------------------------------------------------------

VIEW BOOKINGS
POST
http://localhost:3000/bot/message
{
  "message": "Show my upcoming bookings",
  "patientPhone": "9876543210"
}

SHOWN
{"success":true,"appointments":[{"_id":"6a055b083da0a9e45787f74d","patientName":"imran","patientPhone":"8806893223","doctorName":"Dr. Rajesh","specialization":"Dermatologist","slot":"10:00 AM","appointmentDate":"Tomorrow","status":"BOOKED","createdAt":"2026-05-14T05:18:00.571Z","updatedAt":"2026-05-14T05:18:00.571Z","__v":0}]}

--------------------------------------------------------------------------------------------------------------------------------------

CANCEL APPOINTMENT
POST
http://localhost:3000/bot/message
{
  "message": "Cancel my appointment",
  "patientPhone": "9876543210"
}

{"success":true,"message":"Appointment cancelled successfully","appointment":{"_id":"6a0459610710af098c915fb1","patientName":"Arzan","patientPhone":"9876543210","doctorName":"Dr. Rajesh","specialization":"Dermatologist","slot":"05:00 PM","appointmentDate":"Tomorrow","status":"CANCELLED","createdAt":"2026-05-13T10:58:41.539Z","updatedAt":"2026-05-14T05:21:47.081Z","__v":0}}


--------------------------------------------------------------------------------------------------------------------------------------
CHECK AVAILABLE SLOTS

http://localhost:3000/bot/message
{
  "message": "Any slots available today?",
  "patientPhone": "9876543210"
}
SHOWN
{"success":true,"intent":"CHECK_SLOT","availableSlots":[{"doctor":"Dr. Sharma","specialization":"Dentist","availableSlots":["10:00 AM","11:00 AM","04:00 PM"]},{"doctor":"Dr. Mehta","specialization":"Cardiologist","availableSlots":["09:00 AM","09:30 AM","06:00 PM"]},{"doctor":"Dr. Patel","specialization":"Ophthalmologist","availableSlots":["09:00 AM","10:00 AM","03:00 PM"]},{"doctor":"Dr. Rajesh","specialization":"Dermatologist","availableSlots":["10:00 AM","10:30 AM","11:00 AM","05:00 PM"]}]}

--------------------------------------------------------------------------------------------------------------------------------------

INVALID DOCTOR TEST
POST
http://localhost:3000/bot/message

{
  "message": "Need brain surgeon tomorrow",
  "patientPhone": "9876543210"
}

SHOWN
{"success":false,"message":"Doctor not found"}


*/



/*
SEND TEMPLATE MESSAGE
POST
http://localhost:3000/template/send

{
  "patientName": "Arzan",
  "doctorName": "Rajesh",
  "appointmentDate": "Tomorrow 5 PM",
  "hospitalName": "City Hospital",
  "patientPhone": "9876543210",
  "templateType": "confirmation"
}

SHOWN
{"success":true,"provider":"META_WHATSAPP","to":"9876543210","templateType":"confirmation","message":"Hello Arzan, your appointment with Dr.Rajesh is confirmed on Tomorrow 5 PM at City Hospital","messageId":"meta_1778931221462_7w7oon4y","status":"SENT","createdAt":"2026-05-16T11:33:41.462Z"}

Reminder Template
POST
http://localhost:3000/template/send
{
  "patientName": "Arzan",
  "doctorName": "Rajesh",
  "appointmentDate": "Tomorrow 5 PM",
  "hospitalName": "City Hospital",
  "patientPhone": "9876543210",
  "templateType": "reminder"
}
SHOWN
{"success":true,"provider":"META_WHATSAPP","to":"9876543210","templateType":"reminder","message":"Reminder: Appointment with Dr.Rajesh on Tomorrow 5 PM at City Hospital","messageId":"meta_1778931316047_4pv4pkp7","status":"SENT","createdAt":"2026-05-16T11:35:16.047Z"}

Cancel Template
POST
http://localhost:3000/template/send
{
  "patientName": "Arzan",
  "doctorName": "Rajesh",
  "appointmentDate": "Tomorrow 5 PM",
  "hospitalName": "City Hospital",
  "patientPhone": "9876543210",
  "templateType": "cancel"
}
SHOWN
{"success":true,"provider":"META_WHATSAPP","to":"9876543210","templateType":"cancel","message":"Appointment with Dr.Rajesh on Tomorrow 5 PM at City Hospital has been cancelled","messageId":"meta_1778931376880_88x0fk20","status":"SENT","createdAt":"2026-05-16T11:36:16.880Z"}

VALIDATION TEST
POST
http://localhost:3000/template/send
{
  "patientName": "Arzan",
  "doctorName": "Rajesh"
}

shown
{"success":false,"message":"All fields are required"}

FAILURE SIMULATION TEST
post
{
  "patientName": "Arzan",
  "doctorName": "Rajesh",
  "appointmentDate": "Tomorrow",
  "hospitalName": "City Hospital",
  "patientPhone": "9876543210",
  "templateType": "confirmation",
  "simulateFailure": true
}
shown
{"success":true,"provider":"MESSAGE_BIRD","to":"9876543210","templateType":"confirmation","message":"Hello Arzan, your appointment with Dr.Rajesh is confirmed on Tomorrow at City Hospital","messageId":"messagebird_1778931554921_cluys8sg","status":"SENT","createdAt":"2026-05-16T11:39:14.921Z","fallbackUsed":true}

*/