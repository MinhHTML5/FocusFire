function SpritePool() {
	var spritePool = new Array();

	this.PutSpriteIntoPool = function (sprite) {
		spritePool.push (sprite);
	}

	
	this.GetSpriteFromPool = function (path) {
		var tempSprite;
		for (var i=0; i<spritePool.length; i++) {
			if (spritePool[i].getTexture().url == path) {
				tempSprite = spritePool[i];
				tempSprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA));
				tempSprite.setOpacity (255);
				tempSprite.setRotation (0);
				tempSprite.setVisible(true);
				
				spritePool.splice (i, 1);
				break;
			}
		}
		
		if (tempSprite == null) {
			tempSprite = cc.Sprite.create(path);
			tempSprite.retain();
		}
		
		return tempSprite;
	}
}

var g_spritePool = new SpritePool();