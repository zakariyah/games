function isOneChecked(elementsName)
	{
		var elems = document.getElementsByName(elementsName);
		for(var i in elems)
		{
			if(elems[i].checked)
			{
				return true;
			}
		}
		return false;
	}

function checkFormInput()
{
	var names = [ 'peoplebullied', 'peoplegullible' , 'peopleforgiving', 'peopleautonomous', 'peopleselfish', 'peopledevious', 'peoplecooperative'];
	for(var i in  names)
	{
		if(!isOneChecked(names[i]))
		{	
			alert('Please answer all the questions before submitting');
			return false;
		}
	}

	window.onbeforeunload = function() {
        return "";
    }

	return true;
}

function postQuizQuestions(hasRecommenders, cummulativeScore, numberOfRounds)
{
	var htmlString = "<form name='postquizsurvey' method='post' action='./postquizsurvey' class='form-horizontal' role='form' onsubmit='return checkFormInput();'>";
	
	htmlString += "<input type='hidden' name='cummulativeScore' value='" +cummulativeScore +"'>";
  	htmlString += "<input type='hidden' name='numberOfRounds' value='" + numberOfRounds +"'>";
	

	htmlString += "<div id='page1' style='display:block'>";
	  // htmlString += "Page 1";
	htmlString += "<div class='form-group'>";
	htmlString += "<label for='inputEmail3' class='control-label'>1. How would you assess the skills of the associate compared to your own?</label></div>";

	htmlString += "<div class='form-group'><div class='col-sm-10'> <div class='checkbox'>";
	htmlString += "<label><input type='radio' name='accessSkills'  value='1'>  Much less skilled";
	htmlString += "</label><label><input type='radio' name='accessSkills'  value='2'>  A little worse";
	htmlString += "</label><label><input type='radio' name='accessSkills'  value='3'>  Same as mine";
	htmlString += "</label><label><input type='radio' name='accessSkills'  value='4'>  A bit better";
	htmlString += "</label><label><input type='radio' name='accessSkills'  value='5'>  Much better skilled";
	htmlString += "</label></div></div></div>";


	htmlString += "<div class='form-group'><label for='inputEmail3' class='control-label'>2. How much did you enjoy playing the game with your associate?</label>";
	htmlString += "</div><div class='form-group'>";
	htmlString += "<div class='col-sm-10'><div class='checkbox'>";
    htmlString += "<label><input type='radio' name='enjoy'  value='1'>  Not at all";
    htmlString += "</label><label><input type='radio' name='enjoy' value='2'>  A little";
    htmlString += "</label><label><input type='radio' name='enjoy' value='3'>  Average";
    htmlString += "</label><label><input type='radio' name='enjoy' value='4'>  A lot";
    htmlString += "</label><label><input type='radio' name='enjoy' value='5'>  Very much";
    htmlString += "</label></div></div></div>";


htmlString += "<div class='form-group'><label for='inputEmail3' class='control-label'>3. To what extent have you previously participated in a matrix game like this one?</label>";
htmlString += "</div><div class='form-group'><div class='col-sm-10'>";
      htmlString += "<div class='checkbox'><label><input type='radio' name='familiarity' value='1'>  Nothing like this scenario";
        htmlString += "</label><label><input type='radio' name='familiarity' value='2'>  Something like this scenario";
        htmlString += "</label><label><input type='radio' name='familiarity' value='3'>  Exactly this scenario";
        htmlString += "</label></div></div>";
htmlString += "</div>";


htmlString += "<div class='form-group'><label for='inputEmail3' class='control-label'>4. Are you generally a person who is fully prepared to take risks or do you try to avoid taking risks?</label></div>";

htmlString += "<div class='form-group'><div class='col-sm-10'><div class='checkbox'>";
        htmlString += "<label> <input type='radio' name='risk' value='1'>  Unwilling to take risks";
        htmlString += "</label><label><input type='radio' name='risk' value='2'>  Sometimes takes risks";
        htmlString += "</label><label><input type='radio' name='risk' value='3'>  Fully prepared to take risks";
        htmlString += "</label></div></div></div>";
       	htmlString += "</div>";
      htmlString += "<div id='page2' style='display:none'>";
      

htmlString += "<div class='form-group'><label for='inputEmail3' class='control-label'>1. To what extent do the following terms describe your associate's behavior in the game?</label></div>";

htmlString += "<div class='form-group'><div class='col-sm-offset-3 col-sm-6'><table class='table'>";
htmlString += "<tr><td></td><td>Low</td><td  colspan='2' align='right'>Medium</td><td></td><td>High</td></tr>";
htmlString += "<tr><td>Cooperative</td><td><input type='radio' name='cooperative' value='1'/> 1</td>";
htmlString += "<td> <input type='radio' name='cooperative' value='2'/> 2</td>";
htmlString += "<td><input type='radio' name='cooperative' value='3'/> 3</td>";
htmlString += "<td><input type='radio' name='cooperative' value='4'/> 4</td>";
htmlString += "<td><input type='radio' name='cooperative' value='5'/> 5</td></tr>";

htmlString += "<tr><td>Forgiving</td><td><input type='radio' name='forgiving' value='1'/> 1</td>";
htmlString += "<td> <input type='radio' name='forgiving' value='2'/> 2</td>";
htmlString += "<td><input type='radio' name='forgiving' value='3'/> 3</td>";
htmlString += "<td><input type='radio' name='forgiving' value='4'/> 4</td>";
htmlString += "<td><input type='radio' name='forgiving' value='5'/> 5</td></tr>";

htmlString += "<tr><td>Predictable</td><td><input type='radio' name='predictable' value='1'/> 1</td>";
htmlString += "<td> <input type='radio' name='predictable' value='2'/> 2</td>";
htmlString += "<td><input type='radio' name='predictable' value='3'/> 3</td>";
htmlString += "<td><input type='radio' name='predictable' value='4'/> 4</td>";
htmlString += "<td><input type='radio' name='predictable' value='5'/> 5</td></tr>";

htmlString += "<tr><td>Vengeful</td><td><input type='radio' name='vengeful' value='1'/> 1</td>";
htmlString += "<td> <input type='radio' name='vengeful' value='2'/> 2</td>";
htmlString += "<td><input type='radio' name='vengeful' value='3'/> 3</td>";
htmlString += "<td><input type='radio' name='vengeful' value='4'/> 4</td>";
htmlString += "<td><input type='radio' name='vengeful' value='5'/> 5</td></tr>";

htmlString += "<tr><td>Selfish</td><td><input type='radio' name='selfish'  value='1'/> 1</td>";
htmlString += "<td> <input type='radio' name='selfish' value='2'/> 2</td>";
htmlString += "<td><input type='radio' name='selfish'  value='3'/> 3</td>";
htmlString += "<td><input type='radio' name='selfish' value='4'/> 4</td>";
htmlString += "<td><input type='radio' name='selfish' value='5'/> 5</td></tr>";

htmlString += "</table></div></div>";

htmlString += "<div class='form-group'><label for='inputEmail3' class='control-label'>2. To what extent do the following terms describe your behavior in the game? </label></div>";

htmlString += "<div class='form-group'><div class='col-sm-offset-3 col-sm-6'>";

htmlString += "<table class='table'><tr><th></th><th>Low</th><th colspan='2' align='right'>Medium</th><th></th><th>High</th></tr>";
htmlString += "<tr><td>Cooperative</td><td><input type='radio' name='cooperative1'  value='1'/> 1</td>";
htmlString += "<td> <input type='radio' name='cooperative1' value='2'/> 2</td>";
htmlString += "<td><input type='radio' name='cooperative1' value='3'/> 3</td>";
htmlString += "<td><input type='radio' name='cooperative1' value='4'/> 4</td>";
htmlString += "<td><input type='radio' name='cooperative1' value='5'/> 5</td></tr>";

htmlString += "<tr><td>Forgiving</td><td><input type='radio' name='forgiving1' value='1'/> 1</td>";
htmlString += "<td> <input type='radio' name='forgiving1' value='2'/> 2</td>";
htmlString += "<td><input type='radio' name='forgiving1' value='3'/> 3</td>";
htmlString += "<td><input type='radio' name='forgiving1' value='4'/> 4</td>";
htmlString += "<td><input type='radio' name='forgiving1' value='5'/> 5</td></tr>";

htmlString += "<tr><td>Predictable</td>";
htmlString += "<td><input type='radio' name='predictable1' value='1'/> 1</td>";
htmlString += "<td> <input type='radio' name='predictable1' value='2'/> 2</td>";
htmlString += "<td><input type='radio' name='predictable1' value='3'/> 3</td>";
htmlString += "<td><input type='radio' name='predictable1' value='4'/> 4</td>";
htmlString += "<td><input type='radio' name='predictable1' value='5'/> 5</td></tr>";

htmlString += "<tr><td>Vengeful</td>";
htmlString += "<td><input type='radio' name='vengeful1' value='1'/> 1</td>";
htmlString += "<td> <input type='radio' name='vengeful1' value='2'/> 2</td>";
htmlString += "<td><input type='radio' name='vengeful1' value='3'/> 3</td>";
htmlString += "<td><input type='radio' name='vengeful1' value='4'/> 4</td>";
htmlString += "<td><input type='radio' name='vengeful1' value='5'/> 5</td></tr>";

htmlString += "<tr><td>Selfish</td>";
htmlString += "<td><input type='radio' name='selfish1' value='1'/> 1</td>";
htmlString += "<td> <input type='radio' name='selfish1' value='2'/> 2</td>";
htmlString += "<td><input type='radio' name='selfish1' value='3'/> 3</td>";
htmlString += "<td><input type='radio' name='selfish1' value='4'/> 4</td>";
htmlString += "<td><input type='radio' name='selfish1' value='5'/> 5</td></tr>";
htmlString += "</table></div></div>";
htmlString += "</div>";

htmlString += "<div id='page3'  style='display:none'>";
htmlString += "<div class='form-group'><b>Associate Identity:</b><p>1. At the beginning of the game, you were told that you would be playing the game with a Human Associate. Given your actual experience playing the game, who do you think you played with?</p></div>";

htmlString += "<div class='form-group'><div class='col-sm-10'><div class='checkbox'><label><input type='radio' name='thought' value='1'>  Yes, a HUMAN associate as said</label><label><input type='radio' name='thought' value='2'>  No, a BOT</label></div></div></div>";

htmlString += "<div class='form-group'><div class='col-sm-10'><label for='inputEmail3' class='control-label col-sm-6'>Please explain briefly the reason for your choice above.</label>";
htmlString += "<div class=' col-sm-6'><textarea name='reason1' class='form-control' rows='3'></textarea></div></div></div>";


htmlString += "<div class='form-group'><b>Associate Preference:</b><p>2. Considering your experience in the just concluded game, who would you rather play the same game with?” </p></div>";

htmlString += "<div class='form-group'> <div class='col-sm-10'><div class='checkbox'><label><input type='radio' name='preference' value='1'>  BOT</label><label> <input type='radio' name='preference' value='2'>  HUMAN</label></div></div></div>";

htmlString += "<div class='form-group'><div class='col-sm-10'><label for='inputEmail3' class='control-label col-sm-6'>Please explain briefly the reason for your choice above.</label>";
htmlString += "<div class=' col-sm-6'><textarea name='reason2' class='form-control' rows='3'></textarea></div></div></div>";

htmlString += "</div>";


htmlString += "<div id='page4' style='display:none'>";
	  // htmlString += "Page 1";
	htmlString += "<div class='form-group'>";
	htmlString += "<label for='inputEmail3' class='control-label'>1. People are more likely to be cooperative than autonomous machines.</label></div>";

	htmlString += "<div class='form-group'><div class='col-sm-10'> <div class='checkbox'>";
	htmlString += "<label><input type='radio' name='peoplecooperative'  value='1'>  Strongly disagree";
	htmlString += "</label><label><input type='radio' name='peoplecooperative'  value='2'>  Somewhat disagree";
	htmlString += "</label><label><input type='radio' name='peoplecooperative'  value='3'>  Neutral";
	htmlString += "</label><label><input type='radio' name='peoplecooperative'  value='4'>  Somewhat agree";
	htmlString += "</label><label><input type='radio' name='peoplecooperative'  value='5'>  Strongly agree";
	htmlString += "</label></div></div></div>";

	//2
	htmlString += "<div class='form-group'>";
	htmlString += "<label for='inputEmail3' class='control-label'>2. People are more likely to be devious than autonomous machines.</label></div>";

	htmlString += "<div class='form-group'><div class='col-sm-10'> <div class='checkbox'>";
	htmlString += "<label><input type='radio' name='peopledevious'  value='1'>  Strongly disagree";
	htmlString += "</label><label><input type='radio' name='peopledevious'  value='2'>  Somewhat disagree";
	htmlString += "</label><label><input type='radio' name='peopledevious'  value='3'>  Neutral";
	htmlString += "</label><label><input type='radio' name='peopledevious'  value='4'>  Somewhat agree";
	htmlString += "</label><label><input type='radio' name='peopledevious'  value='5'>  Strongly agree";
	htmlString += "</label></div></div></div>";

	//3
	htmlString += "<div class='form-group'>";
	htmlString += "<label for='inputEmail3' class='control-label'>3. People are more likely to be selfish than autonomous machines.</label></div>";

	htmlString += "<div class='form-group'><div class='col-sm-10'> <div class='checkbox'>";
	htmlString += "<label><input type='radio' name='peopleselfish'  value='1'>  Strongly disagree";
	htmlString += "</label><label><input type='radio' name='peopleselfish'  value='2'>  Somewhat disagree";
	htmlString += "</label><label><input type='radio' name='peopleselfish'  value='3'>  Neutral";
	htmlString += "</label><label><input type='radio' name='peopleselfish'  value='4'>  Somewhat agree";
	htmlString += "</label><label><input type='radio' name='peopleselfish'  value='5'>  Strongly agree";
	htmlString += "</label></div></div></div>";

	//4
	htmlString += "<div class='form-group'>";
	htmlString += "<label for='inputEmail3' class='control-label'>4. People are more likely to be trustworthy than autonomous machines.</label></div>";

	htmlString += "<div class='form-group'><div class='col-sm-10'> <div class='checkbox'>";
	htmlString += "<label><input type='radio' name='peopleautonomous'  value='1'>  Strongly disagree";
	htmlString += "</label><label><input type='radio' name='peopleautonomous'  value='2'>  Somewhat disagree";
	htmlString += "</label><label><input type='radio' name='peopleautonomous'  value='3'>  Neutral";
	htmlString += "</label><label><input type='radio' name='peopleautonomous'  value='4'>  Somewhat agree";
	htmlString += "</label><label><input type='radio' name='peopleautonomous'  value='5'>  Strongly agree";
	htmlString += "</label></div></div></div>";

	//5
	htmlString += "<div class='form-group'>";
	htmlString += "<label for='inputEmail3' class='control-label'>5. People are more likely to be forgiving than autonomous machines.</label></div>";

	htmlString += "<div class='form-group'><div class='col-sm-10'> <div class='checkbox'>";
	htmlString += "<label><input type='radio' name='peopleforgiving'  value='1'>  Strongly disagree";
	htmlString += "</label><label><input type='radio' name='peopleforgiving'  value='2'>  Somewhat disagree";
	htmlString += "</label><label><input type='radio' name='peopleforgiving'  value='3'>  Neutral";
	htmlString += "</label><label><input type='radio' name='peopleforgiving'  value='4'>  Somewhat agree";
	htmlString += "</label><label><input type='radio' name='peopleforgiving'  value='5'>  Strongly agree";
	htmlString += "</label></div></div></div>";

	//6
	htmlString += "<div class='form-group'>";
	htmlString += "<label for='inputEmail3' class='control-label'>6. People are more likely to be gullible than autonomous machines.</label></div>";

	htmlString += "<div class='form-group'><div class='col-sm-10'> <div class='checkbox'>";
	htmlString += "<label><input type='radio' name='peoplegullible'  value='1'>  Strongly disagree";
	htmlString += "</label><label><input type='radio' name='peoplegullible'  value='2'>  Somewhat disagree";
	htmlString += "</label><label><input type='radio' name='peoplegullible'  value='3'>  Neutral";
	htmlString += "</label><label><input type='radio' name='peoplegullible'  value='4'>  Somewhat agree";
	htmlString += "</label><label><input type='radio' name='peoplegullible'  value='5'>  Strongly agree";
	htmlString += "</label></div></div></div>";

	//7
	htmlString += "<div class='form-group'>";
	htmlString += "<label for='inputEmail3' class='control-label'>7. People are more likely to be bullied than autonomous machines.</label></div>";

	htmlString += "<div class='form-group'><div class='col-sm-10'> <div class='checkbox'>";
	htmlString += "<label><input type='radio' name='peoplebullied'  value='1'>  Strongly disagree";
	htmlString += "</label><label><input type='radio' name='peoplebullied'  value='2'>  Somewhat disagree";
	htmlString += "</label><label><input type='radio' name='peoplebullied'  value='3'>  Neutral";
	htmlString += "</label><label><input type='radio' name='peoplebullied'  value='4'>  Somewhat agree";
	htmlString += "</label><label><input type='radio' name='peoplebullied'  value='5'>  Strongly agree";
	htmlString += "</label></div></div></div>";

	htmlString += " <div class='form-group'><div class='col-sm-offset-6 col-sm-6'>";
	htmlString += "<input name='proceed' type='submit' class='btn btn-primary' value='Go To Payment'/></div></div>";

    htmlString += "</div>";

    // htmlString += "</div>";


	htmlString += '</form>';

return htmlString;
}
