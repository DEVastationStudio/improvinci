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
        this.button_back = this.add.image(0,0, 'salirBoton'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});
        this.button_Options = this.add.image(0,0, 'Config'+game.global.languageSuffix);
        this.button_Options.setAlpha(0);
        

        //if (data.leader) {
        let msg = new Object();
        msg.event = 'ALL_READY';
        game.global.socketDir.send(JSON.stringify(msg));
        //}

        this.button_back.on('pointerdown', function (pointer){
            this.button_start.removeInteractive();
            this.button_Options.removeInteractive();
            game.global.socketDir.close();
            game.global.socketDir = undefined;
            this.cameras.main.fadeOut(200);
            this.cameras.main.once('camerafadeoutcomplete', function(camera) {
                this.scene.start('DisconnectOverlay', {message: 'You left the lobby.', toPrelobby: true});
            }, this);
        }, this);
        
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
            this.button_Options.visible = false;
            this.button_start.visible = false;
        }, this);
        
        this.codeText = this.add.text(game.canvas.width/2, game.canvas.height/10, data.code, { fontSize: '40px', fontFamily: 'comic sans ms', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff', align: 'center'}).setOrigin(0.5, 0.5);
        
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
                    this.avatars[i+j*3] = this.add.image(game.canvas.width/2 + (140*(i-1)),  game.canvas.height/2 + (140*(j-1)),'empty'); 
                }
            }
        }

         //Lobby info
         this.roomInfo = this.add.text(0, 0, '', {fontSize: '40px', fontFamily: 'comic sans ms', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff'});

         //Options
         this.keyBoardBg = this.add.image(0,0,'Gameplay').setInteractive();
         this.DailyImg = this.add.image(0,0,'Daily'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});
         this.BlindImg = this.add.image(0,0,'Blind'+game.global.languageSuffix).setInteractive();
         this.DefaultImg = this.add.image(0,0,'Default').setInteractive();
         this.DificilImg = this.add.image(0,0,'Dificil'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});
         this.FacilImg = this.add.image(0,0,'Facil'+game.global.languageSuffix).setInteractive({cursor: 'pointer'});
         this.GrowingImg = this.add.image(0,0,'Growing').setInteractive();
         this.LimitImg = this.add.image(0,0,'Limit'+game.global.languageSuffix).setInteractive();
         this.ModosImg = this.add.image(0,0,'Modos'+game.global.languageSuffix).setInteractive();
         this.NumRondasImg = this.add.image(0,0,'NumRondas'+game.global.languageSuffix).setInteractive();
         this.OneImg = this.add.image(0,0,'One'+game.global.languageSuffix).setInteractive();
         this.RondaImg = this.add.image(0,0,'RondaC'+game.global.languageSuffix).setInteractive();
         this.TiemposImg = this.add.image(0,0,'Tiempos'+game.global.languageSuffix).setInteractive();
         this.VotacionImg = this.add.image(0,0,'Votacion'+game.global.languageSuffix).setInteractive();
         this.SalirCod = this.add.image(0,0,'SalirCod').setInteractive({cursor: 'pointer'});
         this.spainFlag = this.add.image(0,0,'spainFlag').setInteractive({cursor: 'pointer'});
         this.ukFlag = this.add.image(0,0,'ukFlag').setInteractive({cursor: 'pointer'});
         this.languageImg = this.add.image(0,0,'language'+game.global.languageSuffix).setInteractive();
         this.vowelsImg = this.add.image(0,0,'vowels'+game.global.languageSuffix).setInteractive();

         //Checks modos
         //----NoChecks
         this.DefaultTickNoCheck = this.add.image(0,0,'TickNoCheck').setInteractive({cursor: 'pointer'});
         this.BlindTickNoCheck = this.add.image(0,0,'TickNoCheck').setInteractive({cursor: 'pointer'});
         this.LimitTickNoCheck = this.add.image(0,0,'TickNoCheck').setInteractive({cursor: 'pointer'});
         this.OneTickNoCheck = this.add.image(0,0,'TickNoCheck').setInteractive({cursor: 'pointer'});
         this.GrowingTickNoCheck = this.add.image(0,0,'TickNoCheck').setInteractive({cursor: 'pointer'});
         this.VowelsTickNoCheck = this.add.image(0,0,'TickNoCheck').setInteractive({cursor: 'pointer'});
         //----Checks
         this.DefaultTickCheck = this.add.image(0,0,'TickCheck').setInteractive({cursor: 'pointer'});
         this.BlindTickCheck = this.add.image(0,0,'TickCheck').setInteractive({cursor: 'pointer'});
         this.LimitTickCheck = this.add.image(0,0,'TickCheck').setInteractive({cursor: 'pointer'});
         this.OneTickCheck = this.add.image(0,0,'TickCheck').setInteractive({cursor: 'pointer'});
         this.GrowingTickCheck = this.add.image(0,0,'TickCheck').setInteractive({cursor: 'pointer'});
         this.VowelsTickCheck = this.add.image(0,0,'TickCheck').setInteractive({cursor: 'pointer'});

         //MasMenos Configuracion Ronda
         this.NumRondasMas = this.add.image(0,0,'Mas').setInteractive({cursor: 'pointer'});
         this.NumRondasMenos = this.add.image(0,0,'Menos').setInteractive({cursor: 'pointer'});
         this.NumRondasText = this.add.text(0, 0, '--', { fontSize: '30px', fontFamily: 'comic sans ms', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff'});
         this.TiempoRondasMas = this.add.image(0,0,'Mas').setInteractive({cursor: 'pointer'});
         this.TiempoRondasMenos = this.add.image(0,0,'Menos').setInteractive({cursor: 'pointer'});
         this.TiempoRondasText = this.add.text(0, 0, '--', { fontSize: '30px', fontFamily: 'comic sans ms', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff'});
         this.TiempoVotacionMas = this.add.image(0,0,'Mas').setInteractive({cursor: 'pointer'});
         this.TiempoVotacionMenos = this.add.image(0,0,'Menos').setInteractive({cursor: 'pointer'});
         this.TiempoVotacionText = this.add.text(0, 0, '--', { fontSize: '30px', fontFamily: 'comic sans ms', fontStyle: 'bold', strokeThickness: 12, color: '#000000', stroke: '#ffffff'});
         //this.Mas = this.add.image(0,0,'Mas').setInteractive();
         //this.Menos = this.add.image(0,0,'Menos').setInteractive();


         this.invisible(false);
         this.scaler();

         this.activeGamemodes = 0;   

         //Config Actions
         this.bg.on('pointerdown', function (pointer){
            this.scene.get('Lobby').invisible(false);
            this.button_Options.visible = true;
            this.button_start.visible = true;
        }, this);

         this.FacilImg.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'EASYMODE';
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);

        this.DificilImg.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'DIFFICULTMODE';
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);

        this.DailyImg.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'DAILYMODE';
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);

         this.SalirCod.on('pointerdown', function (pointer){
            this.scene.get('Lobby').invisible(false);
            this.button_Options.visible = true;
            this.button_start.visible = true;
        }, this);

        //Language
        this.ukFlag.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'LANGUAGE_CHANGE';
            msg.type = true;
            game.global.socketDir.send(JSON.stringify(msg));
            this.scene.get('Lobby').check('English',true);
        }, this);

        this.spainFlag.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'LANGUAGE_CHANGE';
            msg.type = false;
            game.global.socketDir.send(JSON.stringify(msg));
            this.scene.get('Lobby').check('English',false);
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

        this.VowelsTickCheck.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'NOCHECK';
            msg.type = 'Vowels';
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);
        this.VowelsTickNoCheck.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'CHECK';
            msg.type = 'Vowels';
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

        let msg2 = new Object();
        msg2.event = 'GET_INIT_INFO';
        game.global.socketDir.send(JSON.stringify(msg2));
        this.cameras.main.fadeIn(200);
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
            case 'Vowels':
                if(isChecked)
                {
                    this.VowelsTickCheck.setAlpha(isChecked)
                    this.VowelsTickCheck.setInteractive({cursor: 'pointer'})
                    this.VowelsTickNoCheck.setAlpha(!isChecked)
                    this.VowelsTickNoCheck.removeInteractive();
                }else
                {
                    this.VowelsTickCheck.setAlpha(0)
                    this.VowelsTickCheck.removeInteractive();
                    this.VowelsTickNoCheck.setAlpha(1)
                    this.VowelsTickNoCheck.setInteractive({cursor: 'pointer'})
                }
                break;
            case 'English':
                if(isChecked)
                {
                    this.ukFlag.setAlpha(1);
                    this.spainFlag.setAlpha(0.2);
                }else
                {
                    this.ukFlag.setAlpha(0.2);
                    this.spainFlag.setAlpha(1);
                }
                break;
        }
    }

    showHideStart(leader, players) {
        let count = 0;
        console.log(players);
        for (let p in players) {
            if (players[p].inLobby) count++;
        }

        if (leader) {
            if (count >= 3) {
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
    
    showLobbyInfo(defaultM, blindM, limitM, oneM, growingM, vowelsM, isEnglish, numRoundsM, roundTimeM, voteTimeM, numActGamemodes)
    {
        if(game.global.languageSuffix === '_en')
        {
            this.activeGamemodes = numActGamemodes;
            this.roomInfo.text='ROUND INFO: \n';
            this.roomInfo.text+='Rounds: '+numRoundsM+'\n';
            this.roomInfo.text+='Round time: '+roundTimeM+'\n';
            this.roomInfo.text+='Voting time: '+voteTimeM+'\n';
            if(isEnglish)
                this.roomInfo.text+='Word bank language: English\n';
            else
                this.roomInfo.text+='Word bank language: Spanish\n';
            if(vowelsM)
                this.roomInfo.text+='Visible vowels: Yes\n \n';
            else
                this.roomInfo.text+='Visible vowels: No\n \n';
            this.roomInfo.text+='GAMEMODES IN USE: \n';
            if(defaultM)
                this.roomInfo.text+='Normal \n';
            if(blindM)
                this.roomInfo.text+='Blindfolded \n';
            if(limitM)
                this.roomInfo.text+='Stroke Limit \n';
            if(oneM)
                this.roomInfo.text+='One Stroke \n';
            if(growingM)
                this.roomInfo.text+='Incremental\n';
        }
        else
        {
            this.activeGamemodes = numActGamemodes;
            this.roomInfo.text='INFO RONDA: \n';
            this.roomInfo.text+='Rondas: '+numRoundsM+'\n';
            this.roomInfo.text+='Tiempo ronda: '+roundTimeM+'\n';
            this.roomInfo.text+='Tiempo votación: '+voteTimeM+'\n';
            if(isEnglish)
                this.roomInfo.text+='Banco de palabras: Inglés\n';
            else
                this.roomInfo.text+='Banco de palabras: Español\n';
            if(vowelsM)
                this.roomInfo.text+='Vocales visibles: Si\n \n';
            else
                this.roomInfo.text+='Vocales visibles: No\n \n';
            this.roomInfo.text+='MODOS EN USO: \n';
            if(defaultM)
                this.roomInfo.text+='Normal \n';
            if(blindM)
                this.roomInfo.text+='A Ciegas \n';
            if(limitM)
                this.roomInfo.text+='Límite Trazos \n';
            if(oneM)
                this.roomInfo.text+='Un Solo Trazo \n';
            if(growingM)
                this.roomInfo.text+='Incremetal\n';
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

    setInfo(defaultM, blindM, limitM, oneM, growingM, vowelsM, isEnglish, numRoundsM, roundTimeM, voteTimeM, numActGamemodes)
    {
        this.check('Default', defaultM);
        this.check('Blind', blindM);
        this.check('Limit',limitM);
        this.check('One',oneM);
        this.check('Growing',growingM);
        this.check('Vowels', vowelsM);
        this.check('English', isEnglish);
        this.activeGamemodes = numActGamemodes;
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
        this.VowelsTickNoCheck.setAlpha(isVisible);
        //----Checks
        this.DefaultTickCheck.setAlpha(isVisible);
        this.BlindTickCheck.setAlpha(isVisible);
        this.LimitTickCheck.setAlpha(isVisible);
        this.OneTickCheck.setAlpha(isVisible);
        this.GrowingTickCheck.setAlpha(isVisible);
        this.VowelsTickCheck.setAlpha(isVisible);

        this.keyBoardBg.setAlpha(isVisible);
        this.DailyImg.setAlpha(isVisible);
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
        this.vowelsImg.setAlpha(isVisible);
        this.languageImg.setAlpha(isVisible);
        this.ukFlag.setAlpha(isVisible);
        this.spainFlag.setAlpha(isVisible);
        

         
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

        this.button_back.x = game.canvas.width / 4;
        this.button_back.y = game.canvas.height * 3 / 4;
        this.button_back.setScale(this.sY);

        //Background
        this.bg.x = game.canvas.width / 2;
		this.bg.y = game.canvas.height / 2;
        this.bg.setScale(this.sX);

        //Room info
        this.roomInfo.x = game.canvas.width / 40;
		this.roomInfo.y = game.canvas.height *3 / 40;
        this.roomInfo.setScale(this.sY);

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
        this.DefaultTickNoCheck.setScale(this.keyBoardBg.scale);
        
        this.DefaultTickCheck.x = kbLTCornerX+columnPos*7;
        this.DefaultTickCheck.y = kbLTCornerY+rowPos*4;
        this.DefaultTickCheck.setScale(this.keyBoardBg.scale);
        
        //---Blind
        this.BlindImg.x = kbLTCornerX+columnPos*4;
        this.BlindImg.y = kbLTCornerY+rowPos*6;
        this.BlindImg.setScale(this.keyBoardBg.scale);
        
        this.BlindTickNoCheck.x = kbLTCornerX+columnPos*7;
        this.BlindTickNoCheck.y = kbLTCornerY+rowPos*6;
        this.BlindTickNoCheck.setScale(this.keyBoardBg.scale);
        
        this.BlindTickCheck.x = kbLTCornerX+columnPos*7;
        this.BlindTickCheck.y = kbLTCornerY+rowPos*6;
        this.BlindTickCheck.setScale(this.keyBoardBg.scale);
        
        //---Limit
        this.LimitImg.x = kbLTCornerX+columnPos*4;
        this.LimitImg.y = kbLTCornerY+rowPos*8;
        this.LimitImg.setScale(this.keyBoardBg.scale);
        
        this.LimitTickNoCheck.x = kbLTCornerX+columnPos*7;
        this.LimitTickNoCheck.y = kbLTCornerY+rowPos*8;
        this.LimitTickNoCheck.setScale(this.keyBoardBg.scale);
        
        this.LimitTickCheck.x = kbLTCornerX+columnPos*7;
        this.LimitTickCheck.y = kbLTCornerY+rowPos*8;
        this.LimitTickCheck.setScale(this.keyBoardBg.scale);
        
        //---One
        this.OneImg.x = kbLTCornerX+columnPos*4;
        this.OneImg.y = kbLTCornerY+rowPos*10;
        this.OneImg.setScale(this.keyBoardBg.scale);
        
        this.OneTickNoCheck.x = kbLTCornerX+columnPos*7;
        this.OneTickNoCheck.y = kbLTCornerY+rowPos*10;
        this.OneTickNoCheck.setScale(this.keyBoardBg.scale);
        
        this.OneTickCheck.x = kbLTCornerX+columnPos*7;
        this.OneTickCheck.y = kbLTCornerY+rowPos*10;
        this.OneTickCheck.setScale(this.keyBoardBg.scale);
        
        //---Growing
        this.GrowingImg.x = kbLTCornerX+columnPos*4;
        this.GrowingImg.y = kbLTCornerY+rowPos*12;
        this.GrowingImg.setScale(this.keyBoardBg.scale);
        
        this.GrowingTickNoCheck.x = kbLTCornerX+columnPos*7;
        this.GrowingTickNoCheck.y = kbLTCornerY+rowPos*12;
        this.GrowingTickNoCheck.setScale(this.keyBoardBg.scale);
        
        this.GrowingTickCheck.x = kbLTCornerX+columnPos*7;
        this.GrowingTickCheck.y = kbLTCornerY+rowPos*12;
        this.GrowingTickCheck.setScale(this.keyBoardBg.scale);

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
        this.NumRondasMenos.setScale(this.keyBoardBg.scale);
        
        this.NumRondasText.x = kbLTCornerX+columnPos*15.5;
        this.NumRondasText.y = kbLTCornerY+rowPos*3.4;
        this.NumRondasText.setScale(this.keyBoardBg.scale);
        
        this.NumRondasMas.x = kbLTCornerX+columnPos*17;
        this.NumRondasMas.y = kbLTCornerY+rowPos*4;
        this.NumRondasMas.setScale(this.keyBoardBg.scale);

        //---Tiempo pintar
        this.RondaImg.x = kbLTCornerX+columnPos*12;
        this.RondaImg.y = kbLTCornerY+rowPos*6;
        this.RondaImg.setScale(this.keyBoardBg.scale);
        
        this.TiempoRondasMenos.x = kbLTCornerX+columnPos*14.5;
        this.TiempoRondasMenos.y = kbLTCornerY+rowPos*6;
        this.TiempoRondasMenos.setScale(this.keyBoardBg.scale);

        this.TiempoRondasText.x = kbLTCornerX+columnPos*15.5;
        this.TiempoRondasText.y = kbLTCornerY+rowPos*5.4;
        this.TiempoRondasText.setScale(this.keyBoardBg.scale);

        this.TiempoRondasMas.x = kbLTCornerX+columnPos*17;
        this.TiempoRondasMas.y = kbLTCornerY+rowPos*6;
        this.TiempoRondasMas.setScale(this.keyBoardBg.scale);

        //---Tiempo Votaciones
        this.VotacionImg.x = kbLTCornerX+columnPos*12;
        this.VotacionImg.y = kbLTCornerY+rowPos*8;
        this.VotacionImg.setScale(this.keyBoardBg.scale);
        
        this.TiempoVotacionMenos.x = kbLTCornerX+columnPos*14.5;
        this.TiempoVotacionMenos.y = kbLTCornerY+rowPos*8;
        this.TiempoVotacionMenos.setScale(this.keyBoardBg.scale);
        
        this.TiempoVotacionText.x = kbLTCornerX+columnPos*15.5;
        this.TiempoVotacionText.y = kbLTCornerY+rowPos*7.4;
        this.TiempoVotacionText.setScale(this.keyBoardBg.scale);
        
        this.TiempoVotacionMas.x = kbLTCornerX+columnPos*17;
        this.TiempoVotacionMas.y = kbLTCornerY+rowPos*8;
        this.TiempoVotacionMas.setScale(this.keyBoardBg.scale);

        //---Aparicion de letras
        this.vowelsImg.x = kbLTCornerX+columnPos*12;
        this.vowelsImg.y = kbLTCornerY+rowPos*10;
        this.vowelsImg.setScale(this.keyBoardBg.scale);

        this.VowelsTickNoCheck.x = kbLTCornerX+columnPos*15.7;
        this.VowelsTickNoCheck.y = kbLTCornerY+rowPos*10;
        this.VowelsTickNoCheck.setScale(this.keyBoardBg.scale*2);

        this.VowelsTickCheck.x = kbLTCornerX+columnPos*15.7;
        this.VowelsTickCheck.y = kbLTCornerY+rowPos*10;
        this.VowelsTickCheck.setScale(this.keyBoardBg.scale);

        //Language
        this.languageImg.x = kbLTCornerX+columnPos*12;
        this.languageImg.y = kbLTCornerY+rowPos*12;
        this.languageImg.setScale(this.keyBoardBg.scale);
        
        this.spainFlag.x = kbLTCornerX+columnPos*14.7;
        this.spainFlag.y = kbLTCornerY+rowPos*12;
        this.spainFlag.setScale(this.keyBoardBg.scale);

        this.ukFlag.x = kbLTCornerX+columnPos*16.7;
        this.ukFlag.y = kbLTCornerY+rowPos*12;
        this.ukFlag.setScale(this.keyBoardBg.scale);

        //Presets
        this.FacilImg.x = kbLTCornerX+columnPos*6;
        this.FacilImg.y = kbLTCornerY+rowPos*18;
        this.FacilImg.setScale(this.keyBoardBg.scale);

        this.DificilImg.x = kbLTCornerX+columnPos*10;
        this.DificilImg.y = kbLTCornerY+rowPos*18;
        this.DificilImg.setScale(this.keyBoardBg.scale);

        this.DailyImg.x = kbLTCornerX+columnPos*14;
        this.DailyImg.y = kbLTCornerY+rowPos*18;
        this.DailyImg.setScale(this.keyBoardBg.scale);

        //Pictures
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.avatars[i+j*3].x = game.canvas.width/2 + ((0.3*game.canvas.height)*(i-1));
                this.avatars[i+j*3].y = game.canvas.height/2 + ((0.3*game.canvas.height)*(j-1));
                this.avatars[i+j*3].setScale(game.canvas.height/588.8,game.canvas.height/588.8);
            }
        }
        this.codeText.x = game.canvas.width/2;
        this.codeText.y = game.canvas.height/20;
        this.codeText.setScale(this.sY);
    }

    updateAvatars(data) {
        this.showHideStart(data.leader, data.players);
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
                    this.avatars[i+j*3].setTexture('empty'); 
                }
            }
        }
    }
}