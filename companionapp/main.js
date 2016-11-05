import Pins from "pins";
import {    HorizontalSlider, HorizontalSliderBehavior} from 'sliders';//@program/*  Copyright 2011-2014 Marvell Semiconductor, Inc.  Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.  You may obtain a copy of the License at      http://www.apache.org/licenses/LICENSE-2.0  Unless required by applicable law or agreed to in writing, software  distributed under the License is distributed on an "AS IS" BASIS,  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the License for the specific language governing permissions and  limitations under the License.*/// // Make da interface... Though note that we actually add it to the application in the asynchronous call.let background = new Skin({ fill: '#F2F2F2' });let orangeSkin = new Skin({ fill: '#F2994A' });let blueSkin = new Skin({ fill: '#56CCF2' });let whiteSkin = new Skin({ fill: 'white' });let buttonStyle = new Style({font: '30px Avenir', color: 'white'});let bowlLabelStyle = new Style({font: 'bold 30px Avenir', color: 'black'});

let sliderOn;let foodBowl = new Container({	name: 'bowl',
	width: 110, height: 110,	left: 10, right: 10,  skin: orangeSkin,	contents: [		new Label({ name: 'text', string: 'Food', style: buttonStyle })	],	active: true,	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {
			if (!sliderOn) {
				sliderOn = true;				application.main.amounts.add(AmountSlider({ min: 0, max: 5, value: 0 }));				application.main.amounts.add(new Label({ 
					name: 'amount', string: 'New food amount: 0 cups',
					style: new Style({font: '22px Avenir', color: 'black'})
				}));				application.main.amounts.add( new Line({
					top: 10,
					contents: [ new cancelButton(), new submitButton({ bowl: "Food" }) ] 
				}));
			}		}	}) });

let waterBowl = new Container({	name: 'bowl',
	width: 110, height: 110,	left: 10, right:10, skin: blueSkin,	contents: [		new Label({ name:'text',string: 'Water', style: buttonStyle })	],	active: true,	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {
			if (!sliderOn) {
				sliderOn = true;				content.container.container.container.add(AmountSlider({ min: 0, max: 5, value: 0 }));				content.container.container.container.add(new Label({ 
					name: 'amount', string: 'New water amount: 0 cups',
					style: new Style({font: '22px', color: 'black'})
				}));				content.container.container.container.add( new Line({
					top: 10,
					contents: [ new cancelButton(), new submitButton({ bowl: "Water" }) ] 
				}));
			}		}	}) });


let newAmount;let AmountSlider = HorizontalSlider.template($ => ({    height: 50, left: 50, right: 50,    Behavior: class extends HorizontalSliderBehavior {        onValueChanged(container) {
        	let amount = this.data.value.toPrecision(2);            trace("Value is: " + amount + "\n");
            application.main.amounts.amount.string = amount + ' cups';
            newAmount = amount;        }    }}));

let cancelButton = Container.template($ => ({
	skin: new Skin({ fill: 'gray' }),
	width: 80, height: 30, bottom: 30,
	left: 10, right:10,
	contents: [
		new Label({
			name: 'cancelButton', string: 'Cancel', style: new Style({ font: 'bold 22px Avenir', color: 'white' })
		})
	],
	active: true,
	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {
			application.main.amounts.empty(1, 4);
			sliderOn = false;		}	}) 
}));


let submitButton = Container.template($ => ({
	skin: new Skin({ fill: '#2D9CDB' }),
	width: 80, height: 30, bottom: 30,
	left: 10, right: 10,
	contents: [
		new Label({
			name: 'submitButton', string: 'Submit', style: new Style({ font: 'bold 22px Avenir', color: 'white' })
		})
	],
	active: true,
	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {
			trace("Submitting amount: " + newAmount + '\n');
			// Write a digital pin that says "Refilling!"
			remotePins.invoke("/refill" + $.bowl + "/write", 1);
			
			// Remove slider and submit button.
			application.main.amounts.empty(1, 4);
			sliderOn = false;		}	}) 
}));
let refreshSkin = new Skin({      width: 40, height:40,      texture: new Texture("assets/refresh.png"),      fill: "white",      aspect: "draw"});

let refreshBowlsButton = new Content({	name: 'refresh',
	width: 40, height: 40,	left: 80, top: 10, bottom: 10, skin: refreshSkin,	active: true,	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {			if (remotePins) {				remotePins.invoke("/food/read", value => {					trace("reading pins\n");					trace("value: " + value.amount + "\n");
					application.main.amounts.bowls.foodCol.bowl.text.string = value.amount.toPrecision(2) + ' cups';
					if (value.amount < 1) { 
						application.main.amounts.bowls.foodCol.bowl.height = 30;
					} else {
						application.main.amounts.bowls.foodCol.bowl.height = 110 * (value.amount / 5);
					}				});
				remotePins.invoke("/water/read", value => {					trace("reading pins\n");					trace("value: " + value.amount + "\n");
					application.main.amounts.bowls.waterCol.bowl.text.string = value.amount.toPrecision(2) + ' cups';
					if (value.amount < 1) { 
						application.main.amounts.bowls.waterCol.bowl.height = 30;
					} else {
						application.main.amounts.bowls.waterCol.bowl.height = 110 * (value.amount / 5);
					}				});			}		}	})});

