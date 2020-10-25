"use strict";

class Preloader extends Phaser.Scene {


    constructor() {
        super("Preloader");
    }
    preload() {

    }

    create() {
        this.input.on('pointerdown', function(pointer){
            this.scene.scene.start("InGame");
        });
    }
    
    update() { 

    }
}