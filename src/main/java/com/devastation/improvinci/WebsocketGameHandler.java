package com.devastation.improvinci;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.LinkedList;

public class WebsocketGameHandler extends TextWebSocketHandler {

	private static final String PLAYER_ATTRIBUTE = "PLAYER";
	private ObjectMapper mapper = new ObjectMapper();
	private AtomicInteger playerId = new AtomicInteger(0);
	
	private static LinkedList<Player> room= new LinkedList<Player>();
	
	public static LinkedList<Player> getRooms(){
		return room;
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		Player player;
		synchronized(this) {
			player = new Player(playerId.incrementAndGet(), session);
			session.getAttributes().put(PLAYER_ATTRIBUTE, player);
			room.add(player);
		}
	}
	
	protected synchronized void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		try {
			JsonNode node = mapper.readTree(message.getPayload());
			ObjectNode msg = mapper.createObjectNode();
			Player player;
			player = (Player) session.getAttributes().get(PLAYER_ATTRIBUTE);

			switch (node.get("event").asText()) {
			case "PRUEBA":
				for(int i = 0; i<room.size(); i++) 
				{
					if(room.get(i).getPlayerId() != player.getPlayerId()) 
					{
						msg.put("event", "PRUEBA_RETURN");
						msg.put("idSender", player.getPlayerId());
						msg.put("idReciever", room.get(i).getPlayerId());
						msg.put("message", "Hola");
						room.get(i).WSSession().sendMessage(new TextMessage(msg.toString()));
					}
				}
				break;
			default:
				break;
			}

		} catch (Exception e) {
			System.err.println("Exception processing message " + message.getPayload());
			e.printStackTrace(System.err);
		}
	}
}
