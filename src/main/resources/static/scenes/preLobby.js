'use strict';

class PreLobby extends Phaser.Scene {
    constructor() {
        super('PreLobby');
    }

    preload() {
        game.global.socketDir = new WebSocket('wss://improvinci.herokuapp.com/improvinci');
        //game.global.socketDir = new WebSocket('ws://localhost:8080/improvinci');
	
        game.global.socketDir.onopen = () => {
            if (game.global.DEBUG_MODE) {
                console.log('[DEBUG] WebSocket connection opened.');
            }
        }
    
        game.global.socketDir.onclose = () => {
            if (game.global.DEBUG_MODE) {
                console.log('[DEBUG] WebSocket connection closed.')
            }
            heartMonitor(false);
            clearInterval(isAlive);
        }
        game.global.socketDir.onmessage = (message) => {
            var msg = JSON.parse(message.data);
            switch (msg.event) {
                case 'PRUEBA_RETURN':
                    if(msg.sent)
                        console.log('['+msg.event+'] '+'('+msg.idSender+' => '+msg.idReciever+') - '+msg.message);
                    else
                        console.log('['+msg.event+'] '+'Message can\'t be sent');
                    break;
                case 'TRY_JOIN_RETURN':
                    console.log('['+msg.event+'] '+msg.message);
                    switch (msg.state) {
                        case 'null':
                            if (this.scene.isActive()) this.onRoomGone();
                            break;
                        case 'ingame':
                            if (this.scene.isActive()) this.onRoomStarted();
                            break;
                        case 'full':
                            if (this.scene.isActive()) this.onRoomFull();
                            break;
                        case 'ok':
                            if (msg.joining) {
                                if (this.scene.isActive())
                                    this.scene.start('Lobby', {code: msg.roomCode, players: msg.playerArray, leader: msg.leader});
                                else if (this.scene.get('GameOver').scene.isActive())
                                    this.scene.get('GameOver').scene.start('Lobby', {code: msg.roomCode, players: msg.playerArray, leader: msg.leader});
                            } else {
                                if (this.scene.get('Lobby').scene.isActive()) {
                                    this.scene.get('Lobby').updateAvatars({players: msg.playerArray, leader: msg.leader});
                                }
                            }
                            break;
                    }
                    break;
                case 'CREATE_ROOM_RETURN':
                    console.log('['+msg.event+'] '+msg.roomCode);
                    this.scene.get('PreLobby').joinRoom(msg.roomCode);
                    break;
                case 'GET_ROOM_CODE_RETURN':
                    console.log('['+msg.event+'] '+msg.roomCode);
                    break;
                case 'PEOPLE_IN_ROOM_RETURN':
                    console.log('['+msg.event+'] '+msg.message);
                    break;
                case 'TRY_LEAVE_RETURN':
                case 'PLAYER_DISCONNECTION_RETURN':
                    console.log('['+msg.event+'] '+msg.message);
                    if (this.scene.get('Lobby').scene.isActive()) {
                        this.scene.get('Lobby').updateAvatars({players: msg.playerArray, leader: msg.leader});
                    }
                    break;
                case 'SEND_IMAGE_RETURN':
                    this.scene.get('InGame').updateDrawing(msg.player, msg.image, msg.isSelf);
                    break;
                case 'HEARTBEAT_RETURN':
                    if(!conectionUp){actualHeartBeat = Date.now(); conectionUp = true;}
                    lastHeartBeat = actualHeartBeat;
                    actualHeartBeat = Date.now();
                    console.log('['+msg.event+'] '+msg.message);
                    break;
                /*case 'PLAYER_DISCONNECTION_RETURN':
                    console.log('['+msg.event+'] '+msg.message);
                    this.scene.get('Lobby').updateAvatars({players: msg.playerArray, leader: msg.leader});
                    break;*/
                case 'START_GAME_RETURN':
                    if (this.scene.get('Lobby').scene.isActive()) {
                        this.scene.get('Lobby').scene.start('InGame', {maxRounds: msg.maxRounds, players: msg.players});
                    }
                    break;
                case 'CHOSEN_WORD':
                    this.scene.get('InGame').showWord(msg.word, msg.faker, msg.drawMode);
                    break;
                case 'DRAW_START':
                    this.scene.get('InGame').drawStart(msg.time, msg.round, msg.vowels);
                    break;
                case 'TIME_UPDATE':
                    this.scene.get('InGame').updateTime(msg.time);
                    if(msg.votingPhase)
                        this.scene.get('InGame').clockAnimControl(true);
                    break;
                case 'ROUND_OVER':
                    this.scene.get('InGame').roundOver();
                    break;
                case 'ROUND_VOTES':
                    this.scene.get('InGame').updateVoteResults(msg);
                    if(msg.stopAnim)
                        this.scene.get('InGame').TimeAnim.anims.stopOnRepeat();
                    break;
                case 'POINTS':
                    if (this.scene.get('InGame').scene.isActive()) {
                        this.scene.get('InGame').scene.start('GameOver', {code: msg.roomCode, players: msg.playerArray, leader: msg.leader});
                    }
                    break;
                case 'ALL_READY_RETURN':
                    if (this.scene.get('Lobby').scene.isActive()) {
                        this.scene.get('Lobby').updateAvatars({players: msg.playerArray, leader: msg.leader});
                    }
                break;
                case 'BE_PEEKED':
                    if (this.scene.get('InGame').scene.isActive()) {
                        this.scene.get('InGame').bePeeked();
                    }
                break;
                case 'PEEK_RETURN':
                    if (this.scene.get('InGame').scene.isActive()) {
                        this.scene.get('InGame').peekReturn(msg.image);
                    }
                break;
                case 'CHECK_RETURN':
                    this.scene.get('Lobby').check(msg.type, msg.isChecked);
                break;
                case 'NOCHECK_RETURN':
                    this.scene.get('Lobby').check(msg.type, msg.isChecked)
                break;
                case 'GET_CONFIG_ROOM_RETURN':
                    this.scene.get('Lobby').setInfo(msg.default, msg.blind, msg.limit, msg.one, msg.growing, msg.vowels, msg.isEnglish, msg.numRounds, msg.roundTime, msg.voteTime, msg.numActiveGamemodes);
                break;
                case 'PLUSCONFIG_RETURN':
                    this.scene.get('Lobby').plusControls(msg.type, msg.amount);
                break;
                case 'ROOM_INFO_RETURN':
                    this.scene.get('Lobby').showLobbyInfo(msg.default, msg.blind, msg.limit, msg.one, msg.growing, msg.vowels, msg.isEnglish, msg.numRounds, msg.roundTime, msg.voteTime, msg.numActiveGamemodes);
                    break;
                case 'PLAYER_LEFT':
                    if (this.scene.get('InGame').scene.isActive())
                        this.scene.get('InGame').playerLeft(msg.image);
                break;
                default :
                    break;
            }
        }
        //Heartbeat manager
        var heartbeat;
        var isAlive;
        var lastHeartBeat;
        var actualHeartBeat;
        var conectionUp = false;
        var heartRate = 250;
        var deathTime = 25000;

        function heartMonitor(turnOn)
        {
            if(turnOn)
            {
                heartbeat = window.setInterval(function(){
                    let msg = new Object();
                    msg.event = 'HEARTBEAT';
                    game.global.socketDir.send(JSON.stringify(msg));
                }, heartRate);
                console.log('[heartMonitor] Heart is beating');
            }else
            {
                clearInterval(heartbeat);
                console.log('[heartMonitor] Heart died');
                //If socket is undefined, the client stopped it willingly
                if (game.global.socketDir !== undefined) {
                    game.global.socketDir = undefined;
                    //open disconnectoverlay scene
                    if (game.scene.keys.PreLobby.scene.isActive()) {
                        game.scene.keys.PreLobby.scene.start('DisconnectOverlay', {message: 'Connection lost.'});
                    } else if (game.scene.keys.Lobby.scene.isActive()) {
                        game.scene.keys.Lobby.scene.start('DisconnectOverlay', {message: 'Connection lost.'});
                    } else if (game.scene.keys.InGame.scene.isActive()) {
                        game.scene.keys.InGame.scene.start('DisconnectOverlay', {message: 'Connection lost.'});
                    } else if (game.scene.keys.GameOver.scene.isActive()) {
                        game.scene.keys.GameOver.scene.start('DisconnectOverlay', {message: 'Connection lost.'});
                    }
                }
            }
        }

        function liveMonitor()
        {
            heartMonitor(true);
            isAlive = window.setInterval(function(){
                actualHeartBeat = Date.now();
                if((actualHeartBeat-lastHeartBeat)>deathTime)
                {
                    heartMonitor(false);
                    clearInterval(isAlive);
                }
            }, deathTime);
        }

        liveMonitor();
    }

