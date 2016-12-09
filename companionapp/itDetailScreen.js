import {background,
	blueSkin,
	borderedWhiteSkin,
	darkGreySkin,
	whiteSkin,
	fieldStyle,
	currentScreen,
	itemName
} from "variables";
import {StatusBar} from "invScreen";
import {
    FieldScrollerBehavior,
    FieldLabelBehavior
} from 'field';
import {items} from "data";
import {headerAndNavBar} from "navbar";

//*****************************************


/* Item detail screen */
let itemScreenQuantity = -1;
let itemScreenItemName;

function listOfRecipes(recipes) {
	if (recipes.length > 0) {
		return recipes.map(recipe => new Label({
				    					left: 0,
						  				style: new Style({font: "20px Avenir", color: "black", horizontal: "left"}), 
						  				string: recipe
						  			  }))
	} else {
		return 'No recipes available.'
	}
}

let normalStyle = new Style({ font: "20px Avenir", color: "black", horizontal: "left" });

export let itemScreen = Column.template($ => ({
	skin: background,
	left: 0, right: 0, top: 50, bottom: 0, 
	contents: [
		new Container({
			left: 0, right: 0, top: 7, height: 40,
			contents: [
				new Label({
					left: 20, top: 0, bottom: 0, 
					style: new Style({ font: "bold 30px Avenir", color: "black" }), 
					string: $.itemName
				})
			]}),
		new Line({
			width: 320,
			left: 10,
			contents: [
		 		new Picture({ height: 100, url: $.itemPicture }),
		  		new Column({
		  			width: 200,
		  			contents: [
					    new Label({
					    	left: 0,
					    	style: normalStyle,
					    	string: $.quantity + '' + $.unit + " remaining"
					    }),
					    new Label({
					    	left: 0,
					    	style: normalStyle,
					    	string: "Entered 1 day ago"
					    }),
					    new Label({
					    	left: 0,
					    	style: normalStyle,
					    	string: $.life + " days until spoiled"
					    })
					]
				}),
			]
		}),
		new Column({ // status bar
			left: 40, right: 40, height: 30,  top: 10,
			contents: [
				new StatusBar({ 
				    width: 260, height: 15, bottom: 10,
				    life: $.life 
				}),
				new Container({
					contents: [
						new Label({
							left: 0, width: 260,
							style: new Style({ font: "18px Avenir", color: "black", horizontal: "left" }), 
							string: 'Spoiled' 
						}),
						new Label({
							right: 0, width: 260,
							style: new Style({ font: "18px Avenir", color: "black", horizontal: "right" }), 
							string: 'Fresh'
						})
					]
				})
		]}),
		new Column({ // recipes
			left: 20, top: 15,
			contents: [
			    new Label({
			    	left: 0,
			    	style: new Style({font: "bold 22px Avenir", color: "black", horizontal: "left"}), 
			    	string: "Recipes"
			    }),
			    new Column({
			    	left: 0,
			    	contents: listOfRecipes($.recipes)
			    })
			]
		}),
    new Column({
  		left: 20, top: 15, height: 40, 
  		contents: [
		    new Label({
		    	left: 0,
		    	style: new Style({font: "bold 22px Avenir", color: "black", horizontal: "left"}), 
		    	string: "Update quantity"
		    }),
		    new Line({
		    	contents: [
					new Scroller({
						width: 100, top: 5, height: 30, active: true,
						Behavior: FieldScrollerBehavior, clip: true,
					  	contents: [
						    Label($, {
						      left: 4, right: 0, top: 0, bottom: 0, 
						      skin: new Skin({ fill: "white", borders: {left: 1, right: 1, top: 1, bottom: 1}, stroke: "black" }),
						      style: fieldStyle,
						      anchor: 'NAME', editable: true,
						      Behavior: class extends FieldLabelBehavior {
						        onEdited(label) {
						          let data = this.data;
						          data.name = label.string;
						          label.container.hint.visible = (data.name.length == 0);
						          itemScreenQuantity = data.name;
						        }
						      },
						    }),
						    new Label({
						      left: 4, right: 4, top: 4, bottom: 4, style: new Style({font: "18px Avenir", color: "gray"}),
						      string: "New quantity", name: "hint"
						    })
						]
					}),
				    new Container({
				    	left: 10, width: 100, top: 5, height: 30, active: true, skin: blueSkin, 
				    	contents: [
				      		new Label({
				      			left: 0, right: 0, top: 0, bottom: 0, 
				      			style: new Style({ font: "bold 22px Avenir", color: "white" }), 
				      			string: "UPDATE"
				      		})
				      	], 
				      	behavior: Behavior({
					        onTouchBegan(button, id, x, y, ticks) {
					        	button.skin = darkGreySkin;
					        },
					        onTouchEnded(button, id, x, y, ticks) {
					        	button.skin = blueSkin;
					        	if (itemScreenQuantity != '' && !isNaN(itemScreenQuantity)) {
						            application.main.add(new Column({
						            	name: 'modal',
						            	skin: borderedWhiteSkin,
						            	width: 220, height: 150,
						            	contents: [
						            		new Label({
						            			left: 0, right: 0, top: 5,
						            			style: new Style({ font: 'bold 23px Avenir', color: 'black' }),
						            			string: 'Quantity updated'
						            		}),
						            		new Label({
						            			left: 0, right: 0, top: 5,
						            			style: new Style({ font: '18px Avenir', color: 'black' }),
						            			string: 'New quantity for ' + $.itemName + ': '
						            		}),
						            		new Label({
						            			left: 0, right: 0, top: 5,
						            			style: new Style({ font: '18px Avenir', color: 'black' }),
						            			string: itemScreenQuantity + $.unit
						            		}),
											new Label({
												height: 25, width: 100, top: 10,
												skin: new Skin({ fill: "#2D9CDB" }),
												style: new Style({font: 'bold 20px Avenir', color: "white"}),
												string: "CLOSE",
												active:true,
												behavior: Behavior({
													onTouchEnded(content){
														items[$.id].quantity = itemScreenQuantity;
												        application.main.empty(0);
												        application.main.add(new itemScreen({
												        	id: $.id, itemName: $.itemName, itemPicture: $.itemPicture,
												        	itemLife: $.itemLife, quantity: itemScreenQuantity,
												        	unit: $.unit, life: $.life,
												            recipes: $.recipes 
												        }));
												        application.main.add(headerAndNavBar);
														currentScreen = 'item';
													}
												})
											}),
											new Label({
												height: 25, width: 100, top: 5,
												skin: new Skin({ fill: "gray" }),
												style: new Style({font: 'bold 20px Avenir', color: "white"}),
												string: "UNDO",
												active:true,
												behavior: Behavior({
													onTouchEnded(content){
														application.main.remove(content.container);
													}
												})
											}),
						            	]
						            }))
					        } else {
					        	application.main.add(new Column({
						            	name: 'modal',
						            	skin: whiteSkin,
						            	width: 220, height: 100,
						            	contents: [
						            		new Label({
						            			left: 0, right: 0, top: 5,
						            			style: new Style({ font: 'bold 23px Avenir', color: 'black' }),
						            			string: 'Oops!'
						            		}),
						            		new Label({
						            			left: 0, right: 0, top: 5,
						            			style: new Style({ font: '18px Avenir', color: 'black' }),
						            			string: 'Please enter a numerical value.'
						            		}),
											new Label({
												height: 25, width: 100, top: 10,
												skin: new Skin({ fill: "#2D9CDB" }),
												style: new Style({font: 'bold 20px Avenir', color: "white"}),
												string: "CLOSE",
												active:true,
												behavior: Behavior({
													onTouchEnded(content){
												        application.main.remove(content.container);
													}
												})
											}),
						            	]
						            }))
							
					        }
					    }
				      	})
				    })
		    	]
		    })
		]
	}),
]}));
