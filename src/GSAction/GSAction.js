var g_background;
var g_battle;

var g_gsActionBackgroundLayer = cc.Layer.create();
	g_gsActionBackgroundLayer.retain();

var g_gsActionBattleLayer = cc.Layer.create();
	g_gsActionBattleLayer.retain();

var g_gsActionUILayer = cc.Layer.create();
	g_gsActionUILayer.retain();
	
var g_colorTheme = cc.color(40, 255, 120);


var g_menuShowing = true;
var g_menuAlpha = 1;

g_gsActionUILayer.Init = function () {
	this.m_logoSprite = g_spritePool.GetSpriteFromPool("res/GSAction/UI/Logo.png");
	this.m_logoSprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_logoSprite.setLocalZOrder (LAYER_UI);
	this.m_logoSprite.setPosition (CANVAS_W * 0.5, CANVAS_H * 0.9);
	this.m_logoSprite.setScale (0.75)
	this.addChild(this.m_logoSprite);
	
	this.m_highScore = new cc.LabelTTF("Highest: 0", GetFont("AirCruiser"), 45);
	this.m_highScore.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_highScore.setPosition (cc.p(CANVAS_W * 0.5, CANVAS_H * 0.6));
	this.m_highScore.setLocalZOrder (LAYER_UI);
	this.m_highScore.setColor (new cc.Color(230, 230, 230, 1));
	this.addChild(this.m_highScore);
	
	this.m_score = new cc.LabelTTF("Score: 0", GetFont("AirCruiser"), 45);
	this.m_score.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_score.setPosition (cc.p(CANVAS_W * 0.5, CANVAS_H * 0.6 - 50));
	this.m_score.setLocalZOrder (LAYER_UI);
	this.m_score.setColor (new cc.Color(230, 230, 230, 1));
	this.addChild(this.m_score);
	
	this.m_touch = new cc.LabelTTF("Tap to start", GetFont("AirCruiser"), 45);
	this.m_touch.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_touch.setPosition (cc.p(CANVAS_W * 0.5, CANVAS_H * 0.1));
	this.m_touch.setLocalZOrder (LAYER_UI);
	this.m_touch.setColor (new cc.Color(230, 230, 230, 1));
	this.addChild(this.m_touch);
}

g_gsActionUILayer.AddEventListener = function () {
	var instance = this;
	cc.eventManager.addListener({
		event: cc.EventListener.TOUCH_ALL_AT_ONCE,
		swallowTouches: true,
		onTouchesBegan: function (touches, event) {
			if (g_menuShowing == true && g_menuAlpha == 1) {
				g_menuShowing = false;
				if (g_battle != null) {
					g_battle.Destroy();
				}
				g_gsActionBattleLayer.removeAllChildren();
				g_battle = new Battle (g_gsActionBattleLayer);
			}
			if (g_battle) g_battle.TouchDown(touches);
			return true;
		},
		onTouchesMoved: function (touches, event) {
			if (g_battle) g_battle.TouchMove(touches);
		},
		onTouchesEnded: function (touches, event) {
			if (g_battle) g_battle.TouchUp(touches);
		}
	}, this);
	cc.eventManager.addListener({
		event: cc.EventListener.KEYBOARD,
		onKeyPressed:  function(keyCode, event) {
			
		},
		onKeyReleased: function(keyCode, event) {
			return true;
		}
	}, this);
}

g_gsActionUILayer.Reset = function() {

}


g_gsActionUILayer.update = function (deltaTime) {
	if (g_menuShowing == true) {
		g_menuAlpha += deltaTime * 3;
		if (g_menuAlpha > 1) g_menuAlpha = 1;
	}
	else {
		g_menuAlpha -= deltaTime * 3;
		if (g_menuAlpha < 0) g_menuAlpha = 0;
	}
	
	this.m_logoSprite.setOpacity (g_menuAlpha * 255);
	this.m_highScore.setOpacity (g_menuAlpha * 255);
	this.m_score.setOpacity (g_menuAlpha * 255);
	this.m_touch.setOpacity (g_menuAlpha * 255);
	
	
	if (g_background) g_background.Update (deltaTime);
	if (g_battle) {
		g_battle.Update (deltaTime);
		if (g_battle.m_gameEnded) {
			g_menuShowing = true;
		}
	}
	
	if (g_background) g_background.UpdateVisual ();
	if (g_battle) g_battle.UpdateVisual ();
}



var GSAction = cc.Scene.extend({
	ctor:function () {
		this._super();
		g_gsActionUILayer.Init();
		this.addChild(g_gsActionBackgroundLayer);
		this.addChild(g_gsActionBattleLayer);
		this.addChild(g_gsActionUILayer);
		this.eventListenerAdded = false;
		
		g_background = new Background (g_gsActionBackgroundLayer);
	},
    onEnter:function () {
		this._super();
		g_gsActionUILayer.Reset();
		g_gsActionUILayer.scheduleUpdate();
		
		if (this.eventListenerAdded == false || !cc.sys.isNative) {
			g_gsActionUILayer.AddEventListener();
			this.eventListenerAdded = true;
		}
    }
});









function DistanceBetweenTwoPoint (x1, y1, x2, y2) {
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

var RAD_TO_DEG = 57.29577951308231;
var DEG_TO_RAD = 0.0174532925199433;
function AngleBetweenTwoPoint (x1, y1, x2, y2) {
	var angle = 0;
	if (y2 == y1) {
		if (x2 > x1)
			angle = 90;
		else if (x2 < x1)
			angle = 270;
	}
	else {
		angle = Math.atan((x2 - x1) / (y2 - y1)) * RAD_TO_DEG;
		if (y2 < y1) {
			angle += 180;
		}
		if (angle < 0) angle += 360;
	}

	return angle;
}