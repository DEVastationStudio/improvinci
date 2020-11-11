'use strict';

class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }
    preload() {

    }

    create(data) {
        //Scale factors
        this.sX = game.canvas.width/game.global.WIDTH;
        this.sY = game.canvas.height/game.global.HEIGHT;

        //Background
        this.background = this.add.image(0,0,'Menu');

        //Buttons
    	this.playAgain_bt = this.add.image(0,0,'Ready_es').setInteractive({cursor: 'pointer'});
    	this.quit_bt = this.add.image(0,0,'Ready_host_es').setInteractive({cursor: 'pointer'});

        this.wipScoreText = this.add.text(game.canvas.width/2, 10, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });

        for (let i = 0; i < data.players.length; i++) {
            this.wipScoreText.text += data.players[i].playerId + " - " + data.players[i].score + "\n";
        }
        
        this.playAgain_bt.on('pointerdown', function (pointer){
            if (data.leader) {
                this.scene.start('Lobby', {code: data.code, players: data.players, leader: data.leader});
            } else {
                //this.scene.start('Lobby', {code: data.code, players: data.players, leader: data.leader});
                let msg = new Object();
                msg.event = 'TRY_JOIN';
                msg.roomCode = data.code;
                msg.picture = localStorage.getItem('lastAvatar');
                game.global.socketDir.send(JSON.stringify(msg));
            }
            //expand this when it's implemented properly because it can fail I guess (if you type a wrong code or something like that, idk)
            this.playAgain_bt.removeInteractive();
            this.quit_bt.removeInteractive();
        }, this);
        
        this.quit_bt.on('pointerdown', function (pointer){
            this.scene.start('Menu');
            this.playAgain_bt.removeInteractive();
            this.quit_bt.removeInteractive();
        }, this);
    }
    
    update() { 
        if(this.sX != game.canvas.width/game.global.WIDTH || this.sY != game.canvas.height/game.global.HEIGHT)
		{
			this.sX = game.canvas.width/game.global.WIDTH;
			this.sY = game.canvas.height/game.global.HEIGHT;
			this.scaler();
		}
    }
    scaler()
	{
		//Buttons
		this.quit_bt.x = game.canvas.width / 2;
		this.quit_bt.y = game.canvas.height * 2/ 5;
		this.quit_bt.setScale(this.sY);

    	this.playAgain_bt.x = game.canvas.width / 2;
		this.playAgain_bt.y = game.canvas.height * 3/ 5;
		this.playAgain_bt.setScale(this.sY);
		
		//Background
		this.bg.x = game.canvas.width / 2;
		this.bg.y = game.canvas.height / 2;
		this.bg.setScale(this.sX);
	}
}