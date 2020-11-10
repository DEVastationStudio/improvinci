'use strict';

class DrawAvatar extends Phaser.Scene {
    constructor() {
        super('DrawAvatar');
    }
    preload() {

    }

    create() {
        if (typeof(Storage) !== 'undefined') {
        this.usesLocalStorage = true;
        } else {
        this.usesLocalStorage = false;
        }

        this.bg = this.add.image(game.canvas.width/2,  game.canvas.height/2,'Menu');
        this.bg.scaleX = game.canvas.width/1920;
    	this.bg.scaleY = game.canvas.width/2200;
        this.canvas = new improCanvas(this, 128);


        if (this.usesLocalStorage) {
            if (localStorage.getItem('lastAvatar') !== null) {
                this.canvas.loadDrawing(localStorage.getItem('lastAvatar'));
            }
        }

        this.drawYourself = this.add.text(game.canvas.width/2, 10, 'Draw yourself!', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });

        
    	this.button_confirm = this.add.image(game.canvas.width / 4, game.canvas.height / 4, 'Ready_es').setInteractive({cursor: 'pointer'});
    	this.button_clear = this.add.image(game.canvas.width * 3 / 4, game.canvas.height / 4, 'Corona').setInteractive({cursor: 'pointer'});
        
		this.button_confirm.on('pointerdown', function (pointer){
			localStorage.setItem('lastAvatar',this.canvas.toString());
            this.scene.start('PreLobby');
		}, this);
		
		this.button_clear.on('pointerdown', function (pointer){
            this.canvas.clear();
		}, this);
    }
    
    update() { 
        this.canvas.onUpdate();
    }
}