    create() {
        //Scale factors
    	this.sX = game.canvas.width/game.global.WIDTH;
		this.sY = game.canvas.height/game.global.HEIGHT;

        //Background
        this.bg = this.add.image(0,0,'Menu').setInteractive();

        //buttons
        this.button_create = this.add.image(0,0, 'Ready_es').setInteractive({cursor: 'pointer'});
        this.codeButton = this.add.image(0,0, 'Ready_host_es').setInteractive({cursor: 'pointer'});
        this.button_back = this.add.image(0,0, 'salirBoton_en').setInteractive({cursor: 'pointer'});

        //keyboard
        this.keyBoardBg = this.add.image(0,0,'KeyBoardBg').setInteractive();
        this.BarraCod = this.add.image(0,0,'BarraCod').setInteractive();
        this.ConfirmarCod = this.add.image(0,0,'ConfirmarCod').setInteractive({cursor: 'pointer'});
        this.BorrarCod = this.add.image(0,0,'BorrarCod').setInteractive({cursor: 'pointer'});
        this.SalirCod = this.add.image(0,0,'SalirCod').setInteractive({cursor: 'pointer'});
        this.Letra_A = this.add.image(0,0,'Letra_A').setInteractive({cursor: 'pointer'});
        this.Letra_B = this.add.image(0,0,'Letra_B').setInteractive({cursor: 'pointer'});
        this.Letra_C = this.add.image(0,0,'Letra_C').setInteractive({cursor: 'pointer'});
        this.Letra_D = this.add.image(0,0,'Letra_D').setInteractive({cursor: 'pointer'});
        this.Letra_E = this.add.image(0,0,'Letra_E').setInteractive({cursor: 'pointer'});
        this.Letra_F = this.add.image(0,0,'Letra_F').setInteractive({cursor: 'pointer'});
        this.Letra_G = this.add.image(0,0,'Letra_G').setInteractive({cursor: 'pointer'});
        this.Letra_H = this.add.image(0,0,'Letra_H').setInteractive({cursor: 'pointer'});
        this.Letra_I = this.add.image(0,0,'Letra_I').setInteractive({cursor: 'pointer'});
        this.Letra_J = this.add.image(0,0,'Letra_J').setInteractive({cursor: 'pointer'});
        this.Letra_K = this.add.image(0,0,'Letra_K').setInteractive({cursor: 'pointer'});
        this.Letra_L = this.add.image(0,0,'Letra_L').setInteractive({cursor: 'pointer'});
        this.Letra_M = this.add.image(0,0,'Letra_M').setInteractive({cursor: 'pointer'});
        this.Letra_N = this.add.image(0,0,'Letra_N').setInteractive({cursor: 'pointer'});
        this.Letra_O = this.add.image(0,0,'Letra_O').setInteractive({cursor: 'pointer'});
        this.Letra_P = this.add.image(0,0,'Letra_P').setInteractive({cursor: 'pointer'});

        this.codeText = this.add.text(0, 0, '', { fontSize: '70px',color: '#000000',fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });

        //Connection popup
        this.popupBg = this.add.image(0,0,'Gameplay');
        this.popupBg.setAlpha(0);
        this.popupText = this.add.text(0, 0, '', { fontSize: '70px',color: '#000000',fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', align: 'center'}).setOrigin(0.5, 0.5);
        this.popupText.setAlpha(0);
        this.popupCancel = this.add.image(0,0,'SalirCod');
        this.popupCancel.setAlpha(0);
        this.popupCancel.on('pointerdown', function (pointer){
            this.cancelConnection();
        }, this);

        this.invisible(false);
        this.scaler();

        this.input.keyboard.addKey(8);
        this.codeFocus = false;
        
        this.button_back.on('pointerdown', function (pointer){
            this.button_create.removeInteractive();
            this.button_back.removeInteractive();
            game.global.socketDir.close();
            game.global.socketDir = undefined;
            this.scene.start('DrawAvatar');
        }, this);

		this.button_create.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'CREATE_ROOM';
            msg.players = 9;
            game.global.socketDir.send(JSON.stringify(msg));
            this.button_create.removeInteractive();
            this.button_back.removeInteractive();
            this.showConnectingInterface();
        }, this);
        
        this.codeButton.on('pointerdown', function (pointer){
            this.codeButton.setAlpha(0);
            this.button_create.setAlpha(0);
            this.button_back.setAlpha(0);
            this.scene.get('PreLobby').scene.codeFocus = true;
            this.scene.get('PreLobby').invisible(true);
            this.codeButton.removeInteractive();
            this.button_create.removeInteractive();
            this.button_back.removeInteractive();
		}, this);
        this.bg.on('pointerdown', function (pointer){
            this.codeButton.setAlpha(1);
            this.button_create.setAlpha(1);
            this.button_back.setAlpha(1);
            this.scene.get('PreLobby').scene.codeFocus = false;
            this.scene.get('PreLobby').invisible(false);
            this.codeButton.setInteractive({cursor: 'pointer'});
            this.button_create.setInteractive({cursor: 'pointer'});
            this.button_back.setInteractive({cursor: 'pointer'});
        }, this);
        this.SalirCod.on('pointerdown', function (pointer){
            this.codeButton.setAlpha(1);
            this.button_create.setAlpha(1);
            this.button_back.setAlpha(1);
            this.scene.get('PreLobby').scene.codeFocus = false;
            this.scene.get('PreLobby').invisible(false);
            this.codeButton.setInteractive({cursor: 'pointer'});
            this.button_create.setInteractive({cursor: 'pointer'});
            this.button_back.setInteractive({cursor: 'pointer'});
		}, this);
		this.ConfirmarCod.on('pointerdown', function (pointer){
            this.scene.get('PreLobby').tryJoin();
            this.showConnectingInterface();
        }, this);
        this.BorrarCod.on('pointerdown', function (pointer){
            if (!this.scene.get('PreLobby').scene.codeFocus) return;
            this.scene.get('PreLobby').trimText();
        }, this);

        this.Letra_A.on('pointerdown', function (pointer){
            this.scene.get('PreLobby').updateText('A');
        }, this);
        this.Letra_B.on('pointerdown', function (pointer){
            this.scene.get('PreLobby').updateText('B');
        }, this);
        this.Letra_C.on('pointerdown', function (pointer){
            this.scene.get('PreLobby').updateText('C');
        }, this);
        this.Letra_D.on('pointerdown', function (pointer){
            this.scene.get('PreLobby').updateText('D');
        }, this);
        this.Letra_E.on('pointerdown', function (pointer){
            this.scene.get('PreLobby').updateText('E');
        }, this);
        this.Letra_F.on('pointerdown', function (pointer){
            this.scene.get('PreLobby').updateText('F');
        }, this);
        this.Letra_G.on('pointerdown', function (pointer){
            this.scene.get('PreLobby').updateText('G');
        }, this);
        this.Letra_H.on('pointerdown', function (pointer){
            this.scene.get('PreLobby').updateText('H');
        }, this);
        this.Letra_I.on('pointerdown', function (pointer){
            this.scene.get('PreLobby').updateText('I');
        }, this);
        this.Letra_J.on('pointerdown', function (pointer){
            this.scene.get('PreLobby').updateText('J');
        }, this);
        this.Letra_K.on('pointerdown', function (pointer){
            this.scene.get('PreLobby').updateText('K');
        }, this);
        this.Letra_L.on('pointerdown', function (pointer){
            this.scene.get('PreLobby').updateText('L');
        }, this);
        this.Letra_M.on('pointerdown', function (pointer){
            this.scene.get('PreLobby').updateText('M');
        }, this);
        this.Letra_N.on('pointerdown', function (pointer){
            this.scene.get('PreLobby').updateText('N');
        }, this);
        this.Letra_O.on('pointerdown', function (pointer){
            this.scene.get('PreLobby').updateText('O');
        }, this);
        this.Letra_P.on('pointerdown', function (pointer){
            this.scene.get('PreLobby').updateText('P');
        }, this);


		this.input.keyboard.on('keydown', 
            function (event) { 
                console.log(event);
                if (event.keyCode >= 65 && event.keyCode <= 90) {
                    if (!this.scene.scene.codeFocus) return;
                    this.scene.updateText(event.key);
                } else if (event.keyCode == 8) {
                    if (!this.scene.scene.codeFocus) return;
                    this.scene.trimText();
                    event.stopImmediatePropagation();
                } else if (event.keyCode == 13) {
                    this.scene.tryJoin();
                    this.scene.showConnectingInterface();
                    //enter
                }
            }
        );
    }
    
