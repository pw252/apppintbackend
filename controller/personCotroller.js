const Person = require("../Modal/Person");
const Slots = require("../Modal/PersonSlots");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
  });
  
  const upload = multer({ storage });
  const addPerson = async (req, res) => {
    const { name, email, about } = req.body;
    let image = req.file ? req.file.path : null;
  
    // Replace backslashes with forward slashes for compatibility
    if (image) {
      image = image.replace(/\\/g, "/");
    }
  
    try {
      // Check if a person with the same email already exists
      const existingPerson = await Person.findOne({ email });
      if (existingPerson) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      const person = new Person({
        name,
        email,
        about,
        image,
      });
  
      await person.save();
      res.status(201).json({ message: "Person created successfully", person });
    } catch (error) {
      console.error("Error creating person:", error);
      res.status(500).json({ message: "Failed to create person", error });
    }
  };
  
  const getPersons = async (req, res) => {
    try {
      const persons = await Person.find();
      res.status(200).json(persons);
    } catch (error) {
      console.error("Error fetching persons:", error);
      res.status(500).json({ message: "Failed to fetch persons", error });
    }
  };
  const getPersonsById = async (req, res) => {
    const { id } = req.params;
    try {
      const persons = await Person.findById(id);
      res.status(200).json(persons);
    } catch (error) {
      console.error("Error fetching persons:", error);
      res.status(500).json({ message: "Failed to fetch persons", error });
    }
  };
   
  const personSlots = async (req, res) => {

    const { person_id,day, startTime, endTime, interval } = req.body;

    if (!day || !startTime || !endTime || !interval) {
      return res.status(400).json({ error: 'Please provide day, startTime, endTime, and interval' });
    }
  
    try {
      // Find the person by ID
      const person = await Person.findById(person_id);
      if (!person) {
        return res.status(404).json({ error: 'Person not found' });
      }
  
      // Helper function to convert time to 24-hour format
      const convertTo24HourFormat = (time) => {
        let [timePart, period] = time.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);
  
        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }
        return { hours, minutes };
      };
  
      // Helper function to generate time slots
      const generateTimeSlots = () => {
        const slots = [];
        let { hours: startHour, minutes: startMinute } = convertTo24HourFormat(startTime);
        const { hours: endHour, minutes: endMinute } = convertTo24HourFormat(endTime);
      
        // Continue generating slots until the start time is less than or equal to the end time
        while (startHour < endHour || (startHour === endHour && startMinute <= endMinute)) {
          const period = startHour < 12 ? 'AM' : 'PM';
          const formattedHour = startHour % 12 === 0 ? 12 : startHour % 12;
          const formattedMinute = startMinute < 10 ? `0${startMinute}` : startMinute;
      
          // Push the current time slot
          slots.push(`${formattedHour}:${formattedMinute} ${period}`);
      
          // Increment time by the interval
          startMinute += interval;
          if (startMinute >= 60) {
            startHour += 1;
            startMinute -= 60;
          }
        }
      
        return slots;
      };
      
      

      const slots = generateTimeSlots();
      let personSlot = await Slots.findOne({ person: person._id });
  
      if (personSlot) {
        personSlot.slots.set(day, slots);
      } else {
        personSlot = new Slots({
          person: person._id,
          slots: { [day]: slots },
        });
      }
  
      await personSlot.save();
      res.status(201).json({ [day]: slots });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  const getPersonSlotsByDay = async (req, res) => {
    const { person_id, day } = req.params;
  
    if (!person_id || !day) {
      return res.status(400).json({ error: 'Please provide person_id and day' });
    }
  
    try {
      // Find the slot document for the person
      const personSlot = await Slots.findOne({ person: person_id });
  
      // Check if the person has any slots
      if (!personSlot) {
        return res.status(404).json({ error: 'Slots not found for this person' });
      }
  
      // Check if the requested day exists in the slots
      const slotsForDay = personSlot.slots.get(day);
      if (!slotsForDay) {
        return res.status(404).json({ error: `No slots found for day: ${day}` });
      }
  
      // Return the slots for the requested day in the specified format
      res.status(200).json({ slots: slotsForDay });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  

module.exports = {  
    addPerson,
    upload,
    personSlots,
    getPersons,
    getPersonsById,
    getPersonSlotsByDay
}