var Blocker = function()
{
	this.block = function(options)
	{
		for(i in options)
		{
			options[i].style.display = 'none';
		}
	}

	this.unblock = function(options)
	{
		for(i in options)
			{
				options[i].style.display = 'inline';
			}
	}

}

var OptionButton = function(htmlId1, htmlId2, nextRound)
{	
	var clickedColor = '#00FF00';
	var unClickedColor = '#FFFFFF';
	var but = [document.getElementById(htmlId1), document.getElementById(htmlId2)];
	var isClicked = [false, false];
	var nextRoundFunction = nextRound;
	// alert( '1' + JSON.stringify(nextRound));

	this.getButtons = function()
	{
		return but;
	}

	var butClick = function(butNumber)
	{
		return function()
		{
			// alert('called');
			isClicked[butNumber -1] = true;
			// but[butNumber-1].style.backgroundColor = clickedColor;
			// console.log(JSON.stringify(nextRoundFunction));
			nextRoundFunction(false);
			// isClicked[butNumber -1] = !isClicked[butNumber -1];
			// var col = isClicked[butNumber -1] ? clickedColor : unClickedColor;
			// but[butNumber-1].style.backgroundColor = col;

			// change second to false
			// but[(butNumber) % 2].style.backgroundColor = unClickedColor;
			// isClicked[butNumber %2] = false
		}
	}

	for(var i = 0; i < but.length; i++)
	{
		but[i].onclick = butClick(i+1);
	}
		
	this.reset = function()
	{
		but[0].disabled = false;
		but[1].disabled = false;
		// but[0].style.backgroundColor = '#FFFFFF';
		// but[1].style.backgroundColor = '#FFFFFF';
		isClicked = [false, false];
	}


	this.getSelection = function()
	{
		if(isClicked[0])
			return 1
		else if(isClicked[1])
			return 2
		else
			return 0
	}
	this.enableButtons = function(disable)
	{
		but[0].disabled = disable;
		but[1].disabled = disable;
	}
}

var Options = function(nextRoundFunction)
{
	var cumScore = 0;
	var roundNumber = 0;
	var actionButtons = new OptionButton('yourAction1', 'yourAction2', nextRoundFunction);
	// alert( '2' + JSON.stringify(nextRoundFunction));
	var tags = [document.getElementById('reviewTag'), document.getElementById('actionTag')];	

	var opponentAction = [document.getElementById('opponentAction1'), document.getElementById('opponentAction2')];
	var results = [];

	for(var i = 0; i< 4; i++)
	{
		results.push(document.getElementById('result' + (i+ 1)));	
	} 

	var score = document.getElementById('score');
	var earnings = document.getElementById('earnings');
	var submitButton = document.getElementById('nextButton');

	this.changeBackground = function(opponentChoice)
	{
		// opponentAction[opponentChoice - 1].style.backgroundColor = '#00FF00';
	}

	this.showLastChoice = function(myChoice, opponentChoice)
	{
		var ind = 2 * (myChoice - 1) + opponentChoice;
		results[ind - 1].style.backgroundColor = '#FFFF00';	
	}

	this.getActionButtons = function()
	{
		return actionButtons;
	}

	this.getSelection = function()
	{
		return actionButtons.getSelection();
	}

	this.setScore = function(scoreVal)
	{
// 		cumScore += scoreVal;
		roundNumber += 1;
		earnings.innerHTML = Number(scoreVal * 0.02).toFixed(2) + ' USD';
// 		alert(cumScore + ' ' + scoreVal);
		score.innerHTML = Number(scoreVal / roundNumber).toFixed(2);
	}

	this.makeSelection = function(disable)
	{
		if(disable)
		{
			actionButtons.enableButtons(disable);
		}
	}

	this.showTag = function(tagNo)
	{
		// 0 review, 1 action
		tags[tagNo].style.backgroundColor = '#009900';
		tags[(tagNo + 1) % 2].style.backgroundColor = '#CCCCCC';
	}

	this.clearSelection = function()
	{
		actionButtons.reset();
		for(var i = 0; i< 4; i++)
		{
			results[i].style.backgroundColor =  '#FFFFFF';
		}
		// opponentAction[0].style.backgroundColor =  '#FFFFFF';
		// opponentAction[1].style.backgroundColor =  '#FFFFFF';
		// this.showTag(1);
	}

}


var ShowAlert = function(header, body)
{
	var modalHeader = document.getElementById('myModalLabel');
	var modalBody = document.getElementById('myModalBody');
	modalHeader.innerHTML = header;
	modalBody.innerHTML = body;
	$(myModal).modal('show')
}

