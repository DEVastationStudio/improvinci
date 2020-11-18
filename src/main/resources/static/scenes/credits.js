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
        this.RetratoBelenImg = this.add.image(0, 0,'RetratoBelen'+game.global.languageSuffix);
        this.RetratoImanolImg = this.add.image(0, 0,'RetratoImanol'+game.global.languageSuffix);
        this.RetratoMariaImg = this.add.image(0, 0,'RetratoMaria'+game.global.languageSuffix);
        this.RetratoPabloImg = this.add.image(0, 0,'RetratoPablo'+game.global.languageSuffix);
        this.RetratoTomasImg = this.add.image(0, 0,'RetratoTomas'+game.global.languageSuffix);
    	
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
    	this.return_credits_bt.x = game.canvas.width * 1/ 10;
		this.return_credits_bt.y = game.canvas.height * 9 / 10;
		this.return_credits_bt.setScale(this.sY);
        
        //Developers
        this.RetratoBelenImg.x = game.canvas.width * 3/ 10;
		this.RetratoBelenImg.y = game.canvas.height * 2 / 10;
        this.RetratoBelenImg.setScale(this.sY*0.9);
        
        this.RetratoMariaImg.x = game.canvas.width * 7/ 10;
		this.RetratoMariaImg.y = game.canvas.height * 2 / 10;
		this.RetratoMariaImg.setScale(this.sY*0.9);
        
        this.RetratoPabloImg.x = game.canvas.width * 3/ 10;
		this.RetratoPabloImg.y = game.canvas.height * 5 / 10;
		this.RetratoPabloImg.setScale(this.sY*0.9);

        this.RetratoImanolImg.x = game.canvas.width * 7/ 10;
		this.RetratoImanolImg.y = game.canvas.height * 5 / 10;
		this.RetratoImanolImg.setScale(this.sY*0.9);
        
        this.RetratoTomasImg.x = game.canvas.width * 5/ 10;
		this.RetratoTomasImg.y = game.canvas.height * 8 / 10;
		this.RetratoTomasImg.setScale(this.sY*0.9);
        
		//Background
		this.bg.x = game.canvas.width / 2;
		this.bg.y = game.canvas.height / 2;
		this.bg.setScale(Math.max(this.sX, this.sY));
	}
}