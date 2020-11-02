package com.devastation.improvinci;

import java.util.LinkedList;
import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.web.socket.TextMessage;

public class Room {
	
	private enum State { JOINING, WORD, DRAWING, VOTING, RESULTS, ENDING }

	private final static int TICK_DELAY = 1000;
	private final static int WORD_TIME = 3;
	private final static int RESULTS_TIME = 6;
	private ScheduledExecutorService scheduler;
	private State gameState;
	private ObjectMapper mapper = new ObjectMapper();
	private Random random = new Random();

	private LinkedList<Player> players = new LinkedList<Player>();
	private int numeroJugadores;
	private int maxPlayers;
	private String roomCode;
	private Player leader;
	private int rounds;
	private int curRound;
	private int drawTime;
	private int voteTime;
	private int gameTimer;
	private String word;

	
	public Room(int numMaxPlayers, String rCode) 
	{
		this.maxPlayers = numMaxPlayers;
		this.roomCode = rCode;
		rounds = 3;
		curRound = 0;
		drawTime = 30;
		voteTime = 30;
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
			//IF THIS PLAYER IS THE FAKER AND THE GAME IS RUNNING, RESTART THIS ROUND.
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

	public void startGame() {
		gameState = State.JOINING;
		scheduler = Executors.newScheduledThreadPool(1);
		scheduler.scheduleAtFixedRate(() -> tick(), TICK_DELAY, TICK_DELAY, TimeUnit.MILLISECONDS);
	}

	public void stopGame() {
		if (scheduler != null) {
			scheduler.shutdown();
		}
	}

	private void tick() {
		ObjectNode msg = mapper.createObjectNode();

		try {
			switch (gameState) {
				case JOINING:
					for (Player p : players) {
						if (!p.isInGame())
							return;
					} 
					sendWord(msg);
				break;
				case WORD:
				if (gameTimer > 0) {
					gameTimer--;
				} else {
					curRound++;
					gameState = State.DRAWING;
					gameTimer = drawTime;
					msg.put("event", "DRAW_START");
					msg.put("time", drawTime);
					msg.put("round", curRound);
					//Game mode over here
					for (Player p : players) {
						synchronized(p.WSSession()) {
							p.WSSession().sendMessage(new TextMessage(msg.toString()));
						}
					} 
				}
				break;
				case DRAWING:
					if (gameTimer > 0) {
						gameTimer--;
						msg.put("event", "TIME_UPDATE");
						msg.put("time", gameTimer);
						for (Player p : players) {
							synchronized(p.WSSession()) {
								p.WSSession().sendMessage(new TextMessage(msg.toString()));
							}
						} 
					} else {
						gameState = State.VOTING;
						gameTimer = voteTime;
						msg.put("event", "ROUND_OVER");
						for (Player p : players) {
							synchronized(p.WSSession()) {
								p.WSSession().sendMessage(new TextMessage(msg.toString()));
							}
						} 
					}
				break;
				case VOTING:
					if (gameTimer > 0) {
						gameTimer--;
						msg.put("event", "TIME_UPDATE");
						msg.put("time", gameTimer);
						for (Player p : players) {
							synchronized(p.WSSession()) {
								p.WSSession().sendMessage(new TextMessage(msg.toString()));
							}
						} 
					} else {
						//Enviar votos /!!!!!!!!!!!!!!!!\
						gameState = State.RESULTS;
						gameTimer = RESULTS_TIME;
					}
				break;
				case RESULTS:
					if (gameTimer > 0) {
						gameTimer--;
					} else {
						if (curRound == rounds) {
							gameState = State.ENDING;
							stopGame();
						}
						sendWord(msg);
					}
				break;
			}
		} catch (Exception ex) { }
	}

	private void sendWord(ObjectNode msg) throws Exception {

		synchronized (this) {
			//Choose random """impostor"""
			int faker = random.nextInt(players.size());

			for (int i = 0; i < players.size(); i++) {
				if (i == faker) {
					players.get(faker).setFaker(true);
				} else {
					players.get(faker).setFaker(false);
				}
			}

			//Choose """random""" word
			word = "FEDERICO";

			gameState = State.WORD;
			gameTimer = WORD_TIME;
			msg.put("event", "CHOSEN_WORD");
			msg.put("word", word);
			for (Player p : players) {
				msg.put("faker", p.isFaker());
				synchronized(p.WSSession()) {
					p.WSSession().sendMessage(new TextMessage(msg.toString()));
				}
			} 
		}
	}

	public int getMaxRounds() {
		return rounds;
	}
}
