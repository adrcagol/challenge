# Home Challenge


## Home Challenge (webclient server for request data from wiremock) 

** FOLDER server ***

### To install:

    npm install

### To run:

    npm start
	

## Home Challenge (supermarket)

** FOLDER supermarket ***

### To install:

    npm install

### To run:

    npm start
	
## Description 

To meet the test I made two javascript applications:
- Backend (server) that operates as a webservice to access the wiremock API
- Frontend (supermarket) with the operational interface

The supermarket frontend allows operating in two ways set by checkbox:
- Automatic calculation and update: It calculates promotions and the total value of the basket in real time, with an update of the data with the API every 60 seconds.
- Calculation at checkout: Fetch product promotions data in the API and calculates the total amount only at checkout.
