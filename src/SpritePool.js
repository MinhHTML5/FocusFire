function SpritePool() {
	var spritePool = new Array();
	
	this.m_spriteNumber = 0;

	this.PutSpriteIntoPool = function (sprite) {
		sprite.setVisible (false);
		spritePool.push (sprite);
	}

	this.GetSpriteFromPool = function (path, layer) {
		var tempSprite;
		// Scan for same url sprite first
		for (var i=0; i<spritePool.length; i++) {
			if (spritePool[i].m_layer == layer && spritePool[i].getTexture().url == path) {
				tempSprite = spritePool[i];
				spritePool.splice (i, 1);
				break;
			}
		}
		// Rescan if sprite not found, this time, anything will do.
		if (tempSprite == null) {
			for (var i=0; i<spritePool.length; i++) {
				if (spritePool[i].m_layer == layer) {
					tempSprite = spritePool[i];
					tempSprite.setTexture(path);
					spritePool.splice (i, 1);
					break;
				}
			}
		}
		// Still no sprite found, create a new one then...
		if (tempSprite == null) {
			tempSprite = cc.Sprite.create(path);
			tempSprite.retain();
			tempSprite.m_layer = layer;
			layer.addChild(tempSprite);
			
			this.m_spriteNumber ++;
		}
		// Do some reset
		tempSprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA));
		tempSprite.setOpacity (255);
		tempSprite.setRotation (0);
		tempSprite.setVisible (true);
		tempSprite.setScale(1, 1);
		tempSprite.setScaleX(1);
		tempSprite.setScaleY(1);
		tempSprite.setColor (cc.color(255, 255, 255));
				
		return tempSprite;
	}
}

var g_spritePool = new SpritePool();