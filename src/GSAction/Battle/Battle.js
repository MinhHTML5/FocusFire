function Battle(layer) {
	this.m_player = new Player(this, layer);

	this.m_projectiles = [];



	
	this.Update = function(deltaTime) {
		this.m_player.Update (deltaTime);
		
		for (var i=this.m_projectiles.length-1; i>=0; i--) {
			this.m_projectiles[i].Update(deltaTime);
			if (this.m_projectiles[i].m_active == false) {
				this.m_projectiles.splice(i, 1);
			}
		}
	}
	
	this.UpdateVisual = function() {
		this.m_player.UpdateVisual ();
	
		for (var i=this.m_projectiles.length-1; i>=0; i--) {
			this.m_projectiles[i].UpdateVisual();
		}
	}
	

	
	this.SpawnProjectile = function() {
		
	}
	
	
	this.TouchDown = function (touches) {
		var x = touches[0].getLocation().x;
		var y = touches[0].getLocation().y;
		this.m_player.Touch (true, x, y);
	}
	this.TouchMove = function (touches) {
		var x = touches[0].getLocation().x;
		var y = touches[0].getLocation().y;
		this.m_player.Touch (true, x, y);
	}
	this.TouchUp = function (touches) {
		this.m_player.Touch (false, 0, 0);
	}
}