var CanvasContainer = function(socket)
{	
	var that2 = this;
	var myOptions;
	var submitButton;
	var gameManager;
	var score = 0;


	this.nextRound = function(forceSubmission)
	{	
		var that = this;
		return function()
		{
			// alert('eas ewefrgfr');
			var optionSelected = myOptions.getSelection();
			// alert('selected ' + optionSelected);
			if(optionSelected == 0)
			{
				if(!forceSubmission)
				{
					new ShowAlert('Selection Error', 'Please make a selection before submitting!!');
					// alert('Please make a selection before submitting');
					return;
				}
			}

		  var val = that.getPlayerSelection();
		  that.makeSelectionImpossible();
		  // that.getGameTimer().stopTimer();
		  that.getGameManager().stopTimer();
		  // myOptions.showTag(0);
		  that.setSubmitButtonVisible(false);
		  socket.emit('clientMessage', {'gamePlay' : val, 'timeOfAction' : 0});
		  // $.blockUI({ message: '<h1><img src="/images/ajax-loader.gif" /> <p> Moving to next round. Please wait.... </h1>' });
		  (new Blocker()).block(myOptions.getActionButtons().getButtons());
		}
	}

	this.startGame = function()
	{
		// document.getElementById('nextButton').onclick = this.nextRound(false);
		var that = this;
		// alert( '3' + this.nextRound());
		myOptions = new Options(this.nextRound());
		// alert('here');
		// var but = myOptions.getActionButtons();
		// alert(but);
		// for(var i = 0; i < but.length; i++)
		// {
		// 	alert('here' + i);
		// 	but[i].onclick = butClick(i+1, this.nextRound);
		// }
	}

	this.showPlayerAndOpponentChoice = function(playerChoice, opponentChoice, roundScore)
	{
		var choice = (opponentChoice - 1) * 2 + playerChoice;
		// choice range from 1 to 4
		var id = 'result' + (choice);
		document.getElementById(id).style.backgroundColor = '#00FF00';
		myOptions.changeBackground(opponentChoice);
		score += roundScore;
		myOptions.setScore(score);
	}

	this.getPlayerSelection = function()
	{
		return myOptions.getSelection();
	}

	this.setPlayerVisible = function(selection)
	{
		myOptions.showOptions(true);
		myOptions.setSelection(selection);
	}

	this.resetAll = function(myChoice, opponentChoice)
	{
		myOptions.makeSelection(false);
		myOptions.clearSelection();
		myOptions.showLastChoice(myChoice, opponentChoice);
		// myOptions.returnColorToDefault();
	}

	this.makeSelectionImpossible = function()
	{
		myOptions.makeSelection(true);
	}

	this.setSubmitButtonVisible  = function(visibility)
	{
		var submitButton = document.getElementById('nextButton');
		submitButton.style.display = visibility ? 'inline' : 'none';
		submitButton.disabled = !visibility ;
	}

	this.getOptions = function()
	{
		return myOptions;
	}
}


var TimerFunction = function(countIn, intervalIn, periodicFunction, endFunction,  decreaseAfterEnd, initialFunction)
{
	if(initialFunction)
	{
		initialFunction();
	}

	var before;
	var count = countIn;
	var interval = intervalIn;
	var mainCount = countIn;
	var counter;
	var decreasingTimeType = decreaseAfterEnd;

	var elapsedTime = 0;

	var timer = function()
	{
		var now = new Date();
	    // elapsedTime = (now.getTime() - before.getTime());
	    elapsedTime = Math.floor((now.getTime() - before.getTime())/interval); 
	    // leftValue += Math.floor(elapsedTime/interval);
	    count = mainCount - elapsedTime;
	    if (count < 1)
	    {
		    endFunction();
		    clearInterval(counter);
		    if(decreasingTimeType)
		    {
		    	mainCount = mainCount/2;
		    }
		    return;
		}
		periodicFunction(count, mainCount);
	}

	this.startTimer = function()
	{
		before = new Date();
		counter = setInterval(timer, interval);
	}	

	this.stopTimer = function()
	{
		clearInterval(counter);
	}

	this.getElapsedTime = function()
	{
		return elapsedTime;
	}
}

