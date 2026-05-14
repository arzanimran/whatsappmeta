async function processMessage(data) {

  const message = data.message.toLowerCase();

  if (message.includes("skin")) {

    return {
      success: true,
      intent: "BOOK_APPOINTMENT",
      doctor: "Dr. Rajesh",
      specialization: "Skin",
      slot: "5 PM",
      status: "BOOKED"
    };
  }

  if (message.includes("cancel")) {

    return {
      success: true,
      intent: "CANCEL_APPOINTMENT",
      status: "CANCELLED"
    };
  }

  if (message.includes("booking")) {

    return {
      success: true,
      intent: "VIEW_BOOKINGS",
      bookings: [
        {
          doctor: "Dr. Rajesh",
          time: "5 PM"
        }
      ]
    };
  }

  return {
    success: false,
    message: "Could not understand message"
  };
}

module.exports = {
  processMessage
};