// Homing enemy, try to ram the player

function Enemy9 (battle, layer) {
	this.m_size = 40;
	this.m_moveSpeed = FORWARD_SPEED;
	this.m_aimSpeed = 50;
	this.m_HP = 50 * (1 + battle.m_score / 50);
	this.m_score = 10;
	this.m_color = GetRandomEnemyColor();
	
	this.m_explosionNumber = 5;
	this.m_explosionLatency = 0.15;
	
	this.m_active = false;
	this.m_x = 0;
	this.m_y = 0;
	this.m_angle = 0;
	
	this.m_coolDown = 3;
	this.m_fireDelay = 0.2;
	this.m_numberOfShot = 4;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool(layer, "Enemy9.png", true);
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_ENEMY);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE));
	this.m_sprite.setColor (this.m_color);
	
	var firing = false;
	var cooldownCount = 1;
	var fireDelayCount = 0;
	var shotFiredNumber = 0;
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
				
				var aimAngle = AngleBetweenTwoPoint(this.m_x, this.m_y, battle.m_player.m_x, battle.m_player.m_y);
				var aimThisLoop = this.m_aimSpeed * deltaTime;
				if (Math.abs(aimAngle - this.m_angle) <= 180) {
					if (aimAngle > this.m_angle + aimThisLoop) {
						this.m_angle += aimThisLoop;
					}
					else if (aimAngle < this.m_angle - aimThisLoop) {
						this.m_angle -= aimThisLoop;
					}
					else {
						this.m_angle = aimAngle;
						
						if (cooldownCount <= 0) {
							cooldownCount += this.m_coolDown;
							this.m_firing = true;
							shotFiredNumber = 0;
							this.Shoot();
						}
					}
				}
				else {
					if (aimAngle > this.m_angle) this.m_angle -= aimThisLoop;
					else if (aimAngle < this.m_angle) this.m_angle += aimThisLoop;
				}
				
				if (this.m_angle > 360) this.m_angle -= 360;
				if (this.m_angle < 0) this.m_angle += 360;
				
				if (cooldownCount > 0) {
					cooldownCount -= deltaTime;
				}
				if (this.m_firing == true) {
					fireDelayCount += deltaTime;
					if (fireDelayCount >= this.m_fireDelay) {
						fireDelayCount -= this.m_fireDelay;
						shotFiredNumber ++;
						if (shotFiredNumber >= this.m_numberOfShot) {
							this.m_firing = false;
						}
						this.Shoot();
					}
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
					battle.SpawnExplosion(this.m_x, this.m_y, 1.3, 1, this.m_size, this.m_color);
					
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
	}
	
	
	this.Hit = function (damage) {
		this.m_HP -= damage;
		if (this.m_HP <= 0) {
			battle.SpawnExplosion(this.m_x, this.m_y, 1.3, 1, 0, this.m_color);
			this.m_sprite.setVisible(false);
			g_battle.AddScore(this.m_score);
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