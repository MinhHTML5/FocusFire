g_spawnFunction[3].push(function (battle, layer) {
	var SPAWN_NUMBER = 4;
	var ENEMY_SIZE = 40;
	
	for (var i=0; i<SPAWN_NUMBER; i++) {
		var x =  Math.random() * (CANVAS_W - ENEMY_SIZE * 2) + ENEMY_SIZE;
		var y = CANVAS_H + ENEMY_SIZE;
		var tempEnemy = new Enemy8(battle, layer);
		tempEnemy.Start(180, x, y);
	}
});


g_spawnFunction[3].push(function (battle, layer) {
	var ENEMY_SIZE = 100;
	var x = Math.random() * (CANVAS_W - ENEMY_SIZE * 2) + ENEMY_SIZE;
	var y = CANVAS_H + ENEMY_SIZE;
	var angle = 180;

	var tempEnemy = new Enemy9(battle, layer);
	tempEnemy.Start(angle, x, y);
});