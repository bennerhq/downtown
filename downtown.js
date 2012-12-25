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

function Downtown(id_field, id_score, id_hi) {
	var BOX_WIDTH = 16;
	var BOX_HEIGHT = 10;

	var ANIMATION_MAX = 20;
	var ANIMATION_MIN = 4;
	var ANIMATION_DELTA = 2;

	var PCT_MIN = 0.3;
	var PCT_MAX = 0.6;
	var PCT_BONUS = 0.07;

   	this.heartbeat =
    	this.ship =
   	this.bomb =
   	this.bonus = null;

        this.animation = 
	this.dir = 
	this.score =
	this.hi =
	this.count =
	this.bonus_count = 0;

	this.paused = false;

	this.field = document.getElementById(id_field);
    	this.text_score = document.getElementById(id_score);
	this.text_hi = document.getElementById(id_hi);

	var _this_shoot_= this;
	document.onkeypress = function() { _this_shoot_.shoot(); }
	document.ontouchstart = function() { _this_shoot_.shoot(); }

	this.start = function() {
		this.animation = ANIMATION_MAX + ANIMATION_DELTA;
		this.score = 0;
		this.next();
	}

	this.pauseToggle = function() {
		if (this.paused) {
			this.paused = false;
			this.setHeartbeat(true);
		}
		else if (this.heartbeat != null) {
			this.setHeartbeat(false);
			this.paused = true;
		}
	}

	this.setHeartbeat = function(run) {
		if (this.heartbeat != null) {
			clearInterval(this.heartbeat);
			this.heartbeat = null;
			this.paused = false;
		}

		if (run) {
			var _this_action_ = this;
			this.heartbeat = setInterval(function() { _this_action_.action(); }, this.animation);
		}
	}

	this.isRunning = function() {
		return this.heartbeat != null;
	}

	this.isPaused = function() {
		return this.paused;
	}

	this.isActive = function() {
		return isPaused() || isRunning();
	}

	this.next = function() {
		this.setHeartbeat(false);	
		this.field.innerHTML = '';	
		this.ship = this.bomb = this.bonus = null;
		this.bonus_count = 0;
		this.count = 0;
		this.paused = false;
		this.text_score.innerHTML = this.score;
		this.text_hi.innerHTML = this.hi;

		this.field_width = this.field.clientWidth;
		this.field_height = this.field.clientHeight;

		var space_min = Math.floor(this.field_height * PCT_MIN);
    		var space_max = Math.floor(this.field_height * PCT_MAX);

    		for (this.count=0;
		     this.count < Math.floor(this.field_width / BOX_WIDTH); 
		     this.count++) {
			var h = this.field_height - space_min - 
		       		Math.floor(Math.random() * space_max / BOX_HEIGHT) * BOX_HEIGHT;
		
			var div = document.createElement("div");
			div.id = "b" + this.count;
			div.style.left = (this.count * BOX_WIDTH) + "px";
			div.style.top = h + "px";
			div.style.width = (BOX_WIDTH - 4) + "px";
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
		this.ship.style.width = (BOX_WIDTH - 2) + "px";
		this.ship.style.height = (BOX_HEIGHT) + "px";
		this.ship.style.position = "absolute";
		this.ship.style.backgroundColor = "#CD0403";
		field.appendChild(this.ship);
		this.dir = 1;

		this.animaton -= ANIMATION_DELTA;
		if (this.animation < ANIMATION_MIN) {
			this.animation = ANIMATION_MAX;
		}
		this.setHeartbeat(true);
	}

	this.shoot = function() {
		if (this.bomb != null) return;

		if (this.paused) {
			this.pauseToggle();
		}
		else {	
			left = Math.round(parseInt(this.ship.style.left) / BOX_WIDTH) * BOX_WIDTH;

			this.bomb = document.createElement("div");
			this.bomb.id = "bomb";
			this.bomb.style.left = left + "px";
			this.bomb.style.top = this.ship.style.top;
			this.bomb.style.width = (BOX_WIDTH - 2) + "px";
			this.bomb.style.height = (BOX_HEIGHT) + "px";
			this.bomb.style.position = "absolute";
			this.bomb.style.backgroundColor = "black";
			this.field.appendChild(this.bomb);
		}
	}

	this.action = function() {
		var left = parseInt(this.ship.style.left) + 2 * this.dir;
		if (left == 0) {
			this.dir = 1;
			this.ship.style.top = (parseInt(this.ship.style.top) + BOX_HEIGHT) + "px";
		}
		else if (left + BOX_WIDTH >= this.field_width) {
			this.dir = -1;
		}
		this.ship.style.left = left + "px";

		var box = document.getElementById("b" + Math.floor(left / BOX_WIDTH));
		if (parseInt(this.ship.style.top) + BOX_HEIGHT >= parseInt(box.style.top)) {
			if (this.score > this.hi) {
				this.text_hi.innerHTML = this.hi = this.score;
			}
			this.setHeartbeat(false);
		}

		if (this.bonus != null) {
			this.bonus_count -= 1;
			if (this.bomb == null && this.bonus_count < 1) {
				this.bonus.style.backgroundColor = "white";
				this.bonus = null;
			}
		}
		else if (Math.random() < PCT_BONUS) {
			var w = Math.floor(this.field_width / BOX_WIDTH);
			do {
				var id = "b" + Math.floor(Math.random() * w); 
				this.bonus = document.getElementById(id);
			}
			while (this.bonus.style.display == "none")
			this.bonus.style.backgroundColor = "darkgray";
			this.bonus_count = w * BOX_WIDTH / 2;
		}

		if (this.bomb != null) { 
			var top = parseInt(this.bomb.style.top) + 2;
			var id = "b" + Math.floor(parseInt(this.bomb.style.left) / BOX_WIDTH);
			var block = document.getElementById(id);
			if (top > parseInt(block.style.top)) {
				block.style.top = top + "px";
				block.style.height = (this.field_height - top - 2) + "px";
			}

			if (top + BOX_HEIGHT < this.field_height) {
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
						this.score += 5 * Math.floor((this.field_height - top) / BOX_HEIGHT);
						this.next();
					}
				}
				else {
					this.score -= Math.floor(this.score / 3);
				}

				this.text_score.innerHTML = this.score;
			}
		}
	}
}
