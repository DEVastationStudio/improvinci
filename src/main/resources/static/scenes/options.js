"use strict";

class Options extends Phaser.Scene {
    constructor() {
        super("Options");
    }
    preload() {

    }

    create() {
    	this.return_options_bt = this.add.image(1300,100,'Ronda_es').setInteractive();
    	
    	this.return_options_bt.on('pointerdown', function (pointer){
			this.scene.start("Menu");
		}, this);
    	
    }
    
    update() { 

    }
}