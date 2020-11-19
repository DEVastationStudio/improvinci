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
		this.bg = this.add.image(0,0,'Menu').setInteractive();
		
		//Buttons
    	this.pancarta = this.add.image(0,0,'cartelImprovinci').setInteractive();
    	this.jugar_bt = this.add.image(0,0,'Play'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});
    	this.puntuaciones_bt = this.add.image(0,0,'Puntuaciones'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});
    	this.tutorial_bt = this.add.image(0,0,'tutorialBt').setInteractive({cursor: 'pointer'});
		this.credits_bt = this.add.image(0,0,'Credits'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});

		//Tutorial
		this.tutorialPage = 1;

		this.tFondo = this.add.image(0,0,'TutorialBg'+this.tutorialPage+game.global.languageSuffix).setInteractive();
		this.tDerecha = this.add.image(0,0,'tDerecha').setInteractive({cursor: 'pointer'});
		this.tIzquierda = this.add.image(0,0,'tIzquierda').setInteractive({cursor: 'pointer'}).setAlpha(0);
		this.salirTuto = this.add.image(0,0,'SalirCod').setInteractive({cursor: 'pointer'});

		if(game.global.languageSuffix === '_en')
		{
			this.spanishBtn = this.add.image(0,0,'spainFlag').setInteractive({cursor: 'pointer'}).setAlpha(0.4);
			this.englishBtn = this.add.image(0,0,'ukFlag');
		}else
		{
			this.spanishBtn = this.add.image(0,0,'spainFlag');
			this.englishBtn = this.add.image(0,0,'ukFlag').setInteractive({cursor: 'pointer'}).setAlpha(0.4);
		}
		
		this.invisible(0);
		this.scaler();

		//Tweens
		this.englishBtnTween = this.tweens.add({
			targets:[this.englishBtn],
			scale: {from: this.englishBtn.scale , to: this.englishBtn.scale*0.9 },
			duration: 100,
			ease: 'Quad.easeout',
			paused: true,
			yoyo: true
		});

		this.spanishBtnTween = this.tweens.add({
			targets:[this.spanishBtn],
			scale: {from: this.spanishBtn.scale , to: this.spanishBtn.scale*0.9 },
			duration: 100,
			ease: 'Quad.easeout',
			paused: true,
			yoyo: true
		});

		this.puntuaciones_btTween = this.tweens.add({
			targets:[this.puntuaciones_bt],
			scale: {from: this.puntuaciones_bt.scale , to: this.puntuaciones_bt.scale*0.9 },
			duration: 100,
			ease: 'Quad.easeout',
			paused: true,
			yoyo: true
		});

		this.tutorial_btTween = this.tweens.add({
			targets:[this.tutorial_bt],
			scale: {from: this.tutorial_bt.scale , to: this.tutorial_bt.scale*0.9 },
			duration: 100,
			ease: 'Quad.easeout',
			paused: true,
			yoyo: true
		});

		this.jugar_btTween = this.tweens.add({
			targets:[this.jugar_bt],
			scale: {from: this.jugar_bt.scale , to: this.jugar_bt.scale*0.9 },
			duration: 100,
			ease: 'Quad.easeout',
			paused: true,
			yoyo: true
		});
		
		this.credits_btTween = this.tweens.add({
			targets:[this.credits_bt],
			scale: {from: this.credits_bt.scale , to: this.credits_bt.scale*0.9 },
			duration: 100,
			ease: 'Quad.easeout',
			paused: true,
			yoyo: true
		});

		this.flechaDTween = this.tweens.add({
			targets:[this.tDerecha],
			scale: {from: this.tDerecha.scale , to: this.tDerecha.scale*0.9 },
			duration: 100,
			ease: 'Quad.easeout',
			paused: true,
			yoyo: true
		});
		
		this.flechaITween = this.tweens.add({
			targets:[this.tIzquierda],
			scale: {from: this.tIzquierda.scale , to: this.tIzquierda.scale*0.9 },
			duration: 100,
			ease: 'Quad.easeout',
			paused: true,
			yoyo: true
		});

		this.salirTutoTween = this.tweens.add({
			targets:[this.salirTuto],
			scale: {from: this.salirTuto.scale , to: this.salirTuto.scale*0.9 },
			duration: 100,
			ease: 'Quad.easeout',
			paused: true,
			yoyo: true
		});

		//Tutorial
		this.tDerecha.on('pointerdown', function (pointer){
			this.flechaDTween.play();
			if(this.tutorialPage+1<=11) 
			{
				this.tutorialPage++;
				if(this.tutorialPage === 11) this.tDerecha.setAlpha(0.4);
				if(this.tutorialPage < 11) this.tDerecha.setAlpha(1);
			}
			if(this.tutorialPage>=1) 
			{
				if(this.tutorialPage === 1) this.tIzquierda.setAlpha(0.4);
				if(this.tutorialPage > 1) this.tIzquierda.setAlpha(1);
			}
			this.tFondo.setTexture('TutorialBg'+this.tutorialPage+game.global.languageSuffix);
			console.log(this.tutorialPage);
		}, this);

		this.tIzquierda.on('pointerdown', function (pointer){
			this.flechaITween.play();
			if(this.tutorialPage-1>=1) 
			{
				this.tutorialPage--;
				if(this.tutorialPage === 1) this.tIzquierda.setAlpha(0.4);
				if(this.tutorialPage > 1) this.tIzquierda.setAlpha(1);
			}
			if(this.tutorialPage<=11) 
			{
				if(this.tutorialPage === 11) this.tDerecha.setAlpha(0.4);
				if(this.tutorialPage < 11) this.tDerecha.setAlpha(1);
			}
			this.tFondo.setTexture('TutorialBg'+this.tutorialPage+game.global.languageSuffix);
			console.log(this.tutorialPage);
		}, this);

		this.salirTuto.on('pointerdown', function (pointer){
			this.salirTutoTween.play()
			this.invisible(0);
			this.tutorialPage = 1;
		}, this);

		this.tutorial_bt.on('pointerdown', function (pointer){
			this.tutorial_btTween.play();
			this.invisible(1);
			this.tIzquierda.setAlpha(0.4)
		}, this);

		this.bg.on('pointerdown', function (pointer){
			this.invisible(0);
			this.tutorialPage = 1;
		}, this);

    	//Button actions
		this.jugar_bt.on('pointerdown', function (pointer){
			this.jugar_btTween.play()
			this.cameras.main.fadeOut(200);
            this.cameras.main.once('camerafadeoutcomplete', function(camera) {
                this.scene.start('DrawAvatar');
            }, this);
		}, this);
		
		this.puntuaciones_bt.on('pointerdown', function (pointer){
			this.puntuaciones_btTween.play()
			this.cameras.main.fadeOut(200);
            this.cameras.main.once('camerafadeoutcomplete', function(camera) {
                this.scene.start('Options');
            }, this);
		}, this);
		
		this.credits_bt.on('pointerdown', function (pointer){
			this.credits_btTween.play();
			this.cameras.main.fadeOut(200);
            this.cameras.main.once('camerafadeoutcomplete', function(camera) {
                this.scene.start('Credits');
            }, this);
		}, this);

		this.englishBtn.on('pointerdown', function (pointer){
			this.englishBtnTween.play();
			this.invisible(0);
			this.tutorialPage = 1;
			this.englishBtn.removeInteractive();
			this.spanishBtn.setInteractive({cursor: 'pointer'});
			this.spanishBtn.setAlpha(0.4);
			this.englishBtn.setAlpha(1);
			game.global.languageSuffix = '_en';
			localStorage.setItem('lang', '_en');
			this.jugar_bt.setTexture('Play'+game.global.languageSuffix);
    		this.puntuaciones_bt.setTexture('Puntuaciones'+game.global.languageSuffix);
			this.credits_bt.setTexture('Credits'+game.global.languageSuffix);
		}, this);

		this.spanishBtn.on('pointerdown', function (pointer){
			this.spanishBtnTween.play();
			this.invisible(0);
			this.tutorialPage = 1;
			this.spanishBtn.removeInteractive();
			this.englishBtn.setInteractive({cursor: 'pointer'});
			this.englishBtn.setAlpha(0.4);
			this.spanishBtn.setAlpha(1);
			game.global.languageSuffix = '_es';
			localStorage.setItem('lang', '_es');
			this.jugar_bt.setTexture('Play'+game.global.languageSuffix);
    		this.puntuaciones_bt.setTexture('Puntuaciones'+game.global.languageSuffix);
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

	invisible(isVisible)
	{
		if(isVisible) this.tFondo.setTexture('TutorialBg'+this.tutorialPage+game.global.languageSuffix);
		this.tIzquierda.setAlpha(isVisible);
		this.tDerecha.setAlpha(isVisible);
		this.salirTuto.setAlpha(isVisible);
		this.tFondo.setAlpha(isVisible);

		this.jugar_bt.setAlpha(!isVisible);
		this.puntuaciones_bt.setAlpha(!isVisible);
		this.tutorial_bt.setAlpha(!isVisible);
		this.credits_bt.setAlpha(!isVisible);
	}

	scaler()
	{
		//Buttons
		this.jugar_bt.x = game.canvas.width * 3 / 6;
		this.jugar_bt.y = game.canvas.height * 2.3 / 4;
		this.jugar_bt.setScale(this.sY*0.9);

    	this.puntuaciones_bt.x = game.canvas.width * 1 / 6;
		this.puntuaciones_bt.y = game.canvas.height * 2.3 / 4;
		this.puntuaciones_bt.setScale(this.sY*0.6);

    	this.tutorial_bt.x = game.canvas.width * 5 / 6;
		this.tutorial_bt.y = game.canvas.height * 2.3 / 4;
		this.tutorial_bt.setScale(this.sY*0.8);

    	this.credits_bt.x = game.canvas.width * 5 / 6;
		this.credits_bt.y = game.canvas.height * 5.2 / 6;
		this.credits_bt.setScale(this.sY*0.45);
		
    	this.pancarta.x = game.canvas.width / 2;
		this.pancarta.y = game.canvas.height * 12 / 50;
		this.pancarta.setScale(this.sY);
		
		this.spanishBtn.x = game.canvas.width * 8.5 / 10;
		this.spanishBtn.y = game.canvas.height * 0.8 / 8;
		this.spanishBtn.setScale(this.sY*1.3);

		this.englishBtn.x = game.canvas.width * 9.5 / 10;
		this.englishBtn.y = game.canvas.height * 0.8 / 8;
		this.englishBtn.setScale(this.sY*1.3);

		//Tutorial
		this.tFondo.x = game.canvas.width /2;
		this.tFondo.y = game.canvas.height /2;
		this.tFondo.setScale(this.sY*0.8);

		let kbLTCornerX = (this.tFondo.x-(this.tFondo.width*this.tFondo.scaleX)/2);
        let kbLTCornerY = (this.tFondo.y-(this.tFondo.height*this.tFondo.scaleY)/2);
        let columnPos = this.tFondo.width*this.tFondo.scaleX/20;
        let rowPos = this.tFondo.height*this.tFondo.scaleY/20;

		this.tDerecha.x = kbLTCornerX+columnPos*21;
		this.tDerecha.y = kbLTCornerY+rowPos*10;
		this.tDerecha.setScale(this.sY);

		this.tIzquierda.x = kbLTCornerX+(columnPos*-1);
		this.tIzquierda.y = kbLTCornerY+rowPos*10;
		this.tIzquierda.setScale(this.sY);

		this.salirTuto.x = kbLTCornerX+columnPos*17;
		this.salirTuto.y = kbLTCornerY+rowPos;
		this.salirTuto.setScale(this.sY);
		
		//Background
		this.bg.x = game.canvas.width / 2;
		this.bg.y = game.canvas.height / 2;
		this.bg.setScale(Math.max(this.sX, this.sY));
	}
}