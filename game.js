var gameController = function(data, baseDirectory, maxquestions) {
"use strict";

var gameboard = document.getElementById("gameboard"),
	scoreboard = document.getElementById("score"),
	questionboard = document.getElementById("question"),
	countdownboard = document.getElementById("timer"),
	errorboard = document.getElementById("error"),
	speak = document.getElementById("speak"),
	html5audio = document.getElementById("html5"),
	html4audio = document.getElementById("html4"),
	multiplechoice = document.forms["multiplechoice"],
	resultsboard = document.getElementById("results");

var score = 0,
	question = 0,
	qn = {},
	timer = 10,
	timeout = null,
	histogram = [];

this.guess = "";

this.speechReady = function(audioTag) {
	var i = multiplechoice.elements.length;
	while (i--) {
		multiplechoice.elements[i].disabled = false;
	}
	timer = 10;
	countdownboard.innerHTML = String(timer);
	audioTag.play();
	timeout = setTimeout('game.countdown()', 1000);
};

this.countdown = function() {
	countdownboard.innerHTML = String(--timer);
	if (timer === 0) {
		displayResult("<b class='red'>Too slow!</b> I said <i>&lsquo;" + qn.answer + "&rsquo;</i> in " + qn.language);
		setTimeout('game.nextQuestion()', 3000);
	}
	else {
		timeout = setTimeout('game.countdown()', 1000);
	}
};

this.nextQuestion = function() {
	clearTimeout(timeout);
	if (question == maxquestions) {
		gameResults();
		return;
	}
	qn = newQuestion(data);
	html4audio.src = qn.mp3;
	html5audio.src = qn.mp3;
	speak.load();
	var i = multiplechoice.elements.length;
	while (i--) {
		multiplechoice.elements[i].innerHTML = qn.choices[i];
	}
	if (histogram[qn.language] === undefined) {
		histogram[qn.language] = [0, 0];
	}
	histogram[qn.language][1]++;
	questionboard.innerHTML = String(++question) + '/' + maxquestions;
	gameboard.className = "game play";
	errorboard.style.opacity = 0;
};

this.checkAnswer = function() {
	clearTimeout(timeout);
	if (qn.answer == this.guess) {
		histogram[qn.language][0]++;
		scoreboard.innerHTML = String(score += timer);
		displayResult("<b class='green'>Correct!</b> That was " + qn.language);
	}
	else {
		displayResult("<b class='red'>No!</b> I said <i>&lsquo;" + qn.answer + "&rsquo;</i> in " + qn.language);
	}
	setTimeout('game.nextQuestion()', 3000);
};

this.playOn = function() {
	maxquestions += 10;
	this.nextQuestion();
}

function displayResult(message){
	var i = multiplechoice.elements.length;
	while (i--) {
		multiplechoice.elements[i].disabled = true;
	}
	errorboard.innerHTML = message;
	errorboard.style.opacity = 1;
	// TODO: highlight correct answer in green
}

function gameResults(){
	var languages = [],
		correct = [],
		incorrect = [];
	for (var bar in histogram) {
		languages.push(bar);
		correct.push(histogram[bar][0]);
		incorrect.push(histogram[bar][1] - histogram[bar][0]);
	}
	drawChart(languages, correct, incorrect);
	gameboard.className = "game over";
}

function drawChart(categs, lowerSeries, upperSeries) {
	return new Highcharts.Chart({
		chart: {
			type: 'column',
			renderTo: 'results'
		},
		title: {
			text: 'Your scores in each of the languages',
			color: '#000'
		},
		xAxis: {
			categories: categs
		},
		yAxis: {
			min: 0,
			title: {
				text: '% correct'
			},
			color: '#000'
		},
		legend: {
			backgroundColor: '#fff',
			reversed: true
		},
		plotOptions: {
			column: {
				stacking: 'percent'
			}
		},
		series: [{
				name: 'Incorrect',
				color: '#c99',
				data: upperSeries
			}, {
				name: 'Correct',
				color: '#6b5',
				data: lowerSeries
		}]
	});
}

};

var game = new gameController(data, baseDirectory, maxquestions);
game.nextQuestion();
