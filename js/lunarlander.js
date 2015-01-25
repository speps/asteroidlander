
function VectorTextFactory(scale, color) {
	// as one polyline each on a 4x5 grid per letter with 1 cell kerning left, right and top
	// x going left to right, y going bottom to top
	var letters = [
		/* 0 */ [[1, 0], [1, 4], [3, 4], [3, 0], [1, 0], [3, 4]],
		/* 1 */ [[1, 0], [3, 0], [2, 0], [2, 4], [1, 3]],
		/* 2 */ [[3, 0], [1, 0], [1, 2], [3, 2], [3, 4], [1, 4]],
		/* 3 */ [[1, 0], [3, 0], [3, 2], [1, 2], [3, 2], [3, 4], [1, 4]],
		/* 4 */ [[1, 4], [1, 2], [3, 2], [3, 4], [3, 0]],
		/* 5 */ [[1, 0], [3, 0], [3, 2], [1, 2], [1, 4], [3, 4]],
		/* 6 */ [[1, 2], [3, 2], [3, 0], [1, 0], [1, 4], [3, 4]],
		/* 7 */ [[1, 4], [3, 4], [3, 0]],
		/* 8 */ [[1, 2], [1, 0], [3, 0], [3, 2], [1, 2], [1, 4], [3, 4], [3, 2]],
		/* 9 */ [[1, 0], [3, 0], [3, 2], [1, 2], [1, 4], [3, 4], [3, 2]],
		/* A */ [[1, 0], [1, 2], [3, 2], [1, 2], [1, 3], [2, 4], [3, 3], [3, 0]],
		/* B */ [[1, 0], [1, 4], [2, 4], [3, 3], [3, 2], [1, 2], [3, 2], [3, 0], [1, 0]],
		/* C */ [[3, 0], [1, 0], [1, 4], [3, 4]],
		/* D */ [[1, 0], [1, 4], [2, 4], [3, 3], [3, 1], [2, 0], [1, 0]],
		/* E */ [[3, 0], [1, 0], [1, 2], [3, 2], [1, 2], [1, 4], [3, 4]],
		/* F */ [[1, 0], [1, 2], [3, 2], [1, 2], [1, 4], [3, 4]],
		/* G */ [[2, 2], [3, 2], [3, 0], [1, 0], [1, 4], [3, 4]],
		/* H */ [[1, 0], [1, 4], [1, 2], [3, 2], [3, 4], [3, 0]],
		/* I */ [[1, 0], [3, 0], [2, 0], [2, 4], [3, 4], [1, 4]],
		/* J */ [[1, 1], [1, 0], [3, 0], [3, 4], [2, 4]],
		/* K */ [[1, 0], [1, 2], [3, 0], [1, 2], [3, 4], [1, 2], [1, 4]],
		/* L */ [[3, 0], [1, 0], [1, 4]],
		/* M */ [[1, 0], [1, 4], [2, 2], [3, 4], [3, 0]],
		/* N */ [[1, 0], [1, 4], [3, 0], [3, 4]],
		/* O */ [[3, 0], [1, 0], [1, 4], [3, 4], [3, 0]],
		/* P */ [[1, 0], [1, 4], [3, 4], [3, 2], [1, 2]],
		/* Q */ [[2, 0], [1, 0], [1, 4], [3, 4], [3, 1], [2, 0], [2, 1], [3, 0]],
		/* R */ [[1, 0], [1, 4], [3, 4], [3, 2], [1, 2], [3, 0]],
		/* S */ [[1, 0], [3, 0], [3, 2], [1, 2], [1, 4], [3, 4]],
		/* T */ [[2, 0], [2, 4], [3, 4], [1, 4]],
		/* U */ [[1, 4], [1, 0], [3, 0], [3, 4]],
		/* V */ [[1, 4], [2, 0], [3, 4]],
		/* W */ [[1, 4], [1, 0], [2, 2], [3, 0], [3, 4]],
		/* X */ [[1, 4], [3, 0], [2, 2], [3, 4], [1, 0]],
		/* Y */ [[2, 0], [2, 2], [3, 4], [2, 2], [1, 4]],
		/* Z */ [[1, 4], [3, 4], [1, 0], [3, 0]],
		/* - */ [[1, 2], [3, 2]],
	];
	var asciiMap = [];
	for (var i = 0; i < 10; i++) {
		asciiMap[i + 48] = i;
	}
	for (var i = 0; i < 26; i++) {
		asciiMap[i + 65] = i + 10;
		asciiMap[i + 97] = i + 10;
	}
	asciiMap[45] = 36;
	var symbols = [];
	for (var i = 0; i < letters.length; i++) {
		var path = new Path(letters[i].map(function(item) {
			return new Point(item[0], -item[1]) * scale;
		}));
		path.pivot = [0, 0];
		path.strokeColor = color;
		path.remove();
		symbols.push(new Symbol(path));
	}
	this.create = function(str, pos) {
		var ustr = str.toUpperCase();
		var items = [];
		var x = 0, y = 0, kerning = 4 * scale;
		var origin = pos == undefined ? new Point(0, 0) : pos;
		for (var i = 0; i < ustr.length; i++) {
			var code = ustr.charCodeAt(i);
			var index = -1;
			if (asciiMap[code] != undefined) {
				index = asciiMap[code];
			} else if (code == 32) {
				x += 4 * scale;
			} else if (code == 10) {
				y += 5 * scale;
				x = 0;
			}
			if (index == -1) {
				continue;
			}
			items.push(symbols[index].place(origin + new Point(x, y)));
			x += 4 * scale;
		}
		var group = new Group(items);
		group.pivot = [0, 0];
		return group;
	};
}

