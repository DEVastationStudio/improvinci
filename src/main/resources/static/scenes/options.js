'use strict';

class Options extends Phaser.Scene {
    constructor() {
        super('Options');
    }
    preload() {

    }

    create() {
    	this.return_options_bt = this.add.image(game.canvas.width*4/5 ,game.canvas.height*1/5,'Ronda_es').setInteractive({cursor: 'pointer'});
    	
    	this.return_options_bt.on('pointerdown', function (pointer){
			this.scene.start('Menu');
        }, this);
        
    	if (typeof(Storage) !== 'undefined') {
        this.usesLocalStorage = true;
        } else {
        this.usesLocalStorage = false;
        }

        this.canvas = new improCanvas(this, 128);

        this.topScores = this.add.text(game.canvas.width/2, 10, 'Top Scores:\n', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    
        if (this.usesLocalStorage) {
            if (localStorage.getItem('score') !== null) {
                let arr = JSON.parse(localStorage.getItem('score'));
                for (let i = 0; i < arr.length; i++) {
                    this.topScores.text += arr[i] + "\n";
                }
            }
        }
    }
    
    update() { 

    }
}