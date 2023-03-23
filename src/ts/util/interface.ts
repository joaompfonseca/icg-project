interface LevelInterface {
    "balls": BallInterface[];
}

interface BallInterface {
    "class": string;
    "args": PlanetInterface;
}

interface PlanetInterface {
    "material": { "color": string, "shininess": number };
    "position": { "x": number, "y": number, "z": number };
    "radius": number;
    "tilt": number;
    "rotationSpeed": number;
    "orbitSpeed": number;
    "owner": string;
    "spaceships": number;
}

export {LevelInterface, BallInterface, PlanetInterface};