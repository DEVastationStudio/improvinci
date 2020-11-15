'use strict';

class Lobby extends Phaser.Scene {
    constructor() {
        super('Lobby');
    }
    preload() {

    }

    create(data) {
        //Scale factors
        this.sX = game.canvas.width/game.global.WIDTH;
        this.sY = game.canvas.height/game.global.HEIGHT;

        //Background
        this.bg = this.add.image(0,0,'Menu').setInteractive();

        //Buttons
        this.button_start = this.add.image(0,0, 'Ready_host_es');
        this.button_start.setAlpha(0.5);
        this.button_back = this.add.image(0,0, '').setInteractive({cursor: 'pointer'});
        this.button_Options = this.add.image(0,0, 'Ready_host_es');
        this.button_Options.setAlpha(0);

        //if (data.leader) {
        let msg = new Object();
        msg.event = 'ALL_READY';
        game.global.socketDir.send(JSON.stringify(msg));
        //}

        
        
		this.button_start.on('pointerdown', function (pointer){
            let msg2 = new Object();
            msg2.event = 'START_GAME';
            game.global.socketDir.send(JSON.stringify(msg2));
            this.button_start.removeInteractive();
        }, this);

        this.button_Options.on('pointerdown', function (pointer){
            this.scene.get('Lobby').invisible(true);
            let msg = new Object();
            msg.event = 'GET_CONFIG_ROOM';
            game.global.socketDir.send(JSON.stringify(msg)); 
        }, this);
        
        this.add.text(game.canvas.width/2, 10, data.code, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        
        this.avatars = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (data.players[i+j*3] !== undefined) {
                    if (this.textures.exists(data.players[i+j*3].playerId)) {
                        this.textures.get(data.players[i+j*3].playerId).destroy();
                    }

                    improCanvas.makeTexture(data.players[i+j*3].playerId, data.players[i+j*3].picture, this, 128);
                    this.avatars[i+j*3] = this.add.image(game.canvas.width/2 + (140*(i-1)),  game.canvas.height/2 + (140*(j-1)),data.players[i+j*3].playerId); 
                } else {
                    this.avatars[i+j*3] = this.add.image(game.canvas.width/2 + (140*(i-1)),  game.canvas.height/2 + (140*(j-1)),''); 
                }
            }
        }

         //Options
         this.keyBoardBg = this.add.image(0,0,'Gameplay');
         this.BlindImg = this.add.image(0,0,'Blind').setInteractive({cursor: 'pointer'});
         this.DefaultImg = this.add.image(0,0,'Default').setInteractive({cursor: 'pointer'});
         this.DificilImg = this.add.image(0,0,'Dificil').setInteractive({cursor: 'pointer'});
         this.FacilImg = this.add.image(0,0,'Facil').setInteractive({cursor: 'pointer'});
         this.GrowingImg = this.add.image(0,0,'Growing').setInteractive({cursor: 'pointer'});
         this.LimitImg = this.add.image(0,0,'Limit').setInteractive({cursor: 'pointer'});
         this.ModosImg = this.add.image(0,0,'Modos').setInteractive({cursor: 'pointer'});
         this.NumRondasImg = this.add.image(0,0,'NumRondas').setInteractive({cursor: 'pointer'});
         this.OneImg = this.add.image(0,0,'One').setInteractive({cursor: 'pointer'});
         this.RondaImg = this.add.image(0,0,'Ronda').setInteractive({cursor: 'pointer'});
         this.TiemposImg = this.add.image(0,0,'Tiempos').setInteractive({cursor: 'pointer'});
         this.VotacionImg = this.add.image(0,0,'Votacion').setInteractive({cursor: 'pointer'});
         this.SalirCod = this.add.image(0,0,'SalirCod').setInteractive({cursor: 'pointer'});

