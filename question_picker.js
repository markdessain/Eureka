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
        "Hello": ["CY"],
        "Goodbye": ["CY"],
        "Yes": ["CY"],
        "No": ["CY"],
        "Thanks": ["CY"],
        "Sorry": ["CY"],
        "Now": ["CY"],
        "Later": ["CY"],
        "Water": ["CY"],
        "Toilet": ["CY"],
        "Rain": ["CY"],
        "Snow": ["CY"],
        "Hot": ["CY"],
        "Cold": ["CY"],
        "Dog": ["CY"],
        "Cat": ["CY"]
    },
    short_questions: {
        "Where are you going?": ["CY"],
        "What do you want?": ["CY"],
        "Do you need this?": ["CY"],
        "When are you leaving?": ["CY"]
    },
    short_statements: {
		"It is not here.": ["CY"], 
        "The train has left.": ["CY"],
        "Please come with me.": ["CY"],
        "I can't help you": ["CY"]
    },
    long_questions: {
        "You can't go there now.": ["CY"],
        "You must take a train there.": ["CY"],
        "It is very far from here.": ["CY"],
        "I don't know where it is.": ["CY"]
    },
    long_statements: {
        "What would you like to drink?": ["CY"],
        "Where do you want to go tomorrow?": ["CY"],
        "Would you like anything else now?": ["CY"],
        "Do you know how to go there?": ["CY"]
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
