"use client";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls, OrbitControls } from "@react-three/drei";

function Model({ model, ...props }) {
  const { scene } = useGLTF(model);
  return <primitive object={scene} {...props} />;
}


const FullModel = ({ model }) => {


  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      camera={{ fov: 50, position: [0, 1, 5] }}
      className="absolute inset-0"
    >
      <color attach="background" args={["#efefea"]} />
      <PresentationControls
        speed={1.5}
        global
        zoom={0.5}
        polar={[-Math.PI / 2, Math.PI / 2]}
      >
        <Stage
          environment={"sunset"}
        >
          <Model scale={0.0005} model={model} />
        </Stage>
      </PresentationControls>
      {/* Điều khiển Zoom chi tiết */}
      <OrbitControls
        enableZoom // Kích hoạt khả năng zoom
      />
    </Canvas>
  );
};

export default FullModel;
