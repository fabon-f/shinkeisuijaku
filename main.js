var carddata = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];
var clickcount = 0;
var cardimg = [];
var images;
var cardback;

window.addEventListener('load', init, false);

function init() {
	var btn = document.getElementById('startbtn');
	btn.addEventListener('click', gamestartclick, false);
	btn = document.getElementById('restartbtn');
	btn.addEventListener('click', restartclick, false);
	for (var i = 0; i < 10; i++) {
		cardimg[i] = document.createElement('img');
		cardimg[i].src = 'img/' + (i + 1) + '.png';
		images = document.querySelectorAll('img');
	}
	cardback = document.createElement('img');
	cardback.src = 'img/cardback.png';
}

function gamestartclick(e) {
	document.getElementById('title').style.display = 'none';
	document.getElementById('game').style.display = 'block';
	gamestart();
}

function restartclick(e) {
	for (var i = 0; i < images.length; i++) {
		images[i].src = cardback.src;
	}
	gamestart();
}

function gamestart() {
	for (var i = 0; i < 50; i++) {
		var a = Math.floor( Math.random() * carddata.length);
		var b = Math.floor( Math.random() * carddata.length);
		var c = carddata[a];
		carddata[a] = carddata[b];
		carddata[b] = c;
	}
	for (i = 0; i < images.length; i++) {
		images[i].addEventListener('click', imgclick, false);
		images[i].cardid = carddata[i];
	}
}

function imgclick(e) {
	if (clickcount === 0) {
		var clickimg = e.target;
		clickimg.src = cardimg[clickimg.cardid - 1].src;
	}
}
