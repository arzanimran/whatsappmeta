//this is ai brain of your system it will understand user message and extract intent and entities from it
/*function detectIntent(message) {
  const lowerMessage = message.toLowerCase();//everything lowercase so matching is easy

  // CANCEL — check before BOOK (so "cancel appointment" doesn't trigger BOOK)
  if (lowerMessage.includes("cancel")) {
    return {
      intent: "CANCEL_APPOINTMENT",
      appointmentDate: extractDate(message),
      slot: extractSlot(message)
    };
  }

  // VIEW APPOINTMENTS
  if (
    lowerMessage.includes("show") ||
    lowerMessage.includes("upcoming") ||
    lowerMessage.includes("view") ||
    lowerMessage.includes("my booking") ||
    lowerMessage.includes("my appointment")
  ) {
    return { intent: "VIEW_APPOINTMENTS" };
  }

  // CHECK SLOTS
  if (
    lowerMessage.includes("slot") ||
    lowerMessage.includes("available") ||
    lowerMessage.includes("availability") ||
    lowerMessage.includes("any slot")
  ) {
    return { intent: "CHECK_SLOT" };
  }

  // BOOK APPOINTMENT
  if (
    lowerMessage.includes("book") ||
    lowerMessage.includes("appointment") ||
    lowerMessage.includes("need") ||
    lowerMessage.includes("doctor") ||
    lowerMessage.includes("dr.") ||
    lowerMessage.includes("consult")
  ) {
    return {
      intent: "BOOK_APPOINTMENT",
      specialization: extractSpecialization(message),
      doctorName: extractDoctorName(message),
      appointmentDate: extractDate(message),
      slot: extractSlot(message)
    };
  }

  return { intent: "UNKNOWN" };
}

// SPECIALIZATION DETECTION
function extractSpecialization(message) {
  const text = message.toLowerCase();       

  if (text.includes("skin") || text.includes("dermat")) return "Dermatologist";
  if (text.includes("heart") || text.includes("cardio")) return "Cardiologist";
  if (text.includes("eye") || text.includes("ophthal")) return "Ophthalmologist";
  if (text.includes("dent") || text.includes("teeth") || text.includes("tooth")) return "Dentist";
  if (text.includes("ortho") || text.includes("bone") || text.includes("joint")) return "Orthopedist";

  return null;
}

// DOCTOR NAME DETECTION
function extractDoctorName(message) {
  const match = message.match(/dr\.?\s*([a-z]+)/i);
  if (!match) return null;
  return `Dr. ${capitalize(match[1])}`;
}

// DATE DETECTION
function extractDate(message) {
  const text = message.toLowerCase();
  if (text.includes("tomorrow")) return "Tomorrow";
  if (text.includes("today")) return "Today";

  // DD/MM or MM/DD patterns
  const dateMatch = message.match(/(\d{1,2})[\/\-](\d{1,2})/);
  if (dateMatch) return dateMatch[0];

  return "Next Available";
}

// SLOT / TIME DETECTION
function extractSlot(message) {
  const text = message.toLowerCase();

  if (text.includes("morning")) return "10:00 AM";
  if (text.includes("afternoon")) return "02:00 PM";
  if (text.includes("evening")) return "05:00 PM";
  if (text.includes("night")) return "06:00 PM";

  // e.g. "5 PM", "10AM", "10:30 AM"
  const timeMatch = message.match(/(\d{1,2}):?(\d{2})?\s?(AM|PM|am|pm)/i);
  if (timeMatch) {
    const hour = timeMatch[1];
    const min = timeMatch[2] ? timeMatch[2] : "00";
    const period = timeMatch[3].toUpperCase();
    return `${hour.padStart(2, "0")}:${min} ${period}`;
  }

  return "Next Available";
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

module.exports = {
  detectIntent,
  extractSpecialization,
  extractDoctorName,
  extractDate,
  extractSlot
};
*/



function detectIntent(message) {
  const lower = message.toLowerCase().trim();

  //  NEGATION HANDLING FIRST
  if (lower.includes("don't") || lower.includes("do not") || lower.includes("not book")) {
    return { intent: "UNKNOWN" };
  }

  //  CANCEL (highest priority)
  if (/cancel|remove|delete/i.test(lower)) {
    return {
      intent: "CANCEL_APPOINTMENT",
      appointmentDate: extractDate(message),
      slot: extractSlot(message)
    };
  }

  //  VIEW
  if (/show|view|upcoming|my booking|my appointment/i.test(lower)) {
    return { intent: "VIEW_APPOINTMENTS" };
  }

  //  SLOT CHECK
  if (/slot|available|availability|any slot/i.test(lower)) {
    return {
      intent: "CHECK_SLOT",
      specialization: extractSpecialization(message)
    };
  }

  //  BOOK APPOINTMENT
  if (/book|appointment|doctor|dr\.|consult|need/i.test(lower)) {
    return {
      intent: "BOOK_APPOINTMENT",
      specialization: extractSpecialization(message),
      doctorName: extractDoctorName(message),
      appointmentDate: extractDate(message),
      slot: extractSlot(message)
    };
  }

  return { intent: "UNKNOWN" };
}


//  SPECIALIZATION
function extractSpecialization(message) {
  const text = message.toLowerCase();

  if (/skin|dermat/i.test(text)) return "Dermatologist";
  if (/heart|cardio/i.test(text)) return "Cardiologist";
  if (/eye|ophthal/i.test(text)) return "Ophthalmologist";
  if (/dent|teeth|tooth/i.test(text)) return "Dentist";
  if (/ortho|bone|joint/i.test(text)) return "Orthopedist";

  return null;
}


//  DOCTOR NAME (FIXED MULTI-WORD SUPPORT)
function extractDoctorName(message) {
  const match = message.match(/dr\.?\s*([a-z\s]+)/i);

  if (!match) return null;

  return "Dr. " + match[1]
    .trim()
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}


//  DATE
function extractDate(message) {
  const text = message.toLowerCase();

  if (text.includes("tomorrow")) return "Tomorrow";
  if (text.includes("today")) return "Today";

  const match = message.match(/(\d{1,2})[\/\-](\d{1,2})/);
  if (match) return match[0];

  return "Next Available";
}


//  SLOT (IMPROVED REAL WORLD FORMAT)
function extractSlot(message) {
  const text = message.toLowerCase();

  if (text.includes("morning")) return "10:00 AM";
  if (text.includes("afternoon")) return "02:00 PM";
  if (text.includes("evening")) return "05:00 PM";
  if (text.includes("night")) return "06:00 PM";

  const match = message.match(/(\d{1,2})(?::(\d{2}))?\s?(am|pm)/i);

  if (match) {
    let hour = match[1];
    let min = match[2] || "00";
    let period = match[3].toUpperCase();

    return `${hour.padStart(2, "0")}:${min} ${period}`;
  }

  return "Next Available";
}

module.exports = {
  detectIntent,
  extractSpecialization,
  extractDoctorName,
  extractDate,
  extractSlot
};