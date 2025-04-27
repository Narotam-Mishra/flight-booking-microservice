
const axios = require('axios');
const { BookingRepository } = require('../repositories')
const db = require('../models');
const serverConfig = require('../config/server-config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { ServerConfig } = require('../config');

const bookingRepository = new BookingRepository();

// async function createBooking(data) {
//     return new Promise((resolve, reject) => {
//         const result = db.sequelize.transaction(async function bookingImpl(t) {
//             const flight = await axios.get(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
//             // console.log("Flight details:", flight);

//             const flightData = flight.data.data;
//             if(data.numOfSeats > flightData.totalSeats){
//                 reject(new AppError('Not enough seats available', StatusCodes.BAD_REQUEST));
//             }
//             resolve(true); 
//         });
//     })
// }

async function createBooking(data) {
    const transaction = await db.sequelize.transaction();

    try {
      const flight = await axios.get(
        `${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
      );
      // console.log("Flight details:", flight);

      const flightData = flight.data.data;
      if (data.noOfSeats > flightData.totalSeats) {
        throw new AppError(
          "Not enough seats available",
          StatusCodes.BAD_REQUEST
        );
      }

      // calculate total price for flight and create booking
      const totalBillingAmount = data.noOfSeats * flightData.price;
      // console.log("Number of seats:", data.noOfSeats);
      
      // console.log("Total Billing Amount:", totalBillingAmount);

      const bookingPayload = {...data, totalCost: totalBillingAmount };
      const booking = await bookingRepository.create(bookingPayload, transaction);

      await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`, {
        seats: data.noOfSeats,
      })
       
      await transaction.commit();
      return booking;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}


module.exports = {
    createBooking,
}