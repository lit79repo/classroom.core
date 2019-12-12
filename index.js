/**
 * @copyright Copyright (C) 2019 Misha Marinenko
 * @description Core Part for Classroom Management Software.
 * @name @lit79/classroom.core
 * @package @lit79/classroom.core
 */

console.log("@lit79/classroom.core Copyright (C) 2019  Misha Marinenko", "\n", "https://github.com/lit79repo/classroom.core");
console.warn("[WARNING] [PRIVACY]", "Crashes and Errors will be collected to https://sentry.io", "\n", "Data That will be Sent:", "version, hostname, username, is ENV var 'DEBUG' defined as Boolean.");

const Sentry = require('@sentry/node');
const { version } = require("./package.json");
const os = require("os");
const ip = require("ip");

class Classroom {
	constructor(name, teacher) {
		Sentry.init({ dsn: 'https://58008239544b463a9288b094cc846707@sentry.io/1843654', debug: (process.env.DEBUG ? true : false), release: version });
		Sentry.configureScope((scope) => {
			scope.setUser({
				"username": os.userInfo().username
			});
			scope.setExtra("net_name", (name ? name : "all"));
			scope.setExtra("hostname", os.hostname());
		});
		this.name = name ? name : "all";
		this.hostname = (os.hostname());
		this.teacher = (teacher ? teacher : false);
		this.ip = ip.address();
		this.version = version;
		this.local = new LocalTransport();
		this.net = new Network({ name: this.name });
		this.debug = (process.env.DEBUG ? true : false);
		this.local.on('leader', () => {
			this.net.addTransport(new TCPTransport());
		});
		this.net.addTransport(this.local);
		this.machines = [];
		net.on('node:available', node => {
			if (this.debug) console.log('A new node is available:', node.id);
			if (this.teacher !== true) node.send("myInfo", this.myInfoHandler());
		});

		net.on('message', msg => {
			if (this.debug) console.log('A message was received', msg.type, 'with data', msg.payload, 'from', msg.returnPath.id);
			if (msg.type === "myInfo") this.machines.push(msg.data);
		});
	}
	bootstrap() {
		return this.net.start();
	}
	myInfoHandler() {
		return {
			name: this.name,
			hostname: this.hostname,
			ip: this.ip,
			version: this.version,
			networkInterfaces: os.networkInterfaces()
		}
	}
}

module.exports = Classroom;
