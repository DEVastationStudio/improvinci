"use strict";

class Preloader extends Phaser.Scene {


    constructor() {
        super("Preloader");
    }
    preload() {

    }

    create() {
        this.input.on('pointerdown', function(pointer){
            console.log(this.scene);
            this.scene.scene.start("InGame");
        });
    }
    
    update() { 

    }
}