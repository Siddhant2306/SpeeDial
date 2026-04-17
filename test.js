const fs = require('fs');
const buffer = fs.readFileSync('public/assets/toy_robot_domowik.glb');
const chunkLength = buffer.readUInt32LE(12);
const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
const gltf = JSON.parse(jsonStr);
fs.writeFileSync('gltf_dump.txt', gltf.nodes.map(n => n.name).join('\n'));
