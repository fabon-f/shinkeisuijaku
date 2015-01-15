/* global document, setTimeout, window */
'use strict';
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
					setTimeout(game.end, 500);
					return;
				}
				computer.updateMemories('remove', card1, card2);
				setTimeout(computer.play, 500);
			} else {
				card1.src = pictures.back.src;
				card2.src = pictures.back.src;
				computer.updateMemories('add', card1, card2);
				player.flag.canclick = true;
				document.getElementById('turn').innerHTML = 'あなたの番です';
			}
		}, 1000);
	},
	memory: [],
	updateMemories: function(mode, card1, card2) {
		var memory = computer.memory;
		var length = memory.length, i;
		var hasCard1 = false, hasCard2 = false;
		var level = player.input.level;
		if (mode === 'add') {
			for (i = 0; i < length; i++) {
				if (memory[i] === card1) { hasCard1 = true; }
				if (memory[i] === card2) { hasCard2 = true; }
			}
			if (!hasCard1) {
				memory[length] = card1;
				length++;
			}
			if (!hasCard2) {
				memory[length] = card2;
			}
			if (level === 'beginner') {
				while (length > 6) {
					memory.splice(0, 1);
					length--;
				}
			} else if (level === 'middle') {
				while (length > 10) {
					memory.splice(0, 1);
					length--;
				}
			} else if (level === 'higher') {}
		} else if (mode === 'remove') {
			for (i = 0; i < length; i++) {
				if (memory[i] === card1 || memory[i] === card2) {
					memory.splice(i, 1);
					i--;
				}
			}
		}
	},
	checkSameCards: function() {
		var memory = computer.memory;
		var i, length = memory.length;
		var index;
		var numbers = memory.map(function(card) {
			return card.cardid;
		});
		for (i = 0; i < length; i++) {
			index = numbers.indexOf(numbers[i], i + 1);
			if (index !== -1) {
				return [i, index];
			}
		}
		return null;
	},
	processes: {
		beginner: function() {
			var index = computer.checkSameCards();
			var cards = [];
			if (index) {
				cards[0] = computer.memory[index[0]];
				cards[1] = computer.memory[index[1]];
			} else {
				var images = document.querySelectorAll('#cards img');
				var length = images.length;
				var a = Math.floor(Math.random() * length);
				var b = Math.floor(Math.random() * (length - 1));
				if (a <= b) {
					b = b + 1;
				}
				cards[0] = images[a];
				cards[1] = images[b];
			}
			return cards;
		},
		middle: function() {
			var memory = computer.memory;
			var index = computer.checkSameCards();
			var cards = [];
			var images;
			if (index) {
				cards[0] = memory[index[0]];
				cards[1] = memory[index[1]];
			} else {
				images = Array.prototype.slice.call(document.querySelectorAll('#cards img'));
				images = images.filter(function(card) {
					return memory.indexOf(card.cardid) === -1;
				});
				var length = images.length;
				var a = Math.floor(Math.random() * length);
				var b = Math.floor(Math.random() * (length - 1));
				if (a <= b) {
					b = b + 1;
				}
				cards[0] = images[a];
				cards[1] = images[b];
			}
			return cards;
		},
		higher: function() {}
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
var game = {
	start: function() {
		var cardData = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12];
		var length = cardData.length;
		var i,a,j;
		var cards = document.getElementById('cards');
		var removePlayerCards, removeComputerCards;
		//shuffle by Fisher-Yates algorithm
		for (i = length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			a = cardData[i];
			cardData[i] = cardData[j];
			cardData[j] = a;
		}
		computer.memory = [];

		removePlayerCards = function() {
			var plcards = document.getElementById('plcards');
			var node = plcards.cloneNode(false);
			plcards.parentNode.replaceChild(node, plcards);
		};
		removePlayerCards();

		removeComputerCards = function() {
			var comcards = document.getElementById('comcards');
			var node = comcards.cloneNode(false);
			comcards.parentNode.replaceChild(node, comcards);
		};
		removeComputerCards();

		(function () {
			var node = cards.cloneNode(false);
			var img, style;
			var imgtemplate = document.createElement('img');
			imgtemplate.src = pictures.back.src;
			for (var i = 0; i < 24; i++) {
				img = imgtemplate.cloneNode(false);
				img.id = 'card' + i;
				img.addEventListener('click', imgclick, false);
				style = img.style;
				style.left = (i % 8) * 110 + 'px';
				style.top = Math.floor(i / 8) * 150 + 'px';
				img.cardid = cardData[i];
				node.appendChild(img);
			}
			document.getElementById('game').replaceChild(node, cards);
		}) ();

		player.score = 0;
		computer.score = 0;
		document.getElementById('plcount').innerHTML = player.score;
		document.getElementById('comcount').innerHTML = computer.score;
		player.flag.clickcount = 0;
		document.getElementById('gameset').style.display = 'none';
		if (player.input.order === 'first') {
			player.flag.canclick = true;
			document.getElementById('turn').innerHTML = 'あなたの番です';
		} else {
			player.flag.canclick = false;
			document.getElementById('turn').innerHTML = '相手の番です';
			setTimeout(computer.play, 800);
		}
	},
	end: function() {
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
};

window.addEventListener('load', function() {
	document.getElementById('startbtn').addEventListener('click', gamestartClick, false);
	document.getElementById('restartbtn').addEventListener('click', restartClick, false);
	document.getElementById('backtitle').addEventListener('click', backtoTitle, false);
	pictures.front = [];
	for (var i = 0; i < 12; i++) {
		pictures.front[i] = document.createElement('img');
		pictures.front[i].src = 'img/' + (i + 1) + '.png';
	}
	pictures.back = document.createElement('img');
	pictures.back.src = 'img/cardback.png';
}, false);

function gamestartClick(e) {
	//check input
	var orders = document.getElementsByName('order');
	var length = orders.length;
	var i;
	var checkedorder, checkedlevel;
	var undef;//'undef' is undefined
	for (i = 0; i < length; i++) {
		if (orders[i].checked) {
			player.input.order = orders[i].value;
			checkedorder = orders[i];
			break;
		}
	}
	var levels = document.getElementsByName('AIlevel');
	length = levels.length;
	for (i = 0; i < length; i++) {
		if (levels[i].checked) {
			player.input.level = levels[i].value;
			checkedlevel = levels[i];
			computer.getCards = computer.processes[player.input.level];
			break;
		}
	}
	var checked = true;
	if (player.input.order === undef) {
		document.getElementById('alertorder').style.visibility = 'visible';
		checked = false;
	} else {
		document.getElementById('alertorder').style.visibility = 'hidden';
	}
	if (player.input.level === undef) {
		document.getElementById('alertlevel').style.visibility = 'visible';
		checked = false;
	} else {
		document.getElementById('alertlevel').style.visibility = 'hidden';
	}
	if (checked === false) {
		return;
	}
	document.getElementById('title').style.display = 'none';
	document.getElementById('game').style.display = 'block';
	checkedorder.checked = false;
	checkedlevel.checked = false;

	game.start();
}

function restartClick(e) {
	game.start();
}

function backtoTitle() {
	var undef;//undef is undefined
	document.getElementById('title').style.display = 'block';
	document.getElementById('game').style.display = 'none';
	player.input.order = undef;
	player.input.level = undef;
}

function imgclick(e) {
	if (!player.flag.canclick) return;
	if (player.flag.clickcount === 0) {
		//first time
		player.click.first = e.target;
		player.click.first.src = pictures.front[player.click.first.cardid - 1].src;
		player.flag.clickcount = 1;
	} else {
		//second time
		player.click.second = e.target;
		if (player.click.first === player.click.second) return;
		player.click.second.src = pictures.front[player.click.second.cardid - 1].src;
		player.flag.clickcount = 0;
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
				img1.className = 'countcards';
				img1.style.left = player.score * 20 + 'px';

				var img2;
				img2 = document.createElement('img');
				img2.src = pictures.front[player.click.second.cardid - 1].src;
				img2.className = 'countcards';
				img2.style.left = (player.score + 1) * 20 + 'px';

				var plimgs = document.getElementById('plcards');
				plimgs.appendChild(img1);
				plimgs.appendChild(img2);

				player.score = player.score + 2;
				document.getElementById('plcount').innerHTML = player.score;
				player.flag.canclick = true;

				if (player.score + computer.score === 24) {
					setTimeout(game.end, 500);
					return;
				}

				computer.updateMemories('remove', player.click.first, player.click.second);

			} else {
				//if cards are different number
				player.click.first.src = pictures.back.src;
				player.click.second.src = pictures.back.src;
				document.getElementById('turn').innerHTML = '相手の番です';
				setTimeout(computer.play, 500);
				computer.updateMemories('add', player.click.first, player.click.second);
			}
		}, 500);
	}
}