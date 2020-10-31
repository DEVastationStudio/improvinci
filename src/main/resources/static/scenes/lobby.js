"use strict";

class Lobby extends Phaser.Scene {
    constructor() {
        super("Lobby");
    }
    preload() {

    }

    create(data) {
        this.add.text(game.canvas.width/2, 10, data.code, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        
        this.avatars = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (data.players[i+j*3] !== undefined) {
                    improCanvas.makeTexture(data.players[i+j*3].playerId, data.players[i+j*3].picture, this, 128);
                    this.avatars[i+j*3] = this.add.image(game.canvas.width/2 + (140*i-2),  game.canvas.height/2 + (140*j-2),data.players[i+j*3].playerId); 
                } else {
                    this.avatars[i+j*3] = this.add.image(game.canvas.width/2 + (140*i-2),  game.canvas.height/2 + (140*j-2),""); 
                }
            }
        }
    }
    
    update() { 

    }
    updateAvatars(data) {
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