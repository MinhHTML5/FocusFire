function PlayerGatling (battle, layer) {
	this.m_active = false;
	this.m_x = 0;
	this.m_y = 0;
	this.m_angle = 0;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool("res/GSAction/Battle/PlayerGatling.png");
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_BULLET);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	layer.addChild(this.m_sprite);
	
	
	this.Start = function (angle, x, y) {
		this.m_active = true;
		this.m_angle = angle;
		this.m_x = x;
		this.m_y = y;
	}
	this.Update = function (deltaTime) {
		this.m_x += PLAYER_GATLING_SPEED * deltaTime * Math.sin(this.m_angle * DEG_TO_RAD);
		this.m_y += PLAYER_GATLING_SPEED * deltaTime * Math.cos(this.m_angle * DEG_TO_RAD);
		
		if (this.x < PLAYER_GATLING_SIZE * 0.5 || this.x > CANVAS_W - PLAYER_GATLING_SIZE * 0.5
		||  this.y < PLAYER_GATLING_SIZE * 0.5 || this.y > CANVAS_H - PLAYER_GATLING_SIZE * 0.5) {
			this.Destroy();
		}
	}
	this.UpdateVisual = function() {
		this.m_sprite.setRotation (this.m_angle);
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
	}
	this.Destroy = function () {
		layer.removeChild (this.m_sprite);
		g_spritePool.PutIntoPool (this.m_sprite);
	}
}