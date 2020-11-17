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
    	this.return_bt = this.add.image(game.canvas.width*4/5 ,game.canvas.height*1/5,'salirBoton_en').setInteractive({cursor: 'pointer'});
    	
        this.scaler();
        
        //Button actions
        this.button_confirm.on('pointerdown', function (pointer){
			localStorage.setItem('lastAvatar',this.canvas.toString());
            this.scene.start('PreLobby');
		}, this);
		
		this.button_clear.on('pointerdown', function (pointer){
            this.canvas.clear();
		}, this);

    	this.return_bt.on('pointerdown', function (pointer){
			this.scene.start('Menu');
		}, this);

        if (typeof(Storage) !== 'undefined') {
        this.usesLocalStorage = true;
        } else {
        this.usesLocalStorage = false;
        }

        this.canvas = new improCanvas(this, 128);

        if (this.usesLocalStorage) {
            if (localStorage.getItem('lastAvatar') !== null) {
                this.canvas.loadDrawing(localStorage.getItem('lastAvatar'));
            }
        }
        this.drawYourself = this.add.text(game.canvas.width/2, 10, 'Draw yourself!', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
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
		this.bg.setScale(this.sX);
    }
}