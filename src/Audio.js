var SOUND_DELAY = 0.05;

function Audio() {
	this.soundList = [];
	this.soundDelay = [];
	
	this.PlaySound = function(string) {
		var index = this.soundList.indexOf (string);
		if (index == -1) {
			this.soundList.push(string);
			this.soundDelay.push(SOUND_DELAY);
			cc.audioEngine.playEffect(string, false);
		}
		else {
			if (this.soundDelay[index] <= 0) {
				cc.audioEngine.playEffect(string, false);
				this.soundDelay[index] = SOUND_DELAY;
			}
		}
	}
	
	this.Update = function(deltaTime) {
		for (var i=0; i<this.soundDelay.length; i++) {
			if (this.soundDelay[i] > 0) {
				this.soundDelay[i] -= deltaTime;
			}
		}
	}
}

var myAudio = new Audio();