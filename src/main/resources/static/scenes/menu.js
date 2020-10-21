"use strict";

class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }
    preload() {

    }

    create() {
    	play_btn = game.add.text(w - 100, 20, 'Play', { font: '24px Arial', fill: '#fff' });
    	this.graphics.fillStyle(0x000000, 1.0);
        this.graphics.fillPoint(i, j);
    }
    
    update() { 

    }
}