#!/usr/bin/env node
var debug = require('debug')('my-application');
//var connect = require('connect');
// var restler = require('restler');
var app = require('../app');
var io = require('socket.io');
// var cookieParser = require('cookie-parser');
var connecter = require('../database');
connecter('mongodb://127.0.0.1/gameTestFourth');
var SessionSockets = require('session.socket.io');
var gameController = require('../controller/gameController');
var gameplayer = require('../controller/gameplayer');
var gameProperties = require('../controller/gameProperties');

// for testing
var TFT = require('../tester/TFT');
var TF2T = require('../tester/TF2T');
var AC = require('../tester/AlwaysCooperate');
var AD = require('../tester/AlwaysDefect');
var randAgent = require('../tester/randAgent');
var playgames = require('../tester/playgames');
var testRecommend = require('../tester/testRecommend');
// end testing

var playerHiitNumberMap = {};

app.set('port', process.env.PORT || 4000);
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
  
});
var ionew = io.listen(server);

sessionSockets = new SessionSockets(ionew, app.sessionstore, app.cookieNew);

var gamecontroller = new gameController(2);
var gameMap = {};
var gameStartStatus = false;
// var answerStores = {};
var numberOfGameControllers = 200;
var gameControllerArray = [];
var numberOfPairs = 0;
var gameCounter = 0;
var firstPlayerJustEntered = true;
var playersSocketDict = {};


var numberOfHumanToHumanGames = -1;
var gameTypes = gameProperties.gameTypes; 
ionew.sockets.on('connection', function (socket) {

var waitingTimeElapsedFunction = function()
	{
	
			if(!(socket.id in gameMap)) // if player has not been already mapped
			{
	
				var player = new gameplayer(gameCounter + "agent", null, true, 1, playerHiitNumberMap[gameCounter + "agent"]); //agents dont have socket
				if(typeof gameControllerArray[gameCounter] === 'undefined')
				{
					return;  // what should be done
				}
				gameControllerArray[gameCounter].addPlayer(player);				
				if(gameControllerArray[gameCounter].isFilled())
				{
					startGame();

					var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers);
					for(playerId in playersId)
					{
						var playerObject = gameControllerArray[gameCounter].gamePlayers[playersId[playerId]];
						if(!playerObject.isAgent)
						{ // only the non agent gets the recommendation
							// not needed for first game
							playerObject.setHasRecommender(false);
						}						
					}

					firstPlayerJustEntered = true;
					sendMessageAndStart();
				}
				else
				{
					firstPlayerJustEntered = false;
				}
				gameCounter += 1;
			}
			
	};

	
	socket.on('waitingTimeElapsed', waitingTimeElapsedFunction);
	

	socket.on('join', function(hiitNumber)
	{
		if(firstPlayerJustEntered)
		{
			gameControllerArray[gameCounter] = new gameController(2);
		}
		else
		{

		}
		playerHiitNumberMap[socket.id] = hiitNumber; // mapping socketid to hiitNumber.

		// get Game type
		var gameTypeIndex = gameCounter % gameTypes.length;
		var presentGameType = gameTypes[gameTypeIndex];
		startGameTypeForTheNextTwoPlayers(presentGameType);		
		if(!firstPlayerJustEntered && gameCounter >= numberOfHumanToHumanGames)
		{
			waitingTimeElapsedFunction();
		}
	});

	function startGameTypeForTheNextTwoPlayers(gameType)
	{
		// if normal
		if(gameType == 'normal')
		{
			// console.log('here normal');
			var player = new gameplayer(gameCounter, socket, false, 1, playerHiitNumberMap[socket.id]);
			gameControllerArray[gameCounter].addPlayer(player);
			if(gameControllerArray[gameCounter].isFilled())
			{
				startGame();
				
				firstPlayerJustEntered = true;
			}
			else
			{
				firstPlayerJustEntered = false;
			}
		}
		else if(gameType == "randomRecommenders")
		{
			// console.log('here randomRecommenders');			
			var player = new gameplayer(gameCounter, socket, false, 1, playerHiitNumberMap[socket.id]);
			gameControllerArray[gameCounter].addPlayer(player);
			if(gameControllerArray[gameCounter].isFilled())
			{
				startGame();
				var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers);
				
				
				for(var playerId in playersId)
				{
					
					gameControllerArray[gameCounter].gamePlayers[playersId[playerId]].setHasRecommender(true);
				}
				
				firstPlayerJustEntered = true;
			}
			else
			{
				firstPlayerJustEntered = false;
			}
		} 
		else if(gameType == "realRecommenders")
		{
			// console.log('here realRecommenders');
			var player = new gameplayer(gameCounter, socket, false, 1,playerHiitNumberMap[socket.id]);
			gameControllerArray[gameCounter].addPlayer(player);
			if(gameControllerArray[gameCounter].isFilled())
			{
				startGame();
				var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers);
				for(playerId in playersId)
				{
					gameControllerArray[gameCounter].gamePlayers[playersId[playerId]].setHasRecommender(false);
				}
				
				firstPlayerJustEntered = true;
			}
			else
			{
				firstPlayerJustEntered = false;
			}
		}
		else if(gameType == "oneRealRecommender")
		{
			// console.log('here oneRealRecommender');
			var player = new gameplayer(gameCounter, socket, false, 1, playerHiitNumberMap[socket.id]);
			gameControllerArray[gameCounter].addPlayer(player);
			if(gameControllerArray[gameCounter].isFilled())
			{
				startGame();
				var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers);
				for(playerId in playersId)
				{
					gameControllerArray[gameCounter].gamePlayers[playersId[playerId]].setHasRecommender(false);
					break;  // to make sure only one has a recommender
				}
				
				firstPlayerJustEntered = true;
			}
			else
			{
				firstPlayerJustEntered = false;
			}
		}

		else if(gameType == "oneRandomRecommender")
		{
			// console.log('here oneRandomRecommender');
			var player = new gameplayer(gameCounter, socket, false, 1, playerHiitNumberMap[socket.id]);
			gameControllerArray[gameCounter].addPlayer(player);
			if(gameControllerArray[gameCounter].isFilled())
			{
				startGame();
				var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers);
				for(playerId in playersId)
				{
					gameControllerArray[gameCounter].gamePlayers[playersId[playerId]].setHasRecommender(true);
					break;  // to make sure only one has a recommender
				}				
				firstPlayerJustEntered = true;
			}
			else
			{
				firstPlayerJustEntered = false;
			}
		}
		
		playersSocketDict[socket.id] = gameCounter; // dictionary to be used for getting players later on

		if(gameControllerArray[gameCounter].isFilled())
		{
			sendMessageAndStart();
			gameCounter += 1;		
		}

	}

	function startGame()
	{
	
		var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers); // createAgentToBeAddedToRooms();

