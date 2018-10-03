/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * Order Schema
 */
var orderSchema = new mongoose.Schema({
    origin: [],
    destination: [],
    distance: String,
    status: String
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;