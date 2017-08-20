var PLAYER_SIZE = 50;
var PLAYER_MAX_HP = 100;
var PLAYER_MAX_SPEED = 3000;
var PLAYER_MAX_EMP_SPEED = 1000;
var PLAYER_SPEED_MULTIPLIER = 7;
var PLAYER_ACCELERATION = 20000;
var PLAYER_SNAP_DISTANCE = 10;
var PLAYER_DISTANCE_FROM_FINGER = 100;
var PLAYER_GATLING_COOLDOWN = 0.008;

var PLAYER_MOVEMENT_CHECK_TIMES = 10;
var PLAYER_ENGINE_PARTICLE_EMIT_LATENCY = 0.002;


function Player (battle, layer) {
	this.m_size = PLAYER_SIZE;
	this.m_x = 0;
	this.m_y = 0;
	this.m_targetX = 0;
	this.m_targetY = 0;
	this.m_direction = 0;
	this.m_angle = 0;
	this.m_speed = 0;
	this.m_touching = false;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool("res/GSAction/Battle/Player.png");
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_PLAYER);
	this.m_sprite.setOpacity (170);
	layer.addChild(this.m_sprite);
	
	this.m_spriteGlow = g_spritePool.GetSpriteFromPool("res/GSAction/Battle/PlayerGlow.png");
	this.m_spriteGlow.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_spriteGlow.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	this.m_spriteGlow.setLocalZOrder (LAYER_PLAYER);
	layer.addChild(this.m_spriteGlow);
	
	var engineParticleCount = 0;
	var gatlingCooldown = 0;
	
	
	
	this.Reset = function () {
		this.m_x = CANVAS_W * 0.5;
		this.m_y = PLAYER_DISTANCE_FROM_FINGER;
		this.m_targetX = 0;
		this.m_targetY = 0;
		this.m_direction = 0;
		this.m_angle = 0;
		this.m_speed = 0;
		this.m_touching = false;
		this.m_HP = PLAYER_MAX_HP;
	}
	
	
	this.Touch = function (touching, x, y) {
		this.m_touching = touching;
		this.m_targetX = x;
		this.m_targetY = y + PLAYER_DISTANCE_FROM_FINGER;
	}
	
	
	this.Update = function (deltaTime) {
		if (this.m_touching) {
			var distance = DistanceBetweenTwoPoint(this.m_x, this.m_y, this.m_targetX, this.m_targetY);
			this.m_direction = AngleBetweenTwoPoint(this.m_x, this.m_y, this.m_targetX, this.m_targetY);
			
			if (distance > PLAYER_SNAP_DISTANCE) {
				var targetSpeed = distance * PLAYER_SPEED_MULTIPLIER;
				var acceleration = PLAYER_ACCELERATION * deltaTime;
				if (this.m_speed < targetSpeed + acceleration) {
					this.m_speed += acceleration;
					if (this.m_speed > PLAYER_MAX_SPEED) {
						this.m_speed = PLAYER_MAX_SPEED;
					}
				}
				else if (this.m_speed > targetSpeed - acceleration) {
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
				var gatling = new PlayerGatling(battle, layer);
				gatling.Start (this.m_angle, this.m_x, this.m_y);
				gatlingCooldown += PLAYER_GATLING_COOLDOWN;
			}
		}
		else {
			this.m_speed -= PLAYER_ACCELERATION * deltaTime;
			if (this.m_speed < 0) {
				this.m_speed = 0;
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
	
	
	this.UpdateVisual = function() {
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
		
		this.m_spriteGlow.setPosition (cc.p(this.m_x, this.m_y));
		//this.m_spriteGlow.setColor (g_colorTheme);
	}
	
	this.Hit = function (damage) {
		this.mHP -= damage;
	}
	
	
	this.GetMaxSpeed = function () {
		if (this.m_emp > 0) {
			return PLAYER_MAX_EMP_SPEED;
		}
		else {
			return PLAYER_MAX_SPEED;
		}
	}
	
	this.Reset();
}