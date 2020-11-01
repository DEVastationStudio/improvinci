"use strict";

class InGame extends Phaser.Scene {
    constructor() {
        super("InGame");
    }
    preload() {
    }

    create() {
    	
    	this.gameplay = this.add.image(game.canvas.width/2,  game.canvas.height/2,'Gameplay');
    	this.gameplay.scaleX = game.canvas.width/1920;
    	this.gameplay.scaleY = game.canvas.width/2200;
    	this.caballete_gameplay = this.add.image(game.canvas.width/2 ,game.canvas.height/2,'Caballete_gameplay');
    	this.caballete_gameplay.scaleX = game.canvas.width/5250;
    	this.caballete_gameplay.scaleY = game.canvas.width/5250;
    	this.return_options_bt = this.add.image(game.canvas.width*4/5 ,game.canvas.height*1/5,'Ronda_es').setInteractive();
    	
    	this.return_options_bt.on('pointerdown', function (pointer){
			this.scene.start("Menu");
		}, this);
    	
        this.sent = false;
        this.randomize = true;
        this.canvas = new improCanvas(this, 256);

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
        /*if (this.keyBoard.M.isDown) {
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
        }*/
    }

    
    writeRoomCode(roomCode)
    {
        this.add.text(10, 10, roomCode, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    }
}
var joinRoomOnce = false;