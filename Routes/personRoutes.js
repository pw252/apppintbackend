const express = require('express')
const { addPerson,upload, personSlots, getPersons, getPersonsById, getPersonSlotsByDay
} = require('../controller/personCotroller')

const router = express.Router()

router.post("/addPerson", upload.single("image"), addPerson)
router.post("/personSlots",  personSlots)
router.get("/getPerson",  getPersons)
router.get("/getPersonById/:id",  getPersonsById)
router.get("/getSlots/:person_id/:day",  getPersonSlotsByDay
)

module.exports = router