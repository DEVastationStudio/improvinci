'use strict';

class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }
    preload() {

    }

    create() {
		if (typeof(Storage) !== 'undefined') {
            this.usesLocalStorage = true;
        } else {
            this.usesLocalStorage = false;
        }
        if (this.usesLocalStorage) {
            if (localStorage.getItem('lang') !== null) {
                game.global.languageSuffix = localStorage.getItem('lang');
            } else {
                localStorage.setItem('lang', '_en');
            }
        }
		//Scale factors
    	this.sX = game.canvas.width/game.global.WIDTH;
		this.sY = game.canvas.height/game.global.HEIGHT;

		//Background
		this.bg = this.add.image(0,0,'Menu');
		
		//Buttons
    	this.pancarta = this.add.image(0,0,'cartelImprovinci').setInteractive();
    	this.ready_bt = this.add.image(0,0,'Play'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});
    	this.options_bt = this.add.image(0,0,'Ready_host_es').setInteractive({cursor: 'pointer'});
		this.credits_bt = this.add.image(0,0,'Credits'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});

		if(game.global.languageSuffix === '_en')
		{
			this.spanishBtn = this.add.image(0,0,'spainFlag').setInteractive({cursor: 'pointer'}).setAlpha(0.4);
			this.englishBtn = this.add.image(0,0,'ukFlag');
		}else
		{
			this.spanishBtn = this.add.image(0,0,'spainFlag');
			this.englishBtn = this.add.image(0,0,'ukFlag').setInteractive({cursor: 'pointer'}).setAlpha(0.4);
		}

		this.scaler();


    	//Button actions
		this.ready_bt.on('pointerdown', function (pointer){
			this.cameras.main.fadeOut(200);
            this.cameras.main.once('camerafadeoutcomplete', function(camera) {
                this.scene.start('DrawAvatar');
            }, this);
		}, this);
		
		this.options_bt.on('pointerdown', function (pointer){
			this.cameras.main.fadeOut(200);
            this.cameras.main.once('camerafadeoutcomplete', function(camera) {
                this.scene.start('Options');
            }, this);
		}, this);
		
		this.credits_bt.on('pointerdown', function (pointer){
			this.cameras.main.fadeOut(200);
            this.cameras.main.once('camerafadeoutcomplete', function(camera) {
                this.scene.start('Credits');
            }, this);
		}, this);

		this.englishBtn.on('pointerdown', function (pointer){
			this.englishBtn.removeInteractive();
			this.spanishBtn.setInteractive({cursor: 'pointer'});
			this.spanishBtn.setAlpha(0.4);
			this.englishBtn.setAlpha(1);
			game.global.languageSuffix = '_en';
			localStorage.setItem('lang', '_en');
			this.ready_bt.setTexture('Play'+game.global.languageSuffix);
    		this.options_bt.setTexture('Ready_host_es');
			this.credits_bt.setTexture('Credits'+game.global.languageSuffix);
		}, this);

		this.spanishBtn.on('pointerdown', function (pointer){
			this.spanishBtn.removeInteractive();
			this.englishBtn.setInteractive({cursor: 'pointer'});
			this.englishBtn.setAlpha(0.4);
			this.spanishBtn.setAlpha(1);
			game.global.languageSuffix = '_es';
			localStorage.setItem('lang', '_es');
			this.ready_bt.setTexture('Play'+game.global.languageSuffix);
    		this.options_bt.setTexture('Ready_host_es');
			this.credits_bt.setTexture('Credits'+game.global.languageSuffix);
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
		//Buttons
		this.ready_bt.x = game.canvas.width* 1.5 / 6;
		this.ready_bt.y = game.canvas.height * 2.3 / 4;
		this.ready_bt.setScale(this.sY*0.9);

    	this.options_bt.x = game.canvas.width * 3 / 6;
		this.options_bt.y = game.canvas.height * 2.3 / 4;
		this.options_bt.setScale(this.sY*0.9);

    	this.credits_bt.x = game.canvas.width * 4.5 / 6;
		this.credits_bt.y = game.canvas.height * 2.3 / 4;
		this.credits_bt.setScale(this.sY*0.9);
		
    	this.pancarta.x = game.canvas.width / 2;
		this.pancarta.y = game.canvas.height * 8.3 / 50;
		this.pancarta.setScale(this.sY);
		
		this.spanishBtn.x = game.canvas.width * 6.6 / 8;
		this.spanishBtn.y = game.canvas.height * 0.8 / 8;
		this.spanishBtn.setScale(this.sY);

		this.englishBtn.x = game.canvas.width * 7 / 8;
		this.englishBtn.y = game.canvas.height * 0.8 / 8;
		this.englishBtn.setScale(this.sY);
		
		//Background
		this.bg.x = game.canvas.width / 2;
		this.bg.y = game.canvas.height / 2;
		this.bg.setScale(Math.max(this.sX, this.sY));
	}
}