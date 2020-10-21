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
			break
			case 'TRY_JOIN_RETURN':
				console.log("["+msg.event+"] "+msg.message);
			break
			case 'PEOPLE_IN_ROOM_RETURN':
				console.log("["+msg.event+"] "+msg.message);
			break
			case 'TRY_LEAVE_RETURN':
				console.log("["+msg.event+"] "+msg.message);
			break
			default :
			break
		}
	}