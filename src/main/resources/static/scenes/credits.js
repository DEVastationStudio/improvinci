'use strict';

class Credits extends Phaser.Scene {
    constructor() {
        super('Credits');
    }
    preload() {
    }

    create() {
        //Scale factors
        this.sX = game.canvas.width/game.global.WIDTH;
        this.sY = game.canvas.height/game.global.HEIGHT;
        
        //Background
        this.bg = this.add.image(0, 0,'credsFondoO').setInteractive();
        
        //Buttons
        this.return_credits_bt = this.add.image(0, 0,'salirBoton'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});
        
        //Developers
        this.RetratoBelenImg = this.add.image(0, 0,'RetratoBelen').setInteractive();
        this.RetratoImanolImg = this.add.image(0, 0,'RetratoImanol').setInteractive();
        this.RetratoMariaImg = this.add.image(0, 0,'RetratoMaria').setInteractive();
        this.RetratoPabloImg = this.add.image(0, 0,'RetratoPablo').setInteractive();
        this.RetratoTomasImg = this.add.image(0, 0,'RetratoTomas').setInteractive();
    	
    	this.return_credits_bt.on('pointerdown', function (pointer){
            this.cameras.main.fadeOut(200);
            this.cameras.main.once('camerafadeoutcomplete', function(camera) {
                this.scene.start('Menu');
            }, this);
        }, this);
        
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
		//Buttons
    	this.return_credits_bt.x = game.canvas.width * 3/ 10;
		this.return_credits_bt.y = game.canvas.height * 8 / 10;
		this.return_credits_bt.setScale(this.sY);
        
        //Developers
        this.RetratoBelenImg.x = game.canvas.width * 1.5/ 10;
		this.RetratoBelenImg.y = game.canvas.height * 3 / 10;
        this.RetratoBelenImg.setScale(this.sY);

        this.RetratoImanolImg.x = game.canvas.width * 4.5/ 10;
		this.RetratoImanolImg.y = game.canvas.height * 3 / 10;
		this.RetratoImanolImg.setScale(this.sY);
        
        this.RetratoMariaImg.x = game.canvas.width * 7.5/ 10;
		this.RetratoMariaImg.y = game.canvas.height * 3 / 10;
		this.RetratoMariaImg.setScale(this.sY);
        
        this.RetratoPabloImg.x = game.canvas.width * 3/ 10;
		this.RetratoPabloImg.y = game.canvas.height * 6 / 10;
		this.RetratoPabloImg.setScale(this.sY);
        
        this.RetratoTomasImg.x = game.canvas.width * 6/ 10;
		this.RetratoTomasImg.y = game.canvas.height * 6 / 10;
		this.RetratoTomasImg.setScale(this.sY);
        
		//Background
		this.bg.x = game.canvas.width / 2;
		this.bg.y = game.canvas.height / 2;
		this.bg.setScale(this.sX);
	}
}