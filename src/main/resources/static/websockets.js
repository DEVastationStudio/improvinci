// WEBSOCKET CONFIGURATOR
	game.global.socketDir = new WebSocket("ws://localhost:8080/improvinci");
	
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
				game.scene.keys.InGame.writeRoomCode("Room code: "+msg.roomCode);
				break;
			case 'CREATE_ROOM_RETURN':
				console.log("["+msg.event+"] "+msg.roomCode);
				game.scene.keys.InGame.joinRoom(msg.roomCode);
				break;
			case 'GET_ROOM_CODE_RETURN':
				console.log("["+msg.event+"] "+msg.roomCode);
				break;
			case 'PEOPLE_IN_ROOM_RETURN':
				console.log("["+msg.event+"] "+msg.message);
				break;
			case 'TRY_LEAVE_RETURN':
				console.log("["+msg.event+"] "+msg.message);
				break;
			case 'SEND_IMAGE_RETURN':
				game.scene.keys.InGame.randomize = false;
				if(msg.isImage)
				{
					console.log("["+msg.event+"] "+msg.image);
					game.scene.keys.InGame.decodeImage(msg.image);
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