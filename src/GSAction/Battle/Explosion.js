var EXPLOSION_FRAME_NUMBER = 8;
var EXPLOSION_FRAME_SIZE = 150;
var EXPLOSION_FRAME_LATENCY = 0.035;
var EXPLOSION_FADE_SPEED = 3;

function Explosion (battle, layer) {
	this.m_active = false;
	this.m_x = 0;
	this.m_y = 0;
	this.m_alpha = 1;
	this.m_angle = 0;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool("res/GSAction/Battle/Explosion.png");
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_PLAYER);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	layer.addChild(this.m_sprite);
	
	
	var frame = 0;
	var frameCount = 0;
	
	this.Start = function (x, y, scale) {
		this.m_active = true;
		this.m_x = x;
		this.m_y = y;
		this.m_scale = scale;
		this.m_alpha = 1;
		this.m_angle = Math.random() * 360;
		
		frame = 0;
		frameCount = 0;
		
		battle.m_particles.push (this);
	}
	
	
	this.Update = function (deltaTime) {
		if (this.m_active) {
			this.m_alpha -= EXPLOSION_FADE_SPEED * deltaTime;
			if (this.m_alpha < 0) {
				this.m_alpha = 0;
			}
			
			frameCount += deltaTime;
			if (frameCount >= EXPLOSION_FRAME_LATENCY) {
				frameCount -= EXPLOSION_FRAME_LATENCY;
				frame ++;
				if (frame >= EXPLOSION_FRAME_NUMBER) {
					this.Destroy();
				}
			}
		}
	}
	
	
	this.UpdateVisual = function() {
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
		this.m_sprite.setScale (this.m_scale);
		this.m_sprite.setOpacity (this.m_alpha * 255);
		this.m_sprite.setRotation(this.m_angle);
		this.m_sprite.setTextureRect (cc.rect(EXPLOSION_FRAME_SIZE * frame, 0, EXPLOSION_FRAME_SIZE, EXPLOSION_FRAME_SIZE));
	}
	
	
	this.Destroy = function () {
		this.m_active = false;
		layer.removeChild (this.m_sprite);
		g_spritePool.PutSpriteIntoPool (this.m_sprite);
	}
} 