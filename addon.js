function checkNightStuff() {
   if (geofs.isNight == 1 && geofs.api.renderingSettings.advancedAtmosphere == 0 && geofs.camera.currentModeName !== "cockpit") {
geofs.api.setImageryBrightness(75);
   };
   if (geofs.isNight == 1 && geofs.api.renderingSettings.advancedAtmosphere == 0 && geofs.camera.currentModeName == "cockpit") {
geofs.api.setImageryBrightness(50);
   };
   if (geofs.isNight == 0 && weather.definition.cloudCover >= 80 && (geofs.preferences.graphics.volumetricClouds == false || geofs.api.renderingSettings.advancedAtmosphere == 0)) {
geofs.api.viewer.scene.light.intensity = weather.definition.cloudCover / 80
   };
   if (geofs.camera.currentModeName == "cockpit" && geofs.isNight == 1) {
geofs.api.viewer.scene.light.intensity = 0.5;
geofs.api.viewer.scene.light.color = {red: 0.8, green: 0.63, blue: 0.52, alpha: 1};
	} else if (geofs.isNight == 1) {
geofs.api.viewer.scene.light.intensity = 0.1
	}
};checkMarbleInterval = setInterval(function(){checkNightStuff()},10)