var WaitingTimeElapsed = function(socket)
{
	var totalWaitingTime = 300;
	var intervalWaiting = 1000;
	var waitingTimePeriodicFunction = function(count)
	{
		document.getElementById('timerBegin').innerHTML = count + " second" + ((count > 1) ? "s" : "") + " remaining. Please wait while we instantiate the bot";
	}

	var waitingTimeEndFunction = function()
	{
		document.getElementById('actionAndReview').style.display = 'block';
		document.getElementById('timerBegin').innerHTML = '';
		socket.emit('waitingTimeElapsed');
	}

	var that = new TimerFunction(totalWaitingTime, intervalWaiting, waitingTimePeriodicFunction, waitingTimeEndFunction, false);

	return that;
}

var GameManager = function(socket, gameManagerEndFunctionFromMain, endGameFunction)
{
	var totalGameTime = 6000;
	var intervalGame = 1000;
	var agitationStart = 30;
	var numberOfTimes = 0;
	var numberOfAllowedTimes = 2;
	var that;
	var gameManagerPeriodicFunction = function(count, mainCount)
	{
		if(count <= agitationStart)
		{
			var htmlToPrint = "<p>Please make a choice. You have  " + count + " sec" + ((count > 1) ? "s": "") + " remaining</p>";
			document.getElementById('agitationModalBody').innerHTML = htmlToPrint;
		}
		if(count == agitationStart)
		{
			$(agitationModal).modal('show');
		}
		
	}
	

	var  gameManagerEndFunction = function()
	{
		numberOfTimes += 1;
		if(numberOfTimes >= numberOfAllowedTimes)
		{
			var htmlToPrint = "<p>We are sorry. We had to end the game since you were not responding</p>";
			document.getElementById('agitationModalBody').innerHTML = htmlToPrint;
			$(agitationModal).modal('show');
			endGameFunction();
			return;
		}
		gameManagerEndFunctionFromMain();
		$(agitationModal).modal('hide');
	}

	that = new TimerFunction(totalGameTime, intervalGame, gameManagerPeriodicFunction, gameManagerEndFunction, true);

	return that;
}


// var GameTimer = function(socket, gameTimeEndFunction)
// {
// 	var totalGameTime = 30;
// 	var intervalGame = 1000;
// 	var gameTimePeriodicFunction = function(count, mainCount)
// 	{
// 		document.getElementById('timerBegin').innerHTML = count + " secs remaining";
// 	}

// 	var that = new TimerFunction(totalGameTime, intervalGame, gameTimePeriodicFunction, gameTimeEndFunction, false);

// 	return that;
// }


var ResultTimer = function(socket, resultTimeEndFunction)
{
	var totalResultTime = 5;
	var intervalResult = 1000;
	
	var resultTimePeriodicFunction = function(count, mainCount)
	{	
		document.getElementById('roundNumber').style.display = 'none';
		document.getElementById('timerBegin').innerHTML = "The next round starts in " + count + " second" + ((count > 1) ? "s" : "");
	}

	var resultTimeEndFunctionMain = function()
	{
		document.getElementById('timerBegin').innerHTML = "";
		resultTimeEndFunction();
	}

	var that = new TimerFunction(totalResultTime, intervalResult, resultTimePeriodicFunction, resultTimeEndFunctionMain, false);

	return that;
}

