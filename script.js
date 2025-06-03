// Birthday countdown timer
const countdownDate = new Date('June 11, 2025 00:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result
    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');

    // If the countdown is over
    if (distance < 0) {
        clearInterval(countdownTimer);
        document.getElementById('days').innerText = '00';
        document.getElementById('hours').innerText = '00';
        document.getElementById('minutes').innerText = '00';
        document.getElementById('seconds').innerText = '00';
        
        // Show birthday message
        const countdownContainer = document.querySelector('.countdown-container');
        const birthdayMessage = document.createElement('div');
        birthdayMessage.classList.add('birthday-message');
        birthdayMessage.innerHTML = '<h2>Happy Birthday Adi! 🎉🎂</h2>';
        countdownContainer.appendChild(birthdayMessage);
    }
}

// Update the countdown every second
const countdownTimer = setInterval(updateCountdown, 1000);

// Initial call to set the values immediately
updateCountdown();

// Game Navigation
const gameButtons = document.querySelectorAll('.game-btn');
const gameContents = document.querySelectorAll('.game-content');

gameButtons.forEach(button => {
    button.addEventListener('click', () => {
        const gameId = button.getAttribute('data-game');
        
        // Remove active class from all buttons and contents
        gameButtons.forEach(btn => btn.classList.remove('active'));
        gameContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to selected button and content
        button.classList.add('active');
        document.getElementById(`${gameId}-game`).classList.add('active');
    });
});

// Wordle Game
const WORDS = ['CROCS', 'SONGS', 'STYLE', 'CHILL', 'LAUGH', 'SMART', 'LOYAL', 'GYMMY', 'VIBES', 'BLISS'];
let targetWord = '';
let currentRow = 0;
let currentCell = 0;
let gameActive = false;
let wordleInitialized = false;

function initWordle() {
    // Prevent duplicate initialization
    if (wordleInitialized) {
        // Just start a new game if already initialized
        startNewWordleGame();
        return;
    }
    
    // Create the grid
    const wordleGrid = document.querySelector('.wordle-grid');
    wordleGrid.innerHTML = '';
    
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.classList.add('wordle-row');
        
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.classList.add('wordle-cell');
            row.appendChild(cell);
        }
        
        wordleGrid.appendChild(row);
    }
    
    // Create the keyboard
    const keyboard = document.querySelector('.keyboard');
    keyboard.innerHTML = '';
    
    const rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
    ];
    
    rows.forEach(row => {
        const keyboardRow = document.createElement('div');
        keyboardRow.classList.add('keyboard-row');
        
        row.forEach(key => {
            const keyElement = document.createElement('div');
            keyElement.classList.add('key');
            keyElement.textContent = key;
            keyElement.addEventListener('click', () => handleKeyClick(key));
            keyboardRow.appendChild(keyElement);
        });
        
        keyboard.appendChild(keyboardRow);
    });
    
    // Remove any existing keyboard event listener
    document.removeEventListener('keydown', handleKeyPress);
    
    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyPress);
    
    // Mark as initialized
    wordleInitialized = true;
    
    // Start a new game
    startNewWordleGame();
}

function startNewWordleGame() {
    // Reset game state
    currentRow = 0;
    currentCell = 0;
    gameActive = true;
    
    // Clear the grid
    const cells = document.querySelectorAll('.wordle-cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'wordle-cell';
    });
    
    // Reset keyboard
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.className = 'key';
    });
    
    // Choose a random word
    targetWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    console.log('Target word:', targetWord); // For debugging
}

function handleKeyPress(e) {
    if (!gameActive) return;
    
    if (e.key === 'Enter') {
        submitGuess();
    } else if (e.key === 'Backspace') {
        deleteLetter();
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        addLetter(e.key.toUpperCase());
    }
}

function handleKeyClick(key) {
    if (!gameActive) return;
    
    if (key === 'Enter') {
        submitGuess();
    } else if (key === '⌫') {
        deleteLetter();
    } else {
        addLetter(key);
    }
}

