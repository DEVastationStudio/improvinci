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
	
	private static Room room = new Room(3);

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		Player player;
		synchronized(this) {
			player = new Player(playerId.incrementAndGet(), session);
			session.getAttributes().put(PLAYER_ATTRIBUTE, player);
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
				msg.put("event", "PRUEBA_RETURN");
				if(player.isInRoom()) 
				{
					msg.put("sent", true);
					for(int i = 0; i<room.getPlayers().size(); i++) 
					{
						if(room.getPlayers().get(i).getPlayerId() != player.getPlayerId()) 
						{
							msg.put("idSender", player.getPlayerId());
							msg.put("idReciever", room.getPlayers().get(i).getPlayerId());
							msg.put("message", "Hola");
							room.getPlayers().get(i).WSSession().sendMessage(new TextMessage(msg.toString()));
						}
					}
				}
				else
				{
					msg.put("sent", false);
					player.WSSession().sendMessage(new TextMessage(msg.toString()));
				}
				
				break;
			case "TRY_JOIN":
				msg.put("event", "TRY_JOIN_RETURN");
				if(!player.isInRoom()) 
				{
					if(room.tryJoin(player)) 
					{
						for(int i = 0; i<room.getPlayers().size(); i++) 
						{
							if(room.getPlayers().get(i).getPlayerId() != player.getPlayerId()) 
							{
								msg.put("message", "Player " + player.getPlayerId() + " joined the room");
								room.getPlayers().get(i).WSSession().sendMessage(new TextMessage(msg.toString()));
							}
							else 
							{
								msg.put("message", "Joined succesfully");
								player.WSSession().sendMessage(new TextMessage(msg.toString()));
							}
						}
					}
					else 
					{
						msg.put("message", "The room is full, try joining later");
						player.WSSession().sendMessage(new TextMessage(msg.toString()));
					}
				}
				else
				{
					msg.put("message", "You are already in a room");
					player.WSSession().sendMessage(new TextMessage(msg.toString()));
				}
				break;
			case "TRY_LEAVE":
				msg.put("event", "TRY_LEAVE_RETURN");
				if(player.isInRoom()) 
				{
					room.tryleaveRoom(player);
					for(int i = 0; i<room.getPlayers().size(); i++) 
					{
						if(room.getPlayers().get(i).getPlayerId() != player.getPlayerId()) 
						{
							msg.put("message", "Player " + player.getPlayerId() + " left the room");
							room.getPlayers().get(i).WSSession().sendMessage(new TextMessage(msg.toString()));
						}
						else 
						{
							msg.put("message", "Leaved room succesfully");
							player.WSSession().sendMessage(new TextMessage(msg.toString()));
						}
					}
				}
				else
				{
					msg.put("message", "You are not in a room");
					player.WSSession().sendMessage(new TextMessage(msg.toString()));
				}
				break;
			case "PEOPLE_IN_ROOM":
				msg.put("event", "PEOPLE_IN_ROOM_RETURN");
				if(player.isInRoom()) 
				{
					String jugadores = "Id's of players in room: ";
					for(int i = 0; i<room.getPlayers().size(); i++) 
					{
						jugadores+=room.getPlayers().get(i).getPlayerId()+", ";
					}
					msg.put("message", jugadores);
				}
				else 
				{
					msg.put("message", "You are not in a room");
				}
				player.WSSession().sendMessage(new TextMessage(msg.toString()));
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
