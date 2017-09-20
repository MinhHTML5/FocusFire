var PLAYER_SIZE = 50;
var PLAYER_MAX_HP = 100;
var PLAYER_MAX_SPEED = 3500;
var PLAYER_MAX_EMP_SPEED = 1000;
var PLAYER_SPEED_MULTIPLIER = 9;
var PLAYER_ACCELERATION = 25000;
var PLAYER_SNAP_DISTANCE = 1;
var PLAYER_DISTANCE_FROM_FINGER = 100;

var PLAYER_ASSISTANT_ROTATE_SPEED = 90;

var PLAYER_SHIELD_TIME = 10;
var PLAYER_SHIELD_FADE_SPEED = 500;
var PLAYER_SHIELD_ROTATE_SPEED = 30;
var PLAYER_MAIN_GUN_COOLDOWN = [0.06, 0.04, 0.03, 0.024, 0.016, 0.013, 0.011, 0.009, 0.008, 0.007, 0.0064];
var PLAYER_MAIN_GUN_RECOIL = [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8];
var PLAYER_POWER_MAX = 10;

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
	this.m_power = 0;
	this.m_shieldTime = 0;
	
	this.m_explosionNumber = 12;
	this.m_explosionLatency = 0.15;
	this.m_lastEplosionNumber = 5;
	
	this.m_globalAssitantAngle = 0;
	this.m_assistants = [];
	
	this.m_sprite = g_spritePool.GetSpriteFromPool(layer, "Player.png", true);
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_PLAYER);
	this.m_sprite.setOpacity (170);
	
	this.m_spriteGlow = g_spritePool.GetSpriteFromPool(layer, "PlayerGlow.png", true);
	this.m_spriteGlow.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_spriteGlow.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE));
	this.m_spriteGlow.setLocalZOrder (LAYER_PLAYER);
	
	this.m_shieldSprite = g_spritePool.GetSpriteFromPool(layer, "Shield.png", true);
	this.m_shieldSprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_shieldSprite.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE));
	this.m_shieldSprite.setLocalZOrder (LAYER_PLAYER);
	this.m_shieldSprite.setOpacity (0);
	
	
	var showStage = 2;
	var engineParticleCount = 0;
	var mainGunCooldown = 0;
	var dyingSequenceCount = 0;
	var explosionCount = 0;
	var shieldAlpha = 0;
	var shieldRotation = 0;
	
	
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
					
					while (mainGunCooldown <= 0) {
						var mainGunPower = this.m_power;
						var recoil = Math.random() * PLAYER_MAIN_GUN_RECOIL[mainGunPower] * 2 - PLAYER_MAIN_GUN_RECOIL[mainGunPower];
						var gatling = new PlayerGatling(battle, layer);
						gatling.Start (this.m_angle + recoil, this.m_x, this.m_y);
						mainGunCooldown += PLAYER_MAIN_GUN_COOLDOWN[mainGunPower];
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
			
			if (mainGunCooldown > 0) {
				mainGunCooldown -= deltaTime;
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
		
		if (this.m_shieldTime > 0) {
			this.m_size = PLAYER_SIZE * 2;
			if (shieldAlpha < 255) {
				shieldAlpha += deltaTime * PLAYER_SHIELD_FADE_SPEED;
				if (shieldAlpha > 255) {
					shieldAlpha = 255;
				}
			}
			
			shieldRotation += deltaTime * PLAYER_SHIELD_ROTATE_SPEED;
			if (shieldRotation > 360) shieldRotation -= 360;
			
			this.m_shieldTime -= deltaTime;
		}
		else {
			this.m_size = PLAYER_SIZE;
			if (shieldAlpha > 0) {
				shieldAlpha -= deltaTime * PLAYER_SHIELD_FADE_SPEED;
				if (shieldAlpha < 0) {
					shieldAlpha = 0;
				}
			}
		}
		
		this.m_globalAssitantAngle += PLAYER_ASSISTANT_ROTATE_SPEED * deltaTime;
		if (this.m_globalAssitantAngle > 360) {
			this.m_globalAssitantAngle -= 360;
		}
		
		var offset = 360 / this.m_assistants.length;
		for (var i=this.m_assistants.length-1; i>=0; i--) {
			if (this.m_assistants[i].m_active) {
				this.m_assistants[i].m_targetAnglePos = this.m_globalAssitantAngle + offset * i;
				if (this.m_assistants[i].m_targetAnglePos > 360) {
					this.m_assistants[i].m_targetAnglePos -= 360;
				}
				this.m_assistants[i].Update (deltaTime);
			}
			else {
				this.m_assistants.splice (i, 1);
			}
		}
	}
	
	
	this.UpdateVisual = function() {
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
		this.m_spriteGlow.setPosition (cc.p(this.m_x, this.m_y));
		this.m_shieldSprite.setPosition (cc.p(this.m_x, this.m_y));
		//this.m_spriteGlow.setColor (g_colorTheme);
		
		this.m_shieldSprite.setOpacity(shieldAlpha);
		this.m_shieldSprite.setRotation(shieldRotation);
		
		for (var i=0; i<this.m_assistants.length; i++) {
			this.m_assistants[i].UpdateVisual ();
		}
	}
	
	this.Hit = function (damage) {
		if (this.m_shieldTime <= 0 || damage < 0) {
			this.m_HP -= damage;
			if (this.m_HP > PLAYER_MAX_HP) {
				this.m_HP = PLAYER_MAX_HP;
			}
			g_bottomBar.SetValue (this.m_HP / PLAYER_MAX_HP);
		}
	}
	
	this.AddAssistant = function(type) {
		if (this.m_assistants.length < 5) {
			this.m_assistants.push (new Assistant(battle, this, layer, 1));
		}
		else {
			
		}
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
		g_spritePool.PutSpriteIntoPool (this.m_shieldSprite);
		
		for (var i=0; i<this.m_assistants.length; i++) {
			this.m_assistants[i].Destroy ();
		}
		
		battle.m_gameEnded = true;
	}
}