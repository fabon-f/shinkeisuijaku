var g_clickcount = 0;
var g_images, g_selectableImage;
var g_pictures = {};
var g_click = {};
var g_playerScore, g_computerScore;
var g_clickedcheck = 0;
var g_input = {};

window.addEventListener('load', init, false);

function init() {
	var btn = document.getElementById('startbtn');
	btn.addEventListener('click', gamestartclick, false);
	btn = document.getElementById('restartbtn');
	btn.addEventListener('click', restartclick, false);
	g_pictures.front = [];
	for (var i = 0; i < 12; i++) {
		g_pictures.front[i] = document.createElement('img');
		g_pictures.front[i].src = 'img/' + (i + 1) + '.png';
	}
	g_pictures.back = document.createElement('img');
	g_pictures.back.src = 'img/cardback.png';
	g_pictures.clear = document.createElement('img');
	g_pictures.clear.src = 'img/clear.png';
	g_images = document.querySelectorAll('.cards li img');
}

function gamestartclick(e) {
	document.getElementById('title').style.display = 'none';
	document.getElementById('game').style.display = 'block';
	gamestart();
}

function restartclick(e) {
	var length = g_images.length;
	for (var i = 0; i < length; i++) {
		g_images[i].src = g_pictures.back.src;
		g_images[i].className = "cardhover";
	}
	var plcards = document.querySelectorAll('#plcards img');
	var div = document.getElementById('plcards');
	length = plcards.length;
	for (i = 0; i < length; i++) {
		plcards[i].parentNode.removeChild(plcards[i]);
	}
	document.getElementById('comcount').innerHTML = 0;
	document.getElementById('plcount').innerHTML = 0;
	document.getElementById('turn').innerHTML = 'あなたの番です';
	gamestart();
	g_clickedcheck = 0;
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

	for (i = 0; i < length; i++) {
		g_images[i].addEventListener('click', imgclick, false);
		g_images[i].cardid = [cardData[i],i];
	}
	g_selectableImage = document.querySelectorAll('.cards li img');
	g_playerScore = 0;
	g_computerScore = 0;
}

function imgclick(e) {
	if (g_clickedcheck === 0) {
		if (g_clickcount === 0) {
			//first time
			g_click.first = e.target;
			g_click.first.src = g_pictures.front[g_click.first.cardid[0] - 1].src;
			g_click.first.className = "";
			g_clickcount++;
		} else {
			//second time
			g_click.second = e.target;
			if (g_click.first !== g_click.second) {
				g_click.second.src = g_pictures.front[g_click.second.cardid[0] - 1].src;
				g_click.second.className = "";
				g_clickcount--;
				g_clickedcheck = 1;
				g_selectableImage = Array.prototype.slice.call(document.getElementsByClassName('cardhover'));
				var length = g_selectableImage.length;
				for (var i = 0; i < length; i++) {
					g_selectableImage[i].className = "";
				}
				setTimeout(function() {
					if (g_click.first.cardid[0] === g_click.second.cardid[0]) {
						//if cards are same number
						g_click.first.src = g_pictures.clear.src;
						g_click.first.removeEventListener('click', imgclick, false);
						g_click.second.src = g_pictures.clear.src;
						g_click.second.removeEventListener('click', imgclick, false);
						//show image in score
						var img1;
						img1 = document.createElement('img');
						img1.src = g_pictures.front[g_click.first.cardid[0] - 1].src;
						img1.className = "countcards";
						img1.style.left = g_playerScore * 20 + 'px';

						var img2;
						img2 = document.createElement('img');
						img2.src = g_pictures.front[g_click.second.cardid[0] - 1].src;
						img2.className = "countcards";
						img2.style.left = (g_playerScore + 1) * 20 + 'px';

						var plimgs = document.getElementById('plcards');
						plimgs.appendChild(img1);
						plimgs.appendChild(img2);

						g_playerScore = g_playerScore + 2;
						document.getElementById('plcount').innerHTML = g_playerScore;
						for (i = 0; i < length; i++) {
							g_selectableImage[i].className = "cardhover";
						}
						g_clickedcheck = 0;
						if (g_playerScore + g_computerScore === 24) {
							if (g_playerScore < g_computerScore) {
								alert('you lose');
							} else if (g_playerScore === g_computerScore) {
								alert('equal');
							} else {
								alert('you win');
							}
						}
					} else {
						//if cards are different number
						g_click.first.src = g_pictures.back.src;
						g_click.second.src = g_pictures.back.src;
						document.getElementById('turn').innerHTML = '相手の番です';
						g_selectableImage.push(g_click.first);
						g_selectableImage.push(g_click.second);
						setTimeout(AIturn, 500);
					}
				}, 500);
			}
		}
	}
}

function AIturn () {
	var length = g_selectableImage.length;
	var a = Math.floor(Math.random() * length);
	var card1 = g_selectableImage[a];
	card1.src = g_pictures.front[card1.cardid[0] - 1].src;

	var b;

	setTimeout(function() {
		b = Math.floor(Math.random() * (length - 1));
		if (b >= a) {
			b = b + 1;
		}
		var card2 = g_selectableImage[b];
		card2.src = g_pictures.front[card2.cardid[0] - 1].src;

		setTimeout(function() {
			if (card1.cardid[0] === card2.cardid[0]) {
				card1.src = g_pictures.clear.src;
				card2.src = g_pictures.clear.src;
				card1.removeEventListener('click', imgclick, false);
				card2.removeEventListener('click', imgclick, false);
				g_computerScore = g_computerScore + 2;
				document.getElementById('comcount').innerHTML = g_computerScore;
				if (a < b) {
					g_selectableImage.splice(b, 1);
					g_selectableImage.splice(a, 1);
				} else {
					g_selectableImage.splice(a, 1);
					g_selectableImage.splice(b, 1);
				}
				if (g_playerScore + g_computerScore === 24) {
					if (g_playerScore < g_computerScore) {
						alert('あなたの負けです');
					} else if (g_playerScore === g_computerScore) {
						alert('引き分けです');
					} else {
						alert('あなたの勝ちです');
					}
				return;
				}
				setTimeout(AIturn, 500);
			} else {
				card1.src = g_pictures.back.src;
				card2.src = g_pictures.back.src;
				g_clickedcheck = 0;
				document.getElementById('turn').innerHTML = 'あなたの番です';
				for (var i = 0; i < length; i++) {
					g_selectableImage[i].className = 'cardhover';
				}
				g_click.first.className = 'cardhover';
				g_click.second.className = 'cardhover';
			}
		}, 500);
	}, 500);
}
