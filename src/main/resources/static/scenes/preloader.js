"use strict";

class Preloader extends Phaser.Scene {


    constructor() {
        super("Preloader");
    }
    preload() {
    	this.load.image('Menu', 'assets/Menu.png');
    	this.load.image('Caballete_gameplay', 'assets/Caballete_gameplay.png');
    	this.load.image('Ready_es', 'assets/Ready_es.png');
    	this.load.image('Ready_en', 'assets/Ready_en.png');
    	this.load.image('Ready_host_es', 'assets/Ready_host_es.png');
    	this.load.image('Ready_host_en', 'assets/Ready_host_en.png');
    	this.load.image('Ronda_es', 'assets/Ronda_es.png');
    	this.load.image('Ronda_es', 'assets/Ronda_en.png');
    }

    create() {
        this.input.on('pointerdown', function(pointer){
            this.scene.scene.start("Menu");
        });
    }
    
    update() { 

    }
}