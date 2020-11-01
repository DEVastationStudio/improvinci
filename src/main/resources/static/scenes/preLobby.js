"use strict";

class PreLobby extends Phaser.Scene {
    constructor() {
        super("PreLobby");
    }

    preload() {
        game.global.socketDir = new WebSocket("wss://improvinci.herokuapp.com/improvinci");
        //game.global.socketDir = new WebSocket("ws://localhost:8080/improvinci");
	
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
                        console.log("["+msg.event+"] "+"("+msg.idSender+" => "+msg.idReciever+") - "+msg.message);
                    else
                        console.log("["+msg.event+"] "+"Message can't be sent");
                    break;
                case 'TRY_JOIN_RETURN':
                    console.log("["+msg.event+"] "+msg.message);
                    console.log(msg.playerArray);
                    console.log(msg.leader);

                    if (msg.joining) {
                        this.scene.start("Lobby", {code: msg.roomCode, players: msg.playerArray, leader: msg.leader});
                    } else {
                        this.scene.get("Lobby").updateAvatars({players: msg.playerArray, leader: msg.leader});
                    }
                    break;
                case 'CREATE_ROOM_RETURN':
                    console.log("["+msg.event+"] "+msg.roomCode);
                    this.scene.get("PreLobby").joinRoom(msg.roomCode);
                    break;
                case 'GET_ROOM_CODE_RETURN':
                    console.log("["+msg.event+"] "+msg.roomCode);
                    break;
                case 'PEOPLE_IN_ROOM_RETURN':
                    console.log("["+msg.event+"] "+msg.message);
                    break;
                case 'TRY_LEAVE_RETURN':
                case 'PLAYER_DISCONNECTION_RETURN':
                    console.log("["+msg.event+"] "+msg.message);
                    this.scene.get("Lobby").updateAvatars({players: msg.playerArray, leader: msg.leader});
                    break;
                case 'SEND_IMAGE_RETURN':
                    this.scene.get("InGame").randomize = false;
                    if(msg.isImage)
                    {
                        console.log("["+msg.event+"] "+msg.image);
                        this.scene.get("InGame").decodeImage(msg.image);
                    }
                    else
                        console.log("["+msg.event+"] "+msg.message);
                    break;
                case 'HEARTBEAT_RETURN':
                    if(!conectionUp){actualHeartBeat = Date.now(); conectionUp = true;}
                    lastHeartBeat = actualHeartBeat;
                    actualHeartBeat = Date.now();
                    console.log("["+msg.event+"] "+msg.message);
                    break;
                /*case 'PLAYER_DISCONNECTION_RETURN':
                    console.log("["+msg.event+"] "+msg.message);
                    this.scene.get("Lobby").updateAvatars({players: msg.playerArray, leader: msg.leader});
                    break;*/
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
                console.log("[heartMonitor] Heart is beating");
            }else
            {
                clearInterval(heartbeat);
                console.log("[heartMonitor] Heart died");
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
        this.bg = this.add.image(game.canvas.width/2,  game.canvas.height/2,'Menu');
        this.bg.scaleX = game.canvas.width/1920;
    	this.bg.scaleY = game.canvas.width/2200;

        
    	this.button_create = this.add.image(game.canvas.width / 4, game.canvas.height / 4, 'Ready_es').setInteractive();
    	this.button_join = this.add.image(game.canvas.width * 3 / 4, game.canvas.height / 4, 'Ready_host_es').setInteractive();
        
		this.button_create.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'CREATE_ROOM';
            msg.players = 3;
            game.global.socketDir.send(JSON.stringify(msg));
		}, this);
		
		this.button_join.on('pointerdown', function (pointer){
            let msg = new Object();
            msg.event = 'TRY_JOIN';
            msg.roomCode = prompt("Enter room code: ");
            msg.picture = localStorage.getItem("lastAvatar");
            game.global.socketDir.send(JSON.stringify(msg));
        }, this);
        
        this.add.text(game.canvas.width/2, 10, "CODE OVER HERE", { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    }
    
    update() { 

    }
    joinRoom(roomCode)
    {
        let msg = new Object();
        msg.event = 'TRY_JOIN';
        msg.roomCode = roomCode;
        msg.picture = localStorage.getItem("lastAvatar");
        game.global.socketDir.send(JSON.stringify(msg));
    }
}