function TopBar (layer) {
	this.m_state = 0; // Hide
	
	this.m_x = 20;
	this.m_y = CANVAS_H - 20;
	this.m_score = 0;
	this.m_hp = 0;
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
	
	this.m_scoreLabel = new cc.LabelTTF("0", GetFont("AirCruiser"), 45);
	this.m_scoreLabel.setAnchorPoint(cc.p(1, 1));
	this.m_scoreLabel.setPosition (cc.p(CANVAS_W * 0.5, CANVAS_H * 0.6 - 50));
	this.m_scoreLabel.setLocalZOrder (LAYER_UI);
	this.m_scoreLabel.setColor (new cc.Color(230, 230, 230, 1));
	layer.addChild(this.m_scoreLabel);
	
	var fadeInSpeed = 3000;
	var onState = [75, 0, 75, 0, 75, 0, 75, 0, 75, 0, 95, 0, 175, 0, 195, 0, 215, 0, 235, 0, 255];
	var stateCount = 0;
	var fadeOutSpeed = 750;
	
	var currentScore = 0;
	var valueSpeed = 1;
	var currentHP = 0;
	
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
		// General alpha
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
		
		// HP
		this.m_HPBarSprite.setOpacity (this.m_alpha);
		this.m_HPBarSprite.setPosition(this.m_x, this.m_y - 50);
		
		this.m_HPContentSprite.setOpacity (this.m_alpha);
		this.m_HPContentSprite.setPosition(this.m_x + 51, this.m_y - 40);
		
		this.m_HPContent2Sprite.setOpacity (this.m_alpha * 0.5);
		this.m_HPContent2Sprite.setPosition(this.m_x + 51, this.m_y - 40);
		
		if (stateCount == onState.length) {
			if (currentHP > this.m_hp) {
				var tempSpeed = (currentHP - this.m_hp) * 1.5;
				if (tempSpeed > valueSpeed) {
					tempSpeed = valueSpeed;
				}
				else if (tempSpeed < 0.03) {
					tempSpeed = 0.03;
				}
				currentHP -= tempSpeed * deltaTime;
				if (currentHP < this.m_hp) {
					currentHP = this.m_hp;
				}
				this.m_HPContentSprite.setScale(this.m_hp, 1);
				this.m_HPContent2Sprite.setScale (currentHP, 1);
			}
			else if (currentHP < this.m_hp) {
				var tempSpeed = (this.m_hp - currentHP) * 1.5;
				if (tempSpeed > valueSpeed) {
					tempSpeed = valueSpeed;
				}
				else if (tempSpeed < 0.03) {
					tempSpeed = 0.03;
				}
				currentHP += tempSpeed * deltaTime;
				if (currentHP > this.m_hp) {
					currentHP = this.m_hp;
				}
				this.m_HPContentSprite.setScale(currentHP, 1);
				this.m_HPContent2Sprite.setScale (currentHP, 1);
			}
		}
		
		// Score
		this.m_scoreLabel.setOpacity (this.m_alpha);
		this.m_scoreLabel.setPosition(CANVAS_W - 20, this.m_y + 10);
		
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
	this.SetHP = function(value) {
		this.m_hp = value;
		if (this.m_hp < 0) {
			this.m_hp = 0;
		}
	}
	this.SetScore = function(value) {
		this.m_score = value;
	}
}