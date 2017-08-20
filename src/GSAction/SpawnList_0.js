var g_spawnFunction = [];
for (var i=0; i<DIFFICULTY_NUMBER; i++) {
	g_spawnFunction[i] = new Array();
}

g_spawnFunction[0].push(function (battle, layer) {
	var SPAWN_DISTANCE = 300;
	var SPAWN_NUMBER = 10;
	var ENEMY_SIZE = 60;
	
	var targetX = [];
	var targetY = [];
	var numberOfStopY = ((CANVAS_H / SPAWN_DISTANCE) >> 0) + 2;
	var randomizeY = -Math.random() * SPAWN_DISTANCE;
	for (var i=0; i<numberOfStopY; i++) {
		targetY[i] = CANVAS_H - i * SPAWN_DISTANCE + randomizeY;
	}
	
	var side = Math.random();
	if (side > 0.5) {
		targetX[0] = CANVAS_W + ENEMY_SIZE;
		for (var i=1; i<numberOfStopY; i++) {
			if (i % 2 == 1) {
				targetX[i] = ENEMY_SIZE;
			}
			else {
				targetX[i] = CANVAS_W - ENEMY_SIZE;
			}
		}
	}
	else {
		targetX[0] = -ENEMY_SIZE;
		for (var i=1; i<numberOfStopY; i++) {
			if (i % 2 == 0) {
				targetX[i] = ENEMY_SIZE;
			}
			else {
				targetX[i] = CANVAS_W - ENEMY_SIZE;
			}
		}
	}
	
	var angle = AngleBetweenTwoPoint (targetX[0], targetY[0], targetX[1], targetY[1]);
	
	for (var i=0; i<SPAWN_NUMBER; i++) {
		var tempEnemy = new Enemy1(battle, layer);
		var x = targetX[0] - Math.sin(angle * DEG_TO_RAD) * ENEMY_SIZE * i;
		var y = targetY[0] - Math.cos(angle * DEG_TO_RAD) * ENEMY_SIZE * i;
		
		tempEnemy.Start (angle, x, y, targetX, targetY);
	}
});

g_spawnFunction[0].push(function (battle, layer) {
	var SPAWN_NUMBER = 10;
	var ENEMY_SIZE = 60;
	
	var startX = Math.random() * (CANVAS_W - (SPAWN_NUMBER - 1) * ENEMY_SIZE);
	
	for (var i=0; i<SPAWN_NUMBER; i++) {
		var targetX = [];
		var targetY = [];
		targetX[0] = startX + i * ENEMY_SIZE;
		targetY[0] = CANVAS_H + ENEMY_SIZE;
		targetX[1] = startX + i * ENEMY_SIZE;
		targetY[1] = -ENEMY_SIZE;
		
		var angle = 180;
		var tempEnemy = new Enemy1(battle, layer);
		var x = targetX[0];
		var y = targetY[0] + ENEMY_SIZE;
		
		tempEnemy.Start (angle, x, y, targetX, targetY);
	}
});

g_spawnFunction[0].push(function (battle, layer) {
	var SPAWN_NUMBER = 4;
	var ENEMY_SIZE = 70;
	
	for (var i=0; i<SPAWN_NUMBER; i++) {
		var targetX = Math.random() * (CANVAS_W - ENEMY_SIZE) + ENEMY_SIZE * 0.5;
		var targetY = CANVAS_H - ENEMY_SIZE * 4;
		
		var angle = 180;
		var tempEnemy = new Enemy2(battle, layer);
		var x = Math.random() * (CANVAS_W - ENEMY_SIZE) + ENEMY_SIZE * 0.5;
		var y = CANVAS_H + (Math.random() * 3 + 1) * ENEMY_SIZE;
		
		tempEnemy.Start (angle, x, y, targetX, targetY);
	}
});