"use strict";

class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }
    preload() {

    }

    create() {
    	// Play button
    	this.ready_bt = this.add.image(750,200,'Ready_es').setInteractive();
    	this.options_bt = this.add.image(750,400,'Ready_host_es').setInteractive();
    	this.credits_bt = this.add.image(750,600,'Ronda_es').setInteractive();
    	
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

    }
}