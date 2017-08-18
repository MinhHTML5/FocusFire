var PLAYER_MAX_SPEED = 3000;
var PLAYER_MAX_EMP_SPEED = 1000;
var PLAYER_SPEED_MULTIPLIER = 7;
var PLAYER_ACCELERATION = 20000;
var PLAYER_SNAP_DISTANCE = 10;
var PLAYER_DISTANCE_FROM_FINGER = 100;

var PLAYER_GATLING_COOLDOWN = 0.05;
var PLAYER_GATLING_RECOIL = 5;
var PLAYER_GATLING_SPEED = 1500;
var PLAYER_GATLING_SIZE = 30;

function Player (battle, layer) {
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
			
			if (gatlingCooldown == 0) {
				var gatling = new PlayerGatling(battle, layer);
				var angle = this.m_angle + (Math.random() - 0.5) * PLAYER_GATLING_RECOIL * 2;
				gatling.Start (angle, this.m_x, this.m_y);
				battle.m_projectiles.push (gatling);
				gatlingCooldown = PLAYER_GATLING_COOLDOWN;
			}
		}
		else {
			this.m_speed -= PLAYER_ACCELERATION * deltaTime;
			if (this.m_speed < 0) {
				this.m_speed = 0;
			}
		}
		
		this.m_x += this.m_speed * deltaTime * Math.sin(this.m_direction * DEG_TO_RAD);
		this.m_y += this.m_speed * deltaTime * Math.cos(this.m_direction * DEG_TO_RAD);
		
		if (gatlingCooldown > 0) {
			gatlingCooldown -= deltaTime;
			if (gatlingCooldown < 0) {
				gatlingCooldown = 0;
			}
		}
	}
	this.UpdateVisual = function() {
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
		
		this.m_spriteGlow.setPosition (cc.p(this.m_x, this.m_y));
		this.m_spriteGlow.setColor (g_colorTheme);
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