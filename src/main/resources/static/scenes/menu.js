"use strict";

class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }
    preload() {

    }

    create() {
    	// Play button
    	this.ready_bt = this.add.image(game.canvas.width*26 / 50 , game.canvas.height / 5,'Ready_es').setInteractive();
    	this.options_bt = this.add.image(game.canvas.width / 2,game.canvas.height*25 / 50,'Ready_host_es').setInteractive();
    	this.credits_bt = this.add.image(game.canvas.width / 2,game.canvas.height*40 / 50,'Ronda_es').setInteractive();
    	
    	//Boton de jugar
		this.ready_bt.on('pointerdown', function (pointer){
			this.scene.start("InGame");
		}, this);
		
		this.options_bt.on('pointerdown', function (pointer){
			this.scene.start("Options");
		}, this);
		
		this.credits_bt.on('pointerdown', function (pointer){
			this.scene.start("Credits");
		}, this);
    }
    
    update() { 
    	
    	this.ready_bt.x = game.canvas.width * 26 / 50;
    	this.ready_bt.y = game.canvas.height / 5;
    	this.options_bt.x = game.canvas.width / 2;
    	this.options_bt.y = game.canvas.height*25 / 50;
    	this.credits_bt.x = game.canvas.width / 2;
    	this.credits_bt.y = game.canvas.height*40 / 50;
    }
}