    updateText(text) {
        if (this.codeText.text.length >= 9) return;
        this.codeText.text += text.toUpperCase();
    }

    trimText() {
        this.codeText.text = this.codeText.text.substring(0, this.codeText.text.length - 1); 
    }

    tryJoin() {
        let msg = new Object();
        msg.event = 'TRY_JOIN';
        msg.roomCode = this.codeText.text;//prompt('Enter room code: ');
        msg.picture = localStorage.getItem('lastAvatar');
        game.global.socketDir.send(JSON.stringify(msg));
        //expand this when it's implemented properly because it can fail I guess (if you type a wrong code or something like that, idk)
        this.button_create.removeInteractive();
        this.button_back.removeInteractive();
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
        this.codeText.setAlpha(isVisible)
        this.keyBoardBg.setAlpha(isVisible);
        this.BarraCod.setAlpha(isVisible);
        this.ConfirmarCod.setAlpha(isVisible);
        this.SalirCod.setAlpha(isVisible);
        this.BorrarCod.setAlpha(isVisible);
        this.Letra_A.setAlpha(isVisible);
        this.Letra_B.setAlpha(isVisible);
        this.Letra_C.setAlpha(isVisible);
        this.Letra_D.setAlpha(isVisible);
        this.Letra_E.setAlpha(isVisible);
        this.Letra_F.setAlpha(isVisible);
        this.Letra_G.setAlpha(isVisible);
        this.Letra_H.setAlpha(isVisible);
        this.Letra_I.setAlpha(isVisible);
        this.Letra_J.setAlpha(isVisible);
        this.Letra_K.setAlpha(isVisible);
        this.Letra_L.setAlpha(isVisible);
        this.Letra_M.setAlpha(isVisible);
        this.Letra_N.setAlpha(isVisible);
        this.Letra_O.setAlpha(isVisible);
        this.Letra_P.setAlpha(isVisible);
    }

