"use strict";

class InGame extends Phaser.Scene {
    constructor() {
        super("InGame");
    }
    preload() {

    }

    create() {
        this.randomize = true;
        this.imageSize = 256;
        this.drawing = Array(this.imageSize).fill(0).map(x => Array(this.imageSize).fill(0));
        this.graphics = this.add.graphics();
        this.graphics2 = this.add.graphics();
        keyBoard = this.input.keyboard.addKeys({ 
        	'M': Phaser.Input.Keyboard.KeyCodes.M, 
        	'J': Phaser.Input.Keyboard.KeyCodes.J, 
        	'N': Phaser.Input.Keyboard.KeyCodes.N, 
            'L': Phaser.Input.Keyboard.KeyCodes.L,
            'I': Phaser.Input.Keyboard.KeyCodes.I});
    }
    
    update() { 
        if (this.randomize)
        {
            this.graphics.clear();
            for (let i = 0; i < this.imageSize; i++)
            {
                for (let j = 0; j < this.imageSize; j++)
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
        }
        this.graphics2.fillStyle(0xF55F00, 1.0);
        this.graphics2.fillPoint(this.input.activePointer.worldX, this.input.activePointer.worldY, 5);

        //Controls
        if(keyBoard.M.isDown)
        {
            let msg = new Object();
        	msg.event = 'PRUEBA';
        	game.global.socketDir.send(JSON.stringify(msg));
        }
        if(keyBoard.J.isDown)
        {
        	let msg = new Object();
        	msg.event = 'TRY_JOIN';
        	game.global.socketDir.send(JSON.stringify(msg));
        }
        if(keyBoard.N.isDown)
        {
        	let msg = new Object();
        	msg.event = 'PEOPLE_IN_ROOM';
        	game.global.socketDir.send(JSON.stringify(msg));
        }
        if(keyBoard.L.isDown)
        {
        	let msg = new Object();
        	msg.event = 'TRY_LEAVE';
        	game.global.socketDir.send(JSON.stringify(msg));
        }
        if(keyBoard.I.isDown && !sent)
        {
            sent = true;
        	let msg = new Object();
            msg.event = 'SEND_IMAGE';
            this.randomize = false;
            //Add image to message
            
            let image_to_send = ""; 
            let partial_image = "";
            for (let i = 0; i < this.drawing.length; i++)
            {
                for (let j = 0; j < this.drawing.length/4; j++)
                {
                    for (let k = 0; k < 4; k++)
                    {
                        partial_image += this.drawing[j*4+k][i];
                    }
                    image_to_send += parseInt(partial_image , 2).toString(16).toUpperCase();
                    partial_image = "";
                }

            }

            msg.image = image_to_send;
            console.log("Sending " + image_to_send);
        	game.global.socketDir.send(JSON.stringify(msg));
        }
    }
    decodeImage(img) {
        

        var arr;

        /*for (let i = 0; i < img.length; i++)
        {
            arr = parseInt(img[i] , 16).toString(2);
            for (let j = 0; j < 4; j++)
            {
                //this.drawing[?*4+j][?/this.drawing.length?] = arr[j]; //i + j * this.drawing.length inverted?
            }
        }*/

        for (let i = 0; i < this.drawing.length; i++)
        {
            for (let j = 0; j < this.drawing.length/4; j++)
            {
                arr = parseInt(img[j+i*this.drawing.length/4] , 16).toString(2);
                for (let k = 0; k < 4; k++)
                {
                    this.drawing[j*4+k][i] = arr[k];
                }
            }
        }

        this.graphics.clear();
        for (let i = 0; i < this.imageSize; i++)
        {
            for (let j = 0; j < this.imageSize; j++)
            {
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
    }
}
var keyBoard;
var sent = false;