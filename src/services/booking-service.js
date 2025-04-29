
const axios = require('axios');
const { BookingRepository } = require('../repositories')
const db = require('../models');
const serverConfig = require('../config/server-config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { ServerConfig } = require('../config');
const { Enums } = require('../utils/common');
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;

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

async function cancelBooking(bookingId) {
  const transaction = await db.sequelize.transaction();

  try {
    // get booking details
    const bookingDetails = await bookingRepository.get(bookingId, transaction);
    
    // check if booking is already cancelled
    if(bookingDetails.status === CANCELLED){
      await transaction.commit();
      return true;
    }

    // if booking is not already cancelled then we need to make api call to update seats
    await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`, {
      seats: bookingDetails.noOfSeats,
      dec: 0,
    });

    // cancel booking and update booking status to cancelled
    await bookingRepository.update(bookingId, { status: CANCELLED }, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function makePayment(data){
  const transaction = await db.sequelize.transaction();

  try {
    const bookingDetails = await bookingRepository.get(data.bookingId, transaction);
    // console.log("Booking details:",bookingDetails);
    
    if(bookingDetails.status === CANCELLED){
      throw new AppError(`The booking has expired`, StatusCodes.BAD_REQUEST);
    }

    const bookingTime = new Date(bookingDetails.createdAt)
    const currentTime = new Date();
    
    // check for timeout condition
    if(currentTime - bookingTime > 300000){
      await cancelBooking(data.bookingId);
      throw new AppError(`The booking has expired`, StatusCodes.BAD_REQUEST);
    }

    if(bookingDetails.totalCost != data.totalCost){
      // console.log("Booking details cost:",bookingDetails.totalCost, typeof(bookingDetails.totalCost));
      // console.log("Passed total cost:", data.totalCost, typeof(data.totalCost));
      throw new AppError(`The amount of the payment doesn't match`, StatusCodes.BAD_REQUEST);
    }

    if(bookingDetails.userId != data.userId){
      // console.log("User Id:",bookingDetails.userId, typeof(bookingDetails.userId));
      // console.log("Passed User Id:",data.userId, typeof(data.userId));
      throw new AppError(`The user corresponding to the booking doesn't match`, StatusCodes.BAD_REQUEST);
    }

    // we assume that payment is successfull
    await bookingRepository.update(data.bookingId, { status: BOOKED }, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function cancelOldBookings(){
  try {
    console.log("inside cancel service");
    // time 5 minutes ago
    const time = new Date(Date.now() - 1000 * 300); 
    const response = await bookingRepository.cancelOldBookings(time);
    // console.log("Cancel Bookings:", response);
    return response;
  } catch (error) {
    console.log("Error while cancelling old booking:",error);
  }
}

module.exports = {
  createBooking,
  makePayment,
  cancelBooking,
  cancelOldBookings,
}