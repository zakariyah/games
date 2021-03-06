var AdherenceHistory = function()
{
	var history = []; // contains the player choice, recommended action, opponent choice, isWarningGiven, wasRecommendationAsked, intrusion
	
	this.updateHistory = function(contentFromServer)
	{
		
		if(!contentFromServer.recommendation)
		{
			return;
		}
		var round = contentFromServer.count;
		var recommendation = contentFromServer.agentState.agentChoice;
		history.push([-1, recommendation, -1, false, false, false]);
		
		if(round != 0)
		{
			// add the remaining component of the history
			history[round - 1][0] = contentFromServer.text.playerChoiceInNumber - 1;
			history[round - 1][2] = contentFromServer.text.opponentChoiceInNumber - 1;			
		}
	}

	this.setRecommendationInquiredAtGivenRound = function()
	{
		history[history.length - 1][4] = true; // recommendation was inquired
		return this.warnPlayerOfAdherence();
	}

	this.shouldTheExpertIntrude = function(presentChoice)
	{
		if(history.length == 1 || history.length == 0)
		{
			return false;
		}

		if(history[history.length - 1][1] == presentChoice)
		{
			return false;
		}

		var oneDisc = false;
		for(var i = history.length - 1; i >= 0; i--)
		{
			if(history[i][5] || history[i][4])
			{
				return false;
			}

			if(history[i][0] != history[i][1])
			{
				if(oneDisc)
				{
					history[i][5] = true;
					return true;
				}
				else
				{
					oneDisc = true;
				}
			}
			else
			{
				return false;
			}
		}
		return false;
	}

	this.shouldThePlayerBeWarned = function()
	{
		
		if(history.length == 1 || history.length == 0)
		{
			return false;
		}
		var lastHistory = history[history.length - 2]
		if(lastHistory[0] == lastHistory[1])
		{
			return false;
		}
		var oneMiss = false;
		for(var i = history.length - 2; i >= 0; i--)
		{
			if(history[i][3]) // warning already given
			{
				return false;
			}

			if(!history[i][4]) // player did not seek advice at given round
			{
				continue;
			}

			if(history[i][0] != history[i][1])
			{
				if(oneMiss)
				{
					history[history.length - 1][3] = true; // warning was given at the round
					return true;
				}
				else
				{
					oneMiss = true;
				}
			}
			else
			{
				return false;
			}

		}
	}

	var calculateRegret = function()
	{
		var payoff = [[3, -2], [5, 0]];
		var regret = 0;
		for(var i = 0; i < history.length - 1; i++)
		{
			var gotten = payoff[history[i][0]][history[i][2]];
			var couldHaveGotten = payoff[history[i][1]][history[i][2]];
			regret += (couldHaveGotten - gotten);
		}

		return regret;
	}

	this.warnPlayerOfAdherence = function()
	{
		if(!this.shouldThePlayerBeWarned())
		{
			return false;
		}
		else
		{
			var warn = ['You keep asking for my advice', 'but you don\'t seem to trust it', 'Am I doing something wrong'];
			var regret = calculateRegret();		
			if(regret > 0)
			{
				warn.push['But that does not seem to be the case.'];
				warn.push['Look down at the points you missed'];
			}
			return warn;
		}
	}

	this.showRegretToPlayer = function()
	{
		var regret = calculateRegret();
		if(regret <= 0)
		{
			return "";
		}
		else
		{
			return "You could have made " + regret + " more points if you had followed my advice";
		}
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

var AgentStateSettings = function()
{	

	this.getRecommendationIndex = function(agentState)
	{
		return agentState.agentChoice;
	}

	this.getOpponentInfoHtml = function(agentState, round)
	{
		var opponentState = agentState.opponentInfo;

		return opponentState;
	}

	this.getRecommendation = function(agentState, round)
	{
		var options = ['A', 'B'];
		var recommendation = agentState.recommendation;
		// recommendation.push('<button id="acceptRecommendation'+ round +'" >Click to accept</button>');
		return recommendation; 
	}

	this.getReason = function(agentState)
	{
		return agentState.reason;
	}
	
	this.getReasonProhibitingOtherAction = function(agentState)
	{
		return agentState.reasonOtherwise;
	}
	
	this.getHowToDoBetter = function(agentState)
	{
		return agentState.doBetter;
	}
}

var ChatBox = function(chatItemId, myCanvasContainer, adherenceHistory)
{	
	var chatListObject = document.getElementById(chatItemId);
	var contentFromServer;
	var questions = ['Tell me about my opponent', 'What should I do now?', 'Why?', 'Why shouldn\'t I do otherwise?','How do I do better?'];
	var feedbacks = ['You were wrong!', 'You were right'];
	var agentSettings = new AgentStateSettings();
	var roundsAlreadyAsked = {};
	var chatPanelBody = document.getElementById('panelBody');
	var typingText = document.getElementById('typingText');
	var acceptRecommendationButton;
	var	chattingHistory = [];

	var textAreaComment = document.getElementById('textAreaComment');
	var submitCommentButton = document.getElementById('submitCommentButton');

	this.getChattingHistory = function()
	{
		return chattingHistory;
	}


	submitCommentButton.onclick = function()
	{
			var text = textAreaComment.value;
			var roundNumber = getRoundNumber();
			chattingHistory.push([roundNumber, 'comment', false, text]);
			textAreaComment.value = '';
	}
	


	this.disableAcceptRecommendationButton = function()
	{
		if(acceptRecommendationButton)
		{
			acceptRecommendationButton.disabled = true;	
		}
		
	}

	var createRoundHeader = function(roundNumber)
	{
		roundsAlreadyAsked[roundNumber] = true;
		var roundHeader = '';
		roundHeader += '<li><div class="col-sm-offset-4 col-sm-4"><div style="background-color: #E6E6FA; border-radius: 25px; text-align: center;" class="well-sm">';
		roundHeader += 'Round ' + (roundNumber + 1);
		roundHeader += '</div></div></li>';

		return roundHeader;
	}

	var brightenTheTypingText = function()
	{
		typingText.style.display = 'block';
	}

	var hideTheTypingText = function()
	{
		typingText.style.display = 'none';
	}

	var createOneChatItem = function(isHuman, header, body, roundNumber)
	{	
		var chatItemHtml = '';
		if(!(roundNumber in roundsAlreadyAsked))
		{
			chatItemHtml += createRoundHeader(roundNumber);
		}
		var position = isHuman ? 'right' : 'left';
		var bdColor = isHuman ? '#D3FB9f' : '#ffffff';
		chatItemHtml += '<div class="' + (isHuman ? 'col-sm-offset-2 ': '') + 'col-sm-10" style="padding: 0px">';
		chatItemHtml += '<div style="background-color: ' +bdColor +';" class="well-sm pull-' + position +'">';
		chatItemHtml += body;
		chatItemHtml += '</div></div>';

		return chatItemHtml;
	}

	this.intrudePlayersGame =  function(presentChoice)
	{
		var warn = adherenceHistory.shouldTheExpertIntrude(presentChoice);
		if(warn)
		{
			var roundNumber = getRoundNumber();
			var question = 'Why don\'t you ask for advice.';
			var chatItem = createOneChatItem(false, 'S-script', question, roundNumber);
			showChat(chatItem, false, false);
			chattingHistory.push([roundNumber, 'intrusion', false, 'intrusion']);
		}
	}

	var acceptRecommendationButtonOnClick = function()
	{
		return function()
		{
			
			var option = agentSettings.getRecommendationIndex(contentFromServer.agentState);
			myCanvasContainer.setPlayerVisible(option + 1);
			
			acceptRecommendationButton.disabled = true;
		}
	}

	var showChat = function(chatItem, buttonClicked, isQuestion, acceptRecommendation, roundNumber)
	{
		// var chatList = (chatListObject.innerHTML + chatItem);
		// chatListObject.innerHTML = chatList;
		var listElement = document.createElement('li');
		listElement.innerHTML = chatItem;
		chatListObject.appendChild(listElement);
		chatPanelBody.scrollTop = chatPanelBody.scrollHeight;
		// problem likely to be here
		// chatlist is replacing itself.


		if(!isQuestion)
		{
			var snd = new Audio("/audio/videoplayback"); // sound to be played
			snd.play();	
		}
		if(buttonClicked)
		{
			buttonClicked.disabled = false;
			hideTheTypingText();
		}
		if(acceptRecommendation)
		{
			
			acceptRecommendationButton = document.getElementById('acceptRecommendation' + roundNumber);
// 			acceptRecommendationButton.onclick = acceptRecommendationButtonOnClick();
		}
	}

	this.addToChatList = function(question, answer, roundNumber, buttonClicked, acceptRecommendation)
	{
		var chatItem = createOneChatItem(true, 'You', question, roundNumber);
		showChat(chatItem, false, true);

		brightenTheTypingText();
		for(var i = 0 ; i < answer.length; i++)
		{
			chatItem = createOneChatItem(false, 'S-script', answer[i], roundNumber);
			if(i < answer.length - 1)
			{
				setTimeout(showChat, 2000 * (i + 1), chatItem);	
			}
			else
			{
				setTimeout(showChat, 2000 * (i + 1), chatItem, buttonClicked, false, acceptRecommendation, roundNumber);
			}
		}

	}	

	this.updateContentFromServer = function(content)
	{
		contentFromServer = content;
		
		adherenceHistory.updateHistory(contentFromServer);
	}

	var getRoundNumber = function()
	{
		return contentFromServer.count;
	}

	var getAnswerToQuestionNumber = function(questionNumber)
	{
		
		if(questionNumber == 0)
		{
			return agentSettings.getOpponentInfoHtml(contentFromServer.agentState, contentFromServer.count);
		}
		else if(questionNumber == 1)
		{
			var warn = adherenceHistory.setRecommendationInquiredAtGivenRound();
			var recc = agentSettings.getRecommendation(contentFromServer.agentState, contentFromServer.count);
			if(warn)
			{
				return warn.concat(recc);
			}

			return recc;
		}
		else if(questionNumber == 2)
		{
			return agentSettings.getReason(contentFromServer.agentState);
		}
		else if(questionNumber == 3)
		{
			return agentSettings.getReasonProhibitingOtherAction(contentFromServer.agentState);
		}
		else if(questionNumber == 4)
		{
			return agentSettings.getHowToDoBetter(contentFromServer.agentState);
		}
	}

	var getAnswerToQuestion = function(questionNumber, isQuestion)
	{
		if(isQuestion)
		{
			return getAnswerToQuestionNumber(questionNumber);
		}
		else
		{
			new ShowAlert("Feedbacks", "Sorry, not yet implemented");
			// return getAnswerToFeedbackNumber(questionNumber);
		}
	}
	this.getSolutionToQuestion = function(questionNumber, isQuestion, buttonClicked)
	{
		if(isQuestion)
		{
			var question = isQuestion ? questions[questionNumber] : feedbacks[questionNumber];
			var answer = getAnswerToQuestion(questionNumber, isQuestion);	
			var roundNumber = getRoundNumber();
			this.addToChatList(question, answer, roundNumber, buttonClicked, (isQuestion && (questionNumber == 1)));
			chattingHistory.push([roundNumber, questionNumber, isQuestion, answer]);
		}
	}
}	

var QuestionsToAsk = function(questionId, feedbackId, submitId, feedbackButtonId, chatBox)
{
	var questionCheckBoxes = [];
	var feedbackCheckBoxes = [];
	var questionSelect, feedbackSelect;
	var numberOfQuestions = 5;
	var numberOfFeedback = 2;
	var questionSubmitButton = document.getElementById(submitId);
	var feedbackSubmitButton = document.getElementById(feedbackButtonId);
	
	var enableAllButtons = function()
	{
		for(var i = 0; i < numberOfQuestions; i++)
		{
			questionCheckBoxes[i].disabled = false;
			questionCheckBoxes[i].checked = false;
		}
		for(var i = 0; i < numberOfFeedback; i++)
		{
			feedbackCheckBoxes[i].disabled = false;
			feedbackCheckBoxes[i].checked = false;
		}
	}

	this.moveToNextRound = function(contentFromServer)
	{
		chatBox.updateContentFromServer(contentFromServer);
		enableAllButtons();
	}

	var buttonOnClick = function(isQuestion)
	{		
		return function()
		{
			var questions = [];
			var checkBoxToUse = isQuestion ? questionCheckBoxes : feedbackCheckBoxes; 
			var buttonClicked = isQuestion ? questionSubmitButton : feedbackSubmitButton;
			
			var selectToUse = isQuestion ? questionSelect : feedbackSelect;
			var valueSelected = selectToUse.value;
			if(valueSelected == 0)
			{
				new ShowAlert('Selection Error', 'Please select an option!');
				// alert('Please select an option');
				return;
			}

			buttonClicked.disabled = true;
			checkBoxToUse[valueSelected-1].disabled = true;
			chatBox.getSolutionToQuestion( valueSelected-1, isQuestion, buttonClicked);
			if(isQuestion)
			{
				selectToUse.value = '0';	
			}
			
		}
	}

	questionSubmitButton.onclick = buttonOnClick(true);
	feedbackSubmitButton.onclick = buttonOnClick(false);

	for(var i = 0; i < numberOfQuestions; i++)
	{
		var checkBox = document.getElementById(questionId+(i+1));
		questionCheckBoxes.push(checkBox);
	}
	for(var i = 0; i < numberOfFeedback; i++)
	{
		var feedbackCheck = document.getElementById(feedbackId + (i+1));
		feedbackCheckBoxes.push(feedbackCheck);
	}
	questionSelect = document.getElementById('questionSelect');
	feedbackSelect = document.getElementById('feedbackSelect');
}