         //Checks modos
         //----NoChecks
         this.DefaultTickNoCheck = this.add.image(0,0,'TickNoCheck').setInteractive({cursor: 'pointer'});
         this.BlindTickNoCheck = this.add.image(0,0,'TickNoCheck').setInteractive({cursor: 'pointer'});
         this.LimitTickNoCheck = this.add.image(0,0,'TickNoCheck').setInteractive({cursor: 'pointer'});
         this.OneTickNoCheck = this.add.image(0,0,'TickNoCheck').setInteractive({cursor: 'pointer'});
         this.GrowingTickNoCheck = this.add.image(0,0,'TickNoCheck').setInteractive({cursor: 'pointer'});
         //----Checks
         this.DefaultTickCheck = this.add.image(0,0,'TickCheck').setInteractive({cursor: 'pointer'});
         this.BlindTickCheck = this.add.image(0,0,'TickCheck').setInteractive({cursor: 'pointer'});
         this.LimitTickCheck = this.add.image(0,0,'TickCheck').setInteractive({cursor: 'pointer'});
         this.OneTickCheck = this.add.image(0,0,'TickCheck').setInteractive({cursor: 'pointer'});
         this.GrowingTickCheck = this.add.image(0,0,'TickCheck').setInteractive({cursor: 'pointer'});

         //MasMenos Configuracion Ronda
         this.NumRondasMas = this.add.image(0,0,'Mas').setInteractive({cursor: 'pointer'});
         this.NumRondasMenos = this.add.image(0,0,'Menos').setInteractive({cursor: 'pointer'});
         this.NumRondasText = this.add.text(0, 0, '--', { fontSize: '60px',color: '#000000',fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
         this.TiempoRondasMas = this.add.image(0,0,'Mas').setInteractive({cursor: 'pointer'});
         this.TiempoRondasMenos = this.add.image(0,0,'Menos').setInteractive({cursor: 'pointer'});
         this.TiempoRondasText = this.add.text(0, 0, '--', { fontSize: '60px',color: '#000000',fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
         this.TiempoVotacionMas = this.add.image(0,0,'Mas').setInteractive({cursor: 'pointer'});
         this.TiempoVotacionMenos = this.add.image(0,0,'Menos').setInteractive({cursor: 'pointer'});
         this.TiempoVotacionText = this.add.text(0, 0, '--', { fontSize: '60px',color: '#000000',fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
         //this.Mas = this.add.image(0,0,'Mas').setInteractive();
         //this.Menos = this.add.image(0,0,'Menos').setInteractive();

         this.invisible(false);
         this.scaler();

         //Config Actions
         this.SalirCod.on('pointerdown', function (pointer){
            this.scene.get('Lobby').invisible(false);
        }, this);
         //---DefaultChecks
         this.DefaultTickCheck.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'NOCHECK';
            msg.type = 'Default';
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);
        this.DefaultTickNoCheck.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'CHECK';
            msg.type = 'Default';
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);

        //---BlindChecks
        this.BlindTickCheck.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'NOCHECK';
            msg.type = 'Blind';
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);
        this.BlindTickNoCheck.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'CHECK';
            msg.type = 'Blind';
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);

        //---LimitChecks
        this.LimitTickCheck.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'NOCHECK';
            msg.type = 'Limit';
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);
        this.LimitTickNoCheck.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'CHECK';
            msg.type = 'Limit';
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);

