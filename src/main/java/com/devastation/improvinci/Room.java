package com.devastation.improvinci;

import java.util.LinkedList;

public class Room {
	
	private static LinkedList<Player> players = new LinkedList<Player>();
	private int numeroJugadores;
	private int maxPlayers;
	private String roomCode;
	
	public Room(int numMaxPlayers, String rCode) 
	{
		this.maxPlayers = numMaxPlayers;
		this.roomCode = rCode;
	}
	
	public LinkedList<Player> getPlayers() 
	{
		return players;
	}
	
	public boolean tryJoin(Player player, String rC) 
	{
		if(numeroJugadores<maxPlayers) 
		{
			players.add(player);
			numeroJugadores++;
			player.setInRoom(true);
			player.setRoomCode(rC);
			return true;
		}
		return false;
	}
	
	public void tryleaveRoom(Player player) 
	{
		players.remove(players.indexOf(player));
		player.setInRoom(false);
		player.setRoomCode("X");
		numeroJugadores--;
	}

	public String getRoomCode() 
	{
		return roomCode;
	}

}