function addLetter(letter) {
    if (currentCell < 5) {
        const rows = document.querySelectorAll('.wordle-row');
        const currentCells = rows[currentRow].querySelectorAll('.wordle-cell');
        currentCells[currentCell].textContent = letter;
        currentCell++;
    }
}

function deleteLetter() {
    if (currentCell > 0) {
        currentCell--;
        const rows = document.querySelectorAll('.wordle-row');
        const currentCells = rows[currentRow].querySelectorAll('.wordle-cell');
        currentCells[currentCell].textContent = '';
    }
}

function submitGuess() {
    if (currentCell !== 5) return; // Not enough letters
    
    const rows = document.querySelectorAll('.wordle-row');
    const currentCells = rows[currentRow].querySelectorAll('.wordle-cell');
    
    let guess = '';
    currentCells.forEach(cell => {
        guess += cell.textContent;
    });
    
    // Check the guess
    const result = checkGuess(guess, targetWord);
    
    // Update the UI based on the result
    for (let i = 0; i < 5; i++) {
        currentCells[i].classList.add(result[i]);
        
        // Update keyboard
        const keyElement = findKeyByText(guess[i]);
        if (keyElement) {
            if (result[i] === 'correct') {
                keyElement.className = 'key correct';
            } else if (result[i] === 'present' && !keyElement.classList.contains('correct')) {
                keyElement.className = 'key present';
            } else if (result[i] === 'absent' && !keyElement.classList.contains('correct') && !keyElement.classList.contains('present')) {
                keyElement.className = 'key absent';
            }
        }
    }
    
    // Check if the player won
    if (guess === targetWord) {
        gameActive = false;
        setTimeout(() => {
            alert('Congratulations! You guessed the word!');
            startNewWordleGame();
        }, 500);
        return;
    }
    
    // Move to the next row
    currentRow++;
    currentCell = 0;
    
    // Check if the player lost
    if (currentRow >= 6) {
        gameActive = false;
        console.log("[Wordle Game Over] Target word:", targetWord); // Log 1

        const wordleContainer = document.getElementById('wordle-game'); // Changed from querySelector('.wordle-container')
        if (!wordleContainer) {
            console.error("[Wordle Game Over] Wordle game container (ID: wordle-game) not found!"); // Log 2 - Updated message
            return;
        }

        const answerElement = document.createElement('div');
        answerElement.classList.add('wordle-answer');
        answerElement.textContent = `The correct word was: ${targetWord}`;
        console.log("[Wordle Game Over] Created answerElement:", answerElement); // Log 3

        const existingAnswer = document.querySelector('.wordle-answer');
        if (existingAnswer) {
            console.log("[Wordle Game Over] Removing existing answer element."); // Log 4
            existingAnswer.remove();
        }
        
        console.log("[Wordle Game Over] Appending new answerElement to wordleContainer."); // Log 5
        wordleContainer.appendChild(answerElement);
        
        // Check if it's in the DOM and visible (basic check)
        if (document.body.contains(answerElement) && getComputedStyle(answerElement).display !== 'none' && getComputedStyle(answerElement).visibility !== 'hidden') {
            console.log("[Wordle Game Over] answerElement successfully appended and seems visible."); // Log 6
        } else {
            console.error("[Wordle Game Over] answerElement NOT appended or not visible. Computed display:", getComputedStyle(answerElement).display, "Visibility:", getComputedStyle(answerElement).visibility);
             // Log 7
        }

        setTimeout(() => {
            console.log("[Wordle Game Over] Inside setTimeout for game over actions."); // Log 8
            alert(`Game over! The word was ${targetWord}`);
            startNewWordleGame();
            // Check if answerElement still exists and is part of DOM before removing
            if (answerElement && document.body.contains(answerElement)) { 
                console.log("[Wordle Game Over] Removing answerElement after alert and game restart."); // Log 9
                answerElement.remove();
            } else {
                console.log("[Wordle Game Over] answerElement was already removed or not found before explicit removal in setTimeout."); // Log 10
            }
        }, 1500);
    }
}

