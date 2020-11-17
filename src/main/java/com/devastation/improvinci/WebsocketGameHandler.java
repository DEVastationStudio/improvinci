package com.devastation.improvinci;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;


public class WebsocketGameHandler extends TextWebSocketHandler {

	private static final String PLAYER_ATTRIBUTE = "PLAYER";
	private ObjectMapper mapper = new ObjectMapper();
	//private AtomicInteger playerId = new AtomicInteger(0);
	private ConcurrentHashMap<String, Room> rooms = new ConcurrentHashMap(100);
	private ConcurrentHashMap<String, Player> players = new ConcurrentHashMap(900);

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		Player player;
		synchronized(this) { //maybe? maybe not? who knows
			player = new Player(session.getId(), session);
			session.getAttributes().put(PLAYER_ATTRIBUTE, player);
			players.put(player.getPlayerId(), player);
		}
	}
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
		System.out.println("Player " + session.getId() + " disconnected. Reason: " + closeStatus.getReason());
		Player player;
		player = players.get(session.getId());
		if(player.isInRoom())
		{
			Room room = rooms.get(player.getRoomCode());
			room.tryleaveRoom(player);
			System.out.println(player.getRoomCode());
			ObjectNode msg = mapper.createObjectNode();
			msg.put("event", "PLAYER_DISCONNECTION_RETURN");
			msg.put("message",  player.getPlayerId()+" disconnected");

			ArrayNode arrNode = mapper.valueToTree(room.getPlayers());
			msg.putArray("playerArray").addAll(arrNode);

			for(int i = 0; i<room.getPlayers().size(); i++)
			{
				if(!room.getPlayers().get(i).getPlayerId().equals(player.getPlayerId()))
				{
					msg.put("leader", room.getPlayers().get(i) == room.getLeader());
					synchronized(room.getPlayers().get(i).WSSession()) {
						room.getPlayers().get(i).WSSession().sendMessage(new TextMessage(msg.toString()));
					}
				}
			}
		}
		players.remove(session.getId());
	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		try {
			JsonNode node = mapper.readTree(message.getPayload());
			ObjectNode msg = mapper.createObjectNode();
			Player player;
			player = (Player) session.getAttributes().get(PLAYER_ATTRIBUTE);

			switch (node.get("event").asText()) {
			case "CREATE_ROOM":
				if(!player.isInRoom())
				{
					msg.put("event", "CREATE_ROOM_RETURN");
					msg.put("roomCode", createRoom(node.get("players").asInt()));
					synchronized(player.WSSession()) {
						player.WSSession().sendMessage(new TextMessage(msg.toString()));
					}
				}
				break;
			case "TRY_JOIN":
				msg.put("event", "TRY_JOIN_RETURN");
				msg.put("roomCode",node.get("roomCode").asText().toUpperCase());
				player.setPicture(node.get("picture").asText());

				Room room = getRoom(node.get("roomCode").asText().toUpperCase());

				if (room == null) {
					msg.put("state","null");
					synchronized(player.WSSession()) {
						player.WSSession().sendMessage(new TextMessage(msg.toString()));
					}
					return;
				} else if (room.isInGame()) {
					msg.put("state","ingame");
					synchronized(player.WSSession()) {
						player.WSSession().sendMessage(new TextMessage(msg.toString()));
					}
					return;
				}

				if(!player.isInRoom() || player.getRoomCode().equals(node.get("roomCode").asText()))
				{
					if(room.tryJoin(player, node.get("roomCode").asText().toUpperCase()))
					{
						ArrayNode arrNode = mapper.valueToTree(room.getPlayers());
						msg.putArray("playerArray").addAll(arrNode);

						for(int i = 0; i<room.getPlayers().size(); i++) 
						{
							if (!room.getPlayers().get(i).WSSession().isOpen())
							{
								System.out.println("player " + room.getPlayers().get(i).getPlayerId() + " is not connected.");
								continue;
							}

							msg.put("leader", room.getPlayers().get(i) == room.getLeader());
							
							if(!room.getPlayers().get(i).getPlayerId().equals(player.getPlayerId())) 
							{
								msg.put("message", "Player " + player.getPlayerId() + " joined the room");
								msg.put("joining", false);
								msg.put("state","ok");

								synchronized(room.getPlayers().get(i).WSSession()) {
									room.getPlayers().get(i).WSSession().sendMessage(new TextMessage(msg.toString()));
								}
							}
							else 
							{
								msg.put("message", "Joined succesfully");
								msg.put("joining", true);
								msg.put("state","ok");
								synchronized(player.WSSession()) {
									player.WSSession().sendMessage(new TextMessage(msg.toString()));
								}
							}
						}
					}
					else
					{
						msg.put("message", "The room is full, try joining later");
						msg.put("state","full");
						synchronized(player.WSSession()) {
							player.WSSession().sendMessage(new TextMessage(msg.toString()));
						}	
					}
				}
				else
				{
					msg.put("message", "You are already in a room");
					msg.put("state","full");
					synchronized(player.WSSession()) {
						player.WSSession().sendMessage(new TextMessage(msg.toString()));
					}
				}
				break;
			case "TRY_LEAVE":
				msg.put("event", "TRY_LEAVE_RETURN");
				if(player.isInRoom()) 
				{
					String rC = player.getRoomCode();
					rooms.get(player.getRoomCode()).tryleaveRoom(player);

					ArrayNode arrNode = mapper.valueToTree(rooms.get(player.getRoomCode()).getPlayers());
					msg.putArray("playerArray").addAll(arrNode);

					for(int i = 0; i<rooms.get(rC).getPlayers().size(); i++) 
					{
						if (!rooms.get(rC).getPlayers().get(i).WSSession().isOpen())
						{
							System.out.println("player " + rooms.get(rC).getPlayers().get(i).getPlayerId() + " is not connected.");
							continue;
						}

						msg.put("leader", rooms.get(rC).getPlayers().get(i) == rooms.get(rC).getLeader());

						if(!rooms.get(rC).getPlayers().get(i).getPlayerId().equals(player.getPlayerId())) 
						{
							msg.put("message", "Player " + player.getPlayerId() + " left the room");
							synchronized(rooms.get(rC).getPlayers().get(i).WSSession()) {
								rooms.get(rC).getPlayers().get(i).WSSession().sendMessage(new TextMessage(msg.toString()));
							}
						}
					}
					msg.put("message", "Left room succesfully");
					synchronized(player.WSSession()) {
						player.WSSession().sendMessage(new TextMessage(msg.toString()));
					}
				}
				else
				{
					msg.put("message", "You are not in a room");
					synchronized(player.WSSession()) {
						player.WSSession().sendMessage(new TextMessage(msg.toString()));
					}
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
				synchronized(player.WSSession()) {
					player.WSSession().sendMessage(new TextMessage(msg.toString()));
				}
				break;
			case "SEND_IMAGE":
				msg.put("event", "SEND_IMAGE_RETURN");
				if(player.isInRoom()) 
				{
					for(int i = 0; i<rooms.get(player.getRoomCode()).getPlayers().size(); i++) 
					{
						if (rooms.get(player.getRoomCode()).getPlayers().get(i).WSSession().isOpen())
						{
							msg.put("player", player.getPlayerId());
							msg.put("image", node.get("image").asText());
							msg.put("isSelf", player.getPlayerId().equals(rooms.get(player.getRoomCode()).getPlayers().get(i).getPlayerId()));
							synchronized(rooms.get(player.getRoomCode()).getPlayers().get(i).WSSession()) {
								rooms.get(player.getRoomCode()).getPlayers().get(i).WSSession().sendMessage(new TextMessage(msg.toString()));
							}
						}
					}
				}
				else
				{
					msg.put("message", "You are not in a room");
					synchronized(player.WSSession()) {
						player.WSSession().sendMessage(new TextMessage(msg.toString()));
					}
				}
				break;
			case "HEARTBEAT":
				msg.put("event", "HEARTBEAT_RETURN");
				msg.put("message", "Connection is alive");
				synchronized(player.WSSession()) {
						player.WSSession().sendMessage(new TextMessage(msg.toString()));
					}
				break;
			case "PLAYER_DISCONNECTION":
				msg.put("event", "PLAYER_DISCONNECTION_RETURN");
				msg.put("message", "Player disconnected");
				rooms.get(node.get("roomCode").asText().toUpperCase()).getPlayers().get(0);
				
				break;
			case "START_GAME":
				msg.put("event", "START_GAME_RETURN");
				msg.put("maxRounds", rooms.get(player.getRoomCode()).getMaxRounds());
				ArrayNode arrNode = mapper.valueToTree(rooms.get(player.getRoomCode()).getPlayers());
				msg.putArray("players").addAll(arrNode);
				if(player.isInRoom()) 
				{
					for(int i = 0; i<rooms.get(player.getRoomCode()).getPlayers().size(); i++) 
					{
						if (rooms.get(player.getRoomCode()).getPlayers().get(i).WSSession().isOpen())
						{
							synchronized(rooms.get(player.getRoomCode()).getPlayers().get(i).WSSession()) {
								rooms.get(player.getRoomCode()).getPlayers().get(i).WSSession().sendMessage(new TextMessage(msg.toString()));
							}
						}
					}
				}
				rooms.get(player.getRoomCode()).startGame();
				break;
			case "GAME_LOADED":
				if (player.isInRoom()) {
					player.setInGame(true);
				}
				break;
			case "VOTE":
				if(player.isInRoom()) {
					Room r = rooms.get(player.getRoomCode());
					r.vote(node.get("playerVoted").asText(), player);
				}
				break;
			case "ALL_READY":
				msg.put("event", "ALL_READY_RETURN");
				ArrayNode arrayNode = mapper.valueToTree(rooms.get(player.getRoomCode()).getPlayers());
				msg.putArray("playerArray").addAll(arrayNode);
				msg.put("leader", player.equals(rooms.get(player.getRoomCode()).getLeader()));
				synchronized(player.WSSession()) {
					player.WSSession().sendMessage(new TextMessage(msg.toString()));
				}
				break;
			case "PEEK":
				if(player.isInRoom()) {
					Room r = rooms.get(player.getRoomCode());
					r.peek();
				}
				break;
			case "BE_PEEKED_RETURN":
				if(player.isInRoom()) {
					Room r = rooms.get(player.getRoomCode());
					r.returnPeek(node.get("image").asText());
				}
				break;
			case "CHECK":
				msg.put("event", "CHECK_RETURN");
				msg.put("type", node.get("type").asText());
				msg.put("isChecked", true);
				rooms.get(player.getRoomCode()).modeConfigurer(node.get("type").asText(), true);
				player.WSSession().sendMessage(new TextMessage(msg.toString()));
				rooms.get(player.getRoomCode()).informPlayers();
				break;
			case "NOCHECK":
				msg.put("event", "NOCHECK_RETURN");
				msg.put("type", node.get("type").asText());
				msg.put("isChecked", false);
				synchronized(rooms.get(player.getRoomCode()))
				{
					if(rooms.get(player.getRoomCode()).numActiveGamemodes()<=1 && !node.get("type").asText().equals("Vowels") ) break; 
					rooms.get(player.getRoomCode()).modeConfigurer(node.get("type").asText(), false);player.WSSession().sendMessage(new TextMessage(msg.toString()));
				}
				rooms.get(player.getRoomCode()).informPlayers();
				break;
			case "GET_CONFIG_ROOM":
				rooms.get(player.getRoomCode()).sendInfo(player);
				break;
			case "NUMRONDAS":
				rooms.get(player.getRoomCode()).setRounds(player, node.get("type").asBoolean());
				break;
			case "ROUNDTIME":
				rooms.get(player.getRoomCode()).setTimeRound(player, node.get("type").asBoolean());
				break;
			case "VOTETIME":
				rooms.get(player.getRoomCode()).setTimeVote(player, node.get("type").asBoolean());
				break;
			case "EASYMODE":
				rooms.get(player.getRoomCode()).easyMode(player);
				break;
			case "DIFFICULTMODE":
				rooms.get(player.getRoomCode()).difficultMode(player);
				break;
			case "DAILYMODE":
				rooms.get(player.getRoomCode()).dailyMode(player);
				break;
			case "GET_INIT_INFO":
				rooms.get(player.getRoomCode()).informPlayers();
				break;
			case "LANGUAGE_CHANGE":
				rooms.get(player.getRoomCode()).languageChange(player, node.get("type").asBoolean());
				break;
			default:
				break;
			}

		} catch (Exception e) {
			System.err.println("Exception processing message " + message.getPayload());
			e.printStackTrace(System.err);
		}
	}

	private String createRoom(Integer numberPeople)
	{
		boolean success = false;
		String roomCode;
		do {
			roomCode = "";
			synchronized (this) {
				LocalDateTime date = LocalDateTime.now();
				roomCode += Integer.toHexString(date.getHour()).toUpperCase();
				roomCode += Integer.toHexString(date.getMinute()).toUpperCase();
				roomCode += Integer.toHexString(date.getSecond()).toUpperCase();
				roomCode += Integer.toHexString(date.getNano()/10000000).toUpperCase();
			}
	
			String[] arrRoomCode = roomCode.split("");
			roomCode = "";
			
			for (int i = 0; i < arrRoomCode.length; i++) {
				switch(arrRoomCode[i])
				{
				case "1":
					roomCode += "A";
					break;
				case "2":
					roomCode += "B";
					break;
				case "3":
					roomCode += "C";
					break;
				case "4":
					roomCode += "D";
					break;
				case "5":
					roomCode += "E";
					break;
				case "6":
					roomCode += "F";
					break;
				case "7":
					roomCode += "G";
					break;
				case "8":
					roomCode += "H";
					break;
				case "9":
					roomCode += "I";
					break;
				case "A":
					roomCode += "J";
					break;
				case "B":
					roomCode += "K";
					break;
				case "C":
					roomCode += "L";
					break;
				case "D":
					roomCode += "M";
					break;
				case "E":
					roomCode += "N";
					break;
				case "F":
					roomCode += "O";
					break;
				case "0":
					roomCode += "P";
					break;
				}
			}
			success = !rooms.containsKey(roomCode);
		} while (!success);
		
		
		rooms.put(roomCode,new Room(numberPeople, roomCode, rooms));
		return roomCode;
	}

	private Room getRoom(String number)
	{
		return rooms.get(number);
	}
}


