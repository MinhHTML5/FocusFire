var PLAYER_ENGINE_PARTICLE_SPEED = 500;
var PLAYER_ENGINE_PARTICLE_LIFE = 0.2;
var PLAYER_ENGINE_PARTICLE_SCALE_MIN = 0.5;
var PLAYER_ENGINE_PARTICLE_SCALE_MAX = 1;
var PLAYER_ENGINE_PARTICLE_ALPHA = 0.4;
var PLAYER_ENGINE_PARTICLE_FADE_SPEED = 2;
var PLAYER_ENGINE_PARTICLE_RECOIL = 5;
var PLAYER_ENGINE_PARTICLE_DISTANCE = 20;

function PlayerEngineParticle (battle, layer) {
	this.m_active = false;
	this.m_x = 0;
	this.m_y = 0;
	this.m_life = 0;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool("res/GSAction/Battle/PlayerEngineParticle.png");
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_PLAYER);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	layer.addChild(this.m_sprite);
	
	this.Start = function (x, y) {
		this.m_active = true;
		this.m_x = x + Math.random() * PLAYER_ENGINE_PARTICLE_RECOIL * 2 - PLAYER_ENGINE_PARTICLE_RECOIL;
		this.m_y = y + Math.random() * PLAYER_ENGINE_PARTICLE_RECOIL * 2 - PLAYER_ENGINE_PARTICLE_RECOIL - PLAYER_ENGINE_PARTICLE_DISTANCE;
		this.m_life = PLAYER_ENGINE_PARTICLE_LIFE;
		this.m_scale = Math.random() * (PLAYER_ENGINE_PARTICLE_SCALE_MAX - PLAYER_ENGINE_PARTICLE_SCALE_MIN) + PLAYER_ENGINE_PARTICLE_SCALE_MIN;
		this.m_alpha = PLAYER_ENGINE_PARTICLE_ALPHA;
		
		battle.m_particles.push (this);
	}
	this.Update = function (deltaTime) {
		if (this.m_active) {
			this.m_y -= PLAYER_ENGINE_PARTICLE_SPEED * deltaTime;
			
			this.m_alpha -= PLAYER_ENGINE_PARTICLE_FADE_SPEED * deltaTime;
			if (this.m_alpha < 0) {
				this.m_alpha = 0;
			}
			
			this.m_life -= deltaTime;
			if (this.m_life <= 0) {
				this.Destroy();
			}
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