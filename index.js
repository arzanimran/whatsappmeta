const express = require("express");

require("dotenv").config();

const app = express();

app.use(express.json());


const metaRoutes = require("./routes/metaRoutes");
const metaWebhook = require("./routes/metaWebhook");
const templateRoutes = require("./routes/templateRoutes");


app.use("/meta", metaRoutes);
app.use("/meta", metaWebhook);
app.use("/", templateRoutes);


app.get("/", (req, res) => {

  res.send("Server Running");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);
});


/*
 
Connect WhatsApp service
-> Book appointment
-> Send WhatsApp notification
-> Provider can be Meta or MessageBird
-> Currently everything is fake


Embedded Signup Success Test
POST
http://localhost:3000/meta/embedded-signup

BODY
{
  "businessName": "ABC Clinic"
}

SHOWN
{
  "success": true,
  "provider": "META_WHATSAPP",
  "businessId": "mock_business_123",
  "phoneNumberId": "mock_phone_456",
  "businessName": "ABC Clinic",
  "onboardingSteps": [
    {
      "step": "business_signup",
      "status": "completed"
    },
    {
      "step": "callback_received",
      "status": "completed"
    },
    {
      "step": "token_generated",
      "accessToken": "mock_access_token_abc"
    },
    {
      "step": "webhook_subscribed",
      "webhook": "/meta/webhook"
    }
  ],
  "status": "ONBOARDED"
}



Embedded Signup Failure Test
POST
http://localhost:3000/meta/embedded-signup

BODY
{
  "businessName": "ABC Clinic",
  "simulateFailure": true
}

SHOWN
{
  "success": false,
  "step": "signup",
  "message": "Meta signup failed"
}



Webhook Verification Test
GET
http://localhost:3000/meta/webhook?hub.mode=subscribe&hub.verify_token=my_verify_token&hub.challenge=12345

SHOWN
12345



Webhook Verification Failure Test
GET
http://localhost:3000/meta/webhook?hub.mode=subscribe&hub.verify_token=wrong_token&hub.challenge=12345

SHOWN
Verification failed



Webhook POST Test
POST
http://localhost:3000/meta/webhook

BODY
{
  "event": "message_received",
  "from": "9876543210"
}

SHOWN
{
  "success": true,
  "received": true,
  "data": {
    "event": "message_received",
    "from": "9876543210"
  }
}



Appointment Booking Success Test
POST
http://localhost:3000/appointment

BODY
{
  "patientName": "Arzan",
  "patientPhone": "9876543210"
}

SHOWN
{
  "success": true,
  "appointment": {
    "patientName": "Arzan",
    "patientPhone": "9876543210"
  },
  "whatsapp": {
    "success": true,
    "provider": "META_WHATSAPP",
    "to": "9876543210",
    "message": "Hello Arzan, your appointment is booked successfully",
    "messageId": "meta_mock_msg_001"
  }
}



Appointment Validation Test
POST
http://localhost:3000/appointment

BODY
{
  "patientName": "Arzan"
}

SHOWN
{
  "success": false,
  "message": "patientName and patientPhone are required"
}



Provider Switch Test

.env

PORT=3000
WHATSAPP_PROVIDER=MESSAGE_BIRD

Restart server

POST
http://localhost:3000/appointment

BODY
{
  "patientName": "Arzan",
  "patientPhone": "9876543210"
}

SHOWN
{
  "success": true,
  "appointment": {
    "patientName": "Arzan",
    "patientPhone": "9876543210"
  },
  "whatsapp": {
    "success": true,
    "provider": "MESSAGE_BIRD",
    "to": "9876543210",
    "message": "Hello Arzan, your appointment is booked successfully"
  }
}

CONFIRMATION TEMPLATE
POST
http://localhost:3000/template/send

{
  "patientName": "Arzan",
  "doctorName": "Heeba",
  "appointmentDate": "15 May 2026 10:00 AM",
  "hospitalName": "City Hospital",
  "patientPhone": "9876543210",
  "templateType": "confirmation"
}

SHOWN
{"success":true,"provider":"META_WHATSAPP","to":"9876543210","templateType":"confirmation","message":"Hello Arzan, your appointment with Dr.Heeba is confirmed on 15 May 2026 10:00 AM at City Hospital","messageId":"meta_template_001","status":"SENT"}

REMINDER TEMPLATE
POST
http://localhost:3000/template/send
{
  "patientName": "Arzan",
  "doctorName": "Heeba",
  "appointmentDate": "15 May 2026 10:00 AM",
  "hospitalName": "City Hospital",
  "patientPhone": "9876543210",
  "templateType": "reminder"
}
SHOWN
{"success":true,"provider":"META_WHATSAPP","to":"9876543210","templateType":"reminder","message":"Reminder: Appointment with Dr.Heeba on 15 May 2026 10:00 AM at City Hospital","messageId":"meta_template_001","status":"SENT"}

CANCELLATION TEMPLATE
POST
http://localhost:3000/template/send

{
  "patientName": "Arzan",
  "doctorName": "Heeba",
  "appointmentDate": "15 May 2026 10:00 AM",
  "hospitalName": "City Hospital",
  "patientPhone": "9876543210",
  "templateType": "cancellation"
}
SHOWN
{"success":true,"provider":"META_WHATSAPP","to":"9876543210","templateType":"cancellation","message":"Appointment with Dr.Heeba on 15 May 2026 10:00 AM at City Hospital has been cancelled","messageId":"meta_template_001","status":"SENT"}


FAILURE + FALLBACK TEST
POST
http://localhost:3000/template/send
{
  "patientName": "Arzan",
  "doctorName": "Heeba",
  "appointmentDate": "15 May 2026 10:00 AM",
  "hospitalName": "City Hospital",
  "patientPhone": "9876543210",
  "templateType": "confirmation",
  "simulateFailure": true
}

SHOWN
{"success":false,"provider":"MESSAGE_BIRD","status":"FAILED","message":"MessageBird send failed","fallbackUsed":true}
 */