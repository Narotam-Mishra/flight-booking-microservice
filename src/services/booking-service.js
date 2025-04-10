
const axios = require('axios');
const { BookingRepository } = require('../repositories')
const db = require('../models');
const serverConfig = require('../config/server-config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

async function createBooking(data) {
    return new Promise((resolve, reject) => {
        const result = db.sequelize.transaction(async function bookingImpl(t) {
            const flight = await axios.get(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
            // console.log("Flight details:", flight);

            const flightData = flight.data.data;
            if(data.numOfSeats > flightData.totalSeats){
                reject(new AppError('Not enough seats available', StatusCodes.BAD_REQUEST));
            }
            resolve(true); 
        });
    })
} 


module.exports = {
    createBooking,
}