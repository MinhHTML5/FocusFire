var g_credit = 0;
var g_powerLevel = 0;
var g_hpLevel = 0;
var g_shieldLevel = 0;
var g_botLevel = 100;

function GetNextPowerUpgradePrice() {
	return 10 + g_powerLevel * 13;
}
function GetPlayerCoolDown() {
	// Range from 10 to 160
	var bulletPerSec = 10 + g_powerLevel * 1.5;
	if (bulletPerSec > 160) bulletPerSec = 160;
	return (1 / bulletPerSec);
}
function GetPlayerRecoil() {
	// Range from 0 to 8
	var recoil = g_powerLevel * 0.08;
	if (recoil > 8) recoil = 8;
	return recoil;
}
function GetPlayerDamage() {
	return 1 + g_powerLevel * 0.1;
}



function GetNextHPUpgradePrice() {
	return 10 + g_hpLevel * 7;
}
function GetPlayerMaxHP() {
	return 10 + g_hpLevel * 10;
}



function GetNextShieldUpgradePrice() {
	return 10 + g_shieldLevel * 3;
}
function GetPlayerShieldDuration() {
	return 2 + g_shieldLevel * 0.2;
}



function GetNextRobotUpgradePrice() {
	return 100 + g_botLevel * 50;
}
function GetPlayerRobotNumber() {
	var robotNumber = 0;
	if (g_botLevel == 0) {
		return 0;
	}
	else {
		robotNumber = 1 + (g_botLevel / 10) >> 0;
		if (robotNumber > 5) robotNumber = 5;
	}
	return robotNumber;
}
function GetPlayerRobotDamage() {
	return 0.2 + g_botLevel * 0.1;
}



function SaveProfile() {
	
}

function LoadProfile() {
	
}