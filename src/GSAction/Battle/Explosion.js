function Explosion (battle, layer, color) {
	this.m_size = 500;
	
	this.m_active = false;
	this.m_x = 0;
	this.m_y = 0;
	this.m_alpha = 1;
	this.m_scale = 0;
	this.m_color = color;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool(layer, "Explosion.png", true);
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_EXPLOSION);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	this.m_sprite.setScale (0);
	this.m_sprite.setOpacity (0);
	this.m_sprite.setColor (this.m_color);
	
	this.Start = function (x, y, scale, life) {
		this.m_active = true;
		this.m_x = x;
		this.m_y = y;
		this.m_alpha = 1;
		this.m_life = 0;
		this.m_maxScale = scale;
		this.m_maxLife = life;
		
		var emitNumber = (scale * 5) >> 0;
		var speed = 400 + scale * 200;
		for (var i=0; i<emitNumber; i++) {
			var tempParticle = new ExplosionParticle(battle, layer, this.m_color);
			tempParticle.Start(x, y, life * 1.3, speed);
		}
		
		battle.m_particles.push (this);
	}
	
	
	this.Update = function (deltaTime) {
		if (this.m_active) {
			this.m_life += deltaTime;
			if (this.m_life >= this.m_maxLife) {
				this.Destroy();
			}
			
			this.m_scale = (this.m_life / this.m_maxLife) * this.m_maxScale;
			this.m_alpha = 1 - (this.m_life / this.m_maxLife);
			if (this.m_alpha > 1) {
				this.m_alpha = 1;
			}
			
			this.m_y -= FORWARD_SPEED * deltaTime;
		}
	}
	
	
	this.UpdateVisual = function() {
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
		this.m_sprite.setScale (this.m_scale);
		this.m_sprite.setOpacity (this.m_alpha * 255);
	}
	
	
	this.Destroy = function () {
		this.m_active = false;
		g_spritePool.PutSpriteIntoPool (this.m_sprite);
	}
} 