        //---OneChecks
        this.OneTickCheck.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'NOCHECK';
            msg.type = 'One';
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);
        this.OneTickNoCheck.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'CHECK';
            msg.type = 'One';
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);

        //---GrowingChecks
        this.GrowingTickCheck.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'NOCHECK';
            msg.type = 'Growing';
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);
        this.GrowingTickNoCheck.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'CHECK';
            msg.type = 'Growing';
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);
        
        //MasMenosOptions
        //---NumRondas
        this.NumRondasMenos.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'NUMRONDAS';
            msg.type = false;
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);
        this.NumRondasMas.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'NUMRONDAS';
            msg.type = true;
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);

        //---TiempoRonda
        this.TiempoRondasMenos.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'ROUNDTIME';
            msg.type = false;
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);
        this.TiempoRondasMas.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'ROUNDTIME';
            msg.type = true;
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);

        //---TiempoVotacion
        this.TiempoVotacionMenos.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'VOTETIME';
            msg.type = false;
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);
        this.TiempoVotacionMas.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'VOTETIME';
            msg.type = true;
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);
    }

    plusControls(type, info)
    {
        switch(type)
        {
            case 'numRounds':
                this.NumRondasText.text = info;
                break;
            case 'roundTime':
                this.TiempoRondasText.text = info;
                break;
            case 'voteTime':
                this.TiempoVotacionText.text = info;
                break;
        }
    }

    check(type, isChecked)
    {
        switch(type)
        {
            case 'Default':
                if(isChecked)
                {
                    this.DefaultTickCheck.setAlpha(1)
                    this.DefaultTickCheck.setInteractive({cursor: 'pointer'})
                    this.DefaultTickNoCheck.setAlpha(0)
                    this.DefaultTickNoCheck.removeInteractive();
                }else
                {
                    this.DefaultTickCheck.setAlpha(0)
                    this.DefaultTickCheck.removeInteractive();
                    this.DefaultTickNoCheck.setAlpha(1)
                    this.DefaultTickNoCheck.setInteractive({cursor: 'pointer'})
                }
                break;
            case 'Blind':
                if(isChecked)
                {
                    this.BlindTickCheck.setAlpha(1)
                    this.BlindTickCheck.setInteractive({cursor: 'pointer'})
                    this.BlindTickNoCheck.setAlpha(0)
                    this.BlindTickNoCheck.removeInteractive();
                }else
                {
                    this.BlindTickCheck.setAlpha(0)
                    this.BlindTickCheck.removeInteractive();
                    this.BlindTickNoCheck.setAlpha(1)
                    this.BlindTickNoCheck.setInteractive({cursor: 'pointer'})
                }
                break;
            case 'Limit':
                if(isChecked)
                {
                    this.LimitTickCheck.setAlpha(1)
                    this.LimitTickCheck.setInteractive({cursor: 'pointer'})
                    this.LimitTickNoCheck.setAlpha(0)
                    this.LimitTickNoCheck.removeInteractive();
                }else
                {
                    this.LimitTickCheck.setAlpha(0)
                    this.LimitTickCheck.removeInteractive();
                    this.LimitTickNoCheck.setAlpha(1)
                    this.LimitTickNoCheck.setInteractive({cursor: 'pointer'})
                }
                break;
            case 'One':
                if(isChecked)
                {
                    this.OneTickCheck.setAlpha(1)
                    this.OneTickCheck.setInteractive({cursor: 'pointer'})
                    this.OneTickNoCheck.setAlpha(0)
                    this.OneTickNoCheck.removeInteractive();
                }else
                {
                    this.OneTickCheck.setAlpha(0)
                    this.OneTickCheck.removeInteractive();
                    this.OneTickNoCheck.setAlpha(1)
                    this.OneTickNoCheck.setInteractive({cursor: 'pointer'})
                }
                break;
            case 'Growing':
                if(isChecked)
                {
                    this.GrowingTickCheck.setAlpha(isChecked)
                    this.GrowingTickCheck.setInteractive({cursor: 'pointer'})
                    this.GrowingTickNoCheck.setAlpha(!isChecked)
                    this.GrowingTickNoCheck.removeInteractive();
                }else
                {
                    this.GrowingTickCheck.setAlpha(0)
                    this.GrowingTickCheck.removeInteractive();
                    this.GrowingTickNoCheck.setAlpha(1)
                    this.GrowingTickNoCheck.setInteractive({cursor: 'pointer'})
                }
                break;
        }
    }

    /*showHideStart(leader) {
        (leader)?this.button_start.setInteractive({cursor: 'pointer'}):this.button_start.removeInteractive();
        this.button_start.visible = leader;
    }*/
    showHideStart(leader, players) {
        if (leader) {
            if (players >= 3) {
                this.button_start.setInteractive({cursor: 'pointer'});
                this.button_start.setAlpha(1);
            } else {
                this.button_start.removeInteractive();
                this.button_start.setAlpha(0.5);
            }
            this.button_Options.setInteractive({cursor: 'pointer'})
            this.button_Options.setAlpha(1)
        } else {
            this.button_start.removeInteractive();
            this.button_start.setAlpha(0);
            this.button_Options.removeInteractive()
            this.button_Options.setAlpha(0)
        }
    }
    
    update() { 
        if(this.sX != game.canvas.width/game.global.WIDTH || this.sY != game.canvas.height/game.global.HEIGHT)
		{
			this.sX = game.canvas.width/game.global.WIDTH;
			this.sY = game.canvas.height/game.global.HEIGHT;
			this.scaler();
		}
    }

    setInfo(defaultM, blindM, limitM, oneM, growingM, numRoundsM, roundTimeM, voteTimeM)
    {
        this.check('Default', defaultM);
        this.check('Blind', blindM);
        this.check('Limit',limitM);
        this.check('One',oneM);
        this.check('Growing',growingM);
        this.NumRondasText.text = numRoundsM;
        this.TiempoRondasText.text = roundTimeM;
        this.TiempoVotacionText.text = voteTimeM;
    }

    invisible(isVisible)
    {
        //Checks modes
        //----NoChecks
        this.DefaultTickNoCheck.setAlpha(isVisible);
        this.BlindTickNoCheck.setAlpha(isVisible);
        this.LimitTickNoCheck.setAlpha(isVisible);
        this.OneTickNoCheck.setAlpha(isVisible);
        this.GrowingTickNoCheck.setAlpha(isVisible);
        //----Checks
        this.DefaultTickCheck.setAlpha(isVisible);
        this.BlindTickCheck.setAlpha(isVisible);
        this.LimitTickCheck.setAlpha(isVisible);
        this.OneTickCheck.setAlpha(isVisible);
        this.GrowingTickCheck.setAlpha(isVisible);

        this.keyBoardBg.setAlpha(isVisible);
        this.BlindImg.setAlpha(isVisible);
        this.DefaultImg.setAlpha(isVisible);
        this.DificilImg.setAlpha(isVisible);
        this.FacilImg.setAlpha(isVisible);
        this.GrowingImg.setAlpha(isVisible);
        this.LimitImg.setAlpha(isVisible);
        this.ModosImg.setAlpha(isVisible);
        this.NumRondasImg.setAlpha(isVisible);
        this.OneImg.setAlpha(isVisible);
        this.RondaImg.setAlpha(isVisible);
        this.TiemposImg.setAlpha(isVisible);
        this.VotacionImg.setAlpha(isVisible);
        this.SalirCod.setAlpha(isVisible);

         
         //Checks modos
        //----NoChecks
        this.DefaultTickNoCheck.setAlpha(isVisible);
        this.BlindTickNoCheck.setAlpha(isVisible);
        this.LimitTickNoCheck.setAlpha(isVisible);
        this.OneTickNoCheck.setAlpha(isVisible);
        this.GrowingTickNoCheck.setAlpha(isVisible);
        //----Checks
        this.DefaultTickCheck.setAlpha(isVisible);
        this.BlindTickCheck.setAlpha(isVisible);
        this.LimitTickCheck.setAlpha(isVisible);
        this.OneTickCheck.setAlpha(isVisible);
        this.GrowingTickCheck.setAlpha(isVisible);

         //MasMenos Configuracion Ronda
         this.NumRondasMas.setAlpha(isVisible);
         this.NumRondasMenos.setAlpha(isVisible);
         this.NumRondasText.setAlpha(isVisible);
         this.TiempoRondasMas.setAlpha(isVisible);
         this.TiempoRondasMenos.setAlpha(isVisible);
         this.TiempoRondasText.setAlpha(isVisible);
         this.TiempoVotacionMas.setAlpha(isVisible);
         this.TiempoVotacionMenos.setAlpha(isVisible);
         this.TiempoVotacionText.setAlpha(isVisible);
         
    }

    scaler()
    {
        //Buttons
        this.button_start.x = game.canvas.width * 3 / 4;
        this.button_start.y = game.canvas.height / 4;
        this.button_start.setScale(this.sY);
        
        this.button_Options.x = game.canvas.width * 3 / 4;
        this.button_Options.y = game.canvas.height* 3 / 4;
        this.button_Options.setScale(this.sY);

        //Background
        this.bg.x = game.canvas.width / 2;
		this.bg.y = game.canvas.height / 2;
        this.bg.setScale(this.sX);

        //--------------------------Options PopUp--------------------------//
        this.keyBoardBg.x = game.canvas.width / 2;
		this.keyBoardBg.y = game.canvas.height / 2;
        this.keyBoardBg.setScale(this.sY*3/4);

        let kbLTCornerX = (this.keyBoardBg.x-(this.keyBoardBg.width*this.keyBoardBg.scaleX)/2)+0;
        let kbLTCornerY = (this.keyBoardBg.y-(this.keyBoardBg.height*this.keyBoardBg.scaleY)/2)+0;
        let columnPos = this.keyBoardBg.width*this.keyBoardBg.scaleX/20;
        let rowPos = this.keyBoardBg.height*this.keyBoardBg.scaleY/20;

        this.SalirCod.x = kbLTCornerX+columnPos*18;
        this.SalirCod.y = kbLTCornerY+rowPos/2
        this.SalirCod.setScale(this.keyBoardBg.scale);

        //Modos
        this.ModosImg.x = kbLTCornerX+columnPos*6;
        this.ModosImg.y = kbLTCornerY+rowPos*2;
        this.ModosImg.setScale(this.keyBoardBg.scale);

        //---Default
        this.DefaultImg.x = kbLTCornerX+columnPos*4;
        this.DefaultImg.y = kbLTCornerY+rowPos*4;
        this.DefaultImg.setScale(this.keyBoardBg.scale);
        
        this.DefaultTickNoCheck.x = kbLTCornerX+columnPos*7;
        this.DefaultTickNoCheck.y = kbLTCornerY+rowPos*4;
        this.DefaultTickNoCheck.setScale(this.keyBoardBg.scale*2);
        
        this.DefaultTickCheck.x = kbLTCornerX+columnPos*7;
        this.DefaultTickCheck.y = kbLTCornerY+rowPos*4;
        this.DefaultTickCheck.setScale(this.keyBoardBg.scale*2);
        
        //---Blind
        this.BlindImg.x = kbLTCornerX+columnPos*4;
        this.BlindImg.y = kbLTCornerY+rowPos*6;
        this.BlindImg.setScale(this.keyBoardBg.scale);
        
        this.BlindTickNoCheck.x = kbLTCornerX+columnPos*7;
        this.BlindTickNoCheck.y = kbLTCornerY+rowPos*6;
        this.BlindTickNoCheck.setScale(this.keyBoardBg.scale*2);
        
        this.BlindTickCheck.x = kbLTCornerX+columnPos*7;
        this.BlindTickCheck.y = kbLTCornerY+rowPos*6;
        this.BlindTickCheck.setScale(this.keyBoardBg.scale*2);
        
        //---Limit
        this.LimitImg.x = kbLTCornerX+columnPos*4;
        this.LimitImg.y = kbLTCornerY+rowPos*8;
        this.LimitImg.setScale(this.keyBoardBg.scale);
        
        this.LimitTickNoCheck.x = kbLTCornerX+columnPos*7;
        this.LimitTickNoCheck.y = kbLTCornerY+rowPos*8;
        this.LimitTickNoCheck.setScale(this.keyBoardBg.scale*2);
        
        this.LimitTickCheck.x = kbLTCornerX+columnPos*7;
        this.LimitTickCheck.y = kbLTCornerY+rowPos*8;
        this.LimitTickCheck.setScale(this.keyBoardBg.scale*2);
        
        //---One
        this.OneImg.x = kbLTCornerX+columnPos*4;
        this.OneImg.y = kbLTCornerY+rowPos*10;
        this.OneImg.setScale(this.keyBoardBg.scale);
        
        this.OneTickNoCheck.x = kbLTCornerX+columnPos*7;
        this.OneTickNoCheck.y = kbLTCornerY+rowPos*10;
        this.OneTickNoCheck.setScale(this.keyBoardBg.scale*2);
        
        this.OneTickCheck.x = kbLTCornerX+columnPos*7;
        this.OneTickCheck.y = kbLTCornerY+rowPos*10;
        this.OneTickCheck.setScale(this.keyBoardBg.scale*2);
        
        //---Growing
        this.GrowingImg.x = kbLTCornerX+columnPos*4;
        this.GrowingImg.y = kbLTCornerY+rowPos*12;
        this.GrowingImg.setScale(this.keyBoardBg.scale);
        
        this.GrowingTickNoCheck.x = kbLTCornerX+columnPos*7;
        this.GrowingTickNoCheck.y = kbLTCornerY+rowPos*12;
        this.GrowingTickNoCheck.setScale(this.keyBoardBg.scale*2);
        
        this.GrowingTickCheck.x = kbLTCornerX+columnPos*7;
        this.GrowingTickCheck.y = kbLTCornerY+rowPos*12;
        this.GrowingTickCheck.setScale(this.keyBoardBg.scale*2);

        //InRoom
        this.TiemposImg.x = kbLTCornerX+columnPos*14;
        this.TiemposImg.y = kbLTCornerY+rowPos*2;
        this.TiemposImg.setScale(this.keyBoardBg.scale);

        //---Numero de rondas
        this.NumRondasImg.x = kbLTCornerX+columnPos*12;
        this.NumRondasImg.y = kbLTCornerY+rowPos*4;
        this.NumRondasImg.setScale(this.keyBoardBg.scale);
        
        this.NumRondasMenos.x = kbLTCornerX+columnPos*14.5;
        this.NumRondasMenos.y = kbLTCornerY+rowPos*4;
        this.NumRondasMenos.setScale(this.keyBoardBg.scale*2);
        
        this.NumRondasText.x = kbLTCornerX+columnPos*15.5;
        this.NumRondasText.y = kbLTCornerY+rowPos*3.4;
        this.NumRondasText.setScale(this.keyBoardBg.scale);
        
        this.NumRondasMas.x = kbLTCornerX+columnPos*17;
        this.NumRondasMas.y = kbLTCornerY+rowPos*4;
        this.NumRondasMas.setScale(this.keyBoardBg.scale*2);

        //---Tiempo pintar
        this.RondaImg.x = kbLTCornerX+columnPos*12;
        this.RondaImg.y = kbLTCornerY+rowPos*6;
        this.RondaImg.setScale(this.keyBoardBg.scale);
        
        this.TiempoRondasMenos.x = kbLTCornerX+columnPos*14.5;
        this.TiempoRondasMenos.y = kbLTCornerY+rowPos*6;
        this.TiempoRondasMenos.setScale(this.keyBoardBg.scale*2);

        this.TiempoRondasText.x = kbLTCornerX+columnPos*15.5;
        this.TiempoRondasText.y = kbLTCornerY+rowPos*5.4;
        this.TiempoRondasText.setScale(this.keyBoardBg.scale);

        this.TiempoRondasMas.x = kbLTCornerX+columnPos*17;
        this.TiempoRondasMas.y = kbLTCornerY+rowPos*6;
        this.TiempoRondasMas.setScale(this.keyBoardBg.scale*2);

        //---Tiempo Votaciones
        this.VotacionImg.x = kbLTCornerX+columnPos*12;
        this.VotacionImg.y = kbLTCornerY+rowPos*8;
        this.VotacionImg.setScale(this.keyBoardBg.scale);
        
        this.TiempoVotacionMenos.x = kbLTCornerX+columnPos*14.5;
        this.TiempoVotacionMenos.y = kbLTCornerY+rowPos*8;
        this.TiempoVotacionMenos.setScale(this.keyBoardBg.scale*2);
        
        this.TiempoVotacionText.x = kbLTCornerX+columnPos*15.5;
        this.TiempoVotacionText.y = kbLTCornerY+rowPos*7.4;
        this.TiempoVotacionText.setScale(this.keyBoardBg.scale);
        
        this.TiempoVotacionMas.x = kbLTCornerX+columnPos*17;
        this.TiempoVotacionMas.y = kbLTCornerY+rowPos*8;
        this.TiempoVotacionMas.setScale(this.keyBoardBg.scale*2);

        //---Aparicion de letras
        /*this.TiemposImg.x = kbLTCornerX+columnPos*12;
        this.TiemposImg.y = kbLTCornerY+rowPos*10;
        this.TiemposImg.setScale(this.keyBoardBg.scale);*/

        //Presets
        this.FacilImg.x = kbLTCornerX+columnPos*6;
        this.FacilImg.y = kbLTCornerY+rowPos*18;
        this.FacilImg.setScale(this.keyBoardBg.scale*2);

        this.DificilImg.x = kbLTCornerX+columnPos*14;
        this.DificilImg.y = kbLTCornerY+rowPos*18;
        this.DificilImg.setScale(this.keyBoardBg.scale*2);
    }

    updateAvatars(data) {
        this.showHideStart(data.leader, data.players.length);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (data.players[i+j*3] !== undefined) {
                    if (!this.textures.exists(data.players[i+j*3].playerId))
                        improCanvas.makeTexture(data.players[i+j*3].playerId, data.players[i+j*3].picture, this, 128);
                    this.avatars[i+j*3].setTexture(data.players[i+j*3].playerId); 
                    if (!data.players[i+j*3].inLobby)
                        this.avatars[i+j*3].setTint(0x888888);
                    else
                        this.avatars[i+j*3].setTint(0xffffff);
                } else {
                    this.avatars[i+j*3].setTexture(''); 
                }
            }
        }
    }
}