"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three"; // Import thư viện Three.js cơ bản
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; // Import GLTFLoader để load file .glb
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // Import OrbitControls để điều khiển camera bằng chuột

// Component AvatarCanvas nhận props: modelUrl (đường dẫn mô hình .glb) và action (tên hoặc chỉ số animation)
const AvatarCanvas = ({
  modelUrl,
  action,
  setAction,
  triggerEnter,
  setTriggerEnter,
}) => {
  const bubbleSpriteRef = useRef(null); // Ref cho bubble (sprite)
  const containerRef = useRef(null); // useRef để lấy thẻ DOM container nơi sẽ gắn canvas Three.js
  const mixerRef = useRef(null); // useRef để lưu AnimationMixer (quản lý animation của mô hình)
  const actionsRef = useRef({}); // useRef để lưu các hành động (AnimationAction) theo tên
  const modelRef = useRef(null); // 👈 để lưu mô hình chính
  const animationMap = {
    walk: "/animation/feminine/glb/locomotion/F_Walk_002.glb",
    jump: "/animation/feminine/glb/locomotion/F_Jog_Jump_Small_001.glb",
    dance: "/animation/feminine/glb/dance/F_Dances_001.glb",
    talk: "/animation/feminine/glb/expression/M_Talking_Variations_007.glb",
    standing: "/animation/feminine/glb/idle/F_Standing_Idle_001.glb",
    // ...
  };
  const actionsListRef = useRef([]); // useRef để lưu danh sách các AnimationAction theo chỉ số
  const currentActionRef = useRef(null); // useRef để lưu AnimationAction hiện tại đang phát
  const clockRef = useRef(new THREE.Clock()); // useRef để lưu đối tượng Clock đo thời gian phục vụ animation
  const requestIdRef = useRef(null); // useRef để lưu ID của requestAnimationFrame (để huỷ khi unmount)

  ///////////////////////////////////////////////////////////////////////////
  // 1) HÀM TẠO BUBBLE - VẼ CHO ĐẸP, CHUẨN HOẠT HÌNH, HỖ TRỢ TYPING
  ///////////////////////////////////////////////////////////////////////////

  // Hàm tạo bubble canvas & trả về sprite
  function createThoughtBubble(text) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // style setup
    const fontSize = 22;
    const maxTextWidth = 280;
    const lineHeight = fontSize + 8;
    ctx.font = `600 ${fontSize}px 'Segoe UI', sans-serif`;

    // Tách dòng nếu text dài
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";
    for (let word of words) {
      const testLine = currentLine + word + " ";
      const { width } = ctx.measureText(testLine);
      if (width > maxTextWidth && currentLine) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());

    // Tính kích cỡ bong bóng
    const paddingX = 24;
    const paddingY = 20;
    const ellipseWidth = maxTextWidth + paddingX * 2;
    const ellipseHeight = lines.length * lineHeight + paddingY * 2;
    canvas.width = ellipseWidth;
    // +60 cho 3 chấm suy nghĩ
    canvas.height = ellipseHeight + 60;

    // Vẽ bong bóng
    ctx.font = `600 ${fontSize}px 'Segoe UI', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;

    // Vẽ ellipse
    ctx.beginPath();
    ctx.ellipse(
      canvas.width / 2,
      ellipseHeight / 2,
      ellipseWidth / 2 - 10,
      ellipseHeight / 2 - 10,
      0,
      0,
      Math.PI * 2
    );
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.stroke();

    // Vẽ chấm suy nghĩ
    const dotX = canvas.width / 2;
    const dotStart = ellipseHeight;
    [10, 7, 4].forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(dotX, dotStart + i * 15 + r, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Vẽ text
    ctx.fillStyle = "#000";
    lines.forEach((line, i) => {
      ctx.fillText(
        line,
        canvas.width / 2,
        paddingY + (i + 1) * lineHeight - 8
      );
    });

    // Convert sang Sprite
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);

    // scaleFactor: thu nhỏ bubble
    const scaleFactor = 0.007;
    sprite.scale.set(canvas.width * scaleFactor, canvas.height * scaleFactor, 1);

    return sprite;
  }

  //////////////////////////////////////////////////////////////////////
  // 2) HÀM HIỂN THỊ BUBBLE VỚI HIỆU ỨNG TỪNG CHỮ (typing) + THỜI GIAN
  //////////////////////////////////////////////////////////////////////

  /**
   * showBubble(scene, model, fullText = 'Hmm...', delay = 50, duration = 5000)
   * - fullText: nội dung
   * - delay: thời gian giữa mỗi ký tự (typing effect)
   * - duration: thời gian hiển thị xong (khi gõ hết)
   */
  async function showBubble(
    scene,
    model,
    fullText = "Hmm...",
    delay = 50,
    duration = 3000
  ) {
    // Gõ từng chữ
    for (let i = 1; i <= fullText.length; i++) {
      const displayedText = fullText.slice(0, i);

      // Clear bubble cũ
      if (bubbleSpriteRef.current) {
        scene.remove(bubbleSpriteRef.current);
        bubbleSpriteRef.current.material.map.dispose();
        bubbleSpriteRef.current.material.dispose();
        bubbleSpriteRef.current = null;
      }

      // Tạo bubble mới
      const bubble = createThoughtBubble(displayedText);
      bubbleSpriteRef.current = bubble;
      scene.add(bubble);

      // Đặt vị trí bubble trên đầu
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      bubble.position.set(center.x - 0.5, box.max.y + 0.3, center.z);

      // Chờ delay giữa mỗi ký tự
      await new Promise((res) => setTimeout(res, delay));
    }

    // Sau khi gõ xong, chờ 'duration' rồi remove bubble
    await new Promise((res) => setTimeout(res, duration));

    if (bubbleSpriteRef.current) {
      scene.remove(bubbleSpriteRef.current);
      bubbleSpriteRef.current.material.map.dispose();
      bubbleSpriteRef.current.material.dispose();
      bubbleSpriteRef.current = null;
    }
  }

  // useEffect khởi tạo scene, camera, renderer và load model
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#dbeafe");

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1, 2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(3, 5, 2);
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.target.set(0, 0.5, 0);
    controls.update();

    const loader = new GLTFLoader();

    loader.load(
      "/avatar3.glb",
      async (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        modelRef.current = model;

        // Tính toán bounding box và điều chỉnh vị trí, camera
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.x += -center.x;
        model.position.z += -center.z;
        model.position.y += -box.min.y;

        box.setFromObject(model); // Cập nhật lại bounding box sau khi di chuyển
        const sphere = new THREE.Sphere();
        box.getBoundingSphere(sphere);

        camera.near = 0.05;
        camera.far = sphere.radius * 5;
        camera.updateProjectionMatrix();

        camera.position.set(
          sphere.center.x,
          sphere.center.y + 1,
          sphere.center.z + sphere.radius * 4
        );

        controls.target.copy(sphere.center);
        controls.update();

        // Khởi tạo AnimationMixer
        mixerRef.current = new THREE.AnimationMixer(model);
        //actionsRef.current = {}; // Đã khai báo ở trên
        //actionsListRef.current = []; // Đã khai báo ở trên
        setAction("standing");

        // Hiển thị bubble chào hỏi và giới thiệu (typing effect)
        await showBubble(scene, modelRef.current, "Xin chào!", 40, 3000);
        await showBubble(
          scene,
          modelRef.current,
          "Bạn muốn hỏi tôi vấn đề nào nhỉ",
          40,
          5000
        );
      },
      undefined,
      (error) => {
        console.error("Error loading GLTF model:", error);
      }
    );

    const clock = clockRef.current;

    const animate = () => {
      requestIdRef.current = requestAnimationFrame(animate);

      if (mixerRef.current) {
        const delta = clock.getDelta();
        mixerRef.current.update(delta);
      }

      controls.update();
      renderer.render(scene, camera);

      // Cập nhật vị trí bubble (nếu có)
      if (bubbleSpriteRef.current && modelRef.current) {
        const box = new THREE.Box3().setFromObject(modelRef.current);
        const center = box.getCenter(new THREE.Vector3());
        bubbleSpriteRef.current.position.set(
          center.x - 0.5,
          box.max.y + 0.3,
          center.z
        );
      }
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      cancelAnimationFrame(requestIdRef.current);
      controls.dispose();
      renderer.dispose();

      // Giải phóng các tài nguyên liên quan đến bubble
      if (bubbleSpriteRef.current) {
        bubbleSpriteRef.current.material.map.dispose();
        bubbleSpriteRef.current.material.dispose();
        scene.remove(bubbleSpriteRef.current);
        bubbleSpriteRef.current = null;
      }

      // Remove DOM element
      if (renderer.domElement && container) {
        container.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelUrl]);

  // useEffect thứ hai: theo dõi prop 'action' để chuyển đổi animation khi prop thay đổi
  useEffect(() => {
    if (!mixerRef.current || !action) return;

    const playAction = (nextAction) => {
      if (currentActionRef.current) {
        currentActionRef.current.stop();
        currentActionRef.current.reset();
      }

      // Đặt vị trí bắt đầu animation
      nextAction.reset().play();
      currentActionRef.current = nextAction;
    };

    const next = actionsRef.current?.[action];

    if (next) {
      // Đã load -> play luôn
      playAction(next);
    } else {
      // Chưa có -> thử lazy-load từ animationMap
      const url = animationMap[action];

      if (!url) {
        console.warn(`⚠️ Không có animation "${action}" trong animationMap`);
        return;
      }

      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          gltf.animations.forEach((clip, index) => {
            const clipName = action; // Gắn tên action làm key
            const actionClip = mixerRef.current.clipAction(clip);

            actionsRef.current[clipName] = actionClip;
            actionsListRef.current.push(actionClip);

            if (clipName === action) {
              playAction(actionClip);
            }
          });
        },
        undefined,
        (err) => {
          
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

// Hàm di chuyển model vào (có animation)
  const moveModelIn = () => {
    if (!modelRef.current) return;

    const model = modelRef.current;

    // Đặt vị trí bắt đầu ngoài khung
    model.position.x = -5;
    model.rotation.y = Math.PI / 2; // Quay mặt sang phải để đi vào

    import("gsap").then((gsap) => {
      gsap.gsap.to(model.position, {
        x: 0, // Đi vào giữa
        duration: 1.5,
        ease: "power2.out",
        onStart: () => {
          setAction("walk"); // Avatar bắt đầu đi bộ
        },
        onComplete: () => {
          // Quay lại nhìn camera
          gsap.gsap.to(model.rotation, {
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          });
          setAction("talk"); // Bắt đầu nói chuyện
          // Sau 5s -> đi ra
          setTimeout(() => {
            moveModelOut();
          }, 5000);
        },
      });
    });
  };

  // Hàm di chuyển model ra (có animation)
  const moveModelOut = () => {
    if (!modelRef.current) return;

    const model = modelRef.current;

    import("gsap").then((gsap) => {
      // Quay sang trái để đi ra bên phải
      gsap.gsap.to(model.rotation, {
        y: -Math.PI / 2,
        duration: 0.5,
        ease: "power2.inOut",
      });

      // Di chuyển ra khỏi khung bên phải
      gsap.gsap.to(model.position, {
        x: 5,
        duration: 1.2,
        ease: "power2.in",
        onStart: () => {
          setAction("walk"); // Quay lại animation đi bộ
        },
        onComplete: () => {
          setTriggerEnter(false); // Reset trigger
          if (currentActionRef.current) {
            currentActionRef.current.stop();
            currentActionRef.current.reset();
            currentActionRef.current = null;
          }
        },
      });
    });
  };

  // useEffect để xử lý triggerEnter (bắt đầu di chuyển vào)
  useEffect(() => {
    if (triggerEnter) {
      moveModelIn();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerEnter]);

  // JSX trả về: thẻ div làm container, có ref để gắn canvas của Three.js
  // Sử dụng class Tailwind (w-full h-full) để container chiếm toàn bộ kích thước phần tử cha
  // Lưu ý: cần đảm bảo phần tử cha hoặc container này có chiều cao xác định (vd: h-64, h-screen) thì canvas mới hiển thị rõ
  return <div ref={containerRef} className="w-full h-full" />;
};

export default AvatarCanvas;