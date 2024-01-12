const express = require("express");

const Registry = require("../lib/registry");

const registry = new Registry();

const router = express.Router();

function getRequestParams(req){
    const {servicename, serviceversion, serviceport} = req.params;
    let serviceip = req.ip;
    if(serviceip.includes("::ffff:127.0.0.1") || serviceip.includes("::1")){
        serviceip = "127.0.0.1";
    }
    return {servicename, serviceversion, serviceport, serviceip};
}

router.put("/register/:servicename/:serviceversion/:serviceport", (req, res, next) => {
    const {servicename, serviceversion, serviceport, serviceip} = getRequestParams(req);
    const key = registry.register(servicename, serviceversion, serviceip, serviceport);
    return res.json({result:  key});
});

router.delete("/register/:servicename/:serviceversion/:serviceport", (req, res, next) => {
    const {servicename, serviceversion, serviceport, serviceip} = getRequestParams(req);
    const key = registry.unregister(servicename, serviceversion, serviceip, serviceport);
    return res.json({result: key});
});

router.get("/find/:servicename/:serviceversion", (req, res, next) => {
    const {servicename, serviceversion } = getRequestParams(req);
    const service = registry.get(servicename, serviceversion);
    if(!service){
        res.status(404).json({error: "No Matching Service found"});
    }
    return res.json(service);
});

module.exports = router;