// 		if(!gameStartStatus)
// 		{
			mapOutPlayers(playersId);
			// gameCounter += 1;
	}

	function sendMessageAndStart()
	{
		// console.log('game started ');
		for(var i in gameControllerArray[gameCounter].gamePlayers)
			{
				
				var message = "Your opponent's id is " + gameMap[i];
				if( !gameControllerArray[gameCounter].gamePlayers[i].isAgent)
				{
					if(gameControllerArray[gameCounter].gamePlayers[i].hasRecommender)
					{
						message += " But don't worry, you have a recommender ";
					}
						var playerToSendMessage = gameControllerArray[gameCounter].gamePlayers[i];
						var roomObject = gameControllerArray[gameCounter].gameRooms[playerToSendMessage.id]; 
						var numberOfRounds = roomObject.getGameRounds();
						
						var recommenderOption = playerToSendMessage.hasRecommender ? 1 : 0;
						var recc = playerToSendMessage.getRecommendation();
						var agentState = playerToSendMessage.getRecommenderVariables();
						playerToSendMessage.sessionSocket.emit('serverMessage', {count : 0, text : message, rounds : numberOfRounds, recommenderOptionValue : recommenderOption, recommendation : recc, agentState : agentState});
						playerToSendMessage.sessionSocket.emit('start');
						// console.log('server message and start emmited');
				}
			}
	}

		function mapOutPlayers(playersId)
	{
		
		
		for (var i = 0; i < playersId.length; i++)
		{
			var playerId = playersId[i];
			if(i % 2 == 0)
			{
				gameMap[playerId] = playersId[i + 1]
				gameControllerArray[gameCounter].setPlayersToRoom(playerId, playersId[i + 1] );
			}	
			else
			{
				gameMap[playerId] = playersId[i - 1];
				gameControllerArray[gameCounter].pointSecondPlayerToRoom(playerId, playersId[i - 1], Math.floor(i/2));
			}
		};
	} 


	socket.on('clientMessage', function(content) {
		var options = ['A', 'B'];
		
		var presentSocketGameCounter = playersSocketDict[socket.id];
		if(typeof presentSocketGameCounter === 'undefined')
		{
			return;
		}
		roomNumber =  gameControllerArray[presentSocketGameCounter].roomToSocket[socket.id]; //	roomToSocket[socket.id];
		store = gameControllerArray[presentSocketGameCounter].answerStores[roomNumber];


	if(store)
	{
		var roomObject = gameControllerArray[presentSocketGameCounter].gameRooms[socket.id]; 
		gameControllerArray[presentSocketGameCounter].gamePlayers[socket.id].setTimeOfAction(content.timeOfAction);
		store.addAnswer(content.gamePlay, gameControllerArray[presentSocketGameCounter].gamePlayers[socket.id]);
		
		var messageText = "<div class=\"alert alert-warning\"> Round " + store.round + " results</div>";

		if(roomObject.agentPresent)  //if agent is present in the game
		{
			var opponent = gameMap[socket.id];  //get agent id.
			// var agentMove = roomObject.player2.nextMove(content.gamePlay); // error code
			var contentOfHumanAnswer = store.answererSet[socket.id].chosenAnswer
			var agentMove = roomObject.player2.nextMove(contentOfHumanAnswer);
			
			store.addAnswer(agentMove, gameControllerArray[presentSocketGameCounter].gamePlayers[opponent]);
			
			// to be removed after test
			// to update the recommender
			var soc1 = roomObject.player1;
			var soc2 = roomObject.player2;
			var soc1Answer = store.answererSet[soc1.id].chosenAnswer;
			var soc2Answer = store.answererSet[soc2.id].chosenAnswer
			// how do I know I am first and agent is second
			soc1.updateRecommender(soc1Answer, soc2Answer);
			// end of to be removed

			var recc = gameControllerArray[presentSocketGameCounter].gamePlayers[socket.id].getRecommendation();
			var cummScore = store.players[socket.id].getCummulativeValue();
			var agentState = roomObject.player1.getRecommenderVariables();
			// console.log('agent state is ' + JSON.stringify(agentState));
			var message = {count : store.round, text : store.players[socket.id].printResults(), recommendation : recc, rounds : roomObject.getGameRounds(), cumm: cummScore, agentState: agentState, opponentSenseless:true};
			
			
			socket.emit('serverMessage', message);
			store.clear();
		}

		else // if agent is not present
		{
			if(store.isFilled())
			{					
				
				var soc1 = roomObject.player1;
				var soc2 = roomObject.player2;
				if(!soc1.isAgent)
				{ 
					// returns null if it has no recommender and also does nothing in update recommender
					soc1.updateRecommender(store.answererSet[soc1.id].chosenAnswer, store.answererSet[soc2.id].chosenAnswer);
					var cummScore = store.players[soc1.id].getCummulativeValue();
					var recommendedValue = soc1.getRecommendation();
					var agentState = soc1.getRecommenderVariables(); // recommender variables should be after the move
					var message = {count : store.round, text : store.players[soc1.id].printResults(), recommendation : recommendedValue , rounds : roomObject.getGameRounds(), cumm : cummScore, agentState: agentState, opponentSenseless:false};
					soc1.sessionSocket.emit('serverMessage', message);						
				}
				else
				{
					// take care of agents !!!	 already taken care of. Just trying to play safe
				}

				if(!soc2.isAgent)
				{
					
					soc2.updateRecommender(store.answererSet[soc2.id].chosenAnswer, store.answererSet[soc1.id].chosenAnswer);
					var cummScore = store.players[soc2.id].getCummulativeValue();
					
					var recommendedValue = soc2.getRecommendation();
					var agentState = soc2.getRecommenderVariables(); // recommender variables should be after move
					var message2 = {count : store.round, text : store.players[soc2.id].printResults(), recommendation : recommendedValue, rounds : roomObject.getGameRounds(), cumm :cummScore, agentState: agentState, opponentSenseless:false};
					soc2.sessionSocket.emit('serverMessage', message2);						
				}
				else
				{
					// take care of agents !!!
				}
				store.clear();
			}	
		}
		
	}
});


