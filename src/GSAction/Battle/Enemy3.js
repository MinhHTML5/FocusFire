// Basic turret, just shoot in one direction

function Enemy3 (battle, layer) {
	this.m_size = 50;
	this.m_moveSpeed = FORWARD_SPEED;
	this.m_HP = 15 * (1 + battle.m_score / 50);
	this.m_score = 2;
	this.m_color = GetRandomEnemyColor();
	
	this.m_explosionNumber = 3;
	this.m_explosionLatency = 0.07;
	
	this.m_coolDown = 2;
	
	this.m_active = false;
	this.m_x = 0;
	this.m_y = 0;
	this.m_angle = 0;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool(layer, "Enemy3.png", true);
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_ENEMY);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE));
	this.m_sprite.setColor (this.m_color);

	var cooldownCount = 0;
	var dyingSequenceCount = 0;
	var explosionCount = 0;
	var hitStatus = 0;
	
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
				this.m_y -= this.m_moveSpeed * deltaTime;
				
				if (cooldownCount > 0) {
					cooldownCount -= deltaTime;
				}
				else if (cooldownCount <= 0) {
					cooldownCount += this.m_coolDown;
					this.Shoot();
				}
				
				// Do not collide with turret
				/*
				var distance = DistanceBetweenTwoPoint(this.m_x, this.m_y, battle.m_player.m_x, battle.m_player.m_y);
				if (battle.m_player.m_active && distance < (battle.m_player.m_size + this.m_size) * 0.5) {
					battle.m_player.Hit (this.m_HP);
					this.Hit(this.m_HP);
					return;
				}
				*/
				
				if (this.m_y < -this.m_size * 2) {
					this.Destroy();
				}
				
				if (hitStatus > 0) {
					hitStatus -= deltaTime;
					if (hitStatus <= 0) {
						this.m_sprite.setColor (this.m_color);
					}
				}
			}
			else {
				dyingSequenceCount += deltaTime;
				if (dyingSequenceCount >= this.m_explosionLatency) {
					dyingSequenceCount -= this.m_explosionLatency;
					battle.SpawnExplosion(this.m_x, this.m_y, 0.7, 0.5, this.m_size, this.m_color);
					
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
		tempBullet.Start (this.m_angle, this.m_x, this.m_y);
		myAudio.PlaySound("res/Sound/Laser.mp3");
	}
	
	
	this.Hit = function (damage) {
		this.m_HP -= damage;
		if (this.m_HP <= 0) {
			battle.SpawnExplosion(this.m_x, this.m_y, 0.7, 0.5, 0, this.m_color);
			this.m_sprite.setVisible(false);
			g_battle.AddScore(this.m_score);
			
			var i = 1 + (Math.random() * 4) >> 0;
			myAudio.PlaySound("res/Sound/Explosion " + i + ".mp3");
		}
		else {
			if (hitStatus <= 0) {
				hitStatus = ENEMY_HIT_WHITE_DURATION;
				this.m_sprite.setColor (cc.color(255, 255, 255));
			}
		}
	}
	
	
	this.Destroy = function () {
		this.m_active = false;
		g_spritePool.PutSpriteIntoPool (this.m_sprite);
	}
}