var config = {
	timestep: 1/60,
	damping:0.99,
	ship: {
		scale: 5,
		thrustSpeed: 0.05,
		maxThrust: 55,
		rotateSpeed: 3,
		maxAngle:40,
		lifeTimer:0.4
	},
	terrain: {
		slices: 40,
		minAlt: 400,
		deltaAlt: 100,
		minGravity: 40,
		deltaGravity: 10,
		landingHeight: 5,
		rotateSpeed: 0.05,
		ridges: 6
	},
	stars: {
		num: 200,
		size: 2000,
		mag: 1
	}
};

function StarField() {
	var points = [];
	var z = [];
	for (var i = 0; i < config.stars.num; i++) {
		points.push((Point.random() - 0.5) * config.stars.size);
		z.push(Math.random());
	}

	var items = points.map(function(item, index, a) {
		var alpha = index / a.length;
		var c = new Path.Circle({
			position: item,
			radius: z[index] * config.stars.mag + 1
		});
		c.fillColor = '#999';
		return c;
	});

	this.advance = function() {
		for (var i = 0; i < items.length; i++) {
			var p = points[i] - view.center * (z[i] - 1);
			if (view.bounds.contains(p)) {
				items[i].position = p;
			}
		}
	};
}

function Ship() {
	var shipModule = new CompoundPath();
	shipModule.pivot = [0, 0];
	// crew module
	shipModule.moveTo(new Point(-1, -1) * config.ship.scale);
	shipModule.lineTo(new Point(1, -1) * config.ship.scale);
	shipModule.lineTo(new Point(2, -2) * config.ship.scale);
	shipModule.lineTo(new Point(2, -4) * config.ship.scale);
	shipModule.lineTo(new Point(1, -5) * config.ship.scale);
	shipModule.lineTo(new Point(-1, -5) * config.ship.scale);
	shipModule.lineTo(new Point(-2, -4) * config.ship.scale);
	shipModule.lineTo(new Point(-2, -2) * config.ship.scale);
	shipModule.closePath();
	// base
	shipModule.moveTo(new Point(-3, -1) * config.ship.scale);
	shipModule.lineTo(new Point(3, -1) * config.ship.scale);
	shipModule.lineTo(new Point(3, 0) * config.ship.scale);
	shipModule.lineTo(new Point(-3, 0) * config.ship.scale);
	shipModule.closePath();
	// left leg
	shipModule.moveTo(new Point(-2, 0) * config.ship.scale);
	shipModule.lineTo(new Point(-1, 0) * config.ship.scale);
	shipModule.lineTo(new Point(-2, 2) * config.ship.scale);
	shipModule.lineTo(new Point(-3, 2) * config.ship.scale);
	shipModule.closePath();
	// right leg
	shipModule.moveTo(new Point(2, 0) * config.ship.scale);
	shipModule.lineTo(new Point(1, 0) * config.ship.scale);
	shipModule.lineTo(new Point(2, 2) * config.ship.scale);
	shipModule.lineTo(new Point(3, 2) * config.ship.scale);
	shipModule.closePath();
	shipModule.strokeColor = 'white';

	var shipThruster = new CompoundPath();
	shipThruster.pivot = [0, 0];
	shipThruster.moveTo(new Point(-1, 0) * config.ship.scale);
	shipThruster.lineTo(new Point(1, 0) * config.ship.scale);
	shipThruster.lineTo(new Point(0, 6) * config.ship.scale);
	shipThruster.closePath();
	shipThruster.strokeColor = 'yellow';

	var collisionPoints = [
		(new Point(3, 2) * config.ship.scale).rotate(90),
		(new Point(-3, 2) * config.ship.scale).rotate(90)
	];

	var ship = new Group([shipModule, shipThruster]);
	ship.pivot = [0, 0];
	ship.rotate(90);
	ship.applyMatrix = false;
	ship.rotation = -90;
	ship.position = [0, -(config.terrain.minAlt + config.terrain.deltaAlt * 2)];

	var thrust = 0.5;
	var sim = {
		position: ship.position,
		previousPosition: ship.position
	};

	this.remove = function() {
		ship.remove();
	};

	var dying = false;
	var dyingTimer = 0;
	this.die = function() {
		dying = true;
		dyingTimer = config.ship.lifeTimer;
		shipThruster.remove();
	};
	this.isDying = function() {
		return dying;
	};
	this.hasDied = function() {
		return dying && dyingTimer < 0;
	}

	var landed = false;
	this.land = function() {
		landed = true;
		shipThruster.remove();
	}
	this.hasLanded = function() {
		return landed;
	}

	this.intersects = function(terrain) {
		for (var i = 0; i < collisionPoints.length; i++) {
			var p = collisionPoints[i].transform(ship.matrix);
			if (terrain.path.hitTest(p) && !terrain.inLandingSite(p)) {
				return true;
			}
		}
		return false;
	};

	this.inLandingSite = function(terrain) {
		for (var i = 0; i < collisionPoints.length; i++) {
			var p = collisionPoints[i].transform(ship.matrix);
			if (!terrain.inLandingSite(p)) {
				return false;
			}
		}
		return true;
	};

	var stats = {
		vsi: 0,
		ssi: 0,
		alt: 0
	};
	this.stats = function() {
		return stats;
	};

	var baseStats = {angle: -90, alt: sim.position.length};
	function computeStats(angle, alt) {
		var diffAngle = (angle - baseStats.angle) / config.timestep;
		var diffAlt = (alt - baseStats.alt) / config.timestep;
		stats.ssi += (diffAngle - stats.ssi) * 0.9;
		stats.vsi += (diffAlt - stats.vsi) * 0.9;
		stats.alt = alt;

		baseStats.angle = angle;
		baseStats.alt = alt;
	}

	this.advance = function() {
		if (landed) {
			return;
		}

		if (dying) {
			if (dyingTimer >= 0) {
				var dieAlpha = dyingTimer / config.ship.lifeTimer;
				dyingTimer -= config.timestep;
				shipModule.scaling = 2 - dieAlpha;
				shipModule.strokeColor.red = dieAlpha;
				shipModule.strokeColor.green = dieAlpha;
				shipModule.strokeColor.blue = 0;
				if (dyingTimer < 0) {
					ship.remove();
				}
			}
			return;
		}

		if (Key.isDown('down')) {
			thrust -= config.ship.thrustSpeed;
		}
		if (Key.isDown('up')) {
			thrust += config.ship.thrustSpeed;
		}

		var currentAngle = ship.rotation;
		if (Key.isDown('left')) {
			currentAngle -= config.ship.rotateSpeed;
		}
		if (Key.isDown('right')) {
			currentAngle += config.ship.rotateSpeed;
		}

		var newDir = new Point(Math.cos(currentAngle * Math.PI / 180), Math.sin(currentAngle * Math.PI / 180));
		var shipLatitude = Math.atan2(sim.position.y, sim.position.x) * 180 / Math.PI;

		var diffAngle = sim.position.getDirectedAngle(newDir);
		if (diffAngle < -config.ship.maxAngle) {
			currentAngle = shipLatitude - config.ship.maxAngle;
		} else if (diffAngle > config.ship.maxAngle) {
			currentAngle = shipLatitude + config.ship.maxAngle;
		}
		ship.rotation = currentAngle;

		if (thrust > 1) {
			thrust = 1;
		} else if (thrust < 0) {
			thrust = 0;
		}
		shipThruster.scaling = [thrust + 0.01 + Math.random() * 0.1 * thrust, 1];

		var shipDir = new Point(Math.cos(ship.rotation * Math.PI / 180), Math.sin(ship.rotation * Math.PI / 180));
		var shipAltitude = sim.position.length;
		var shipAlpha = Math.max(0, shipAltitude - config.terrain.minAlt) / config.terrain.deltaAlt;

		computeStats(shipLatitude, shipAltitude);

		var gravityDir = -sim.position.normalize();

		// simulation
		var force = new Point(0, 0);
		force += shipDir * thrust * config.ship.maxThrust;
		force += gravityDir * (config.terrain.minGravity + config.terrain.deltaGravity * shipAlpha);

		var newPosition = sim.position * (1 + config.damping) - sim.previousPosition * config.damping + force * config.timestep * config.timestep;
		sim.previousPosition = sim.position;
		sim.position = newPosition;

		ship.position = sim.position;
		this.position = sim.position;
	};
}

