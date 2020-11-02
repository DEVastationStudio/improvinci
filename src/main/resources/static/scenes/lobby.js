"use strict";

class Lobby extends Phaser.Scene {
    constructor() {
        super("Lobby");
    }
    preload() {

    }

    create(data) {
        this.bg = this.add.image(game.canvas.width/2,  game.canvas.height/2,'Menu'); 

        this.button_start = this.add.image(game.canvas.width * 3 / 4, game.canvas.height / 4, 'Ready_host_es').setInteractive();
        
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
                    this.avatars[i+j*3] = this.add.image(game.canvas.width/2 + (140*i-2),  game.canvas.height/2 + (140*j-2),data.players[i+j*3].playerId); 
                } else {
                    this.avatars[i+j*3] = this.add.image(game.canvas.width/2 + (140*i-2),  game.canvas.height/2 + (140*j-2),""); 
                }
            }
        }
    }
    showHideStart(leader) {
        (leader)?this.button_start.setInteractive():this.button_start.removeInteractive();
        this.button_start.visible = leader;
    }
    
    update() { 

    }
    updateAvatars(data) {
        this.showHideStart(data.leader);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (data.players[i+j*3] !== undefined) {
                    if (!this.textures.exists(data.players[i+j*3].playerId))
                        improCanvas.makeTexture(data.players[i+j*3].playerId, data.players[i+j*3].picture, this, 128);
                    this.avatars[i+j*3].setTexture(data.players[i+j*3].playerId); 
                } else {
                    this.avatars[i+j*3].setTexture(""); 
                }
            }
        }
    }
}