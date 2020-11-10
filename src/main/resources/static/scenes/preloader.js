'use strict';

class Preloader extends Phaser.Scene {


    constructor() {
        super('Preloader');
    }
    preload() {
    	this.load.image('Menu', 'assets/Menu.png');
    	this.load.image('Gameplay', 'assets/Gameplay.png');
    	this.load.image('Caballete_gameplay', 'assets/Caballete_gameplay.png');
    	this.load.image('Ready_es', 'assets/Ready_es.png');
    	this.load.image('Ready_en', 'assets/Ready_en.png');
    	this.load.image('Ready_host_es', 'assets/Ready_host_es.png');
    	this.load.image('Ready_host_en', 'assets/Ready_host_en.png');
    	this.load.image('Ronda_es', 'assets/Ronda_es.png');
    	this.load.image('Ronda_es', 'assets/Ronda_en.png');
    	this.load.image('Corona', 'assets/Corona.png');
    	this.load.image('Marco1', 'assets/Marco1.png');
    	this.load.image('Marco2', 'assets/Marco2.png');
    	this.load.image('Marco3', 'assets/Marco3.png');
    	this.load.image('Marco4', 'assets/Marco4.png');
    }

    create() {
        this.input.on('pointerdown', function(pointer){
            this.scene.scene.start('Menu');
        });
    }
    
    update() { 

    }
}