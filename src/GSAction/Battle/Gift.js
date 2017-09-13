var GIFT_HEAL = 0;
var GIFT_POWER = 1;
var GIFT_SHIELD = 2;
var GIFT_ASSISTANT_1 = 3;
var GIFT_ALL = 4;



function Gift (battle, layer, type) {
	this.m_size = 40;
	this.m_moveSpeed = 50;
	this.m_rotateSpeed = 30;
	
	this.m_active = false;
	this.m_x = 0;
	this.m_y = 0;
	
	if (type == GIFT_HEAL) {
		this.m_sprite = g_spritePool.GetSpriteFromPool(layer, "GiftHeal.png", true);
	}
	else if (type == GIFT_POWER) {
		this.m_sprite = g_spritePool.GetSpriteFromPool(layer, "GiftPow.png", true);
	}
	else if (type == GIFT_SHIELD) {
		this.m_sprite = g_spritePool.GetSpriteFromPool(layer, "GiftShield.png", true);
	}
	else if (type == GIFT_ASSISTANT_1) {
		this.m_sprite = g_spritePool.GetSpriteFromPool(layer, "GiftA1.png", true);
	}
	
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_PLAYER);
	this.m_sprite.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE));
	
	this.Start = function (x, y) {
		this.m_active = true;
		this.m_x = x;
		this.m_y = y;
		
		battle.m_particles.push (this);
	}
	
	
	this.Update = function (deltaTime) {
		if (this.m_active) {
			this.m_y -= this.m_moveSpeed * deltaTime;
			
			var distance = DistanceBetweenTwoPoint(this.m_x, this.m_y, battle.m_player.m_x, battle.m_player.m_y);
			if (battle.m_player.m_active && distance < (battle.m_player.m_size + this.m_size) * 0.5) {
				if (type == GIFT_HEAL) {
					battle.m_player.Hit (-30);
				}
				else if (type == GIFT_POWER) {
					if (battle.m_player.m_power < PLAYER_GATLING_COOLDOWN.length - 1) {
						battle.m_player.m_power ++;
					}
				}
				else if (type == GIFT_SHIELD) {
					battle.m_player.m_shieldTime = PLAYER_SHIELD_TIME;
				}
				else if (type == GIFT_ASSISTANT_1) {
					battle.m_player.AddAssistant (1);
				}
				
				this.Destroy();
				return;
			}
			
			if (this.m_y < -this.m_size * 2) {
				this.Destroy();
			}
		}
	}
	
	this.UpdateVisual = function() {
		this.m_sprite.setPosition (cc.p(this.m_x, this.m_y));
	}
	
	this.Destroy = function () {
		this.m_active = false;
		g_spritePool.PutSpriteIntoPool (this.m_sprite);
	}
}