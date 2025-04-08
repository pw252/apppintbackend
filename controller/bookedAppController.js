const BookedApp = require('../Modal/BookedApp');


const bookedApp = async (req, res) => {
    const { person, date, time,name,address,phone } = req.body;
  
    try {
      let existingRecord = await BookedApp.findOne({ person: person });
  
      if (existingRecord) {
        existingRecord.appointments.push({ date, time,name,address,phone });
        await existingRecord.save();
  
        res.status(200).json({
          message: "New appointment added successfully",
          appointments: existingRecord.appointments,
        });
      } else {
        const newBookedApp = new BookedApp({
          person,
          appointments: [{ date, time,name,address,phone }],
        });
  
        await newBookedApp.save();
        res.status(201).json({
          message: "New person and appointment created successfully",
          appointments: newBookedApp.appointments,
        });
      }
    } catch (error) {
      console.error("Error managing appointment:", error);
      res.status(500).json({ message: "Failed to manage appointment", error });
    }
  };

  const getAppointments = async (req, res) => {
    const { person } = req.params; // extract person ID from params
  
    try {
      let existingRecord = await BookedApp.findOne({ person: person });
  
      if (existingRecord) {
        res.status(200).json({
          message: "Appointments retrieved successfully",
          appointments: existingRecord.appointments,
        });
      } else {
        res.status(404).json({
          message: "No appointments found for the specified person",
        });
      }
    } catch (error) {
      console.error("Error retrieving appointments:", error);
      res.status(500).json({ message: "Failed to retrieve appointments", error });
    }
  };
  
  

module.exports = {bookedApp,getAppointments}