function checkGuess(guess, target) {
    const result = ['absent', 'absent', 'absent', 'absent', 'absent'];
    const targetLetters = target.split('');
    
    // First pass: check for correct positions
    for (let i = 0; i < 5; i++) {
        if (guess[i] === target[i]) {
            result[i] = 'correct';
            targetLetters[i] = null; // Mark as used
        }
    }
    
    // Second pass: check for correct letters in wrong positions
    for (let i = 0; i < 5; i++) {
        if (result[i] === 'absent') {
            const index = targetLetters.indexOf(guess[i]);
            if (index !== -1) {
                result[i] = 'present';
                targetLetters[index] = null; // Mark as used
            }
        }
    }
    
    return result;
}

// Helper function to find key element by text content
function findKeyByText(text) {
    const keys = document.querySelectorAll('.key');
    for (let key of keys) {
        if (key.textContent === text) {
            return key;
        }
    }
    return null;
}

// Connections Game
const CONNECTIONS_GROUPS = [
    {
        name: "Crocs Lover",
        color: "purple",
        words: ["SHOES", "COMFORT", "COLORFUL", "RUBBER"]
    },
    {
        name: "Music Enthusiast",
        color: "blue",
        words: ["UKULELE", "SINGING", "MELODY", "STRINGS"]
    },
    {
        name: "Travel Dreams",
        color: "yellow",
        words: ["BALI", "BEACH", "ISLAND", "VACATION"]
    },
    {
        name: "Adi's Traits",
        color: "green",
        words: ["GLASSES", "PUPPY", "CHOCOLATE", "GYM"]
    }
];

// Track if connections is initialized
let connectionsInitialized = false;

let selectedTiles = [];
let foundGroups = [];
let shuffledWords = [];

function initConnections() {
    // Prevent duplicate initialization
    if (connectionsInitialized) {
        resetConnectionsGame();
        return;
    }
    
    const connectionsGrid = document.querySelector('.connections-grid');
    connectionsGrid.innerHTML = '';
    
    // Reset game state
    selectedTiles = [];
    foundGroups = [];
    
    // Create a flat array of all words
    const allWords = CONNECTIONS_GROUPS.flatMap(group => group.words);
    
    // Shuffle the words
    shuffledWords = shuffleArray([...allWords]);
    
    // Create the tiles
    shuffledWords.forEach(word => {
        const tile = document.createElement('div');
        tile.classList.add('connections-tile');
        tile.textContent = word;
        tile.addEventListener('click', () => handleTileClick(tile));
        connectionsGrid.appendChild(tile);
    });
    
    // Clear the groups display
    document.querySelector('.connections-groups').innerHTML = '';
    
    // Mark as initialized
    connectionsInitialized = true;
}

function resetConnectionsGame() {
    // Reset game state
    selectedTiles = [];
    foundGroups = [];
    
    // Clear selections
    const tiles = document.querySelectorAll('.connections-tile');
    tiles.forEach(tile => {
        tile.className = 'connections-tile';
        tile.style.backgroundColor = '';
    });
    
    // Clear the groups display
    document.querySelector('.connections-groups').innerHTML = '';
    
    // Reshuffle the words
    const allWords = CONNECTIONS_GROUPS.flatMap(group => group.words);
    shuffledWords = shuffleArray([...allWords]);
    
    // Update tile text
    tiles.forEach((tile, index) => {
        if (index < shuffledWords.length) {
            tile.textContent = shuffledWords[index];
        }
    });
}

