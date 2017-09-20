function TopBar (layer) {
	this.m_state = 0; // Hide
	
	this.m_x = 20;
	this.m_y = CANVAS_H - 20;
	this.m_score = 0;
	this.m_alpha = 0;
	
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