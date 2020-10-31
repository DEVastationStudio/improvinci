package com.devastation.improvinci;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;


public class Player {
	private final WebSocketSession session;
	private final int playerId;
	private boolean inRoom;
	private String roomCode;
	
	public Player(int playerId, WebSocketSession session) {
		this.playerId= playerId;
		this.session= session;
		this.inRoom = false;
		this.roomCode = "X";
	}

	public int getPlayerId() {
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

	public void sendMessage(String msg) throws Exception {
		this.session.sendMessage(new TextMessage(msg));
	}

	
}

