var g_background;
var g_battle;
var g_topBar;

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


g_gsActionUILayer.Play = function() {
	if (g_menuShowing == true && g_menuAlpha == 1) {
		g_menuShowing = false;
		if (g_battle != null) {
			g_battle.Destroy();
		}
		g_battle = new Battle (g_gsActionBattleLayer);
		g_topBar.Show();
		g_topBar.SetHP(1);

		
		g_gsActionUILayer.m_startButton.SetEnable(false);
		for (var i=0; i<g_gsActionUILayer.m_upgradeButton.length; i++) {
			g_gsActionUILayer.m_upgradeButton[i].SetEnable(false);
		}
		
		myAudio.PlaySound("res/Sound/Start.mp3");
	}
}
			
g_gsActionUILayer.Init = function () {
	LoadProfile();

	this.m_logoSprite = g_spritePool.GetSpriteFromPool(this, "res/GSAction/UI/Logo.png", false);
	this.m_logoSprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_logoSprite.setLocalZOrder (LAYER_UI);
	this.m_logoSprite.setPosition (CANVAS_W * 0.5, CANVAS_H * 0.9);
	this.m_logoSprite.setScale (0.6);
	
	
	this.m_startButton = new Button(this, "PlayButton", CANVAS_W * 0.5, CANVAS_H * 0.6, g_gsActionUILayer.Play);
	
	this.m_upgrade = new cc.LabelTTF("Upgrade", GetFont("AirCruiser"), 45);
	this.m_upgrade.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_upgrade.setPosition (cc.p(CANVAS_W * 0.5, CANVAS_H * 0.1 + 270));
	this.m_upgrade.setLocalZOrder (LAYER_UI);
	this.m_upgrade.setColor (new cc.Color(230, 230, 230, 1));
	this.addChild(this.m_upgrade);
	
	this.m_credit = new cc.LabelTTF("$" + g_credit, GetFont("AirCruiser"), 45);
	this.m_credit.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_credit.setPosition (cc.p(CANVAS_W * 0.5, CANVAS_H * 0.1 + 220));
	this.m_credit.setLocalZOrder (LAYER_UI);
	this.m_credit.setColor (new cc.Color(230, 230, 230, 1));
	this.addChild(this.m_credit);
	
	this.m_upgradeButton = new Array();
	this.m_upgradeButton[0] = new Button(this, "UpgradePower", CANVAS_W * 0.5 - 155, CANVAS_H * 0.1 + 110, g_gsActionUILayer.UpgradePower);
	this.m_upgradeButton[1] = new Button(this, "UpgradeHP", CANVAS_W * 0.5 - 155, CANVAS_H * 0.1, g_gsActionUILayer.UpgradeHP);
	this.m_upgradeButton[2] = new Button(this, "UpgradeShield", CANVAS_W * 0.5 + 155, CANVAS_H * 0.1 + 110, g_gsActionUILayer.UpgradeShield);
	this.m_upgradeButton[3] = new Button(this, "UpgradeBot", CANVAS_W * 0.5 + 155, CANVAS_H * 0.1, g_gsActionUILayer.UpgradeBot);
	
	this.m_upgradeText = new Array();
	this.m_upgradeText[0] = new cc.LabelTTF("Power: " + (g_powerLevel + 1), GetFont("AirCruiser"), 25);
	this.m_upgradeText[0].setPosition (cc.p(CANVAS_W * 0.5 - 110, CANVAS_H * 0.1 + 120));
	this.m_upgradeText[1] = new cc.LabelTTF("Health: " + (g_hpLevel + 1), GetFont("AirCruiser"), 25);
	this.m_upgradeText[1].setPosition (cc.p(CANVAS_W * 0.5 - 110, CANVAS_H * 0.1 + 10));
	this.m_upgradeText[2] = new cc.LabelTTF("Shield: " + (g_shieldLevel + 1), GetFont("AirCruiser"), 25);
	this.m_upgradeText[2].setPosition (cc.p(CANVAS_W * 0.5 + 200, CANVAS_H * 0.1 + 120));
	this.m_upgradeText[3] = new cc.LabelTTF("Robot: " + (g_botLevel + 1), GetFont("AirCruiser"), 25);
	this.m_upgradeText[3].setPosition (cc.p(CANVAS_W * 0.5 + 200, CANVAS_H * 0.1 + 10));
	
	this.m_powerPrice = GetNextPowerUpgradePrice();
	this.m_hpPrice = GetNextHPUpgradePrice();
	this.m_shieldPrice = GetNextShieldUpgradePrice();
	this.m_botPrice = GetNextRobotUpgradePrice();

	this.m_upgradePrice = new Array();
	this.m_upgradePrice[0] = new cc.LabelTTF("$" + this.m_powerPrice, GetFont("AirCruiser"), 25);
	this.m_upgradePrice[0].setPosition (cc.p(CANVAS_W * 0.5 - 110, CANVAS_H * 0.1 + 80));
	this.m_upgradePrice[1] = new cc.LabelTTF("$" + this.m_hpPrice, GetFont("AirCruiser"), 25);
	this.m_upgradePrice[1].setPosition (cc.p(CANVAS_W * 0.5 - 110, CANVAS_H * 0.1 - 30));
	this.m_upgradePrice[2] = new cc.LabelTTF("$" + this.m_shieldPrice, GetFont("AirCruiser"), 25);
	this.m_upgradePrice[2].setPosition (cc.p(CANVAS_W * 0.5 + 200, CANVAS_H * 0.1 + 80));
	this.m_upgradePrice[3] = new cc.LabelTTF("$" + this.m_botPrice, GetFont("AirCruiser"), 25);
	this.m_upgradePrice[3].setPosition (cc.p(CANVAS_W * 0.5 + 200, CANVAS_H * 0.1 - 30));
	
	
	for (var i=0; i<4; i++) {
		this.m_upgradeText[i].setAnchorPoint(cc.p(0.5, 0));
		this.m_upgradeText[i].setLocalZOrder (LAYER_UI);
		this.m_upgradeText[i].setColor (new cc.Color(230, 230, 230, 1));
		this.addChild(this.m_upgradeText[i]);
		
		this.m_upgradePrice[i].setAnchorPoint(cc.p(0.5, 0));
		this.m_upgradePrice[i].setLocalZOrder (LAYER_UI);
		this.m_upgradePrice[i].setColor (new cc.Color(230, 230, 230, 1));
		this.addChild(this.m_upgradePrice[i]);
	}
	
	this.m_debug = new cc.LabelTTF("Score: 0", GetFont("AirCruiser"), 30);
	this.m_debug.setAnchorPoint(cc.p(0.5, 0));
	this.m_debug.setPosition (cc.p(CANVAS_W * 0.5, 20));
	this.m_debug.setLocalZOrder (LAYER_UI);
	this.m_debug.setColor (new cc.Color(230, 230, 230, 1));
	this.addChild(this.m_debug);
	
	cc.audioEngine.playMusic("res/Sound/Music.mp3", true);
}

