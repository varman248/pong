// var circle={x:100,y:290,r:10};
// var rect={x:100,y:100,w:40,h:100};

class Game {
	
	constructor(canvas){
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.ball = new Ball(this.canvas);
		this.j1 = new Racket(this.canvas);
		this.j2 = new Racket(this.canvas);
		this.j2.position.x = this.canvas.width - 20;
	}

	play(){
		this.ball.move(this.j1, this.j2);
		this.j1.draw();
		//this.j2.draw();
		this.j2.godMod(this.ball.position.x, this.ball.position.y, this.ball.direction);
		var w = this.canvas.width
		this.ctx.font = "30px Arial";
		this.ctx.fillText(this.ball.left, w-w/3, 50);
		this.ctx.fillText(this.ball.rigth, w/3, 50);
	}
}

class Racket {

	constructor(canvas){
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.position = {x:20, y:this.canvas.height/2};
		this.width = 5;
		this.height = 40;
		// this.color = "blue";
	}

	moveY(y){
		this.setPosition(this.position.x, y);
	}

	moveUp(){
		this.setPosition(this.position.x, this.position.y-20);
	}

	moveDown(){
		this.setPosition(this.position.x, this.position.y+20);
	}

	setPosition(x, y){
		if (x<0) { x = 0 };
		if (y<0) { y = 0 };
		if (x>this.canvas.width) { x = this.canvas.width };
		if (y>this.canvas.height-this.height) { y = this.canvas.height-this.height };
		this.position.x = x;
		this.position.y = y;
	}

	draw(){
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.rect(this.position.x, this.position.y, this.width, this.height);
		// this.ctx.fillStyle = this.color;
		this.ctx.fill();
	}

	godMod(x, y, angle){
		var x2 = x + 2 * Math.cos(angle), y2 = y + 2 * Math.sin(angle);
		var x3 = canvas.width - 20, y3 = 0;
		var x4 = canvas.width - 20, y4 = canvas.height;
		var p = this.line_intersect(x, y, x2, y2, x3, y3, x4, y4);
		if (p){ this.setPosition(p.x, p.y); }
		this.draw();
	}

	line_intersect(x1, y1, x2, y2, x3, y3, x4, y4){
	    var ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
	    if (denom == 0) { return null; }
	    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
	    ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
	    return {
	        x: x1 + ua * (x2 - x1),
	        y: y1 + ub * (y2 - y1),
	        seg1: ua >= 0 && ua <= 1,
	        seg2: ub >= 0 && ub <= 1
	    };
	}

}

class Ball {

	constructor(canvas){
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.color = "white";
		this.rayon = 10;
		this.position = {x:this.canvas.width/2, y:this.canvas.height/2}
		this.direction = Math.PI*2 + Math.random()*.2;
		this.velocity = 1;
		this.left = 0;
		this.rigth = 0;
	}

	setPosition(x, y){
		this.position.x = x;
		this.position.y = y;
	}

	draw(){
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.beginPath();
		this.ctx.arc(this.position.x, this.position.y, this.rayon, 0, 2*Math.PI);
		this.ctx.fillStyle = this.color;
		this.ctx.fill();
	}

	randomPI(){
		return Math.PI/2 + Math.random() * .2;
	}

	randomColor(){
		var r = 150 + Math.random()*100;
		var g = 150 + Math.random()*100;
		var b = 150 + Math.random()*100;
		return 'rgba('+r+','+g+','+b+' ,1)';
	}

	move(racket1, racket2){
		var p = this.pointDirection(this.position.x, this.position.y, this.velocity, this.direction);
		// ALL SIDE
		if (p.x-this.rayon <= 0 || p.y-this.rayon <= 0 || 
			p.x+this.rayon >= this.canvas.width || p.y+this.rayon >= this.canvas.height){
			this.direction += this.randomPI();
		}
		//LEFT AND RIGTH
		if (p.x-this.rayon <= 0 || p.x+this.rayon >= this.canvas.width) {
			this.velocity = 1;
			if (this.velocity < 0) {this.velocity = 0; };
			this.position = {x:this.canvas.width/2, y:this.canvas.height/2}
			this.direction = Math.PI*2;
			this.direction *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
		}
		//LEFT
		if (p.x-this.rayon <= 0) { this.left++; };
		//RIGTH
		if (p.x+this.rayon >= this.canvas.width) { this.rigth++; };
		// IF COLLISION
		if (this.collision(racket1) || this.collision(racket2)){
			this.direction += this.randomPI();
			this.color = this.randomColor();
			this.velocity += .5; 
			if (this.velocity > 3) {this.velocity = 3; };
		}
		var p = this.pointDirection(this.position.x, this.position.y, this.velocity, this.direction);
		this.setPosition(p.x, p.y);
		this.draw();
	}

	pointDirection(x, y, distance, angle){
		var pos = {};
		pos.x = x + distance * Math.cos(angle);
		pos.y = y + distance * Math.sin(angle);
		return pos;
	}

	collision(rect){
		var rect = {x:rect.position.x, y:rect.position.y, w:rect.width, h:rect.height};
	    var distX = Math.abs(this.position.x - rect.x-rect.w/2);
	    var distY = Math.abs(this.position.y - rect.y-rect.h/2);

	    if (distX > (rect.w/2 + this.rayon)) { return false; }
	    if (distY > (rect.h/2 + this.rayon)) { return false; }

	    if (distX <= (rect.w/2)) { return true; } 
	    if (distY <= (rect.h/2)) { return true; }

	    var dx = distX - rect.w/2;
	    var dy = distY - rect.h/2;
	    return (dx*dx+dy*dy<=(this.rayon*this.rayon));
	}

}

canvas = $('canvas')[0];
ctx = canvas.getContext('2d');

var game = new Game(canvas);
var ballMove;

$('canvas').on('mouseover', (e)=>{
	ballMove = setInterval(()=>{ game.play(); }, 1);
});

$('canvas').on('mousemove', (e)=>{
	game.j1.moveY(e.offsetY);
});

$(document).on('keydown', ()=>{
	if (event.which == 38){ game.j1.moveUp(); }
	if (event.which == 40){ game.j1.moveDown(); }
});

$('canvas').on('mouseleave', ()=>{ 
	clearInterval(ballMove); 
	ctx.textAlign = "center"; 
	ctx.fillText("PAUSE", canvas.width/2, canvas.height/2);
});