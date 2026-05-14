const appointmentService =
  require("../services/appointmentService");


async function bookAppointment(req, res) {

  try {

    const result =
      await appointmentService.bookAppointment(req.body);

    res.json(result);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


async function cancelAppointment(req, res) {

  try {

    const result =
      await appointmentService.cancelAppointment(req.body);

    res.json(result);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


async function viewAppointments(req, res) {

  try {

    const result =
      await appointmentService.viewAppointments(
        req.params.phone
      );

    res.json(result);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  bookAppointment,
  cancelAppointment,
  viewAppointments
};