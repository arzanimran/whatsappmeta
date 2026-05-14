const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { checkSlotAvailability } = require("./slotService");
const { log } = require("./loggerService");


// BOOK APPOINTMEN
async function bookAppointment(data) {
  try {
    const { patientName, patientPhone, specialization, doctorName, appointmentDate, slot } = data;

    log("BOOKING REQUEST", data);

    // Find doctor by name OR specialization
    let doctor = null;

    if (doctorName) {
      doctor = await Doctor.findOne({
        doctorName: { $regex: new RegExp(doctorName, "i") }
      });
    }

    if (!doctor && specialization) {
      doctor = await Doctor.findOne({
        specialization: { $regex: new RegExp(specialization, "i") }
      });
    }

    if (!doctor) {
      log("DOCTOR NOT FOUND", { doctorName, specialization });
      return { success: false, message: "Doctor not found" };
    }

    // Resolve slot — if "Next Available", pick first available timing
    let resolvedSlot = slot;
    if (!resolvedSlot || resolvedSlot === "Next Available") {
      resolvedSlot = doctor.availableTimings[0];
    }

    // Check if the slot exists in doctor's schedule
    const slotExists = doctor.availableTimings.some(
      (t) => t.toLowerCase() === resolvedSlot.toLowerCase()
    );
    if (!slotExists) {
      return {
        success: false,
        message: `Slot ${resolvedSlot} is not available for ${doctor.doctorName}`,
        availableSlots: doctor.availableTimings
      };
    }

    // Duplicate booking check
    const duplicate = await Appointment.findOne({
      patientPhone,
      doctorName: doctor.doctorName,
      appointmentDate,
      slot: resolvedSlot,
      status: "BOOKED"
    });

    if (duplicate) {
      return { success: false, message: "You already have this appointment booked" };
    }

    // Daily booking limit check
    const dailyCount = await Appointment.countDocuments({
      doctorName: doctor.doctorName,
      appointmentDate,
      status: "BOOKED"
    });

    if (dailyCount >= doctor.dailyBookingLimit) {
      // Suggest alternative doctors of same specialization
      const alternatives = await Doctor.find({
        specialization: doctor.specialization,
        doctorName: { $ne: doctor.doctorName }
      });

      return {
        success: false,
        message: `Dr. ${doctor.doctorName} is fully booked for ${appointmentDate}`,
        alternativeDoctors: alternatives.map((d) => ({
          name: d.doctorName,
          availableSlots: d.availableTimings
        }))
      };
    }

    // Slot availability check
    const slotAvailable = await checkSlotAvailability(
      doctor.doctorName,
      appointmentDate,
      resolvedSlot
    );

    if (!slotAvailable) {
      return {
        success: false,
        message: "Slot already booked",
        alternativeSlots: doctor.availableTimings.filter((t) => t !== resolvedSlot)
      };
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientName,
      patientPhone,
      doctorName: doctor.doctorName,
      specialization: doctor.specialization,
      appointmentDate,
      slot: resolvedSlot,
      status: "BOOKED"
    });

    log("BOOKING SUCCESS", appointment);

    return {
      success: true,
      message: "Appointment booked successfully",
      appointment
    };

  } catch (error) {
    log("BOOKING ERROR", error.message);
    return { success: false, message: error.message };
  }
}


//  CANCEL APPOINTMENT 
async function cancelAppointment(data) {
  try {
    const { patientPhone, appointmentDate, slot } = data;

    log("CANCEL REQUEST", data);

    // Build query — be flexible if date/slot not specified
    let query = { patientPhone, status: "BOOKED" };

    if (appointmentDate && appointmentDate !== "Next Available") {
      query.appointmentDate = appointmentDate;
    }
    if (slot && slot !== "Next Available") {
      query.slot = slot;
    }

    // Find most recent booked appointment if no specific slot given
    const appointment = await Appointment.findOne(query).sort({ createdAt: -1 });

    if (!appointment) {
      return { success: false, message: "No active appointment found to cancel" };
    }

    appointment.status = "CANCELLED";
    await appointment.save();

    log("CANCELLATION SUCCESS", appointment);

    return {
      success: true,
      message: "Appointment cancelled successfully",
      appointment
    };

  } catch (error) {
    log("CANCELLATION ERROR", error.message);
    return { success: false, message: error.message };
  }
}


// VIEW APPOINTMENTS 
async function viewAppointments(patientPhone) {
  try {
    const appointments = await Appointment.find({
      patientPhone,
      status: "BOOKED"
    }).sort({ createdAt: -1 });

    log("VIEW APPOINTMENTS", { patientPhone, count: appointments.length });

    return { success: true, appointments };

  } catch (error) {
    log("VIEW APPOINTMENT ERROR", error.message);
    return { success: false, message: error.message };
  }
}


// CHECK AVAILABLE SLOTS 
async function checkAvailableSlots(specialization) {
  try {
    let query = {};
    if (specialization) {
      query.specialization = { $regex: new RegExp(specialization, "i") };
    }

    const doctors = await Doctor.find(query);

    if (!doctors.length) {
      return { success: false, message: "No doctors found" };
    }

    const result = doctors.map((d) => ({
      doctor: d.doctorName,
      specialization: d.specialization,
      availableSlots: d.availableTimings
    }));

    log("AVAILABLE SLOTS", result);

    return { success: true, availableSlots: result };

  } catch (error) {
    log("CHECK SLOT ERROR", error.message);
    return { success: false, message: error.message };
  }
}


module.exports = {
  bookAppointment,
  cancelAppointment,
  viewAppointments,
  checkAvailableSlots
};