function handleTileClick(tile) {
    // If the tile is already in a solved group, do nothing
    if (tile.classList.contains('solved')) return;
    
    // Toggle selection
    if (tile.classList.contains('selected')) {
        tile.classList.remove('selected');
        selectedTiles = selectedTiles.filter(t => t !== tile);
    } else {
        // Only allow selecting up to 4 tiles
        if (selectedTiles.length < 4) {
            tile.classList.add('selected');
            selectedTiles.push(tile);
            
            // If 4 tiles are selected, check the group
            if (selectedTiles.length === 4) {
                checkSelectedGroup();
            }
        }
    }
}

function checkSelectedGroup() {
    const selectedWords = selectedTiles.map(tile => tile.textContent);
    
    // Check if the selected words form a valid group
    const matchedGroup = CONNECTIONS_GROUPS.find(group => {
        // Check if all selected words match a group's words (regardless of order)
        const groupWords = [...group.words]; // Create a copy to avoid modifying the original
        if (selectedWords.length !== groupWords.length) return false;
        
        // Check if each selected word is in the group
        return selectedWords.every(word => {
            const index = groupWords.indexOf(word);
            if (index !== -1) {
                // Remove the matched word to prevent duplicates
                groupWords.splice(index, 1);
                return true;
            }
            return false;
        });
    });
    
    if (matchedGroup) {
        // Mark the group as found
        foundGroups.push(matchedGroup);
        
        // Update the UI
        selectedTiles.forEach(tile => {
            tile.classList.remove('selected');
            tile.classList.add('solved');
            tile.style.backgroundColor = getGroupColor(matchedGroup.color);
        });
        
        // Add the group to the groups display
        const groupsContainer = document.querySelector('.connections-groups');
        const groupElement = document.createElement('div');
        groupElement.classList.add('connection-group', matchedGroup.color);
        groupElement.innerHTML = `
            <h4>${matchedGroup.name}</h4>
            <p>${matchedGroup.words.join(', ')}</p>
        `;
        groupsContainer.appendChild(groupElement);
        
        // Clear the selection
        selectedTiles = [];
        
        // Check if all groups are found
        if (foundGroups.length === CONNECTIONS_GROUPS.length) {
            setTimeout(() => {
                alert('Congratulations! You found all the connections!');
                resetConnectionsGame(); // Restart the game
            }, 1000);
        }
    } else {
        // Shake the tiles to indicate wrong group
        selectedTiles.forEach(tile => {
            tile.classList.add('shake');
            setTimeout(() => {
                tile.classList.remove('shake', 'selected');
            }, 500);
        });
        
        // Show a hint about the correct grouping if 4 tiles are selected
        if (selectedWords.length === 4) {
            // Find the most matching group
            let bestMatch = null;
            let maxMatches = 0;
            
            CONNECTIONS_GROUPS.forEach(group => {
                if (foundGroups.includes(group)) return; // Skip already found groups
                
                const matches = selectedWords.filter(word => group.words.includes(word)).length;
                if (matches > maxMatches) {
                    maxMatches = matches;
                    bestMatch = group;
                }
            });
            
            if (bestMatch && maxMatches >= 2) {
                // Show a hint
                const hintElement = document.createElement('div');
                hintElement.classList.add('connection-hint');
                hintElement.textContent = `Hint: ${maxMatches} of these belong to "${bestMatch.name}" group`;
                
                const groupsContainer = document.querySelector('.connections-groups');
                // Remove any existing hints
                const existingHint = document.querySelector('.connection-hint');
                if (existingHint) {
                    existingHint.remove();
                }
                
                groupsContainer.appendChild(hintElement);
                
                // Auto-remove hint after 3 seconds
                setTimeout(() => {
                    hintElement.remove();
                }, 3000);
            }
        }
        
        // Clear the selection
        selectedTiles = [];
    }
}

function getGroupColor(color) {
    switch (color) {
        case 'purple': return 'rgba(142, 68, 173, 0.7)';
        case 'blue': return 'rgba(52, 152, 219, 0.7)';
        case 'yellow': return 'rgba(243, 156, 18, 0.7)';
        case 'green': return 'rgba(46, 204, 113, 0.7)';
        default: return '';
    }
}

