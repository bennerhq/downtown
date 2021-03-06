/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <jens@bennerhq.com> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return. /benner
 * ----------------------------------------------------------------------------
 */

function Downtown(id_game, id_score, id_hi) {
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
	this.score =
	this.score_level =
	this.hi =
	this.hi_level =
	this.count = 0;

	this.first =
	this.paused = false;

	this.game = document.getElementById(id_game);
    	this.text_score = document.getElementById(id_score);
	this.text_hi = document.getElementById(id_hi);

	var _this_shoot_= this;
	document.onkeypress = function() { _this_shoot_.shoot(); }
	document.ontouchstart = function() { _this_shoot_.shoot(); }
	document.onmousedown = function() { _this_shoot_.shoot(); }

	this.getInt = function(str) {
		return parseInt(str.replace(/[A-Za-z$-]/g, ""));
	}

	this.start = function() {
		this.animation = ANIMATION_MAX + ANIMATION_DELTA;
		this.score = 0;
		this.score_level = 0;
		this.next();
	}

	this.pauseToggle = function() {
		if (this.paused) {
			this.paused = false;
			this.setHeartbeat(true);
		}
		else if (this.heartbeat != null) {
			this.paused = true;
			this.setHeartbeat(false);
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

	this.setHeartbeat = function(run) {
		if (this.heartbeat != null) {
			clearInterval(this.heartbeat);
			this.heartbeat = null;
		}

		if (run) {
			var _this_action_ = this;
			this.heartbeat = setInterval(function() { _this_action_.action(); }, this.animation);
		}
	}

	this.next = function() {
		this.setHeartbeat(false);

		this.score_level += 1;
		this.bonus = null;
		this.paused = false;
		this.game.innerHTML = '';
		this.text_score.innerHTML = this.score + " / " + this.score_level;
		this.text_hi.innerHTML = this.hi + " / " + this.hi_level;

		this.first = true;
		this.count = Math.floor(this.game.clientWidth / BOX_WIDTH);
    		for (var i=0; i < this.count; i++) {
			var block = document.createElement('div');
			block.id = 'b' + i;
			block.style.position = 'absolute';
			block.style.left = (i * BOX_WIDTH) + 'px';
			block.style.top = (this.game.clientHeight - 2) + 'px';
			block.style.width = (BOX_WIDTH - 4) + 'px';
			block.style.height = '0px';
			block.style.borderColor = 'darkgray';
			block.style.borderStyle = 'solid';
			block.style.borderWidth = '1px';
			block.style.transition =
			block.style.MozTransition =
			block.style.WebkitTransition =
			block.style.OTransition = 'top 1s, height 1s';
    		block.style.backgroundColor = 'white';
			this.game.appendChild(block);
		}

		this.ship_dir = 1;
		this.ship = document.createElement('div');
		this.ship.id = 'ship';
		this.ship.style.position = 'absolute';
		this.ship.style.left = '0px';
		this.ship.style.top = '0px';
		this.ship.style.width = (BOX_WIDTH - 2) + 'px';
		this.ship.style.height = (BOX_HEIGHT) + 'px';
		this.ship.style.backgroundColor = '#CD0403';
		this.ship.style.border ='white 1px solid'
		this.game.appendChild(this.ship);

		this.bomb = document.createElement('div');
		this.bomb.id = 'bomb';
		this.bomb.style.position = 'absolute';
		this.bomb.style.left = '0px';
		this.bomb.style.top = '0px';
		this.bomb.style.width = (BOX_WIDTH - 2) + 'px';
		this.bomb.style.height = BOX_HEIGHT + 'px';
		this.bomb.style.backgroundColor = 'black';
		this.bomb.style.display = 'none';
		this.game.appendChild(this.bomb);

		this.animaton -= ANIMATION_DELTA;
		if (this.animation < ANIMATION_MIN) {
			this.animation = ANIMATION_MAX;
		}
		this.setHeartbeat(true);
	}

	this.shoot = function() {
		if (this.bomb.style.display == 'block') return;

		if (this.paused) {
			this.pauseToggle();
		}
		else {
			this.bomb.style.display = 'block';
			this.bomb.style.left = Math.round(this.getInt(this.ship.style.left) / BOX_WIDTH) * BOX_WIDTH + 'px';
			this.bomb.style.top = this.ship.style.top;
		}
	}

	this.action = function() {
		if (this.first) {
			this.first = false;

			var space_min = Math.floor(this.game.clientHeight * PCT_MIN);
	    		var space_max = Math.floor(this.game.clientHeight * PCT_MAX);

			for (var i=0; i < Math.floor(this.game.clientWidth / BOX_WIDTH); i++) {
				var h = Math.floor(Math.random() * space_max / BOX_HEIGHT) * BOX_HEIGHT;
				h = this.game.clientHeight - space_min - h;

				var block = document.getElementById('b' + i);
				block.style.top = h + 'px';
				block.style.height = (this.game.clientHeight - h - 2) + 'px';
			}
		}

		var left = this.getInt(this.ship.style.left) + 2 * this.ship_dir;
		if (left == 0) {
			this.ship_dir = 1;
			this.ship.style.top = (this.getInt(this.ship.style.top) + BOX_HEIGHT) + 'px';
		}
		else if (left + BOX_WIDTH >= this.game.clientWidth) {
			this.ship_dir = -1;
		}
		this.ship.style.left = left + 'px';

		var box = document.getElementById('b' + Math.floor(left / BOX_WIDTH));
		if (this.getInt(this.ship.style.top) + BOX_HEIGHT >= this.getInt(box.style.top)) {
			if (this.score > this.hi) {
				this.hi = this.score;
				this.hi_level = this.score_level;
				this.text_hi.innerHTML = this.hi + " / " + this.hi_level;
			}
			this.setHeartbeat(false);
			return;
		}

		if (this.bonus != null) {
			this.bonus.expire -= 1;
			if (this.bomb.style.display != 'block' && this.bonus.expire < 1) {
				this.bonus.style.backgroundColor = 'white';
				this.bonus = null;
			}
		}
		else if (Math.random() < PCT_BONUS) {
			var w = Math.floor(this.game.clientWidth / BOX_WIDTH);
			do {
				this.bonus = document.getElementById('b' + Math.floor(Math.random() * w));
			}
			while (this.bonus.style.display == 'none')
			this.bonus.style.backgroundColor = 'darkgray';
			this.bonus.expire = w * BOX_WIDTH / 2;
		}

		if (this.bomb.style.display == 'block') {
			var top = this.getInt(this.bomb.style.top) + 2;

			var block = document.getElementById('b' + Math.floor(this.getInt(this.bomb.style.left) / BOX_WIDTH));
			if (top > this.getInt(block.style.top)) {
				block.style.transition =
				block.style.MozTransition =
				block.style.WebkitTransition =
				block.style.OTransition = '';

				block.style.top = top + 'px';
				block.style.height = (this.game.clientHeight - top - 2) + 'px';
			}

			if (top + BOX_HEIGHT < this.game.clientHeight) {
				this.bomb.style.top = top + 'px';
			}
			else {
				this.bomb.style.display = 'none';

				if (block.style.display != 'none') {
					block.style.display = 'none';

					this.score += 1;
					if (this.bonus != null && block.id == this.bonus.id) {
						this.score += this.count;
					}

					this.count -= 1;
					if (this.count == 0) {
						this.score += 5 * Math.floor((this.game.clientHeight - top) / BOX_HEIGHT);
						this.next();
					}
				}
				else {
					this.score -= Math.floor(this.score / 7);
				}

				this.text_score.innerHTML = this.score + " / " + this.score_level;
			}
		}
	}
}

