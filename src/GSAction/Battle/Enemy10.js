function Enemy10 (battle, layer) {
	var MAX_SPEED = 250;
	var ACCELERATION = 300;
	
	this.m_size = 85;
	this.m_moveSpeed = MAX_SPEED;
	this.m_HP = 80;
	this.m_score = 10;
	this.m_color = GetRandomEnemyColor();
	
	this.m_coolDown = 3;
	this.m_fireDelay = 0.3;
	this.m_numberOfShot = 3;
	
	this.m_explosionNumber = 5;
	this.m_explosionLatency = 0.15;
	
	this.m_active = false;
	this.m_x = 0;
	this.m_y = 0;
	this.m_angle = 180;
	
	this.m_targetCount = 0;
	this.m_targetX = [];
	this.m_targetY = [];
	
	this.m_sprite = g_spritePool.GetSpriteFromPool("res/GSAction/Battle/Enemies.png", layer);
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_ENEMY);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE));
	this.m_sprite.setColor (this.m_color);
	this.m_sprite.setRotation (this.m_angle);
	this.m_sprite.setTextureRect (cc.rect(4 * 200, 1 * 200, 200, 200));
	
	var firing = false;
	var cooldownCount = 1;
	var fireDelayCount = 0;
	var shotFiredNumber = 0;
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
				var distanceToTarget = this.m_x - this.m_targetX[this.m_targetCount];
				
				var targetSpeed = -distanceToTarget * 3;
				if (targetSpeed > MAX_SPEED) {
					targetSpeed = MAX_SPEED;
				}
				else if (targetSpeed < -MAX_SPEED) {
					targetSpeed = -MAX_SPEED;
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
				
				this.m_x += this.m_moveSpeed * deltaTime;
				
				distanceToTarget = DistanceBetweenTwoPoint(this.m_x, this.m_y, this.m_targetX[this.m_targetCount], this.m_targetY[this.m_targetCount]);
				if (distanceToTarget < this.m_size * 0.5) {
					this.m_targetCount ++;
					if (this.m_targetCount == this.m_targetX.length) {
						this.Destroy();
						return;
					}
				}
				
				
				if (cooldownCount > 0) {
					cooldownCount -= deltaTime;
				}
				else {
					cooldownCount += this.m_coolDown;
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
	
	
	this.Hit = function (damage) {
		this.m_HP -= damage;
		if (this.m_HP <= 0) {
			battle.SpawnExplosion(this.m_x, this.m_y, 0.7, 0.5, 0, this.m_color);
			this.m_sprite.setVisible(false);
			g_battle.AddScore(this.m_score);
		}
	}
	
	this.Shoot = function () {
		var tempBullet;
		tempBullet = new EnemyBullet3 (battle, layer, this.m_color);
		tempBullet.Start (this.m_angle, this.m_x, this.m_y);
		tempBullet = new EnemyBullet3 (battle, layer, this.m_color);
		tempBullet.Start (this.m_angle - 10, this.m_x, this.m_y);
		tempBullet = new EnemyBullet3 (battle, layer, this.m_color);
		tempBullet.Start (this.m_angle + 10, this.m_x, this.m_y);
	}
	
	this.Destroy = function () {
		this.m_active = false;
		g_spritePool.PutSpriteIntoPool (this.m_sprite);
	}
}