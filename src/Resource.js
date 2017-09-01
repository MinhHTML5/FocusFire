var g_preloadList = [];
var g_imageList = [];
var g_fileList = [];
var g_audioList = [];







// =========================================================================================
// Preload
//g_imageList.push ("res/GSAction/Background/Hexagon.png");
// =========================================================================================






// =========================================================================================
// State
g_imageList.push ("res/GSAction/Background/Background.png");
g_imageList.push ("res/GSAction/Background/Hexagon.png");
g_imageList.push ("res/GSAction/Background/Cloud.png");

g_imageList.push ("res/GSAction/Battle/Player.png");
g_imageList.push ("res/GSAction/Battle/PlayerGlow.png");
g_imageList.push ("res/GSAction/Battle/PlayerEngineParticle.png");
g_imageList.push ("res/GSAction/Battle/PlayerGatling.png");

g_imageList.push ("res/GSAction/Battle/Explosion.png");
g_imageList.push ("res/GSAction/Battle/ExplosionParticle.png");

g_imageList.push ("res/GSAction/Battle/Enemies.png");

g_imageList.push ("res/GSAction/Battle/EnemyBullet1.png");
g_imageList.push ("res/GSAction/Battle/EnemyBullet2.png");
g_imageList.push ("res/GSAction/Battle/EnemyBullet3.png");

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
var GetFont = function (font) {
	if (cc.sys.isNative) {
        return "res/Fonts/" + font + ".ttf";
    } else {
        return font;
    }
}
// =========================================================================================