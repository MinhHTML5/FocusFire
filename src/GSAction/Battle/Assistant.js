var ASSISTANT_SIZE = 20;
var ASSISTANT_DISTANCE = 80;
var ASSISTANT_MAX_SPEED = 3500;
var ASSISTANT_SPEED_MULTIPLIER = 9;
var ASSISTANT_ACCELERATION = 25000;
var ASSISTANT_SNAP_DISTANCE = 1;

function Assistant (player, layer) {
	this.m_active = true;
	this.m_x = 0;
	this.m_y = 0;
	this.m_speed = 0;
	this.m_angle = 0;
	this.m_anglePos = 0;
	this.m_size = ASSISTANT_SIZE;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool(layer, "Assistant 1.png", true);
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_PLAYER);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE));
	
	
	this.Update = function (deltaTime) {
		if (this.m_active) {
			var targetX = player.m_x + ASSISTANT_DISTANCE *  Math.sin(this.m_anglePos * DEG_TO_RAD);
			var targetY = player.m_y + ASSISTANT_DISTANCE *  Math.cos(this.m_anglePos * DEG_TO_RAD);
			
			this.m_x = targetX;
			this.m_y = targetY;
				
			var direction = AngleBetweenTwoPoint(this.m_x, this.m_y, this.m_targetX, this.m_targetY);
			var distance = DistanceBetweenTwoPoint(this.m_x, this.m_y, targetX, targetY);
			
			if (distance > ASSISTANT_SNAP_DISTANCE) {
				var targetSpeed = distance * ASSISTANT_SPEED_MULTIPLIER;
				var acceleration = ASSISTANT_ACCELERATION * deltaTime;
				if (this.m_speed < targetSpeed - acceleration) {
					this.m_speed += acceleration;
					if (this.m_speed > ASSISTANT_MAX_SPEED) {
						this.m_speed = ASSISTANT_MAX_SPEED;
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
				
				this.m_x += this.m_speed * deltaTime * Math.sin(direction * DEG_TO_RAD);
				this.m_y += this.m_speed * deltaTime * Math.cos(direction * DEG_TO_RAD);
			}
			else {
				//this.m_x = targetX;
				//this.m_y = targetY;
				//this.m_speed = 0;
			}
		}
	}
	
	this.UpdateVisual = function() {
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
	}
}