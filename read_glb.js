const fs = require('fs');
const buffer = fs.readFileSync('public/assets/toy_robot_domowik.glb');

// Basic GLB header parsing
const chunkLength = buffer.readUInt32LE(12);
const chunkType = buffer.toString('utf8', 16, 20);

if (chunkType === 'JSON') {
    const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
    const gltf = JSON.parse(jsonStr);
    
    if (gltf.nodes) {
        const names = gltf.nodes.map(n => n.name).filter(Boolean);
        console.log("Nodes:");
        console.log(names);
    } else {
        console.log("No nodes found");
    }
} else {
    console.log("Not a valid GLB JSON chunk");
}