socket.on('disconnect', function()
{
	
	var presentSocketGameCounter = playersSocketDict[socket.id];
		if(typeof presentSocketGameCounter === 'undefined')
		{
			return;
		}
		else if(typeof gameControllerArray[presentSocketGameCounter] === "undefined")
		{
			// a case where a previous game sends an disconnect message
			return;
		}



	
	var roomNumber =  gameControllerArray[presentSocketGameCounter].roomToSocket[socket.id]; //	roomToSocket[socket.id];
	// roomNumber =  gamecontroller.roomToSocket[socket.id]; //	roomToSocket[socket.id];
	var gamePlayerPresent = gameControllerArray[presentSocketGameCounter].gamePlayers;
	if(gamePlayerPresent) // truthy
	{
		if(Object.keys(gamePlayerPresent).length == 1)
		{
			
			gamePlayerPresent[socket.id].connected = false;
			gameControllerArray[presentSocketGameCounter].firstPlayerAlreadyDisconnected = true;
		}
	}
	store = gameControllerArray[presentSocketGameCounter].answerStores[roomNumber];
	
	opponentId = gameMap[socket.id];
	if(store)
	{	
		var roomObject = gameControllerArray[presentSocketGameCounter].gameRooms[socket.id]; 
		if(!roomObject.agentPresent)
		{
			if(roomObject.gameRounds <= store.round)
			{
	
				return;
			}
		
		store.addAnswer(0, gameControllerArray[presentSocketGameCounter].gamePlayers[socket.id]);
		store.setPlayerConnectedStatusToFalse(socket.id);
		var messageText = "<div class=\"alert alert-warning\"> Round " + store.round + " results</div>";
		if(store.isFilled()) //when does this happen !!!
			{	
		
				opponentPlayerObject = gameControllerArray[presentSocketGameCounter].gamePlayers[opponentId];	
				opponentPlayerObject.updateRecommender(store.answererSet[opponentId].chosenAnswer, store.answererSet[socket.id].chosenAnswer);
				var cummScore = store.players[opponentId].getCummulativeValue();
				var message = {count : store.round, text : store.players[opponentId].printResults(), rounds : roomObject.getGameRounds(), cumm:cummScore, recommendation : opponentPlayerObject.getRecommendation()};

				// gameControllerArray[presentSocketGameCounter].gamePlayers[opponentId].sessionSocket.emit('serverMessage', message);
				gameControllerArray[presentSocketGameCounter].gamePlayers[opponentId].sessionSocket.emit('disconnectMessage', {cummScoreK : cummScore, roundK : store.round});
				store.clear();
			}
			else
			{ // store is not filled
				
				roomObject.gameRounds = store.round;  // set the present round to last round to end the game
			}
		}
	}
});


