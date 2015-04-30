/* global document, location, Promise, setTimeout */
'use strict';
// (function() {
	var error = function(error) {
		console.error(error);
	};
	var CARD_COUNT = 24;
	var WAIT_TIME = 500;
	var pictures = {
		front: []
	};
	var computer = {
		score: 0
	};
	var board = {};
	var player = {
		canClick: false,
		clickCount: 0, //0:first 1:second
		firstClickedCard: null,
		score: 0
	};
	var game = {};
	var wait = function(time) {
		return new Promise(function(resolve) {
			setTimeout(function() {
				resolve();
			}, time);
		});
	};
	var cards = {
		data: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12],
		getNumber: function(card) {
			var id = parseInt(card.id.slice(4));
			return this.data[id];
		},
		flip: function(card) {
			var number = cards.getNumber(card);
			card.src = pictures.front[number - 1].src;
		},
		remove: function(card) {
			card.style.visibility = 'hidden';
			card.className = '';
		},
		all: function() {
			return Array.prototype.slice.call(document.querySelectorAll('.cards'));
		}
	};

	computer.levelList = ['beginner', 'middle', 'higher'];
	player.orderList = ['first', 'second'];

	var checkSameCards = function(cardList) {
		var i, j;
		var length = cardList.length;
		var cardNumber;
		for (i = 0; i < length; i++) {
			cardNumber = cards.getNumber(cardList[i]);
			for (j = i + 1; j < length; j++) {
				if (cardNumber === cards.getNumber(cardList[j])) {
					return [cardList[i], cardList[j]];
				}
			}
		}
		return null;
	};

	var aiRandom = function() {
		var cardList = cards.all();
		var a = Math.floor(Math.random() * cardList.length);
		var card1 = cardList[a];
		var b = Math.floor(Math.random() * (cardList.length - 1));
		var card2 = cardList[a > b ? b : b + 1];
		return [card1, card2];
	};

	var aiBeginner = function() {
		var result;
		if (Math.random() < 0.7) {
			result = aiMiddle();
		} else {
			result = aiRandom();
		}
		return result;
	};

	var aiMiddle = function() {
		var memory = computer.memory;
		var cards = checkSameCards(memory);
		if (cards) {
			return cards;
		} else {
			return aiRandom();
		}
	};

	var aiHigher = function() {
		var memoryLength;
		var i;
		var cardList = cards.all();
		var aiResult = checkSameCards(computer.memory);
		if (aiResult) {
			return cards;
		} else {
			var card2;
			var card1 = cardList[Math.floor(Math.random() * cardList.length)];
			var card1Number = cards.getNumber(card1);
			for (memoryLength = computer.memory.length ,i = memoryLength - 1; i >= 0; i--) {
				if (cards.getNumber(computer.memory[i]) === card1Number && card1 !== computer.memory[i]) {
					card2 = computer.memory[i];
					break;
				}
			}
			if (card2) {
				return [card1, card2];
			}
			card2 = removeSameElement(cardList.slice(), card1)[Math.floor(Math.random() * cardList.length - 1)];
			return [card1, card2];
		}
	};

	computer.ai = {
		beginner: aiBeginner,
		middle: aiMiddle,
		higher: aiMiddle
	};

	var has = function(array, element) {
		var i, length = array.length;
		for (i = length - 1; i >= 0; i--) {
			if (array[i] === element) {
				return true;
			}
		}
		return false;
	};

	var removeSameElement = function(array, element) {
		var i, length = array.length;
		for (i = length - 1; i >= 0; i--) {
			if (array[i] === element) {
				array.splice(i, 1);
			}
		}
		return array;
	};

	var downloadImage = function(url) {
		return new Promise(function(resolve, reject) {
			var image = document.createElement('img');
			image.onload = function(event) {
				resolve(event.target);
			};
			image.onerror = image.onabort = function() {
				reject();
			};
			image.src = url;
		});
	};

	var alertError = function(settings) {
		alert(settings.message);
		settings.action();
	};

	var cardClick = function(e) {
		var card = e.target;
		if (!player.canClick) {
			return;
		}
		if (player.clickCount === 0) {
			//first time
			cards.flip(card);
			player.firstCard = card;
			player.clickCount = 1;
		} else {
			//second time
			if (player.firstCard === card) { return; }
			cards.flip(card);
			wait(WAIT_TIME).then(function() {
				checkCards(player.firstCard, card, 'player');
			}, error);
			player.canClick = false;
			player.clickCount = 0;
		}
	};

	var checkCards = function(card1, card2, order) {
		computer.memory.update(card1, card2);
		if (order === 'player') {
			if (cards.getNumber(card1) === cards.getNumber(card2)) {
				cards.remove(card1);cards.remove(card2);
				player.canClick = true;
				player.score += 2;
				document.getElementById('plcount').innerHTML = player.score;
				if (player.score + computer.score === CARD_COUNT) {
					game.end();
				}
			} else {
				card1.src = pictures.back.src;
				card2.src = pictures.back.src;
				document.getElementById('turn').innerHTML = '相手の番です';
				computer.play();
			}
		} else if (order === 'computer') {
			if (cards.getNumber(card1) === cards.getNumber(card2)) {
				cards.remove(card1);cards.remove(card2);
				player.canClick = false;
				computer.score += 2;
				document.getElementById('comcount').innerHTML = computer.score;
				if (player.score + computer.score === CARD_COUNT) {
					game.end();
					return;
				}
				computer.play();
			} else {
				card1.src = pictures.back.src;
				card2.src = pictures.back.src;
				document.getElementById('turn').innerHTML = 'あなたの番です';
				player.canClick = true;
			}
		}
	};

	var preload = function() {
		var i;
		var promises = [];
		for (i = 0; i < CARD_COUNT / 2; i++) {
			promises[i] = downloadImage('./img/' + (i + 1) + '.png');
		}
		return Promise.all([Promise.all(promises), downloadImage('./img/cardback.png')]);
	};

	game.start = function(computerLevel, playerOrder) {
		if (has(computer.levelList, computerLevel) && has(player.orderList, playerOrder)) {
			computer.level = computerLevel;
			player.order = playerOrder;
			document.getElementById('title').style.display = 'none';
			document.getElementById('game').style.display = 'block';
			board.replaceAllCards();
			computer.score = 0;
			player.score = 0;
			document.getElementById('plcount').innerHTML = player.score;
			document.getElementById('comcount').innerHTML = computer.score;
			document.getElementById('gameset').style.display = 'none';
			if (playerOrder === 'first') {
				player.canClick = true;
				document.getElementById('turn').innerHTML = 'あなたの番です';
			} else {
				player.canClick = false;
				document.getElementById('turn').innerHTML = '相手の番です';
				computer.play();
			}
		} else {
			alertError({
				message: '選択したレベルもしくは手番が無効です',
				action: function() {
					location.reload();
				}
			});
		}
	};

	game.end = function() {
		var gameset = document.getElementById('gameset');
		gameset.style.display = 'block';
		if (computer.score > player.score) {
			gameset.innerHTML = 'あなたの負けです';
		} else if (computer.score === player.score) {
			gameset.innerHTML = '引き分けです';
		} else {
			gameset.innerHTML = 'あなたの勝ちです';
		}
	};

	computer.play = function() {
		var computerCards = computer.ai[computer.level]();
		wait(WAIT_TIME).then(function() {
			cards.flip(computerCards[0]);
			return wait(WAIT_TIME);
		}).then(function() {
			cards.flip(computerCards[1]);
			return wait(WAIT_TIME);
		}).then(function() {
			checkCards(computerCards[0], computerCards[1], 'computer');
		}, error);
	};

	computer.memory = [];
	computer.memory.clear = function() {
		computer.memory = [];
	};
	computer.memory.update = function(card1, card2) {
		var maxMemoryHash = { beginner: 6, middle: 10, higher:14 };
		var maxMemory = maxMemoryHash[computer.level];

		if (cards.getNumber(card1) === cards.getNumber(card2)) {
			removeSameElement(computer.memory, card1);
			removeSameElement(computer.memory, card2);
		} else {
			if (!has(computer.memory, card1)) { computer.memory.push(card1); }
			if (!has(computer.memory, card2)) { computer.memory.push(card2); }
			if (computer.memory.length > maxMemory) {
				computer.memory.splice(0, computer.memory.length - maxMemory);
			}
		}
	};

	board.replaceAllCards = function() {
		var i;
		var cardHolder = document.getElementById('cards');
		var newCardHolder = board.template.cloneNode(true);
		var img = newCardHolder.firstChild;
		for (i = 0; i < CARD_COUNT; i++) {
			img.onclick = cardClick;
			img = img.nextSibling;
		}
		cardHolder.parentNode.replaceChild(newCardHolder, cardHolder);
	};

	var checkInput = function() {
		var i;
		var orderRadios = document.querySelectorAll('.order');
		var orderRadioCount = orderRadios.length;
		var level = null, order = null;
		for (i = 0; i < orderRadioCount; i++) {
			if (orderRadios[i].checked) {
				order = orderRadios[i].value;
				break;
			}
		}
		var levelRadios = document.querySelectorAll('.AIlevel');
		var levelRadiosCount = levelRadios.length;
		for (i = 0; i < levelRadiosCount; i++) {
			if (levelRadios[i].checked) {
				level = levelRadios[i].value;
				break;
			}
		}
		return {
			level: level,
			order: order
		};
	};

	var createBoardTemplate = function() {
		var i, card;
		var cardHolder = document.getElementById('cards').cloneNode(false);
		for (i = 0; i < CARD_COUNT; i++) {
			card = document.createElement('img');
			card.src = pictures.back.src;
			card.id = 'card' + i;
			card.className = 'cards';
			cardHolder.appendChild(card);
		}
		return cardHolder;
	};

	var startClick = function() {
		var titleInput = checkInput();
		if (titleInput.level && titleInput.order) {
			document.getElementById('alertorder').style.visibility = 'hidden';
			document.getElementById('alertlevel').style.visibility = 'hidden';
			game.start(titleInput.level, titleInput.order);
		} else {
			if (titleInput.level) {
				document.getElementById('alertlevel').style.visibility = 'hidden';
			} else {
				document.getElementById('alertlevel').style.visibility = 'visible';
			}
			if (titleInput.order) {
				document.getElementById('alertorder').style.visibility = 'hidden';
			} else {
				document.getElementById('alertorder').style.visibility = 'visible';
			}
		}
	};

	var init = function() {
		if (typeof Promise !== 'function') {
			alertError({
				message: 'プログラムのダウンロードと実行に失敗しました',
				action: function() {
					location.reload();
				}
			});
		}
		preload().then(function(result) {
			pictures.front = result[0];
			pictures.back = result[1];
		}).then(function() {
			var startButton = document.getElementById('startbtn');
			startButton.className = '';
			startButton.onclick = startClick;

			var restartButton = document.getElementById('restartbtn');
			restartButton.onclick = function() {
				game.start(computer.level, player.order);
			};

			document.getElementById('backtitle').onclick = function() {
				document.getElementById('title').style.display = 'block';
				document.getElementById('game').style.display = 'none';
			};

			board.template = createBoardTemplate();
		}, function() {
			alertError({
				message: '画像の読み込みに失敗しました',
				action: function() {
					location.reload();
				}
			});
		});
	};

	if (typeof Promise !== 'function') {
		(function() {
			var promisePolyfill = document.createElement('script');
			promisePolyfill.onload = init;
			promisePolyfill.onerror = promisePolyfill.onabort = function() {
				alertError({
					message: 'プログラムのダウンロードと実行に失敗しました',
					action: function() {
						location.reload();
					}
				});
			};
			promisePolyfill.src = './promise-polyfill.js';
		}) ();
	} else {
		init();
	}
// }) ();