// Trivia Game
const TRIVIA_QUESTIONS = [
    {
        question: "What is Adi's favorite footwear?",
        options: ["Sneakers", "Crocs", "Sandals", "Boots"],
        answer: 1
    },
    {
        question: "Which musical instrument does Adi play?",
        options: ["Guitar", "Piano", "Ukulele", "Drums"],
        answer: 2
    },
    {
        question: "Which place does Adi love?",
        options: ["Paris", "New York", "Tokyo", "Bali"],
        answer: 3
    },
    {
        question: "Which cricket team is Adi a fan of?",
        options: ["Mumbai Indians", "Chennai Super Kings", "Royal Challengers Bangalore", "Kolkata Knight Riders"],
        answer: 2
    },
    {
        question: "What GPA has Adi never achieved?",
        options: ["8.0", "8.5", "9.0", "9.5"],
        answer: 2
    },
    {
        question: "What beverage does Adi love?",
        options: ["Coffee", "Tea", "Hot Chocolate", "Energy Drinks"],
        answer: 2
    },
    {
        question: "What facial expression does Adi make to pass vivas?",
        options: ["Serious Face", "Confident Smile", "Puppy Face", "Poker Face"],
        answer: 2
    },
    {
        question: "What does Adi need to see properly?",
        options: ["Contact Lenses", "Glasses", "Binoculars", "Magnifying Glass"],
        answer: 1
    },
    {
        question: "Despite going to the gym, Adi is described as?",
        options: ["Skinny", "Muscular", "Tall", "Motu"],
        answer: 3
    },
    {
        question: "When is Adi's birthday?",
        options: ["June 11", "July 11", "June 1", "July 1"],
        answer: 0
    },
    {
        question: "What's Adi's favorite color for his Crocs?",
        options: ["Blue", "Black", "Red", "Green"],
        answer: 2
    },
    {
        question: "What song does Adi like to play on his ukulele?",
        options: ["Wonderwall", "Somewhere Over the Rainbow", "Hey Jude", "Let It Be"],
        answer: 1
    },
    {
        question: "What's Adi's favorite beach activity in Bali?",
        options: ["Surfing", "Sunbathing", "Beach Volleyball", "Snorkeling"],
        answer: 3
    },
    {
        question: "Who is Adi's favorite RCB player?",
        options: ["Virat Kohli", "AB de Villiers", "Yuzvendra Chahal", "Glenn Maxwell"],
        answer: 0
    },
    {
        question: "What's Adi's favorite gym exercise?",
        options: ["Bench Press", "Squats", "Deadlifts", "Bicep Curls"],
        answer: 3
    },
    {
        question: "What's Adi's favorite topping on hot chocolate?",
        options: ["Whipped Cream", "Marshmallows", "Cinnamon", "Chocolate Shavings"],
        answer: 1
    },
    {
        question: "What's Adi's go-to excuse when he doesn't want to study?",
        options: ["I'm too tired", "I already know the material", "I'll do it tomorrow", "I need to go to the gym"],
        answer: 3
    },
    {
        question: "What's Adi's favorite season?",
        options: ["Summer", "Winter", "Spring", "Monsoon"],
        answer: 1
    },
    {
        question: "What's Adi's favorite midnight snack?",
        options: ["Chips", "Chocolate", "Ice Cream", "Maggi"],
        answer: 3
    },
    {
        question: "How many hours does Adi typically spend at the gym?",
        options: ["Less than 1 hour", "1-2 hours", "2-3 hours", "More than 3 hours"],
        answer: 1
    }
];

let currentQuestion = 0;
let score = 0;
let triviaActive = false;
let triviaInitialized = false;

