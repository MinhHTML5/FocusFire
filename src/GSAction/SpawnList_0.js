var g_spawnFunction = [];
for (var i=0; i<DIFFICULTY_NUMBER; i++) {
	g_spawnFunction[i] = new Array();
}

g_spawnFunction[0].push(function (battle, layer) {
	var SPAWN_DISTANCE = 300;
	var SPAWN_NUMBER = 10;
	
	var targetX = [];
	var targetY = [];
	var numberOfStopY = ((CANVAS_H / SPAWN_DISTANCE) >> 0) + 2;
	var randomizeY = -Math.random() * SPAWN_DISTANCE;
	for (var i=0; i<numberOfStopY; i++) {
		targetY[i] = CANVAS_H - i * SPAWN_DISTANCE + randomizeY;
	}
	
	var side = Math.random();
	if (side > 0.5) {
		targetX[0] = CANVAS_W + ENEMY_1_SIZE;
		for (var i=1; i<numberOfStopY; i++) {
			if (i % 2 == 1) {
				targetX[i] = ENEMY_1_SIZE;
			}
			else {
				targetX[i] = CANVAS_W - ENEMY_1_SIZE;
			}
		}
	}
	else {
		targetX[0] = -ENEMY_1_SIZE;
		for (var i=1; i<numberOfStopY; i++) {
			if (i % 2 == 0) {
				targetX[i] = ENEMY_1_SIZE;
			}
			else {
				targetX[i] = CANVAS_W - ENEMY_1_SIZE;
			}
		}
	}
	
	var angle = AngleBetweenTwoPoint (targetX[0], targetY[0], targetX[1], targetY[1]);
	
	for (var i=0; i<SPAWN_NUMBER; i++) {
		var tempEnemy = new Enemy1(battle, layer);
		var x = targetX[0] - Math.sin(angle * DEG_TO_RAD) * ENEMY_1_SIZE * i;
		var y = targetY[0] - Math.cos(angle * DEG_TO_RAD) * ENEMY_1_SIZE * i;
		
		tempEnemy.Start (angle, x, y, targetX, targetY);
	}
});

g_spawnFunction[0].push(function (battle, layer) {
	var SPAWN_NUMBER = 10;
	
	var startX = Math.random() * (CANVAS_W - (SPAWN_NUMBER - 1) * ENEMY_1_SIZE);
	
	for (var i=0; i<SPAWN_NUMBER; i++) {
		var targetX = [];
		var targetY = [];
		targetX[0] = startX + i * ENEMY_1_SIZE;
		targetY[0] = CANVAS_H + ENEMY_1_SIZE;
		targetX[1] = startX + i * ENEMY_1_SIZE;
		targetY[1] = -ENEMY_1_SIZE;
		
		var angle = 180;
		var tempEnemy = new Enemy1(battle, layer);
		var x = targetX[0];
		var y = targetY[0] + ENEMY_1_SIZE;
		
		tempEnemy.Start (angle, x, y, targetX, targetY);
	}
});