var PLAYER_GATLING_W = 23;
var PLAYER_GATLING_H = 170;
var PLAYER_GATLING_MIN_ALPHA = 200;
var PLAYER_GATLING_MAX_ALPHA = 255;
var PLAYER_GATLING_SPEED_MIN = 2400;
var PLAYER_GATLING_SPEED_MAX = 2600;
var PLAYER_GATLING_OFFSET = 50;
var PLAYER_GATLING_SPAWN_OFFSET = 12;

function PlayerGatling (battle, layer) {
	this.m_active = false;
	this.m_x = 0;
	this.m_y = 0;
	this.m_angle = 0;
	this.m_alpha = 255;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool(layer, "PlayerGatling.png", true);
	this.m_sprite.setAnchorPoint(cc.p(0.5, 1));
	this.m_sprite.setLocalZOrder (LAYER_BULLET);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE));
	
	var length = 0;
	var isFirstLoop = false;
	var scaleX = 1;
	
	this.Start = function (angle, x, y) {
		this.m_active = true;
		this.m_angle = angle;
		this.m_x = x + Math.random() * PLAYER_GATLING_SPAWN_OFFSET * 2 - PLAYER_GATLING_SPAWN_OFFSET;
		this.m_y = y + Math.random() * PLAYER_GATLING_SPAWN_OFFSET * 2 - PLAYER_GATLING_SPAWN_OFFSET;
		this.m_speed = (Math.random() * (PLAYER_GATLING_SPEED_MAX - PLAYER_GATLING_SPEED_MIN) + PLAYER_GATLING_SPEED_MIN) >> 0;
		
		this.m_alpha = (Math.random() * (PLAYER_GATLING_MAX_ALPHA - PLAYER_GATLING_MIN_ALPHA) + PLAYER_GATLING_MIN_ALPHA) >> 0;
		this.m_sprite.setOpacity(this.m_alpha);
		
		if (Math.random() > 0.5) {
			scaleX = 1;
		}
		else {
			scaleX = -1;
		}
		
		length = 0;
		isFirstLoop = true;
		
		battle.m_projectiles.push (this);
	}
	
	
	this.Update = function (deltaTime) {
		if (this.m_active) {
			var moveDistance = this.m_speed * deltaTime;
			if (isFirstLoop == true) {
				// Smooth the starting point of each bullet
				moveDistance *= Math.random();
				isFirstLoop = false;
			}
			this.m_x += moveDistance * Math.sin(this.m_angle * DEG_TO_RAD);
			this.m_y += moveDistance * Math.cos(this.m_angle * DEG_TO_RAD);
			
			length += moveDistance;
			if (length > PLAYER_GATLING_H) {
				length = PLAYER_GATLING_H;
			}
			
			if (this.m_x < - PLAYER_GATLING_W|| this.m_x > CANVAS_W + PLAYER_GATLING_W
			||  this.m_y < 0 || this.m_y > CANVAS_H + PLAYER_GATLING_H) {
				this.Destroy();
				return;
			}
			
			for (var i=0; i<battle.m_enemies.length; i++) {
				if (battle.m_enemies[i].m_active && battle.m_enemies[i].m_HP > 0) {
					var distance = DistanceBetweenTwoPoint(this.m_x, this.m_y, battle.m_enemies[i].m_x, battle.m_enemies[i].m_y);
					if (distance < battle.m_enemies[i].m_size) {
						battle.m_enemies[i].Hit (GetPlayerDamage());
						battle.SpawnExplosion(this.m_x, this.m_y, 0.4, 0.3, 0, battle.m_enemies[i].m_color);
						this.Destroy();
						return;
					}
				}
			}
		}
	}
	
	
	this.UpdateVisual = function() {
		this.m_sprite.setRotation (this.m_angle);
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y + PLAYER_GATLING_OFFSET));
		this.m_sprite.setScaleX (scaleX);
		this.m_sprite.setScaleY (length /PLAYER_GATLING_H);
	}
	
	
	this.Destroy = function () {
		this.m_active = false;
		g_spritePool.PutSpriteIntoPool (this.m_sprite);
	}
}