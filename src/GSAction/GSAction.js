var g_background;
var g_battle;
var g_topBar;
var g_bottomBar;

var g_gsActionBackgroundLayer = cc.Layer.create();
	g_gsActionBackgroundLayer.retain();

var g_gsActionBattleLayer = cc.Layer.create();
	g_gsActionBattleLayer.retain();

var g_gsActionUILayer = cc.Layer.create();
	g_gsActionUILayer.retain();


var g_colorChangingSpeed = 30;
var g_colorHue = 140;
var g_colorTheme = GetRGBColorFromHSV(g_colorHue, 1, 1);


var g_menuShowing = true;
var g_menuAlpha = 1;

g_gsActionUILayer.Init = function () {
	this.m_logoSprite = g_spritePool.GetSpriteFromPool(this, "res/GSAction/UI/Logo.png", false);
	this.m_logoSprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_logoSprite.setLocalZOrder (LAYER_UI);
	this.m_logoSprite.setPosition (CANVAS_W * 0.5, CANVAS_H * 0.9);
	this.m_logoSprite.setScale (0.6)
	
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
	
	
	this.m_debug = new cc.LabelTTF("Score: 0", GetFont("AirCruiser"), 30);
	this.m_debug.setAnchorPoint(cc.p(1, 1));
	this.m_debug.setPosition (cc.p(CANVAS_W - 10, CANVAS_H - 10));
	this.m_debug.setLocalZOrder (LAYER_UI);
	this.m_debug.setColor (new cc.Color(230, 230, 230, 1));
	this.addChild(this.m_debug);
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
				g_battle = new Battle (g_gsActionBattleLayer);
				g_topBar.Show();
				g_topBar.SetValue(1);
				g_bottomBar.Show();
				g_bottomBar.SetValue(1);
				g_bottomBar.SetPower(0);
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
	if (g_topBar) g_topBar.Update (deltaTime);
	if (g_bottomBar) g_bottomBar.Update (deltaTime);
	if (g_battle) {
		g_battle.Update (deltaTime);
		if (g_battle.m_gameEnded) {
			g_menuShowing = true;
			g_topBar.Hide();
			g_bottomBar.Hide();
			this.m_score.setString("Score: " + g_battle.m_score);
		}
	}
	
	if (g_background) g_background.UpdateVisual ();
	if (g_battle) g_battle.UpdateVisual ();
	
	
	var targetHue = 140;
	if (g_battle) {
		if (!g_battle.m_gameEnded) {
			targetHue = (1 - (g_battle.m_score * 0.001)) * 140;
			if (targetHue < 0) {
				targetHue = 0;
			}
		}
		
	}
	var hueChangingAmount = g_colorChangingSpeed * deltaTime;
	if (g_colorHue < targetHue - hueChangingAmount) {
		g_colorHue += hueChangingAmount;
	}
	else if (g_colorHue > targetHue + hueChangingAmount) {
		g_colorHue -= hueChangingAmount;
	}
	else {
		g_colorHue = targetHue;
	}
	g_colorTheme = GetRGBColorFromHSV(g_colorHue, 1, 1);
	
	var fps = (1 / deltaTime) >> 0;
	this.m_debug.setString("FPS: " + fps + " - Sprites: " + g_spritePool.m_spriteOnScreen + " / " + g_spritePool.m_spriteNumber);
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
		g_topBar = new TopBar (g_gsActionUILayer)
		g_bottomBar = new BottomBar (g_gsActionUILayer)
	},
    onEnter:function () {
		this._super();
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