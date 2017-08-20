function Enemy1 (battle, layer) {
	this.m_size = 40;
	this.m_moveSpeed = 200;
	this.m_rotateSpeed = 100;
	this.m_HP = 10;
	
	this.m_explosionNumber = 3;
	this.m_explosionLatency = 0.07;
	
	this.m_active = false;
	this.m_x = 0;
	this.m_y = 0;
	this.m_angle = 0;
	
	
	
	this.m_targetCount = 0;
	this.m_targetX = [];
	this.m_targetY = [];
	
	this.m_sprite = g_spritePool.GetSpriteFromPool("res/GSAction/Battle/Enemy1.png");
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_BULLET);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	layer.addChild(this.m_sprite);
	
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
			}
			else {
				dyingSequenceCount += deltaTime;
				if (dyingSequenceCount >= this.m_explosionLatency) {
					dyingSequenceCount -= this.m_explosionLatency;
					battle.SpawnExplosion(this.m_x, this.m_y, 0.7, 0.3, this.m_size);
					
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
			battle.SpawnExplosion(this.m_x, this.m_y, 0.7, 0.3, 0);
			this.m_sprite.setVisible(false);
		}
	}
	
	
	this.Destroy = function () {
		this.m_active = false;
		layer.removeChild (this.m_sprite);
		g_spritePool.PutSpriteIntoPool (this.m_sprite);
	}
}