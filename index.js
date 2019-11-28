const Network = require('ataraxia');
const LocalTransport = require('ataraxia-local');
const TCPTransport = require('ataraxia-tcp');
const Core = require("./core");

class Classroom {
	/**
	 * 
	 * @param {String} classroom classroom id.
	 */
	constructor(classroom) {
		this.name = classroom;
		this.net = new Network({ name: this.name });
		this.core = null;
		this.local = new LocalTransport();
		this.local.on('leader', () => {
			this.net.addTransport(new TCPTransport());
		});
		this.net.addTransport(this.local);
		this.net.start().then(() => {
			core = new Core(this.net, os.hostname());
		}).catch(console.error);
	}
}

module.exports = Classroom;




