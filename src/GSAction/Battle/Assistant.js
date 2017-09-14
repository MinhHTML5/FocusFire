var ASSISTANT_SIZE = 20;
var ASSISTANT_DISTANCE = 80;
var ASSISTANT_CIRCLE_MOVE_SPEED = 180;


var ASSISTANT_COOLDOWN = [0.1];
var ASSISTANT_RECOIL = [1];
var ASSISTANT_SPEED = [2000]; // Bullet speed
var ASSISTANT_DAMAGE = [1];

function Assistant (battle, player, layer, type) {
	this.m_active = true;
	this.m_x = 0;
	this.m_y = 0;
	this.m_HP = 10;
	this.m_speed = 0;
	this.m_angle = 0;
	this.m_anglePos = 0;
	this.m_targetAnglePos = 0;
	this.m_size = ASSISTANT_SIZE;
	
	
	this.m_color = GetRGBColorFromHSV(140, 1, 1);
		
	this.m_explosionNumber = 3;
	this.m_explosionLatency = 0.07;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool(layer, "Assistant" + type + ".png", true);
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_PLAYER);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE));
	this.m_sprite.setColor (this.m_color);
	
	var cooldownCount = 1;
	var dyingSequenceCount = 0;
	var explosionCount = 0;
	var hitStatus = 0;
	
	this.Update = function (deltaTime) {
		if (this.m_active) {
			if (this.m_HP > 0) {
				var rotateSpeedThisLoop = ASSISTANT_CIRCLE_MOVE_SPEED * deltaTime;
				if (Math.abs(this.m_targetAnglePos - this.m_anglePos) <= 180) {
					if (this.m_targetAnglePos > this.m_anglePos + rotateSpeedThisLoop) {
						this.m_anglePos += rotateSpeedThisLoop;
					}
					else if (this.m_targetAnglePos < this.m_anglePos - rotateSpeedThisLoop) {
						this.m_anglePos -= rotateSpeedThisLoop;
					}
					else {
						this.m_anglePos = this.m_targetAnglePos;
					}
				}
				else {
					if (this.m_targetAnglePos > this.m_anglePos) this.m_anglePos -= rotateSpeedThisLoop;
					else if (this.m_targetAnglePos < this.m_anglePos) this.m_anglePos += rotateSpeedThisLoop;
				}
				
				if (this.m_anglePos > 360) this.m_anglePos -= 360;
				if (this.m_anglePos < 0) this.m_anglePos += 360;
				
				this.m_x = player.m_x + ASSISTANT_DISTANCE *  Math.sin(this.m_anglePos * DEG_TO_RAD);
				this.m_y = player.m_y + ASSISTANT_DISTANCE *  Math.cos(this.m_anglePos * DEG_TO_RAD);
				
				
				var target = null;
				var minRange = 999999;
				for (var i=0; i<battle.m_enemies.length; i++) {
					if (battle.m_enemies[i].m_active && battle.m_enemies[i].m_HP > 0) {
						var distance = DistanceBetweenTwoPoint(this.m_x, this.m_y, battle.m_enemies[i].m_x, battle.m_enemies[i].m_y);
						if (distance < minRange) {
							minRange = distance;
							target = battle.m_enemies[i];
						}
					}
				}
				
				
				if (cooldownCount > 0) {
					cooldownCount -= deltaTime;
				}
				else if (target != null) {
					this.m_angle = AngleBetweenTwoPoint(this.m_x, this.m_y, target.m_x, target.m_y);
					cooldownCount += ASSISTANT_COOLDOWN[type-1];
					this.Shoot();
				}
				
				if (target == null) {
					this.m_angle = 0;
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
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
		this.m_sprite.setRotation (this.m_angle);
	}
	
	this.Shoot = function () {
		var recoil = Math.random() * ASSISTANT_RECOIL[type-1] * 2 - ASSISTANT_RECOIL[type-1];
		if (type == 1) {
			var tempBullet = new AssistantBullet1 (battle, layer, this.m_color);
			tempBullet.Start (this.m_angle + recoil, this.m_x, this.m_y);
		}
	}
	
	this.Hit = function (damage) {
		this.m_HP -= damage;
		
		if (this.m_HP <= 0) {
			battle.SpawnExplosion(this.m_x, this.m_y, 0.7, 0.5, 0, this.m_color);
		}
		else {
			if (hitStatus <= 0) {
				hitStatus = ENEMY_HIT_WHITE_DURATION;
				this.m_sprite.setColor (cc.color(255, 255, 255));
			}
			this.m_color = GetRGBColorFromHSV(this.m_HP * 14, 1, 1);
		}
	}
	
	this.Destroy = function () {
		this.m_active = false;
		g_spritePool.PutSpriteIntoPool (this.m_sprite);
	}
}