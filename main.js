var g_clickcount = 0;
var g_selectableImage;
var g_pictures = {};
var g_click = {};
var g_score = {};
var g_clickedcheck = 0;
var g_input = {};

window.addEventListener('load', init, false);

function init() {
	var btn = document.getElementById('startbtn');
	btn.addEventListener('click', gamestartClick, false);
	btn = document.getElementById('restartbtn');
	btn.addEventListener('click', restartClick, false);
	g_pictures.front = [];
	for (var i = 0; i < 12; i++) {
		g_pictures.front[i] = document.createElement('img');
		g_pictures.front[i].src = 'img/' + (i + 1) + '.png';
	}
	g_pictures.back = document.createElement('img');
	g_pictures.back.src = 'img/cardback.png';
}

function gamestartClick(e) {

	document.getElementById('title').style.display = 'none';
	document.getElementById('game').style.display = 'block';
	//check input
	var orders = document.getElementsByName('order');
	var length = orders.length;
	for (var i = 0; i < length; i++) {
		if (orders[i].checked) {
			g_input.order = orders[i].value;
			break;
		}
	}
	var levels = document.getElementsByName('AIlevel');
	length = levels.length;
	for (i = 0; i < length; i++) {
		if (levels[i].checked) {
			g_input.level = levels[i].value;
			break;
		}
	}

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
	g_clickedcheck = 0;
	gamestart();
}

function gamestart() {
	var cardData = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12];
	var length = cardData.length;
	/*for (var i = 0; i < 80; i++) {
		var a = Math.floor( Math.random() * length);
		var b = Math.floor( Math.random() * length);
		var c = cardData[a];
		cardData[a] = cardData[b];
		cardData[b] = c;
	}*/

	var img;
	for (i = 0; i < 24; i++) {
		img = document.createElement('img');
		img.src = g_pictures.back.src;
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
	g_selectableImage = document.querySelectorAll('#cards img');
	g_score.player = 0;
	g_score.computer = 0;
}

function imgclick(e) {
	if (g_clickedcheck === 0) {
		if (g_clickcount === 0) {
			//first time
			g_click.first = e.target;
			g_click.first.src = g_pictures.front[g_click.first.cardid - 1].src;
			g_clickcount++;
		} else {
			//second time
			g_click.second = e.target;
			if (g_click.first !== g_click.second) {
				g_click.second.src = g_pictures.front[g_click.second.cardid - 1].src;
				g_clickcount--;
				g_clickedcheck = 1;
				setTimeout(function() {
					if (g_click.first.cardid === g_click.second.cardid) {
						//if cards are same number
						var cards = document.getElementById('cards');
						cards.removeChild(g_click.first);
						cards.removeChild(g_click.second);
						//show image in score
						var img1;
						img1 = document.createElement('img');
						img1.src = g_pictures.front[g_click.first.cardid - 1].src;
						img1.className = "countcards";
						img1.style.left = g_score.player * 20 + 'px';

						var img2;
						img2 = document.createElement('img');
						img2.src = g_pictures.front[g_click.second.cardid - 1].src;
						img2.className = "countcards";
						img2.style.left = (g_score.player + 1) * 20 + 'px';

						var plimgs = document.getElementById('plcards');
						plimgs.appendChild(img1);
						plimgs.appendChild(img2);

						g_score.player = g_score.player + 2;
						document.getElementById('plcount').innerHTML = g_score.player;
						g_clickedcheck = 0;

						if (g_score.player + g_score.computer === 24) {
							setTimeout(gameset, 500);
						}
					} else {
						//if cards are different number
						g_click.first.src = g_pictures.back.src;
						g_click.second.src = g_pictures.back.src;
						document.getElementById('turn').innerHTML = '相手の番です';
						setTimeout(AIturn, 500);
					}
				}, 500);
			}
		}
	}
}

function AIturn () {
	g_selectableImage = Array.prototype.slice.call(document.querySelectorAll('#cards img'));
	var length = g_selectableImage.length;
	var a = Math.floor(Math.random() * length);
	var card1 = g_selectableImage[a];
	card1.src = g_pictures.front[card1.cardid - 1].src;

	var b;

	setTimeout(function() {
		b = Math.floor(Math.random() * (length - 1));
		if (b >= a) {
			b = b + 1;
		}
		var card2 = g_selectableImage[b];
		card2.src = g_pictures.front[card2.cardid - 1].src;

		setTimeout(function() {
			if (card1.cardid === card2.cardid) {
				card1.parentNode.removeChild(card1);
				card2.parentNode.removeChild(card2);
				g_score.computer = g_score.computer + 2;
				document.getElementById('comcount').innerHTML = g_score.computer;

				var img1;
				img1 = document.createElement('img');
				img1.src = g_pictures.front[card1.cardid - 1].src;
				img1.className = "countcards";
				img1.style.right = g_score.computer * 20 + 'px';

				var img2;
				img2 = document.createElement('img');
				img2.src = g_pictures.front[card2.cardid - 1].src;
				img2.className = "countcards";
				img2.style.right = (g_score.computer + 1) * 20 + 'px';

				var comimgs = document.getElementById('comcards');
				comimgs.appendChild(img1);
				comimgs.appendChild(img2);

				if (a < b) {
					g_selectableImage.splice(b, 1);
					g_selectableImage.splice(a, 1);
				} else {
					g_selectableImage.splice(a, 1);
					g_selectableImage.splice(b, 1);
				}
				if (g_score.player + g_score.computer === 24) {
					setTimeout(gameset, 500);
				return;
				}
				setTimeout(AIturn, 500);
			} else {
				card1.src = g_pictures.back.src;
				card2.src = g_pictures.back.src;
				g_clickedcheck = 0;
				document.getElementById('turn').innerHTML = 'あなたの番です';
			}
		}, 500);
	}, 500);
}

function gameset() {
	document.getElementById('turn').innerHTML = '';
	var gamesetScreen = document.getElementById('gameset');
	gamesetScreen.style.display = 'block';
	var gameResult = g_score.computer + ' - ' + g_score.player + '<br>';
	if (g_score.player < g_score.computer) {
		gameResult = gameResult + 'あなたの負けです';
	} else if (g_score.player === g_score.computer) {
		gameResult = gameResult + '引き分けです';
	} else {
		gameResult = gameResult + 'あなたの勝ちです';
	}
	gamesetScreen.innerHTML = gameResult;
}
