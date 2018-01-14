var DIFFICULTY_NUMBER = 5;
var FORWARD_SPEED = 50;
var NEXT_GIFT_MIN = 10;
var NEXT_GIFT_MAX = 20;

function Battle(layer) {
	this.m_player = new Player(this, layer);

	this.m_particles = [];
	this.m_projectiles = [];
	this.m_enemies = [];

	this.m_score = 0;
	this.m_level = 0;
	
	this.m_gameEnded = false;
	
	
	var giftCounter = 0;
	var nextGift = Math.random() * (NEXT_GIFT_MAX - NEXT_GIFT_MIN) + NEXT_GIFT_MIN;
	
	var spawnCounter = new Array();
	for (var i=0; i<DIFFICULTY_NUMBER; i++) {
		spawnCounter[i] = 0;
	}
	
	this.AddScore = function (score) {
		this.m_score += score;
		g_topBar.SetScore(this.m_score);
		
		if (this.m_level < g_difficulty.length - 1 && this.m_score > g_difficulty[this.m_level+1].m_score) {
			this.m_level ++;
		}
	}
	
	this.Update = function(deltaTime) {
		if (deltaTime > 0.05) {
			deltaTime = 0.05; // anti spike
		}
		
		if (this.m_player.m_active) {
			this.m_player.Update (deltaTime);
		}
		
		for (var i=this.m_particles.length-1; i>=0; i--) {
			this.m_particles[i].Update(deltaTime);
			if (this.m_particles[i].m_active == false) {
				this.m_particles.splice(i, 1);
			}
		}
		
		for (var i=this.m_projectiles.length-1; i>=0; i--) {
			this.m_projectiles[i].Update(deltaTime);
			if (this.m_projectiles[i].m_active == false) {
				this.m_projectiles.splice(i, 1);
			}
		}
		
		for (var i=this.m_enemies.length-1; i>=0; i--) {
			this.m_enemies[i].Update(deltaTime);
			if (this.m_enemies[i].m_active == false) {
				this.m_enemies.splice(i, 1);
			}
		}
		
		if (!this.m_gameEnded) {
			for (var i=0; i<DIFFICULTY_NUMBER; i++) {
				if (g_difficulty[this.m_level].m_spawnLatency[i] > 0) {
					spawnCounter[i] += deltaTime;
					if (spawnCounter[i] >= g_difficulty[this.m_level].m_spawnLatency[i]) {
						spawnCounter[i] -= g_difficulty[this.m_level].m_spawnLatency[i];
						
						var choose = (Math.random() * g_spawnFunction[i].length) >> 0;
						g_spawnFunction[i][choose](this, layer);
					}
				}
			}
			
			/*
			giftCounter += deltaTime;
			if (giftCounter >= nextGift) {
				nextGift = Math.random() * (NEXT_GIFT_MAX - NEXT_GIFT_MIN) + NEXT_GIFT_MIN;
				this.SpawnGift();
				giftCounter = 0;
			}
			*/
		}
	}
	
	this.UpdateVisual = function() {
		if (this.m_player.m_active) {
			this.m_player.UpdateVisual ();
		}
	
		for (var i=this.m_particles.length-1; i>=0; i--) {
			this.m_particles[i].UpdateVisual();
		}
		
		for (var i=this.m_projectiles.length-1; i>=0; i--) {
			this.m_projectiles[i].UpdateVisual();
		}
		
		for (var i=this.m_enemies.length-1; i>=0; i--) {
			this.m_enemies[i].UpdateVisual();
		}
	}
	
	this.SpawnExplosion = function(x, y, scale, time, randomize, color) {
		if (color == null) {
			color = cc.color(255, 255, 255);
		}
		else {
			if (Math.random() < 0.5) {
				color = cc.color(255, 255, 255);
			}
		}
		x += Math.random() * 2 * randomize - randomize;
		y += Math.random() * 2 * randomize - randomize;
		var explosion = new Explosion(this, layer, color);
		explosion.Start(x, y, scale, time);
	}
	
	this.SpawnGift = function() {
		var x = Math.random() * (CANVAS_W - 100) + 50;
		var y = CANVAS_H + 100;
		var tempEnemy = new Enemy0(this, layer);
		tempEnemy.Start(0, x, y);
	}
	
	
	this.Destroy = function() {
		if (this.m_player.m_active) {
			this.m_player.Destroy();
		}
	
		for (var i=this.m_particles.length-1; i>=0; i--) {
			if (this.m_particles[i].m_active) {
				this.m_particles[i].Destroy();
			}
		}
		
		for (var i=this.m_projectiles.length-1; i>=0; i--) {
			if (this.m_projectiles[i].m_active) {
				this.m_projectiles[i].Destroy();
			}
		}
		
		for (var i=this.m_enemies.length-1; i>=0; i--) {
			if (this.m_enemies[i].m_active) {
				this.m_enemies[i].Destroy();
			}
		}
	}
	
	
	this.TouchDown = function (touches) {
		var x = touches[0].getLocation().x;
		var y = touches[0].getLocation().y;
		this.m_player.Touch (true, x, y);
	}
	this.TouchMove = function (touches) {
		var x = touches[0].getLocation().x;
		var y = touches[0].getLocation().y;
		this.m_player.Touch (true, x, y);
	}
	this.TouchUp = function (touches) {
		this.m_player.Touch (false, 0, 0);
	}
}




function GetRandomEnemyColor() {
	return GetRGBColorFromHSV (Math.random() * 360, 1, 1);
}
function GetRGBColorFromHSV(h, s, v) {
	var i;
	var f, p, q, t;
	var r, g, b;
	if (s == 0) {
		r = v;
		b = v;
		g = v;
	}
	else {
		h = h / 60;
		i = Math.floor(h);
		f = h - i;
		p = v * ( 1 - s );
		q = v * ( 1 - s * f );
		t = v * ( 1 - s * ( 1 - f ) );
		
		switch( i ) {
			case 0:
				r = v;
				g = t;
				b = p;
				break;
			case 1:
				r = q;
				g = v;
				b = p;
				break;
			case 2:
				r = p;
				g = v;
				b = t;
				break;
			case 3:
				r = p;
				g = q;
				b = v;
				break;
			case 4:
				r = t;
				g = p;
				b = v;
				break;
			default:
				r = v;
				g = p;
				b = q;
				break;
		}
	}
	return cc.color(r * 255, g * 255, b * 255);
}