const Doctor = require("../models/Doctor");

async function seedDoctors() {
  const count = await Doctor.countDocuments();
  if (count > 0) {
    console.log("Doctors already seeded");
    return;
  }

  await Doctor.create([
    {
      doctorName: "Dr. Rajesh",
      specialization: "Dermatologist",
      availableTimings: ["10:00 AM", "10:30 AM", "11:00 AM", "05:00 PM"],
      breakTimings: ["01:00 PM"],
      slotDuration: 30,
      dailyBookingLimit: 5
    },
    {
      doctorName: "Dr. Mehta",
      specialization: "Cardiologist",
      availableTimings: ["09:00 AM", "09:30 AM", "06:00 PM"],
      breakTimings: ["02:00 PM"],
      slotDuration: 30,
      dailyBookingLimit: 3
    },
    {
      doctorName: "Dr. Sharma",
      specialization: "Dentist",
      availableTimings: ["10:00 AM", "11:00 AM", "04:00 PM"],
      breakTimings: ["01:00 PM"],
      slotDuration: 30,
      dailyBookingLimit: 4
    },
    {
      doctorName: "Dr. Patel",
      specialization: "Ophthalmologist",
      availableTimings: ["09:00 AM", "10:00 AM", "03:00 PM"],
      breakTimings: ["01:00 PM"],
      slotDuration: 30,
      dailyBookingLimit: 4
    }
  ]);

  console.log(" Doctors Seeded Successfully");
}

module.exports = { seedDoctors };