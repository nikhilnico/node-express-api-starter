var mongoose = require('mongoose');
var googleDistanceApi = require('google-distance');
const Order = require('../models/Order');

/**
 * Google API
 */
googleDistanceApi.apiKey = '';

/**
 * Create new order
 */
exports.create = (req, res) => {
    // Joi validation library to validate request
    const Joi = require('joi');

    const data = req.body;
    var pattern = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/
    const validationSchema = Joi.object().keys({
        origin: Joi.array().ordered(Joi.string().regex(pattern, 'numbers'), Joi.string().regex(pattern, 'numbers')).min(2).max(2),
        destination: Joi.array().items(Joi.any().required(),Joi.any().required()).required(),
    });

    Joi.validate(data, validationSchema);

    // Get distance from Google API
    var distance = getDistance(req);

    distance.then(function(result){

        //Create new object to save
        var order = new Order({
            origin: req.body.origin,
            destination: req.body.destination,
            distance: result.distance,
            status: "UNASSIGN"
        });

        //Save new order
        order.save().then( data => {
            res.status(200).send({
                id: data._id,
                distance: data.distance,
                status: data.status
            });
        }).
        catch(err => {
            res.status(409).json({error: err.message || "Error while creating new order."});
        });
    }).
    catch(err => {
        res.status(409).json({error: err.message || "Error while getting distance from API."});
    });
}

/**
 * update order by id
 */
exports.update = (req, res) => {

    var query = {_id: req.params.id};

    Order.findOne(query, (err, order) => {
        if (err) {
            res.status(409).json({error: err.message || "Error while getting order by id."});
        }

        if ('taken' === order.status) {
            res.status(409).json({error: 'ORDER_ALREADY_BEEN_TAKEN'})
            return;
        }

        order.status = req.body.status;
        order.save(function (err, updatedOrder) {
            if (err) {
                res.status(409).json({error: err.message || "Error while updating order."});
            }
            res.status(200).json({status: 'SUCCESS'});
        });
    });
}

/**
 * Get all orders
 */
exports.findAll = (req, res) => {

    var limit = parseInt(req.query.limit) || 10
    var page = parseInt(req.query.page) || 1
    var skips = limit * (page - 1)

    Order.find({}, {id: 1, distance: 2, status: 3}, (err, Order) => {
        if (err) throw err

        res.status(200).json(Order);
    }).skip(skips).limit(limit);
}

/**
 * Get distance from Google API
 * @param req is request object with origin lat,long and destination lat,long
 */
function getDistance(req) {
    return new Promise(function(resolve, reject) {
        googleDistanceApi.get({
            index: 1,
            origin: req.body.origin.toString(),
            destination: req.body.destination.toString()
        },
        function(err, result) {
            if (err) reject(err)

            resolve(result);
        });
    })
}