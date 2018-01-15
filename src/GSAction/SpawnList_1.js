g_spawnFunction[1].push(function (battle, layer) {
	var SPAWN_NUMBER = 2;
	var ENEMY_SIZE = 70;
	
	for (var i=0; i<SPAWN_NUMBER; i++) {
		var tempEnemy = new Enemy3(battle, layer);
		tempEnemy.Start(135, ENEMY_SIZE * 0.5, CANVAS_H + i * ENEMY_SIZE * 2 + ENEMY_SIZE);
		tempEnemy = new Enemy3(battle, layer);
		tempEnemy.Start(225, CANVAS_W - ENEMY_SIZE * 0.5, CANVAS_H + i * ENEMY_SIZE * 2);
		
	}
});


g_spawnFunction[1].push(function (battle, layer) {
	var ENEMY_SIZE = 100;
	var x = 0;
	var y = Math.random() * CANVAS_H * 0.25 + CANVAS_H * 0.75;
	var angle = 0;
	
	var side = Math.random();
	if (side > 0.5) {
		x = CANVAS_W + ENEMY_SIZE;
		angle = 250 - Math.random() * 25;
	}
	else {
		x = -ENEMY_SIZE;
		angle = 110 + Math.random() * 25;
	}
	var tempEnemy = new Enemy4(battle, layer);
	tempEnemy.Start(angle, x, y);
});

g_spawnFunction[1].push(function (battle, layer) {
	var ENEMY_SIZE = 50;
	var x = Math.random() * (CANVAS_W - ENEMY_SIZE * 2) + ENEMY_SIZE;
	var y = CANVAS_H + ENEMY_SIZE;
	var angle = 180;

	var tempEnemy = new Enemy5(battle, layer);
	tempEnemy.Start(angle, x, y);
});