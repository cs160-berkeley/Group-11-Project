import {
	LabeledCheckbox
} from "buttons";

let AddFromFridgeCheckbox = LabeledCheckbox.template($ => ({
    active: true, top: 33, left:0, height:25,
    behavior: Behavior({
        onSelected: function(checkBox){
        	itemsToAdd[$.item] = true;
        },
        onUnselected: function(checkBox){
        	delete itemsToAdd[$.item]
        }
    })
}));


let AddFromFridgeScreen = Container.template($ => ({
	skin: background,
	name: "AddFromFridge",
	width: 320, height: 400,
	contents: [
		new Column({
			top: 0,
			name: 'items',
			contents: [
				ScrollerContainer({ content:  new Column({ 
						top: 0, left: 0, right: 0, 
						contents: [
						 	items.map(item => 
							 			new Line({
							 				contents: [
							 					new AddFromFridgeCheckbox({ item: item.name, name: '' }),
												new invItemShopping({
													name: item.name,
													freshness: item.freshness,
													img: item.img,
													quantity: item.quantity,
													active: true,
												})

							 				]
							 			})
						 			)
						]
					}) 
				})
			]
			}),
		new Label({
			height:25, width: 200, bottom: 20,
			skin: new Skin({ fill: "#2D9CDB" }),
			style: new Style({font: 'bold 21px Avenir', color: "white"}),
			string: "ADD SELECTED ITEMS",
			active:true,
			behavior: Behavior({
				onTouchEnded(content){
					for (var i = 0; i < content.container.items.length; i++) {
						content.container.items[i].skin = whiteSkin;
					}
					application.main.empty(0);
					application.main.add(shopScreen);
					application.main.add(headerAndNavBar());
					for (var item in itemsToAdd) {
						let newEntry = new Line({
							left: 20, width: 320,
							contents: [
								new Line({
									left: 0, width: 270,
									contents: [
										new ShoppingListCheckbox({ name: item }),
									]
								}),
								new Label({
									right: 0,
									style: new Style({ font: 'bold 24px Avenir', color: 'gray', horizontal: 'right' }),
									string: 'x', active: true,
									behavior: Behavior({
										onTouchEnded: function(content){
											shopScreen.itemList.remove(newEntry)
										}
									})
								})
							]
						});
						shopScreen.itemList.insert(newEntry, shopScreen.itemList.addBtn);
					}
					itemsToAdd = {};
				}
			})
		}),


	]
}));
