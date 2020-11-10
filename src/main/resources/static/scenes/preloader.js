'use strict';

class Preloader extends Phaser.Scene {


    constructor() {
        super('Preloader');
    }
    preload() {
    	this.load.image('Menu', 'assets/backgrounds/Menu.png');
    	this.load.image('Gameplay', 'assets/backgrounds/Gameplay.png');
    	this.load.image('Caballete_gameplay', 'assets/interface/Caballete_gameplay.png');
    	this.load.image('Ready_es', 'assets/interface/Ready_es.png');
    	this.load.image('Ready_en', 'assets/interface/Ready_en.png');
    	this.load.image('Ready_host_es', 'assets/interface/Ready_host_es.png');
    	this.load.image('Ready_host_en', 'assets/interface/Ready_host_en.png');
    	this.load.image('Ronda_es', 'assets/interface/Ronda_es.png');
    	this.load.image('Ronda_es', 'assets/interface/Ronda_en.png');
    	this.load.image('Corona', 'assets/interface/Corona.png');
    	this.load.image('Marco1', 'assets/interface/Marco1.png');
    	this.load.image('Marco2', 'assets/interface/Marco2.png');
    	this.load.image('Marco3', 'assets/interface/Marco3.png');
    	this.load.image('Marco4', 'assets/interface/Marco4.png');
    }

    create() {
        this.input.on('pointerdown', function(pointer){
            this.scene.scene.start('Menu');
        });
    }
    
    update() { 

    }
}