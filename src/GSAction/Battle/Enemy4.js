// A bit big enemy, travel from left to right or vice versa, shoot at one direction

function Enemy4 (battle, layer) {
	this.m_size = 60;
	this.m_moveSpeed = 100;
	this.m_HP = 60;
	this.m_score = 3;
	this.m_color = GetRandomEnemyColor();
	
	this.m_explosionNumber = 5;
	this.m_explosionLatency = 0.09;
	
	this.m_coolDown = 1;
	
	this.m_active = false;
	this.m_x = 0;
	this.m_y = 0;
	this.m_angle = 0;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool("res/GSAction/Battle/Enemy4.png");
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_ENEMY);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	this.m_sprite.setColor (this.m_color);
	layer.addChild(this.m_sprite);
	
	var cooldownCount = 0;
	var dyingSequenceCount = 0;
	var explosionCount = 0;
	
	this.Start = function (angle, x, y) {
		this.m_active = true;
		this.m_angle = angle;
		this.m_x = x;
		this.m_y = y;
		
		dyingSequenceCount = 0;
		explosionCount = 0;
		
		battle.m_enemies.push (this);
	}
	
	
	this.Update = function (deltaTime) {
		if (this.m_active) {
			if (this.m_HP > 0) {
				this.m_x += this.m_moveSpeed * deltaTime * Math.sin(this.m_angle * DEG_TO_RAD);
				this.m_y += this.m_moveSpeed * deltaTime * Math.cos(this.m_angle * DEG_TO_RAD);
				
				if (cooldownCount > 0) {
					cooldownCount -= deltaTime;
				}
				else if (cooldownCount <= 0) {
					cooldownCount += this.m_coolDown;
					this.Shoot();
				}
				
				var distance = DistanceBetweenTwoPoint(this.m_x, this.m_y, battle.m_player.m_x, battle.m_player.m_y);
				if (battle.m_player.m_active && distance < (battle.m_player.m_size + this.m_size) * 0.5) {
					battle.m_player.Hit (this.m_HP);
					this.Hit(this.m_HP);
					return;
				}
				
				if (this.m_x < -this.m_size * 3) {
					this.Destroy();
				}
				else if (this.m_x > CANVAS_W + this.m_size * 3) {
					this.Destroy();
				}
			}
			else {
				dyingSequenceCount += deltaTime;
				if (dyingSequenceCount >= this.m_explosionLatency) {
					dyingSequenceCount -= this.m_explosionLatency;
					battle.SpawnExplosion(this.m_x, this.m_y, 0.9, 0.7, this.m_size, this.m_color);
					
					explosionCount ++;
					if (explosionCount >= this.m_explosionNumber) {
						this.Destroy();
					}
				}
			}
		}
	}
	
	
	this.UpdateVisual = function() {
		this.m_sprite.setRotation (this.m_angle);
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
	}
	
	
	this.Shoot = function () {
		var tempBullet;
		tempBullet = new EnemyBullet1 (battle, layer, this.m_color);
		tempBullet.Start (180, this.m_x, this.m_y);
	}
	
	
	this.Hit = function (damage) {
		this.m_HP -= damage;
		if (this.m_HP <= 0) {
			battle.SpawnExplosion(this.m_x, this.m_y, 0.9, 0.7, 0, this.m_color);
			this.m_sprite.setVisible(false);
			g_battle.AddScore(this.m_score);
		}
	}
	
	
	this.Destroy = function () {
		this.m_active = false;
		layer.removeChild (this.m_sprite);
		g_spritePool.PutSpriteIntoPool (this.m_sprite);
	}
}