    scaler()
    {
        //Buttons
        this.button_create.x = game.canvas.width / 4;
        this.button_create.y = game.canvas.height / 4;
        this.button_create.setScale(this.sY);

        this.codeButton.x = game.canvas.width / 4;
        this.codeButton.y = game.canvas.height / 2;
        this.codeButton.setScale(this.sY);

        this.button_back.x = game.canvas.width / 4;
        this.button_back.y = game.canvas.height * 3 / 4;
        this.button_back.setScale(this.sY);

        //Background
        this.bg.x = game.canvas.width / 2;
		this.bg.y = game.canvas.height / 2;
        this.bg.setScale(this.sX);
        
        this.keyBoardBg.x = game.canvas.width / 2;
		this.keyBoardBg.y = game.canvas.height / 2;
        this.keyBoardBg.setScale(this.sY*3/4);
        
        //---------------------KEYBOARD---------------------//
        let kbLTCornerX = (this.keyBoardBg.x-(this.keyBoardBg.width*this.keyBoardBg.scaleX)/2)+0;
        let kbLTCornerY = (this.keyBoardBg.y-(this.keyBoardBg.height*this.keyBoardBg.scaleY)/2)+0;
        let columnPos = this.keyBoardBg.width*this.keyBoardBg.scaleX/20;
        let rowPos = this.keyBoardBg.height*this.keyBoardBg.scaleY/6

        //First Row
        this.Letra_A.x = kbLTCornerX+columnPos*2;
		this.Letra_A.y = kbLTCornerY+rowPos;
        this.Letra_A.setScale(this.keyBoardBg.scale);

        this.Letra_B.x = kbLTCornerX+columnPos*4;
		this.Letra_B.y = kbLTCornerY+rowPos;
        this.Letra_B.setScale(this.keyBoardBg.scale);
        
        this.Letra_C.x = kbLTCornerX+columnPos*6;
		this.Letra_C.y = kbLTCornerY+rowPos;
        this.Letra_C.setScale(this.keyBoardBg.scale);
        
        this.Letra_D.x = kbLTCornerX+columnPos*8;
		this.Letra_D.y = kbLTCornerY+rowPos;
        this.Letra_D.setScale(this.keyBoardBg.scale);
        
        this.Letra_E.x = kbLTCornerX+columnPos*10;
		this.Letra_E.y = kbLTCornerY+rowPos;
        this.Letra_E.setScale(this.keyBoardBg.scale);
        
        this.Letra_F.x = kbLTCornerX+columnPos*12;
		this.Letra_F.y = kbLTCornerY+rowPos;
        this.Letra_F.setScale(this.keyBoardBg.scale);
        
        this.Letra_G.x = kbLTCornerX+columnPos*14;
		this.Letra_G.y = kbLTCornerY+rowPos;
        this.Letra_G.setScale(this.keyBoardBg.scale);
        
        this.Letra_H.x = kbLTCornerX+columnPos*16;
		this.Letra_H.y = kbLTCornerY+rowPos;
        this.Letra_H.setScale(this.keyBoardBg.scale);
        
        //Second Row
        this.Letra_I.x = kbLTCornerX+columnPos*2;
		this.Letra_I.y = kbLTCornerY+rowPos*2;
        this.Letra_I.setScale(this.keyBoardBg.scale);
        
        this.Letra_J.x = kbLTCornerX+columnPos*4;
		this.Letra_J.y = kbLTCornerY+rowPos*2;
        this.Letra_J.setScale(this.keyBoardBg.scale);
        
        this.Letra_K.x = kbLTCornerX+columnPos*6;
		this.Letra_K.y = kbLTCornerY+rowPos*2;
        this.Letra_K.setScale(this.keyBoardBg.scale);
        
        this.Letra_L.x = kbLTCornerX+columnPos*8;
		this.Letra_L.y = kbLTCornerY+rowPos*2;
        this.Letra_L.setScale(this.keyBoardBg.scale);
        
        this.Letra_M.x = kbLTCornerX+columnPos*10;
		this.Letra_M.y = kbLTCornerY+rowPos*2;
        this.Letra_M.setScale(this.keyBoardBg.scale);
        
        this.Letra_N.x = kbLTCornerX+columnPos*12;
		this.Letra_N.y = kbLTCornerY+rowPos*2;
        this.Letra_N.setScale(this.keyBoardBg.scale);
        
        this.Letra_O.x = kbLTCornerX+columnPos*14;
		this.Letra_O.y = kbLTCornerY+rowPos*2;
        this.Letra_O.setScale(this.keyBoardBg.scale);
        
        this.Letra_P.x = kbLTCornerX+columnPos*16;
		this.Letra_P.y = kbLTCornerY+rowPos*2;
        this.Letra_P.setScale(this.keyBoardBg.scale);
        
        //Confirmation row
        this.BarraCod.x = kbLTCornerX+columnPos*7;
        this.BarraCod.y = kbLTCornerY+rowPos*4
        this.BarraCod.setScale(this.keyBoardBg.scale);
        
        this.BorrarCod.x = kbLTCornerX+columnPos*7;
        this.BorrarCod.y = kbLTCornerY+rowPos*5
        this.BorrarCod.setScale(this.keyBoardBg.scale);

        this.ConfirmarCod.x = kbLTCornerX+columnPos*7+((this.BarraCod.width*this.BarraCod.scaleX)/2)*1.5;
        this.ConfirmarCod.y = kbLTCornerY+rowPos*4
        this.ConfirmarCod.setScale(this.keyBoardBg.scale);

        this.SalirCod.x = kbLTCornerX+columnPos*18;
        this.SalirCod.y = kbLTCornerY+rowPos/2
        this.SalirCod.setScale(this.keyBoardBg.scale);

        this.codeText.x = this.BarraCod.x-((this.BarraCod.width*this.BarraCod.scaleX)/2)*0.8;
        this.codeText.y = this.BarraCod.y*0.95;
        this.codeText.scaleX = this.BarraCod.scaleX;
        this.codeText.scaleY = this.BarraCod.scaleY;

        this.popupBg.x = game.canvas.width / 2;
		this.popupBg.y = game.canvas.height / 2;
        this.popupBg.setScale(this.sY*3/4);

        this.popupText.x = this.popupBg.x
        this.popupText.y = this.popupBg.y - this.popupBg.height*this.popupBg.scaleY/6;
        this.popupText.setScale(this.popupBg.scale);
        
        this.popupCancel.x = this.popupBg.x
        this.popupCancel.y = this.popupBg.y + this.popupBg.height*this.popupBg.scaleY/6;
        this.popupCancel.setScale(this.popupBg.scale);
        
        

    }

