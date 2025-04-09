
const axios = require('axios');
const { BookingRepository } = require('../repositories')
const db = require('../models');
const serverConfig = require('../config/server-config');

async function createBooking(data) {
    try {
        const result = db.sequelize.transaction(async function bookingImpl(t) {
            const flight = await axios.get(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
            // console.log("Flight details:", flight);
            return true;
        });
    } catch (error) {
        console.log("Error while create booking:", error);
        throw error;
    }
} 


module.exports = {
    createBooking,
}