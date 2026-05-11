const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

const metaRoutes = require("./routes/metaRoutes");
const metaWebhook = require("./routes/metaWebhook");

const {
  bookAppointment
} = require("./controllers/appointmentController");

app.use("/meta", metaRoutes);
app.use("/meta", metaWebhook);

app.post("/appointment", bookAppointment);

app.get("/", (req, res) => {
  res.send("Server Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


/*
 
Embedded Signup Test
POST
http://localhost:3000/meta/embedded-signup

{
  "businessName": "ABC Clinic"
}

SHOWN
{"success":true,"provider":"META_WHATSAPP","businessId":"mock_business_123","phoneNumberId":"mock_phone_456","accessToken":"mock_access_token_abc","businessName":"ABC Clinic","status":"ONBOARDED"}



Webhook GET Test
GET
http://localhost:3000/meta/webhook

SHOWN
Webhook verified


Webhook POST Test
POST
http://localhost:3000/meta/webhook

{
  "event": "message_received",
  "from": "9876543210"
}

SHOWN
{"success":true,"received":true,"data":{"event":"message_received","from":"9876543210"}}



Appointment Booking Test
POST
http://localhost:3000/appointment
{
  "patientName": "Arzan",
  "patientPhone": "9876543210"
}
SHOWN
{"success":true,"appointment":{"patientName":"Arzan","patientPhone":"9876543210"},"whatsapp":{"success":true,"provider":"META_WHATSAPP","to":"9876543210","message":"Hello Arzan, your appointment is booked successfully","messageId":"meta_mock_msg_001"}}

 */