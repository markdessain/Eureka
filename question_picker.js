"use strict";

var answered = [];  // Array of (phrases + language) that have already been asked

function pickRandomProperty(obj) {
    var keys = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            keys.push(prop);
        }
    }
    return keys[ keys.length * Math.random() << 0 ];
}

function shuffle(o) {
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function convertToSlug(Text) {
    return Text.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
}

function pickAnswerAndChoices(baseDirectory, questions, category, numberOfChoices) {
    var keys = Object.keys(questions);  // List all the keys to the questions
    var shuffledKeys = shuffle(keys);   // Shuffle them so they are in a random order

    var answer = shuffledKeys[0];       // First one will be the answer
    var language = shuffle(questions[answer])[0];   // Pick a random langauge for the answer
    var choices = shuffle(shuffledKeys.slice(0,numberOfChoices)); // Pick & shuffle the first n choices, which includes the answer   
    return {
        language: language,
        category: category,
        answer: answer,
        mp3: baseDirectory + '/' + language + '/' + convertToSlug(answer) + '.m4a',
        choices: choices
    };
}

function getChoices(data, baseDirectory, numberOfChoices) {
	var category = pickRandomProperty(data);
    var questions = data[category];
    return pickAnswerAndChoices(baseDirectory, questions, category, numberOfChoices);
}

function newQuestion(data) {
    var result;
	// This is a horrible way for making sure the same audio clip doesn't appear twice
	// but as long as the number of questions is far below the number of possible answers it will be ok.
	do {
		// Keep looping until we find an unseen answer
		result = getChoices(data, baseDirectory, 4);
	}
	while (answered.indexOf(result.answer + result.language) >= 0);
	answered.push(result.answer + result.language);
	return result;
}
