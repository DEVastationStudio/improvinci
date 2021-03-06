'use strict';

class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }
    preload() {

    }

    create(data) {
        //Scale factors
        this.sX = game.canvas.width/game.global.WIDTH;
        this.sY = game.canvas.height/game.global.HEIGHT;

        //Background
        this.bg = this.add.image(0,0,'finFondoO');

        //Buttons
    	this.playAgain_bt = this.add.image(0,0,'otra'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});
    	this.quit_bt = this.add.image(0,0,'salirMainMenu'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});

        if (this.textures.exists(data.players[0].playerId+'s')) {
            this.textures.get(data.players[0].playerId+'s').destroy();
        }
        improCanvas.makeTexture(data.players[0].playerId+'s', data.players[0].picture, this, 128);

        this.winnerDrawing = this.add.image(game.canvas.width*5/16, game.canvas.height*7/16,data.players[0].playerId+'s'); 
        this.winnerDrawing.setScale(game.canvas.height/230.4,game.canvas.height/230.4);
        
        
        this.winnerFrame = this.add.image(game.canvas.width*5/16, game.canvas.height*7/16,'Marco1'); 
        this.winnerFrame.setScale(game.canvas.height/460.8,game.canvas.height/460.8);

        this.crown = this.add.image(this.winnerFrame.x - this.winnerFrame.displayWidth/2, this.winnerFrame.y - this.winnerFrame.displayHeight/2,'Corona'); 

        this.winnerScore = this.add.text(game.canvas.width*5/16, game.canvas.height*7/16 + this.winnerFrame.displayHeight/2, data.players[0].score, { fontSize: '30px', fontFamily: 'Comic Sans MS', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff', align: 'center'}).setOrigin(0.5, 0.5);

        this.drawings = [];
        this.frames = [];
        this.scores = [];
        this.frameImages = ['Marco1', 'Marco2', 'Marco3', 'Marco4'];
        this.topScore = data.players[0].score;
        this.crowns = [];

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 2; j++) {
                if (data.players[1+i+j*4] === undefined) continue;

                if (this.textures.exists(data.players[1+i+j*4].playerId+'s')) {
                    this.textures.get(data.players[1+i+j*4].playerId+'s').destroy();
                }
                improCanvas.makeTexture(data.players[1+i+j*4].playerId+'s', data.players[1+i+j*4].picture, this, 128);

                this.drawings[i+j*4] = this.add.image(game.canvas.width*11/16 + ((0.2*game.canvas.height)*(i-1.5)), game.canvas.height*5/16 + ((0.2*game.canvas.height)*(j-0.5)),data.players[1+i+j*4].playerId+'s'); 
                this.drawings[i+j*4].setScale(game.canvas.height/1177.6,game.canvas.height/1177.6);
                
                this.frames[i+j*4] = this.add.image(game.canvas.width*11/16 + ((0.2*game.canvas.height)*(i-1.5)), game.canvas.height*5/16 + ((0.2*game.canvas.height)*(j-0.5)), this.frameImages[Math.floor(Math.random()*this.frameImages.length)]); 
                this.frames[i+j*4].setScale(game.canvas.height/2355.2,game.canvas.height/2355.2);

                this.scores[i+j*4] = this.add.text(game.canvas.width*11/16 + ((0.2*game.canvas.height)*(i-1.5)), game.canvas.height*5/16 + ((0.2*game.canvas.height)*(j-0.5)) + (0.1*game.canvas.height), data.players[1+i+j*4].score, { fontSize: '30px', fontFamily: 'Comic Sans MS', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff', align: 'center'}).setOrigin(0.5, 0.5);
                if (data.players[1+i+j*4].score === this.topScore)
                    this.crowns[i+j*4] = this.add.image(this.frames[i+j*4].x - this.frames[i+j*4].displayWidth/2, this.frames[i+j*4].y - this.frames[i+j*4].displayHeight/2,'Corona'); 
            }
        }
        
        this.scaler();

        //Tweens
		this.playAgain_btTween = this.tweens.add({
			targets:[this.playAgain_bt],
			scale: {from: this.playAgain_bt.scale , to: this.playAgain_bt.scale*0.9 },
			duration: 100,
			ease: 'Quad.easeout',
			paused: true,
			yoyo: true
        });
        
		this.quit_btTween = this.tweens.add({
			targets:[this.quit_bt],
			scale: {from: this.quit_bt.scale , to: this.quit_bt.scale*0.9 },
			duration: 100,
			ease: 'Quad.easeout',
			paused: true,
			yoyo: true
        });

        this.playAgain_bt.on('pointerdown', function (pointer){
            this.playAgain_btTween.play();
            if (data.leader) {
                this.cameras.main.fadeOut(200);
                this.cameras.main.once('camerafadeoutcomplete', function(camera) {
                    this.scene.start('Lobby', {code: data.code, players: data.players, leader: data.leader});
                }, this);
            } else {
                //this.scene.start('Lobby', {code: data.code, players: data.players, leader: data.leader});
                let msg = new Object();
                msg.event = 'TRY_JOIN';
                msg.roomCode = data.code;
                msg.picture = localStorage.getItem('lastAvatar');
                game.global.socketDir.send(JSON.stringify(msg));
            }
            //expand this when it's implemented properly because it can fail I guess (if you type a wrong code or something like that, idk)
            this.playAgain_bt.removeInteractive();
            this.quit_bt.removeInteractive();
        }, this);
        
        this.quit_bt.on('pointerdown', function (pointer){
            this.quit_btTween.play();
            this.cameras.main.fadeOut(200);
            this.cameras.main.once('camerafadeoutcomplete', function(camera) {
                this.scene.start('Menu');
            }, this);
            this.playAgain_bt.removeInteractive();
            this.quit_bt.removeInteractive();
            game.global.socketDir.close();
            game.global.socketDir = undefined;
        }, this);
        
        if (typeof(Storage) !== 'undefined') {
            this.usesLocalStorage = true;
        } else {
            this.usesLocalStorage = false;
        }
        if (this.usesLocalStorage) {
            let arr;
            if (localStorage.getItem('score') === null) {
                arr = [];
            } else {
                arr = JSON.parse(localStorage.getItem('score'));
            }
            arr.push({ score: data.yourScore, result: ((data.yourScore===this.topScore)?('Win'):('Loss')) });
            console.log("Added score " + data.yourScore);
            arr.sort((a, b) => b.score - a.score);
            arr = arr.slice(0,10)
            localStorage.setItem('score', JSON.stringify(arr));
            console.dir(arr);
        }
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
		this.quit_bt.x = game.canvas.width * 6 / 10;
		this.quit_bt.y = game.canvas.height * 4/ 5;
		this.quit_bt.setScale(this.sY);

    	this.playAgain_bt.x = game.canvas.width * 8 / 10;
		this.playAgain_bt.y = game.canvas.height * 4/ 5;
        this.playAgain_bt.setScale(this.sY);
        		
		//Background
		this.bg.x = game.canvas.width / 2;
		this.bg.y = game.canvas.height / 2;
        this.bg.setScale(Math.max(this.sX, this.sY));
        
        //Scores
        this.winnerDrawing.x = game.canvas.width*1/4;
        this.winnerDrawing.y = game.canvas.height*7/16;
        this.winnerDrawing.setScale(0.75*game.canvas.height/230.4);
        
        this.winnerFrame.x = game.canvas.width*1/4; 
        this.winnerFrame.y = game.canvas.height*7/16; 
        this.winnerFrame.setScale(0.75*game.canvas.height/460.8);

        this.crown.x = this.winnerFrame.x - this.winnerFrame.displayWidth/2; 
        this.crown.y = this.winnerFrame.y - this.winnerFrame.displayHeight/2; 
        this.crown.setScale(this.sY/3);

        this.winnerScore.x = game.canvas.width*1/4;
        this.winnerScore.y = game.canvas.height*7/16 + this.winnerFrame.displayHeight/2;
        this.winnerScore.setScale(this.sY*0.75);

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 2; j++) {
                if (this.drawings[i+j*4] === undefined) continue;
                this.drawings[i+j*4].x = game.canvas.width*12/16 + ((0.2*game.canvas.height)*(i-1.5)); 
                this.drawings[i+j*4].y = game.canvas.height*5/16 + ((0.2*game.canvas.height)*(j-0.5)); 
                this.drawings[i+j*4].setScale(game.canvas.height/1177.6,game.canvas.height/1177.6);
                
                this.frames[i+j*4].x = game.canvas.width*12/16 + ((0.2*game.canvas.height)*(i-1.5)); 
                this.frames[i+j*4].y = game.canvas.height*5/16 + ((0.2*game.canvas.height)*(j-0.5)); 
                this.frames[i+j*4].setScale(game.canvas.height/2355.2,game.canvas.height/2355.2);

                this.scores[i+j*4].x = game.canvas.width*12/16 + ((0.2*game.canvas.height)*(i-1.5));
                this.scores[i+j*4].y = game.canvas.height*5/16 + ((0.2*game.canvas.height)*(j-0.5)) + (0.1*game.canvas.height);
                this.scores[i+j*4].setScale(this.sY);

                if (this.crowns[i+j*4] !== undefined) {
                    this.crowns[i+j*4].x = this.frames[i+j*4].x - this.frames[i+j*4].displayWidth/2; 
                    this.crowns[i+j*4].y =this.frames[i+j*4].y - this.frames[i+j*4].displayHeight/2; 
                    this.crowns[i+j*4].setScale(this.sY/4);
                }
            }
        }
	}
}