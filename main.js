var pictures = {};
var computer = {
	play: function() {
		var card1, card2;
		var result = computer.getCards();
		card1 = result[0];
		card2 = result[1];
		card1.src = pictures.front[card1.cardid - 1].src;
		setTimeout(function() {
			card2.src = pictures.front[card2.cardid - 1].src;
		}, 500);
		setTimeout(function() {
			if (card1.cardid === card2.cardid) {
				card1.parentNode.removeChild(card1);
				card2.parentNode.removeChild(card2);
				computer.score = computer.score + 2;
				document.getElementById('comcount').innerHTML = computer.score;

				var img1;
				img1 = document.createElement('img');
				img1.src = pictures.front[card1.cardid - 1].src;
				img1.className = 'countcards';
				img1.style.right = computer.score * 20 + 'px';

				var img2;
				img2 = document.createElement('img');
				img2.src = pictures.front[card2.cardid - 1].src;
				img2.className = 'countcards';
				img2.style.right = (computer.score + 1) * 20 + 'px';

				var comimgs = document.getElementById('comcards');
				comimgs.appendChild(img1);
				comimgs.appendChild(img2);

				if (player.score + computer.score === 24) {
					setTimeout(gameset, 500);
					return;
				}
				setTimeout(computer.play, 500);
			} else {
				card1.src = pictures.back.src;
				card2.src = pictures.back.src;
				player.flag.canclick = true;
				document.getElementById('turn').innerHTML = 'あなたの番です';
			}
		}, 1000);
	},
	memory: [],
	processes: {
		beginner: function() {
			var images = document.querySelectorAll('#cards img');
			var length = images.length;
			var a = Math.floor(Math.random() * length);
			var b = Math.floor(Math.random() * (length - 1));
			if (a <= b) {
				b = b + 1;
			}
			var cards = [];
			cards[0] = images[a];
			cards[1] = images[b];
			return cards;
		},
		middle: function() {

		},
		higher: function() {

		}
	},
	getCards: undefined,
	score: 0
};
var player = {
	click: {},
	input: {},
	flag: {clickcount: 0, canclick: true},
	score: 0
};

window.addEventListener('load', init, false);

function init() {
	var button = document.getElementById('startbtn');
	button.addEventListener('click', gamestartClick, false);
	button = document.getElementById('restartbtn');
	button.addEventListener('click', restartClick, false);
	pictures.front = [];
	for (var i = 0; i < 12; i++) {
		pictures.front[i] = document.createElement('img');
		pictures.front[i].src = 'img/' + (i + 1) + '.png';
	}
	pictures.back = document.createElement('img');
	pictures.back.src = 'img/cardback.png';
}

function gamestartClick(e) {
	//check input
	var orders = document.getElementsByName('order');
	var length = orders.length;
	for (var i = 0; i < length; i++) {
		if (orders[i].checked) {
			player.input.order = orders[i].value;
			break;
		}
	}
	var levels = document.getElementsByName('AIlevel');
	length = levels.length;
	for (i = 0; i < length; i++) {
		if (levels[i].checked) {
			player.input.level = levels[i].value;
			computer.getCards = computer.processes[player.input.level];
			break;
		}
	}
	var checked = true;
	if (typeof player.input.order === 'undefined') {
		document.getElementById('alertorder').style.display = 'block';
		checked = false;
	}
	if (typeof player.input.level === 'undefined') {
		document.getElementById('alertlevel').style.display = 'block';
		checked = false;
	}
	if (checked === false) {
		return;
	}
	document.getElementById('title').style.display = 'none';
	document.getElementById('game').style.display = 'block';

	gamestart();
}

