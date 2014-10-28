var carddata = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12];
var clickcount = 0;
var cardimg = [];
var images, cardback, clearimg;
var fstclick,secclick;
var plscore, comscore;
var clickedcheck = 0;
var level, order;

window.addEventListener('load', init, false);

function init() {
	var btn = document.getElementById('startbtn');
	btn.addEventListener('click', gamestartclick, false);
	btn = document.getElementById('restartbtn');
	btn.addEventListener('click', restartclick, false);
	for (var i = 0; i < 12; i++) {
		cardimg[i] = document.createElement('img');
		cardimg[i].src = 'img/' + (i + 1) + '.png';
		images = document.querySelectorAll('.cards li img');
	}
	cardback = document.createElement('img');
	cardback.src = 'img/cardback.png';
	clearimg = document.createElement('img');
	clearimg.src = 'img/clear.png';
}

function gamestartclick(e) {
	document.getElementById('title').style.display = 'none';
	document.getElementById('game').style.display = 'block';
	gamestart();
}

function restartclick(e) {
	for (var i = 0; i < images.length; i++) {
		images[i].src = cardback.src;
		images[i].className = "cardhover";
	}
	var plcards = document.querySelectorAll('#plcards img');
	var div = document.getElementById('plcards');
	var length = plcards.length;
	for (i = 0; i < length; i++) {
		plcards[i].parentNode.removeChild(plcards[i]);
	}
	images[i].addEventListener('click', imgclick, false);
	document.getElementById('comcount').innerHTML = 0;
	document.getElementById('plcount').innerHTML = 0;
	document.getElementById('turn').innerHTML = 'あなたの番です';
	gamestart();
	clickedcheck = 0;
}

function gamestart() {
	/*for (var i = 0; i < 80; i++) {
		var length = carddata.length;
		var a = Math.floor( Math.random() * length);
		var b = Math.floor( Math.random() * length);
		var c = carddata[a];
		carddata[a] = carddata[b];
		carddata[b] = c;
	}*/
	for (i = 0; i < images.length; i++) {
		images[i].addEventListener('click', imgclick, false);
		images[i].cardid = [carddata[i],i];
	}
	plscore = 0;
	comscore = 0;
}

function imgclick(e) {
	if (clickedcheck === 0) {
		if (clickcount === 0) {
			//first time
			fstclick = e.target;
			fstclick.src = cardimg[fstclick.cardid[0] - 1].src;
			fstclick.className = "";
			clickcount++;
		} else {
			//second time
			secclick = e.target;
			if (fstclick !== secclick) {
				secclick.src = cardimg[secclick.cardid[0] - 1].src;
				secclick.className = "";
				clickcount--;
				clickedcheck = 1;
				var hoverimgs = Array.prototype.slice.call(document.getElementsByClassName('cardhover'));
				var length = hoverimgs.length;
				for (var i = 0; i < length; i++) {
					hoverimgs[i].className = "";
				}
				setTimeout(function() {
					if (fstclick.cardid[0] === secclick.cardid[0]) {
						//if cards are same number
						fstclick.src = clearimg.src;
						fstclick.removeEventListener('click', imgclick, false);
						secclick.src = clearimg.src;
						secclick.removeEventListener('click', imgclick, false);
						//show image in score
						var img1;
						img1 = document.createElement('img');
						img1.src = cardimg[fstclick.cardid[0] - 1].src;
						img1.width = 50;
						img1.height = 70;
						img1.style.position = 'absolute';
						img1.style.left = plscore * 20 + 'px';

						var img2;
						img2 = document.createElement('img');
						img2.src = cardimg[secclick.cardid[0] - 1].src;
						img2.width = 50;
						img2.height = 70;
						img2.style.position = 'absolute';
						var left = (plscore + 1) * 20 + 'px';
						img2.style.left = left;

						var plimgs = document.getElementById('plcards');
						plimgs.appendChild(img1);
						plimgs.appendChild(img2);

						plscore = plscore + 2;
						document.getElementById('plcount').innerHTML = plscore;
						for (i = 0; i < length; i++) {
							hoverimgs[i].className = "cardhover";
						}
						clickedcheck = 0;
					} else {
						//if cards are different number
						fstclick.src = cardback.src;
						secclick.src = cardback.src;
						document.getElementById('turn').innerHTML = '相手の番です';
						setTimeout(AIturn, 500);
					}
				}, 1000);
			}
		}
	}
}

function AIturn () {
	var a = Math.floor(Math.random() * 24);
	var card1 = document.getElementById('card' + a);
	card1.src = cardimg[card1.cardid[0] - 1].src;
	var b;

	setTimeout(function() {
		b = Math.floor(Math.random() * 23);
		if (b > a) {
			b = b + 1;
		}
		var card2 = document.getElementById('card' + b);
		card2.src = cardimg[card2.cardid[0] - 1].src;

		setTimeout(function() {
			if (card1.cardid[0] === card2.cardid[0]) {
				card1.src = clearimg.src;
				card2.src = clearimg.src;
				card1.removeEventListener('click', imgclick, false);
				card2.removeEventListener('click', imgclick, false);
			} else {
				card1.src = cardback.src;
				card2.src = cardback.src;
			}
		}, 800);
	}, 400);
}
