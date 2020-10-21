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
				game.global.receivedMsg=msg.event;
				game.global.message=msg.txt;
				console.log("¡FUNCIONA!");
				if (game.global.DEBUG_MODE) {
					console.log('[DEBUG] PRUEBA_RETURN.');
				}
			break
			default :
			break
		}
	}