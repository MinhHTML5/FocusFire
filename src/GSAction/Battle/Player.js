var PLAYER_SIZE = 50;
var PLAYER_MAX_HP = 100;
var PLAYER_MAX_SPEED = 3500;
var PLAYER_MAX_EMP_SPEED = 1000;
var PLAYER_SPEED_MULTIPLIER = 9;
var PLAYER_ACCELERATION = 25000;
var PLAYER_SNAP_DISTANCE = 1;
var PLAYER_DISTANCE_FROM_FINGER = 100;


var PLAYER_GATLING_COOLDOWN = [0.03, 0.02, 0.015, 0.012, 0.008];
var PLAYER_GATLING_RECOIL = [0, 1, 2, 3, 4];

var PLAYER_MOVEMENT_CHECK_TIMES = 10;
var PLAYER_ENGINE_PARTICLE_EMIT_LATENCY = 0.002;




function Player (battle, layer) {
	this.m_active = true;
	this.m_size = PLAYER_SIZE;
	this.m_x = CANVAS_W * 0.5;
	this.m_y = -PLAYER_SIZE * 5;
	this.m_targetX = CANVAS_W * 0.5;
	this.m_targetY = PLAYER_DISTANCE_FROM_FINGER;
	this.m_direction = 0;
	this.m_angle = 0;
	this.m_speed = 0;
	this.m_touching = false;
	this.m_HP = PLAYER_MAX_HP;
	this.m_power = 4;
	
	this.m_explosionNumber = 12;
	this.m_explosionLatency = 0.15;
	this.m_lastEplosionNumber = 5;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool(layer, "Player.png", true);
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_PLAYER);
	this.m_sprite.setOpacity (170);
	
	this.m_spriteGlow = g_spritePool.GetSpriteFromPool(layer, "PlayerGlow.png", true);
	this.m_spriteGlow.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_spriteGlow.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE));
	this.m_spriteGlow.setLocalZOrder (LAYER_PLAYER);
	
	
	var showStage = 2;
	var engineParticleCount = 0;
	var gatlingCooldown = 0;
	var dyingSequenceCount = 0;
	var explosionCount = 0;
	
	
	
	this.Touch = function (touching, x, y) {
		if (showStage == 0) {
			this.m_touching = touching;
			this.m_targetX = x;
			
			if (cc.sys.isNative) {
				this.m_targetY = y + PLAYER_DISTANCE_FROM_FINGER;
			}
			else {
				this.m_targetY = y;
			}
		}
	}
	
	this.Update = function (deltaTime) {
		if (this.m_HP > 0) {
			if (showStage == 2) {
				var distance = CANVAS_H * 0.5 - this.m_y;
				this.m_speed = distance * PLAYER_SPEED_MULTIPLIER;
				if (this.m_speed > PLAYER_MAX_SPEED * 0.5) {
					this.m_speed = PLAYER_MAX_SPEED * 0.5;
				}
				if (distance < PLAYER_SNAP_DISTANCE) {
					showStage = 1;
					this.m_direction = 180;
				}
			}
			else if (showStage == 1) {
				var distance = this.m_y - PLAYER_DISTANCE_FROM_FINGER * 2;
				this.m_speed = distance * PLAYER_SPEED_MULTIPLIER;
				if (this.m_speed > PLAYER_MAX_SPEED * 0.2) {
					this.m_speed = PLAYER_MAX_SPEED * 0.2;
				}
				if (distance <PLAYER_SNAP_DISTANCE) {
					showStage = 0;
					this.m_speed = 0;
				}
			}
			else {
				if (this.m_touching) {
					var distance = DistanceBetweenTwoPoint(this.m_x, this.m_y, this.m_targetX, this.m_targetY);
					this.m_direction = AngleBetweenTwoPoint(this.m_x, this.m_y, this.m_targetX, this.m_targetY);
					
					if (distance > PLAYER_SNAP_DISTANCE) {
						var targetSpeed = distance * PLAYER_SPEED_MULTIPLIER;
						var acceleration = PLAYER_ACCELERATION * deltaTime;
						if (this.m_speed < targetSpeed - acceleration) {
							this.m_speed += acceleration;
							if (this.m_speed > PLAYER_MAX_SPEED) {
								this.m_speed = PLAYER_MAX_SPEED;
							}
						}
						else if (this.m_speed > targetSpeed + acceleration) {
							this.m_speed -= acceleration;
							if (this.m_speed < 0) {
								this.m_speed = 0;
							}
						}
						else {
							this.m_speed = targetSpeed;
						}
					}
					else {
						this.m_x = this.m_targetX;
						this.m_y = this.m_targetY;
						this.m_speed = 0;
					}
					
					while (gatlingCooldown <= 0) {
						var recoil = Math.random() * PLAYER_GATLING_RECOIL[this.m_power] * 2 - PLAYER_GATLING_RECOIL[this.m_power];
						var gatling = new PlayerGatling(battle, layer);
						gatling.Start (this.m_angle + recoil, this.m_x, this.m_y);
						gatlingCooldown += PLAYER_GATLING_COOLDOWN[this.m_power];
					}
				}
				else {
					this.m_speed -= PLAYER_ACCELERATION * deltaTime;
					if (this.m_speed < 0) {
						this.m_speed = 0;
					}
				}
			}
			
			for (var i=0; i<PLAYER_MOVEMENT_CHECK_TIMES; i++) {
				var subDeltaTime = deltaTime / PLAYER_MOVEMENT_CHECK_TIMES;
				this.m_x += this.m_speed * subDeltaTime * Math.sin(this.m_direction * DEG_TO_RAD);
				this.m_y += this.m_speed * subDeltaTime * Math.cos(this.m_direction * DEG_TO_RAD);
				
				engineParticleCount += subDeltaTime;
				while (engineParticleCount > PLAYER_ENGINE_PARTICLE_EMIT_LATENCY) {
					engineParticleCount -= PLAYER_ENGINE_PARTICLE_EMIT_LATENCY;
					var engineParticle = new PlayerEngineParticle(battle, layer);
					engineParticle.Start (this.m_x, this.m_y);
				}
			}
			
			if (gatlingCooldown > 0) {
				gatlingCooldown -= deltaTime;
			}
		}
		else {
			dyingSequenceCount += deltaTime;
			if (dyingSequenceCount >= this.m_explosionLatency) {
				dyingSequenceCount -= this.m_explosionLatency;
				battle.SpawnExplosion(this.m_x, this.m_y, 1, 0.5, this.m_size);
				
				explosionCount ++;
				if (explosionCount >= this.m_explosionNumber) {
					for (var i=0; i<this.m_lastEplosionNumber; i++) {
						battle.SpawnExplosion(this.m_x, this.m_y, 1.5, 0.8, this.m_size * 2);
					}
					this.Destroy();
				}
			}
		}
	}
	
	
	this.UpdateVisual = function() {
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
		
		this.m_spriteGlow.setPosition (cc.p(this.m_x, this.m_y));
		//this.m_spriteGlow.setColor (g_colorTheme);
	}
	
	this.Hit = function (damage) {
		this.m_HP -= damage;
		g_bottomBar.SetValue (this.m_HP / PLAYER_MAX_HP);
	}
	
	
	this.GetMaxSpeed = function () {
		if (this.m_emp > 0) {
			return PLAYER_MAX_EMP_SPEED;
		}
		else {
			return PLAYER_MAX_SPEED;
		}
	}
	
	
	this.Destroy = function () {
		this.m_active = false;
		g_spritePool.PutSpriteIntoPool (this.m_sprite);
		g_spritePool.PutSpriteIntoPool (this.m_spriteGlow);
		
		battle.m_gameEnded = true;
	}
}