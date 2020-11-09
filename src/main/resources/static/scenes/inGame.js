'use strict';

class InGame extends Phaser.Scene {
    constructor() {
        super('InGame');
    }
    preload() {
    }

    create(data) {
        
        this.gameplay = this.add.image(game.canvas.width/2,  game.canvas.height/2,'Gameplay');
    	this.gameplay.scaleX = game.canvas.width/1920;
        this.gameplay.scaleY = game.canvas.width/2200;
        
        this.maxRounds = data.maxRounds;
        this.curRound = 0;
        this.players = data.players;
        console.log(this.players);
        
    	//this.return_options_bt = this.add.image(game.canvas.width*4/5 ,game.canvas.height*1/5,'Ronda_es').setInteractive({cursor: 'pointer'});
    	this.caballete_gameplay = this.add.image(game.canvas.width/2 ,game.canvas.height/2,'Caballete_gameplay');
    	this.caballete_gameplay.scaleX = game.canvas.width/5250;
    	this.caballete_gameplay.scaleY = game.canvas.width/5250;
    	//this.return_options_bt = this.add.image(game.canvas.width*4/5 ,game.canvas.height*1/5,'Ronda_es').setInteractive({cursor: 'pointer'});
    	
    	/*this.return_options_bt.on('pointerdown', function (pointer){
			this.scene.start('Menu');
		}, this);*/
        
        this.maxTime = 0;
        this.drawings = [];
        this.votes = [];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.drawings[i+j*3] = this.add.image(game.canvas.width/2 + (140*(i-1)), game.canvas.height/2 + (140*(j-1)),''); 
                this.drawings[i+j*3].setScale(0.25,0.25);
                this.votes[i+j*3] = this.add.text(game.canvas.width/2 + (140*(i-1)), game.canvas.height/2 + (140*(j-1)) + 64, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#ff6600', stroke: '#000000' });
            }
        }

        this.hideDrawings();

        this.sent = false;
        this.randomize = true;
        this.canvas = new improCanvas(this, 256);
        this.canvas.hideCanvas();

        this.word = this.add.text(game.canvas.width/2 ,game.canvas.height/2, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#ff6600', stroke: '#000000' });
        this.gameMode = this.add.text(game.canvas.width/6 ,game.canvas.height/6, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#ff6600', stroke: '#000000' });
        this.timer = this.add.text(game.canvas.width/2 ,game.canvas.height/8, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#ff6600', stroke: '#000000' });
        this.inGameWord = this.add.text(game.canvas.width/2 ,game.canvas.height/10, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#ff6600', stroke: '#000000' });
        this.roundText = this.add.text(game.canvas.width*6/8 ,game.canvas.height/10, '0/'+this.maxRounds, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#ff6600', stroke: '#000000' });

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
                msg.roomCode = prompt('Enter room code: ');
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
            console.log('Sending ' + msg.image);
            game.global.socketDir.send(JSON.stringify(msg));
        }*/
    }

    showWord(word, faker, drawMode) {
        this.canvas.setDrawMode(drawMode);
        this.hideDrawings();
        this.inGameWord.text = '';
        if (!faker) {
            this.word.text = word;
        } else {
            this.word.text = 'YOU ARE THE FAKER';
        }
        this.gameMode.text = drawMode;
    }

    drawStart(time, round) {
        this.inGameWord.text = this.word.text;
        this.word.text = '';
        this.timer.text = time;
        this.maxTime = time;
        this.curRound = round;
        this.roundText.text = this.curRound+'/'+this.maxRounds;
        this.canvas.clear();
        this.canvas.showCanvas();
    }

    updateTime(time) {
        this.timer.text = time;
        if(time/this.maxTime < 0.5 && this.canvas.fadeStatus === -1) this.canvas.fadeStatus = 0;
    }

    roundOver() {
        this.canvas.hideCanvas();

        let msg = new Object();
        msg.event = 'SEND_IMAGE';
        msg.image = this.canvas.toString();
        game.global.socketDir.send(JSON.stringify(msg));

        //fade (maybe not)
    }

    hideDrawings() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.drawings[i+j*3].setTexture('');
                this.drawings[i+j*3].removeInteractive();
                this.votes[i+j*3].text = '';
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

    updateDrawing(player, drawing, isSelf) {
        /*this.avatars = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (data.players[i+j*3] !== undefined) {
                    if (this.textures.exists(data.players[i+j*3].playerId+'r')) {
                        this.textures.get(data.players[i+j*3].playerId+'r').destroy();
                    }
                    improCanvas.makeTexture(data.players[i+j*3].playerId+'r', data.players[i+j*3].picture, this, 256);
                    this.avatars[i+j*3] = this.add.image(game.canvas.width/2 + (140*i-2),  game.canvas.height/2 + (140*j-2),data.players[i+j*3].playerId); 
                } else {
                    this.avatars[i+j*3] = this.add.image(game.canvas.width/2 + (140*i-2),  game.canvas.height/2 + (140*j-2),''); 
                }
            }
        }*/
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.players[i+j*3] !== undefined) {
                    if (player === this.players[i+j*3].playerId) {

                        this.drawings[i+j*3].setTexture(''); 
                        if (this.textures.exists(player+'r')) {
                            this.textures.get(player+'r').destroy();
                        }
                        improCanvas.makeTexture(player+'r', drawing, this, 256);

                        this.drawings[i+j*3].setTexture(player+'r'); 
                        if (!isSelf) { //this should be changed in the near future
                            this.drawings[i+j*3].setInteractive({cursor: 'pointer'});
                            this.drawings[i+j*3].on('pointerdown', function (pointer){
                                let msg = new Object();
                                msg.event = 'VOTE';
                                msg.playerVoted = player;
                                game.global.socketDir.send(JSON.stringify(msg));
                                alert('YOU VOTED');
                                this.disableDrawings();
                            }, this);
                        }
                    }
                }
                
                    
            }
        }
    }
    
    updateVoteResults(msg) {
        /*msg.put('event', 'ROUND_VOTES');
        for (int i = 0; i < players.size(); i++) {
            msg.put('id_'+i,players.get(i).getPlayerId());
            msg.put('votes_'+i,players.get(i).getVotes());
        }
        msg.put('faker', fakerId);*/
        let playerVotes = new Array(msg.players);
        for (let i = 0; i < playerVotes.length; i++) {
            eval('playerVotes[msg.id_'+i+'] = msg.votes_'+i); //eval shouldn't be a problem here, hopefully
        }
        console.log(playerVotes);

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.players[i+j*3] !== undefined) {
                    if (playerVotes[this.players[i+j*3].playerId] !== undefined) {
                        this.votes[i+j*3].text = playerVotes[this.players[i+j*3].playerId];
                    }
                }
            }
        }

    }

    writeRoomCode(roomCode)
    {
        this.add.text(10, 10, roomCode, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#ff6600', stroke: '#000000' });
    }
}
var joinRoomOnce = false;