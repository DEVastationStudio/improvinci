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
                    this.scene.get('InGame').drawStart(msg.time, msg.round);
                    break;
                case 'TIME_UPDATE':
                    this.scene.get('InGame').updateTime(msg.time);
                    break;
                case 'ROUND_OVER':
                    this.scene.get('InGame').roundOver();
                    break;
                case 'ROUND_VOTES':
                    this.scene.get('InGame').updateVoteResults(msg);
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
        this.bg = this.add.image(game.canvas.width/2,  game.canvas.height/2,'Menu').setInteractive();

        //Buttons
        this.button_create = this.add.image(game.canvas.width / 4, game.canvas.height / 4, 'Ready_es').setInteractive({cursor: 'pointer'});
        this.button_join = this.add.image(game.canvas.width * 3 / 4, game.canvas.height / 4, 'Ready_host_es').setInteractive({cursor: 'pointer'});
        this.codeButton = this.add.image(game.canvas.width / 4, game.canvas.height / 2, 'Ready_host_es').setInteractive({cursor: 'pointer'});
        this.scaler();

        this.input.keyboard.addKey(8);
        this.codeFocus = false;
    	
        this.codeText = this.add.text(game.canvas.width * 3 / 4, game.canvas.height / 2, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
		this.button_create.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'CREATE_ROOM';
            msg.players = 9;
            game.global.socketDir.send(JSON.stringify(msg));
            this.button_create.removeInteractive();
            this.button_join.removeInteractive();
        }, this);
        
        this.codeButton.on('pointerdown', function (pointer){
            this.scene.codeFocus = true;
            //console.log(this.scene);
            this.codeButton.setTint(0x00ffff);
		}, this);
        this.bg.on('pointerdown', function (pointer){
            this.scene.codeFocus = false;
            this.codeButton.setTint(0xffffff);
		}, this);
		this.button_join.on('pointerdown', function (pointer){
            this.scene.get('PreLobby').tryJoin();
        }, this);
        
		this.input.keyboard.on('keydown', 
            function (event) { 
                //console.log(this.scene.scene);
                //console.log(event.keyCode);
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
                    //enter
                }
                /*switch (event.keyCode) {
            
                }*/
            }
        );
    }
    
    updateText(text) {
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
        this.button_join.removeInteractive();
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
        this.button_create.x = game.canvas.width / 4;
        this.button_create.y = game.canvas.height / 4;
        this.button_create.setScale(this.sY);

        this.button_join.x = game.canvas.width * 3 / 4;
        this.button_join.y = game.canvas.height / 4;
        this.button_join.setScale(this.sY);

        this.codeButton.x = game.canvas.width / 4;
        this.codeButton.y = game.canvas.height / 2;
        this.codeButton.setScale(this.sY);

        //Background
        this.bg.x = game.canvas.width / 2;
		this.bg.y = game.canvas.height / 2;
		this.bg.setScale(this.sX);
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