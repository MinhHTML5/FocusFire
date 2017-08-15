var g_gsLoaderMainLayer = cc.Layer.create();
g_gsLoaderMainLayer.retain();

g_gsLoaderMainLayer.Init = function () {
	this.m_bgSprite = cc.Sprite.create("res/Splash.jpg");
	this.m_bgSprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_bgSprite.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
	this.m_bgSprite.setLocalZOrder (LAYER_BACKGROUND);
	this.addChild(this.m_bgSprite);
	
	
	this.m_numberOfAsset = 0;
	this.m_numberOfAssetLoaded = 0;

	for (var i=0; i<g_imageList.length; i++) {
		this.LoadImage (g_imageList[i]);
	}
	for (var i=0; i<g_fileList.length; i++) {
		this.LoadFile (g_fileList);
	}
	for (var i=0; i<g_audioList.length; i++) {
		this.LoadFile (g_audioList);
	}
}

g_gsLoaderMainLayer.LoadImage = function (path) {
	var instance = this;
	instance.m_numberOfAsset ++;
	cc.loader.loadImg(path, function(err){
		var tex = cc.textureCache.addImage(path);
        tex.handleLoadedTexture(true);
		
		instance.m_numberOfAssetLoaded++;
		if (instance.m_numberOfAsset == instance.m_numberOfAssetLoaded) {
			GlobalInit();
			PushMenu();
		}
	});
}

g_gsLoaderMainLayer.LoadFile = function (path) {
	var instance = this;
	instance.m_numberOfAsset ++;
	cc.loader.load(path, function(err){
		instance.m_numberOfAssetLoaded++;
		if (instance.m_numberOfAsset == instance.m_numberOfAssetLoaded) {
			GlobalInit();
			PushMenu();
		}
	});
}

var GSLoader = cc.Scene.extend({
	ctor:function () {
		this._super();
		this.addChild(g_gsLoaderMainLayer);
		g_gsLoaderMainLayer.Init();
	},
    onEnter:function () {
		this._super();
    }
});

