module.exports = (app) => {

    const orderController = require('../controllers/order');

    app.post('/order', orderController.create);

    app.put('/order/:id', orderController.update);

    app.get('/orders', orderController.findAll);
    app.get('/orders?page=:page&limit=:limit', orderController.findAll);

    app.get('/*', function(req, res){
        res.status(404).send('404');
    });
}