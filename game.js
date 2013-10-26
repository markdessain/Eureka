var questionsURL = "http://spreadsheets.google.com/feeds/list/0AmGNdVG13yM4dFlhcjFYRUN2c1lUdHpBU1ozazliWGc/od6/public/values?alt=json";
var audiodirectory = "http://dl.dropboxusercontent.com/u/26353384/Language%20sound%20files/";


var scoreboard = document.getElementById("score");
var html5audio = document.getElementById("html5");
var html4audio = document.getElementById("html4");
var countdownboard = document.getElementById("timer");
var guess1 = document.forms["multiplechoice"].elements["guess1"];
var guess2 = document.forms["multiplechoice"].elements["guess2"];
var guess3 = document.forms["multiplechoice"].elements["guess3"];
var guess4 = document.forms["multiplechoice"].elements["guess4"];
var errorboard = document.getElementById("error");
var questionboard = document.getElementById("question");
var TimeToFade = 1000.0;
var gameover = document.getElementById("gameover");
var finishedsentence = document.getElementById("finishedsentence");
var playing = document.getElementById("playing");
var tryagainbutton = document.getElementById("tryword");

var sentence = [];
var score = 0;
var question = 1;
var maxquestions = 20;
var timer = 10;
var timeout = null;
var lastword = null;
var aDict;
var combo = 0;
/*
$.getJSON("letters/aDict.json", function(data){
	aDict = data;
	lastword = data[Math.floor(Math.random() * data.length)];
	nextquestion();
});
*/

function playAgain() {
	lastword = aDict[Math.floor(Math.random() * aDict.length)];
	question = 1;
	score = 0;
	sentence = [];
	comboboard.innerHTML = 0;
	scoreboard.innerHTML = 0;
	nextquestion();
}

function youlose(){
	nextwordboard.disabled = true;
	nextwordboard.value = "";
	timeout = setTimeout('gameover.style.display = "block";', 500);
}

function countdown() {
	timer--;
	countdownboard.innerHTML = String(timer);
	if (timer === 0)
		youlose();
	else
		timeout = setTimeout('countdown()', 1000);
}

function nextquestion() {
	clearTimeout(timeout);
	var qn = nextQuestion();
	qn.answer = "do-you-know-how-to-go-there";
	qn.choices = ["blah1", "blah2", "blah3", "blah4"];
//	audiourl = audiodirectory + "CY" + "/" + phrase.toLowerCase() + ".m4a";
	html4audio.src = qn.mp3;
	html4audio.src = qn.mp3;
	guess1.innerHTML = gqn.choices[0];
	guess2.innerHTML = qn.choices[1];
	guess3.innerHTML = qn.choices[2];
	guess4.innerHTML = qn.choices[3];

	lastwordboard.innerHTML = lastword;
	timer = 10;
	countdownboard.innerHTML = String(timer);
	gameover.style.display = "none";
	playing.style.display = "block";
	timeout = setTimeout('countdown()', 1000);
}

function pointsscored () {
	return timer * pointsCombo;
}

function checkAnswer() {
	var answer = (firstletterboard.value + nextwordboard.value).toLowerCase();

	if (answer == "")
		return;

	if (notAlready(answer)) {
		if (checkIfCorrect(answer) ) {
			positiveScore();

			lastword = answer;

			reset();
		}
		else {
			error(1);
		}
	}
	else{
		error(2); //answer does not exist in dictionary
	}
}

function positiveScore() {
	combo++;
	var extra = "";

	if (combo > 5){
		if (combo > 30){
			if (combo > 200) {
				extra = "  x4";
				pointsCombo = 4;
			}
			else {
				extra = "  x3";
				pointsCombo = 3;
			}
		}
		else {
			extra = "  x2";
			pointsCombo = 2;
		}
	}

	score += pointsscored();

	scoreboard.innerHTML = String(score);

	comboboard.innerHTML = combo + extra;
}

function error(type){
	combo = 0;
	pointsCombo = 1;
	comboboard.innerHTML = 0;

	switch (type)
	{
		case 1:
			displayError("Word is not recognized");
			break;
		case 2:
			displayError("Word already used");
	}
}

function displayError(message){
	errorboard.innerHTML = message;
	errorboard.style.FadeState = null;
	errorboard.style.opacity = 1;
	setTimeout(fade(), 1000);
}

function fade(){

	if (errorboard.FadeState == null
		|| errorboard.style.opacity == ''
		|| errorboard.style.opacity == '1') {
		errorboard.FadeState = 2;
	}
	else errorboard.FadeState = -2;

	if(errorboard.FadeState == 1 || errorboard.FadeState == -1)
	{
		errorboard.FadeState = errorboard.FadeState == 1 ? -1 : 1;
		errorboard.FadeTimeLeft = TimeToFade - errorboard.FadeTimeLeft;
	}
	else
	{
		errorboard.FadeState = errorboard.FadeState == 2 ? -1 : 1;
		errorboard.FadeTimeLeft = TimeToFade;
		setTimeout("animateFade(" + new Date().getTime() + ",'" + "error" + "')", 300);
	}  
}

function animateFade(lastTick)
{  
	var curTick = new Date().getTime();
	var elapsedTicks = curTick - lastTick;

	if(errorboard.FadeTimeLeft <= elapsedTicks)
	{
		errorboard.style.opacity = errorboard.FadeState == 1 ? '1' : '0';
		errorboard.style.filter = 'alpha(opacity = ' 
		    + (errorboard.FadeState == 1 ? '100' : '0') + ')';
		errorboard.FadeState = errorboard.FadeState == 1 ? 2 : -2;
		return;
	}

	errorboard.FadeTimeLeft -= elapsedTicks;
	var newOpVal = errorboard.FadeTimeLeft/TimeToFade;
	if(errorboard.FadeState == 1)
		newOpVal = 1 - newOpVal;

	errorboard.style.opacity = newOpVal;
	errorboard.style.filter = 'alpha(opacity = ' + (newOpVal*100) + ')';

	setTimeout("animateFade(" + curTick + ",'" + "error" + "')", 33);
}

function notAlready(answer) {
	return (sentence.indexOf(answer) <= 0);
}



function checkIfCorrect(answer) {
	return (aDict.indexOf(answer) > 0);
}

//nextquestion();