socket.on('timeOfAction', function(timeOfAction) { // used to set the time action took place
		var presentSocketGameCounter = playersSocketDict[socket.id];
		if(typeof presentSocketGameCounter === 'undefined')
		{
			return;
		}
		var playerWithTime =  gameControllerArray[presentSocketGameCounter].gamePlayers[socket.id]; //	roomToSocket[socket.id];
		playerWithTime.setTimeOfAction(timeOfAction);
		});

socket.on('forceDisconnect', function() {
		socket.disconnect();
	});

socket.on('chatHistory', function(historyOfChats) {
		var presentSocketGameCounter = playersSocketDict[socket.id];
		if(typeof presentSocketGameCounter === 'undefined')
		{
			return;
		}
		var playerWithHistory =  gameControllerArray[presentSocketGameCounter].gamePlayers[socket.id]; //	roomToSocket[socket.id];
		if(playerWithHistory)
		{
			playerWithHistory.saveHistory(historyOfChats);
		}
	});
	


	function getAgent(agentString)
	{
		if(agentString == 'TFT')
		{
			return new TFT();
		}
		else if(agentString === 'AD')
		{
			return new AD();
		}
		else if(agentString === 'AC')
		{
			return new AC();
		}
		else if(agentString === 'TF2T')
		{
			return new TF2T();
		}
		else if(agentString === 'Random')
		{
			return new randAgent();
		}
	}

	socket.on('playGame', function(agentAndProb) {
	
		var secondAgent = agentAndProb[0];
		var prob = agentAndProb[1];
		var agent2 = getAgent(secondAgent);
		var test = new testRecommend(agent2, 56, prob);
		var result = test.playGame();
		socket.emit('showGame', result);
		
	});



});