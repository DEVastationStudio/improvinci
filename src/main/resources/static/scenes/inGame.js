"use strict";

class InGame extends Phaser.Scene {
    constructor() {
        super("InGame");
    }
    preload() {
    }

    create(data) {
        
        this.maxRounds = data.maxRounds;
        this.curRound = 0;
        this.players = data.players;
        console.log(this.players);
        
    	this.return_options_bt = this.add.image(game.canvas.width*4/5 ,game.canvas.height*1/5,'Ronda_es').setInteractive();
    	this.caballete_gameplay = this.add.image(game.canvas.width/2 ,game.canvas.height/2,'Caballete_gameplay');
    	this.caballete_gameplay.scaleX = game.canvas.width/5250;
    	this.caballete_gameplay.scaleY = game.canvas.width/5250;
    	
    	this.return_options_bt.on('pointerdown', function (pointer){
			this.scene.start("Menu");
		}, this);
        
        
        this.drawings = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.drawings[i+j*3] = this.add.image(game.canvas.width/2 + (280*i-2),  game.canvas.height/2 + (280*j-2),""); 
            }
        }

        this.hideDrawings();

        this.sent = false;
        this.randomize = true;
        this.canvas = new improCanvas(this, 256);
        this.canvas.hideCanvas();

        this.word = this.add.text(game.canvas.width/2 ,game.canvas.height/2, "", { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        this.timer = this.add.text(game.canvas.width/2 ,game.canvas.height/8, "", { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        this.inGameWord = this.add.text(game.canvas.width/2 ,game.canvas.height/10, "", { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        this.roundText = this.add.text(game.canvas.width*6/8 ,game.canvas.height/10, "0/"+this.maxRounds, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });

        let msg = new Object();
        msg.event = 'GAME_LOADED';
        game.global.socketDir.send(JSON.stringify(msg));

        /*this.keyBoard = this.input.keyboard.addKeys({
            'M': Phaser.Input.Keyboard.KeyCodes.M,
            'J': Phaser.Input.Keyboard.KeyCodes.J,
            'N': Phaser.Input.Keyboard.KeyCodes.N,
            'L': Phaser.Input.Keyboard.KeyCodes.L,
            'I': Phaser.Input.Keyboard.KeyCodes.I,
            'R': Phaser.Input.Keyboard.KeyCodes.R
        });*/
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

    showWord(word, faker) {
        this.inGameWord.text = "";
        if (faker) {
            this.word.text = word;
        } else {
            this.word.text = "YOU ARE THE FAKER";
        }
    }

    drawStart(time, round) {
        this.inGameWord.text = this.word.text;
        this.word.text = "";
        this.timer.text = time;
        this.curRound = round;
        this.roundText.text = this.curRound+"/"+this.maxRounds;
        this.canvas.clear();
        this.canvas.showCanvas();
    }

    updateTime(time) {
        this.timer.text = time;
    }

    roundOver() {
        this.canvas.hideCanvas();

        let msg = new Object();
        msg.event = 'SEND_IMAGE';
        msg.image = this.canvas.toString();
        game.global.socketDir.send(JSON.stringify(msg));

        //fade (maybe not)
    }

    hideDrawings() { ///////////////////////////////////////////CALL THIS WHEN VOTING ENDS
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.drawings[i+j*3].setTexture("");
                this.drawings[i+j*3].removeInteractive();
            }
        }
    }
    disableDrawings() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.drawings[i+j*3].removeInteractive();
            }
        }
    }

    updateDrawing(player, drawing) {
        /*this.avatars = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (data.players[i+j*3] !== undefined) {
                    if (this.textures.exists(data.players[i+j*3].playerId+"r")) {
                        this.textures.get(data.players[i+j*3].playerId+"r").destroy();
                    }
                    improCanvas.makeTexture(data.players[i+j*3].playerId+"r", data.players[i+j*3].picture, this, 256);
                    this.avatars[i+j*3] = this.add.image(game.canvas.width/2 + (140*i-2),  game.canvas.height/2 + (140*j-2),data.players[i+j*3].playerId); 
                } else {
                    this.avatars[i+j*3] = this.add.image(game.canvas.width/2 + (140*i-2),  game.canvas.height/2 + (140*j-2),""); 
                }
            }
        }*/
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.players[i+j*3] !== undefined) {
                    if (player === this.players[i+j*3].playerId) {

                        this.drawings[i+j*3].setTexture(""); 
                        if (this.textures.exists(player+"r")) {
                            this.textures.get(player+"r").destroy();
                        }
                        improCanvas.makeTexture(player+"r", drawing, this, 256);

                        this.drawings[i+j*3].setTexture(player+"r"); 
                        this.drawings[i+j*3].setInteractive();
                        this.drawings[i+j*3].on('pointerdown', function (pointer){
                            let msg = new Object();
                            msg.event = 'VOTE';
                            msg.playerVoted = player;
                            game.global.socketDir.send(JSON.stringify(msg));
                            this.disableDrawings();
                        }, this);
                    }
                }
                
                    
            }
        }
    }
    
    writeRoomCode(roomCode)
    {
        this.add.text(10, 10, roomCode, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    }
}
var joinRoomOnce = false;