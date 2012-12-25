/*
 *  ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <jens@bennerhq.com> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return Jens Kaas Benner
 *
 * Origin: http://people.freebsd.org/~phk/
 * ----------------------------------------------------------------------------
 */

var WIDTH = 16;
var HEIGHT = 10;
var ANIMATION = 20;
var MIN_PCT = 0.3;
var MAX_PCT = 0.9;
var BONUS_PCT = 0.07;

function Downtown(id_field, id_score, id_hi) {

        this.start = function() {
		this.score = 0;
		this.next();
	}

	this.stop = function() {
		this.score = 0;	
		this.clear();
	}

	this.setHeartbeat = function() {
		var _this_ = this;
		this.heartbeat = setTimeout(function() { _this_.action(); }, ANIMATION);
	}

	this.setShoot = function() {
		var _this_ = this;
		document.onkeypress = function() { _this_.shoot(); }
		document.ontouchstart = function() { _this_.shoot(); }
	}

	this.clear = function() {
		if (this.field != null) {
			this.field.innerHTML = '';	
		}
		if (this.heartbeat != null) {
			clearTimeout(this.heartbeat);
		}
		this.ship = this.bomb = this.bonus = null;
		this.bonus_count = 0;
		this.count = 0;
		this.text_score.innerHTML = this.score;
		this.text_hi.innerHTML = this.hi;
	}

	this.next = function() {
		this.clear();

		this.field_width = this.field.clientWidth;
		this.field_height = this.field.clientHeight;

		var space_min = Math.floor(this.field_height * MIN_PCT);
    		var space_max = Math.floor(this.field_height * MAX_PCT) - space_min;

    		for (this.count=0;
		     this.count < Math.floor(this.field_width / WIDTH); 
		     this.count++) {
			var h = this.field_height - space_min - 
		       		Math.floor(Math.random() * space_max / HEIGHT) * HEIGHT;
		
			var div = document.createElement("div");
			div.id = "b" + this.count;
			div.style.left = (this.count * WIDTH) + "px";
			div.style.top = h + "px";
			div.style.width = (WIDTH - 4) + "px";
			div.style.height = (this.field_height - h - 2) + "px";
			div.style.borderStyle = "solid";
			div.style.borderWidth = "1px";
			div.style.position = "absolute";
			div.style.borderColor = "darkgray";
			field.appendChild(div);
    		}

		this.ship = document.createElement("div");
		this.ship.id = "ship";
		this.ship.style.left = 0;
		this.ship.style.top = 0;
		this.ship.style.width = (WIDTH - 2) + "px";
		this.ship.style.height = (HEIGHT) + "px";
		this.ship.style.position = "absolute";
		this.ship.style.backgroundColor = "#CD0403";
		field.appendChild(this.ship);
		this.dir = 1;

		this.setHeartbeat();
	}

	this.shoot = function() {
		if (this.bomb != null) return;

		this.bomb = document.createElement("div");
		this.bomb.id = "bomb";
		this.bomb.style.left = (Math.round(parseInt(this.ship.style.left) / WIDTH) * WIDTH) + "px";
		this.bomb.style.top = this.ship.style.top;
		this.bomb.style.width = (WIDTH - 2) + "px";
		this.bomb.style.height = (HEIGHT) + "px";
		this.bomb.style.position = "absolute";
		this.bomb.style.backgroundColor = "black";
		this.field.appendChild(this.bomb);
	}

	this.action = function() {
		var left = parseInt(this.ship.style.left) + 2 * this.dir;
		if (left == 0) {
			this.dir = 1;
			this.ship.style.top = (parseInt(this.ship.style.top) + HEIGHT) + "px";
		}
		else if (left + WIDTH >= this.field_width) {
			this.dir = -1;
		}
		this.ship.style.left = left + "px";

		var box = document.getElementById("b" + Math.floor(left / WIDTH));
		if (parseInt(this.ship.style.top) + HEIGHT < parseInt(box.style.top)) {
			this.setHeartbeat();
		}
		else {
			this.heartbeat = null;
		}

		if (this.bonus != null) {
			this.bonus_count -= 1;
			if (this.bomb == null && this.bonus_count < 1) {
				this.bonus.style.backgroundColor = "white";
				this.bonus = null;
			}
		}
		else if (Math.random() < BONUS_PCT) {
			var j = Math.floor(this.field_width / WIDTH);
			do {
				this.bonus = document.getElementById("b" + Math.floor(Math.random() * j));
			}
			while (this.bonus.style.display == "none")
			this.bonus.style.backgroundColor = "darkgray";
			this.bonus_count = j * WIDTH / 2;
		}

		if (this.bomb != null) { 
			var top = parseInt(this.bomb.style.top) + 2;
			var block = document.getElementById("b" + Math.floor(parseInt(this.bomb.style.left) / WIDTH));
			if (top > parseInt(block.style.top)) {
				block.style.top = top + "px";
				block.style.height = (this.field_height - top - 2) + "px";
			}

			if (top + HEIGHT < this.field_height) {
				this.bomb.style.top = top + "px";
			}
			else {
				this.bomb.parentNode.removeChild(this.bomb);
				this.bomb = null;

				if (block.style.display != "none") {		
					block.style.display = "none";

					this.score += 1;
					if (this.bonus != null && block.id == this.bonus.id) {
						this.score += this.count;
					}

					this.count -= 1;
					if (this.count == 0) {
						this.next();
					}
				}
				else {
					this.score -= Math.floor(this.score / 3);
				}

				this.text_score.innerHTML = this.score;
				if (this.score > this.hi) {
					this.text_hi.innerHTML = this.hi = this.score;
				}
			}
		}
	}

    	this.heartbeat =
    	this.ship =
   	this.bomb =
   	this.bonus = null;

	this.dir = 
	this.score =
	this.hi =
	this.count =
	this.bonus_count = 0;

	this.field = document.getElementById(id_field);
    	this.text_score = document.getElementById(id_score);
	this.text_hi = document.getElementById(id_hi);

	this.setShoot();	
}
