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

        this.tablaPuntuaciones = this.add.image( 0, 0,'TopScores'+game.global.languageSuffix);
    	this.return_options_bt = this.add.image( 0, 0,'salirBoton'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});
        
        if (typeof(Storage) !== 'undefined') {
            this.usesLocalStorage = true;
            } else {
            this.usesLocalStorage = false;
            }
    
            this.canvas = new improCanvas(this, 128);
    
            this.topScores = this.add.text(0, 0, '', { fontSize: '50px', fontFamily: 'comic sans ms', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff'});
        
            if (this.usesLocalStorage) {
                if (localStorage.getItem('score') !== null) {
                    let arr = JSON.parse(localStorage.getItem('score'));
                    for (let i = 1; i <= arr.length; i++) {
                        if(i%2 == 0)
                            this.topScores.text += (i)+': ' + arr[i-1].score + ' (' + arr[i-1].result + ')' + '\n';
                        else
                            this.topScores.text += (i)+': ' + arr[i-1].score + ' (' + arr[i-1].result + ')' + '       ';
                    }
                }
            }

        this.scaler();

        //Tweens
		this.return_options_btTween = this.tweens.add({
			targets:[this.return_options_bt],
			scale: {from: this.return_options_bt.scale , to: this.return_options_bt.scale*0.9 },
			duration: 100,
			ease: 'Quad.easeout',
			paused: true,
			yoyo: true
		});

    	this.return_options_bt.on('pointerdown', function (pointer){
            this.return_options_btTween.play()
			this.cameras.main.fadeOut(200);
            this.cameras.main.once('camerafadeoutcomplete', function(camera) {
                this.scene.start('Menu');
            }, this);
        }, this);

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
        this.return_options_bt.x = game.canvas.width/10;
		this.return_options_bt.y = game.canvas.height*9/10;
        this.return_options_bt.setScale(this.sY);

        this.tablaPuntuaciones.x = game.canvas.width / 2;
		this.tablaPuntuaciones.y = game.canvas.height / 2;
        this.tablaPuntuaciones.setScale(Math.min(this.sX, this.sY));
        
        this.bg.x = game.canvas.width / 2;
		this.bg.y = game.canvas.height / 2;
		this.bg.setScale(Math.max(this.sX, this.sY));

		this.topScores.x = (this.tablaPuntuaciones.x-(this.tablaPuntuaciones.width*this.tablaPuntuaciones.scaleX)/2) +  (this.tablaPuntuaciones.width*this.tablaPuntuaciones.scaleX/20)*5;
		this.topScores.y = (this.tablaPuntuaciones.y-(this.tablaPuntuaciones.height*this.tablaPuntuaciones.scaleY)*13/32) + (this.tablaPuntuaciones.height*this.tablaPuntuaciones.scaleY/20)*4;
		this.topScores.setScale(Math.min(this.sX, this.sY)*1.2);
    }
}