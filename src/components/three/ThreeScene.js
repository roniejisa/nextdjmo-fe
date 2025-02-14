"use client"
// components/ThreeRobot.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function ThreeRobot() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    
    // Tạo scene nhưng không đặt background (để renderer có thể hiển thị nền trong suốt)
    const scene = new THREE.Scene();

    // Tạo camera với fov hẹp hơn để “zoom” vào robot
    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      1,
      1000
    );
    camera.position.set(0, 100, 300);
    camera.lookAt(0, 60, 0);

    // Tạo renderer với alpha:true để nền có thể trong suốt
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true; // bật đổ bóng
    mount.appendChild(renderer.domElement);

    // OrbitControls cho phép bạn xoay camera
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 60, 0);
    controls.update();

    // Ánh sáng: giảm AmbientLight để tránh làm phẳng bề mặt robot
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 200, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;
    scene.add(directionalLight);

    // Tạo robot dưới dạng Group (bỏ mặt đất để không gây phân tâm)
    const robot = new THREE.Group();
    scene.add(robot);

    // --- Thân Robot ---
    const bodyGeometry = new THREE.BoxGeometry(50, 80, 30);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 40; // trung tâm của thân
    body.castShadow = true;
    body.receiveShadow = true;
    robot.add(body);

    // --- Đầu Robot ---
    const headGeometry = new THREE.BoxGeometry(30, 30, 30);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 100;
    head.castShadow = true;
    head.receiveShadow = true;
    robot.add(head);

    // --- Tay Robot ---
    const armGeometry = new THREE.BoxGeometry(10, 40, 10);
    const armMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-30, 60, 0);
    leftArm.castShadow = true;
    leftArm.receiveShadow = true;
    robot.add(leftArm);
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(30, 60, 0);
    rightArm.castShadow = true;
    rightArm.receiveShadow = true;
    robot.add(rightArm);

    // --- Chân Robot ---
    const legGeometry = new THREE.BoxGeometry(10, 40, 10);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-15, 20, 0);
    leftLeg.castShadow = true;
    leftLeg.receiveShadow = true;
    robot.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(15, 20, 0);
    rightLeg.castShadow = true;
    rightLeg.receiveShadow = true;
    robot.add(rightLeg);

    // --- Animation cho robot ---
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      // Ví dụ: làm cho đầu robot chuyển động (gật/cúi)
      head.rotation.x = Math.sin(time) * 0.2;
      head.rotation.y = Math.sin(time * 0.5) * 0.5;
      renderer.render(scene, camera);
    }
    animate();

    // Xử lý Resize
    const handleResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100vh',
        /* CSS Background với gradient thay cho nền đen đơn giản */
        background: 'linear-gradient(to bottom, #2c3e50, #000000)',
      }}
    />
  );
}
