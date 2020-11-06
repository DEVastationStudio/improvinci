'use strict';

class Options extends Phaser.Scene {
    constructor() {
        super('Options');
    }
    preload() {

    }

    create() {
    	this.return_options_bt = this.add.image(game.canvas.width*4/5 ,game.canvas.height*1/5,'Ronda_es').setInteractive({cursor: 'pointer'});
    	
    	this.return_options_bt.on('pointerdown', function (pointer){
			this.scene.start('Menu');
		}, this);
    	
    }
    
    update() { 

    }
}