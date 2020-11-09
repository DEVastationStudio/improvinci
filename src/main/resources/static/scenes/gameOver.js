'use strict';

class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }
    preload() {

    }

    create(data) {
        this.background = this.add.image(game.canvas.width/2,  game.canvas.height/2,'Menu');
    	this.background.scaleX = game.canvas.width/1920;
    	this.background.scaleY = game.canvas.width/2200;
    	this.playAgain_bt = this.add.image(game.canvas.width*26 / 50 , game.canvas.height*2 / 5,'Ready_es').setInteractive({cursor: 'pointer'});
    	this.playAgain_bt.setScale(game.canvas.height/1080);
    	this.quit_bt = this.add.image(game.canvas.width / 2,game.canvas.height*30 / 50,'Ready_host_es').setInteractive({cursor: 'pointer'});
        this.quit_bt.setScale(game.canvas.height/1080);

        this.wipScoreText = this.add.text(game.canvas.width/2, 10, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });

        for (let p in data.players) {
            this.wipScoreText.text += p.playerId + " - " + p.score + "\n";
        }
        
        this.playAgain_bt.on('pointerdown', function (pointer){
            this.scene.start('Lobby', {code: data.code, players: data.players, leader: data.leader});
        }, this);
        
        this.quit_bt.on('pointerdown', function (pointer){
            this.scene.start('Menu');
        }, this);
    }
    
    update() { 

    }
}