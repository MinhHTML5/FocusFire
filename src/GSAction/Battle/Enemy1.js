var ENEMY_HIT_WHITE_DURATION = 0.08;

function Enemy1 (battle, layer) {
	this.m_size = 40;
	this.m_moveSpeed = 200;
	this.m_rotateSpeed = 100;
	this.m_HP = 10;
	this.m_score = 1;
	this.m_color = GetRandomEnemyColor();
	
	this.m_explosionNumber = 3;
	this.m_explosionLatency = 0.07;
	
	this.m_active = false;
	this.m_x = 0;
	this.m_y = 0;
	this.m_angle = 0;
	
	this.m_targetCount = 0;
	this.m_targetX = [];
	this.m_targetY = [];
	
	this.m_sprite = g_spritePool.GetSpriteFromPool(layer, "Enemy1.png", true);
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_ENEMY);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE));
	this.m_sprite.setColor (this.m_color);
	
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
				
				var moveDistance = this.m_moveSpeed * deltaTime;
				this.m_x += moveDistance * Math.sin(this.m_angle * DEG_TO_RAD);
				this.m_y += moveDistance * Math.cos(this.m_angle * DEG_TO_RAD);
				
				var distanceToTarget = DistanceBetweenTwoPoint(this.m_x, this.m_y, this.m_targetX[this.m_targetCount], this.m_targetY[this.m_targetCount]);
				if (distanceToTarget < this.m_size) {
					this.m_targetCount ++;
					if (this.m_targetCount == this.m_targetX.length) {
						this.Destroy();
						return;
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