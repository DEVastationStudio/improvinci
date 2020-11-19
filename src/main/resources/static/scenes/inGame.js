'use strict';

class InGame extends Phaser.Scene {
    constructor() {
        super('InGame');
    }
    preload() {
    }

    create(data) {
        //Scale factors
        this.sX = game.canvas.width/game.global.WIDTH;
        this.sY = game.canvas.height/game.global.HEIGHT;

        //Background
        this.bg = this.add.image(0,0,'Gameplay');

        //Buttons
        this.fakerPeekButton = this.add.image(0,0,'Copiar'+game.global.languageSuffix); 
        this.fakerPeekButton.setAlpha(0);
        this.button_clear = this.add.image(game.canvas.width * 3 / 4, game.canvas.height / 4, 'BorrarDibujo').setInteractive({cursor: 'pointer'});
        //this.fakerPeekButton.setScale(0.2, 0.2);
        this.button_back = this.add.image(0,0, 'salirMainMenu'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});

        //Critico
        this.CriticoLejosImg = this.add.image(0,0,'CriticoLejos');

        //Gamemodes
        this.iconoDefaultImg = this.add.image(0,0,'ModoNormal'+game.global.languageSuffix);
        this.iconoBlindImg = this.add.image(0,0,'ModoACiegas'+game.global.languageSuffix);
        this.iconoLimitImg = this.add.image(0,0,'ModoTrazosLim'+game.global.languageSuffix);
        this.iconoOneImg = this.add.image(0,0,'ModoUnSoloTrazo'+game.global.languageSuffix);
        this.iconoGrowingImg = this.add.image(0,0,'ModoBrochaIncremental'+game.global.languageSuffix);

