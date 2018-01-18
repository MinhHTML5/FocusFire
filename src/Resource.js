var g_preloadList = [];
var g_spriteSheetList = [];
var g_imageList = [];
var g_fileList = [];
var g_audioList = [];







// =========================================================================================
// Preload
//g_imageList.push ("res/GSAction/Background/Hexagon.png");
// =========================================================================================





// =========================================================================================
// Sprite sheet
g_spriteSheetList.push (["res/GSAction/Sprites/Enemies.plist", "res/GSAction/Sprites/Enemies.png"]);
g_spriteSheetList.push (["res/GSAction/Sprites/EnemyBullets.plist", "res/GSAction/Sprites/EnemyBullets.png"]);
g_spriteSheetList.push (["res/GSAction/Sprites/Misc.plist", "res/GSAction/Sprites/Misc.png"]);
g_spriteSheetList.push (["res/GSAction/Sprites/Gift.plist", "res/GSAction/Sprites/Gift.png"]);





// =========================================================================================
// State
g_imageList.push ("res/GSAction/Background/Background.png");

g_imageList.push ("res/GSAction/UI/Logo.png");
g_imageList.push ("res/GSAction/UI/HPBar.png");
g_imageList.push ("res/GSAction/UI/HPBarContent.png");
// =========================================================================================





// =========================================================================================
// Fonts
g_fileList.push ("res/AirCruiser.ttf");

// Particles
//g_fileList.push ("res/GSAction/Turret/2-Cannon/Particle.plist");
//g_fileList.push ("res/GSAction/Turret/3-Missile/Particle.plist");
// =========================================================================================





var g_audioList = [];
g_audioList.push ("res/Sound/Music.mp3");
g_audioList.push ("res/Sound/Shoot.mp3");
g_audioList.push ("res/Sound/ImpactN.mp3");
g_audioList.push ("res/Sound/Explosion 1.mp3");
g_audioList.push ("res/Sound/Explosion 2.mp3");
g_audioList.push ("res/Sound/Explosion 3.mp3");
g_audioList.push ("res/Sound/Explosion 4.mp3");
g_audioList.push ("res/Sound/Laser.mp3");
g_audioList.push ("res/Sound/Shield.mp3");
g_audioList.push ("res/Sound/Upgrade.mp3");
g_audioList.push ("res/Sound/Start.mp3");





// =========================================================================================
// Sprite sheet load list
for (var i=0; i<g_spriteSheetList.length; i++) {
	g_fileList.push (g_spriteSheetList[i][0]);
	g_imageList.push (g_spriteSheetList[i][1]);
}

var GetFont = function (font) {
	if (cc.sys.isNative) {
        //return "res/Fonts/" + font + ".ttf";
        return font;
    } else {
        return font;
    }
}
// =========================================================================================
