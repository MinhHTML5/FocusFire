function BottomBar (layer) {
	this.m_state = 0; // Hide
	
	this.m_x = 20;
	this.m_y = 20;
	this.m_score = 0;
	this.m_value = 0;
	this.m_alpha = 0;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool(layer, "res/GSAction/UI/HPBar.png", false);
	this.m_sprite.setAnchorPoint(cc.p(0, 0));
	this.m_sprite.setLocalZOrder (LAYER_UI);
	
	this.m_contentSprite = g_spritePool.GetSpriteFromPool(layer, "res/GSAction/UI/HPBarContent.png", false);
	this.m_contentSprite.setAnchorPoint(cc.p(0, 0));
	this.m_contentSprite.setLocalZOrder (LAYER_UI);
	this.m_contentSprite.setScale (0, 1);
	
	this.m_content2Sprite = g_spritePool.GetSpriteFromPool(layer, "res/GSAction/UI/HPBarContent.png", false);
	this.m_content2Sprite.setAnchorPoint(cc.p(0, 0));
	this.m_content2Sprite.setLocalZOrder (LAYER_UI);
	this.m_content2Sprite.setScale (0, 1);
	this.m_content2Sprite.setOpacity (127);
	
	this.m_scoreLabel = new cc.LabelTTF("0", GetFont("AirCruiser"), 45);
	this.m_scoreLabel.setAnchorPoint(cc.p(1, 0));
	this.m_scoreLabel.setPosition (cc.p(CANVAS_W * 0.5, CANVAS_H * 0.6 - 50));
	this.m_scoreLabel.setLocalZOrder (LAYER_UI);
	this.m_scoreLabel.setColor (new cc.Color(230, 230, 230, 1));
	layer.addChild(this.m_scoreLabel);
	
	var fadeInSpeed = 3000;
	var onState = [75, 0, 75, 0, 75, 0, 75, 0, 75, 0, 95, 0, 175, 0, 195, 0, 215, 0, 235, 0, 255];
	var stateCount = 0;
	var fadeOutSpeed = 750;
	
	var valueSpeed = 1;
	var currentValue = 0;
	
	var currentScore = 0;
	
	this.Show = function() {
		this.m_state = 1;
		stateCount = 0;
		this.m_score = 0;
		currentScore = 0;
	}
	this.Hide = function() {
		this.m_state = 0;
	}
	this.Update = function(deltaTime) {
		this.m_sprite.setOpacity (this.m_alpha);
		this.m_sprite.setPosition(this.m_x, this.m_y);
		
		this.m_contentSprite.setOpacity (this.m_alpha);
		this.m_contentSprite.setPosition(this.m_x + 51, this.m_y + 10);
		
		this.m_content2Sprite.setOpacity (this.m_alpha * 0.5);
		this.m_content2Sprite.setPosition(this.m_x + 51, this.m_y + 10);
		
		this.m_scoreLabel.setOpacity (this.m_alpha);
		this.m_scoreLabel.setPosition(CANVAS_W - 20, this.m_y);
		
		
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
				this.m_contentSprite.setScale(this.m_value, 1);
				this.m_content2Sprite.setScale (currentValue, 1);
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
				this.m_contentSprite.setScale(currentValue, 1);
				this.m_content2Sprite.setScale (currentValue, 1);
			}
		}
		
		if (currentScore < this.m_score - 10000) {
			currentScore += 1234;
		}
		else if (currentScore < this.m_score - 1000) {
			currentScore += 123;
		}
		else if (currentScore < this.m_score - 100) {
			currentScore += 12;
		}
		else if (currentScore < this.m_score) {
			currentScore += 1;
		}
		
		this.m_scoreLabel.setString ("" + currentScore);
	}
	this.SetValue = function(value) {
		this.m_value = value;
		if (this.m_value < 0) {
			this.m_value = 0;
		}
	}
	this.SetScore = function(value) {
		this.m_score = value;
	}
}