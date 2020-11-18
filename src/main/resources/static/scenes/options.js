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
			this.cameras.main.fadeOut(200);
            this.cameras.main.once('camerafadeoutcomplete', function(camera) {
                this.scene.start('Menu');
            }, this);
        }, this);
        
    	if (typeof(Storage) !== 'undefined') {
        this.usesLocalStorage = true;
        } else {
        this.usesLocalStorage = false;
        }

        this.canvas = new improCanvas(this, 128);

        this.topScores = this.add.text(game.canvas.width/2, 10, 'Top Scores:\n', { fontSize: '40px', fontFamily: 'comic sans ms', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff'});
    
        if (this.usesLocalStorage) {
            if (localStorage.getItem('score') !== null) {
                let arr = JSON.parse(localStorage.getItem('score'));
                for (let i = 0; i < arr.length; i++) {
                    this.topScores.text += arr[i].score + ' (' + arr[i].result + ')' + '\n';
                }
            }
        }
        this.cameras.main.fadeIn(200);
    }
    
    update() { 

    }
}