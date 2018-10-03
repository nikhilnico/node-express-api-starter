const expect    = require("chai").expect;
const request = require('supertest');
const app = require('../server.js');
const sinon = require('sinon');

const Order = require('../models/Order');

/*
* @test
*/
describe('GET /', () => {
    it('should return 404 for Non configured Urls', (done) => {
        request(app)
            .get('/')
            .expect(404, done);
    });
});

/*
* @test
*/
describe('POST /order', () => {

    it('should return error with invalid request', (done) => {
        request(app)
            .post('/order')
            .send({origin: ["28.aa", "77.111761"], destination: ["28.530264", "77.111761"]})
            .expect(409)
            .end(function(err, res) {
                done();
            });
    });

    it('should return error for invalid lat or log.', (done) => {
        request(app)
            .post('/order')
            .send({origin: ["76.904216", "77.111761"], destination: ["28.530264", "77.111761"]})
            .expect(409)
            .end(function(err, res) {
                done();
            });
    });

    it('should create order with valid request', (done) => {
      request(app)
        .post('/order')
        .send({origin: ["28.530264", "77.111761"], destination: ["28.530264", "77.111761"]})
        .end(function(err, res) {
            expect(res.statusCode).to.be.equal(200);
            done();
        });
    });

    it('should be order status UNASSIGN for new order', (done) => {
        request(app)
          .post('/order')
          .send({origin: ["28.530264", "77.111761"], destination: ["28.530264", "77.111761"]})
          .end(function(err, res) {
              expect(res.body.status).to.be.equal('UNASSIGN');
              expect(res.statusCode).to.be.equal(200);
              done();
          });
    });
});

/*
* @test
*/
describe('PUT /order/:id', () => {

    it('should update order status by id', (done) => {
        const OrderMock = sinon.mock(Order);
        const expectedResult = {
            status: 'SUCCESS'
        };

        OrderMock
            .expects('findOne')
            .withArgs({ _id: '5bae09159bd7ce419cfb4320' })
            .yields(null, expectedResult);

        Order.findOne({_id: '5bae09159bd7ce419cfb4320'}, (err, result) => {
            OrderMock.verify();
            OrderMock.restore();
            expect(result.status).to.equal('SUCCESS');
            done();
        });
    });

    it('should return error for already accepted order', (done) => {
        const OrderMock = sinon.mock(Order);
        const expectedResult = {
            error: 'ORDER_ALREADY_BEEN_TAKEN'
        };

        OrderMock
            .expects('findOne')
            .withArgs({ _id: '5bae09159bd7ce419cfb4320' })
            .yields(null, expectedResult);

        Order.findOne({_id: '5bae09159bd7ce419cfb4320'}, (err, result) => {
            OrderMock.verify();
            OrderMock.restore();
            expect(result.error).to.equal('ORDER_ALREADY_BEEN_TAKEN');
            done();
        });
    });

});

/*
* @test
*/
describe('GET /orders', () => {

    it('should get orders', (done) => {
        request(app)
            .get('/orders')
            .expect(200)
            .end(function(err, res) {
                expect(res.statusCode).to.be.equal(200);
                done();
        });
    });

});