    showConnectingInterface() {
        //Show popup
        this.popupBg.setAlpha(1);
        //Show text that reads 'connecting...'
        this.popupText.setAlpha(1);
        this.popupText.text = 'Connecting...';
        //Disable interactive on all other buttons and also hide the keyboard thingy
        this.invisible(false);
        this.codeButton.setAlpha(0);
        this.button_create.setAlpha(0);
        this.button_back.setAlpha(0);
        this.codeButton.removeInteractive();
        this.button_create.removeInteractive();
        this.button_back.removeInteractive();
    }

    onRoomFull() {
        //Gets called if the room is full
        this.showCancelInterface('Couldn\'t connect: Room is full');
    }

    onRoomStarted() {
        //Gets called if the game has already started in that room
        this.showCancelInterface('Couldn\'t connect: Game has already started');
    }

    onRoomGone() {
        //Gets called if the room doesn't exist
        this.showCancelInterface('Couldn\'t connect: Room doesn\'t exist');
    }

    showCancelInterface(text) {
        //Change previous text with new text
        this.popupText.text = text;
        //show cancel button
        this.popupCancel.setAlpha(1);
        this.popupCancel.setInteractive({cursor: 'pointer'});
    }

    cancelConnection() {
        //Hide popup, text and cancel button
        this.popupBg.setAlpha(0);
        this.popupText.setAlpha(0);
        this.popupText.text = '';
        this.popupCancel.setAlpha(0);
        this.popupCancel.removeInteractive();
        //Set interactive on all main buttons
        this.codeButton.setAlpha(1);
        this.button_create.setAlpha(1);
        this.button_back.setAlpha(1);
        this.codeButton.setInteractive({cursor: 'pointer'});
        this.button_create.setInteractive({cursor: 'pointer'});
        this.button_back.setInteractive({cursor: 'pointer'});
    }

    joinRoom(roomCode)
    {
        let msg = new Object();
        msg.event = 'TRY_JOIN';
        msg.roomCode = roomCode;
        msg.picture = localStorage.getItem('lastAvatar');
        game.global.socketDir.send(JSON.stringify(msg));
    }
}