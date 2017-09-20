function BottomBar (layer) {
	this.m_state = 0; // Hide
	
	this.m_x = 20;
	this.m_y = 20;
	this.m_value = 0;
	this.m_alpha = 0;
	
	this.m_HPBarSprite = g_spritePool.GetSpriteFromPool(layer, "res/GSAction/UI/HPBar.png", false);
	this.m_HPBarSprite.setAnchorPoint(cc.p(0, 0));
	this.m_HPBarSprite.setLocalZOrder (LAYER_UI);
	
	this.m_HPContentSprite = g_spritePool.GetSpriteFromPool(layer, "res/GSAction/UI/HPBarContent.png", false);
	this.m_HPContentSprite.setAnchorPoint(cc.p(0, 0));
	this.m_HPContentSprite.setLocalZOrder (LAYER_UI);
	this.m_HPContentSprite.setScale (0, 1);
	
	this.m_HPContent2Sprite = g_spritePool.GetSpriteFromPool(layer, "res/GSAction/UI/HPBarContent.png", false);
	this.m_HPContent2Sprite.setAnchorPoint(cc.p(0, 0));
	this.m_HPContent2Sprite.setLocalZOrder (LAYER_UI);
	this.m_HPContent2Sprite.setScale (0, 1);
	this.m_HPContent2Sprite.setOpacity (127);
	
	
	this.m_powerBarSprite = g_spritePool.GetSpriteFromPool(layer, "res/GSAction/UI/PowerBar.png", false);
	this.m_powerBarSprite.setAnchorPoint(cc.p(1, 0));
	this.m_powerBarSprite.setLocalZOrder (LAYER_UI);
	
	this.m_powerContentBarSprite = g_spritePool.GetSpriteFromPool(layer, "res/GSAction/UI/PowerBarContent.png", false);
	this.m_powerContentBarSprite.setAnchorPoint(cc.p(1, 0));
	this.m_powerContentBarSprite.setLocalZOrder (LAYER_UI);
	
	
	var fadeInSpeed = 3000;
	var onState = [75, 0, 75, 0, 75, 0, 75, 0, 75, 0, 95, 0, 175, 0, 195, 0, 215, 0, 235, 0, 255];
	var stateCount = 0;
	var fadeOutSpeed = 750;
	
	var valueSpeed = 1;
	var currentValue = 0;
	
	this.Show = function() {
		this.m_state = 1;
		stateCount = 0;
	}
	this.Hide = function() {
		this.m_state = 0;
	}
	this.Update = function(deltaTime) {
		this.m_HPBarSprite.setOpacity (this.m_alpha);
		this.m_HPBarSprite.setPosition(this.m_x, this.m_y);
		
		this.m_HPContentSprite.setOpacity (this.m_alpha);
		this.m_HPContentSprite.setPosition(this.m_x + 51, this.m_y + 10);
		
		this.m_HPContent2Sprite.setOpacity (this.m_alpha * 0.5);
		this.m_HPContent2Sprite.setPosition(this.m_x + 51, this.m_y + 10);
		
		
		this.m_powerBarSprite.setOpacity (this.m_alpha);
		this.m_powerBarSprite.setPosition(CANVAS_W - this.m_x, this.m_y);
		
		this.m_powerContentBarSprite.setOpacity (this.m_alpha);
		this.m_powerContentBarSprite.setPosition(CANVAS_W - this.m_x - 54, this.m_y + 12);
		
		if (this.m_state == 1) {
			if (stateCount < onState.length) {
				if (this.m_alpha < onState[stateCount]) {
					this.m_alpha += fadeInSpeed * deltaTime;
					if (this.m_alpha >= onState[stateCount]) {
						this.m_alpha = onState[stateCount];
						stateCount ++;
					}
				}
				else if (this.m_alpha > onState[stateCount]) {
					this.m_alpha -= fadeInSpeed * deltaTime;
					if (this.m_alpha <= onState[stateCount]) {
						this.m_alpha = onState[stateCount];
						stateCount ++;
					}
				}
			}
		}
		else {
			this.m_alpha -= fadeOutSpeed * deltaTime;
			if (this.m_alpha < 0) {
				this.m_alpha = 0;
			}
		}
		
		if (stateCount == onState.length) {
			if (currentValue > this.m_value) {
				var tempSpeed = (currentValue - this.m_value) * 1.5;
				if (tempSpeed > valueSpeed) {
					tempSpeed = valueSpeed;
				}
				else if (tempSpeed < 0.03) {
					tempSpeed = 0.03;
				}
				currentValue -= tempSpeed * deltaTime;
				if (currentValue < this.m_value) {
					currentValue = this.m_value;
				}
				this.m_HPContentSprite.setScale(this.m_value, 1);
				this.m_HPContent2Sprite.setScale (currentValue, 1);
			}
			else if (currentValue < this.m_value) {
				var tempSpeed = (this.m_value - currentValue) * 1.5;
				if (tempSpeed > valueSpeed) {
					tempSpeed = valueSpeed;
				}
				else if (tempSpeed < 0.03) {
					tempSpeed = 0.03;
				}
				currentValue += tempSpeed * deltaTime;
				if (currentValue > this.m_value) {
					currentValue = this.m_value;
				}
				this.m_HPContentSprite.setScale(currentValue, 1);
				this.m_HPContent2Sprite.setScale (currentValue, 1);
			}
		}
	}
	this.SetValue = function(value) {
		this.m_value = value;
		if (this.m_value < 0) {
			this.m_value = 0;
		}
	}
	this.SetPower = function(power) {
		this.m_powerContentBarSprite.setTextureRect (cc.rect((10 - power) * 24, 0, power * 24, 28));
		this.m_powerContentBarSprite.setContentSize (cc.size(power * 24, 28));
	}
}