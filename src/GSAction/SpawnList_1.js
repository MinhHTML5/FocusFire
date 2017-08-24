g_spawnFunction[1].push(function (battle, layer) {
	var ENEMY_SIZE = 50;
	var x = Math.random() * (CANVAS_W - ENEMY_SIZE * 2) + ENEMY_SIZE;
	var y = CANVAS_H + ENEMY_SIZE;
	var angle = 180;

	var tempEnemy = new Enemy5(battle, layer);
	tempEnemy.Start(angle, x, y);
});