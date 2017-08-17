var g_background;
var g_battle;

var g_gsActionBackgroundLayer = cc.Layer.create();
	g_gsActionBackgroundLayer.retain();

var g_gsActionBattleLayer = cc.Layer.create();
	g_gsActionBattleLayer.retain();

var g_gsActionUILayer = cc.Layer.create();
	g_gsActionUILayer.retain();
	
var g_colorTheme = cc.color(40, 255, 120);

g_gsActionUILayer.Init = function () {
	
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
}

g_gsActionUILayer.Reset = function() {

}


g_gsActionUILayer.update = function (deltaTime) {
	if (g_background) g_background.Update (deltaTime);
	if (g_battle) g_battle.Update (deltaTime);
	
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
		g_battle = new Battle (g_gsActionBattleLayer);
	},
    onEnter:function () {
		this._super();
		g_gsActionUILayer.Reset();
		g_gsActionUILayer.scheduleUpdate();
		
		if (this.eventListenerAdded == false || !cc.sys.isNative) {
			g_gsActionUILayer.AddEventListener();
			this.eventListenerAdded = true;
		}
    },
	NewBattle:function () {
		//g_battle = new Battle();
	},
	RestartBattle:function () {
		
	},
	Destroy:function () {
		//g_battle.Destroy();
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