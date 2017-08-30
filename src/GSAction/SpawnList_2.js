g_spawnFunction[2].push(function (battle, layer) {
	var ENEMY_SIZE = 100;
	var NUMBER_OF_STOP = 7;
	
	var x = 0;
	var y = CANVAS_H - ENEMY_SIZE;
	var targetX = [];
	var targetY = [];
	
	
	var side = Math.random();
	if (side > 0.5) {
		x = CANVAS_W + ENEMY_SIZE;
		
		for (var i=0; i<NUMBER_OF_STOP; i++) {
			if (i % 2 == 0) {
				targetX[i] = ENEMY_SIZE * 0.5;
			}
			else {
				targetX[i] = CANVAS_W - ENEMY_SIZE * 0.5;
			}
			targetY[i] = y;
		}
	}
	else {
		x = -ENEMY_SIZE;
		
		for (var i=0; i<NUMBER_OF_STOP; i++) {
			if (i % 2 == 1) {
				targetX[i] = ENEMY_SIZE * 0.5;
			}
			else {
				targetX[i] = CANVAS_W - ENEMY_SIZE * 0.5;
			}
			targetY[i] = y;
		}
	}
	
	if (targetX[targetX.length] == ENEMY_SIZE * 0.5) {
		targetX.push(CANVAS_W + ENEMY_SIZE);
	}
	else {
		targetX.push(-ENEMY_SIZE);
	}
	targetY.push(y);
	
	var tempEnemy = new Enemy10(battle, layer);
	tempEnemy.Start (180, x, y, targetX, targetY);
});