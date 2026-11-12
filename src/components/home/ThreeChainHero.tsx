import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ChevronDown } from 'lucide-react';

export const ThreeChainHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Detect software WebGL / device capabilities
    const COUNT = 80;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

    // Step 7: Environment map (essential for chrome/metal reflections)
    const envScene = new THREE.Scene();
    envScene.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(40, 40, 40),
        new THREE.MeshBasicMaterial({ color: 0x151212, side: THREE.BackSide })
      )
    );

    const envBoxes: [number, number, number, number, number, number, number][] = [
      [0, 15, 0, 20, 1, 20, 0xffffff],
      [-15, 0, 5, 1, 12, 12, 0xffffff],
      [15, 0, -5, 1, 10, 10, 0xffd9b0],
      [0, -10, 12, 16, 1, 6, 0x888888],
    ];

    envBoxes.forEach(([x, y, z, w, h, d, c]) => {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshBasicMaterial({ color: c })
      );
      m.position.set(x, y, z);
      envScene.add(m);
    });

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(envScene).texture;
    scene.environment = envTexture;
    pmrem.dispose();

    // Step 1: One link = TorusGeometry(0.5, 0.12) stretched in y by 1.6
    const geo = new THREE.TorusGeometry(0.5, 0.12, 24, 48);
    geo.scale(1, 1.6, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1,
      roughness: 0.2,
    });

    // Step 2: 80 links in one InstancedMesh (one single draw call)
    const chain = new THREE.InstancedMesh(geo, mat, COUNT);
    chain.frustumCulled = false;
    scene.add(chain);

    // Step 3: Path CatmullRomCurve3 passing across the entire experience
    const curve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-9, 6, 0),
        new THREE.Vector3(-2, 4, 1),
        new THREE.Vector3(5, 5, -1),
        new THREE.Vector3(8, 0, 0.5),
        new THREE.Vector3(2, -2, 1.5),
        new THREE.Vector3(-6, -3, 0),
        new THREE.Vector3(-8, -6, -1),
        new THREE.Vector3(0, -7, 1),
        new THREE.Vector3(9, -6, 0),
      ],
      false,
      'catmullrom',
      0.5
    );

    const spacing = curve.getLength() / COUNT;
    const linkScale = spacing / 1.25; // Neighboring links overlap and interlock

    // Step 8: Dynamic light color per section: white, red, cyan rgb(80, 220, 255)
    const colors = [
      new THREE.Color(1, 1, 1),
      new THREE.Color(1, 0.1, 0.1),
      new THREE.Color(80 / 255, 220 / 255, 1),
    ];
    const light1 = new THREE.PointLight(0xffffff, 3.5, 0, 2);
    light1.position.set(-6, 6, 8);
    const light2 = new THREE.PointLight(0xffffff, 2.5, 0, 2);
    light2.position.set(8, -4, 6);
    scene.add(light1, light2, new THREE.AmbientLight(0xffffff, 0.2));

    // Reusable math helpers to avoid garbage collection in animation loop
    const up = new THREE.Vector3(0, 1, 0);
    const yAxis = new THREE.Vector3(0, 1, 0);
    const p = new THREE.Vector3();
    const tan = new THREE.Vector3();
    const q = new THREE.Quaternion();
    const q90 = new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 2);
    const dummy = new THREE.Object3D();
    const tmpC = new THREE.Color();

    let target = 0;
    let offset = 0;

    // Step 6: Scroll moves the chain offset smoothly
    const updateScrollProgress = () => {
      const rect = container.getBoundingClientRect();
      const scrollableDist = rect.height - window.innerHeight;
      if (scrollableDist <= 0) {
        target = 0;
        return;
      }
      const scrolled = -rect.top;
      const progress = Math.min(1, Math.max(0, scrolled / scrollableDist));
      target = progress;
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    const handleResize = () => {
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.set(0, 0, Math.max(15, 17 / camera.aspect));
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    let animationFrameId = 0;

    const frame = () => {
      offset += (target - offset) * 0.08;
      const off = offset * 1.2;

      for (let i = 0; i < COUNT; i++) {
        // Step 4: t = (i / 80 + offset) % 1, getPointAt + getTangentAt
        const t = (((i / COUNT + off) % 1) + 1) % 1;
        curve.getPointAt(t, p);
        curve.getTangentAt(t, tan);
        q.setFromUnitVectors(up, tan);

        // Step 5: Every second link turned 90° around tangent so links interlock
        if (i % 2) {
          q.multiply(q90);
        }

        dummy.position.copy(p);
        dummy.quaternion.copy(q);
        dummy.scale.setScalar(linkScale);
        dummy.updateMatrix();
        chain.setMatrixAt(i, dummy.matrix);
      }
      chain.instanceMatrix.needsUpdate = true;

      // Lighting interpolation between white -> red -> cyan
      const s = target * 2;
      const i0 = Math.min(1, Math.floor(s));
      const f = Math.min(1, s - i0);
      tmpC.copy(colors[i0]).lerp(colors[i0 + 1], f);
      light1.color.copy(tmpC);
      light2.color.copy(tmpC);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(frame);
    };

    frame();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', handleResize);

      geo.dispose();
      mat.dispose();
      envTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative bg-[#0b0909] text-[#f4efe8] overflow-hidden select-none border-b border-amber-900/30"
      style={{ minHeight: '300vh' }}
    >
      {/* Sticky 3D WebGL Canvas Layer */}
      <div className="sticky top-0 left-0 w-full h-screen pointer-events-none z-0 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />
        {/* Subtle royal vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0909]/80 via-transparent to-[#0b0909]/60 pointer-events-none" />
      </div>

      {/* Top Floating Mini-Nav Overlay */}
      <div className="fixed top-20 left-0 right-0 z-20 pointer-events-none px-6 sm:px-12 flex justify-between items-center text-[11px] sm:text-xs tracking-[0.25em] font-semibold text-amber-200/80">
        <span className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          AL-HARAM CLOTH STORE • 3D KINETIC CHAIN
        </span>
        <span className="hidden sm:inline text-stone-400">
          SCROLL TO PULL & INTERLOCK
        </span>
      </div>

      {/* 3 Interactive Story Sections Overlaid */}
      <div className="relative z-10 -mt-[100vh]">
        {/* Section 1: Luxury Eastern Wear (White Light Stage) */}
        <section className="min-h-screen flex flex-col justify-center px-6 sm:px-16 lg:px-24 max-w-4xl">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-stone-200 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Kinetic Haute Couture
            </div>

            <h1 className="font-serif-luxury text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-white leading-[1.05]">
              Luxury
              <br />
              <span className="italic font-light text-amber-200">
                Eastern Wear
              </span>
            </h1>

            <p className="max-w-md text-stone-300 font-sans text-sm sm:text-base leading-relaxed">
              Premium unstitched fabric, festive prêt, luxury lawn, khaddar and
              pure Giza cotton, handcrafted with generational mastery.
            </p>

            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 border border-stone-200 text-stone-100 font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-stone-950 transition-all shadow-xl group"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="pt-8 flex items-center gap-2 text-xs text-stone-400 tracking-wider">
              <span>Scroll to pull chain</span>
              <ChevronDown className="w-4 h-4 text-amber-400 animate-bounce" />
            </div>
          </div>
        </section>

        {/* Section 2: Festive Prêt (Crimson Red Light Stage) */}
        <section className="min-h-screen flex flex-col justify-center items-end text-right px-6 sm:px-16 lg:px-24">
          <div className="max-w-md space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
              <span>Imperial Crimson Edition</span>
            </div>

            <h2 className="font-serif-luxury text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-white leading-[1.05]">
              Festive
              <br />
              <span className="italic font-light text-rose-300">Prêt</span>
            </h2>

            <p className="text-stone-300 font-sans text-sm sm:text-base leading-relaxed">
              Designer pieces crafted for your most special festive occasions,
              featuring delicate zari embroidery and bespoke hand-embellished
              necklines.
            </p>

            <div className="pt-2">
              <Link
                to="/shop?category=cat-pret"
                className="inline-flex items-center gap-2 px-6 py-3 border border-rose-300/80 text-rose-100 font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-rose-500 hover:text-white transition-all shadow-xl group"
              >
                <span>EXPLORE</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 3: Unstitched Fabric (Luminous Cyan Light Stage) */}
        <section className="min-h-screen flex flex-col justify-center px-6 sm:px-16 lg:px-24 max-w-4xl">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
              <span>Heirloom Weaves</span>
            </div>

            <h2 className="font-serif-luxury text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-white leading-[1.05]">
              Unstitched
              <br />
              <span className="italic font-light text-cyan-300">Fabric</span>
            </h2>

            <p className="max-w-md text-stone-300 font-sans text-sm sm:text-base leading-relaxed">
              Fine Swiss voile lawn, handspun khaddar, and royal Egyptian
              cotton, woven to last through generations of timeless elegance.
            </p>

            <div className="pt-2">
              <Link
                to="/shop?category=cat-unstitched"
                className="inline-flex items-center gap-2 px-6 py-3 border border-cyan-300/80 text-cyan-100 font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-cyan-400 hover:text-stone-950 transition-all shadow-xl group"
              >
                <span>VIEW FABRICS</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="pt-8 flex items-center gap-2 text-xs text-stone-400 tracking-wider">
              <span>Scroll down to continue to store</span>
              <ChevronDown className="w-4 h-4 text-cyan-400 animate-bounce" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
