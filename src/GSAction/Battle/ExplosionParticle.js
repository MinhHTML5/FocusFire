function ExplosionParticle (battle, layer) {
	this.m_active = false;
	this.m_x = 0;
	this.m_y = 0;
	this.m_life = 0;
	this.m_scaleY = 1;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool("res/GSAction/Battle/ExplosionParticle.png");
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_BATTLE);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	layer.addChild(this.m_sprite);
	
	this.Start = function (x, y, life, speed) {
		this.m_active = true;
		this.m_x = x;
		this.m_y = y;
		this.m_maxLife = (Math.random() * 0.5 + 0.5) * life;
		this.m_angle = Math.random() * 360;
		this.m_alpha = 1;
		this.m_speed = speed;
		this.m_scale = 0.3;
		this.m_scaleY = this.m_speed * 0.08;
		
		battle.m_particles.push (this);
	}
	this.Update = function (deltaTime) {
		if (this.m_active) {
			var moveDistance = this.m_speed * deltaTime;
			this.m_x += moveDistance * Math.sin(this.m_angle * DEG_TO_RAD);
			this.m_y += moveDistance * Math.cos(this.m_angle * DEG_TO_RAD);
			
			//this.m_scaleY = 1;
			
			this.m_life += deltaTime;
			if (this.m_life >= this.m_maxLife) {
				this.Destroy();
			}
			
			this.m_alpha = 1 - (this.m_life / this.m_maxLife);
			this.m_alpha *= 1.2;
			if (this.m_alpha > 1) {
				this.m_alpha = 1;
			}
		}
	}
	this.UpdateVisual = function() {
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
		this.m_sprite.setScale (this.m_scale, this.m_scale * this.m_scaleY);
		this.m_sprite.setOpacity (this.m_alpha * 255);
		this.m_sprite.setRotation (this.m_angle);
	}
	this.Destroy = function () {
		this.m_active = false;
		layer.removeChild (this.m_sprite);
		g_spritePool.PutSpriteIntoPool (this.m_sprite);
	}
}