function initTrivia() {
    // Prevent duplicate initialization
    if (triviaInitialized) {
        resetTriviaGame();
        return;
    }
    
    const startButton = document.getElementById('start-trivia');
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options');
    const resultElement = document.getElementById('result');
    
    // Store references for reset function
    window.triviaElements = {
        startButton,
        questionElement,
        optionsContainer,
        resultElement
    };
    
    // Remove any existing event listener to prevent duplicates
    const newStartButton = startButton.cloneNode(true);
    startButton.parentNode.replaceChild(newStartButton, startButton);
    window.triviaElements.startButton = newStartButton;
    
    newStartButton.addEventListener('click', handleTriviaButtonClick);
    
    // Mark as initialized
    triviaInitialized = true;
}

function handleTriviaButtonClick() {
    const { startButton, questionElement, optionsContainer, resultElement } = window.triviaElements;
    
    if (!triviaActive) {
        // Start the trivia
        triviaActive = true;
        currentQuestion = 0;
        score = 0;
        startButton.textContent = 'Next Question';
        resultElement.textContent = '';
        showTriviaQuestion();
    } else {
        // Move to the next question
        currentQuestion++;
        
        if (currentQuestion < TRIVIA_QUESTIONS.length) {
            showTriviaQuestion();
            resultElement.textContent = '';
            // Re-enable option selection for the new question
            triviaActive = true;
        } else {
            // End of trivia
            questionElement.textContent = `Quiz completed! Your score: ${score}/${TRIVIA_QUESTIONS.length}`;
            optionsContainer.innerHTML = '';
            startButton.textContent = 'Play Again';
            triviaActive = false;
        }
    }
}

function showTriviaQuestion() {
    const { questionElement, optionsContainer } = window.triviaElements;
    const question = TRIVIA_QUESTIONS[currentQuestion];
    questionElement.textContent = question.question;
    
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        
        // Create a new function for each option to avoid closure issues
        optionElement.addEventListener('click', function() {
            if (triviaActive) {
                selectTriviaOption(index);
            }
        });
        
        optionsContainer.appendChild(optionElement);
    });
}

function selectTriviaOption(index) {
    if (!triviaActive) return;
    
    const { resultElement } = window.triviaElements;
    const options = document.querySelectorAll('.option');
    const correctIndex = TRIVIA_QUESTIONS[currentQuestion].answer;
    
    // Disable further selection for this question
    triviaActive = false;
    
    // Mark the selected option
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    
    // Show the correct answer
    setTimeout(() => {
        options[correctIndex].classList.add('correct');
        
        if (index !== correctIndex) {
            options[index].classList.add('incorrect');
        } else {
            score++;
        }
        
        // Show result
        resultElement.textContent = index === correctIndex ? 
            'Correct! 🎉' : 'Wrong! Try again.';
    }, 500);
}

function resetTriviaGame() {
    const { startButton, questionElement, optionsContainer, resultElement } = window.triviaElements;
    
    // Reset game state
    currentQuestion = 0;
    score = 0;
    triviaActive = false;
    
    // Reset UI
    questionElement.textContent = 'Click Start to begin the trivia!';
    optionsContainer.innerHTML = '';
    resultElement.textContent = '';
    startButton.textContent = 'Start Trivia';
}

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize all games when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all games
    initWordle();
    initConnections();
    initTrivia();
    initSitcoms();
    initLyrics();
    
    // Set up game navigation
    const gameButtons = document.querySelectorAll('.game-btn');
    const gameContents = document.querySelectorAll('.game-content');
    
    gameButtons.forEach(button => {
        button.addEventListener('click', () => {
            const game = button.getAttribute('data-game');
            
            // Update active button
            gameButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show selected game content
            gameContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${game}-game`) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Apply animation delays to sitcom and lyrics cards
    const sitcomCards = document.querySelectorAll('.sitcom-card');
    sitcomCards.forEach((card, index) => {
        card.style.setProperty('--i', index);
    });
    
    const lyricsCards = document.querySelectorAll('.lyrics-card');
    lyricsCards.forEach((card, index) => {
        card.style.setProperty('--i', index);
    });
});
