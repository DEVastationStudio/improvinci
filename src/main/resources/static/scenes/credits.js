"use strict";

class Credits extends Phaser.Scene {
    constructor() {
        super("Credits");
    }
    preload() {

    }

    create() {
    	this.return_credits_bt = this.add.image(game.canvas.width*4/5 ,game.canvas.height*1/5,'Ronda_es').setInteractive();
    	
    	this.return_credits_bt.on('pointerdown', function (pointer){
			this.scene.start("Menu");
		}, this);
    }
    
    update() { 

    }
}