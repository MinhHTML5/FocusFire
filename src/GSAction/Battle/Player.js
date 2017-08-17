var PLAYER_DISTANCE_FROM_CENTER = 330;
var PLAYER_ROTATE_SPEED = 360;

var PLAYER_GATLING_COOLDOWN = 0.05;
var PLAYER_GATLING_RECOIL = 5;
var PLAYER_GATLING_SPEED = 1500;
var PLAYER_GATLING_SIZE = 30;

function Player (battle, layer) {
	this.m_x = 0;
	this.m_y = 0;
	this.m_angle = 0;
	this.m_targetAngle = 0;
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
	
	
	this.Touch = function (touching, angle) {
		this.m_touching = touching;
		this.m_targetAngle = angle;
	}
	this.Update = function (deltaTime) {
		if (this.m_touching) {
			var rotateAmount = 0;
			rotateAmount = PLAYER_ROTATE_SPEED * deltaTime;
			
			if (Math.abs(this.m_targetAngle - this.m_angle) <= 180) {
				if (this.m_targetAngle > this.m_angle + rotateAmount) {
					this.m_angle += rotateAmount;
				}
				else if (this.m_targetAngle < this.m_angle - rotateAmount) {
					this.m_angle -= rotateAmount;
				}
				else {
					this.m_angle = this.m_targetAngle;
				}
			}
			else {
				if (this.m_targetAngle > this.m_angle) this.m_angle -= rotateAmount;
				else if (this.m_targetAngle < this.m_angle) this.m_angle += rotateAmount;
			}
			
			if (this.m_angle > 360) this.m_angle -= 360;
			if (this.m_angle < 0) this.m_angle += 360;
			
			if (gatlingCooldown == 0) {
				var gatling = new PlayerGatling(battle, layer);
				var angle = this.m_angle + (Math.random() - 0.5) * PLAYER_GATLING_RECOIL * 2;
				gatling.Start (angle, this.m_x, this.m_y);
				battle.m_projectiles.push (gatling);
				gatlingCooldown = PLAYER_GATLING_COOLDOWN;
			}
		}
		
		this.m_x = CANVAS_W * 0.5 - PLAYER_DISTANCE_FROM_CENTER * Math.sin(this.m_angle * DEG_TO_RAD);
		this.m_y = CANVAS_H * 0.5 - PLAYER_DISTANCE_FROM_CENTER * Math.cos(this.m_angle * DEG_TO_RAD);
		
		if (gatlingCooldown > 0) {
			gatlingCooldown -= deltaTime;
			if (gatlingCooldown < 0) {
				gatlingCooldown = 0;
			}
		}
	}
	this.UpdateVisual = function() {
		this.m_sprite.setRotation (this.m_angle);
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
		
		this.m_spriteGlow.setRotation (this.m_angle);
		this.m_spriteGlow.setPosition (cc.p(this.m_x, this.m_y));
		this.m_spriteGlow.setColor (g_colorTheme);
	}
}