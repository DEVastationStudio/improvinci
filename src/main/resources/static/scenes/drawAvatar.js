'use strict';

class DrawAvatar extends Phaser.Scene {
    constructor() {
        super('DrawAvatar');
    }
    preload() {

    }

    create() {
        //Scale factors
    	this.sX = game.canvas.width/game.global.WIDTH;
		this.sY = game.canvas.height/game.global.HEIGHT;

        //Background
        this.bg = this.add.image(0,0,'Menu');

        //Buttons
        this.button_confirm = this.add.image(0,0, 'Ready_es').setInteractive({cursor: 'pointer'});
        this.button_clear = this.add.image(0,0, 'Corona').setInteractive({cursor: 'pointer'});
    	this.return_bt = this.add.image(game.canvas.width*4/5 ,game.canvas.height*1/5,'salirBoton'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});
    	        
        //Button actions
        this.button_confirm.on('pointerdown', function (pointer){
			localStorage.setItem('lastAvatar',this.canvas.toString());
            this.cameras.main.fadeOut(200);
            this.cameras.main.once('camerafadeoutcomplete', function(camera) {
                this.scene.start('PreLobby');
            }, this);
		}, this);
		
		this.button_clear.on('pointerdown', function (pointer){
            this.canvas.clear();
		}, this);

    	this.return_bt.on('pointerdown', function (pointer){
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
        this.frame = this.add.image(0, 0,'Marco1'); 

        if (this.usesLocalStorage) {
            if (localStorage.getItem('lastAvatar') !== null) {
                this.canvas.loadDrawing(localStorage.getItem('lastAvatar'));
            }
        }
        this.drawYourself = this.add.text(game.canvas.width/2, game.canvas.height/22, 'Draw yourself!', {fontSize: '40px', fontFamily: 'comic sans ms', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff', align: 'center'}).setOrigin(0.5, 0.5);
        this.cameras.main.fadeIn(200);
        
        this.scaler();
    }
    
    update(time, delta) { 
        if(this.sX != game.canvas.width/game.global.WIDTH || this.sY != game.canvas.height/game.global.HEIGHT)
		{
			this.sX = game.canvas.width/game.global.WIDTH;
			this.sY = game.canvas.height/game.global.HEIGHT;
			this.scaler();
		}
        this.canvas.onUpdate(delta);
    }

    scaler()
    {
        //Buttons
        this.button_confirm.x = game.canvas.width / 4;
        this.button_confirm.y = game.canvas.height / 4;
        this.button_confirm.setScale(this.sY);

        this.button_clear.x = game.canvas.width * 3 / 4;
        this.button_clear.y = game.canvas.height / 4;
        this.button_clear.setScale(this.sY);

        this.return_bt.x = game.canvas.width / 4;
        this.return_bt.y = game.canvas.height * 3 / 4;
        this.return_bt.setScale(this.sY);

        //Background
        this.bg.x = game.canvas.width / 2;
		this.bg.y = game.canvas.height / 2;
        this.bg.setScale(Math.max(this.sX, this.sY));
        
        this.drawYourself.x = game.canvas.width/2;
        this.drawYourself.y = game.canvas.height/22;
        this.drawYourself.setScale(this.sY);

        this.frame.x = game.canvas.width/2;
        this.frame.y = game.canvas.height/2;
        this.frame.setScale(0.5);
    }
}