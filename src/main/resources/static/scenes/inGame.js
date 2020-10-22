"use strict";

class InGame extends Phaser.Scene {
    constructor() {
        super("InGame");
    }
    preload() {

    }

    create() {
        this.drawing = Array(256).fill(0).map(x => Array(256).fill(0));
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
        this.graphics.clear();
        for (var i = 0; i < 256; i++)
        {
            for (var j = 0; j < 256; j++)
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
            //Add image to message
            for(i = 0; i<256; i++)
            {
                for(j = 0; j<256; j+=4)
                {
                    partial_image = this.drawing[i][j].toString() + this.drawing[i][j+1].toString() + this.drawing[i][j+2].toString() + this.drawing[i][j+3].toString();
                    //console.log(partial_image);
                    switch(partial_image)
                    {
                        case "0000":
                            image_to_send+="0";
                            partial_image = "";
                            break;
                        case "0001":
                            image_to_send+="1";
                            partial_image = "";
                            break;
                        case "0010":
                            image_to_send+="2";
                            partial_image = "";
                            break;
                        case "0011":
                            image_to_send+="3";
                            partial_image = "";
                            break;
                        case "0100":
                            image_to_send+="4";
                            partial_image = "";
                            break;
                        case "0101":
                            image_to_send+="5";
                            partial_image = "";
                            break;
                        case "0110":
                            image_to_send+="6";
                            partial_image = "";
                            break;
                        case "0111":
                            image_to_send+="7";
                            partial_image = "";
                            break;
                        case "1000":
                            image_to_send+="8";
                            partial_image = "";
                            break;
                        case "1001":
                            image_to_send+="9";
                            partial_image = "";
                            break;
                        case "1010":
                            image_to_send+="A";
                            partial_image = "";
                            break;
                        case "1011":
                            image_to_send+="B";
                            partial_image = "";
                            break;
                        case "1100":
                            image_to_send+="C";
                            partial_image = "";
                            break;
                        case "1101":
                            image_to_send+="D";
                            partial_image = "";
                            break;
                        case "1110":
                            image_to_send+="E";
                            partial_image = "";
                            break;
                        case "1111":
                            image_to_send+="F";
                            partial_image = "";
                            break;
                    }
                }
            }
            msg.image = image_to_send;
        	game.global.socketDir.send(JSON.stringify(msg));
        }
    }
}
var image_to_send = ""; 
var partial_image = "";
var keyBoard;
var sent = false;