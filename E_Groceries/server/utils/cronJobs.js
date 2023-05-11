const cron = require('node-cron');
const Orders = require("../models/Orders");

function start() {
  cron.schedule('0 * * * *', async () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const orders = await Orders.updateMany(
      { status: 'Not Process', createdAt: { $lte: twoHoursAgo } },
      { $set: { status: 'Processing' } }
    );
    console.log(`Cron job for updating order status to 'Processing'.`);
  });

  cron.schedule('05 * * * *', async () => {
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const orders = await Orders.updateMany(
      { status: 'Processing', createdAt: { $lte: fourHoursAgo } },
      { $set: { status: 'Shipped' } }
    );
    console.log(`Cron job for updating order status to 'Shipped'.`);
  });  
  
  cron.schedule('10 * * * *', async () => {
    const twentyHoursAgo = new Date(Date.now() - 20 * 60 * 60 * 1000);
    const orders = await Orders.updateMany(
      { status: 'Shipped', createdAt: { $lte: twentyHoursAgo } },
      { $set: { status: 'Delivered' } }
    );
    console.log(`Cron job for updating order status to 'Delivered'.`);
  });
}

module.exports = { start };
