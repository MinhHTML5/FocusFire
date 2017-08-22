function Explosion (battle, layer) {
	this.m_size = 500;
	
	this.m_active = false;
	this.m_x = 0;
	this.m_y = 0;
	this.m_alpha = 1;
	this.m_scale = 0;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool("res/GSAction/Battle/Explosion.png");
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_EXPLOSION);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	this.m_sprite.setScale (0);
	layer.addChild(this.m_sprite);
	
	this.Start = function (x, y, scale, life) {
		this.m_active = true;
		this.m_x = x;
		this.m_y = y;
		this.m_alpha = 1;
		this.m_life = 0;
		this.m_maxScale = scale;
		this.m_maxLife = life;
		
		var emitNumber = scale * 10;
		var speed = 50 + scale * 300;
		for (var i=0; i<emitNumber; i++) {
			var tempParticle = new ExplosionParticle(battle, layer);
			tempParticle.Start(x, y, life * 2, speed);
			battle.m_particles.push (tempParticle);
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
		layer.removeChild (this.m_sprite);
		g_spritePool.PutSpriteIntoPool (this.m_sprite);
	}
} 