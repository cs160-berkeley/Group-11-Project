//@program

var Pins = require("pins");

let background = new Skin({ fill: '#F2F2F2' });

	width: 100, height: 100,
			//

let waterBowl = new Container({
	width: 100, height: 100,
			//


let mainScreen = new Column({ 
		new Line({
			name: 'header',
			skin: new Skin({ fill: 'white' }),
			height: 50, width: 320,
			contents: [
				new Label({ 
					left: 20,
					string: "PetFeedr", 
					style: new Style({ font: 'bold 50px Avenir', color: '#2D9CDB' })}),
			]
		}),
		new Line({ 
			name: 'amounts',
			contents: [ 
				new Column({
					name: "foodCol",
					top: 10,
					contents: [
						new Label({ string: "Food", style: bowlLabelStyle }),
						foodBowl
					]}),
				new Column({
					name: "waterCol",
					top: 10,
					contents: [
						new Label({ string: "Water", style: bowlLabelStyle }),
						waterBowl 
					]})
			]
		})

let refillFood, refillWater;

application.behavior = Behavior({
    onLaunch(application) {
        this.data = { labels: {} };
		Pins.configure({
            food: {
                require: "food",
                pins: {
                  power: {pin: 51, type:"Power", voltage:3.3},
        					uv: {pin: 52},
                  ground: {pin: 53, type:"Ground"},
        					vref: {pin: 54}
                }
            },
            water: {
                require: "water",
                pins: {
                  power: {pin: 55, type:"Power", voltage:3.3},
        					uv: {pin: 56},
                  ground: {pin: 57, type:"Ground"},
        					vref: {pin: 58}
                }
            },
            refillFood: {
            refillWater: {
            camera: {
                require: "camera",
                pins: {
                  power: {pin: 63, type:"Power", voltage:3.3},
        					uv: {pin: 64},
                  ground: {pin: 65, type:"Ground"},
        					vref: {pin: 66}
                }
            },
		}, success => this.onPinsConfigured(application, success));
	},
	onPinsConfigured(application, success) {		
		if (success) {
			application.add(mainScreen);
			
			Pins.repeat("/food/read", 100, value => this.onFoodAmountChanged(application, value));
			Pins.repeat("/water/read", 100, value => this.onWaterAmountChanged(application, value));
			Pins.repeat("/refillFood/read", 100, value => this.onRefillFood(application, value));
			Pins.repeat("/refillWater/read", 100, value => this.onRefillWater(application, value));

			Pins.share("ws", {zeroconf: true, name: "amount-sensors"});
		}
		else {
            application.skin = new Skin({ fill: "#f78e0f" });
            var style = new Style({ font:"bold 36px", color:"white", horizontal:"center", vertical:"middle" });
            application.add(new Label({ left:0, right:0, top:0, bottom:0, style: style, string:"Error could not configure pins" }));
		}
	},
	onFoodAmountChanged(app, value) {		
        var data = this.data;
		if (data.foodAmount && value.amount != data.foodAmount.amount && refillFood) {
			app.main.remove(app.main.refillFood);
			refillFood = false;
			Pins.invoke("/refillFood/write", 0);
		}
        data.foodAmount = value;
        app.main.amounts.foodCol.bowl.text.string = data.foodAmount.amount.toPrecision(3) + ' cups';
        
        
		if (value.amount < 1) { 
			app.main.amounts.foodCol.bowl.height = 30;
		} else {
			app.main.amounts.foodCol.bowl.height = 110 * (value.amount / 5);
		}
	},
	onWaterAmountChanged(app, value) {		
        var data = this.data;
        
		if (data.waterAmount && value.amount != data.waterAmount.amount && refillWater) {
			app.main.remove(app.main.refillWater);
			refillWater = false;
			Pins.invoke("/refillWater/write", 0);
		}
		
        data.waterAmount = value;
        app.main.amounts.waterCol.bowl.text.string = data.waterAmount.amount.toPrecision(3) + ' cups';
       
		if (value.amount < 1) { 
			app.main.amounts.waterCol.bowl.height = 30;
		} else {
			app.main.amounts.waterCol.bowl.height = 110 * (value.amount / 5);
		}
	},
	onRefillFood(app, value) {		
        if (value == 1 && !refillFood) {
        	app.main.add(new Label({ 
        		top: 10,
        		name: "refillFood", 
        		string: "Refilling food...", 
        		style: refillStyle }));
        	refillFood = true;
        }
	},
	onRefillWater(app, value) {		
        if (value == 1 && !refillWater) {
        	app.main.add(new Label({ 
        		top: 10,
        		name: "refillWater", 
        		string: "Refilling water...", 
        		style: refillStyle }));
        	refillWater = true;
        }
	},
});