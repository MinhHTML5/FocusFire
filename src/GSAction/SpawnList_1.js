g_spawnFunction[1].push(function (battle, layer) {
	var ENEMY_SIZE = 50;
	var x = Math.random() * (CANVAS_W - ENEMY_SIZE * 2) + ENEMY_SIZE;
	var y = CANVAS_H + ENEMY_SIZE;
	var angle = 180;

	var tempEnemy = new Enemy5(battle, layer);
	tempEnemy.Start(angle, x, y);
});


g_spawnFunction[1].push(function (battle, layer) {
	var ANCHOR_NUMBER = 3;
	var ENEMY_SIZE = 100;
	var targetX = [];
	var targetY = [];
	var x = 0;
	var y = 0;
	
	// Start point
	var side = Math.random();
	if (side < 0.5) {
		x = -ENEMY_SIZE;
	}
	else {
		x = CANVAS_W + ENEMY_SIZE;
	}
	y = CANVAS_H * 0.8;
	
	// Patrol waypoint
	for (var i=0; i<ANCHOR_NUMBER; i++) {
		var distance = 0;
		var newX = 0;
		var newY = 0;
		while (distance < ENEMY_SIZE) {
			newX = Math.random() * (CANVAS_W - ENEMY_SIZE * 2) + ENEMY_SIZE;
			newY = Math.random() * CANVAS_H * 0.3 + CANVAS_H * 0.7;
			
			if (i == 0) {
				distance = DistanceBetweenTwoPoint(x, y, newX, newY);
			}
			else {
				distance = DistanceBetweenTwoPoint(targetX[i-1], targetY[i-1], newX, newY);
			}
		}
		targetX.push(newX);
		targetY.push(newY);
	}
	
	// End point
	if (side < 0.5) {
		targetX.push(CANVAS_W + ENEMY_SIZE);
	}
	else {
		targetX.push(-ENEMY_SIZE);
	}
	targetY.push(Math.random() * CANVAS_H * 0.3 + CANVAS_H * 0.7);
	
	// Spawn
	var angle = AngleBetweenTwoPoint (x, y, targetX[0], targetY[0]);
	var tempEnemy = new Enemy6(battle, layer);
	tempEnemy.Start (angle, x, y, targetX, targetY);
});


g_spawnFunction[1].push(function (battle, layer) {
	var ENEMY_SIZE = 100;
	var x = Math.random() * (CANVAS_W - ENEMY_SIZE * 2) + ENEMY_SIZE;
	var y = CANVAS_H + ENEMY_SIZE;
	var angle = 180;

	var tempEnemy = new Enemy7(battle, layer);
	tempEnemy.Start(angle, x, y);
});


g_spawnFunction[1].push(function (battle, layer) {
	var SPAWN_NUMBER = 4;
	var ENEMY_SIZE = 40;
	
	for (var i=0; i<SPAWN_NUMBER; i++) {
		var x =  Math.random() * (CANVAS_W - ENEMY_SIZE * 2) + ENEMY_SIZE;
		var y = CANVAS_H + ENEMY_SIZE;
		var tempEnemy = new Enemy8(battle, layer);
		tempEnemy.Start(180, x, y);
	}
});


g_spawnFunction[1].push(function (battle, layer) {
	var ENEMY_SIZE = 100;
	var x = Math.random() * (CANVAS_W - ENEMY_SIZE * 2) + ENEMY_SIZE;
	var y = CANVAS_H + ENEMY_SIZE;
	var angle = 180;

	var tempEnemy = new Enemy9(battle, layer);
	tempEnemy.Start(angle, x, y);
});