import {addItemScreen} from "addItmScreen";
import {
    VerticalScroller,
    VerticalScrollbar,
    TopScrollerShadow,
    BottomScrollerShadow
} from 'scroller';
import { items } from "data";
import {SCREENHEIGHT, background, orangeSkin, blueSkin, currentScreen,
		lightGreySkin, darkGreySkin, redSkin, whiteSkin} from "variables";
import {itemScreen} from "itmScreen";
import {inventoryButton, shoppingButton} from "navBar";

/* Scroller */
let darkGraySkin = new Skin({ fill: "#202020" });
let titleStyle = new Style({ font: "20px", color: "white" });

let ScrollerContainer = Container.template($ => ({
    left: 0, right: 0, top: 0, bottom: 0,
    contents: [
        VerticalScroller($, { 
            active: true, top:10,
            contents: [
                $.content,
                VerticalScrollbar(), 
                TopScrollerShadow(), 
                BottomScrollerShadow(),    
            ]                     
        })
    ]
}));

export let mainScreen = Container.template($ => ({
	name: 'main',
	left: 0, right: 0, top: 0, bottom: 0,
	contents: [
		InventoryScreen(),
        addItemButton(),
		headerAndNavBar(),
	],
}));

/* Inventory Screen */
function spoilToColor(freshness) {
  if (freshness >= 0.8) {
    return '#00B000'
  } else if (freshness >= 0.6) {
    return '#309000'
  } else if (freshness >= 0.4) {
    return '#606000'
  } else if (freshness >= 0.2) {
    return '#903000'
  } else {
    return '#B00000'
  }
}

export let InventoryScreen = Column.template($ => ({
	skin: background,
	width: 320, height: SCREENHEIGHT,
	name: 'inventory',
	contents: 
		[
			ScrollerContainer({ content:  new Column({ 
					top: 0, left: 0, right: 0,
					contents: [
						items.map(item => new invItem({ 
							id: item.id,
							name: item.name, img: item.img, quantity: item.quantity, 
							freshness: item.freshness, recipes: item.recipes 
						}))
					]
				}) 
			})
		],
    behavior: Behavior ({
        onDisplayed: function (content) {
        	if (remotePins) {
        		remotePins.invoke("/ready/write", 0);
	        } else {
	        	trace("No remote pins\n");
	        }

        }
    })
}));

let StatusBar = Container.template($ => ({
  contents: [
    new Line({
    	left: 0, width: $.width, top: 0, bottom: 0, 
    	skin: new Skin({
    		fill: 'white', 
    		borders: {left: 1, right: 1, top: 1, bottom: 1}, 
    		stroke: 'black'
    	})
    }),
    new Line({ 
    	left: 0, width: $.freshness * $.width, top: 0, bottom: 0, height: $.height,
    	skin: new Skin({ fill: spoilToColor($.freshness) })
    }),
    new Label({
    	left: 0, right: 0, top: 3, bottom: 0, visible: ($.freshness == 0), 
        style: new Style({ font: "bold 16px Avenir", color: "#B00000" }), string: "SPOILED"})
  ]
}));

export let headerAndNavBar = Column.template($ => ({
	contents: [
		new Container({
			name: 'header',
			skin: whiteSkin,
			width: 320, height: 50,
			contents: [
				new Picture({
					top: 10, left:10, right: 120,
					height:35,
					url: "assets/header.png"
				})
			]
		}),
		new Line({
			name: 'nav',
			skin: whiteSkin,
			width: 320, height: 50,
			top: 380,
			contents: [
				inventoryButton(),
				shoppingButton()
			]
		})
	]
}));

let invItem = Line.template($ => ({
	skin: whiteSkin,
	width: 280,
	top: 10,
  	active: true,
	contents: [
		new Picture({
			url: $.img,
			width: 70, height: 70
		}),
		new Column({
			left: 10,
			contents: [
				new Label({
					name: 'itemName', left:0,
					style: new Style({ font: 'bold 22px Avenir', color: 'black' }),
					string: $.name
				}),
				new Label({
					name: 'quantity', left:0,
					style: new Style({ font: '20px Avenir', color: 'black' }),
					string: $.quantity + " oz."
				}),
				new StatusBar({ 
				    width: 190, height: 15, top: 0, bottom: 0,
				    freshness: $.freshness 
				})
			]
		})
	],
  behavior: Behavior({
      onTouchEnded: function(invitem, id, x, y, ticks) {
        application.main.empty(0);
        application.main.add(new itemScreen({
        	id: $.id,
        	itemName: $.name, itemPicture: $.img,
        	itemLife: $.freshness, quantity: $.quantity, 
        	freshness: $.freshness,
            recipes: $.recipes 
        }));
        application.main.add(headerAndNavBar);
        currentScreen = 'item';
      }
  })
}));

let addItemSkin = new Skin({
      width: 85, height: 85,
      texture: new Texture("assets/addbtn.png"),
      fill: "white",
      aspect: "fit"
});

export let addItemButton = Content.template($ => ({
	name: 'addbtn',
	width: 60, height:60,
	top: 365, left: 250,
	skin: addItemSkin,
	active: true,
	behavior: Behavior ({
		onTouchEnded: function(content, id, x, y, ticks) {
			application.main.empty(0);
			application.main.add(addItemScreen());
			application.main.add(headerAndNavBar());
			currentScreen = 'add';
		}

	})
}));