import {SCREENHEIGHT, background, orangeSkin, blueSkin, currentScreen,
		lightGreySkin, darkGreySkin, redSkin, whiteSkin} from "variables";

import {
    FieldScrollerBehavior,
    FieldLabelBehavior
} from 'field';

import {
    SystemKeyboard
} from 'keyboard';

import {
    HorizontalSlider, HorizontalSliderBehavior
} from 'sliders';

import {InventoryScreen, headerAndNavBar, addItemButton} from "invPage";

/* Add item screen */
let nameInputSkin = new Skin({ borders: { bottom: 1 }, stroke: 'gray' });
let fieldStyle = new Style({ color: 'black', font: '17px', horizontal: 'left',
    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });
let fieldHintStyle = new Style({ color: '#aaa', font: '17px', horizontal: 'left',
    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });
let fieldLabelSkin = new Skin({ fill: ['transparent', 'transparent', '#C0C0C0', '#acd473'] });

let itemName;
let itemNameField = Container.template($ => ({
    width: $.width, height: 25, top: $.top, skin: $.skin, name:"itemField",
    contents: [
        Scroller($, { loop: true,
            left: 4, right: 4, top: 0, bottom: 0, active: true,
            Behavior: FieldScrollerBehavior, clip: true,
            contents: [
                Label($, {
                    left: 0, top: 0, bottom: 0, skin: fieldLabelSkin,
                    style: fieldStyle, anchor: 'NAME',
                    editable: true, string: $.name,
                    Behavior: class extends FieldLabelBehavior {
                        onEdited(label) {
                            let data = this.data;
                            data.name = label.string;
                            label.container.hint.visible = (data.name.length == 0);
                            itemName = data.name;
                        }
                    },
                }),
                Label($, {
                    left: 4, right: 4, top: 0, bottom: 0, style: fieldHintStyle,
                    string: "Item name", name: "hint"
                }),
            ]
        })
    ]
}));

let nameInput = new Line({
	left: 52,
	top: 8,
	name: 'nameInput',
	contents: [
		new Label({
			right: 15,
			style: new Style({ font: '23px Avenir', color: 'black' }),
			string: 'Name',
		}),
		new itemNameField({ width: 180, name:'', skin: nameInputSkin}),
	]
})

let freshness;
let FreshnessSlider = HorizontalSlider.template($ => ({
	name: 'freshSlider',
    height: 20, left: 0, right: 0,
    Behavior: class extends HorizontalSliderBehavior {
        onValueChanged(container) {
        	let amount = Math.floor( this.data.value );
            addItemScreen().freshInput[1].label.string = amount + " days old";
            freshness = amount;
        }
    }
}));
let freshnessInput = new Line({
	left: 23, top: 10,
	name: 'freshInput',
	contents: [
		new Label({
			right: 5,
			style: new Style({ font: '23px Avenir', color: 'black' }),
			string: 'Freshness'
		}),
		new Column({
			width: 200,
			contents: [
				new FreshnessSlider({ min: 0, max: 10, value: 0 }),
				new Label({
					name: "label",
					string: "days old",
					style: new Style({ font: "17px Avenir", color: 'black' })
				}),
			]
		})
	]
})


let quantity;
let QuantitySlider = HorizontalSlider.template($ => ({
	name: 'quantitySlider',
    height: 20, left: 0, right: 0,
    Behavior: class extends HorizontalSliderBehavior {
        onValueChanged(container) {
        	let amount = Math.floor( this.data.value );
            addItemScreen().qtyInput[1].label.string = amount + " oz.";
            quantity = amount;
        }
    }
}));

let quantityInput = new Line({
	left: 30, top: 5,
	name: 'qtyInput',
	contents: [
		new Label({
			right: 5,
			style: new Style({ font: '23px Avenir', color: 'black' }),
			string: 'Quantity'
		}),
		new Column({
			width: 200,
			contents: [
				new QuantitySlider({ min: 0, max: 20, value: 10 }),
				new Label({
					name: "label",
					string: "10 oz.",
					style: new Style({ font: "17px Avenir", color: 'black' })
				}),
			]
		})
	]
})


let submitButton = Container.template($ => ({
	skin: new Skin({ fill: '#2D9CDB' }),
	top: 10,
	width: 80, height: 30,
	contents: [
		Label($, {
			name: 'submitButton', string: $.string , style: new Style({ font: 'bold 24px Avenir', color: 'white' })
		})
	],
	active: true,
	behavior: Behavior ({
		onTouchEnded: function(content, id, x, y, ticks) {
			items.push({ id: 0, name: itemName, freshness: freshness/10, 
				         img: 'assets/carrots.png', quantity: quantity, recipes:[] });
			application.main.empty(0);
			application.main.add(InventoryScreen());
			application.main.add(headerAndNavBar());
			application.main.add(addItemButton());
		}
	})
}));


export let addItemScreen = Column.template({
	skin: background,
	name: 'addItem',
	width: 320, height: SCREENHEIGHT,
	contents: [
		new Label({
			style: new Style({ font: 'bold 27px Avenir', color: 'black' }),
			string: 'Add Item', top: 23, left: 23,
		}),
		nameInput,
		freshnessInput,
		quantityInput,
		new Container({
			name: 'imgHolder',
			skin: new Skin({ fill: '#c4c4c4' }),
			top: 10,
			width: 150, height:150,
			contents: [
				new Label({
					name: 'str',
					top:50, left:10, right: 10,
					style: new Style({ font: "bold 23px Avenir", color: "white" }),
					string: "Press SCAN on"
				}),
				new Label({
					top: 70, left:10, right: 10,
					style: new Style({ font: "bold 23px Avenir", color: "white" }),
					string: "food scanner!"
				})
			]
		}),
		new submitButton({string: 'FINISH'})
	],
    behavior: Behavior ({
        onTouchEnded: function(content, id, x, y, ticks) {
            SystemKeyboard.hide();
            content.focus();
        },
        onDisplayed: function (content) {
        	if (remotePins) {
        		// Let device know ur ready
        		remotePins.invoke("/ready/write", 1);

	        	// Take pic
	        	remotePins.repeat("/scan/read", 100, value => {
	        		if (value && content.imgHolder.str) {
	        			content.imgHolder.empty(0);
	        			content.imgHolder.add(new Picture({
	        				name: 'pic',
	        				url: 'assets/carrots.png',
	        				width: 150, height: 150 }));

	        			// Read weight
			        	remotePins.invoke("/scale/read", 100, value => {
			        		quantity = value.weight.toPrecision(2);
			        		content.freshInput[1].label.string = quantity + " days old";
			        	});


						// Read freshness
			        	remotePins.invoke("/freshness/read", 100, value => {
			        		freshness = value.weight.toPrecision(2);
			        		content.qtyInput[1].label.string = freshness + " oz.";
			        	});
	        		} else if (value == 0 && content.imgHolder.pic) {
	        			content.imgHolder.empty(0);
	        			content.imgHolder.add(
							new Label({
								name: 'str',
								top:50, left:10, right: 10,
								style: new Style({ font: "bold 23px Avenir", color: "white" }),
								string: "Press SCAN on"
							})),
				
	        			content.imgHolder.add(
							new Label({
								top: 70, left:10, right: 10,
								style: new Style({ font: "bold 23px Avenir", color: "white" }),
								string: "food scanner!"
							}));
	        		}
	        	});
	        } else {
	        	trace("No remote pins\n");
	        }
        }
    })
});