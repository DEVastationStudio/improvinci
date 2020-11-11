'use strict';

class Lobby extends Phaser.Scene {
    constructor() {
        super('Lobby');
    }
    preload() {

    }

    create(data) {
        //Scale factors
        this.sX = game.canvas.width/game.global.WIDTH;
        this.sY = game.canvas.height/game.global.HEIGHT;

        //Background
        this.bg = this.add.image(0,0,'Menu').setInteractive();

        //Buttons
        this.button_start = this.add.image(0,0, 'Ready_host_es').setInteractive({cursor: 'pointer'});
        this.scaler();

        if (data.leader) {
            let msg = new Object();
            msg.event = 'ALL_READY';
            game.global.socketDir.send(JSON.stringify(msg));
        }

        
        
		this.button_start.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'START_GAME';
            game.global.socketDir.send(JSON.stringify(msg));
            this.showHideStart(false);
        }, this);
        this.showHideStart(data.leader);
        
        this.add.text(game.canvas.width/2, 10, data.code, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        
        this.avatars = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (data.players[i+j*3] !== undefined) {
                    if (this.textures.exists(data.players[i+j*3].playerId)) {
                        this.textures.get(data.players[i+j*3].playerId).destroy();
                    }

                    improCanvas.makeTexture(data.players[i+j*3].playerId, data.players[i+j*3].picture, this, 128);
                    this.avatars[i+j*3] = this.add.image(game.canvas.width/2 + (140*(i-1)),  game.canvas.height/2 + (140*(j-1)),data.players[i+j*3].playerId); 
                } else {
                    this.avatars[i+j*3] = this.add.image(game.canvas.width/2 + (140*(i-1)),  game.canvas.height/2 + (140*(j-1)),''); 
                }
            }
        }
    }

    showHideStart(leader) {
        (leader)?this.button_start.setInteractive({cursor: 'pointer'}):this.button_start.removeInteractive();
        this.button_start.visible = leader;
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
        //Buttons0,0
        this.button_start.x = game.canvas.width * 3 / 4;
        this.button_start.y = game.canvas.height / 4;
        this.button_start.setScale(this.sY);

        //Background
        this.bg.x = game.canvas.width / 2;
		this.bg.y = game.canvas.height / 2;
		this.bg.setScale(this.sX);
    }

    updateAvatars(data) {
        this.showHideStart(data.leader);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (data.players[i+j*3] !== undefined) {
                    if (!this.textures.exists(data.players[i+j*3].playerId))
                        improCanvas.makeTexture(data.players[i+j*3].playerId, data.players[i+j*3].picture, this, 128);
                    this.avatars[i+j*3].setTexture(data.players[i+j*3].playerId); 
                    if (!data.players[i+j*3].inLobby)
                        this.avatars[i+j*3].setTint(0x888888);
                    else
                        this.avatars[i+j*3].setTint(0xffffff);
                } else {
                    this.avatars[i+j*3].setTexture(''); 
                }
            }
        }
    }
}