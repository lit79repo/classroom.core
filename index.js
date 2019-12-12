
/**
 * @copyright Copyright (C) 2019 Misha Marinenko
 * @description Core Part for Classroom Management Software.
 * @name @lit79/classroom.core
 * @package @lit79/classroom.core
 */

console.log("@lit79/classroom.core Copyright (C) 2019  Misha Marinenko", "\n", "https://github.com/lit79repo/classroom.core");
console.warn("[WARNING] [PRIVACY]", "Crashes and Errors will be collected to https://sentry.io", "\n", "Data That will be Sent:", "version, hostname, username, is ENV var 'DEBUG' defined as Boolean.");

const Network = require('ataraxia');
const LocalTransport = require('ataraxia-local');
const TCPTransport = require('ataraxia-tcp');
const Core = require("./core");
const os = require("os");
const { version } = require("./package");

const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://58008239544b463a9288b094cc846707@sentry.io/1843654', debug: (process.env.DEBUG ? true : false), release: version });


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
			this.core = new Core(this.net, os.hostname());
		}).catch(console.error);
		Sentry.configureScope((scope) => {
			scope.setUser({
				"username": os.userInfo().username
			});
			scope.setExtra("net_name", (classroom ? classroom : "all"));
			scope.setExtra("hostname", os.hostname());
		});
	}
}

module.exports = Classroom;