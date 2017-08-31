var BACKGROUND_OBJECT_HEXAGON = 0;
var BACKGROUND_OBJECT_CLOUD = 1;

var BACKGROUND_OBJECT_MIN_SCALE = 0.5;
var BACKGROUND_OBJECT_MAX_SCALE = 1;
var BACKGROUND_OBJECT_MIN_ALPHA = 0.4;
var BACKGROUND_OBJECT_MAX_ALPHA = 0.6;
var BACKGROUND_OBJECT_MIN_SPEED = 10;
var BACKGROUND_OBJECT_MAX_SPEED = 40;

var BACKGROUND_OBJECT_SPEED = [12, 18, 22, 28, 32];


function BGObject (layer, type) {
	this.m_x = Math.random() * CANVAS_W;
	this.m_y = Math.random() * (CANVAS_H + 200);
	this.m_scale = Math.random() * (BACKGROUND_OBJECT_MAX_SCALE - BACKGROUND_OBJECT_MIN_SCALE) + BACKGROUND_OBJECT_MIN_SCALE;
	this.m_alpha = Math.random() * (BACKGROUND_OBJECT_MAX_ALPHA - BACKGROUND_OBJECT_MIN_ALPHA) + BACKGROUND_OBJECT_MIN_ALPHA;
	this.m_speed = Math.random() * (BACKGROUND_OBJECT_MAX_SPEED - BACKGROUND_OBJECT_MIN_SPEED) + BACKGROUND_OBJECT_MIN_SPEED;
	
	var path;
	if (type == BACKGROUND_OBJECT_HEXAGON) {
		path = "res/GSAction/Background/Hexagon.png";
	}
	else if (type == BACKGROUND_OBJECT_CLOUD) {
		path = "res/GSAction/Background/Cloud.png";
	}
	
	this.m_sprite = g_spritePool.GetSpriteFromPool(path, layer);
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	this.m_sprite.setLocalZOrder (LAYER_BACKGROUND);
	this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
	this.m_sprite.setScale (this.m_scale);
	this.m_sprite.setOpacity (this.m_alpha * 255);
	
	this.Respawn = function() {
		this.m_x = Math.random() * CANVAS_W;
		this.m_y = CANVAS_H + 200;
		this.m_scale = Math.random() * (BACKGROUND_OBJECT_MAX_SCALE - BACKGROUND_OBJECT_MIN_SCALE) + BACKGROUND_OBJECT_MIN_SCALE;
		this.m_alpha = Math.random() * (BACKGROUND_OBJECT_MAX_ALPHA - BACKGROUND_OBJECT_MIN_ALPHA) + BACKGROUND_OBJECT_MIN_ALPHA;
		this.m_speed = Math.random() * (BACKGROUND_OBJECT_MAX_SPEED - BACKGROUND_OBJECT_MIN_SPEED) + BACKGROUND_OBJECT_MIN_SPEED;
		this.m_sprite.setScale (this.m_scale);
		this.m_sprite.setOpacity (this.m_alpha * 255);
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
	}
	
	this.Update = function (deltaTime) {
		this.m_y -= this.m_speed * deltaTime;
		if (this.m_y < -200) {
			this.Respawn();
		}
	}
	
	this.UpdateVisual = function() {
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
		this.m_sprite.setColor (g_colorTheme);
	}
}