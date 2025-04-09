
const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');

async function createBooking(req, res) {
    try {
        console.log("Request Body:", req.body);
        const response = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
        });
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error
        return res
                .status(error.statusCodes)
                .json(ErrorResponse)
    }
} 

module.exports = {
    createBooking,
}