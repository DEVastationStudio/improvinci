"use strict";

class InGame extends Phaser.Scene {
    constructor() {
        super("InGame");
    }
    preload() {
    }

    create() {
    	
    	this.return_options_bt = this.add.image(game.canvas.width*4/5 ,game.canvas.height*1/5,'Ronda_es').setInteractive();
    	this.caballete_gameplay = this.add.image(game.canvas.width/2 ,game.canvas.height/2,'Caballete_gameplay');
    	this.caballete_gameplay.scaleX = game.canvas.width/5250;
    	this.caballete_gameplay.scaleY = game.canvas.width/5250;
    	
    	this.return_options_bt.on('pointerdown', function (pointer){
			this.scene.start("Menu");
		}, this);
    	
        this.sent = false;
        this.randomize = true;
        this.canvas = new improCanvas(this);
        this.graphics = this.canvas.graphics;
        this.drawing = this.canvas.drawing;
        this.imageSize = this.canvas.imageSize;

        this.keyBoard = this.input.keyboard.addKeys({
            'M': Phaser.Input.Keyboard.KeyCodes.M,
            'J': Phaser.Input.Keyboard.KeyCodes.J,
            'N': Phaser.Input.Keyboard.KeyCodes.N,
            'L': Phaser.Input.Keyboard.KeyCodes.L,
            'I': Phaser.Input.Keyboard.KeyCodes.I,
            'R': Phaser.Input.Keyboard.KeyCodes.R
        });
    }

    update() {
        if (this.randomize) {
            this.canvas.onUpdate();
        }
        //Controls
        if (this.keyBoard.M.isDown) {
            let msg = new Object();
            msg.event = 'PRUEBA';
            game.global.socketDir.send(JSON.stringify(msg));
        }
        
        if (this.keyBoard.J.isDown) {
            
            if(!joinRoomOnce)
            {
                joinRoomOnce = true;
                let msg = new Object();
                msg.event = 'TRY_JOIN';
                msg.roomCode = prompt("Enter room code: ");
                game.global.socketDir.send(JSON.stringify(msg));
            }
        }
        if (this.keyBoard.N.isDown) {
            let msg = new Object();
            msg.event = 'PEOPLE_IN_ROOM';
            game.global.socketDir.send(JSON.stringify(msg));
        }
        if (this.keyBoard.L.isDown) {
            let msg = new Object();
            msg.event = 'TRY_LEAVE';
            game.global.socketDir.send(JSON.stringify(msg));
        }
        if (this.keyBoard.R.isDown) {
            let msg = new Object();
            msg.event = 'CREATE_ROOM';
            game.global.socketDir.send(JSON.stringify(msg));
        }
        if (this.keyBoard.I.isDown && !this.sent) {
            this.sent = true;
            let msg = new Object();
            msg.event = 'SEND_IMAGE';
            this.randomize = false;
            //Add image to message

            

            msg.image = this.canvas.toString();
            console.log("Sending " + msg.image);
            game.global.socketDir.send(JSON.stringify(msg));
        }
    }

    joinRoom(roomCode)
    {
        let msg = new Object();
        msg.event = 'TRY_JOIN';
        msg.roomCode = roomCode;
        game.global.socketDir.send(JSON.stringify(msg));
    }
    writeRoomCode(roomCode)
    {
        this.add.text(10, 10, roomCode, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    }

    /*decodeImage(img) {

        var arr;

        for (let i = 0; i < this.drawing.length; i++) {
            for (let j = 0; j < this.drawing.length / 4; j++) {
                arr = parseInt(img[j + i * this.drawing.length / 4], 16).toString(2).padStart(4, "0");
                for (let k = 0; k < 4; k++) {
                    this.drawing[j * 4 + k][i] = arr[k];
                }
            }
        }

        this.graphics.clear();
        for (let i = 0; i < this.imageSize; i++) {
            for (let j = 0; j < this.imageSize; j++) {
                if (this.drawing[i][j] == 0) {
                    this.graphics.fillStyle(0xFFFFFF, 1.0);
                    this.graphics.fillPoint(i, j);
                }
                else {
                    this.graphics.fillStyle(0x000000, 1.0);
                    this.graphics.fillPoint(i, j);
                }

            }
        }
    }*/
}
var joinRoomOnce = false;