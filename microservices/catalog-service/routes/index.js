const express = require("express");
const CatalogService = require('../lib/CatalogService');
const requireAdmin = require("../lib/requireAdmin");

const router = express.Router();

const createResponse = (item) => {
  return {id: item.id, price: item.price, sku: item.sku, name: item.name}
}

// Define your RESTful routes here
router.get("/", (req, res) => {
  // Return a JSON response with a 'hello world' message
  res.json({ msg: "hello world" });
});

router.get("/items", async (req, res) => {
  try {
    const items = await CatalogService.getAll();
    return res.json(items.map(createResponse));
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Internal Server Error"});
  }
});

router.get("/items/:id", async (req, res) => {
  try {
    const item = await CatalogService.getOne(req.params.id);
    if(!item){
      return res.status(404).json({error: 'Item not found'});
    }
    return res.json(createResponse(item));
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Internal Server Error"});
  }
});

router.post("/items", requireAdmin, async (req, res) => {
  try {
    const newItem = await CatalogService.create(req.body);
    return res.json(createResponse(newItem));
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Internal Server Error"});
  }
});

router.put("/items/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await CatalogService.update(id, req.body);
    if(!updatedItem){
      return res.status(404).json({error: 'Item not found'});
    }
    return res.json(createResponse(updatedItem));
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Internal Server Error"});
  }
});

router.delete("/items/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await CatalogService.remove(id);
    if(deletedItem.deletedCount === 0){
      return res.status(404).json({error: 'Item not found'});
    }
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Internal Server Error"});
  }
});

module.exports = router;