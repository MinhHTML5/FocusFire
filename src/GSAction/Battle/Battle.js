var DIFFICULTY_NUMBER = 5;


function Battle(layer) {
	this.m_player = new Player(this, layer);

	this.m_particles = [];
	this.m_projectiles = [];
	this.m_enemies = [];

	this.m_score = 0;
	this.m_level = 0;
	
	var spawnCounter = new Array();
	for (var i=0; i<DIFFICULTY_NUMBER; i++) {
		spawnCounter[i] = 0;
	}
	
	this.Update = function(deltaTime) {
		this.m_player.Update (deltaTime);
		
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
	}
	
	this.UpdateVisual = function() {
		this.m_player.UpdateVisual ();
	
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
	
	this.SpawnExplosion = function(x, y, scale, time, randomize) {
		x += Math.random() * 2 * randomize - randomize;
		y += Math.random() * 2 * randomize - randomize;
		var explosion = new Explosion(this, layer);
		explosion.Start(x, y, scale, time);
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