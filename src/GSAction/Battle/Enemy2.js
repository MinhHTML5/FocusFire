// Basic enemy, move to middle, shoot 3x3 shot, then fly away to bottom

function Enemy2 (battle, layer) {
	var MAX_SPEED = 200;
	var ACCELERATION = 100;
	
	this.m_size = 50;
	this.m_moveSpeed = MAX_SPEED;
	this.m_rotateSpeed = 50;
	this.m_HP = 30;
	this.m_score = 2;
	this.m_color = GetRandomEnemyColor();
	
	this.m_explosionNumber = 3;
	this.m_explosionLatency = 0.07;
	
	this.m_coolDown = 2;
	
	this.m_active = false;
	this.m_x = 0;
	this.m_y = 0;
	this.m_angle = 0;
	
	this.m_targetX = 0;
	this.m_targetY = 0;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool("res/GSAction/Battle/Enemies.png", layer);
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_ENEMY);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE));
	this.m_sprite.setColor (this.m_color);
	this.m_sprite.setTextureRect (cc.rect(1 * 200, 0 * 200, 200, 200));
	
	var stage = 0;
	var cooldownCount = 0;
	var shotCount = 0;
	var dyingSequenceCount = 0;
	var explosionCount = 0;
	
	this.Start = function (angle, x, y, targetX, targetY) {
		this.m_active = true;
		this.m_angle = angle;
		this.m_x = x;
		this.m_y = y;
		this.m_targetX = targetX;
		this.m_targetY = targetY;
		
		dyingSequenceCount = 0;
		explosionCount = 0;
		
		battle.m_enemies.push (this);
	}
	
	
	this.Update = function (deltaTime) {
		if (this.m_active) {
			if (this.m_HP > 0) {
				if (stage == 0 || stage == 2) {
					var targetAngle = AngleBetweenTwoPoint(this.m_x, this.m_y, this.m_targetX, this.m_targetY);
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
					
					var distanceToTarget = DistanceBetweenTwoPoint(this.m_x, this.m_y, this.m_targetX, this.m_targetY);
					var targetSpeed = distanceToTarget * 3;
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
					
					if (distanceToTarget < this.m_size) {
						if (stage == 0) {
							stage = 1;
						}
						else {
							this.Destroy();
						}
					}
				}
				else if (stage == 1) {
					var targetAngle = 180;
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
					
					var accelerate = ACCELERATION * deltaTime;
					this.m_moveSpeed -= accelerate;
					if (this.m_moveSpeed < 0) {
						this.m_moveSpeed = 0;
					}
					this.m_x += this.m_moveSpeed * deltaTime * Math.sin(this.m_angle * DEG_TO_RAD);
					this.m_y += this.m_moveSpeed * deltaTime * Math.cos(this.m_angle * DEG_TO_RAD);
					
					if (this.m_angle == 180) {
						if (cooldownCount <= 0) {
							cooldownCount += this.m_coolDown;
							this.Shoot();
							
							shotCount ++;
							if (shotCount == 3) {
								stage = 2;
								
								if (this.m_x < CANVAS_W * 0.5) {
									this.m_targetX = -this.m_size * 2;
								}
								else {
									this.m_targetX = CANVAS_W + this.m_size * 2;
								}
								
								this.m_targetY = Math.random() * CANVAS_H * 0.5;
							}
						}
					}
				}
				
				if (cooldownCount > 0) {
					cooldownCount -= deltaTime;
				}
				
				var distance = DistanceBetweenTwoPoint(this.m_x, this.m_y, battle.m_player.m_x, battle.m_player.m_y);
				if (battle.m_player.m_active && distance < (battle.m_player.m_size + this.m_size) * 0.5) {
					battle.m_player.Hit (this.m_HP);
					this.Hit(this.m_HP);
					return;
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
		tempBullet.Start (this.m_angle - 30, this.m_x, this.m_y);
		tempBullet = new EnemyBullet1 (battle, layer, this.m_color);
		tempBullet.Start (this.m_angle, this.m_x, this.m_y);
		tempBullet = new EnemyBullet1 (battle, layer, this.m_color);
		tempBullet.Start (this.m_angle + 30, this.m_x, this.m_y);
	}
	
	
	this.Hit = function (damage) {
		this.m_HP -= damage;
		if (this.m_HP <= 0) {
			battle.SpawnExplosion(this.m_x, this.m_y, 0.7, 0.5, 0, this.m_color);
			this.m_sprite.setVisible(false);
			g_battle.AddScore(this.m_score);
		}
	}
	
	
	this.Destroy = function () {
		this.m_active = false;
		g_spritePool.PutSpriteIntoPool (this.m_sprite);
	}
}