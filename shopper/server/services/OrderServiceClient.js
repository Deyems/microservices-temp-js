
/** @module OrderServiceClient */

// eslint-disable-next-line max-classes-per-file
const amqp = require("amqplib");
const ServiceClient = require("./ServiceClient");


// eslint-disable-next-line no-unused-vars
class OrderServiceClient2 {

    /**
     * Create a new order
     * @param {Object} user - The user who is creating the order
     * @param {Array} items - The items in the order
     * @param {Array} token - The token to access the resource
     * @returns {Promise<Object>} - A promise that resolves to the new order
    */
  static async create(userId, email, items, token) {
    try {
        const result = await ServiceClient.callService("order-service", {
            method: "POST",
            url: "/orders",
            data: { userId, email, status: "Not Shipped", items },
            headers: {Authorization: `Bearer ${token}`},
        });
        return result;
    } catch (error) {
        console.error(error, 'Error at Order Service Creating');
        return [];
    }
  }

    /**
   * Get all orders
   * @returns {Promise<Array>} - A promise that resolves to an array of orders
   */
  static async getAll(token) {
    try {
        const result = await ServiceClient.callService("order-service", {
            method: "GET",
            url: "/orders",
            headers: {Authorization: `Bearer ${token}`},
        });
        return result;
        // return Order.find().populate("items");
    } catch (error) {
        console.error(error, 'Error occured at GetAll');
        return [];
    }
  }

  /**
   * Update the status of an order
   * @param {string} orderId - The ID of the order to update
   * @param {string} status - The new status
   * @returns {Promise<Object|null>} - A promise that resolves to the updated
   * order, or null if no order was found
   */
  static async setStatus(orderId, status, token) {
    try {
        const result = await ServiceClient.callService("order-service", {
            method: "PUT",
            url: `/orders/${orderId}`,
            data: { status },
            headers: {Authorization: `Bearer ${token}`},
        });
        return result;
        // return Order.findByIdAndUpdate(orderId, { status }, { new: true });
    } catch (error) {
        console.error(error, 'Error at Set Status');
        return null;
    }
  }

}

/**
 * Service class for managing orders
 */
class OrderServiceClient {
  /**
   * Create a new order
   * @param {Object} user - The user who is creating the order
   * @param {Array} items - The items in the order
   * @returns {Promise<Object>} - A promise that resolves to the new order
   */
  static async create(userId, email, items) {
    try {
        const connection = await amqp.connect("amqp://127.0.0.1");
        const channel = await connection.createChannel();
        const queue = "orders";
        const message = JSON.stringify({userId, email, items});
    
        await channel.assertQueue(queue, {durable: true});
        channel.sendToQueue(queue, Buffer.from(message));
        console.log(" [x] Sent to %s", message);
    } catch (error) {
        console.error(error, 'Error at Create using AMQP');
    }
    /**
    return ServiceClient.callService("order-service", {
      method: "post",
      url: `/orders`,
      data: { userId, email, items }
    });
    *
    */

  }

  /**
   * Get all orders
   * @returns {Promise<Array>} - A promise that resolves to an array of orders
   */
  static async getAll() {
    try {
      return ServiceClient.callService("order-service", {
        method: "get",
        url: `/orders`
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Update the status of an order
   * @param {string} orderId - The ID of the order to update
   * @param {string} status - The new status
   * @returns {Promise<Object|null>} - A promise that resolves to the updated
   * order, or null if no order was found
   */
  static async setStatus(orderId, status) {
    return ServiceClient.callService("order-service", {
      method: "put",
      url: `/orders/${orderId}`,
      data: { status }
    });
  }
}

module.exports = OrderServiceClient;