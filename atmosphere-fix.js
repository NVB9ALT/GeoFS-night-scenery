//this doesn't work?
var cloudsBoosted = new Boolean(0)
setInterval(function(){
   if (weather.definition.precipitationAmount >= 70) {
if (cloudsBoosted == 0) {
geofs.fx.atmosphere.cloudsPostProcessStage.uniforms.cloudTop = 10000
}
cloudsBoosted = 1
   } else {
cloudsBoosted = 0
	}
},1000)
geofs = geofs || {};
geofs["atmosphereCommon.glsl"] =
    "" +
    "precision highp float;\n" +
    "\n" +
    "uniform float planetRadius;\n" +
    "#ifdef VOLUMETRIC_CLOUDS\n" +
    "const float windSpeedRatio = 0.0002;\n" +
    "uniform float cloudCover;\n" +
    "uniform float cloudBase;\n" +
    "uniform float cloudTop;\n" +
    "uniform vec3 windVector;\n" +
    "#ifdef REALTIME_CLOUDS\n" +
    "uniform sampler2D coverageTexture;\n" +
    "#endif\n" +
    "#endif\n" +
    "\n" +
    "const float PI = 3.14159265359;\n" +
    "const float TWO_PI = PI * 2.0;\n" +
    "const float FOUR_PI = PI * 4.0;\n" +
    "\n" +
    "/*\n" +
    "* Configuration\n" +
    "*/\n" +
    "#ifdef QUALITY_7\n" +
    "\n" +
    "#define PRIMARY_STEPS 16\n" +
    "#define LIGHT_STEPS 4\n" +
    "\n" +
    "// This is only accessible from advanced settings\n" +
    "#define CLOUDS_MAX_LOD 1\n" +
    "#define CLOUDS_MARCH_STEP 500.0\n" +
    "#define CLOUDS_DENS_MARCH_STEP 100.0\n" +
    "#define MAXIMUM_CLOUDS_STEPS 300\n" +
    "#define DISTANCE_QUALITY_RATIO 0.00003\n" +
    "#define CLOUD_SHADOWS\n" +
    "\n" +
    "#elif defined QUALITY_6\n" +
    "\n" +
    "#define PRIMARY_STEPS 12\n" +
    "#define LIGHT_STEPS 4\n" +
    "\n" +
    "#define CLOUDS_MAX_LOD 1\n" +
    "#define CLOUDS_MARCH_STEP 500.0\n" +
    "#define CLOUDS_DENS_MARCH_STEP 100.0\n" +
    "#define MAXIMUM_CLOUDS_STEPS 200\n" +
    "#define DISTANCE_QUALITY_RATIO 0.00004\n" +
    "#define CLOUD_SHADOWS\n" +
    "\n" +
    "#elif defined QUALITY_5\n" +
    "\n" +
    "//#define PRIMARY_STEPS 12\n" +
    "//#define LIGHT_STEPS 4\n" +
    "#define PRIMARY_STEPS 9\n" +
    "#define LIGHT_STEPS 3\n" +
    "\n" +
    "#define CLOUDS_MAX_LOD 1\n" +
    "#define CLOUDS_MARCH_STEP 750.0\n" +
    "#define CLOUDS_DENS_MARCH_STEP 150.0\n" +
    "#define MAXIMUM_CLOUDS_STEPS 150\n" +
    "#define DISTANCE_QUALITY_RATIO 0.00005\n" +
    "#define CLOUD_SHADOWS\n" +
    "\n" +
    "#elif defined QUALITY_4\n" +
    "\n" +
    "#define PRIMARY_STEPS 9\n" +
    "#define LIGHT_STEPS 3\n" +
    "\n" +
    "#define CLOUDS_MAX_LOD 1\n" +
    "#define CLOUDS_MARCH_STEP 750.0\n" +
    "#define CLOUDS_DENS_MARCH_STEP 150.0\n" +
    "#define MAXIMUM_CLOUDS_STEPS 100\n" +
    "#define DISTANCE_QUALITY_RATIO 0.00007\n" +
    "#define CLOUD_SHADOWS\n" +
    "\n" +
    "#elif defined QUALITY_3\n" +
    "\n" +
    "#define PRIMARY_STEPS 6\n" +
    "#define LIGHT_STEPS 2\n" +
    "\n" +
    "#define CLOUDS_MAX_LOD 0\n" +
    "#define CLOUDS_MARCH_STEP 750.0\n" +
    "#define CLOUDS_DENS_MARCH_STEP 150.0\n" +
    "#define MAXIMUM_CLOUDS_STEPS 75\n" +
    "#define DISTANCE_QUALITY_RATIO 0.0001\n" +
    "#define CLOUD_SHADOWS\n" +
    "\n" +
    "#elif defined QUALITY_2\n" +
    "\n" +
    "#define PRIMARY_STEPS 6\n" +
    "#define LIGHT_STEPS 1\n" +
    "\n" +
    "#define CLOUDS_MAX_LOD 0\n" +
    "#define CLOUDS_MARCH_STEP 1000.0\n" +
    "#define CLOUDS_DENS_MARCH_STEP 200.0\n" +
    "#define MAXIMUM_CLOUDS_STEPS 50\n" +
    "#define DISTANCE_QUALITY_RATIO 0.0002\n" +
    "#define CLOUD_SHADOWS\n" +
    "\n" +
    "#elif defined QUALITY_1\n" +
    "\n" +
    "#define PRIMARY_STEPS 3\n" +
    "#define LIGHT_STEPS 1\n" +
    "\n" +
    "#define CLOUDS_MAX_LOD 0\n" +
    "#define CLOUDS_MARCH_STEP 1000.0\n" +
    "#define CLOUDS_DENS_MARCH_STEP 200.0\n" +
    "#define MAXIMUM_CLOUDS_STEPS 20\n" +
    "#define DISTANCE_QUALITY_RATIO 0.0004\n" +
    "\n" +
    "#elif defined QUALITY_0\n" +
    "\n" +
    "#define PRIMARY_STEPS 3\n" +
    "#define LIGHT_STEPS 1\n" +
    "\n" +
    "#define CLOUDS_MAX_LOD 0\n" +
    "#define CLOUDS_MARCH_STEP 1000.0\n" +
    "#define CLOUDS_DENS_MARCH_STEP 200.0\n" +
    "#define MAXIMUM_CLOUDS_STEPS 10\n" +
    "#define DISTANCE_QUALITY_RATIO 0.0004\n" +
    "\n" +
    "#else //DEFAULT\n" +
    "\n" +
    "#define PRIMARY_STEPS 9\n" +
    "#define LIGHT_STEPS 2\n" +
    "\n" +
    "#define CLOUDS_MAX_LOD 1\n" +
    "#define CLOUDS_MARCH_STEP 750.0\n" +
    "#define CLOUDS_DENS_MARCH_STEP 150.0\n" +
    "#define MAXIMUM_CLOUDS_STEPS 40\n" +
    "#define DISTANCE_QUALITY_RATIO 0.0002\n" +
    "#define CLOUD_SHADOWS\n" +
    "\n" +
    "#endif\n" +
    "\n" +
    "#define CLOUDS_MAX_VIEWING_DISTANCE 250000.0\n" +
    "\n" +
    "/*\n" +
    "* Utilities\n" +
    "*/\n" +
    "vec2 raySphereIntersect(vec3 r0, vec3 rd, float sr) {\n" +
    "float a = dot(rd, rd);\n" +
    "float b = 2.0 * dot(rd, r0);\n" +
    "float c = dot(r0, r0) - (sr * sr);\n" +
    "float d = (b * b) - 4.0 * a * c;\n" +
    "\n" +
    "// stop early if there is no intersect\n" +
    "if (d < 0.0) return vec2(-1.0, -1.0);\n" +
    "\n" +
    "// calculate the ray length\n" +
    "float squaredD = sqrt(d);\n" +
    "return vec2(\n" +
    "(-b - squaredD) / (2.0 * a),\n" +
    "(-b + squaredD) / (2.0 * a)\n" +
    ");\n" +
    "}\n" +
    "\n" +
    "float reMap (float value, float old_low, float old_high, float new_low, float new_high ) {\n" +
    "return new_low + (value - old_low) * (new_high - new_low) / (old_high - old_low);\n" +
    "}\n" +
    "\n" +
    "float saturate (float value) {\n" +
    "return clamp(value, 0.0, 1.0);\n" +
    "}\n" +
    "\n" +
    "/*\n" +
    "* Scattering functions\n" +
    "*/\n" +
    "float isotropic() {\n" +
    "return 0.07957747154594767; //1.0 / (4.0 * PI);\n" +
    "}\n" +
    "\n" +
    "float rayleigh(float costh) {\n" +
    "return (3.0 / (16.0 * PI)) * (1.0 + pow(costh, 2.0));\n" +
    "}\n" +
    "\n" +
    "float HenyeyGreenstein(float g, float costh)\n" +
    "{\n" +
    "return (1.0 - g * g) / (FOUR_PI * pow(1.0 + g * g - 2.0 * g * costh, 3.0 / 2.0));\n" +
    "}\n" +
    "\n" +
    "float Schlick(float k, float costh) {\n" +
    "return (1.0 - k * k) / (FOUR_PI * pow(1.0 - k * costh, 2.0));\n" +
    "}\n" +
    "\n" +
    "/*\n" +
    "* Atmosphere scattering\n" +
    "*/\n" +
    "// Atmosphere by Dimas Leenman, Shared under the MIT license\n" +
    "//https://github.com/Dimev/Realistic-Atmosphere-Godot-and-UE4/blob/master/godot/shader/atmosphere.shader\n" +
	 "//this can be set between 100 - 150 at cost of realism at low sun time\n" + 
    "vec3 light_intensity = vec3(125.0);//vec3(100.0); // how bright the light is, affects the brightness of the atmosphere\n" +
    "//float planetRadius = 6361e3; // the radius of the planet\n" +
    "//float atmo_radius = 6471e3; // the radius of the atmosphere\n" +
	 "//setting atmosphere radius to 70 works very well\n" +
    "float atmo_radius = planetRadius + 70e3;\n" +
    "float realPlanetRadius = planetRadius + 10000.0;\n" +
    "float atmo_radius_squared = atmo_radius * atmo_radius; // the radius of the atmosphere\n" +
    "vec3 beta_ray = vec3(5.5e-6, 13.0e-6, 22.4e-6);//vec3(5.5e-6, 13.0e-6, 22.4e-6); // the amount rayleigh scattering scatters the colors (for earth: causes the blue atmosphere)\n" +
    "vec3 beta_mie = vec3(21e-6); // vec3(21e-6);// the amount mie scattering scatters colors\n" +
    "vec3 beta_ambient = vec3(0.0); // the amount of scattering that always occurs, can help make the back side of the atmosphere a bit brighter\n" +
    "float g = 0.9; // the direction mie scatters the light in (like a cone). closer to -1 means more towards a single direction\n" +
    "float height_ray = 10e3; // how high do you have to go before there is no rayleigh scattering?\n" +
    "float height_mie = 3.2e3; // the same, but for mie\n" +
	 "//Try messing with this\n" +
    "float density_multiplier = 1.0; // how much extra the atmosphere blocks light\n" +
    "\n" +
    "#ifdef ADVANCED_ATMOSPHERE\n" +
    "vec4 calculate_scattering(\n" +
    "vec3 start, 			// the start of the ray (the camera position)\n" +
    "vec3 dir, 				// the direction of the ray (the camera vector)\n" +
    "float maxDistance, 		// the maximum distance the ray can travel (because something is in the way, like an object)\n" +
    "vec3 light_dir\n" +
    ") {\n" +
    "\n" +
    "// calculate the start and end position of the ray, as a distance along the ray\n" +
    "// we do this with a ray sphere intersect\n" +
    "float a = dot(dir, dir);\n" +
    "float b = 2.0 * dot(dir, start);\n" +
    "float c = dot(start, start) - atmo_radius_squared;\n" +
    "float d = (b * b) - 4.0 * a * c;\n" +
    "\n" +
    "// stop early if there is no intersect\n" +
    "if (d < 0.0) return vec4(0.0);\n" +
    "\n" +
    "// calculate the ray length\n" +
    "float squaredD = sqrt(d);\n" +
    "vec2 ray_length = vec2(\n" +
    "max((-b - squaredD) / (2.0 * a), 0.0),\n" +
    "min((-b + squaredD) / (2.0 * a), maxDistance)\n" +
    ");\n" +
    "\n" +
    "// if the ray did not hit the atmosphere, return a black color\n" +
    "if (ray_length.x > ray_length.y) return vec4(0.0);\n" +
    "\n" +
    "// prevent the mie glow from appearing if there's an object in front of the camera\n" +
    "bool allow_mie = maxDistance > ray_length.y;\n" +
    "// make sure the ray is no longer than allowed\n" +
    "//ray_length.y = min(ray_length.y, maxDistance);\n" +
    "//ray_length.x = max(ray_length.x, 0.0);\n" +
    "\n" +
    "// get the step size of the ray\n" +
    "float step_size_i = (ray_length.y - ray_length.x) / float(PRIMARY_STEPS);\n" +
    "\n" +
    "// next, set how far we are along the ray, so we can calculate the position of the sample\n" +
    "// if the camera is outside the atmosphere, the ray should start at the edge of the atmosphere\n" +
    "// if it's inside, it should start at the position of the camera\n" +
    "// the min statement makes sure of that\n" +
    "float ray_pos_i = ray_length.x;\n" +
    "\n" +
    "// these are the values we use to gather all the scattered light\n" +
    "vec3 total_ray = vec3(0.0); // for rayleigh\n" +
    "vec3 total_mie = vec3(0.0); // for mie\n" +
    "\n" +
    "// initialize the optical depth. This is used to calculate how much air was in the ray\n" +
    "vec2 opt_i = vec2(0.0);\n" +
    "\n" +
    "// also init the scale height, avoids some vec2's later on\n" +
    "vec2 scale_height = vec2(height_ray, height_mie);\n" +
    "\n" +
    "// Calculate the Rayleigh and Mie phases.\n" +
    "// This is the color that will be scattered for this ray\n" +
    "// mu, mumu and gg are used quite a lot in the calculation, so to speed it up, precalculate them\n" +
    "float mu = dot(dir, light_dir);\n" +
    "float mumu = mu * mu;\n" +
    "float gg = g * g;\n" +
    "float phase_ray = 3.0 / (50.2654824574 ) * (1.0 + mumu);\n" +
    "//float phase_mie = allow_mie ? 3.0 / (25.1327412287 ) * ((1.0 - gg) * (mumu + 1.0)) / (pow(1.0 + gg - 2.0 * mu * g, 1.5) * (2.0 + gg)) : 0.0;\n" +
    "// allow some mie glow in front of horizon\n" +
    "// this can be wierd looking through some mountains\n" +
    "\n" +
    "float phase_mie = (allow_mie ? 3.0 : 0.5 ) / (25.1327412287 ) * ((1.0 - gg) * (mumu + 1.0)) / (pow(1.0 + gg - 2.0 * mu * g, 1.5) * (2.0 + gg));\n" +
    "\n" +
    "// now we need to sample the 'primary' ray. this ray gathers the light that gets scattered onto it\n" +
    "for (int i = 0; i < PRIMARY_STEPS; ++i) {\n" +
    "\n" +
    "// calculate where we are along this ray\n" +
    "vec3 pos_i = start + dir * (ray_pos_i + step_size_i);\n" +
    "\n" +
    "// and how high we are above the surface\n" +
    "float height_i = length(pos_i) - planetRadius;\n" +
    "\n" +
    "// now calculate the density of the particles (both for rayleigh and mie)\n" +
    "vec2 density = exp(-height_i / scale_height) * step_size_i;\n" +
    "\n" +
    "// Add these densities to the optical depth, so that we know how many particles are on this ray.\n" +
    "opt_i += density;\n" +
    "\n" +
    "// Calculate the step size of the light ray.\n" +
    "// again with a ray sphere intersect\n" +
    "// a, b, c and d are already defined\n" +
    "a = dot(light_dir, light_dir);\n" +
    "b = 2.0 * dot(light_dir, pos_i);\n" +
    "c = dot(pos_i, pos_i) - atmo_radius_squared;\n" +
    "d = (b * b) - 4.0 * a * c;\n" +
    "\n" +
    "if (d <= 0.0) d = 1.0; // not supposed to be required but this avoids the black singularity line at dusk and dawn\n" +
    "\n" +
    "// no early stopping, this one should always be inside the atmosphere\n" +
    "// calculate the ray length\n" +
    "float step_size_l = (-b + sqrt(d)) / (2.0 * a * float(LIGHT_STEPS));\n" +
    "\n" +
    "// and the position along this ray\n" +
    "// this time we are sure the ray is in the atmosphere, so set it to 0\n" +
    "float ray_pos_l = 0.0;\n" +
    "\n" +
    "// and the optical depth of this ray\n" +
    "vec2 opt_l = vec2(0.0);\n" +
    "\n" +
    "// now sample the light ray\n" +
    "// this is similar to what we did before\n" +
    "for (int l = 0; l < LIGHT_STEPS; ++l) {\n" +
    "\n" +
    "// calculate where we are along this ray\n" +
    "vec3 pos_l = pos_i + light_dir * (ray_pos_l + step_size_l * 0.5);\n" +
    "\n" +
    "// the heigth of the position\n" +
    "float height_l = length(pos_l) - planetRadius;\n" +
    "\n" +
    "// calculate the particle density, and add it\n" +
    "opt_l += exp(-height_l / scale_height) * step_size_l;\n" +
    "\n" +
    "// and increment where we are along the light ray.\n" +
    "ray_pos_l += step_size_l;\n" +
    "}\n" +
    "\n" +
    "// Now we need to calculate the attenuation\n" +
    "// this is essentially how much light reaches the current sample point due to scattering\n" +
    "vec3 attn = exp(-((beta_mie * (opt_i.y + opt_l.y)) + (beta_ray * (opt_i.x + opt_l.x))));\n" +
    "\n" +
    "// accumulate the scattered light (how much will be scattered towards the camera)\n" +
    "total_ray += density.x * attn;\n" +
    "total_mie += density.y * attn;\n" +
    "\n" +
    "// and increment the position on this ray\n" +
    "ray_pos_i += step_size_i;\n" +
    "}\n" +
    "\n" +
    "// calculate how much light can pass through the atmosphere\n" +
    "float opacity = length(exp(-((beta_mie * opt_i.y) + (beta_ray * opt_i.x)) * density_multiplier));\n" +
    "\n" +
    "return vec4((\n" +
    "phase_ray * beta_ray * total_ray // rayleigh color\n" +
    "+ phase_mie * beta_mie * total_mie // mie\n" +
    "+ opt_i.x * beta_ambient // and ambient\n" +
    ") * light_intensity, 1.0 - opacity);\n" +
    "}\n" +
    "#endif\n" +
    "\n" +
    "/*\n" +
    "* Clouds rendering\n" +
    "*/\n" +
    "#ifdef VOLUMETRIC_CLOUDS\n" +
    "float cloudBase_radius = realPlanetRadius + cloudBase;\n" +
    "float cloudThickness = cloudTop - cloudBase;\n" +
    "float cloudTop_radius = cloudBase_radius + cloudThickness;\n" +
    "float layerPosition = 0.2; // set the layer base to 10% of the cloud height\n" +
    "float baseThickness = cloudThickness * layerPosition;\n" +
    "float layer = cloudBase + baseThickness;\n" +
    "\n" +
    "//    float hash(float n) {\n" +
    "//        return fract(sin(mod(n, TWO_PI)) * 753.5453123);\n" +
    "//    }\n" +
    "\n" +
    "float hash(float p)\n" +
    "{\n" +
    "p = fract(p * .1031);\n" +
    "p *= p + 33.33;\n" +
    "p *= p + p;\n" +
    "return fract(p);\n" +
    "}\n" +
    "\n" +
    "float noise(in vec3 x) {\n" +
    "vec3 p = floor(x);\n" +
    "vec3 f = fract(x);\n" +
    "f = f*f*(3.0 - 2.0*f);\n" +
    "\n" +
    "float n = p.x + p.y*157.0 + 113.0*p.z;\n" +
    "return mix(mix(mix( hash(n+ 0.0), hash(n+ 1.0),f.x),\n" +
    "mix( hash(n+157.0), hash(n+158.0),f.x),f.y),\n" +
    "mix(mix( hash(n+113.0), hash(n+114.0),f.x),\n" +
    "mix(hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);\n" +
    "}\n" +
    "\n" +
    "int lastFlooredPosition;\n" +
    "float lastLiveCoverageValue = 0.0;\n" +
    "float cloudDensity(vec3 p, vec3 wind, int lod, inout float heightRatio) {\n" +
    "\n" +
    "float finalCoverage = cloudCover;\n" +
    "#ifdef REALTIME_CLOUDS\n" +
    "\n" +
    "vec3 sphericalNormal = normalize(p);\n" +
    "// TODO: investigate czm_geodeticSurfaceNormal\n" +
    "vec2 positionSurfaceC = czm_ellipsoidWgs84TextureCoordinates(sphericalNormal);\n" +
    "float sampledValue = texture2D(coverageTexture, positionSurfaceC).r;\n" +
    "lastLiveCoverageValue = clamp((sampledValue - 0.3) * 10.0, 0.0, 1.0);\n" +
    "\n" +
    "finalCoverage *= lastLiveCoverageValue;\n" +
    "#endif\n" +
    "\n" +
    "if (finalCoverage <= 0.1) return 0.0;\n" +
    "\n" +
    "float height = length(p) - realPlanetRadius;\n" +
    "heightRatio = (height - cloudBase) / cloudThickness;\n" +
    "\n" +
    "float positionResolution = 0.002;\n" +
    "p = p * positionResolution + wind;\n" +
    "\n" +
    "//        float shape = finalCoverage + finalCoverage * noise(p * 0.5);\n" +
    "//        float shapeHeight = finalCoverage + finalCoverage * noise(p * 0.05);\n" +
    "float shape = noise(p * 0.3);\n" +
    "float shapeHeight = noise(p * 0.05);\n" +
    "\n" +
    "//        float heightWeight;\n" +
    "//        if (height > layer) {\n" +
    "//            heightWeight = (height - layer) / (cloudThickness * (1.0 - layerPosition));\n" +
    "//        }\n" +
    "//        else {\n" +
    "//            heightWeight = (layer - height) / (cloudThickness * layerPosition);\n" +
    "//        }\n" +
    "\n" +
    "// brownian noise\n" +
    "float bn = 0.50000 * noise(p); p = p * 2.0;\n" +
    "if( lod>=1 ) bn += 0.20000 * noise(p); p = p * 2.11;\n" +
    "//if( lod>=2 ) bn += 0.12500 * noise(p); p = p * 2.32;\n" +
    "//if( lod>=3 ) bn += 0.06250 * noise(p);\n" +
    "\n" +
    "//***********************************************\n" +
    "float cumuloNimbus = saturate((shapeHeight - 0.5) * 2.0);\n" +
    "cumuloNimbus *= saturate(1.0 - pow(heightRatio - 0.5, 2.0) * 4.0);\n" +
    "\n" +
    "float cumulus = saturate(1.0 - pow(heightRatio - 0.25, 2.0) * 25.0) * shapeHeight;\n" +
    "\n" +
    "float stratoCumulus = saturate(1.0 - pow(heightRatio - 0.12, 2.0) * 60.0) * (1.0 - shapeHeight);\n" +
    "\n" +
    "float dens = saturate(stratoCumulus + cumulus + cumuloNimbus) * 2.0 * finalCoverage;\n" +
    "\n" +
    "// substract detail\n" +
    "dens -= 1.0 - shape;\n" +
    "dens -= bn;\n" +
    "\n" +
    "return clamp(dens, 0.0, 1.0);\n" +
    "\n" +
    "//***********************************************\n" +
    "//        float cumuloNimbusCore = saturate((shapeHeight - 0.5) * 1.0);\n" +
    "//        cumuloNimbusCore *= saturate(1.0 - pow(heightRatio - 0.5, 2.0) * 4.0) * 2.0;\n" +
    "//\n" +
    "//        float cumulusCore = saturate(1.0 - pow(heightRatio - 0.25, 2.0) * 25.0) * shapeHeight;\n" +
    "//\n" +
    "//        float stratoCumulusCore = saturate(1.0 - pow(heightRatio - 0.12, 2.0) * 60.0) * (1.0 - shapeHeight);\n" +
    "//\n" +
    "//        float dens = saturate(stratoCumulusCore + cumulusCore + cumuloNimbusCore) * 2.0 * finalCoverage;//(cloudHeightMultiplier * cloudCore) * 5.0;// + cloudHeightMultiplier * 5.0;\n" +
    "//\n" +
    "//        dens -= saturate(1.0 - pow(shape, 2.0));\n" +
    "//        dens -= bn;\n" +
    "//\n" +
    "//        return clamp(dens, 0.0, 1.0);\n" +
    "\n" +
    "\n" +
    "//***********************************************\n" +
    "//        float cumuloNimbusCore = saturate((shapeHeight - 0.8) * 5.0);\n" +
    "//        cumuloNimbusCore *= saturate(1.0 - pow(heightRatio - 0.5, 2.0) * 6.0);\n" +
    "//\n" +
    "//        float cumulusCore = saturate(0.8 - pow(heightRatio - 0.1, 2.0) * 30.0);\n" +
    "//\n" +
    "//        float dens = (cumulusCore + cumuloNimbusCore) * 4.0 * finalCoverage;\n" +
    "////        // 11.(x+0.2)-0.85)^2.(x+0.2)+0.3 // polynomial clouds profile\n" +
    "//        dens -= saturate(2.0 - shape * shape);\n" +
    "//        dens -= bn;\n" +
    "//        //heightRatio = (heightRatio / cloudHeight); // rescale height ratio to ouput for lighting stage\n" +
    "//        return clamp(dens, 0.0, 1.0);\n" +
    "//***********************************************\n" +
    "\n" +
    "//***********************************************\n" +
    "//        float cloudCore = saturate((shapeHeight - 0.8) * 5.0);\n" +
    "//        float cloudHeight = saturate(cloudCore * 100.0 + 0.2) * finalCoverage;\n" +
    "//        float cloudHeightMultiplier = saturate((cloudHeight - heightRatio) * 5.0);\n" +
    "//\n" +
    "//        //float cloudCore = cloudHeightMultiplier * cloudHeight;\n" +
    "//        float dens = 1.0;//(cloudHeightMultiplier * cloudCore) * 5.0;// + cloudHeightMultiplier * 5.0;\n" +
    "////        // 11.(x+0.2)-0.85)^2.(x+0.2)+0.3 // polynomial clouds profile\n" +
    "//        //dens *= (saturate(0.8 - pow(heightRatio - 0.1, 2.0) * 30.0) + saturate(1.0 - pow(heightRatio - 0.6, 2.0) * 6.0));\n" +
    "//\n" +
    "//        dens -= saturate(1.0 - pow(shape, 2.0));\n" +
    "//        dens -= bn;\n" +
    "//        //heightRatio = (heightRatio / cloudHeight); // rescale height ratio to ouput for lighting stage\n" +
    "//        return clamp(dens, 0.0, 1.0);\n" +
    "//***********************************************\n" +
    "\n" +
    "\n" +
    "//                bn = mix(-0.8, bn, shape * shape) + 0.1;\n" +
    "//                float dens = (bn / cloudCover) - (heightWeight * 4.2 * cloudCover); // steepness of cloud border\n" +
    "\n" +
    "//                float puffiness = 2.0;//clamp(3.0 - length(windVector) * 0.2, 1.0, 4.0);\n" +
    "//                float dens = (shape * shape) - bn;\n" +
    "//                return dens;\n" +
    "\n" +
    "//        float puffiness = 2.0;//clamp(3.0 - length(windVector) * 0.2, 1.0, 4.0);\n" +
    "//        float dens = mix(-0.5, bn, pow(shape, puffiness)) + 0.1;//(shape * shape) - bn;\n" +
    "//        return dens;\n" +
    "\n" +
    "//***********************************************\n" +
    "//float dens = shape;\n" +
    "//dens = pow(shape, 10.0);\n" +
    "////dens *= 30.0 * pow(0.6 - heightRatio, 2.0) * heightRatio;\n" +
    "////dens += pow(shapeHeight, 10.0) * (pow(heightRatio, 2.0) - pow(heightRatio, 21.0));\n" +
    "//dens += pow(shapeHeight, 10.0) * (1.0 - pow(2.0 - heightRatio, 2.0) * pow(heightRatio, 2.0));\n" +
    "////dens *= 7.0 * pow(1.0 - heightRatio, 2.0) * heightRatio;\n" +
    "//dens -= bn;\n" +
    "//return clamp(dens, 0.0, 1.0);\n" +
    "//***********************************************\n" +
    "//        // density depending on cloud height and current height\n" +
    "//        float cloudHeight = saturate((shapeHeight - 0.85) * 10.0) + 0.2;\n" +
    "//        float cloudHeightMultiplier = saturate((cloudHeight - heightRatio) * 10.0);\n" +
    "//        float lowerCumulus = saturate(1.0 - 30.0 * pow(heightRatio - 0.2, 2.0)); // lower cumulus\n" +
    "//        float higherCumulonimbus = saturate(1.0 - 6.0 * pow(heightRatio - 0.6, 2.0)); // lower cumulus\n" +
    "//\n" +
    "//        //float dens = cloudHeightMultiplier; // * (lowerCumulus + higherCumulonimbus); // * shape;\n" +
    "//        float dens = cloudHeightMultiplier * (lowerCumulus + higherCumulonimbus) * shape;\n" +
    "//        heightRatio = cloudHeight / heightRatio; // rescale height ratio for final lighting\n" +
    "//        dens -= bn;\n" +
    "//        return dens;\n" +
    "//***********************************************\n" +
    "//        //shape = pow(shape, 2.0);\n" +
    "//        //shapeHeight = pow(shapeHeight, 2.0);\n" +
    "//        float cloud_anvil_amount = 0.01;\n" +
    "//\n" +
    "//        float heightDens = saturate(reMap ( heightRatio , 0.0 ,0.07 ,0.0 ,1.0));\n" +
    "//        float stop = saturate(shapeHeight + 0.12);\n" +
    "//        heightDens *= saturate(reMap( heightRatio , stop * 0.2 , stop ,1.0 ,0.0));\n" +
    "//        heightDens = pow (heightDens , saturate( reMap( heightRatio ,0.65 ,0.95 ,1.0 , (1.0 - cloud_anvil_amount * finalCoverage))));\n" +
    "//\n" +
    "//        // Have density be generally increasing over height\n" +
    "//        float dens = heightRatio ;\n" +
    "//\n" +
    "//        // Reduce density at base\n" +
    "//        dens *= saturate ( reMap ( heightRatio ,0.0 ,0.2 ,0.0 ,1.0) );\n" +
    "//\n" +
    "//        // Apply weather_map density\n" +
    "//        dens *= shape * 2.0;\n" +
    "//\n" +
    "//        // Reduce density for the anvil ( cumulonimbus clouds)\n" +
    "//        dens *= mix(1.0 , saturate( reMap ( pow( heightRatio ,0.5) ,0.4 ,0.95 ,1.0 ,0.2) ) , cloud_anvil_amount );\n" +
    "//\n" +
    "//        // Reduce density at top to make better transition\n" +
    "//        dens *= saturate ( reMap ( heightRatio ,0.9 ,1.0 ,1.0 ,0.0));\n" +
    "//\n" +
    "//        bn = mix( bn ,1.0 - bn , saturate ( heightRatio * 5.0));\n" +
    "//\n" +
    "//        bn *= 0.35 * exp (- finalCoverage * 0.75) ;\n" +
    "//\n" +
    "//        // Carve away more from the shape_noise using detail_noise\n" +
    "//        dens = saturate ( reMap ( dens , bn ,1.0 ,0.0 ,1.0) );\n" +
    "//\n" +
    "//        return clamp(dens * heightDens, 0.0, 1.0);\n" +
    "}\n" +
    "#endif\n";

//automate atmosphere reloading
// try update()?
geofs.fx.atmosphere.destroy();
geofs.fx.atmosphere.create();
