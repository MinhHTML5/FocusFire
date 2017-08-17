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

g_imageList.push ("res/GSAction/Battle/Orbit.png");
g_imageList.push ("res/GSAction/Battle/Player.png");
g_imageList.push ("res/GSAction/Battle/PlayerGlow.png");
g_imageList.push ("res/GSAction/Battle/PlayerGatling.png");
// =========================================================================================





// =========================================================================================
// Fonts
//g_fileList.push ("res/Fonts/Nasalization.ttf");

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