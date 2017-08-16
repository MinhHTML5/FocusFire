var PLAYER_DISTANCE_FROM_CENTER = 330;
var PLAYER_ROTATE_SPEED = 360;


function Player (layer) {
	this.m_x = 0;
	this.m_y = 0;
	this.m_angle = 0;
	this.m_targetAngle = 0;
	this.m_touching = false;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool("res/GSAction/Battle/Player.png");
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	this.m_sprite.setLocalZOrder (LAYER_PLAYER);
	layer.addChild(this.m_sprite);
	
	
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
		}
		
		this.m_x = CANVAS_W * 0.5 - PLAYER_DISTANCE_FROM_CENTER * Math.sin(this.m_angle * DEG_TO_RAD);
		this.m_y = CANVAS_H * 0.5 - PLAYER_DISTANCE_FROM_CENTER * Math.cos(this.m_angle * DEG_TO_RAD);
		this.m_sprite.setRotation (this.m_angle);
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
	}
}