/* Constants */
export let SCREENHEIGHT = 400;

/* Skins */
export let background = new Skin({ fill: '#F2F2F2' });
export let orangeSkin = new Skin({ fill: '#F2994A' });
export let blueSkin = new Skin({ fill: '#2D9CDB' });
export let lightGreySkin = new Skin({ fill: '#BDBDBD' });
export let darkGreySkin = new Skin({ fill: '#454545' });
export let redSkin = new Skin({ fill: '#EB5757' });
export let whiteSkin = new Skin({ fill: 'white' });
export let borderedWhiteSkin = new Skin({ fill: 'white' ,
	borders: { left:1, right:1 , top:1, bottom: 1 },
	stroke: 'gray'});


/* Pins stuff */
export let remotePins;

/* Styles*/
export let fieldStyle = new Style({ color: 'black', font: '17px', horizontal: 'left',
    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });

/* Main screen */
export let currentScreen = 'inventory';

/* just sgeneral variables */ 
export let itemName;