'use strict';

const Homey = require('homey');

class MyDriver extends Homey.Driver {
	
	onInit() {
		this.log('Tradfri Group Driver has been initialized');
	}
	
	updateCapabilities(tradfriGroup)
	{
		let homeyDevice = this.getDevice({id: tradfriGroup.instanceId});
		if (homeyDevice instanceof Error) return; 
		homeyDevice.updateCapabilities(tradfriGroup);
	}
	
	onPairListDevices(data, callback) {
		let devices = [];
		if (!Homey.app.isGatewayConnected()) {
			callback(new Error("Please configure the gateway first."));
		}
		else
		{
			let groups = Homey.app.getGroups();
			for (const group of Object.values(groups)) {
				let capabilities = [];
					capabilities.push("onoff");
					capabilities.push("dim");

				devices.push({
					data: {
						id: group.instanceId,
					},
					capabilities: capabilities,
					name: group.name,
				});
			}	
			callback(null, devices.sort(MyDriver._compareHomeyDevice));
		}
	}

	static _compareHomeyDevice(a, b) {
		if (a.name < b.name)
			return -1;
		if (a.name > b.name)
			return 1;
		return 0;
	}
	
}

module.exports = MyDriver;