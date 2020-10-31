package com.devastation.improvinci;

import java.util.LinkedList;

public class Room {
	
	private LinkedList<Player> players = new LinkedList<Player>();
	private int numeroJugadores;
	private int maxPlayers;
	private String roomCode;
	private Player leader;
	
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
		synchronized (this) {
			if(numeroJugadores<maxPlayers) {
				players.add(player);
				numeroJugadores++;
				if (numeroJugadores == 1) {
					leader = player;
				}

				player.setInRoom(true);
				player.setRoomCode(rC);
				return true;
			}
		}
		return false;
	}
	
	public void tryleaveRoom(Player player) 
	{
		synchronized (this) {
			players.remove(players.indexOf(player));
			numeroJugadores--;
			if (player == leader) {
				if (numeroJugadores > 0) {
					leader = players.getFirst();
				}
			}
		}
		player.setInRoom(false);
		player.setRoomCode("X");
	}

	public String getRoomCode() 
	{
		return roomCode;
	}

	public Player getLeader() {
		return leader;
	}

}
