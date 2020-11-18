'use strict';

class Options extends Phaser.Scene {
    constructor() {
        super('Options');
    }
    preload() {

    }

    create() {
        
		//Scale factors
    	this.sX = game.canvas.width/game.global.WIDTH;
        this.sY = game.canvas.height/game.global.HEIGHT;
        
        this.bg = this.add.image(0,0,'finFondoO');

    	this.return_options_bt = this.add.image(game.canvas.width/10 ,game.canvas.height*9/10,'salirBoton'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});
        this.tablaPuntuaciones = this.add.image(game.canvas.width/10 ,game.canvas.height*9/10,'TopScores'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});
        
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
        this.scaler();

        this.cameras.main.fadeIn(200);

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


        //Background
        this.bg.x = game.canvas.width / 2;
		this.bg.y = game.canvas.height / 2;
		this.bg.setScale(Math.max(this.sY));

		this.bg.x = game.canvas.width / 2;
		this.bg.y = game.canvas.height / 2;
		this.bg.setScale(Math.max(this.sX, this.sY));
    }
}