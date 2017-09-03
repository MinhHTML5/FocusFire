// Light enemy, joking around, shoot 3 bullets at the player

function Enemy6 (battle, layer) {
	var MAX_SPEED = 400;
	var ACCELERATION = 100;
	
	this.m_size = 50;
	this.m_moveSpeed = MAX_SPEED;
	this.m_rotateSpeed = 200;
	this.m_aimSpeed = 50;
	this.m_HP = 40;
	this.m_score = 6;
	this.m_color = GetRandomEnemyColor();
	
	this.m_explosionNumber = 5;
	this.m_explosionLatency = 0.08;
	
	this.m_coolDown = 2;
	this.m_fireDelay = 0.2;
	this.m_numberOfShot = 3;
	
	this.m_active = false;
	this.m_x = 0;
	this.m_y = 0;
	this.m_angle = 0;
	this.m_aimAngle = 0;
	
	this.m_targetCount = 0;
	this.m_targetX = [];
	this.m_targetY = [];
	
	this.m_sprite = g_spritePool.GetSpriteFromPool(layer, "Enemy6.png", true);
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_ENEMY);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE));
	this.m_sprite.setColor (this.m_color);

	var firing = false;
	var cooldownCount = this.m_coolDown;
	var fireDelayCount = 0;
	var shotFiredNumber = 0;
	var dyingSequenceCount = 0;
	var explosionCount = 0;
	var hitStatus = 0;
	
	this.Start = function (angle, x, y, targetX, targetY) {
		this.m_active = true;
		this.m_angle = angle;
		this.m_x = x;
		this.m_y = y;
		this.m_targetX = targetX;
		this.m_targetY = targetY;
		
		dyingSequenceCount = 0;
		explosionCount = 0;
		
		this.m_aimAngle = AngleBetweenTwoPoint(this.m_x, this.m_y, battle.m_player.m_x, battle.m_player.m_y);
		
		battle.m_enemies.push (this);
	}
	
	
	this.Update = function (deltaTime) {
		if (this.m_active) {
			if (this.m_HP > 0) {
				var targetAngle = AngleBetweenTwoPoint(this.m_x, this.m_y, this.m_targetX[this.m_targetCount], this.m_targetY[this.m_targetCount]);
				var rotateSpeedThisLoop = this.m_rotateSpeed * deltaTime;
				if (Math.abs(targetAngle - this.m_angle) <= 180) {
					if (targetAngle > this.m_angle + rotateSpeedThisLoop) {
						this.m_angle += rotateSpeedThisLoop;
					}
					else if (targetAngle < this.m_angle - rotateSpeedThisLoop) {
						this.m_angle -= rotateSpeedThisLoop;
					}
					else {
						this.m_angle = targetAngle;
					}
				}
				else {
					if (targetAngle > this.m_angle) this.m_angle -= rotateSpeedThisLoop;
					else if (targetAngle < this.m_angle) this.m_angle += rotateSpeedThisLoop;
				}
				
				if (this.m_angle > 360) this.m_angle -= 360;
				if (this.m_angle < 0) this.m_angle += 360;
				
				
				var distanceToTarget = DistanceBetweenTwoPoint(this.m_x, this.m_y, this.m_targetX[this.m_targetCount], this.m_targetY[this.m_targetCount]);
				var targetSpeed = distanceToTarget;
				if (targetSpeed > MAX_SPEED) {
					targetSpeed = MAX_SPEED;
				}
				
				var accelerate = ACCELERATION * deltaTime;
				if (this.m_moveSpeed < targetSpeed - accelerate) {
					this.m_moveSpeed += accelerate;
				}
				else if (this.m_moveSpeed > targetSpeed + accelerate) {
					this.m_moveSpeed -= accelerate;
				}
				else {
					this.m_moveSpeed = targetSpeed;
				}
				
				this.m_x += this.m_moveSpeed * deltaTime * Math.sin(this.m_angle * DEG_TO_RAD);
				this.m_y += this.m_moveSpeed * deltaTime * Math.cos(this.m_angle * DEG_TO_RAD);
				
				
				var distanceToTarget = DistanceBetweenTwoPoint(this.m_x, this.m_y, this.m_targetX[this.m_targetCount], this.m_targetY[this.m_targetCount]);
				if (distanceToTarget < this.m_size) {
					this.m_targetCount ++;
					if (this.m_targetCount == this.m_targetX.length) {
						this.Destroy();
						return;
					}
				}
				
				var aimAngle = AngleBetweenTwoPoint(this.m_x, this.m_y, battle.m_player.m_x, battle.m_player.m_y);
				var aimThisLoop = this.m_aimSpeed * deltaTime;
				if (Math.abs(aimAngle - this.m_aimAngle) <= 180) {
					if (aimAngle > this.m_aimAngle + aimThisLoop) {
						this.m_aimAngle += aimThisLoop;
					}
					else if (aimAngle < this.m_aimAngle - aimThisLoop) {
						this.m_aimAngle -= aimThisLoop;
					}
					else {
						this.m_aimAngle = aimAngle;
					}
				}
				else {
					if (aimAngle > this.m_aimAngle) this.m_aimAngle -= aimThisLoop;
					else if (aimAngle < this.m_aimAngle) this.m_aimAngle += aimThisLoop;
				}
				
				if (this.m_aimAngle > 360) this.m_aimAngle -= 360;
				if (this.m_aimAngle < 0) this.m_aimAngle += 360;
				
				
				if (cooldownCount > 0) {
					cooldownCount -= deltaTime;
				}
				else {
					cooldownCount = this.m_coolDown;
					this.m_firing = true;
					shotFiredNumber = 0;
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
				
				var distance = DistanceBetweenTwoPoint(this.m_x, this.m_y, battle.m_player.m_x, battle.m_player.m_y);
				if (battle.m_player.m_active && distance < (battle.m_player.m_size + this.m_size) * 0.5) {
					battle.m_player.Hit (this.m_HP);
					this.Hit(this.m_HP);
					return;
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
					battle.SpawnExplosion(this.m_x, this.m_y, 0.8, 0.6, this.m_size, this.m_color);
					
					explosionCount ++;
					if (explosionCount >= this.m_explosionNumber) {
						this.Destroy();
					}
				}
			}
		}
	}
	
	
	this.UpdateVisual = function() {
		this.m_sprite.setRotation (this.m_aimAngle);
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
	}
	
	
	this.Shoot = function () {
		var tempBullet;
		tempBullet = new EnemyBullet2 (battle, layer, this.m_color);
		tempBullet.Start (this.m_aimAngle, this.m_x, this.m_y);
	}
	
	
	this.Hit = function (damage) {
		this.m_HP -= damage;
		if (this.m_HP <= 0) {
			battle.SpawnExplosion(this.m_x, this.m_y, 0.8, 0.6, 0, this.m_color);
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