'use strict';

class DisconnectOverlay extends Phaser.Scene {
    constructor() {
        super('DisconnectOverlay');
    }

    create(data) {
        //Scale factors
    	this.sX = game.canvas.width/game.global.WIDTH;
        this.sY = game.canvas.height/game.global.HEIGHT;

        //backgrounds
        this.bbg = this.add.image(0,0,'Menu');
        this.bg = this.add.image(0,0,'Desco').setInteractive();

        this.textInfo = this.add.text(game.canvas.width / 2, game.canvas.height * 3 / 8, data.message, {fontSize: '80px', fontFamily: 'Comic Sans MS', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff', align: 'center'}).setOrigin(0.5, 0.5);
        this.disconnectButton = this.add.sprite(0,0,'salirBoton'+game.global.languageSuffix);

        this.disconnectButton.setInteractive({cursor: 'pointer'});

        this.scaler();

        //Tweens
		this.disconnectButtonTween = this.tweens.add({
			targets:[this.disconnectButton],
			scale: {from: this.disconnectButton.scale , to: this.disconnectButton.scale*0.9 },
			duration: 100,
			ease: 'Quad.easeout',
			paused: true,
			yoyo: true
		});

        this.disconnectButton.on('pointerdown', function (event) {
            this.disconnectButtonTween.play();
            console.log(data);
            this.cameras.main.fadeOut(200);
            this.cameras.main.once('camerafadeoutcomplete', function(camera) {
                this.scene.start(data.toPrelobby?'PreLobby':'Menu');
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
        
		//Backbackground
		this.bbg.x = game.canvas.width / 2;
		this.bbg.y = game.canvas.height / 2;
        this.bbg.setScale(Math.max(this.sX, this.sY));

        //Background
		this.bg.x = game.canvas.width/2;
		this.bg.y = game.canvas.height/2;
        this.bg.setScale(Math.min(this.sX, this.sY));

        //Buttons
        this.disconnectButton.x = this.bg.x - this.bg.displayWidth / 4;
		this.disconnectButton.y = this.bg.y + this.bg.displayHeight / 4;
		this.disconnectButton.setScale(this.sY);
        
		this.textInfo.x = game.canvas.width/2;
		this.textInfo.y = game.canvas.height * 3 / 8;
        this.textInfo.setScale(this.sY);
        
    }
}