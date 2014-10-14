var carddata = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];
var clickcount = 0;
var cardimg = [];
var images,cardback,clearimg;
var fstclick,secclick;
var clickedcheck = 0;

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
		images[i].classList.add('cardimg');
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
	if (clickedcheck === 0) {
		if (clickcount === 0) {
			fstclick = e.target;
			fstclick.src = cardimg[fstclick.cardid - 1].src;
			fstclick.classList.remove('cardimg');
			clickcount++;
		} else {
			secclick = e.target;
			if (fstclick !== secclick) {
				secclick.src = cardimg[secclick.cardid - 1].src;
				secclick.classList.remove('cardimg');
				clickcount--;
				clickedcheck = 1;
				setTimeout(cardcheck, 1000);
			}
		}
	}
}

function cardcheck() {
	if (fstclick.cardid === secclick.cardid) {
		fstclick.src = clearimg.src;
		fstclick.removeEventListener('click', imgclick, false);
		secclick.src = clearimg.src;
		secclick.removeEventListener('click', imgclick, false);
	} else {
		fstclick.src = cardback.src;
		fstclick.classList.add('cardimg');
		secclick.src = cardback.src;
		secclick.classList.add('cardimg');
	}
	clickedcheck = 0;
}
