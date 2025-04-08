const express = require('express')
const { bookedApp, getAppointments } = require('../controller/bookedAppController')


const router = express.Router()

router.post("/bookedApp", bookedApp)
router.get("/getAppointments/:person", getAppointments)

module.exports = router