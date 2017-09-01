// Homing enemy, try to ram the player

function Enemy8 (battle, layer) {
	this.m_size = 40;
	this.m_moveSpeed = 500;
	this.m_rotateSpeed = 50;
	this.m_HP = 20;
	this.m_score = 2;
	this.m_color = GetRandomEnemyColor();
	
	this.m_ramDamageMultiplier = 3;
	this.m_explosionNumber = 1;
	this.m_explosionLatency = 0.07;
	
	this.m_active = false;
	this.m_x = 0;
	this.m_y = 0;
	this.m_angle = 0;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool("res/GSAction/Battle/Enemies.png", layer);
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_ENEMY);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE));
	this.m_sprite.setColor (this.m_color);
	this.m_sprite.setTextureRect (cc.rect(2 * 200, 1 * 200, 200, 200));
	
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
				var targetAngle = AngleBetweenTwoPoint(this.m_x, this.m_y, battle.m_player.m_x, battle.m_player.m_y);
				
				var rotateSpeedThisLoop = this.m_rotateSpeed * deltaTime;
				if (Math.abs(targetAngle - this.m_angle) <= 140) {
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
					//if (targetAngle > this.m_angle) this.m_angle -= rotateSpeedThisLoop;
					//else if (targetAngle < this.m_angle) this.m_angle += rotateSpeedThisLoop;
				}
				
				if (this.m_angle > 360) this.m_angle -= 360;
				if (this.m_angle < 0) this.m_angle += 360;
			
				
				var moveDistance = this.m_moveSpeed * deltaTime;
				this.m_x += moveDistance * Math.sin(this.m_angle * DEG_TO_RAD);
				this.m_y += moveDistance * Math.cos(this.m_angle * DEG_TO_RAD);
				
				if (this.m_x < -this.m_size * 2 || this.m_x > CANVAS_W + this.m_size * 2
				||  this.m_y < -this.m_size * 2 || this.m_y > CANVAS_H + this.m_size * 2) {
					this.Destroy();
					return;
				}
				
				var distance = DistanceBetweenTwoPoint(this.m_x, this.m_y, battle.m_player.m_x, battle.m_player.m_y);
				if (battle.m_player.m_active && distance < (battle.m_player.m_size + this.m_size) * 0.5) {
					battle.m_player.Hit (this.m_HP * this.m_ramDamageMultiplier);
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
	
	
	this.Destroy = function () {
		this.m_active = false;
		g_spritePool.PutSpriteIntoPool (this.m_sprite);
	}
}