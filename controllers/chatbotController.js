/*const { detectIntent } = require("../services/nlpService");
const { log } = require("../services/loggerService");
const {
  bookAppointment,
  cancelAppointment,
  viewAppointments,
  checkAvailableSlots
} = require("../services/appointmentService");


async function handleMessage(req, res) {
  try {
    const { message, patientName, patientPhone } = req.body;

    if (!message || !patientPhone) {
      return res.status(400).json({
        success: false,
        message: "message and patientPhone are required"
      });
    }

    log("USER MESSAGE", { message, patientPhone });

    const intentData = detectIntent(message);
    log("DETECTED INTENT", intentData);

    const intent = intentData.intent;


    // ── BOOK APPOINTMENT ──────────────────────────────────────────
    if (intent === "BOOK_APPOINTMENT") {
      const result = await bookAppointment({
        patientName,
        patientPhone,
        specialization: intentData.specialization,
        doctorName: intentData.doctorName,
        appointmentDate: intentData.appointmentDate || "Next Available",
        slot: intentData.slot || "Next Available"
      });

      if (!result.success) {
        return res.json(result); // Doctor not found / slot issues
      }

      const appt = result.appointment;

      return res.json({
        success: true,
        intent: "BOOK_APPOINTMENT",
        doctor: appt.doctorName,
        specialization: appt.specialization,
        date: appt.appointmentDate,
        slot: appt.slot,
        status: appt.status
      });
    }


    // ── CANCEL APPOINTMENT ────────────────────────────────────────
    if (intent === "CANCEL_APPOINTMENT") {
      const result = await cancelAppointment({
        patientPhone,
        appointmentDate: intentData.appointmentDate,
        slot: intentData.slot
      });

      if (!result.success) {
        return res.json(result);
      }

      return res.json({
        success: true,
        intent: "CANCEL_APPOINTMENT",
        status: "CANCELLED",
        doctor: result.appointment.doctorName,
        slot: result.appointment.slot,
        date: result.appointment.appointmentDate
      });
    }


    // ── VIEW APPOINTMENTS ─────────────────────────────────────────
    if (intent === "VIEW_APPOINTMENTS") {
      const result = await viewAppointments(patientPhone);

      if (!result.success) {
        return res.json(result);
      }

      return res.json({
        success: true,
        intent: "VIEW_BOOKINGS",
        bookings: result.appointments.map((a) => ({
          doctor: a.doctorName,
          specialization: a.specialization,
          date: a.appointmentDate,
          time: a.slot,
          status: a.status
        }))
      });
    }


    // ── CHECK AVAILABLE SLOTS ─────────────────────────────────────
    if (intent === "CHECK_SLOT") {
      const result = await checkAvailableSlots(intentData.specialization);

      return res.json({
        success: true,
        intent: "CHECK_SLOT",
        availableSlots: result.availableSlots || []
      });
    }


    // ── UNKNOWN ───────────────────────────────────────────────────
    return res.json({
      success: false,
      intent: "UNKNOWN",
      message: "Could not understand your message. Try: 'Book skin doctor', 'Cancel appointment', 'Show my bookings', 'Available slots today'"
    });

  } catch (error) {
    log("CHATBOT ERROR", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { handleMessage };
*/




const { detectIntent } = require("../services/nlpService");
const { log } = require("../services/loggerService");
const {
  bookAppointment,
  cancelAppointment,
  viewAppointments,
  checkAvailableSlots
} = require("../services/appointmentService");

async function handleMessage(req, res) {
  try {
    const { message, patientName, patientPhone } = req.body;

    if (!message || !patientPhone) {
      return res.status(400).json({
        success: false,
        message: "message and patientPhone are required"
      });
    }

    log("USER MESSAGE", message);

    const intentData = detectIntent(message);
    log("INTENT", intentData);

    switch (intentData.intent) {

      //  BOOK
      case "BOOK_APPOINTMENT": {
        const result = await bookAppointment({
          patientName,
          patientPhone,
          ...intentData
        });

        return res.json(result);
      }

      //  CANCEL
      case "CANCEL_APPOINTMENT": {
        const result = await cancelAppointment({
          patientPhone,
          ...intentData
        });

        return res.json(result);
      }

      //  VIEW
      case "VIEW_APPOINTMENTS": {
        const result = await viewAppointments(patientPhone);
        return res.json(result);
      }

      //  SLOT
      case "CHECK_SLOT": {
        const result = await checkAvailableSlots(intentData.specialization);

        return res.json({
          success: true,
          intent: "CHECK_SLOT",
          availableSlots: result.availableSlots || []
        });
      }

      default:
        return res.json({
          success: false,
          intent: "UNKNOWN",
          message:
            "Try: 'Book skin doctor', 'Cancel appointment', 'Show my bookings', 'Available slots today'"
        });
    }

  } catch (error) {
    log("ERROR", error.message);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = { handleMessage };