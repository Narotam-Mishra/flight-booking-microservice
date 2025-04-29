
const cron = require('node-cron');

const { BookingService } = require('../../services');

function scheduleCrons() {
  cron.schedule("*/30 * * * *", async () => {
    console.log("starting cron jobs");
    await BookingService.cancelOldBookings();
  });
}

module.exports = scheduleCrons;

