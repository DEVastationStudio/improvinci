"use strict";

class Credits extends Phaser.Scene {
    constructor() {
        super("Credits");
    }
    preload() {

    }

    create() {
    	this.return_credits_bt = this.add.image(1300,100,'Ronda_es').setInteractive();
    	
    	this.return_credits_bt.on('pointerdown', function (pointer){
			this.scene.start("Menu");
		}, this);
    }
    
    update() { 

    }
}