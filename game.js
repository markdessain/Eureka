"use strict";

var scoreboard = document.getElementById("score");
var speak = document.getElementById("speak");
var html5audio = document.getElementById("html5");
var html4audio = document.getElementById("html4");
var countdownboard = document.getElementById("timer");
var multiplechoice = document.forms["multiplechoice"];
var guess1 = multiplechoice.elements["guess1"];
var guess2 = multiplechoice.elements["guess2"];
var guess3 = multiplechoice.elements["guess3"];
var guess4 = multiplechoice.elements["guess4"];
var errorboard = document.getElementById("error");
var questionboard = document.getElementById("question");
var resultsboard = document.getElementById("results");
var TimeToFade = 1000.0;
var gameover = document.getElementById("gameover");
var playing = document.getElementById("playing");

var score = 0;
var question = 0;
var answer = "";
var lang = "";
var guess = "";
var maxquestions = 20;
var timer = 10;
var timeout = null;
var histogram = [];
histogram["Welsh"] = [0, 0];
histogram["Spanish"] = [0, 0];
histogram["Mandarin"] = [0, 0];
histogram["French"] = [0, 0];

function gameResults(){
	var result = "";
    for (var bar in histogram) {
		result += histogram[bar][0] + '/' + histogram[bar][1] + " in " + bar + ", ";
	}
	result += "correct";
	resultsboard.innerHTML = "You got " + result + '!';
	timeout = setTimeout('playing.style.display="none"; gameover.style.display="block";', 500);
}

function countdown() {
	timer--;
	countdownboard.innerHTML = String(timer);
	if (timer === 0) {
		displayResult("Too slow! I said '" + answer + "' in " + lang);
		setTimeout('nextquestion()', 3000);
	}
	else {
		timeout = setTimeout('countdown()', 1000);
	}
}

function nextquestion() {
	playing.style.display = "block";
	fade();
	clearTimeout(timeout);
	if (question == maxquestions) {
		gameResults();
		return;
	}
	questionboard.innerHTML = String(++question);
	var qn = newQuestion(data);
	answer = qn.answer;
	lang = qn.language;
	html4audio.src = qn.mp3;
	html5audio.src = qn.mp3;
	speak.load();
	speak.play();
	guess1.innerHTML = qn.choices[0];
	guess2.innerHTML = qn.choices[1];
	guess3.innerHTML = qn.choices[2];
	guess4.innerHTML = qn.choices[3];
	timer = 10;
	countdownboard.innerHTML = String(timer);
	gameover.style.display = "none";
	playing.style.display = "block";
	guess1.disabled = false;
	guess2.disabled = false;
	guess3.disabled = false;
	guess4.disabled = false;
	timeout = setTimeout('countdown()', 1000);
}

function pointsscored () {
	return timer;
}

function checkAnswer() {
	clearTimeout(timeout);
	guess1.disabled = true;
	guess2.disabled = true;
	guess3.disabled = true;
	guess4.disabled = true;
	histogram[lang][1]++;
	if (answer == guess) {
		histogram[lang][0]++;
		score += pointsscored();
		scoreboard.innerHTML = String(score);
		displayResult("Correct! That was " + lang);
	}
	else {
		displayResult("No! I said '" + answer + "' in " + lang);
	}
	setTimeout('nextquestion()', 3000);
}

function displayResult(message){
	// TODO: disable multiplechoice inputs and highlight correct answer in green
	errorboard.innerHTML = message;
	errorboard.style.FadeState = null;
	errorboard.style.opacity = 1;
}

function fade(){
	if (errorboard.FadeState === null
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
		errorboard.style.filter = 'alpha(opacity = ' + (errorboard.FadeState == 1 ? '100' : '0') + ')';
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

nextquestion();
