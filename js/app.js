/*
 * Create a list that holds all of your cards
 */
let cards = document.getElementsByClassName('card');

// Shuffle function from http://stackoverflow.com/a/2450976
const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
cards = shuffle(Array.from(cards)); // will convert cards from HTMLCollection to array
const deck = document.querySelector('.deck');
const fragment = document.createDocumentFragment();

for (let card of cards) {
	deck.removeChild(deck.firstElementChild);
	const newCard = document.createElement('li');
	newCard.className = card.className;
	newCard.innerHTML = card.innerHTML;
	fragment.appendChild(newCard);
}

deck.appendChild(fragment);

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call 
 * from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another 
 * function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this 
 * functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function 
 * that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in 
 * another function that you call from this one)
 */
const restart = document.querySelector('.restart');
restart.addEventListener('click', () => {
	window.location.reload();
});

let openCards = [];
let canFlip = true;
const moves = document.querySelector('.moves');
let cardPairs = 0;
const stars = document.querySelector('.stars');
let starCount = 3;
const timer = document.querySelector('.timer');

document.addEventListener('DOMContentLoaded', function startTimer() {
	const start = new Date().getTime(); // time in milliseconds
	const time = setInterval(() => {
		if (cardPairs === 8)
			clearInterval(time);

		let now = new Date().getTime();
		let minutes = Math.floor((now - start) / 60000);
		let seconds = Math.floor((now - start) % 60000 / 1000);
		timer.textContent = minutes + ':';

		if (seconds < 10)
			timer.textContent += '0' + seconds;
		else
			timer.textContent += seconds;
	}, 0);
});

const flipCard = (card) => {
	card.className += ' open show';
	openCards.push(card);
};

const displayWinMessage = () => {
	/* <div style="text-align: center; padding: 10% 0">
	 * 		<h1 style="font-weight: bold">Congratulations! You Won!</h1>
	 * 		<p style="white-space: pre">With x moves and x stars in x:xx.\r\nWoooooo!</p>
	 * 		<button type="button" style="background-color: limegreen; border-radius: 5px"
	 *  		onclick="window.location.reload()">Play again!</button>
	 * </div>
	 */
	document.querySelector('.container').remove();

	const winMessage = document.createElement('div');
	winMessage.setAttribute('style', 'text-align: center; padding: 10% 0');
	document.body.insertBefore(winMessage, document.body.firstChild); // insert before <script>

	const congrats = document.createElement('h1');
	congrats.style.fontWeight = 'bold';
	congrats.textContent = 'Congratulations! You Won!';
	winMessage.appendChild(congrats);

	const stats = document.createElement('p');
	stats.style.whiteSpace = 'pre'; // will allow for newlines w/ \r\n
	stats.textContent = 'With ' + moves.textContent + ' moves and ' + starCount + ' star(s) in ' +
		timer.textContent + '.\r\nWoooooo!';
	winMessage.appendChild(stats);

	const playAgainButton = document.createElement('button');
	playAgainButton.setAttribute('type', 'button');
	playAgainButton.setAttribute('style', 'background-color: limegreen; border-radius: 5px');
	playAgainButton.textContent = 'Play again!';
	playAgainButton.onclick = function() {
		window.location.reload();
	}
	winMessage.appendChild(playAgainButton);
};

const checkCards = (cards) => {
	canFlip = false; // disable flipping cards while checking

	setTimeout(function() {
		if (cards[0].firstElementChild.className === cards[1].firstElementChild.className) {
			cards[0].className = 'card match';
			cards[1].className = 'card match';
			cardPairs++;
		} else {
			cards[0].className = 'card';
			cards[1].className = 'card';
		}

		cards.pop();
		cards.pop();
		canFlip = true;

		if (cardPairs === 8)
			displayWinMessage();
	}, 400); // wait 0.4 seconds to check both cards

	let moveCount = parseInt(moves.textContent);
	moveCount++;
	moves.textContent = moveCount.toString();

	if (moveCount === 16) {
		stars.childNodes[5].firstElementChild.className = 'far fa-star'; // makes stars white
		starCount--;
	} else if (moveCount === 26) {
		stars.childNodes[3].firstElementChild.className = 'far fa-star';
		starCount--;
	}
};

deck.addEventListener('click', (event) => {
	if (canFlip) {
		const card = event.target;

		if (card.className === 'card')
			flipCard(card);

		if (openCards.length === 2)
			checkCards(openCards);
	}
});
