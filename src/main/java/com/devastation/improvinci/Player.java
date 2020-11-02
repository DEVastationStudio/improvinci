package com.devastation.improvinci;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;


public class Player {
	private final WebSocketSession session;
	private final String playerId;
	private boolean inRoom;
	private String roomCode;
	private String picture;
	private boolean inGame;
	private boolean faker;
	
	public Player(String playerId, WebSocketSession session) {
		this.playerId= playerId;
		this.session= session;
		this.inRoom = false;
		this.roomCode = "X";
	}

	public String getPlayerId() {
		return playerId;
	}

	public boolean isInRoom() {
		return inRoom;
	}
	
	public void setInRoom(boolean b) 
	{
		inRoom = b;
	}

	public void setRoomCode(String rC) 
	{
		roomCode = rC;
	}

	public String getRoomCode() 
	{
		return roomCode;
	}

	public WebSocketSession WSSession() {
		return this.session;
	}

	/*public void sendMessage(String msg) throws Exception {
		this.session.sendMessage(new TextMessage(msg));
	}*/

	public void setPicture(String picture) {
		this.picture = picture;
	}
	public String getPicture() {
		return picture;
	}

	public boolean isInGame() {
		return inGame;
	}
	public void setInGame(boolean b) 
	{
		inGame = b;
	}

	public boolean isFaker() {
		return faker;
	}
	
	public void setFaker(boolean b) 
	{
		faker = b;
	}
}

