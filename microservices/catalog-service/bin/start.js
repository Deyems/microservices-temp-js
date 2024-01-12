#!/usr/bin/env node

/* eslint-disable import/order */

// Import necessary dependencies
// HTTP server functionality
const config = require("../config"); // Configuration settings

// eslint-disable-next-line no-unused-vars
const tracing = require("../lib/tracing")(
  `${config.serviceName}:${config.serviceVersion}`
);

// Import necessary dependencies
const http = require("http"); // HTTP server functionality

const axios = require('axios');

const connectToMongoose = require("../lib/mongooseConnection"); // Function to connect to MongoDB
// const connectToRedis = require("../lib/redisConnection"); // Function to connect to Redis

// Prepare the Redis client to connect to later
// This has to come before `app` is initiated because sessions depend on it
// config.redis.client = connectToRedis(config.redis.options);

const app = require("../app"); // Express application

// Create the HTTP server with the express app
const server = http.createServer(app);

// Attach error and listening handlers to the server
server.on("listening", () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log('are we getting to this Catalog refine?')
  const register = async () => 
  axios
  .put(`http://localhost:3080/register/${config.serviceName}/${config.serviceVersion}/${server.address().port}`)
  .catch(err => {
    console.error(`error occured`, JSON.stringify(err.stack));
  });
  
  const unregister = async () => 
  axios
  .delete(`http://localhost:3080/register/${config.serviceName}/${config.serviceVersion}/${server.address().port}`)
  .catch(err => {
    console.error(`error occured`, JSON.stringify(err.message));
  });

  register();
  const interval = setInterval(register, 10000);

  const cleanup = async () => {
    const clean = false;
    if(!clean){
      clearInterval(interval);
      unregister();
    }
  }

  process.on("uncaughtException", async () => {
    await cleanup();
    process.exit(0);
  });
 
  process.on("SIGTERM", async () => {
    await cleanup();
    process.exit(0);
  });
  
  process.on("SIGINT", async () => {
    await cleanup();
    process.exit(0);
  });

  console.info(
    `${config.serviceName}:${config.serviceVersion} listening on ${bind}`
  );
});

// Start the server
connectToMongoose(config.mongodb.url).then(() => {
  server.listen(0);
});