g_gsActionUILayer.UpgradePower = function () {
	if (g_credit >= g_gsActionUILayer.m_powerPrice) {
		g_credit -= g_gsActionUILayer.m_powerPrice;
		g_powerLevel += 1;
		g_gsActionUILayer.m_powerPrice = GetNextPowerUpgradePrice();
		g_gsActionUILayer.m_upgradeText[0].setString("Power: " + (g_powerLevel + 1));
		g_gsActionUILayer.m_upgradePrice[0].setString("$" + g_gsActionUILayer.m_powerPrice);
		g_gsActionUILayer.m_credit.setString("$" + g_credit);

		myAudio.PlaySound("res/Sound/Upgrade.mp3");
		SaveProfile();
	}
}

g_gsActionUILayer.UpgradeHP = function () {
	if (g_credit >= g_gsActionUILayer.m_hpPrice) {
		g_credit -= g_gsActionUILayer.m_hpPrice;
		g_hpLevel += 1;
		g_gsActionUILayer.m_hpPrice = GetNextHPUpgradePrice();
		g_gsActionUILayer.m_upgradeText[1].setString("Health: " + (g_hpLevel + 1));
		g_gsActionUILayer.m_upgradePrice[1].setString("$" + g_gsActionUILayer.m_hpPrice);
		g_gsActionUILayer.m_credit.setString("$" + g_credit);

		myAudio.PlaySound("res/Sound/Upgrade.mp3");
		SaveProfile();
	}
}

