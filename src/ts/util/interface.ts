interface LevelInterface {
    "balls": BallInterface[];
}

interface BallInterface {
    "class": string;
    "args": PlanetInterface;
}

interface PlanetInterface {
    "material": { "map": string, "shininess": number };
    "position": { "x": number, "y": number, "z": number };
    "radius": number;
    "tilt": number;
    "rotationSpeed": number;
    "orbitSpeed": number;
    "owner": string;
    "spaceships": number;
    "maxSpaceships": number;
}

export {LevelInterface, BallInterface, PlanetInterface};