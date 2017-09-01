function SpritePool() {
	var spritePool = new Array();
	
	this.m_spriteOnScreen = 0;
	this.m_spriteNumber = 0;

	this.PutSpriteIntoPool = function (sprite) {
		sprite.setVisible (false);
		spritePool.push (sprite);
		this.m_spriteOnScreen --;
	}

	this.GetSpriteFromPool = function (path, layer) {
		var tempSprite;
		for (var i=0; i<spritePool.length; i++) {
			tempSprite = spritePool[i];
			if (tempSprite.m_layer == layer) {
				if (tempSprite.getTexture().url != path) {
					tempSprite.setTexture(path);
				}
				tempSprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA));
				tempSprite.setOpacity (255);
				tempSprite.setRotation (0);
				tempSprite.setVisible (true);
				tempSprite.setScale(1, 1);
				tempSprite.setScaleX(1);
				tempSprite.setScaleY(1);
				tempSprite.setColor (cc.color(255, 255, 255));
				
				spritePool.splice (i, 1);
				break;
			}
		}
		
		if (tempSprite == null) {
			tempSprite = cc.Sprite.create(path);
			tempSprite.retain();
			tempSprite.m_layer = layer;
			layer.addChild(tempSprite);
			
			this.m_spriteNumber ++;
		}
		this.m_spriteOnScreen ++;
		
		return tempSprite;
	}
}

var g_spritePool = new SpritePool();