function restartClick(e) {
	var images = document.querySelectorAll('#cards img');
	var length = images.length;
	for (var i = 0; i < length; i++) {
		images[i].parentNode.removeChild(images[i]);
	}

	var plcards = document.querySelectorAll('#plcards img');
	length = plcards.length;
	for (i = 0; i < length; i++) {
		plcards[i].parentNode.removeChild(plcards[i]);
	}
	
	var comcards = document.querySelectorAll('#comcards img');
	length = comcards.length;
	for (i = 0; i < length; i++) {
		comcards[i].parentNode.removeChild(comcards[i]);
	}

	document.getElementById('comcount').innerHTML = 0;
	document.getElementById('plcount').innerHTML = 0;
	document.getElementById('turn').innerHTML = 'あなたの番です';
	document.getElementById('gameset').style.display = 'none';
	player.flag.canclick = 0;
	gamestart();
}

function gamestart() {
	var cardData = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12];
	var length = cardData.length;
	var i;
	/*for (i = 0; i < 80; i++) {
		var a = Math.floor( Math.random() * length);
		var b = Math.floor( Math.random() * length);
		var c = cardData[a];
		cardData[a] = cardData[b];
		cardData[b] = c;
	}*/

	var img;
	for (i = 0; i < 24; i++) {
		img = document.createElement('img');
		img.src = pictures.back.src;
		img.id = 'card' + i;
		img.style.left = (i % 8) * 110 + 'px';
		img.style.top = Math.floor(i / 8) * 150 + 'px';
		cards.appendChild(img);
	}

	var images = document.querySelectorAll('#cards img');
	for (i = 0; i < length; i++) {
		images[i].addEventListener('click', imgclick, false);
		images[i].cardid = cardData[i];
	}
	player.score = 0;
	computer.score = 0;
	player.flag.canclick = true;
}

function imgclick(e) {
	if (player.flag.canclick) {
		if (player.flag.clickcount === 0) {
			//first time
			player.click.first = e.target;
			player.click.first.src = pictures.front[player.click.first.cardid - 1].src;
			player.flag.clickcount++;
		} else {
			//second time
			player.click.second = e.target;
			if (player.click.first !== player.click.second) {
				player.click.second.src = pictures.front[player.click.second.cardid - 1].src;
				player.flag.clickcount--;
				player.flag.canclick = false;
				setTimeout(function() {
					if (player.click.first.cardid === player.click.second.cardid) {
						//if cards are same number
						var cards = document.getElementById('cards');
						cards.removeChild(player.click.first);
						cards.removeChild(player.click.second);
						//show image in score
						var img1;
						img1 = document.createElement('img');
						img1.src = pictures.front[player.click.first.cardid - 1].src;
						img1.className = "countcards";
						img1.style.left = player.score * 20 + 'px';

						var img2;
						img2 = document.createElement('img');
						img2.src = pictures.front[player.click.second.cardid - 1].src;
						img2.className = "countcards";
						img2.style.left = (player.score + 1) * 20 + 'px';

						var plimgs = document.getElementById('plcards');
						plimgs.appendChild(img1);
						plimgs.appendChild(img2);

						player.score = player.score + 2;
						document.getElementById('plcount').innerHTML = player.score;
						player.flag.canclick = true;

						if (player.score + computer.score === 24) {
							setTimeout(gameset, 500);
						}
					} else {
						//if cards are different number
						player.click.first.src = pictures.back.src;
						player.click.second.src = pictures.back.src;
						document.getElementById('turn').innerHTML = '相手の番です';
						setTimeout(computer.play, 500);
					}
				}, 500);
			}
		}
	}
}

function gameset() {
	document.getElementById('turn').innerHTML = '';
	var gamesetScreen = document.getElementById('gameset');
	gamesetScreen.style.display = 'block';
	var gameResult = computer.score + ' - ' + player.score + '<br>';
	if (player.score < computer.score) {
		gameResult = gameResult + 'あなたの負けです';
	} else if (player.score === computer.score) {
		gameResult = gameResult + '引き分けです';
	} else {
		gameResult = gameResult + 'あなたの勝ちです';
	}
	gamesetScreen.innerHTML = gameResult;
}