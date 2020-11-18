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
        this.bg = this.add.image(0,0,'Desco'+game.global.languageSuffix).setInteractive();

        this.textInfo = this.add.text(400, 150, data.message, {fontSize: '30px', fontFamily: 'Bookman', color: '#ff6600', stroke: '#000000', strokeThickness: 2, align: 'center'}).setOrigin(0.5, 0.5);
        this.disconnectButton = this.add.sprite(0,0,'salirBoton'+game.global.languageSuffix);

        this.disconnectButton.setInteractive({cursor: 'pointer'});
        this.disconnectButton.on('pointerdown', function (event) {
            console.log(data);
            this.scene.start(data.toPrelobby?'PreLobby':'Menu');
        }, this);

        this.scaler();
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
        //Buttons
        this.disconnectButton.x = game.canvas.width * 3/ 10;
		this.disconnectButton.y = game.canvas.height * 8 / 10;
		this.disconnectButton.setScale(this.sY);
        
        //Background
		this.bg.x = game.canvas.width/2;
		this.bg.y = game.canvas.height/2;
		this.bg.setScale(this.sY);
    }
}