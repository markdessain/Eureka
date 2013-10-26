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
    return Text.toLowerCase().replace(/ /g,'_').replace(/[^\w-]+/g,'');
}


function pickAnswerAndChoices(baseDirectory, questions, category, numberOfChoices) {   
    keys = Object.keys(questions) // List all the keys to the questions
    shuffledKeys = shuffle(keys); // Shuffle them so they are in a random order

    answer = shuffledKeys[0] // First one will be the answer
    language = shuffle(questions[answer])[0] // Pick a random langauge for the answer
    choices = shuffle(shuffledKeys.slice(0,numberOfChoices)); // Pick an shuffle the first n choices which includes the actual answer
    
    return {
        language: language,
        category: category,
        answer: answer,
        mp3: baseDirectory + '/' + language + '/' + convertToSlug(answer) + '.m4a',
        choices: choices
    }
}


function getChoices(data, baseDirectory, numberOfChoices) {
	category = pickRandomProperty(data); 
    questions = data[category]
    return pickAnswerAndChoices(baseDirectory, questions, category, numberOfChoices);
    
}


answered = []
data = {
    words: {
        "Hello": ["FR", "DE"],
        "Goodbye": ["FR", "DE"],
        "Yes": ["FR", "DE"],
        "No": ["FR", "DE"],
        "Thanks": ["FR", "DE"],
        "Sorry": ["FR", "DE"],
        "Now": ["FR", "DE"],
        "Later": ["FR", "DE"],
        "Water": ["FR", "DE"],
        "Toilet": ["FR", "DE"],
        "Rain": ["FR", "DE"],
        "Snow": ["FR", "DE"],
        "Hot": ["FR", "DE"],
        "Cold": ["FR", "DE"],
        "Dog": ["FR", "DE"],
        "Cat": ["FR", "DE"]
    },
    short_questions: {
        "Where are you going?": ["FR", "DE"],
        "What do you want?": ["FR", "DE"],
        "Do you need this?": ["FR", "DE"],
        "When are you leaving?": ["FR", "DE"]
    },
    short_statements: {
		"It is not here.": ["FR", "DE"], 
        "The train has left.": ["FR", "DE"],
        "Please come with me.": ["FR", "DE"],
        "I can't help you": ["FR", "DE"]
    },
    long_questions: {
        "You can't go there now.": ["FR", "DE"],
        "You must take a train there.": ["FR", "DE"],
        "It is very far from here.": ["FR", "DE"],
        "I don't know where it is.": ["FR", "DE"]
    },
    long_statements: {
        "What would you like to drink?": ["FR", "DE"],
        "Where do you want to go tomorrow?": ["FR", "DE"],
        "Would you like anything else now?": ["FR", "DE"],
        "Do you know how to go there?": ["FR", "DE"]
    }
}
baseDirectory = 'http://dl.dropboxusercontent.com/u/26353384/Language%20sound%20files'

function newQuestion() {

	// This is a horrible way for making sure the same audio clip doesn't appear twice
	// but as long as the number of questions is far below the number of possible answers it will be ok.

	do {
		// Keep looping until we find an unseen answer
		result = getChoices(data, baseDirectory, 4);
	}
	while (answered.indexOf(result.answer + result.language) >= 0);

	answered.push(result.answer + result.language)

	return result;

}