var PrisonersDilemma = function()
{	
	var hiitNumber = document.getElementById("hiitNumber").innerHTML;
	
	// var socket = io.connect('http://localhost:4000');
	var socket = io.connect('http://ec2-52-88-237-252.us-west-2.compute.amazonaws.com:4000/');
	var myCanvasContainer =  new CanvasContainer(socket);

	var blocker = new Blocker();
	var gameManager ;

	// var gameTimerEnd = function()
	// {
	// 	myCanvasContainer.nextRound(true)();
	// }

	// // waiting Time 
	var waitingTimeElapsed = new WaitingTimeElapsed(socket);

	// var gameTimer = new GameTimer(socket, gameTimerEnd);

	var elapsedTimes = [];	

	// var resultTimeEndFunction = function()
	// {
		
	// 	myCanvasContainer.setSubmitButtonVisible(true);
	// 	myCanvasContainer.resetAll();		
	// 	document.getElementById('roundNumber').style.display = 'inline';
	// }


	// var resultTimer = new ResultTimer(socket, resultTimeEndFunction);


	// // create the game manager functions
	var gameManagerEndFunctionFromMain = function()
	{
		myCanvasContainer.nextRound(true)();
	}

	var endGameFunction = function()
	{
		socket.emit('forceDisconnect');	
		document.getElementById('fullPage').innerHTML = "";			
	}

	// // create the game manager
	gameManager = new GameManager(socket, gameManagerEndFunctionFromMain, endGameFunction);

	

	// // add the timers to the game containers
	// myCanvasContainer.getGameTimer = function()
	// {
	// 	return gameTimer;
	// }

	myCanvasContainer.getResultTimer = function()
	{
		return resultTimer;
	}

	myCanvasContainer.getGameManager = function()
	{
		return gameManager;
	}

	// var startGame = function()
	// {
		
	// }

	var endGame = function(cummulative, numberOfRounds)
	{
		var htmlString = "<div class=\"alert alert-warning\"> Thank you very much, The game is over. You had a total of " + cummulative  +" points</div>";
        htmlString += "<div class=\"panel panel-default \"><div class=\"panel-heading\"> Please fill in the survey below</div><div class=\"panel-body\">";
        var playerHadRecommender = false;
        htmlString += postQuizQuestions(playerHadRecommender, cummulative, numberOfRounds);
        htmlString += "<div class='panel-footer'><button id='pagenext' >Next</button><button id='pagesubmit' style='display:none'>Submit</button></div>";
        htmlString += "</div></div>";
        var actionsElement = document.getElementById('fullPage');
        actionsElement.innerHTML = htmlString;
        var toCheckForNext = [['accessSkills', 'enjoy', 'familiarity', 'risk'], ['cooperative', 'forgiving', 'vengeful', 'selfish', 'predictable', 'cooperative1', 'forgiving1', 'vengeful1', 'selfish1', 'predictable1'], []];
        new Quiz('page', 3, false, false, toCheckForNext);
	}


	var secondToLast = function(content)
	{
		gameManager.startTimer();
		var briefInfo = content.text;
		var myTotalPayoff = briefInfo.total;
		
		myCanvasContainer.makeSelectionImpossible();
	    myCanvasContainer.showPlayerAndOpponentChoice(briefInfo.playerChoiceInNumber, briefInfo.opponentChoiceInNumber, myTotalPayoff);
	    // setAgentState(content.agentState);
		// showPlayerChoicesForGivenTime(reco);
		// document.getElementById('recommender').innerHTML = '';
		// resultTimer.startTimer();
		// var agentStates = agentSettings.getAgentStateHtml(content.agentState);
		// document.getElementById('agentState').innerHTML = agentStates;
		document.getElementById('roundNumber').style.display = 'inline';
		document.getElementById('roundNumber').innerHTML = 'Round ' + (content.count + 1);
		// questionsToAsk.moveToNextRound(content);
		// document.getElementById('questionAndFeedback').style.visibility = 'hidden';
		// gameHistory.setHistoryDivHtml();
		// setAgentVariables(content);
		myCanvasContainer.resetAll(briefInfo.playerChoiceInNumber, briefInfo.opponentChoiceInNumber);		
		document.getElementById('roundNumber').style.display = 'inline';
		
	}

	var serverMessage = function(content)
	{	
		if(content.count == 0)
		{
			waitingTimeElapsed.stopTimer();
			myCanvasContainer.startGame();
			gameManager.startTimer();
			// gameTimer.startTimer();
			document.getElementById('roundNumber').innerHTML = 'Round ' + (content.count + 1);
			document.getElementById('actionAndReview').style.display = 'block';
			document.getElementById('timerBegin').innerHTML = '';
		}
		else if(content.count < content.rounds)
		{
			var elapsedTime = gameManager.getElapsedTime();
			elapsedTimes.push(elapsedTime);
			
			var delay = 0.1;
			if(elapsedTimes.length > 1)
			{
				delay = elapsedTimes[elapsedTimes.length-2] - elapsedTimes[elapsedTimes.length - 1];	
				if(delay < 0)
				{
					delay = 0;
				}
			}
			setTimeout(function(){(new Blocker()).unblock(myCanvasContainer.getOptions().getActionButtons().getButtons());}, delay * 100);
			setTimeout(secondToLast, delay * 100, content);
			// $.unblockUI(); 
		}
		else
		{
			// gameHistory.clearPanel();
      		var cummulative = content.cumm;
      		var numberOfRounds = content.rounds;
      		endGame(cummulative, numberOfRounds);
      		setTimeout(function(){(new Blocker()).unblock(myCanvasContainer.getOptions().getActionButtons().getButtons());}, 500);
		}
	}


	var disconnectGame = function(content)
	{
		endGame(content.cummScoreK, content.roundK);
	}

	socket.on('serverMessage', serverMessage);
	// socket.on('start', startGame);
	socket.on('disconnectMessage', disconnectGame);


	socket.emit('join', hiitNumber);
	
	waitingTimeElapsed.startTimer();
}

pd = new PrisonersDilemma();