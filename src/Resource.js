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












// =========================================================================================
// Sprite sheet load list
for (var i=0; i<g_spriteSheetList.length; i++) {
	g_fileList.push (g_spriteSheetList[i][0]);
	g_imageList.push (g_spriteSheetList[i][1]);
}

var GetFont = function (font) {
	if (cc.sys.isNative) {
        return "res/Fonts/" + font + ".ttf";
    } else {
        return font;
    }
}
// =========================================================================================