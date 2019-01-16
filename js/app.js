// Global variables
let     icons       = ["fas fa-leaf", "fas fa-leaf", "fas fa-moon", "fas fa-moon", "fas fa-sun", "fas fa-sun", "fas fa-bolt", "fas fa-bolt", "fas fa-frog", "fas fa-frog", "fas fa-cloud", "fas fa-cloud", "fas fa-fire", "fas fa-fire", "fas fa-music", "fas fa-music"],
        liveTimer,
        matchCards  = [],
        moves       = 0,
        openCards   = [],
        seconds     = 0,
        start       = true;

const   deck        = document.querySelector('.deck'),
        moveCounter = document.querySelector(".moves"),
        playAgain   = document.querySelector(".play-again"),
        rate        = document.querySelector(".stars"),
        restart     = document.querySelector('.restart'),
        time        = document.querySelector('.time');

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function init() {
    // Shuffle and generate cards
    icons = shuffle(icons);
    for (let i = 0; i < icons.length; i++) {
        const card = document.createElement('li');
        card.classList.add('card');
        card.innerHTML = `<i class="${icons[i]}"></i>`;
        deck.appendChild(card);

        // Handle click event for each card
        flip(card);
    }
}

function flip(card) {
    card.addEventListener('click', function () {
        
        if(start) {
            startTimer();
            start = false;
        }

        const currentCard = this;
        const previousCard = openCards[0];

        if (openCards.length === 1) {
            
            card.classList.add('open', 'show', 'animated', 'flipInY');
            openCards.push(this);

            // Compare the two cards
            match(currentCard, previousCard);
            
            // Increment move counter
            addMove();

            // Update rating
            rating();

        } else {
            card.classList.add('open', 'show', 'animated', 'flipInY');
            openCards.push(this);
        }
    });
}

function match(currentCard, previousCard) {
    // Match found
    if (currentCard.innerHTML === previousCard.innerHTML) {
        
        currentCard.classList.remove('animated', 'flipInY');
        previousCard.classList.remove('animated', 'flipInY');
        
        currentCard.classList.add('match', 'animated', 'tada');
        previousCard.classList.add('match', 'animated', 'tada');

        matchCards.push(currentCard, previousCard);

        openCards = [];

        // Check if game is finished
        end();

    // Match not found
    } else {

        currentCard.classList.remove('animated', 'flipInY');
        previousCard.classList.remove('animated', 'flipInY');

        currentCard.classList.add('animated', 'wobble');
        previousCard.classList.add('animated', 'wobble');

        setTimeout(function() {
            currentCard.classList.remove('open', 'show', 'flipInY', 'wobble');
            previousCard.classList.remove('open', 'show', 'flipInY', 'wobble');
        }, 1000);

        openCards = [];

    }
}

function end() {
    if (matchCards.length === icons.length) {
        clearInterval(liveTimer);

        modal();
    }
}

// Modal
function modal() {
    document.querySelector(".modal").style.display = ('flex');
    document.querySelector(".total-seconds").innerHTML = seconds;
    document.querySelector(".total-moves").innerHTML = moves;
    document.querySelector(".total-stars").innerHTML = rate.innerHTML;
}

// Play Again
playAgain.addEventListener('click', function(e) {
    e.preventDefault();
    reset();
    init();
    document.querySelector(".modal").style.display = ('none');
});

// Move counter
function addMove() {
    moves++;
    moveCounter.innerHTML = `Moves: ${moves}`;
}

// Rating system
function rating() {
    if (moves > 12) {
        rate.innerHTML = '<li><i class="far fa-star"></i></li><li><i class="fas fa-star"></i></li><li><i class="fas fa-star"></i></li>';  
    } if (moves > 24) {
        rate.innerHTML = '<li><i class="far fa-star"></i></li><li><i class="far fa-star"></i></li><li><i class="fas fa-star"></i></li>';
    } if (moves > 36) {
        rate.innerHTML = '<li><i class="far fa-star"></i></li><li><i class="far fa-star"></i></li><li><i class="far fa-star"></i></li>';
    }
}

// Timer
function startTimer() {
    liveTimer = setInterval(function() {
        seconds++;
        time.innerHTML = seconds + 's';
    }, 1000);
}

// Logic for restart
restart.addEventListener('click', function() {
    // Reset any related variables
    reset();

    // Call 'init' to generate new cards
    init();
});

function reset() {
    deck.innerHTML = "";
    matchCards = [];
    openCards = [];
    moves = 0;
    moveCounter.innerHTML = `Moves: ${moves}`;
    clearInterval(liveTimer);
    seconds = 0;
    start = true;
    time.innerHTML = seconds + 's';
    rate.innerHTML = '<li><i class="fas fa-star"></i></li><li><i class="fas fa-star"></i></li><li><i class="fas fa-star"></i></li>';
}

init();