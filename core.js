const Network = require('ataraxia');
const os = require("os");
const ip = require("ip");

class Core {
	/**
	 * @description Construct only at network started.
	 * @param {Network} net Ataraxia Network.
	 */
	constructor(net) {
		this.net = net;
		this.ip = ip.address();
		this.machines = [];
		net.on('node:available', (node) => {
			this.sendData(node, 'myInfo', this.myInfo());
		})
		net.on('message', ({ returnPath, type, data }) => {
			// is it myInfo
			if (type === "myInfo") {
				this.myInfoParser(returnPath, type, data);
			}
		})
	}

	myInfoParser(returnPath, type, data) {
		if (!this.machines.includes(data) && type === "myInfo") {
			if (process.env.DEBUG) console.info("new machine discovered");
			this.machines.push(data);
		}
	}

	myInfo() {
		return {
			name: this.name,
			hostname: this.hostname,
			ip: this.ip,
			version: this.version,
			networkInterfaces: os.networkInterfaces()
		}
	}

	/**
	 * 
	 * @param {*} node Node to send info to.
	 * @param {String} type Inforpation Type.
	 * @param {Object} data Data that will be sent.
	 */
	sendData(node, type, data) {
		return node.send(type, data);
	}
}

module.exports = Core;