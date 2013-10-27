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
var gameover = document.getElementById("gameover");
var playing = document.getElementById("playing");
var chart = createChart();

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
    var correct = [];
    var incorrect = [];
    for (var bar in histogram) {
        correct.push(histogram[bar][0]);
        incorrect.push(histogram[bar][1] - histogram[bar][0]);
    }
    chart.series[0].setData(incorrect,false);
    chart.series[1].setData(correct,true);

    timeout = setTimeout('playing.style.display="none"; gameover.style.display="block";', 500);
}

function countdown() {
    timer--;
    countdownboard.innerHTML = String(timer);
    if (timer === 0) {
        displayResult("<b class='red'>Too slow!</b> I said <i>'" + answer + "'</i> in " + lang);
        setTimeout('nextquestion()', 3000);
    }
    else {
        timeout = setTimeout('countdown()', 1000);
    }
}

function nextquestion() {
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
    errorboard.style.opacity = 0;
    timeout = setTimeout('countdown()', 1000);
}

function checkAnswer() {
    clearTimeout(timeout);
    if (answer == guess) {
        histogram[lang][0]++;
        score += timer;
        scoreboard.innerHTML = String(score);
        displayResult("<b class='green'>Correct!</b> That was " + lang);
    }
    else {
        displayResult("<b class='red'>No!</b> I said <i>'" + answer + "'</i> in " + lang);
    }
    setTimeout('nextquestion()', 3000);
}

function displayResult(message){
    guess1.disabled = true;
    guess2.disabled = true;
    guess3.disabled = true;
    guess4.disabled = true;
    histogram[lang][1]++;
    errorboard.innerHTML = message;
    errorboard.style.opacity = 1;
    // TODO: highlight correct answer in green
}

function createChart() {
    var chart = new Highcharts.Chart({
        chart: {
            type: 'column',
            renderTo: 'results'
        },
        title: {
            text: 'Your scores in each of the languages',
            color: '#000'
        },
        xAxis: {
            categories: ["Welsh", "Spanish", "Mandarin", "French"]
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
                color: '#d9534f',
                data: []
            }, {
                name: 'Correct',
                color: '#5cb85c',
                data: []
        }]
    });
    return chart;
}

nextquestion();
