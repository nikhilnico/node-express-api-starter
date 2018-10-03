# Node Express Api Starter Kit

The bash script tested on Ubuntu 18.04


## Installation ##

* `git clone https://github.com/nikhilnico/node-express-api-starter.git projectname`
* `cd projectname`
* `./start.sh`

## Google API Configration ##
* update the `googleDistanceApi.apiKey` in `controllers/order.js` on Line number 8

## Examples ##

#### Place order
```
	curl -i -X POST -H "Content-Type:application/json" http://127.0.0.1:8080/order -d '{"origin":["START_LATITUDE", "START_LONGTITUDE"], "destination": ["END_LATITUDE", "END_LONGTITUDE"]}'
```
	
#### Update order
```
	curl -i -X POST -H "Content-Type:application/json" http://localhost:8080/order/:id -d '{"status": "taken"}'
```

#### List Order
```
	curl -i -X GET -H "Content-Type:application/json" http://localhost:8080/orders
