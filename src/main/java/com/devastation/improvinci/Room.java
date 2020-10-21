package com.devastation.improvinci;

import java.util.LinkedList;

public class Room {
	
	private static LinkedList<Player> players = new LinkedList<Player>();
	private int numeroJugadores;
	private int maxPlayers;
	
	public Room(int numMaxPlayers) 
	{
		this.maxPlayers = numMaxPlayers;
	}
	
	public LinkedList<Player> getPlayers() 
	{
		return players;
	}
	
	public boolean tryJoin(Player player) 
	{
		if(numeroJugadores<maxPlayers) 
		{
			players.add(player);
			numeroJugadores++;
			player.setInRoom(true);
			return true;
		}
		return false;
	}
	
	public void tryleaveRoom(Player player) 
	{
		players.remove(players.indexOf(player));
		player.setInRoom(false);
		numeroJugadores--;
	}
}
