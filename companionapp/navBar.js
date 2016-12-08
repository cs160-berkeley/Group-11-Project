import {currentScreen}  from "variables";

/* Navigation bar */
export let inventoryButton = Content.template($ =>({
	name: 'invBtn',
	width: 30, height: 30,
	right: 30, left: 50, 
	skin: new Skin({
		width: 54, height:54,
		texture: new Texture("assets/inventory.png"),
		fill: "white",
		aspect: "fit"
	}),
	active: true,
	behavior: Behavior ({
		onTouchEnded: function(content, id, x, y, ticks) {
			if (currentScreen != 'inventory') {
				currentScreen = 'inventory';
				application.main.empty(0);
				application.main.add(InventoryScreen());
				application.main.add(headerAndNavBar());
				application.main.add(addItemButton());
			}
		}
	})
}));

export let shoppingButton = Content.template($ => ({
	name: 'shopBtn',
	width: 30, height:30,
	right: 50, left:30, 
	skin: new Skin({
	    width: 48, height:48,
	    texture: new Texture("assets/shopping.png"),
	    fill: "white",
	    aspect: "fit"
	}),
	active: true,
	behavior: Behavior ({
		onTouchEnded: function(content, id, x, y, ticks) {
			if (currentScreen != 'shop') {
				currentScreen = 'shop';
				application.main.empty(0);
				application.main.add(shopScreen);
				application.main.add(headerAndNavBar());
			}
		}
	})
}));