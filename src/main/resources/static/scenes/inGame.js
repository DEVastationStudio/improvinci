"use strict";

class InGame extends Phaser.Scene {
    constructor() {
        super("InGame");
    }
    preload() {

    }

    create() {
        this.drawing = Array(250).fill(0).map(x => Array(250).fill(0));
        this.graphics = this.add.graphics();
        this.graphics2 = this.add.graphics();
    	key = this.input.keyboard.addKey("M");
    }
    
    update() { 
        this.graphics.clear();
        for (var i = 0; i < 250; i++)
        {
            for (var j = 0; j < 250; j++)
            {
                this.drawing[i][j] = Math.floor(Math.random()*2);
                if (this.drawing[i][j] == 0)
                {
                    this.graphics.fillStyle(0xFFFFFF, 1.0);
                    this.graphics.fillPoint(i, j);
                }
                else
                {
                    this.graphics.fillStyle(0x000000, 1.0);
                    this.graphics.fillPoint(i, j);
                }
    
            }
        }
        this.graphics2.fillStyle(0xF55F00, 1.0);
        this.graphics2.fillPoint(this.input.activePointer.worldX, this.input.activePointer.worldY, 5);
        if(key.isDown)
        {
            let msg = new Object();
        	msg.event = 'PRUEBA';
        	game.global.socketDir.send(JSON.stringify(msg));
        	console.log("Mensaje mandado");
        }
    }
}
var key;