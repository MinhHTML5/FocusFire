var CANVAS_W = 720;
var CANVAS_H = 1280;

var LAYER_BACKGROUND = 0;
var LAYER_BATTLE = 10;
var LAYER_ENEMY = 20;
var LAYER_PLAYER = 30;
var LAYER_EXPLOSION = 40;
var LAYER_BULLET = 50;
var LAYER_UI = 100;


var g_gsLoader;
var g_gsMenu;
var g_gsAction;

function InitLoader() {
	g_gsLoader = new GSLoader();
	g_gsLoader.retain();
}

function GlobalInit() {
	// Load all sprite sheet
	for (var i=0; i<g_spriteSheetList.length; i++) {
		cc.spriteFrameCache.addSpriteFrames (g_spriteSheetList[i][0], g_spriteSheetList[i][1]);
	}
	
	
	//g_gsMenu = new GSMenu();
	g_gsAction = new GSAction();
	
	//g_gsMenu.retain();
	g_gsAction.retain();
}



var g_stateStack = new Array();
function PushState (state) {
	g_stateStack.push (state);
	cc.director.runScene(new cc.TransitionFade(0.8, state));
}
function PopState () {
	g_stateStack.splice (g_stateStack.length - 1, 1);
	cc.director.runScene(new cc.TransitionFade(0.8, g_stateStack[g_stateStack.length - 1]));
}






function PushMenu () {
	//PushState (g_gsMenu);
	PushState (g_gsAction);
}
function PushAction () {
	//g_gsAction.NewBattle (campaign, mission);
	//PushState (g_gsAction);
}






cc.game.onStart = function(){
    if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    // Pass true to enable retina display, on Android disabled by default to improve performance
    cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS ? true : false);

    // Adjust viewport meta
    cc.view.adjustViewPort(true);

    // Uncomment the following line to set a fixed orientation for your game
    cc.view.setOrientation(cc.ORIENTATION_LANDSCAPE);

    // Setup the resolution policy and design resolution size
	if (cc.sys.isNative) {
		cc.view.setDesignResolutionSize(CANVAS_W, CANVAS_H, cc.ResolutionPolicy.FIXED_WIDTH);
	}
	else {
	    cc.view.setDesignResolutionSize(CANVAS_W, CANVAS_H, cc.ResolutionPolicy.FIXED_WIDTH);
	}

    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);
	
	// Show FPS or not
	cc.director.setDisplayStats(false);

    // Load resources
	cc.LoaderScene.preload(g_preloadList, function () {
		InitLoader();
        cc.director.runScene(g_gsLoader);
    }, this);
	
	// Fix the height
	CANVAS_H = cc.director.getWinSizeInPixels().height;

	// Money
	sdkbox.PluginAdMob.init();
	sdkbox.PluginAdMob.cache("home");
	
	sdkbox.PluginAdMob.setListener({
		adViewDidReceiveAd : function(name) { sdkbox.PluginAdMob.show("home"); },
		adViewDidFailToReceiveAdWithError : function(name, msg) { },
		adViewWillPresentScreen : function(name) { },
		adViewDidDismissScreen : function(name) { },
		adViewWillDismissScreen : function(name) { },
		adViewWillLeaveApplication : function(name) { }
	});
};
cc.game.run();