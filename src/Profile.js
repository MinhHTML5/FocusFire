var g_credit = 0;
var g_powerLevel = 0;
var g_hpLevel = 0;
var g_shieldLevel = 0;
var g_botLevel = 0;
var g_bestScore = 0;

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
	cc.sys.localStorage.setItem("credit", g_credit);
	cc.sys.localStorage.setItem("power", g_powerLevel);
	cc.sys.localStorage.setItem("hp", g_hpLevel);
	cc.sys.localStorage.setItem("shield", g_shieldLevel);
	cc.sys.localStorage.setItem("bot", g_botLevel);
	cc.sys.localStorage.setItem("best", g_bestScore);
}

function LoadProfile() {
	g_credit = cc.sys.localStorage.getItem("credit");
	g_powerLevel = cc.sys.localStorage.getItem("power");
	g_hpLevel = cc.sys.localStorage.getItem("hp");
	g_shieldLevel = cc.sys.localStorage.getItem("shield");
	g_botLevel = cc.sys.localStorage.getItem("bot");
	g_bestScore = cc.sys.localStorage.getItem("best");

	g_credit = (g_credit == null) ? 0 : parseInt(g_credit);
	g_powerLevel = (g_powerLevel == null) ? 0 : parseInt(g_powerLevel);
	g_hpLevel = (g_hpLevel == null) ? 0 : parseInt(g_hpLevel);
	g_shieldLevel = (g_shieldLevel == null) ? 0 : parseInt(g_shieldLevel);
	g_botLevel = (g_botLevel == null) ? 0 : parseInt(g_botLevel);
	g_bestScore = (g_bestScore == null) ? 0 : parseInt(g_bestScore);

	SaveProfile();
}