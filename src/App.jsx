import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./App.css";

function App() {
  const mountRef = useRef(null);
  const audioRef = useRef(null);

  const [entered, setEntered] = useState(false);
  const [sceneTwo, setSceneTwo] = useState(false);
  const [sceneThree, setSceneThree] = useState(false);
  const [sceneFour, setSceneFour] = useState(false);
  const [sceneFive, setSceneFive] = useState(false);
  const [finalScene, setFinalScene] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const stageRef = useRef(0);

  useEffect(() => {
    const container = mountRef.current;

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x03020a);
    scene.fog = new THREE.FogExp2(0x03020a, 0.045);

    // =========================================
    // CAMERA
    // =========================================

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );

    camera.position.set(0, 3.2, 18);

    // =========================================
    // RENDERER
    // =========================================

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);

    // =========================================
    // LIGHTING
    // =========================================

    scene.add(new THREE.AmbientLight(0x5b426d, 0.35));

    const pinkLight = new THREE.PointLight(0xff3f9f, 9, 18);
    pinkLight.position.set(-4, 3, 2);
    scene.add(pinkLight);

    const purpleLight = new THREE.PointLight(0x7d4dff, 8, 16);
    purpleLight.position.set(4, 2, -2);
    scene.add(purpleLight);

    const blueLight = new THREE.PointLight(0x3f8cff, 5, 15);
    blueLight.position.set(0, -1, -5);
    scene.add(blueLight);

    // =========================================
    // FLOOR
    // =========================================

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(18, 96),
      new THREE.MeshStandardMaterial({
        color: 0x07050e,
        roughness: 0.78,
        metalness: 0.18,
      }),
    );

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.35;

    scene.add(floor);

    // =========================================
    // PLATFORM
    // =========================================

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(3.4, 3.8, 0.45, 96),
      new THREE.MeshStandardMaterial({
        color: 0x100a19,
        metalness: 0.65,
        roughness: 0.32,
      }),
    );

    platform.position.y = -1.08;

    scene.add(platform);

    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(3.25, 0.025, 12, 100),
      new THREE.MeshBasicMaterial({
        color: 0xff4ba7,
        transparent: true,
        opacity: 0.6,
      }),
    );

    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = -0.84;

    scene.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.75, 0.018, 12, 100),
      new THREE.MeshBasicMaterial({
        color: 0x8e62ff,
        transparent: true,
        opacity: 0.5,
      }),
    );

    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = -0.82;

    scene.add(ring2);

    // =========================================
    // MAIN HEART
    // =========================================

    const heartShape = new THREE.Shape();

    heartShape.moveTo(0, -1.15);

    heartShape.bezierCurveTo(-0.2, -0.85, -1.55, -0.05, -1.55, 0.85);

    heartShape.bezierCurveTo(-1.55, 1.75, -0.45, 2.05, 0, 1.15);

    heartShape.bezierCurveTo(0.45, 2.05, 1.55, 1.75, 1.55, 0.85);

    heartShape.bezierCurveTo(1.55, -0.05, 0.2, -0.85, 0, -1.15);

    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.38,
      bevelEnabled: true,
      bevelSegments: 5,
      bevelSize: 0.08,
      bevelThickness: 0.07,
    });

    heartGeometry.center();

    const heartMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff3f9d,
      emissive: 0x5e123e,
      emissiveIntensity: 1.4,
      roughness: 0.18,
      metalness: 0.25,
      clearcoat: 1,
      clearcoatRoughness: 0.15,
    });

    const heart = new THREE.Mesh(heartGeometry, heartMaterial);

    heart.position.set(0, 1.05, 0);
    heart.scale.set(1.15, 1.15, 1.15);

    scene.add(heart);

    const heartRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.85, 0.025, 16, 100),
      new THREE.MeshBasicMaterial({
        color: 0xff65b8,
        transparent: true,
        opacity: 0.65,
      }),
    );

    heartRing.position.set(0, 1.05, -0.05);

    scene.add(heartRing);

    // =========================================
    // PHOTO 1
    // =========================================

    const photoPortal1 = new THREE.Group();

    photoPortal1.position.set(0, 0.35, -1.5);
    photoPortal1.scale.set(0, 0, 0);

    scene.add(photoPortal1);

    const photo1Frame = new THREE.Mesh(
      new THREE.TorusGeometry(2.05, 0.16, 24, 128),
      new THREE.MeshPhysicalMaterial({
        color: 0xff4ba8,
        emissive: 0x7d1450,
        emissiveIntensity: 2,
        metalness: 0.4,
        roughness: 0.2,
        clearcoat: 1,
      }),
    );

    photoPortal1.add(photo1Frame);

    const loader = new THREE.TextureLoader();

    const photo1Texture = loader.load("/photo1.jpg");
    photo1Texture.colorSpace = THREE.SRGBColorSpace;

    const photo1 = new THREE.Mesh(
      new THREE.CircleGeometry(1.82, 96),
      new THREE.MeshBasicMaterial({
        map: photo1Texture,
        side: THREE.DoubleSide,
      }),
    );

    photo1.position.z = -0.03;
    photo1.scale.set(1, 1.15, 1);

    photoPortal1.add(photo1);

    const photo1Light = new THREE.PointLight(0xff4ba8, 0, 7);

    photo1Light.position.z = 1;

    photoPortal1.add(photo1Light);

    // =========================================
    // VIDEO 1
    // =========================================

    const videoGroup = new THREE.Group();

    videoGroup.position.set(0, 0.4, -4.5);
    videoGroup.scale.set(0, 0, 0);

    scene.add(videoGroup);

    const video = document.createElement("video");

    video.src = "/video1.mp4";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const videoTexture = new THREE.VideoTexture(video);

    videoTexture.colorSpace = THREE.SRGBColorSpace;

    const videoFrame = new THREE.Mesh(
      new THREE.PlaneGeometry(3.65, 5.2),
      new THREE.MeshBasicMaterial({
        map: videoTexture,
        side: THREE.DoubleSide,
      }),
    );

    videoFrame.position.z = -0.04;

    videoGroup.add(videoFrame);

    const videoBorder = new THREE.Mesh(
      new THREE.TorusGeometry(2.02, 0.075, 20, 100),
      new THREE.MeshPhysicalMaterial({
        color: 0x9c68ff,
        emissive: 0x4a247d,
        emissiveIntensity: 2,
        metalness: 0.45,
        roughness: 0.2,
        clearcoat: 1,
      }),
    );

    videoBorder.scale.set(0.9, 1.28, 1);

    videoGroup.add(videoBorder);

    const videoLight = new THREE.PointLight(0x9c68ff, 0, 8);

    videoLight.position.z = 1;

    videoGroup.add(videoLight);

    // =========================================
    // PHOTO 2
    // =========================================

    const photoPortal2 = new THREE.Group();

    photoPortal2.position.set(0, 0.4, -7.5);
    photoPortal2.scale.set(0, 0, 0);

    scene.add(photoPortal2);

    const photo2Frame = new THREE.Mesh(
      new THREE.TorusGeometry(2.05, 0.16, 24, 128),
      new THREE.MeshPhysicalMaterial({
        color: 0xffb05e,
        emissive: 0x713514,
        emissiveIntensity: 1.8,
        metalness: 0.45,
        roughness: 0.2,
        clearcoat: 1,
      }),
    );

    photoPortal2.add(photo2Frame);

    const photo2Texture = loader.load("/photo2.jpg");

    photo2Texture.colorSpace = THREE.SRGBColorSpace;

    const photo2 = new THREE.Mesh(
      new THREE.CircleGeometry(1.82, 96),
      new THREE.MeshBasicMaterial({
        map: photo2Texture,
        side: THREE.DoubleSide,
      }),
    );

    photo2.position.z = -0.03;
    photo2.scale.set(1, 1.15, 1);

    photoPortal2.add(photo2);

    const photo2Light = new THREE.PointLight(0xff9a52, 0, 8);

    photo2Light.position.z = 1;

    photoPortal2.add(photo2Light);

    // =========================================
    // VIDEO 2
    // =========================================

    const videoGroup2 = new THREE.Group();

    videoGroup2.position.set(0, 0.4, -10.5);
    videoGroup2.scale.set(0, 0, 0);

    scene.add(videoGroup2);

    const video2 = document.createElement("video");

    video2.src = "/video2.mp4";
    video2.loop = true;
    video2.muted = true;
    video2.playsInline = true;
    video2.preload = "auto";

    const videoTexture2 = new THREE.VideoTexture(video2);

    videoTexture2.colorSpace = THREE.SRGBColorSpace;

    const videoFrame2 = new THREE.Mesh(
      new THREE.PlaneGeometry(3.65, 5.2),
      new THREE.MeshBasicMaterial({
        map: videoTexture2,
        side: THREE.DoubleSide,
      }),
    );

    videoFrame2.position.z = -0.04;

    videoGroup2.add(videoFrame2);

    const videoBorder2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.02, 0.075, 20, 100),
      new THREE.MeshPhysicalMaterial({
        color: 0x54b8ff,
        emissive: 0x183f7d,
        emissiveIntensity: 2,
        metalness: 0.45,
        roughness: 0.2,
        clearcoat: 1,
      }),
    );

    videoBorder2.scale.set(0.9, 1.28, 1);

    videoGroup2.add(videoBorder2);

    const videoLight2 = new THREE.PointLight(0x54b8ff, 0, 8);

    videoLight2.position.z = 1;

    videoGroup2.add(videoLight2);

    // =========================================
    // FINAL HEART
    // =========================================

    const finalHeartGroup = new THREE.Group();

    finalHeartGroup.position.set(0, 0.6, -14);
    finalHeartGroup.scale.set(0, 0, 0);

    scene.add(finalHeartGroup);

    const finalHeart = new THREE.Mesh(
      heartGeometry.clone(),
      new THREE.MeshPhysicalMaterial({
        color: 0xff4fa8,
        emissive: 0x8b164e,
        emissiveIntensity: 2.2,
        roughness: 0.15,
        metalness: 0.3,
        clearcoat: 1,
      }),
    );

    finalHeart.scale.set(1.25, 1.25, 1.25);

    finalHeartGroup.add(finalHeart);

    const finalRing = new THREE.Mesh(
      new THREE.TorusGeometry(2, 0.025, 16, 100),
      new THREE.MeshBasicMaterial({
        color: 0xff9cd1,
        transparent: true,
        opacity: 0.7,
      }),
    );

    finalHeartGroup.add(finalRing);

    const finalLight = new THREE.PointLight(0xff4fa8, 0, 10);

    finalLight.position.z = 1;

    finalHeartGroup.add(finalLight);

    // =========================================
    // PARTICLES
    // =========================================

    const particleCount = 1000;

    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 4 + Math.random() * 13;
      const angle = Math.random() * Math.PI * 2;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = -1.2 + Math.random() * 8;
      positions[i * 3 + 2] = Math.sin(angle) * radius - 2;
    }

    const particleGeometry = new THREE.BufferGeometry();

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xff8ac8,
        size: 0.025,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      }),
    );

    scene.add(particles);

    // =========================================
    // MOUSE
    // =========================================

    const mouse = {
      x: 0,
      y: 0,
    };

    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // =========================================
    // HELPERS
    // =========================================

    const moveTowards = (object, target, speed) => {
      object.position.x += (target.x - object.position.x) * speed;
      object.position.y += (target.y - object.position.y) * speed;
      object.position.z += (target.z - object.position.z) * speed;
    };

    const scaleTowards = (object, target, speed) => {
      object.scale.x += (target - object.scale.x) * speed;
      object.scale.y += (target - object.scale.y) * speed;
      object.scale.z += (target - object.scale.z) * speed;
    };

    // =========================================
    // ANIMATION
    // =========================================

    const clock = new THREE.Clock();

    let animationFrame;

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const stage = stageRef.current;

      // =======================================
      // CAMERA
      // =======================================

      let cameraTargetZ = 9;
      let cameraTargetY = 1.2;

      let lookY = 0.8;
      let lookZ = 0;

      if (stage === 0) {
        const introProgress = Math.min(elapsed / 8.5, 1);
        const eased = 1 - Math.pow(1 - introProgress, 3);

        camera.position.z = 18 - eased * 9;
        camera.position.y = 3.2 - eased * 2;

        cameraTargetZ = 9;
        cameraTargetY = 1.2;

        lookY = 0.8;
        lookZ = 0;
      }

      if (stage === 1) {
        cameraTargetZ = 4.8;
        cameraTargetY = 0.55;

        lookY = 0.35;
        lookZ = -1.5;
      }

      if (stage === 2) {
        cameraTargetZ = 5.5;
        cameraTargetY = 0.6;

        lookY = 0.4;
        lookZ = -4.5;
      }

      if (stage === 3) {
        cameraTargetZ = 5.8;
        cameraTargetY = 0.6;

        lookY = 0.4;
        lookZ = -7.5;
      }

      if (stage === 4) {
        cameraTargetZ = 6;
        cameraTargetY = 0.6;

        lookY = 0.4;
        lookZ = -10.5;
      }

      if (stage === 5) {
        cameraTargetZ = 5.7;
        cameraTargetY = 0.6;

        lookY = 0.55;
        lookZ = -14;
      }

      if (stage !== 0) {
        camera.position.z += (cameraTargetZ - camera.position.z) * 0.018;

        camera.position.y += (cameraTargetY - camera.position.y) * 0.018;
      }

      // Cinematic camera breathing.
      const cameraDriftX = Math.sin(elapsed * 0.23) * 0.045;

      const cameraDriftY = Math.sin(elapsed * 0.17) * 0.025;

      camera.position.x +=
        (mouse.x * 0.35 + cameraDriftX - camera.position.x) * 0.025;

      camera.position.y += cameraDriftY;

      camera.lookAt(Math.sin(elapsed * 0.18) * 0.025, lookY, lookZ);

      // =======================================
      // MAIN HEART
      // =======================================

      if (stage === 0) {
        const pulse = 1 + Math.sin(elapsed * 2.3) * 0.025;

        heart.scale.set(1.15 * pulse, 1.15 * pulse, 1.15 * pulse);

        heart.position.y = 1.05 + Math.sin(elapsed * 0.9) * 0.08;

        heart.position.z = 0;
      }

      if (stage >= 1) {
        scaleTowards(heart, 0.001, 0.035);

        moveTowards(
          heart,
          {
            x: 0,
            y: 1.05,
            z: 5,
          },
          0.025,
        );
      }

      heart.rotation.y = Math.sin(elapsed * 0.35) * 0.025;

      heartRing.rotation.z = elapsed * 0.12;

      heartRing.rotation.y = elapsed * 0.08;

      // =======================================
      // PHOTO 1
      // =======================================

      if (stage === 1) {
        scaleTowards(photoPortal1, 1, 0.045);

        moveTowards(
          photoPortal1,
          {
            x: 0,
            y: 0.35,
            z: -1.5,
          },
          0.035,
        );

        // Subtle 3D depth movement.
        photoPortal1.rotation.y = Math.sin(elapsed * 0.45) * 0.035;

        photoPortal1.rotation.x = Math.sin(elapsed * 0.32) * 0.018;

        photo1Frame.rotation.z = elapsed * 0.12;

        photo1Light.intensity += (4 - photo1Light.intensity) * 0.04;
      }

      if (stage >= 2) {
        scaleTowards(photoPortal1, 0.001, 0.045);

        moveTowards(
          photoPortal1,
          {
            x: 0,
            y: 0.35,
            z: -14,
          },
          0.045,
        );

        photo1Light.intensity += (0 - photo1Light.intensity) * 0.08;
      }

      // =======================================
      // VIDEO 1
      // =======================================

      if (stage === 2) {
        scaleTowards(videoGroup, 1, 0.045);

        moveTowards(
          videoGroup,
          {
            x: 0,
            y: 0.4,
            z: -4.5,
          },
          0.035,
        );

        // Subtle 3D depth movement.
        videoGroup.rotation.y = Math.sin(elapsed * 0.5) * 0.045;

        videoGroup.rotation.x = Math.sin(elapsed * 0.38) * 0.022;

        videoBorder.rotation.z = Math.sin(elapsed * 0.35) * 0.015;

        videoLight.intensity += (5 - videoLight.intensity) * 0.04;

        if (video.readyState >= 2) {
          video.play().catch(() => {});
        }
      }

      if (stage !== 2) {
        scaleTowards(videoGroup, 0.001, 0.035);

        moveTowards(
          videoGroup,
          {
            x: 0,
            y: 0.4,
            z: -15,
          },
          0.04,
        );

        videoLight.intensity += (0 - videoLight.intensity) * 0.08;

        if (!video.paused) {
          video.pause();
        }
      }

      // =======================================
      // PHOTO 2
      // =======================================

      if (stage === 3) {
        scaleTowards(photoPortal2, 1, 0.045);

        moveTowards(
          photoPortal2,
          {
            x: 0,
            y: 0.4,
            z: -7.5,
          },
          0.035,
        );

        // Subtle 3D depth movement.
        photoPortal2.rotation.y = Math.sin(elapsed * 0.38) * 0.03;

        photoPortal2.rotation.x = Math.sin(elapsed * 0.28) * 0.015;

        photo2Frame.rotation.z = Math.sin(elapsed * 0.4) * 0.04;

        photo2Light.intensity += (5 - photo2Light.intensity) * 0.04;
      }

      if (stage !== 3) {
        scaleTowards(photoPortal2, 0.001, 0.035);

        moveTowards(
          photoPortal2,
          {
            x: 0,
            y: 0.4,
            z: -18,
          },
          0.04,
        );

        photo2Light.intensity += (0 - photo2Light.intensity) * 0.08;
      }

      // =======================================
      // VIDEO 2
      // =======================================

      if (stage === 4) {
        scaleTowards(videoGroup2, 1, 0.045);

        moveTowards(
          videoGroup2,
          {
            x: 0,
            y: 0.4,
            z: -10.5,
          },
          0.035,
        );

        // Subtle 3D depth movement.
        videoGroup2.rotation.y = Math.sin(elapsed * 0.48) * 0.05;

        videoGroup2.rotation.x = Math.sin(elapsed * 0.35) * 0.025;

        videoBorder2.rotation.z = Math.sin(elapsed * 0.35) * 0.015;

        videoLight2.intensity += (5 - videoLight2.intensity) * 0.04;

        if (video2.readyState >= 2) {
          video2.play().catch(() => {});
        }
      }

      if (stage !== 4) {
        scaleTowards(videoGroup2, 0.001, 0.035);

        moveTowards(
          videoGroup2,
          {
            x: 0,
            y: 0.4,
            z: -20,
          },
          0.04,
        );

        videoLight2.intensity += (0 - videoLight2.intensity) * 0.08;

        if (!video2.paused) {
          video2.pause();
        }
      }

      // =======================================
      // FINAL HEART
      // =======================================

      if (stage === 5) {
        scaleTowards(finalHeartGroup, 1, 0.035);

        moveTowards(
          finalHeartGroup,
          {
            x: 0,
            y: 0.6,
            z: -14,
          },
          0.035,
        );

        const finalPulse = 1 + Math.sin(elapsed * 1.8) * 0.025;

        finalHeart.scale.set(
          1.25 * finalPulse,
          1.25 * finalPulse,
          1.25 * finalPulse,
        );

        finalHeart.rotation.y = elapsed * 0.2;

        finalRing.rotation.z = elapsed * 0.15;

        finalRing.scale.set(
          1 + Math.sin(elapsed * 1.1) * 0.035,
          1 + Math.sin(elapsed * 1.1) * 0.035,
          1,
        );

        finalLight.intensity += (6 - finalLight.intensity) * 0.04;
      }

      if (stage !== 5) {
        scaleTowards(finalHeartGroup, 0.001, 0.025);

        finalLight.intensity += (0 - finalLight.intensity) * 0.06;
      }

      // =======================================
      // PARTICLES
      // =======================================

      particles.rotation.y = elapsed * 0.012;

      particles.rotation.x = Math.sin(elapsed * 0.15) * 0.03;

      // =======================================
      // PLATFORM
      // =======================================

      ring1.rotation.z = elapsed * 0.08;

      ring2.rotation.z = -elapsed * 0.055;

      renderer.render(scene, camera);
    };

    animate();

    // =========================================
    // RESIZE
    // =========================================

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // =========================================
    // CLEANUP
    // =========================================

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener("mousemove", handleMouseMove);

      window.removeEventListener("resize", handleResize);

      video.pause();
      video2.pause();

      video.src = "";
      video2.src = "";

      videoTexture.dispose();
      videoTexture2.dispose();

      photo1Texture.dispose();
      photo2Texture.dispose();

      heartGeometry.dispose();

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // =========================================
  // ENTER
  // =========================================

  const handleEnter = () => {
    setEntered(true);

    stageRef.current = 0;

    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setAudioPlaying(true);
        })
        .catch(() => {});
    }
  };

  // =========================================
  // PHOTO 1
  // =========================================

  const showPhotoOne = () => {
    stageRef.current = 1;
    setSceneTwo(true);
  };

  // =========================================
  // VIDEO 1
  // =========================================

  const showVideoOne = () => {
    stageRef.current = 2;
    setSceneThree(true);
  };

  // =========================================
  // PHOTO 2
  // =========================================

  const showPhotoTwo = () => {
    stageRef.current = 3;
    setSceneFour(true);
  };

  // =========================================
  // VIDEO 2
  // =========================================

  const showVideoTwo = () => {
    stageRef.current = 4;
    setSceneFive(true);
  };

  // =========================================
  // FINAL
  // =========================================

  const showFinal = () => {
    stageRef.current = 5;
    setFinalScene(true);
  };

  // =========================================
  // MUSIC
  // =========================================

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setAudioPlaying(true);
        })
        .catch(() => {});
    }
  };

  return (
    <main className="scene">
      <div ref={mountRef} className="three-container" />

      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />

      {/* INTRO */}

      <section className={`intro ${entered ? "intro-hidden" : ""}`}>
        <div className="intro-content">
          <p className="eyebrow">A LITTLE WORLD MADE FOR TWO</p>

          <h1>
            Olivia
            <span>&</span>
            Matthew
          </h1>

          <p className="intro-text">Some stories deserve more than words.</p>

          <button className="enter-button" onClick={handleEnter}>
            Enter our world
          </button>
        </div>
      </section>

      {/* STORY */}

      <section
        className={`story ${entered && !sceneTwo ? "story-visible" : ""}`}
      >
        <div className="story-content">
          <p className="story-label">OUR STORY</p>

          <h2>It started with you.</h2>

          <p>
            And somehow, every moment since has felt a little more meaningful.
          </p>

          <button className="story-button" onClick={showPhotoOne}>
            See our memories
          </button>
        </div>
      </section>

      {/* PHOTO 1 */}

      <section
        className={`memory ${sceneTwo && !sceneThree ? "memory-visible" : ""}`}
      >
        <div className="memory-content">
          <p className="story-label">MEMORY ONE</p>

          <h2>Moments I’d keep forever.</h2>

          <p>A moment, frozen in time.</p>

          <button className="story-button" onClick={showVideoOne}>
            One more memory
          </button>
        </div>
      </section>

      {/* VIDEO 1 */}

      <section
        className={`video-story ${
          sceneThree && !sceneFour ? "video-story-visible" : ""
        }`}
      >
        <div className="video-story-content">
          <p className="story-label">MEMORY TWO</p>

          <h2>And then there were moments like this.</h2>

          <p>The kind of moments I never want to forget.</p>

          <button className="story-button" onClick={showPhotoTwo}>
            Keep going
          </button>
        </div>
      </section>

      {/* PHOTO 2 */}

      <section
        className={`final-memory ${
          sceneFour && !sceneFive ? "final-memory-visible" : ""
        }`}
      >
        <div className="final-memory-content">
          <p className="story-label">MEMORY THREE</p>

          <h2>Another moment. Another reason.</h2>

          <p>
            Somehow, you keep becoming one of my favorite parts of every memory.
          </p>

          <button className="story-button" onClick={showVideoTwo}>
            One last memory
          </button>
        </div>
      </section>

      {/* VIDEO 2 */}

      <section
        className={`video-story ${
          sceneFive && !finalScene ? "video-story-visible" : ""
        }`}
      >
        <div className="video-story-content">
          <p className="story-label">MEMORY FOUR</p>

          <h2>And I would choose this story again.</h2>

          <p>Because somehow, every memory leads back to you.</p>

          <button className="story-button" onClick={showFinal}>
            Stay with me
          </button>
        </div>
      </section>

      {/* FINAL MESSAGE */}

      <section
        className={`final-memory ${finalScene ? "final-memory-visible" : ""}`}
      >
        <div className="final-memory-content">
          <p className="story-label">FOR OLIVIA</p>

          <h2>If I could keep one thing forever, it would be us.</h2>

          <p>
            Thank you for becoming one of the most beautiful parts of my story.
          </p>
        </div>
      </section>

      {/* MUSIC */}

      <button className="music-button" onClick={toggleMusic}>
        {audioPlaying ? "Music on" : "Music off"}
      </button>
    </main>
  );
}

export default App;
