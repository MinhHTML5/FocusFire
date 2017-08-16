function Battle(layer) {
	this.m_orbitSprite = g_spritePool.GetSpriteFromPool("res/GSAction/Battle/Orbit.png");
	this.m_orbitSprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_orbitSprite.setLocalZOrder (LAYER_BATTLE);
	this.m_orbitSprite.setPosition (cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
	this.m_orbitSprite.setOpacity (128);
	layer.addChild(this.m_orbitSprite);


	
	this.m_player = new Player(layer);




	
	this.Update = function(deltaTime) {
		this.m_player.Update (deltaTime);
	}
	

	
	
	
	this.TouchDown = function (touches) {
		var x = touches[0].getLocation().x;
		var y = touches[0].getLocation().y;
		var angle = AngleBetweenTwoPoint (x, y, CANVAS_W * 0.5, CANVAS_H * 0.5);
		this.m_player.Touch (true, angle);
	}
	this.TouchMove = function (touches) {
		var x = touches[0].getLocation().x;
		var y = touches[0].getLocation().y;
		var angle = AngleBetweenTwoPoint (x, y, CANVAS_W * 0.5, CANVAS_H * 0.5);
		this.m_player.Touch (true, angle);
	}
	this.TouchUp = function (touches) {
		this.m_player.Touch (false, 0);
	}
}