'use strict';

class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }
    preload() {

    }

    create() {
		//Scale factors
    	this.sX = game.canvas.width/game.global.WIDTH;
		this.sY = game.canvas.height/game.global.HEIGHT;

		//Background
		this.bg = this.add.image(0,0,'Menu');
		
		//Buttons
    	this.ready_bt = this.add.image(0,0,'Ready_es').setInteractive({cursor: 'pointer'});
    	this.options_bt = this.add.image(0,0,'Ready_host_es').setInteractive({cursor: 'pointer'});
		this.credits_bt = this.add.image(0,0,'Ronda_es').setInteractive({cursor: 'pointer'});
		this.scaler();


    	//Button actions
		this.ready_bt.on('pointerdown', function (pointer){
			this.scene.start('DrawAvatar');
		}, this);
		
		this.options_bt.on('pointerdown', function (pointer){
			this.scene.start('Options');
		}, this);
		
		this.credits_bt.on('pointerdown', function (pointer){
			this.scene.start('Credits');
		}, this);
    }
    
    update() { 
		if(this.sX != game.canvas.width/game.global.WIDTH || this.sY != game.canvas.height/game.global.HEIGHT)
		{
			this.sX = game.canvas.width/game.global.WIDTH;
			this.sY = game.canvas.height/game.global.HEIGHT;
			this.scaler();
		}
	}

	scaler()
	{
		//Buttons
		this.ready_bt.x = game.canvas.width / 2;
		this.ready_bt.y = game.canvas.height * 10 / 50;
		this.ready_bt.setScale(this.sY);

    	this.options_bt.x = game.canvas.width / 2;
		this.options_bt.y = game.canvas.height * 25 / 50
		this.options_bt.setScale(this.sY);

    	this.credits_bt.x = game.canvas.width / 2;
		this.credits_bt.y = game.canvas.height * 40 / 50;
		this.credits_bt.setScale(this.sY);
		
		//Background
		this.bg.x = game.canvas.width / 2;
		this.bg.y = game.canvas.height / 2;
		this.bg.setScale(this.sX);
	}
}