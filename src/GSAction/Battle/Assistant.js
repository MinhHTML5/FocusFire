function Assistant (player, layer) {
	this.m_active = true;
	this.m_size = PLAYER_SIZE;
	
	this.m_sprite = g_spritePool.GetSpriteFromPool(layer, "Player.png", true);
	this.m_sprite.setAnchorPoint(cc.p(0.5, 0.5));
	this.m_sprite.setLocalZOrder (LAYER_PLAYER);
	this.m_sprite.setOpacity (170);
}