package com.devastation.improvinci;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;


public class Player {
	private final WebSocketSession session;
	private final int playerId;
	private boolean inRoom;
	
	public Player(int playerId, WebSocketSession session) {
		this.playerId= playerId;
		this.session= session;
		this.inRoom = false;
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
	public WebSocketSession WSSession() {
		return this.session;
	}

	public void sendMessage(String msg) throws Exception {
		this.session.sendMessage(new TextMessage(msg));
	}

	
}