function Terrain() {
	var terrain = [];
	noise.seed(Math.random());
	for (var i = 0; i < config.terrain.slices; i++) {
		var v = Math.PI * 2 * i / config.terrain.slices;
		terrain.push(noise.perlin2(Math.cos(v), Math.sin(v)) + (Math.random() * 2 - 1) * 0.2);
	}
	var terrainPoints = [];
	for (var i = 0; i <= terrain.length; i++) {
		var angle = (i / terrain.length) * 2 * Math.PI;
		var d = config.terrain.minAlt + terrain[i%terrain.length] * config.terrain.deltaAlt;
		var p = new Point(Math.cos(angle) * d, Math.sin(angle) * d);
		terrainPoints.push(p);
	}
	var terrainPath = new Path(terrainPoints);
	terrainPath.pivot = [0, 0];
	terrainPath.strokeColor = 'white';
	terrainPath.fillColor = 'black';

	var ridges = [];
	for (var i = 0; i < config.terrain.ridges; i++) {
		var alpha = i / config.terrain.ridges;
		var newPoints = terrainPoints.map(function(item) {
			return item * (1 - alpha * alpha) * 0.8 + Math.random() * 0.2;
		});
		var randStart = Math.floor(Math.random() * newPoints.length);
		var randEnd = (randStart + Math.floor(Math.random() * newPoints.length * 2)) % newPoints.length;
		newPoints = newPoints.splice(Math.min(randStart, randEnd), newPoints.length - Math.max(randStart, randEnd));
		var ridgePath = new Path(newPoints);
		ridgePath.pivot = [0, 0];
		ridgePath.strokeColor = 'white';
		ridgePath.strokeColor.red = 1 - alpha;
		ridgePath.strokeColor.green = 1 - alpha;
		ridgePath.strokeColor.blue = 1 - alpha;
		ridges.push(ridgePath);
	}

	var landingSitePoint = Math.floor(Math.random() * terrain.length / 2);
	var landingSiteP0 = terrainPoints[landingSitePoint];
	var landingSiteP1 = terrainPoints[(landingSitePoint+1)%terrain.length];
	var landingSiteBase = landingSiteP1 - landingSiteP0;
	var landingSiteNormal = (new Point(landingSiteBase.y, -landingSiteBase.x)).normalize();
	var landingSite = new Path([
		landingSiteP0,
		landingSiteP1,
		landingSiteP1 + landingSiteNormal * config.terrain.landingHeight,
		landingSiteP0 + landingSiteNormal * config.terrain.landingHeight
	]);
	landingSite.pivot = [0, 0];
	landingSite.fillColor = '#ffff00';

	this.path = terrainPath;

	var rotSpeed = (Math.random() < 0.5 ? 1 : -1) * config.terrain.rotateSpeed;
	this.advance = function() {
		terrainPath.rotate(rotSpeed);
		landingSite.rotate(rotSpeed);
		ridges.forEach(function(item) { item.rotate(rotSpeed); });
	};

	this.remove = function() {
		terrainPath.remove();
		landingSite.remove();
		ridges.forEach(function(item) { item.remove(); });
	};

	this.inLandingSite = function(point) {
		return landingSite.hitTest(point);
	};
}