        //timerText
        this.TimeAnim = this.add.sprite(0,0, 'TimeAnim');
		this.anims.create(
		{
			key: 'Clock_Anim',
			frames: this.anims.generateFrameNumbers('TimeAnim'),
			frameRate: 12,
			repeat: -1
        });
        this.timerText = this.add.text(0 ,0, '', {fontSize: '50px', fontFamily: 'comic sans ms', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff' });
        
        //Data
        this.maxRounds = data.maxRounds;
        this.curRound = 0;
        this.players = data.players;
        this.roundGamemode = '';

        this.roundWord = '';
        this.roundFaker = false;

        this.roundState = 0;
        this.wordBoolArray = [];
        this.wordPositionArray = [];
        this.wordTimeArray = [];
        
        this.maxTime = 0;
        this.drawings = [];
        this.frames = [];
        this.votes = [];
        this.frameImages = ['Marco1', 'Marco2', 'Marco3', 'Marco4'];
        this.votedPlayerId = -1;
        this.selfPlayer = '';
        this.votedIndicators = [];
        this.inVotingPhase = false;
        this.pictures = [];
        this.crowns = [];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.drawings[i+j*3] = this.add.image(game.canvas.width/2 + ((0.3*game.canvas.height)*(i-1)), game.canvas.height/2 + ((0.3*game.canvas.height)*(j-1)),'empty'); 
                this.drawings[i+j*3].setScale(game.canvas.height/1177.6,game.canvas.height/1177.6);
                this.drawings[i+j*3].setAlpha(0);
                this.frames[i+j*3] = this.add.image(game.canvas.width/2 + ((0.3*game.canvas.height)*(i-1)), game.canvas.height/2 + ((0.3*game.canvas.height)*(j-1)), this.frameImages[Math.floor(Math.random()*this.frameImages.length)]); 
                this.frames[i+j*3].setScale(game.canvas.height/1177.6,game.canvas.height/1177.6);
                this.frames[i+j*3].setAlpha(0);
                this.pictures[i+j*3] = this.add.image(this.drawings[i+j*3].x, this.drawings[i+j*3].y, 'empty');
                this.pictures[i+j*3].setScale(this.drawings[i+j*3].scaleX*2, this.drawings[i+j*3].scaleY*2);
                this.pictures[i+j*3].setAlpha(0);
                this.votes[i+j*3] = this.add.text(game.canvas.width/2 + ((0.3*game.canvas.height)*(i-1)), game.canvas.height/2 + ((0.3*game.canvas.height)*(j-1)) + (0.15*game.canvas.height), '', { fontSize: '30px', fontFamily: 'comic sans ms', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff', align: 'center'}).setOrigin(0.5, 0.5);
                this.votedIndicators[i+j*3] = this.add.image(this.drawings[i+j*3].x + this.drawings[i+j*3].displayWidth/2, this.drawings[i+j*3].y - this.drawings[i+j*3].displayHeight/2,'critico_cerca'); 
                this.votedIndicators[i+j*3].setScale(this.sY/6);
                this.votedIndicators[i+j*3].setAlpha(0);

                this.crowns[i+j*3] = this.add.image(this.frames[i+j*3].x - this.frames[i+j*3].displayWidth/2, this.frames[i+j*3].y - this.frames[i+j*3].displayHeight/2,'Corona'); 
                this.crowns[i+j*3].setScale(this.sY/4);
                this.crowns[i+j*3].setAlpha(0);

                this.drawings[i+j*3].on('pointerdown', function (pointer){
                    this.scene.get('InGame').enhanceImage(i+j*3);
                }, this);
            }
        }
        this.bigImage = this.add.image(game.canvas.width/2, game.canvas.height/2,'empty'); 
        this.bigImage.setScale(game.canvas.height/460.8,game.canvas.height/460.8);
        this.bigImage.setAlpha(0);

        this.bigFrame = this.add.image(game.canvas.width/2, game.canvas.height/2,this.frameImages[Math.floor(Math.random()*this.frameImages.length)]); 
        this.bigFrame.setScale(game.canvas.height/460.8,game.canvas.height/460.8);
        this.bigFrame.setAlpha(0);
        
        this.confirmVoteButton = this.add.image(0,0,'Vote'+game.global.languageSuffix); 
        this.cancelVoteButton = this.add.image(0,0, 'SalirCod');

        this.dcImage = this.add.image(game.canvas.width/4, game.canvas.height*7/8,'empty'); 
        this.dcImage.setScale(game.canvas.height/921.6,game.canvas.height/921.6);
        this.dcImage.setAlpha(0);
        this.dcFrame = this.add.image(game.canvas.width/4, game.canvas.height*7/8,this.frameImages[Math.floor(Math.random()*this.frameImages.length)]); 
        this.dcFrame.setScale(game.canvas.height/1843.2,game.canvas.height/1843.2);
        this.dcFrame.setAlpha(0);
        this.dcText = this.add.text(this.dcFrame.x + this.dcFrame.displayWidth/2, game.canvas.height*7/8, 'A player left the game.', { fontSize: '40px', fontFamily: 'comic sans ms', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff'});
        this.dcText.setAlpha(0);
        this.dcFadeTween = this.tweens.add({
            targets: [this.dcImage, this.dcFrame, this.dcText],
            alpha: {from: 0, to: 1},
            duration: 2000,
            ease: 'Quad.easeOut',
            paused: true,
            yoyo: true
        });

        this.confirmVoteButton.setAlpha(0);
        this.cancelVoteButton.setAlpha(0);

        this.confirmVoteButton.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'VOTE';
            msg.playerVoted = this.players[this.scene.get('InGame').votedPlayerId].playerId;
            this.scene.get('InGame').votedIndicators[this.scene.get('InGame').votedPlayerId].setAlpha(1);
            game.global.socketDir.send(JSON.stringify(msg));
            this.scene.get('InGame').disableDrawings();
            this.scene.get('InGame').hideVoteButtons();
        }, this);

        this.cancelVoteButton.on('pointerdown', function (pointer){
            this.scene.get('InGame').denhanceImage();
        }, this);

        this.fakerImage = this.add.image(game.canvas.width/4, game.canvas.height*3/4,'empty'); 
        this.fakerImage.setScale(game.canvas.height/960.8,game.canvas.height/960.8);
        this.fakerImage.setAlpha(0);

        this.fakerFrame = this.add.image(game.canvas.width/4, game.canvas.height*3/4,this.frameImages[Math.floor(Math.random()*this.frameImages.length)]); 
        this.fakerFrame.setScale(game.canvas.height/960.8,game.canvas.height/960.8);
        this.fakerFrame.setAlpha(0);

        this.fakerPeekButton.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'PEEK';
            game.global.socketDir.send(JSON.stringify(msg));
            this.scene.get('InGame').fakerPeekButton.setAlpha(0);
            this.scene.get('InGame').fakerPeekButton.removeInteractive();
        }, this);

        this.hideDrawings();

        this.sent = false;
        this.randomize = true;
        this.maxTrazos = -1;
        this.canvas = new improCanvas(this, 256);
        this.frame = this.add.image(0, 0,'Marco1'); 
        this.canvas.hideCanvas();
        this.frame.setAlpha(0);
        this.button_clear.setAlpha(0);

