var slot = require('../controller/answerSlot');

var room = function(player1, player2)
{
	this.roomState = false;
	this.player1 = player1;
	this.player2 = player2;
	this.answerSlots = [];
	this.presentChoices = {};
	this.round = 1;
	this.agentPresent = false;
	this.gameRounds = 20 + Math.floor((Math.random() * 5));
	//this.gameRounds = 2; // + Math.floor((Math.random() * 2));

	this.changeRoomState = function()
	{
		this.roomState = true;
	}

	this.getGameRounds = function()
	{
		return this.gameRounds;
	}

	this.setAgentIsPresent = function()
	{
		this.agentPresent = true;
	}

	this.addAnswer = function(answerSlot)
	{
		this.answerSlots.push(answerSlot);
	}

	this.addChoice = function(choice, player)
	{
		this.presentChoices[player] = choice;
		if(this.presentChoicesIsFilled())
		{
			var roundAnswer = new slot(this.player1, this.player2, this.presentChoices[this.player1],
			 this.presentChoices[this.player2], this.round);
			this.addAnswer(roundAnswer);
			this.presentChoices = {};			
		}
	}

	this.presentChoicesIsFilled = function()
	{
		return Object.keys(this.presentChoices).length == 2;
	}
}

module.exports = room;