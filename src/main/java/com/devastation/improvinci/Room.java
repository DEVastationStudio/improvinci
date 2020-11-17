package com.devastation.improvinci;

import java.io.LineNumberReader;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedList;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
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
	private boolean isEnglish = true;
	private LinkedList<String> words = new LinkedList<String>();
	private String fakerId;
	private final String[] modes = {"default","blind","limit","one","growing"};
	private boolean[] modeInUse = {true, true, true, true, true};
	private LinkedList<String> availableModes;
	private int peekTimeout = -1;
	private boolean peekedThisRound = false;
	private int votesLeft = 8;
	private ConcurrentHashMap<String, Room> rooms;
	private boolean gameStarted;
	private boolean vowels;
	private int numActGamemodes = 0;
	private int wrongVotes = 0;

	
	public Room(int numMaxPlayers, String rCode, ConcurrentHashMap<String, Room> rooms) 
	{
		this.maxPlayers = numMaxPlayers;
		this.roomCode = rCode;
		rounds = 9;
		curRound = 0;
		drawTime = 30;
		voteTime = 30;
		this.rooms = rooms;
		vowels = false;
		numActGamemodes = 5;
	}
	
	public LinkedList<Player> getPlayers() 
	{
		return players;
	}
	
	public boolean tryJoin(Player player, String rC) 
	{
		synchronized (this) {
			if(numeroJugadores<maxPlayers || players.contains(player)) {
				if (!players.contains(player))
				{
					players.add(player);
					numeroJugadores++;
					if (numeroJugadores == 1) {
						leader = player;
					}
				}

				player.setInRoom(true);
				player.setInLobby(true);
				player.setRoomCode(rC);
				return true;
			}
		}
		return false;
	}
	
	public void modeConfigurer(String type, Boolean isAvailable)
	{
		switch (type) {
			case "Default":
				modeInUse[0] = isAvailable;
				break;
			case "Blind":
				modeInUse[1] = isAvailable;
				break;
			case "Limit":
				modeInUse[2] = isAvailable;
				break;
			case "One":
				modeInUse[3] = isAvailable;
				break;
			case "Growing":
				modeInUse[4] = isAvailable;
				break;
			case "Vowels":
				vowels = isAvailable;
				break;
			default:
				break;
		}
	}

	public void easyMode(Player player)
	{
		modeInUse[0] = true;
		modeInUse[1] = false;
		modeInUse[2] = false;
		modeInUse[3] = false;
		modeInUse[4] = false;
		rounds = 5;
		drawTime = 45;
		voteTime = 30;
		vowels = true;
		sendInfo(player);
		informPlayers();
	}

	public void difficultMode(Player player)
	{
		modeInUse[0] = false;
		modeInUse[1] = true;
		modeInUse[2] = true;
		modeInUse[3] = true;
		modeInUse[4] = true;
		rounds = 9;
		drawTime = 15;
		voteTime = 15;
		vowels = false;
		sendInfo(player);
		informPlayers();
	}

	public void dailyMode(Player player)
	{
		modeInUse[0] = false;
		modeInUse[1] = true;
		modeInUse[2] = false;
		modeInUse[3] = true;
		modeInUse[4] = false;
		rounds = 2;
		drawTime = 15;
		voteTime = 15;
		vowels = false;
		sendInfo(player);
		informPlayers();
	}

	public void languageChange(Player player, Boolean isENG)
	{
		isEnglish = isENG;
		sendInfo(player);
		informPlayers();
	}

	public int numActiveGamemodes()
	{
		numActGamemodes = 0;
		for(int i = 0; i<modeInUse.length; i++)
		{
			if(modeInUse[i])
				numActGamemodes++;
		}
		return numActGamemodes;
	}

	public void informPlayers()
	{
		for(int i = 0; i<players.size(); i++)
		{
			try{
				ObjectNode msg = mapper.createObjectNode();
				msg.put("event", "ROOM_INFO_RETURN");
				msg.put("default",modeInUse[0]);
				msg.put("blind",modeInUse[1]);
				msg.put("limit",modeInUse[2]);
				msg.put("one",modeInUse[3]);
				msg.put("growing",modeInUse[4]);
				msg.put("numRounds", rounds);
				msg.put("voteTime", voteTime);
				msg.put("roundTime", drawTime);
				msg.put("vowels", vowels);
				msg.put("isEnglish", isEnglish);
				msg.put("numActiveGamemodes", numActiveGamemodes());
				synchronized( players.get(i).WSSession() ){ players.get(i).WSSession().sendMessage(new TextMessage(msg.toString())); }
			}catch(Exception ex){ ex.printStackTrace(); }
		}
	}

	public void sendInfo(Player player)
	{
		try{
			ObjectNode msg = mapper.createObjectNode();
			msg.put("event", "GET_CONFIG_ROOM_RETURN");
			msg.put("default",modeInUse[0]);
			msg.put("blind",modeInUse[1]);
			msg.put("limit",modeInUse[2]);
			msg.put("one",modeInUse[3]);
			msg.put("growing",modeInUse[4]);
			msg.put("numRounds", rounds);
			msg.put("voteTime", voteTime);
			msg.put("roundTime", drawTime);
			msg.put("vowels", vowels);
			msg.put("isEnglish", isEnglish);
			msg.put("numActiveGamemodes", numActiveGamemodes());
			synchronized( player.WSSession() ){ player.WSSession().sendMessage(new TextMessage(msg.toString())); }
		}catch(Exception ex){ ex.printStackTrace(); }
	}

	public void setRounds(Player player, Boolean isPlus)
	{
		if(rounds<9 && isPlus)
			rounds++;
		else
			if(rounds>1 && !isPlus)
				rounds--;
		try{
			ObjectNode msg = mapper.createObjectNode();
			msg.put("event", "PLUSCONFIG_RETURN");
			msg.put("type", "numRounds");
			msg.put("amount", rounds);
			synchronized( player.WSSession() ){ player.WSSession().sendMessage(new TextMessage(msg.toString())); }
		}catch(Exception ex){ ex.printStackTrace(); }
		informPlayers();
	}

	public void setTimeRound(Player player, Boolean isPlus)
	{
		if(drawTime<90 && isPlus)
			drawTime+=15;
		else
			if(drawTime>15 && !isPlus)
				drawTime-=15;
		try{
			ObjectNode msg = mapper.createObjectNode();
			msg.put("event", "PLUSCONFIG_RETURN");
			msg.put("type", "roundTime");
			msg.put("amount", drawTime);
			synchronized( player.WSSession() ){ player.WSSession().sendMessage(new TextMessage(msg.toString())); }
		}catch(Exception ex){ ex.printStackTrace(); }
		informPlayers();
	}

	public void setTimeVote(Player player, Boolean isPlus)
	{
		if(voteTime<90 && isPlus)
			voteTime+=15;
		else
			if(voteTime>15 && !isPlus)
				voteTime-=15;
		try{
			ObjectNode msg = mapper.createObjectNode();
			msg.put("event", "PLUSCONFIG_RETURN");
			msg.put("type", "voteTime");
			msg.put("amount", voteTime);
			synchronized( player.WSSession() ){ player.WSSession().sendMessage(new TextMessage(msg.toString())); }
		}catch(Exception ex){ ex.printStackTrace(); }
		informPlayers();
	}

	public void tryleaveRoom(Player player) 
	{
		synchronized (this) {
			//IF THIS PLAYER IS THE FAKER AND THE GAME IS RUNNING, RESTART THIS ROUND.
			//IF IT'S NOT, JUST NOTIFY EVERYONE

			System.out.println(player.getPlayerId());
			System.out.println(fakerId);
			if (player.getPlayerId().equals(fakerId)) {

				gameState = State.VOTING;
				gameTimer = 2;

				ObjectNode msg = mapper.createObjectNode();
				msg.put("event", "ROUND_OVER");

				//Clearing all votes before sending the messages just in case they vote someone before their votes are cleared
				synchronized(this) {
					votesLeft = players.size()-1;
					for (Player p : players) {
						p.clearVotes();
					} 
					wrongVotes = 0;

					for (Player p : players) {
						synchronized(p.WSSession()) {
							if (p.WSSession().isOpen())
								try { p.WSSession().sendMessage(new TextMessage(msg.toString())); } catch (Exception e){ e.printStackTrace(); }
						}
					} 
				}
			}

			players.remove(players.indexOf(player));
			numeroJugadores--;
			if (player == leader) {
				if (numeroJugadores > 0) {
					leader = players.getFirst();
				}
			}
			for (Player p : players) {
				ObjectNode msg = mapper.createObjectNode();
				msg.put("event", "PLAYER_LEFT");
				msg.put("image", player.getPicture());
				synchronized( p.WSSession() ){ try { p.WSSession().sendMessage(new TextMessage(msg.toString())); } catch (Exception e) { e.printStackTrace(); } }
			}
			if (players.isEmpty()) {
				stopGame();
				rooms.remove(roomCode);
				System.out.println("Room " + roomCode + " closed.");
			} else if (players.size() < 3 && gameStarted) {
				try {finishGame(mapper.createObjectNode());} catch (Exception e) {e.printStackTrace();}
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
		gameStarted = true;
		synchronized(this) {
			for (Player p : players) {
				if (!p.isInLobby()) {
					synchronized(p.WSSession()) {
						try {p.WSSession().close();} catch (Exception e) {e.printStackTrace();}
					}
				}
			}
		}

		FileInputStream fs;
		BufferedReader br;
		try {
			words.clear();
			String language = "";
			if(isEnglish)
				language = "wordsENG.txt";
			else
				language = "wordsESP.txt";
			FileReader input = new FileReader(language);
			LineNumberReader count = new LineNumberReader(input);
			int lines = (int)count.lines().count();
			count.close();

			LinkedList<Integer> numWords = new LinkedList<Integer>();
			int aux = -1;
			
			for(int i = 0; i<rounds; i++)
			{
				do
				{
					aux = random.nextInt(lines);
				}
				while(numWords.contains(aux));

				numWords.add(aux);
			}
			
			Collections.sort(numWords);

			fs = new FileInputStream(language);
			br = new BufferedReader(new InputStreamReader(fs));
			int j = 0;
			for(int i = 0; i <= numWords.getLast(); ++i)
			{
				if(i == numWords.get(j))
				{
					words.add(br.readLine());
					j++;
				}
				else
					br.readLine();
			}
			br.close();
		} catch(Exception ex) { 
			ex.printStackTrace();
		}
		
		curRound = 0;
		gameState = State.JOINING;
		scheduler = Executors.newScheduledThreadPool(1);
		scheduler.scheduleAtFixedRate(() -> tick(), TICK_DELAY, TICK_DELAY, TimeUnit.MILLISECONDS);
	}

	public void stopGame() {
		if (scheduler != null) {
			scheduler.shutdown();
		}
		synchronized(this) {
			for (Player p : players) {
				if (!leader.equals(p))
					p.setInLobby(false);
			}
		}
		gameStarted = false;
		System.out.println("Game ended in room " + roomCode + ".");
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
					availableModes = new LinkedList<String>();
					for(int i = 0; i<modes.length; i++)
					{
						if(modeInUse[i])
							availableModes.add(modes[i]);
					}
					for (Player p : players) {
						p.setScore(0);
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
					msg.put("vowels", vowels);
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
						if (!peekedThisRound) {
							if (peekTimeout > -1 && peekTimeout < 3) {
								peekTimeout++;
							} else if (peekTimeout >= 3) {
								peekTimeout = -1;
								peek();
							}
						}
					} else {
						gameState = State.VOTING;
						gameTimer = voteTime;
						msg.put("event", "ROUND_OVER");

						//Clearing all votes before sending the messages just in case they vote someone before their votes are cleared
						synchronized(this) {
							votesLeft = players.size()-1;
							for (Player p : players) {
								p.clearVotes();
							} 

							for (Player p : players) {
								synchronized(p.WSSession()) {
									p.WSSession().sendMessage(new TextMessage(msg.toString()));
								}
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
						//Send votes /!!!!!!!!!!!!!!!!\
						msg.put("event", "ROUND_VOTES");
						msg.put("players",players.size());
						for (int i = 0; i < players.size(); i++) {
							if (players.get(i).getPlayerId().equals(fakerId)) {
								players.get(i).addScore(wrongVotes);
								if (wrongVotes == 0) players.get(i).addScore(-1);
							}
							msg.put("id_"+i,players.get(i).getPlayerId());
							msg.put("votes_"+i,players.get(i).getVotes());
						}
						msg.put("faker", fakerId);
						for (Player p : players) {
							synchronized(p.WSSession()) {
								p.WSSession().sendMessage(new TextMessage(msg.toString()));
							}
						} 
						gameState = State.RESULTS;
						gameTimer = RESULTS_TIME;
					}
				break;
				case RESULTS:
					if (gameTimer > 0) {
						gameTimer--;
					} else {
						if (curRound == rounds) {
							finishGame(msg);
						} else {
							sendWord(msg);
						}
					}
				break;
			}
		} catch (Exception ex) { ex.printStackTrace(); }
	}

	private void finishGame(ObjectNode msg) throws IOException {
		//game end message, etc.
		msg.put("event", "POINTS");
		msg.put("roomCode",roomCode);
		LinkedList<Player> sortedPlayers = (LinkedList<Player>)players.clone();
		Collections.sort(sortedPlayers, (b, a) -> Integer.compare(a.getScore(), b.getScore()));
		ArrayNode arrNode = mapper.valueToTree(sortedPlayers);
		msg.putArray("playerArray").addAll(arrNode);
		for (Player p : players) {
			synchronized(p.WSSession()) {
				msg.put("leader", p == leader);
				p.WSSession().sendMessage(new TextMessage(msg.toString()));
			}
		} 
		gameState = State.ENDING;
		stopGame();
	}

	private void sendWord(ObjectNode msg) throws Exception {
		synchronized (this) {
			peekedThisRound = false;
			peekTimeout = -1;
			//Choose random """impostor"""
			int faker = random.nextInt(players.size());
			System.out.println("["+LocalDateTime.now()+"]DEBUG: Generated faker " + faker);

			for (int i = 0; i < players.size(); i++) {
				//boolean isFaker = (i==faker);
				//players.get(i).setFaker(isFaker);
				if (i==faker) {
					fakerId = players.get(i).getPlayerId();
					break;
				}
			}

			word = words.remove(random.nextInt(words.size()));
			//word = "FEDERICO";
			//Choose draw mode
			String drawMode = availableModes.get(random.nextInt(availableModes.size()));

			gameState = State.WORD;
			gameTimer = WORD_TIME;
			msg.put("event", "CHOSEN_WORD");
			msg.put("word", word);
			msg.put("drawMode", drawMode);
			for (Player p : players) {
				msg.put("faker", p.getPlayerId().equals(fakerId));
				synchronized(p.WSSession()) {
					p.WSSession().sendMessage(new TextMessage(msg.toString()));
				}
			} 
		}
	}

	public int getMaxRounds() {
		return rounds;
	}

	public void vote(String id, Player votingPlayer) {
		synchronized (this) {
			votesLeft--;
			for (Player player : players) {
				if (player != null) {
					if (player.getPlayerId().equals(id)) {
						player.addVote();
						if (id.equals(fakerId)) {
							votingPlayer.addScore(2);
						} else {
							player.addScore(-1);
							wrongVotes++;
						}
						break;
					}
				}
			}
			if (votesLeft == 0 && gameTimer > 3 && gameState == State.VOTING) {
				gameTimer = 3;
			}
		}
	}

	public void peek() {
		synchronized (this) {
			if (players.size() == 1) return;
			peekTimeout = 0;
			int chosenPlayer = random.nextInt(players.size()-1);
			int fakerPos = -1;
			for (int i = 0; i < players.size(); i++) {
				Player p = players.get(i);
				if (p.getPlayerId().equals(fakerId)) {
					fakerPos = i;
				}
			} 

			if (chosenPlayer >= fakerPos) chosenPlayer++;
			Player peekedPlayer = players.get(chosenPlayer);

			ObjectNode msg = mapper.createObjectNode();
			msg.put("event", "BE_PEEKED");

			synchronized(peekedPlayer.WSSession()) {
				try {
				peekedPlayer.WSSession().sendMessage(new TextMessage(msg.toString()));
				} catch (Exception e) {
					e.printStackTrace();
				}
			}

		}
	}
	public void returnPeek(String image) {
		synchronized (this) {
			if (peekedThisRound) return;
			peekedThisRound = true;
			Player fakerPlayer = players.get(0); //Just in case it breaks
			for (Player p : players) {
				if (p.getPlayerId().equals(fakerId)) {
					fakerPlayer = p;
				}
			}

			ObjectNode msg = mapper.createObjectNode();
			msg.put("event", "PEEK_RETURN");
			msg.put("image", image);

			synchronized(fakerPlayer.WSSession()) {
				try {
				fakerPlayer.WSSession().sendMessage(new TextMessage(msg.toString()));
				} catch (Exception e) {
					e.printStackTrace();
				}
			}

		}
	}

	public boolean isInGame() {
		return gameStarted;
	}
}
