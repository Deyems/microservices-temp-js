/** @module CatalogClient */

// Import the Item model from mongoose
// const ItemModel = require("../models/Item");

const ServiceClient = require("./ServiceClient");

let itemsCache = [];

/**
 * Service class for interacting with the Item catalog
 */
class CatalogClient {
  /**
   * Get all items from the database, sorted in descending order by creation time
   * @returns {Promise<Array>} - A promise that resolves to an array of Items
   */
  static async getAll() {
    try {
      const result = await ServiceClient.callService("catalog-service", {
        method: "get",
        url: `/items`
      });
      itemsCache = result;
      return result;
      // return ItemModel.find({}).sort({ createdAt: -1 }).exec();
    } catch (error) {
      console.error(error, 'at getAll Catalog');
      return itemsCache;
    }
  }

  /**
   * Get a single item from the database
   * @param {string} itemId - The id of the item to retrieve
   * @returns {Promise<Object>} - A promise that resolves to an Item object
   */
  static async getOne(itemId) {
    try {
      const result = await ServiceClient.callService("catalog-service", {
        method: "get",
        url: `/items/${itemId}`
      });
      return result;
      // return ItemModel.findById(itemId).exec();
    } catch (error) {
      console.error(error, 'at getOne Catalog');
      return null;
    }
  }

  /**
   * Create a new item in the database
   * @param {Object} data - The data for the new item
   * @returns {Promise<Object>} - A promise that resolves to the new Item object
   */
  static async create(data, token) {
    try {
      const result = await ServiceClient.callService("catalog-service", {
        method: "POST",
        url: `/items`,
        data,
        headers: {Authorization: `Bearer ${token}`},
      });
      return result;
    } catch (error) {
      console.error(error, 'at Create Catalog');
      return null;
    }
  }

  /**
   * Update an existing item in the database
   * @param {string} itemId - The id of the item to update
   * @param {Object} data - The new data for the item
   * @returns {Promise<Object|null>} - A promise that resolves to the updated Item object, or null if no item was found
   */
  static async update(itemId, data, token) {
    try {
      const result = await ServiceClient.callService("catalog-service", {
        method: "put",
        url: `/items/${itemId}`,
        data,
        headers: {Authorization: `Bearer ${token}`},
      });
      return result;
      // return ItemModel.findByIdAndUpdate(itemId, data, { new: true }).exec();
    } catch (error) {
      console.error(error, 'at Update Catalog');
      return null;
    }
  }

  /**
   * Remove an item from the database
   * @param {string} itemId - The id of the item to remove
   * @returns {Promise<Object>} - A promise that resolves to the deletion result
   */
  static async remove(itemId, token) {
    try {
      const result = await ServiceClient.callService("catalog-service", {
        method: "delete",
        url: `/items/${itemId}`,
        headers: {Authorization: `Bearer ${token}`},
      });
      return result;
      // return ItemModel.deleteOne({ _id: itemId }).exec();
    } catch (error) {
      console.error(error, 'at Delete Catalog');
      return null;
    }
  }
}

module.exports = CatalogClient;
