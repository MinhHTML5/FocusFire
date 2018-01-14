function Button(layer, buttonName, x, y, callback) {
	var BUTTON_W = 100;
	var BUTTON_H = 100;
	
	var instance = this;
	
	this.m_x = x;
	this.m_y = y;
	this.m_callback = callback;
	this.m_enabled = true;
	this.m_visible = true;
	
	var path = "res/GSAction/UI/" + buttonName + "/";
	if (buttonName == "PlayButton") {
		BUTTON_W = 150;
		BUTTON_H = 150;
	}
	
	this.m_buttonSprite = new cc.Sprite(path + "ButtonNormal.png");
	this.m_buttonSprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_buttonSprite.setPosition (cc.p(x, y));
	this.m_buttonSprite.setLocalZOrder (LAYER_UI);
	layer.addChild(this.m_buttonSprite);
	
	/*
	this.m_buttonCaption = new cc.LabelTTF(caption, GetFont("Nasalization"), 20);
	this.m_buttonCaption.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_buttonCaption.setPosition (cc.p(x, y));
	this.m_buttonCaption.setLocalZOrder (LAYER_UI);
	layer.addChild(this.m_buttonCaption);
	*/
	
	this.SetPosition = function (x, y) {
		this.m_x = x;
		this.m_y = y;
		
		this.m_buttonSprite.setPosition (cc.p(x, y));
		//this.m_buttonCaption.setPosition (cc.p(x, y));
	}
	this.SetCaption = function (string) {
		//this.m_buttonCaption.setString (string);
	}
	
	this.Update = function (deltaTime) {
		
	}
	
	this.SetEnable = function (enable) {
		if (this.m_enabled != enable) {
			if (enable) {
				this.m_buttonSprite.setTexture(path + "ButtonNormal.png");
			}
			else {
				this.m_buttonSprite.setTexture(path + "ButtonNormal.png");
			}
			this.m_enabled = enable;
		}
	}
	this.SetVisible = function (visible) {
		this.m_visible = visible;
		this.m_buttonSprite.setVisible (visible);
		//this.m_buttonCaption.setVisible (visible);
	}
	
	this.SetOpacity = function(alpha) {
		instance.m_buttonSprite.setOpacity(alpha);
	}
	
	this.AddEventListener = function() {
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event) {
				if (instance.m_enabled && instance.m_visible) {
					lastTouchPos = touch.getLocation();
					var buttonRect = instance.m_buttonSprite.getBoundingBox();
					if (cc.rectContainsPoint(buttonRect, lastTouchPos)) {
						instance.m_buttonSprite.setTexture(path + "ButtonDown.png");
						return true;
					}
				}
				return false;
			},
			onTouchMoved: function (touch, event) {
				if (instance.m_enabled && instance.m_visible) {
					lastTouchPos = touch.getLocation();
					var buttonRect = instance.m_buttonSprite.getBoundingBox();
					if (cc.rectContainsPoint(buttonRect, lastTouchPos)) {
						instance.m_buttonSprite.setTexture(path + "ButtonDown.png");
					}
					else {
						instance.m_buttonSprite.setTexture(path + "ButtonNormal.png");
					}
				}
			},
			onTouchEnded: function (touch, event) {
				if (instance.m_enabled && instance.m_visible) {
					var buttonRect = instance.m_buttonSprite.getBoundingBox();
					if (cc.rectContainsPoint(buttonRect, lastTouchPos)) {
						if (callback) callback();
					}
					instance.m_buttonSprite.setTexture(path + "ButtonNormal.png");
				}
			}
		}, instance.m_buttonSprite);
	}
}