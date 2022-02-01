# Getting Started with Backend

This project created using the following technologies 
Express
Mongodb for the database
Ajv library for handle error from request
Build schema for mongodb including validation and custom errors
JWT for manage token and secure the api

# Mount Database

##Install MongoDB server version: 4.2.3

Install MongoDb Compass for manage Database

Create Database named gatewaysdb

##Update .env file with parameters
Go to .env file and adding the url for mongodb and also api port for run the server

API_PORT=4001

MONGO_URI=mongodb://127.0.0.1:27017/gatewaysdb

##Start server
npm run dev
Wait until see
Server running on port 4001
Successfully connected to database


##Postman
Load the collection supplied BL.postman_collection.json
Register and user
Login user
Get the token
Using the token as Bearer Token Register a Gateway