        this.word = this.add.text(game.canvas.width/2 ,game.canvas.height/2, 'Waiting for other players...', {fontSize: '40px', fontFamily: 'comic sans ms', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff', align: 'center'}).setOrigin(0.5,0.5);
        this.gameMode = this.add.text(game.canvas.width/4 ,game.canvas.height/8, '', { fontSize: '40px', fontFamily: 'comic sans ms', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff'});
        this.inGameWord = this.add.text(game.canvas.width/2 ,game.canvas.height/12, '', {align: 'center', fontSize: '40px', fontFamily: 'comic sans ms', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff'}).setOrigin(0.5,0.5);
        this.roundText = this.add.text(game.canvas.width*6/8 ,game.canvas.height/12, '0/'+this.maxRounds, { fontSize: '40px', fontFamily: 'comic sans ms', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff'});
        this.strokesLeft = this.add.text(0 ,0, '', {align: 'center', fontSize: '30px', fontFamily: 'comic sans ms', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff' }).setOrigin(0.5,0.5);
        
        //Doble confirmacion
        this.DobleConfirmImg = this.add.image(0,0,'DobleConfirm'+game.global.languageSuffix).setInteractive();
        this.DobleConfirmImg.setAlpha(0);
        this.DobleConfirmYES = this.add.image(0,0,'DobleConfirmSi'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});
        this.DobleConfirmYES.setAlpha(0);
		this.DobleConfirmNO = this.add.image(0,0,'DobleConfirmNo'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});
        this.DobleConfirmNO.setAlpha(0);
        
        this.scaler();
        
        //Tweens
		this.button_clearTween = this.tweens.add({
			targets:[this.button_clear],
			scale: {from: this.button_clear.scale , to: this.button_clear.scale*0.9 },
			duration: 100,
			ease: 'Quad.easeout',
			paused: true,
			yoyo: true
        });
        
        this.DobleConfirmYESTween = this.tweens.add({
			targets:[this.DobleConfirmYES],
			scale: {from: this.DobleConfirmYES.scale , to: this.DobleConfirmYES.scale*0.9 },
			duration: 100,
			ease: 'Quad.easeout',
			paused: true,
			yoyo: true
        });

        this.button_backTween = this.tweens.add({
			targets:[this.button_back],
			scale: {from: this.button_back.scale , to: this.button_back.scale*0.9 },
			duration: 100,
			ease: 'Quad.easeout',
			paused: true,
			yoyo: true
        });

        this.button_clear.on('pointerdown', function (pointer){
            this.button_clearTween.play();
            this.canvas.clear();
            this.canvas.resetStrokes();
        }, this);
        
        this.DobleConfirmYES.on('pointerdown', function (pointer){
            this.DobleConfirmYESTween.play();
            game.global.socketDir.close();
            game.global.socketDir = undefined;
            this.cameras.main.fadeOut(200);
            this.cameras.main.once('camerafadeoutcomplete', function(camera) {
                this.scene.start('DisconnectOverlay', {message: 'You left the game.', toPrelobby: false});
            }, this);
        }, this);

        this.DobleConfirmNO.on('pointerdown', function (pointer){
            this.scene.get('InGame').doubleConfirmationController(1);
        }, this);

        this.button_back.on('pointerdown', function (pointer){
            this.button_backTween.play();
            this.scene.get('InGame').doubleConfirmationController(0);
        }, this);


        this.cameras.main.fadeIn(200);
        let msg2 = new Object();
        msg2.event = 'GAME_LOADED';
        game.global.socketDir.send(JSON.stringify(msg2));
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

    doubleConfirmationController(t)
    {
        switch(t)
        {
            case 0:
                this.DobleConfirmImg.setAlpha(1);
                this.DobleConfirmYES.setAlpha(1);
                this.DobleConfirmNO.setAlpha(1);
                this.button_back.setAlpha(0);
                break;
            case 1:
                this.DobleConfirmImg.setAlpha(0);
                this.DobleConfirmYES.setAlpha(0);
                this.DobleConfirmNO.setAlpha(0);
                this.button_back.setAlpha(1);
                break;
        }
    }

    limitPaintingStrokes(num)
    {
        this.maxTrazos = num;
        this.strokesLeft.text = ((game.global.languageSuffix === '_en')?'Strokes left: ':'Trazos restantes: ') + this.maxTrazos;
    }

    gamemodeIcon(type, x, y, scale, isActive)
    {
        this.iconoDefaultImg.setAlpha(false);
        this.iconoBlindImg.setAlpha(false);
        this.iconoLimitImg.setAlpha(false);
        this.iconoOneImg.setAlpha(false);
        this.iconoGrowingImg.setAlpha(false);
        if(!isActive) return;
        switch(type){
            case 'default':
                this.iconoDefaultImg.x = x;
                this.iconoDefaultImg.y = y;
                this.iconoDefaultImg.setScale(scale);
                this.iconoDefaultImg.setAlpha(true);
                break;
            case 'blind':
                this.iconoBlindImg.x = x;
                this.iconoBlindImg.y = y;
                this.iconoBlindImg.setScale(scale);
                this.iconoBlindImg.setAlpha(true);
                break;
            case 'limit':
                this.iconoLimitImg.x = x;
                this.iconoLimitImg.y = y;
                this.iconoLimitImg.setScale(scale);
                this.iconoLimitImg.setAlpha(true);
                if(this.roundState === 1)
                {
                    this.strokesLeft.x = this.canvas.getX();
                    this.strokesLeft.y = this.canvas.getY()-150;
                    this.strokesLeft.setAlpha(1);
                    this.strokesLeft.text = ((game.global.languageSuffix === '_en')?'Strokes left: ':'Trazos restantes: ') + this.maxTrazos;
                }
                break;
            case 'one':
                this.iconoOneImg.x = x;
                this.iconoOneImg.y = y;
                this.iconoOneImg.setScale(scale);
                this.iconoOneImg.setAlpha(true);
                break;
            case 'growing':
                this.iconoGrowingImg.x = x;
                this.iconoGrowingImg.y = y;
                this.iconoGrowingImg.setScale(scale);
                this.iconoGrowingImg.setAlpha(true);
                break;
        }
    }

    clockAnimControl(i)
    {
        console.log(!this.inVotingPhase +' - '+ i);
        if(!this.inVotingPhase && i)
        {
            //this.gamemodeIcon('',0,0,0,false);
            this.TimeAnim.anims.play('Clock_Anim', true);
            this.inVotingPhase = true;
        }
    }

    criticoScaler()
    {
        if(this.roundState == 1)
        {
            this.gamemodeIcon(this.roundGamemode, game.canvas.width / 4, game.canvas.height / 8, this.sY*0.8, true);
            this.TimeAnim.setAlpha(1);
            this.timerText.setAlpha(1);
            this.TimeAnim.anims.play('Clock_Anim', true);
            this.inVotingPhase = false;
        }else
        {
            if(this.roundState == 2)
            {
                this.gamemodeIcon(this.roundGamemode, game.canvas.width / 4, game.canvas.height / 8, this.sY*0.8, true);
                this.gamemodeIcon('',0,0,0,false);
            }else //roundState == 0
            {
                this.TimeAnim.setAlpha(0);
                this.timerText.setAlpha(0);
                this.CriticoLejosImg.x = game.canvas.width * 3/ 8;
                this.CriticoLejosImg.y = game.canvas.height * 6/8;
                this.CriticoLejosImg.setScale(this.sY);

                let kbLTCornerX = (this.CriticoLejosImg.x-(this.CriticoLejosImg.width*this.CriticoLejosImg.scaleX)/2);
                let kbLTCornerY = (this.CriticoLejosImg.y-(this.CriticoLejosImg.height*this.CriticoLejosImg.scaleY)/2);
                let columnPos = this.CriticoLejosImg.width*this.CriticoLejosImg.scaleX/20;
                let rowPos = this.CriticoLejosImg.height*this.CriticoLejosImg.scaleY/20;

                this.word.x = kbLTCornerX+columnPos*16;
                this.word.y = kbLTCornerY+rowPos*3;
                this.word.setScale(this.sY);

                this.gamemodeIcon(this.roundGamemode, kbLTCornerX+columnPos*17, kbLTCornerY+rowPos*-1, this.sY*0.8, true);
            }
        }
    }

    scaler()
    {
        //Buttons
        
        this.fakerPeekButton.x = game.canvas.width / 4;
        this.fakerPeekButton.y = game.canvas.height / 2;
        this.fakerPeekButton.setScale(this.sY);

        this.button_clear.x = game.canvas.width/2 + this.frame.displayWidth*0.6;
        this.button_clear.y = game.canvas.height/2 + this.frame.displayHeight*0.3;
        this.button_clear.setScale(this.sY);

        this.criticoScaler();
        
        this.TimeAnim.x = game.canvas.width * 3 / 40;
        this.TimeAnim.y = game.canvas.height * 5 / 40;
        this.TimeAnim.setScale(this.sY);

        this.timerText.x = game.canvas.width * 2.5 / 40;
        this.timerText.y = game.canvas.height * 8.7 / 40;
        this.timerText.setScale(this.sY);

        /*this.inGameWord.x = game.canvas.width * 13 / 16;
        this.inGameWord.y = game.canvas.height * 3 / 8;
        this.inGameWord.setScale(this.sY*2);
        this.inGameWord.setWordWrapWidth(game.canvas.width / 4);*/
        this.inGameWord.x = game.canvas.width / 2;
        this.inGameWord.y = game.canvas.height * 29 / 32;
        this.inGameWord.setScale(this.sY*2);

        this.roundText.x = game.canvas.width * 6 / 8;
        this.roundText.y = game.canvas.height / 12;
        this.roundText.setScale(this.sY);

        this.button_back.x = game.canvas.width / 10;
        this.button_back.y = game.canvas.height * 9 /10;
        this.button_back.setScale(this.sY);

        //Doble confirmacion
        this.DobleConfirmImg.x = game.canvas.width / 2;
        this.DobleConfirmImg.y = game.canvas.height / 2;
        this.DobleConfirmImg.setScale(this.sY/2);

        let kbLTCornerX = (this.DobleConfirmImg.x-(this.DobleConfirmImg.width*this.DobleConfirmImg.scaleX)/2)+0;
        let kbLTCornerY = (this.DobleConfirmImg.y-(this.DobleConfirmImg.height*this.DobleConfirmImg.scaleY)/2)+0;
        let columnPos = this.DobleConfirmImg.width*this.DobleConfirmImg.scaleX/20;
        let rowPos = this.DobleConfirmImg.height*this.DobleConfirmImg.scaleY/20;

        this.DobleConfirmYES.x = kbLTCornerX+columnPos*5;
        this.DobleConfirmYES.y = kbLTCornerY+rowPos*15;
        this.DobleConfirmYES.setScale(this.sY/3);

        this.DobleConfirmNO.x = kbLTCornerX+columnPos*15;
        this.DobleConfirmNO.y = kbLTCornerY+rowPos*15;
        this.DobleConfirmNO.setScale(this.sY/3);

        //Background
        this.bg.x = game.canvas.width / 2;
		this.bg.y = game.canvas.height / 2;
        this.bg.setScale(Math.max(this.sX, this.sY));

        //Votes
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.drawings[i+j*3].x = game.canvas.width/2 + ((0.3*game.canvas.height)*(i-1));
                this.drawings[i+j*3].y = game.canvas.height/2 + ((0.3*game.canvas.height)*(j-1));
                this.drawings[i+j*3].setScale(game.canvas.height/1177.6,game.canvas.height/1177.6);
                this.frames[i+j*3].x =game.canvas.width/2 + ((0.3*game.canvas.height)*(i-1)); 
                this.frames[i+j*3].y =game.canvas.height/2 + ((0.3*game.canvas.height)*(j-1)); 
                this.frames[i+j*3].setScale(game.canvas.height/1177.6,game.canvas.height/1177.6);
                this.votes[i+j*3].x = game.canvas.width/2 + ((0.3*game.canvas.height)*(i-1));
                this.votes[i+j*3].y = game.canvas.height/2 + ((0.3*game.canvas.height)*(j-1)) + (0.15*game.canvas.height);
                this.votes[i+j*3].setScale(this.sY);
                this.votedIndicators[i+j*3].x = this.drawings[i+j*3].x + this.drawings[i+j*3].displayWidth/2;
                this.votedIndicators[i+j*3].y = this.drawings[i+j*3].y - this.drawings[i+j*3].displayHeight/2;
                this.votedIndicators[i+j*3].setScale(this.sY/8);
                
                this.pictures[i+j*3].x = this.drawings[i+j*3].x;
                this.pictures[i+j*3].y = this.drawings[i+j*3].y;
                this.pictures[i+j*3].setScale(this.drawings[i+j*3].scaleX*2, this.drawings[i+j*3].scaleY*2);

                this.crowns[i+j*3].x = this.frames[i+j*3].x - this.frames[i+j*3].displayWidth/2; 
                this.crowns[i+j*3].y =this.frames[i+j*3].y - this.frames[i+j*3].displayHeight/2; 
                this.crowns[i+j*3].setScale(this.sY/3);
            }
        }

        this.bigImage.x = game.canvas.width/2; 
        this.bigImage.y = game.canvas.height/2; 
        this.bigImage.setScale(game.canvas.height/460.8,game.canvas.height/460.8);

        this.bigFrame.x = game.canvas.width/2; 
        this.bigFrame.y = game.canvas.height/2; 
        this.bigFrame.setScale(game.canvas.height/460.8,game.canvas.height/460.8);
        
        this.confirmVoteButton.setScale(this.sX/3);
        this.confirmVoteButton.x = this.bigFrame.x+(this.bigFrame.displayWidth/2)+(this.confirmVoteButton.displayWidth/2);
        this.confirmVoteButton.y = this.bigFrame.y + (this.bigFrame.displayHeight/2) - (this.confirmVoteButton.displayHeight/2);
        
        this.cancelVoteButton.x = this.bigFrame.x + this.bigFrame.displayWidth*0.4;
        this.cancelVoteButton.y = this.bigFrame.y - this.bigFrame.displayHeight*0.4;
        this.cancelVoteButton.setScale(this.sY);

        //Disconnecting player
        this.dcImage.x = game.canvas.width/4;
        this.dcImage.y = game.canvas.height*7/8;
        this.dcImage.setScale(game.canvas.height/921.6,game.canvas.height/921.6);
        this.dcFrame.x = game.canvas.width/4;
        this.dcFrame.y = game.canvas.height*7/8
        this.dcFrame.setScale(game.canvas.height/1843.2,game.canvas.height/1843.2);
        this.dcText.x = this.dcFrame.x + this.dcFrame.displayWidth/2;
        this.dcText.y = game.canvas.height*7/8;
        this.dcText.setScale(this.sY);

        this.frame.x = game.canvas.width/2;
        this.frame.y = game.canvas.height/2;
        this.frame.setScale(1);

        this.fakerImage.x = game.canvas.width/6; 
        this.fakerImage.y = game.canvas.height*5/8; 
        this.fakerImage.setScale(game.canvas.height/960.8,game.canvas.height/960.8);
        
        this.fakerFrame.x = this.fakerImage.x;
        this.fakerFrame.y = this.fakerImage.y;
        this.fakerFrame.setScale(game.canvas.height/960.8,game.canvas.height/960.8);
    }

    enhanceImage(id) {
        this.votedPlayerId = id;
        this.bigImage.setTexture(this.players[id].playerId+'r'); 
        this.bigFrame.setTexture(this.frames[id].texture);

        this.disableDrawings();
        this.showVoteButtons();
    }

    denhanceImage() {
        this.enableDrawings();
        this.hideVoteButtons();
    }

    showVoteButtons() {
        if (!this.roundFaker) {
            this.confirmVoteButton.setInteractive({cursor: 'pointer'});
            this.confirmVoteButton.setAlpha(1);
        }
        this.cancelVoteButton.setInteractive({cursor: 'pointer'});
        this.cancelVoteButton.setAlpha(1);
        this.bigImage.setAlpha(1);
        this.bigFrame.setAlpha(1);
    }

    hideVoteButtons() {
        this.confirmVoteButton.removeInteractive();
        this.confirmVoteButton.setAlpha(0);
        this.cancelVoteButton.removeInteractive();
        this.cancelVoteButton.setAlpha(0);
        this.bigImage.setAlpha(0);
        this.bigFrame.setAlpha(0);
    }

    showWord(word, faker, drawMode) {
        this.strokesLeft.setAlpha(0);
        this.roundState = 0;
        this.roundGamemode = drawMode;
        this.criticoScaler();
        this.roundWord = word;
        this.roundFaker = faker;
        this.canvas.setDrawMode(drawMode);
        this.hideDrawings();
        this.CriticoLejosImg.setAlpha(1);
        this.button_clear.setInteractive({cursor: 'pointer'})
        this.inGameWord.text = '';
        if (!this.roundFaker) {
            this.word.text = (game.global.languageSuffix === '_en')?('YOUR WORD IS:\n'+this.roundWord):('TU PALABRA ES:\n'+this.roundWord);
        } else {
            this.word.text = (game.global.languageSuffix === '_en')?'YOU ARE THE FAKER\nTIME TO IMPROVISE!':'ERES EL IMPROVISADOR\n¡A IMPROVISAR!';
        }
        this.gameMode.text = '';
        if (!this.roundFaker) {
            this.fakerImage.setAlpha(0);
            this.fakerFrame.setAlpha(0);
            this.fakerPeekButton.setAlpha(0);
            this.fakerPeekButton.removeInteractive();
        }
    }

    drawStart(time, round, vocals) {
        this.roundState = 1;
        this.criticoScaler();
        if (!this.roundFaker) {
            this.inGameWord.text = this.roundWord;
        } else {
            this.manageWord(time, vocals);
        }
        this.word.text = '';
        this.CriticoLejosImg.setAlpha(0);
        this.timerText.text = time;
        this.maxTime = time;
        this.curRound = round;
        this.roundText.text = this.curRound+'/'+this.maxRounds;
        this.canvas.clear();
        this.canvas.fadeStatus = -1;
        this.canvas.showCanvas();
        this.frame.setAlpha(1);
        this.button_clear.setAlpha(1);
    }

    updateTime(time) {
        this.timerText.text = time;
        if(time/this.maxTime < 0.5 && this.canvas.fadeStatus === -1) this.canvas.fadeStatus = 0;
        this.updateWord(time);
        if (time === Math.floor(this.maxTime/2) && this.roundFaker && !this.canvas.hidden) {
            this.fakerPeekButton.setAlpha(1);
            this.fakerPeekButton.setInteractive({cursor: 'pointer'});
        }
    }

    roundOver() {
        //shuffle players array using Fisher-Yates
        let m = this.players.length;
        let t;
        let i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = this.players[m];
            this.players[m] = this.players[i];
            this.players[i] = t;
        }
        this.roundState = 2;
        this.criticoScaler();
        this.inGameWord.text = this.roundWord;
        this.canvas.hideCanvas();
        this.frame.setAlpha(0);
        this.fakerFrame.setAlpha(0);
        this.fakerImage.setAlpha(0);
        this.fakerPeekButton.setAlpha(0);
        this.fakerPeekButton.removeInteractive();
        this.strokesLeft.setAlpha(0);
        
        this.button_clear.setAlpha(0);
        this.button_clear.removeInteractive();
        
        let msg = new Object();
        msg.event = 'SEND_IMAGE';
        msg.image = this.canvas.toString();
        game.global.socketDir.send(JSON.stringify(msg));

        //fade (maybe not)
    }
    bePeeked() {
        let msg = new Object();
        msg.event = 'BE_PEEKED_RETURN';
        msg.image = this.canvas.toString();
        game.global.socketDir.send(JSON.stringify(msg));
    }

    peekReturn(image) {
        if (this.textures.exists('peekImage')) {
            this.textures.get('peekImage').destroy();
        }
        improCanvas.makeTexture('peekImage', image, this, 256);

        this.fakerImage.setTexture('peekImage'); 
        
        this.fakerImage.setAlpha(1);
        this.fakerFrame.setAlpha(1);
    }

    manageWord(maxTime, vocals) {
        let size = this.roundWord.length;
        this.wordBoolArray = new Array(size);
        this.wordPositionArray = [];
        for (let i = 0; i < size; i++) {
            if (this.roundWord[i] === ' ') {
                this.wordBoolArray[i] = true;
            } else {
                this.wordBoolArray[i] = false;

                if (this.roundWord[i].toUpperCase() !== 'A' && this.roundWord[i].toUpperCase() !== 'E' && this.roundWord[i].toUpperCase() !== 'I' && this.roundWord[i].toUpperCase() !== 'O' && this.roundWord[i].toUpperCase() !== 'U' && this.roundWord[i].toUpperCase() !== 'Á' && this.roundWord[i].toUpperCase() !== 'É' && this.roundWord[i].toUpperCase() !== 'Í' && this.roundWord[i].toUpperCase() !== 'Ó' && this.roundWord[i].toUpperCase() !== 'Ú' && this.roundWord[i].toUpperCase() !== 'Ü') {
                    this.wordPositionArray.push(i)
                }else
                {
                    if(vocals)
                        this.wordPositionArray.push(i)
                }
            }
        }

        this.wordTimeArray = new Array(this.wordPositionArray.length);
        let timeFactor = (3*maxTime)/(4*this.wordPositionArray.length);
        for (let i = 0; i < this.wordTimeArray.length; i++) {
            this.wordTimeArray[i] = maxTime - ((i+1)*timeFactor);
        }
        this.wordTimeArray.reverse();
        console.log(this.wordTimeArray);
        this.drawWord();
    }

    updateWord(curTime) {
        if (this.wordTimeArray.length === 0) return;

        while (this.wordTimeArray[this.wordTimeArray.length-1] > curTime) {
            let i = this.wordPositionArray.splice(Math.random()*this.wordPositionArray.length,1);
            this.wordTimeArray.pop();
            this.wordBoolArray[i] = true;
            if (this.wordTimeArray.length === 0) break;
        }
        this.drawWord();
    }

    drawWord() {
        let word = '';
        for (let i = 0; i < this.wordBoolArray.length; i++) {
            word += this.wordBoolArray[i]?this.roundWord[i]:'-';
        }
        this.inGameWord.text = word;
    }



    hideDrawings() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.players[i+j*3] !== undefined) {
                    this.drawings[i+j*3].setTexture('empty');
                    this.drawings[i+j*3].removeInteractive();
                    this.drawings[i+j*3].setAlpha(0);
                    this.pictures[i+j*3].setAlpha(0);
                    this.crowns[i+j*3].setAlpha(0);
                    this.frames[i+j*3].setAlpha(0);
                    this.votes[i+j*3].text = '';
                    this.votedIndicators[i+j*3].setAlpha(0);
                }
            }
        }
    }
    disableDrawings() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.players[i+j*3] !== undefined)
                    this.drawings[i+j*3].removeInteractive();
            }
        }
    }
    enableDrawings() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.players[i+j*3] !== undefined && this.selfPlayer !== this.players[i+j*3].playerId)
                    this.drawings[i+j*3].setInteractive({cursor: 'pointer'});
            }
        }
    }

    updateDrawing(player, drawing, isSelf) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.players[i+j*3] !== undefined) {
                    if (player === this.players[i+j*3].playerId) {

                        this.drawings[i+j*3].setTexture('empty'); 
                        if (this.textures.exists(player+'r')) {
                            this.textures.get(player+'r').destroy();
                        }
                        improCanvas.makeTexture(player+'r', drawing, this, 256);

                        this.drawings[i+j*3].setTexture(player+'r'); 
                        this.drawings[i+j*3].setTint(0xFFFFFF);
                        
                        this.drawings[i+j*3].setAlpha(1);
                        this.frames[i+j*3].setAlpha(1);

                        this.votedIndicators[i+j*3].x = this.drawings[i+j*3].x + this.drawings[i+j*3].displayWidth/2;
                        this.votedIndicators[i+j*3].y = this.drawings[i+j*3].y - this.drawings[i+j*3].displayHeight/2;

                        if (!isSelf) {
                            this.drawings[i+j*3].setInteractive({cursor: 'pointer'});
                        } else {
                            this.selfPlayer = player;
                            this.drawings[i+j*3].removeInteractive();
                        }
                    }
                }
                
                    
            }
        }
    }
    
    updateVoteResults(msg) {
        this.TimeAnim.anims.stopOnRepeat();
        this.denhanceImage();
        this.disableDrawings();
        let playerVotes = new Array(msg.players);
        for (let i = 0; i < playerVotes.length; i++) {
            eval('playerVotes[msg.id_'+i+'] = msg.votes_'+i); //eval shouldn't be a problem here, hopefully
        }
        console.log(playerVotes);

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.players[i+j*3] !== undefined) {
                    if (playerVotes[this.players[i+j*3].playerId] !== undefined) {
                        this.votes[i+j*3].text = playerVotes[this.players[i+j*3].playerId];
                        if (msg.faker === this.players[i+j*3].playerId) {
                            this.drawings[i+j*3].setTint(0xff8888);
                        }
                    }
                }
            }
        }

    }

    playerLeft(image) {
        if (this.textures.exists('playerDc')) {
            this.textures.get('playerDc').destroy();
        }
        improCanvas.makeTexture('playerDc', image, this, 128);

        this.dcImage.setTexture('playerDc'); 
        
        this.dcFadeTween.restart();
        this.dcFadeTween.play();
    }

    showPlayerScores(playerArray) {
        let topScore = 0;
        for (let p in playerArray) {
            if (playerArray[p].score > topScore) topScore = playerArray[p].score;
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let p in playerArray) {
                    if (this.players[i+j*3] !== undefined && playerArray[p] !== undefined) {
                        if (playerArray[p].playerId === this.players[i+j*3].playerId) {
                            //generate profile pic textures and replace them
                            this.pictures[i+j*3].setTexture(this.players[i+j*3].playerId); 
                            this.drawings[i+j*3].setAlpha(0);
                            this.pictures[i+j*3].setAlpha(1);
                            //replace text with score stuff
                            let diff = playerArray[p].score - playerArray[p].oldScore;
                            this.votes[i+j*3].text = playerArray[p].score + ' (' + (( playerArray[p].score < playerArray[p].oldScore)?('-'):('+')) + Math.abs(diff) + ')';
                            
                            if (playerArray[p].score === topScore) {
                                this.crowns[i+j*3].setAlpha(1);
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    writeRoomCode(roomCode)
    {
        this.add.text(10, 10, roomCode, { fontSize: '40px', fontFamily: 'comic sans ms', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff'});
    }
}
var joinRoomOnce = false;