var starsInstance = new StarField();
var terrainInstance = new Terrain();
var shipInstance;

var facBig = new VectorTextFactory(10, 'white');
var facSmall = new VectorTextFactory(5, '#ccc');
var facStats = new VectorTextFactory(4, 'white');

var vtexts = [];
function clearTexts() {
	for (var i = 0; i < vtexts.length; i++) {
		vtexts[i].remove();
	}
	vtexts = [];
}
function flickerItems() {
	project.activeLayer.opacity = 0.9 + Math.random() * 0.1;
}

var gamestate = 0; // 0 = start, 1 = normal, 2 = lost, 3 = won
var spacestate = false, prevSpacestate = false;

view.center = [0, 0];
function onFrame(event) {
	flickerItems();
	prevSpacestate = spacestate;
	spacestate = Key.isDown('space');
	if (gamestate == 0 || gamestate == 1) {
		terrainInstance.advance();
	}
	starsInstance.advance();
	if (gamestate == 0) {
		view.center = [0, 0];
		if (vtexts.length == 0) {
			vtexts.push(facBig.create("ASTEROID\n LANDER", new Point(-160, 25)));
			vtexts.push(facSmall.create("USE ARROWS TO STEER", new Point(-150, 150)));
			vtexts.push(facSmall.create("PRESS SPACE TO START", new Point(-160, 200)));
		}
		if (spacestate && !prevSpacestate) {
			clearTexts();
			gamestate = 1;
		}
	} else if (gamestate == 1) {
		if (shipInstance == undefined) {
			shipInstance = new Ship();
		}

		clearTexts();
		var stats = shipInstance.stats();
		vtexts.push(facStats.create("VSI", view.bounds.topLeft + new Point(40, 40)));
		vtexts.push(facStats.create(Math.floor(stats.vsi).toString(), view.bounds.topLeft + new Point(104, 40)));
		vtexts.push(facStats.create("SSI", view.bounds.topLeft + new Point(40, 60)));
		vtexts.push(facStats.create(Math.floor(stats.ssi).toString(), view.bounds.topLeft + new Point(104, 60)));
		vtexts.push(facStats.create("ALT", view.bounds.topLeft + new Point(40, 80)));
		vtexts.push(facStats.create(Math.floor(stats.alt).toString(), view.bounds.topLeft + new Point(104, 80)));

		shipInstance.advance();
		view.center = shipInstance.position;
		if ((event.count % 10) == 0 && !shipInstance.isDying() && shipInstance.intersects(terrainInstance)) {
			shipInstance.die();
		}
		if (!shipInstance.hasLanded() && shipInstance.inLandingSite(terrainInstance)) {
			shipInstance.land();
			clearTexts();
			gamestate = 3;
		}
		if (shipInstance.hasDied()) {
			shipInstance.remove();
			shipInstance = undefined;
			clearTexts();
			gamestate = 2;
		}
	} else if (gamestate == 2) {
		if (vtexts.length == 0) {
			vtexts.push(facBig.create("YOU CRASHED!", view.center + new Point(-280, 25)));
			vtexts.push(facSmall.create("PRESS SPACE TO RETRY", view.center + new Point(-160, 150)));
		}
		if (spacestate && !prevSpacestate) {
			terrainInstance.remove();
			terrainInstance = new Terrain();
			clearTexts();
			gamestate = 0;
		}
	} else if (gamestate == 3) {
		if (vtexts.length == 0) {
			vtexts.push(facBig.create("YOU LANDED SAFELY!", view.center + new Point(-360, 25)));
			vtexts.push(facSmall.create("PRESS SPACE TO RESET", view.center + new Point(-160, 150)));
		}
		if (spacestate && !prevSpacestate) {
			shipInstance.remove();
			shipInstance = undefined;
			terrainInstance.remove();
			terrainInstance = new Terrain();
			clearTexts();
			gamestate = 0;
		}
	}
}
