var carddata = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];
var clickcount = 0;

window.addEventListener('load', init, false);

function init() {
	var btn = document.getElementById('startbtn');
	btn.addEventListener('click', gamestartclick, false);
	btn = document.getElementById('restartbtn');
	btn.addEventListener('click', restartclick, false);
}

function gamestartclick(e) {
	document.getElementById('title').style.display = 'none';
	document.getElementById('game').style.display = 'block';
	gamestart();
}

function restartclick(e) {
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

	var images = document.querySelectorAll('img');

	for (i = 0; i < images.length; i++) {
		images[i].addEventListener('click', imgclick, false);
		images[i].cardid = carddata[i];
	}
}

function imgclick(e) {
	alert(e.target.cardid);
}
