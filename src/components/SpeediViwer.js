import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Center, Resize } from "@react-three/drei";

function AnimatedModel() {
  const group = useRef();
  const { scene, animations } = useGLTF("/assets/toy_robot_domowik.glb");
  const { actions } = useAnimations(animations, group);
  
  // High-level state to manage procedural animations
  const [currentAnim, setCurrentAnim] = useState("wave");

  useEffect(() => {
    // Basic standard animations playback handling
    if (actions && Object.keys(actions).length > 0) {
      const animNames = Object.keys(actions);
      const idleAnimName = animNames.find(n => n.toLowerCase().includes('idle')) || animNames[0];
      if (idleAnimName && actions[idleAnimName]) {
        actions[idleAnimName].reset().fadeIn(0.2).play();
      }
    }

    // Disney-Style Shader & Eye Fix Layer
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const applyDisneyShader = (oldMat) => {
          const newMat = new THREE.MeshPhysicalMaterial({
            color: oldMat.color || new THREE.Color(0xffffff),
            map: oldMat.map || null,
            normalMap: oldMat.normalMap || null,
            roughnessMap: oldMat.roughnessMap || null,
            metalnessMap: oldMat.metalnessMap || null,
            emissiveMap: oldMat.emissiveMap || null,
            transparent: oldMat.transparent || false,
            opacity: oldMat.opacity !== undefined ? oldMat.opacity : 1,
            side: oldMat.side !== undefined ? oldMat.side : THREE.FrontSide,
            alphaTest: oldMat.alphaTest !== undefined ? oldMat.alphaTest : 0,
          });
          
          if (oldMat.emissive) newMat.emissive.copy(oldMat.emissive);
          if (oldMat.normalScale) newMat.normalScale.copy(oldMat.normalScale);
          
          // Exaggerate the Disney Pixar look!
          newMat.clearcoat = 1.0; // Maximum clearcoat
          newMat.clearcoatRoughness = 0.02; // Ultra shiny gloss
          newMat.roughness = Math.max(0.05, (oldMat.roughness !== undefined ? oldMat.roughness : 0.5) - 0.3); // Super smooth base
          newMat.metalness = oldMat.metalness !== undefined ? oldMat.metalness : 0.05;
          
          // Inject "Sheen" (Signature Disney soft edge-lighting effect often used on clothes/soft plastics)
          newMat.sheen = 1.0;
          newMat.sheenColor = new THREE.Color(0xffffff);
          newMat.sheenRoughness = 0.3;
          
          newMat.emissiveIntensity = oldMat.emissiveIntensity !== undefined ? oldMat.emissiveIntensity : 1;
          
          const isEye = child.name.toLowerCase().includes("eye") || (oldMat.name && oldMat.name.toLowerCase().includes("eye"));
          if (isEye) {
             newMat.emissiveIntensity = Math.max(newMat.emissiveIntensity, 3);
             if (newMat.emissive && newMat.emissive.getHex() === 0) {
               newMat.emissive = new THREE.Color(0xffffff);
             }
             newMat.transparent = true;
             newMat.depthWrite = true; 
          }

          return newMat;
        };

        if (Array.isArray(child.material)) {
          child.material = child.material.map(applyDisneyShader);
        } else {
          child.material = applyDisneyShader(child.material);
        }
      }
    });
  }, [actions, scene]);

  // Set up random procedural animation cycle
  useEffect(() => {
    let timeout;
    
    // The main loop for random animations
    const triggerRandomAnim = () => {
      const anims = ["joy", "nod", "dance", "wave"];
      const randomAnim = anims[Math.floor(Math.random() * anims.length)];
      setCurrentAnim(randomAnim);
      
      // Stop the animation after 2.5s
      setTimeout(() => {
        setCurrentAnim("idle");
      }, 2500);

      // Trigger next random animation between 5s and 10s from now
      timeout = setTimeout(triggerRandomAnim, Math.random() * 5000 + 5000);
    };

    // Setup the initial wave drop
    setTimeout(() => {
      setCurrentAnim("idle");
      // Queue the first random trigger
      timeout = setTimeout(triggerRandomAnim, Math.random() * 3000 + 4000);
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  const armRef = useRef(null);
  const initialArmRot = useRef(new THREE.Euler());

  useEffect(() => {
    if (scene) {
      const arm = scene.getObjectByName('Armature.001') || scene.getObjectByName('RightArm') || scene.getObjectByName('LeftArm') || scene.getObjectByName('Armature');
      if (arm) {
        armRef.current = arm;
        initialArmRot.current.copy(arm.rotation);
      }
    }
  }, [scene]);

  // Handle all procedural movements
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    
    // Safe default values
    const tArmRot = { x: initialArmRot.current.x, z: initialArmRot.current.z };
    const tGrpPos = { y: 0 };
    const tGrpRot = { x: 0, z: 0 };

    if (currentAnim === "wave" && armRef.current) {
        // Hand straight up! 2.5 radians pivot raises it all the way
        tArmRot.z = initialArmRot.current.z + 2.5; 
        // Shake it left and right rapidly
        tArmRot.x = initialArmRot.current.x + Math.sin(t * 18) * 0.6;
    } else if (currentAnim === "joy") {
        // Happy Hop
        tGrpPos.y = Math.abs(Math.sin(t * 12)) * 0.4;
        tGrpRot.z = Math.sin(t * 8) * 0.15;
    } else if (currentAnim === "nod") {
        // Nod yes
        tGrpRot.x = (Math.sin(t * 14) * 0.2) + 0.1;
    } else if (currentAnim === "dance") {
        // Happy wiggle dance
        tGrpPos.y = Math.abs(Math.sin(t * 10)) * 0.2;
        tGrpRot.z = Math.sin(t * 12) * 0.2;
        if (armRef.current) {
          tArmRot.z = initialArmRot.current.z + Math.abs(Math.sin(t * 10)) * 1.5;
        }
    }

    // Smoothly apply physics to the rig
    if (armRef.current) {
        armRef.current.rotation.x = THREE.MathUtils.lerp(armRef.current.rotation.x, tArmRot.x, 0.15);
        armRef.current.rotation.z = THREE.MathUtils.lerp(armRef.current.rotation.z, tArmRot.z, 0.15);
    }
    
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, tGrpPos.y, 0.15);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, tGrpRot.x, 0.15);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, tGrpRot.z, 0.15);
  });

  return (
    <Center>
      <Resize scale={3.5}>
        <group ref={group}>
          <primitive object={scene} rotation={[0, -Math.PI / 2, 0]} />
        </group>
      </Resize>
    </Center>
  );
}

export function ModelViewer() {
  return (
    <div style={{ width: "100%", height: "100%", cursor: "grab" }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
        <ambientLight intensity={1.2} color="#ffffff" />
        <directionalLight position={[8, 10, 8]} intensity={1.5} color="#ffeedd" />
        <directionalLight position={[-8, 5, 5]} intensity={0.8} color="#bac4ff" />

        <React.Suspense fallback={null}>
          <AnimatedModel />
        </React.Suspense>
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          autoRotate={false}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}