let refreshCameraButton = new Content({	name: 'refresh',
	width: 40, height: 40,	left: 80, top: 10, bottom: 10, skin: refreshSkin,	active: true,	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {			if (remotePins) {				remotePins.invoke("/camera/read", value => {					trace("reading camera\n");					trace("value: " + value.imgID + "\n");
					let doggoID = value.imgID.toPrecision(1);
					if (application.main.camera.starttxt) {
						application.main.camera.remove(application.main.camera.starttxt);
					};
					if (application.main.camera.doggo) {
						application.main.camera.remove(application.main.camera.doggo);
					};
					let doggoPic = new Picture({ 
						name: 'doggo',
						top: 10, bottom: 10,
						height: 100, url: 'assets/doggo' + doggoID + '.png' })
					application.main.camera.add(doggoPic);				});			}		}	})});
let feedSkin = new Skin({      width: 120, height:120,      texture: new Texture("assets/bowl.png"),      fill: "white",      aspect: "fit"});

let feedButton = new Content({	name: 'feedBtn',
	width: 40, height: 40,	right: 30, left: 50, skin: feedSkin,	active: true,	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {			if (remotePins) {				remotePins.invoke("/food/read", value => {					trace("reading pins\n");					trace("value: " + value.amount + "\n");
									});
				remotePins.invoke("/water/read", value => {					trace("reading pins\n");					trace("value: " + value.amount + "\n");
									});			}
			
			
			if (application.main.camera) {
				application.main.remove(camScreen);
				application.main.header.remove(refreshCameraButton);
				application.main.header.add(refreshBowlsButton);
				application.main.insert(feedScreen, application.main.nav);
			}		}	})});
let camSkin = new Skin({      width: 120, height:100,      texture: new Texture("assets/camera.png"),      fill: "white",      aspect: "fit"});

let camButton = new Content({	name: 'camBtn',
	width: 40, height: 40,	right: 50, left:30, top:12, skin: camSkin,	active: true,	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {			if (remotePins) {				remotePins.invoke("/food/read", value => {					trace("reading pins\n");					trace("value: " + value.amount + "\n");
								});
				remotePins.invoke("/water/read", value => {					trace("reading pins\n");					trace("value: " + value.amount + "\n");				});			}
			
			
			if (application.main.amounts) {
				application.main.remove(feedScreen);
				application.main.header.remove(refreshBowlsButton);
				application.main.header.add(refreshCameraButton);
				application.main.insert(camScreen, application.main.nav);
			}		}
			})});
let takePicSkin = new Skin({      width: 120, height:120,      texture: new Texture("assets/takepic.png"),      fill: "white",      aspect: "fit"});

let takePicButton = new Content({	name: 'takePicBtn',
	width: 40, height: 40,	right: 50, left:30, skin: takePicSkin,	active: true,	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {			// take a picture		}
			})});

let feedScreen = new Column({ 
			skin: background,
			width: 320, height: 322,			name: 'amounts',
			contents: [
				new Line({ 
					name: 'bowls',
					contents: [						new Column({							name: "foodCol",							top: 20,							contents: [								new Label({ bottom: 10, string: "Food", style: bowlLabelStyle }),								foodBowl							]}),						new Column({							name: "waterCol",							top: 20,							contents: [								new Label({ bottom: 10, string: "Water", style: bowlLabelStyle }),								waterBowl 							]})
				] })			]		});
		
let camScreen = new Column({ 
			skin: background,			name: 'camera',
			width: 320, height: 322,			contents: [ 
				//takePicButton
				new Label({ 
					top: 40, bottom: 40, 
					name: 'starttxt', string: "Refresh to view live doggo!", 
					style: bowlLabelStyle })			]		});

let mainScreen = new Column({ 	name: 'main',	left: 0, right: 0, top: 0, bottom: 0, skin: whiteSkin,	contents: [
		new Line({
			name: 'header',
			skin: new Skin({ fill: 'white' }),
			height: 100, width: 320,
			contents: [
				new Label({ 
					left: 20,
					string: "PetFeedr", 
					style: new Style({ font: 'bold 50px Avenir', color: '#2D9CDB' })}),
				refreshBowlsButton,
			]
		}),
		feedScreen,
		new Line({
			skin: new Skin({ fill: 'white' }),
			name: 'nav', 
			width: 320, height: 60,
			bottom: 0,
			contents: [
				feedButton,
				camButton
			]
		})	]});


// pins shit
let remotePins;application.behavior = Behavior({    onLaunch(application) {        application.add(mainScreen);        this.data = { labels: {} };        let discoveryInstance = Pins.discover(            connectionDesc => {                if (connectionDesc.name == "amount-sensors") {                    trace("Connecting to remote pins\n");                    remotePins = Pins.connect(connectionDesc);
                    remotePins.invoke("/food/read", value => {
						application.main.amounts.bowls.foodCol.bowl.text.string = value.amount.toPrecision(2) + ' cups';					});
					remotePins.invoke("/water/read", value => {
						application.main.amounts.bowls.waterCol.bowl.text.string = value.amount.toPrecision(2) + ' cups';					});                }            },             connectionDesc => {                if (connectionDesc.name == "amount-sensors") {                    trace("Disconnected from remote pins\n");                    remotePins = undefined;                }            }        );	}});