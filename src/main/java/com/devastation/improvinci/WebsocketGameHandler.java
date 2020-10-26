package com.devastation.improvinci;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.Random;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.util.SocketUtils;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;


public class WebsocketGameHandler extends TextWebSocketHandler {

	private static final String PLAYER_ATTRIBUTE = "PLAYER";
	private ObjectMapper mapper = new ObjectMapper();
	private AtomicInteger playerId = new AtomicInteger(0);
	private ConcurrentHashMap<String, Room> rooms = new ConcurrentHashMap(100);

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		Player player;
		synchronized(this) {
			player = new Player(playerId.incrementAndGet(), session);
			session.getAttributes().put(PLAYER_ATTRIBUTE, player);
		}
	}
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus){
		System.out.println("Player " + session.getId() + " disconnected. Reason: " + closeStatus.getReason());
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
					for(int i = 0; i<rooms.get(player.getRoomCode()).getPlayers().size(); i++) 
					{
						if (!rooms.get(player.getRoomCode()).getPlayers().get(i).WSSession().isOpen())
						{
							System.out.println("player " + rooms.get(player.getRoomCode()).getPlayers().get(i).getPlayerId() + " is not connected.");
							continue;
						}
						if(rooms.get(player.getRoomCode()).getPlayers().get(i).getPlayerId() != player.getPlayerId()) 
						{
							msg.put("idSender", player.getPlayerId());
							msg.put("idReciever", rooms.get(player.getRoomCode()).getPlayers().get(i).getPlayerId());
							msg.put("message", "Hola");
							rooms.get(player.getRoomCode()).getPlayers().get(i).WSSession().sendMessage(new TextMessage(msg.toString()));
						}
					}
				}
				else
				{
					msg.put("sent", false);
					player.WSSession().sendMessage(new TextMessage(msg.toString()));
				}
				break;
			case "CREATE_ROOM":
				if(!player.isInRoom())
				{
					msg.put("event", "CREATE_ROOM_RETURN");
					msg.put("roomCode", createRoom(3, session));
					player.WSSession().sendMessage(new TextMessage(msg.toString()));
				}
				break;
			case "TRY_JOIN":
				msg.put("event", "TRY_JOIN_RETURN");
				msg.put("roomCode",node.get("roomCode").asText());
				if(!player.isInRoom())
				{
					if(getRoom(node.get("roomCode").asText()).tryJoin(player, node.get("roomCode").asText()))
					{
						for(int i = 0; i<getRoom(node.get("roomCode").asText()).getPlayers().size(); i++) 
						{
							if (!getRoom(node.get("roomCode").asText()).getPlayers().get(i).WSSession().isOpen())
							{
								System.out.println("player " + getRoom(node.get("roomCode").asText()).getPlayers().get(i).getPlayerId() + " is not connected.");
								continue;
							}
							
							if(getRoom(node.get("roomCode").asText()).getPlayers().get(i).getPlayerId() != player.getPlayerId()) 
							{
								msg.put("message", "Player " + player.getPlayerId() + " joined the room");
								getRoom(node.get("roomCode").asText()).getPlayers().get(i).WSSession().sendMessage(new TextMessage(msg.toString()));
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
					String rC = player.getRoomCode();
					rooms.get(player.getRoomCode()).tryleaveRoom(player);
					for(int i = 0; i<rooms.get(rC).getPlayers().size(); i++) 
					{
						if (!rooms.get(rC).getPlayers().get(i).WSSession().isOpen())
						{
							System.out.println("player " + rooms.get(rC).getPlayers().get(i).getPlayerId() + " is not connected.");
							continue;
						}
						if(rooms.get(rC).getPlayers().get(i).getPlayerId() != player.getPlayerId()) 
						{
							msg.put("message", "Player " + player.getPlayerId() + " left the room");
							rooms.get(rC).getPlayers().get(i).WSSession().sendMessage(new TextMessage(msg.toString()));
						}
					}
					msg.put("message", "Left room succesfully");
					player.WSSession().sendMessage(new TextMessage(msg.toString()));
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
					String jugadores = "Room "+player.getRoomCode()+": ";
					for(int i = 0; i<rooms.get(player.getRoomCode()).getPlayers().size(); i++) 
					{
						if (!rooms.get(player.getRoomCode()).getPlayers().get(i).WSSession().isOpen())
						{
							System.out.println("player " + rooms.get(player.getRoomCode()).getPlayers().get(i).getPlayerId() + " is not connected.");
							continue;
						}
						jugadores+=rooms.get(player.getRoomCode()).getPlayers().get(i).getPlayerId()+", ";
					}
					msg.put("message", jugadores);
				}
				else 
				{
					msg.put("message", "You are not in a room");
				}
				player.WSSession().sendMessage(new TextMessage(msg.toString()));
				break;
			case "SEND_IMAGE":
				msg.put("event", "SEND_IMAGE_RETURN");
				if(player.isInRoom()) 
				{
					for(int i = 0; i<rooms.get(player.getRoomCode()).getPlayers().size(); i++) 
					{
						if (rooms.get(player.getRoomCode()).getPlayers().get(i).WSSession().isOpen())
						{
							if(rooms.get(player.getRoomCode()).getPlayers().get(i).getPlayerId() != player.getPlayerId()) 
							{
								msg.put("isImage", true);
								msg.put("image", node.get("image").asText());
								rooms.get(player.getRoomCode()).getPlayers().get(i).WSSession().sendMessage(new TextMessage(msg.toString()));
							}
							else
							{
								msg.put("isImage", false);
								msg.put("message", "Image sent");
								player.WSSession().sendMessage(new TextMessage(msg.toString()));
							}
						}
					}
				}
				else
				{
					msg.put("message", "You are not in a room");
					player.WSSession().sendMessage(new TextMessage(msg.toString()));
				}
				break;
			case "HEARTBEAT":
				msg.put("event", "HEARTBEAT_RETURN");
				msg.put("message", "Connection is alive");
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

	private String createRoom(Integer numberPeople, WebSocketSession session)
	{
		String roomCode = Integer.toHexString(session.getId().hashCode()).toUpperCase();
		rooms.put(roomCode,new Room(numberPeople, roomCode));
		return roomCode;
	}

	private Room getRoom(String number)
	{
		return rooms.get(number);
	}
}


