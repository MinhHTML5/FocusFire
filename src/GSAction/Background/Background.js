var NUMBER_OF_OBJECT_PER_TYPE= 50;
function Background(layer) {
	this.m_sprite = g_spritePool.GetSpriteFromPool("res/GSAction/Background/Background.png", layer);
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_BACKGROUND);
	this.m_sprite.setPosition (cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
	
	var m_objects = new Array();
	for (var i=0; i<NUMBER_OF_OBJECT_PER_TYPE; i++) {
		var tempObject = new BGObject(layer, BACKGROUND_OBJECT_HEXAGON);
		m_objects.push(tempObject);
		
		tempObject = new BGObject(layer, BACKGROUND_OBJECT_CLOUD);
		m_objects.push(tempObject);
	}
	
	this.Update = function(deltaTime) {
		for (var i=0; i<m_objects.length; i++) {
			m_objects[i].Update(deltaTime);
		}
	}
	
	this.UpdateVisual = function () {
		for (var i=0; i<m_objects.length; i++) {
			m_objects[i].UpdateVisual();
		}
		this.m_sprite.setColor (g_colorTheme);
	}
}