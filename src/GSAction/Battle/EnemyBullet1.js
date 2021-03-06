function EnemyBullet1 (battle, layer, color) {
	this.m_size = 40;
	this.m_speed = 400;
	this.m_damage = 3 * (1 + battle.m_score / 100);
	
	this.m_active = false;
	this.m_x = 0;
	this.m_y = 0;
	this.m_angle = 0;
	this.m_alpha = 255;
	this.m_color = color;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool(layer, "EnemyBullet1.png", true);
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_BULLET);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE));
	this.m_sprite.setColor (this.m_color);
	
	var length = 0;
	var isFirstLoop = false;
	
	this.Start = function (angle, x, y) {
		this.m_active = true;
		this.m_angle = angle;
		this.m_x = x;
		this.m_y = y;
		
		battle.m_projectiles.push (this);
	}
	
	
	this.Update = function (deltaTime) {
		if (this.m_active) {
			var moveDistance = this.m_speed * deltaTime;

			this.m_x += moveDistance * Math.sin(this.m_angle * DEG_TO_RAD);
			this.m_y += moveDistance * Math.cos(this.m_angle * DEG_TO_RAD);
			
			if (this.m_x < -this.m_size || this.m_x > CANVAS_W + this.m_size
			||  this.m_y < -this.m_size || this.m_y > CANVAS_H + this.m_size) {
				this.Destroy();
				return;
			}
	
			/*	
			for (var i=0; i<battle.m_player.m_assistants.length; i++) {
				var assistant = battle.m_player.m_assistants[i]
				var distance = DistanceBetweenTwoPoint(this.m_x, this.m_y, assistant.m_x, assistant.m_y);
				if (assistant.m_active && distance < assistant.m_size) {
					assistant.Hit (this.m_damage);
					battle.SpawnExplosion(this.m_x, this.m_y, 0.4, 0.3, 0, this.m_color);
					this.Destroy();
					return;
				}
			}
			*/
			
			
			var distance = DistanceBetweenTwoPoint(this.m_x, this.m_y, battle.m_player.m_x, battle.m_player.m_y);
			if (battle.m_player.m_active && distance < battle.m_player.m_size) {
				battle.m_player.Hit (this.m_damage);
				battle.SpawnExplosion(this.m_x, this.m_y, 0.4, 0.3, 0, this.m_color);
				this.Destroy();
				return;
			}
		}
	}
	
	
	this.UpdateVisual = function() {
		this.m_sprite.setRotation (this.m_angle);
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
	}
	
	
	this.Destroy = function () {
		this.m_active = false;
		g_spritePool.PutSpriteIntoPool (this.m_sprite);
	}
}