g_gsActionUILayer.UpgradeShield = function () {
	if (g_credit >= g_gsActionUILayer.m_shieldPrice) {
		g_credit -= g_gsActionUILayer.m_shieldPrice;
		g_shieldLevel += 1;
		g_gsActionUILayer.m_shieldPrice = GetNextShieldUpgradePrice();
		g_gsActionUILayer.m_upgradeText[2].setString("Shield: " + (g_shieldLevel + 1));
		g_gsActionUILayer.m_upgradePrice[2].setString("$" + g_gsActionUILayer.m_shieldPrice);
		g_gsActionUILayer.m_credit.setString("$" + g_credit);

		myAudio.PlaySound("res/Sound/Upgrade.mp3");
		SaveProfile();
	}
}

g_gsActionUILayer.UpgradeBot = function () {
	if (g_credit >= g_gsActionUILayer.m_botPrice) {
		g_credit -= g_gsActionUILayer.m_botPrice;
		g_botLevel += 1;
		g_gsActionUILayer.m_botPrice = GetNextRobotUpgradePrice();
		g_gsActionUILayer.m_upgradeText[3].setString("Robot: " + (g_botLevel + 1));
		g_gsActionUILayer.m_upgradePrice[3].setString("$" + g_gsActionUILayer.m_botPrice);
		g_gsActionUILayer.m_credit.setString("$" + g_credit);

		myAudio.PlaySound("res/Sound/Upgrade.mp3");
		SaveProfile();
	}
}

g_gsActionUILayer.AddEventListener = function () {
	var instance = this;
	cc.eventManager.addListener({
		event: cc.EventListener.TOUCH_ALL_AT_ONCE,
		swallowTouches: true,
		onTouchesBegan: function (touches, event) {
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
	
	g_gsActionUILayer.m_startButton.AddEventListener();
	for (var i=0; i<g_gsActionUILayer.m_upgradeButton.length; i++) {
		g_gsActionUILayer.m_upgradeButton[i].AddEventListener();
	}
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
	this.m_credit.setOpacity (g_menuAlpha * 255);
	this.m_upgrade.setOpacity (g_menuAlpha * 255);
	
	this.m_startButton.SetOpacity(g_menuAlpha * 255);
	for (var i=0; i<this.m_upgradeButton.length; i++) {
		this.m_upgradeButton[i].SetOpacity(g_menuAlpha * 255);
		this.m_upgradeText[i].setOpacity(g_menuAlpha * 255);
		this.m_upgradePrice[i].setOpacity(g_menuAlpha * 255);
	}
	
	
	if (g_background) g_background.Update (deltaTime);
	if (g_topBar) g_topBar.Update (deltaTime);
	if (g_battle) {
		g_battle.Update (deltaTime);
		if (g_battle.m_gameEnded && g_menuShowing == false) {
			g_credit += g_battle.m_score;
			SaveProfile();
			
			g_menuShowing = true;
			g_gsActionUILayer.m_startButton.SetEnable(true);
			for (var i=0; i<g_gsActionUILayer.m_upgradeButton.length; i++) {
				g_gsActionUILayer.m_upgradeButton[i].SetEnable(true);
			}
		
			g_topBar.Hide();
			this.m_credit.setString("$" + g_credit);

			// Money
			if (cc.sys.isNative) {
				sdkbox.PluginAdMob.show("gameover");
			}
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
	
	myAudio.Update(deltaTime);
	
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
		g_topBar = new TopBar (g_gsActionUILayer);
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