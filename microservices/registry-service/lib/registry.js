const semver = require("semver");

class Registry{
    constructor(){
        this.services = [];
        this.timeout = 15;
    }

    get(name, version){
        console.log(Object.values(this.services).length, '+++LEN BEFORE CLEAN UP+++');
        this.cleanup();
        const candidates = Object.values(this.services).filter((service) => {
            return service.name === name && semver.satisfies(service.version, version);
        });
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    // eslint-disable-next-line class-methods-use-this
    getKey(name, version, ip, port){
        return name + version + ip + port; 
    }

    register(name, version, ip, port){
        this.cleanup();
        const key = this.getKey(name, version, ip, port);
        if(!this.services[key]){
            this.services[key] = {};
            this.services[key].timestamp = Math.floor(new Date() / 1000);

            this.services[key].ip = ip;
            this.services[key].port = port;
            this.services[key].name = name;
            this.services[key].version = version;
            console.log(`Added services ${name},${version} at ${ip} : ${port}`);
            return key;
        }
        this.services[key].timestamp = Math.floor(new Date() / 1000);
        console.log(`++++Updated services ${name},${version} at ${ip} : ${port}`);
        return key;
    }

    unregister(name, version, ip, port){
        const key = this.getKey(name, version, ip, port);
        delete this.services[key];
        console.log(`Deleted services ${name},${version} at ${ip} : ${port}`);
        return key;
    }

    cleanup(){
        const now = Math.floor(Date.now() / 1000);
        Object.values(this.services).forEach((key, idx) => {
            if((key.timestamp + this.timeout)  < now){
                delete this.services[`${key.name}${key.version}${key.ip}${key.port}`];
                console.log(`+++ Removed expired service ${key.name}${key.version}${key.ip}${key.port}`);
            }
        });
    }

}

module.exports = Registry;