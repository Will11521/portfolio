import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { cn } from '@/components/ui/utils';

gsap.registerPlugin(ScrollTrigger);

type HorizonSection = {
  title: string;
  lines: [string, string];
};

interface HorizonHeroSectionProps {
  className?: string;
  embedded?: boolean;
  showChrome?: boolean;
  title?: string;
  subtitleLines?: [string, string];
  sideLabel?: string;
  sections?: HorizonSection[];
  children?: React.ReactNode;
}

type ThreeStore = {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  composer: EffectComposer | null;
  stars: THREE.Points[];
  nebula: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> | null;
  structures: THREE.Object3D[];
  atmosphere: THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial> | null;
  animationId: number | null;
  targetCameraX: number;
  targetCameraY: number;
  targetCameraZ: number;
};

const DEFAULT_SECTIONS: HorizonSection[] = [
  {
    title: 'SIGNAL',
    lines: ['Logic, motion, and visual systems,', 'stitched into one horizon'],
  },
  {
    title: 'SYSTEM',
    lines: ['Grounded in design and analytics,', 'built to feel sharp and human'],
  },
  {
    title: 'DEPTH',
    lines: ['Ideas move slower here,', 'so the details can land harder'],
  },
];

export const HorizonHeroSection = ({
  className,
  embedded = false,
  showChrome = true,
  title = 'SIGNAL',
  subtitleLines = ['Logic, motion, and visual systems,', 'stitched into one horizon'],
  sideLabel = 'SIGNAL',
  sections = DEFAULT_SECTIONS,
  children,
}: HorizonHeroSectionProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef<HTMLDivElement | null>(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 300 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [useFallbackScene, setUseFallbackScene] = useState(false);
  const totalSections = Math.max(sections.length - 1, 1);

  const threeRefs = useRef<ThreeStore>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    structures: [],
    atmosphere: null,
    animationId: null,
    targetCameraX: 0,
    targetCameraY: 30,
    targetCameraZ: 300,
  });

  const titleCharacters = useMemo(() => title.split(''), [title]);

  useEffect(() => {
    const evaluateMode = () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const narrowViewport = window.innerWidth < 960;
      const weakDevice = (navigator.hardwareConcurrency ?? 8) <= 4;
      setUseFallbackScene(reducedMotion || narrowViewport || weakDevice);
    };

    evaluateMode();
    window.addEventListener('resize', evaluateMode);

    return () => {
      window.removeEventListener('resize', evaluateMode);
    };
  }, []);

  useEffect(() => {
    if (useFallbackScene) {
      setIsReady(true);
      return;
    }

    const store = threeRefs.current;
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080808, 0.00018);
    store.scene = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 30, 300);
    store.camera = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.48;
    store.renderer = renderer;

    const usePostFx = window.innerWidth >= 1280;

    if (usePostFx) {
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(
        new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.35, 0.2, 0.92),
      );
      store.composer = composer;
    }

    const createStarField = () => {
      const starCount = 240;

      for (let i = 0; i < 2; i += 1) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j += 1) {
          const radius = 300 + Math.random() * 1200;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);
          const color = new THREE.Color();
          const colorChoice = Math.random();

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);

          if (colorChoice < 0.7) {
            color.setHSL(0, 0, 0.82 + Math.random() * 0.18);
          } else if (colorChoice < 0.9) {
            color.setHSL(0.14, 0.7, 0.76);
          } else {
            color.setHSL(0.28, 0.55, 0.74);
          }

          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;
          sizes[j] = Math.random() * 1.3 + 0.45;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i },
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;

            void main() {
              vColor = color;
              vec3 pos = position;
              float angle = time * 0.05 * (1.0 - depth * 0.25);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (320.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;

            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const stars = new THREE.Points(geometry, material);
        scene.add(stars);
        store.stars.push(stars);
      }
    };

    const createNebula = () => {
      const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x1a2610) },
          color2: { value: new THREE.Color(0x5e1e0a) },
          opacity: { value: 0.1 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;

          void main() {
            vUv = uv;
            vec3 pos = position;
            float elevation = sin(pos.x * 0.008 + time) * cos(pos.y * 0.008 + time) * 20.0;
            pos.z += elevation;
            vElevation = elevation;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;

          void main() {
            float mixFactor = sin(vUv.x * 8.0 + time * 0.7) * cos(vUv.y * 8.0 + time * 0.6);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 1.8);
            alpha *= 1.0 + vElevation * 0.01;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -1100;
      scene.add(nebula);
      store.nebula = nebula;
    };

    const createSignalStructures = () => {
      const grid = new THREE.GridHelper(1400, 26, 0x2d390f, 0x13190f);
      grid.position.y = -112;
      grid.position.z = -220;
      grid.material.transparent = true;
      grid.material.opacity = 0.28;
      grid.userData = { kind: 'grid', baseZ: -220, baseY: -112 };
      scene.add(grid);
      store.structures.push(grid);

      const ringGeometry = new THREE.TorusGeometry(68, 1.3, 16, 120);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xc8ff00,
        transparent: true,
        opacity: 0.18,
      });

      for (let i = 0; i < 2; i += 1) {
        const ring = new THREE.Mesh(ringGeometry, ringMaterial.clone());
        ring.position.set(i === 0 ? -110 : 118, 8 + i * 14, -320 - i * 70);
        ring.rotation.x = Math.PI / 2.8;
        ring.rotation.y = i === 0 ? 0.2 : -0.35;
        ring.userData = {
          kind: 'ring',
          baseZ: ring.position.z,
          baseY: ring.position.y,
          rotationOffset: i * 0.5,
        };
        scene.add(ring);
        store.structures.push(ring);
      }

      const panelConfigs = [
        { x: -160, y: 40, z: -210, w: 110, h: 78, color: 0x171d12 },
        { x: 146, y: 18, z: -250, w: 96, h: 64, color: 0x1b140e },
        { x: 0, y: 66, z: -360, w: 150, h: 90, color: 0x101814 },
      ];

      panelConfigs.forEach((config, index) => {
        const panelGroup = new THREE.Group();
        const panel = new THREE.Mesh(
          new THREE.PlaneGeometry(config.w, config.h),
          new THREE.MeshBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: 0.18,
            side: THREE.DoubleSide,
          }),
        );
        const border = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.PlaneGeometry(config.w, config.h)),
          new THREE.LineBasicMaterial({
            color: index === 1 ? 0xff3c00 : 0xc8ff00,
            transparent: true,
            opacity: 0.4,
          }),
        );

        panelGroup.add(panel);
        panelGroup.add(border);
        panelGroup.position.set(config.x, config.y, config.z);
        panelGroup.rotation.y = index === 1 ? -0.22 : 0.18;
        panelGroup.rotation.x = -0.08;
        panelGroup.userData = {
          kind: 'panel',
          baseZ: config.z,
          baseY: config.y,
          baseX: config.x,
          floatOffset: index * 0.75,
        };
        scene.add(panelGroup);
        store.structures.push(panelGroup);
      });

      const columnPalette = [0xc8ff00, 0xff3c00, 0xf0ede6];
      for (let i = 0; i < 14; i += 1) {
        const height = 22 + Math.random() * 80;
        const geometry = new THREE.BoxGeometry(12, height, 12);
        const material = new THREE.MeshBasicMaterial({
          color: columnPalette[i % columnPalette.length],
          transparent: true,
          opacity: i % 3 === 0 ? 0.5 : 0.28,
        });
        const column = new THREE.Mesh(geometry, material);
        column.position.x = -210 + i * 32;
        column.position.y = -70 + height / 2;
        column.position.z = -160 - (i % 4) * 28;
        column.userData = {
          kind: 'column',
          baseZ: column.position.z,
          baseY: column.position.y,
          baseScaleY: 1,
          pulseOffset: i * 0.4,
        };
        scene.add(column);
        store.structures.push(column);
      }
    };

    const createAtmosphere = () => {
      const geometry = new THREE.SphereGeometry(620, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          varying vec3 vNormal;

          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform float time;

          void main() {
            float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.62, 0.82, 0.18) * intensity;
            float pulse = sin(time * 1.8) * 0.08 + 0.92;
            gl_FragColor = vec4(atmosphere * pulse, intensity * 0.22);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      });

        const atmosphere = new THREE.Mesh(geometry, material);
        scene.add(atmosphere);
        store.atmosphere = atmosphere;
      };

    createStarField();
    createNebula();
    createSignalStructures();
    createAtmosphere();

    const animate = () => {
      const time = Date.now() * 0.001;

      store.animationId = window.requestAnimationFrame(animate);

      store.stars.forEach((starField) => {
        (starField.material as THREE.ShaderMaterial).uniforms.time.value = time;
      });

      if (store.nebula) {
        store.nebula.material.uniforms.time.value = time * 0.5;
      }

      if (store.atmosphere) {
        store.atmosphere.material.uniforms.time.value = time;
      }

      if (store.camera) {
        const smoothingFactor = 0.05;
        smoothCameraPos.current.x += (store.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += (store.targetCameraY - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += (store.targetCameraZ - smoothCameraPos.current.z) * smoothingFactor;

        const floatX = Math.sin(time * 0.12) * 2;
        const floatY = Math.cos(time * 0.18) * 1.2;

        store.camera.position.x = smoothCameraPos.current.x + floatX;
        store.camera.position.y = smoothCameraPos.current.y + floatY;
        store.camera.position.z = smoothCameraPos.current.z;
        store.camera.lookAt(0, 10, -600);
      }

      store.structures.forEach((structure, index) => {
        const kind = structure.userData.kind as string | undefined;

        if (kind === 'grid') {
          structure.position.z = (structure.userData.baseZ as number) + Math.sin(time * 0.12) * 8;
          return;
        }

        if (kind === 'ring') {
          structure.rotation.z = time * 0.12 + (structure.userData.rotationOffset as number);
          structure.position.y = (structure.userData.baseY as number) + Math.sin(time * 0.6 + index) * 4;
          return;
        }

        if (kind === 'panel') {
          structure.position.x = (structure.userData.baseX as number) + Math.sin(time * 0.35 + structure.userData.floatOffset) * 10;
          structure.position.y = (structure.userData.baseY as number) + Math.cos(time * 0.45 + structure.userData.floatOffset) * 6;
          structure.rotation.y += 0.0012;
          return;
        }

        if (kind === 'column') {
          const pulse = 0.82 + Math.sin(time * 0.9 + (structure.userData.pulseOffset as number)) * 0.16;
          structure.scale.y = pulse;
          structure.position.y = (structure.userData.baseY as number) * pulse;
        }
      });

      if (store.composer) {
        store.composer.render();
      } else if (store.renderer && store.scene && store.camera) {
        store.renderer.render(store.scene, store.camera);
      }
    };

    animate();
    setIsReady(true);

    const handleResize = () => {
      if (!store.camera || !store.renderer) {
        return;
      }

      store.camera.aspect = window.innerWidth / window.innerHeight;
      store.camera.updateProjectionMatrix();
      store.renderer.setSize(window.innerWidth, window.innerHeight);
      store.composer?.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (store.animationId) {
        window.cancelAnimationFrame(store.animationId);
      }

      window.removeEventListener('resize', handleResize);

      store.stars.forEach((starField) => {
        starField.geometry.dispose();
        (starField.material as THREE.ShaderMaterial).dispose();
      });

      store.structures.forEach((structure) => {
        structure.traverse((child) => {
          if (!(child instanceof THREE.Mesh) && !(child instanceof THREE.LineSegments) && !(child instanceof THREE.GridHelper)) {
            return;
          }

          if ('geometry' in child && child.geometry) {
            child.geometry.dispose();
          }

          if ('material' in child && child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      });

      if (store.nebula) {
        store.nebula.geometry.dispose();
        store.nebula.material.dispose();
      }

      if (store.atmosphere) {
        store.atmosphere.geometry.dispose();
        store.atmosphere.material.dispose();
      }

      store.composer?.dispose();
      store.renderer?.dispose();
      store.scene = null;
      store.camera = null;
      store.renderer = null;
      store.composer = null;
      store.stars = [];
      store.structures = [];
      store.nebula = null;
      store.atmosphere = null;
    };
  }, [useFallbackScene]);

  useEffect(() => {
    if (!isReady || children) {
      return;
    }

    const timeline = gsap.timeline();

    if (menuRef.current) {
      timeline.from(menuRef.current, {
        x: -80,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });
    }

    if (titleRef.current) {
      const titleChars = titleRef.current.querySelectorAll('.title-char');
      timeline.from(
        titleChars,
        {
          y: 160,
          opacity: 0,
          duration: 1.1,
          stagger: 0.045,
          ease: 'power4.out',
        },
        '-=0.4',
      );
    }

    if (subtitleRef.current) {
      const subtitleEntries = subtitleRef.current.querySelectorAll('.subtitle-line');
      timeline.from(
        subtitleEntries,
        {
          y: 36,
          opacity: 0,
          duration: 0.8,
          stagger: 0.14,
          ease: 'power3.out',
        },
        '-=0.6',
      );
    }

    if (scrollProgressRef.current) {
      timeline.from(
        scrollProgressRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.45',
      );
    }

    return () => {
      timeline.kill();
    };
  }, [children, isReady]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(documentHeight - windowHeight, 1);
      const progress = Math.min(scrollY / maxScroll, 1);
      const totalProgress = progress * totalSections;
      const sectionIndex = Math.min(Math.floor(totalProgress), totalSections - 1);
      const sectionProgress = totalProgress % 1;

      setScrollProgress(progress);
      setCurrentSection(Math.min(sectionIndex + 1, totalSections));

      const cameraPositions = [
        { x: 0, y: 30, z: 300 },
        { x: 0, y: 42, z: 40 },
        { x: 0, y: 56, z: -340 },
      ];

      const currentPosition = cameraPositions[sectionIndex] ?? cameraPositions[0];
      const nextPosition = cameraPositions[sectionIndex + 1] ?? currentPosition;
      const store = threeRefs.current;

      store.targetCameraX = currentPosition.x + (nextPosition.x - currentPosition.x) * sectionProgress;
      store.targetCameraY = currentPosition.y + (nextPosition.y - currentPosition.y) * sectionProgress;
      store.targetCameraZ = currentPosition.z + (nextPosition.z - currentPosition.z) * sectionProgress;

      store.structures.forEach((structure, index) => {
        const speed = 1 + index * 0.1;
        const baseZ = (structure.userData.baseZ as number | undefined) ?? structure.position.z;
        structure.position.z = baseZ + progress * speed * 60;
      });

      if (store.nebula) {
        store.nebula.position.z = -1100 + progress * 220;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [totalSections]);

  return (
    <div
      className={cn(
        embedded
          ? 'absolute inset-0 overflow-hidden'
          : 'relative min-h-screen overflow-hidden bg-black text-white',
        className,
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {useFallbackScene ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,60,0,0.12),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(200,255,0,0.1),transparent_20%),linear-gradient(180deg,rgba(12,14,10,0.95)_0%,rgba(8,8,8,0.98)_55%,rgba(5,5,5,1)_100%)]">
          <div className="absolute inset-x-[10%] bottom-[18%] h-[24vh] border border-white/8 opacity-30 [clip-path:polygon(6%_100%,18%_58%,36%_72%,48%_22%,64%_44%,82%_18%,94%_100%)]" />
          <div className="absolute inset-x-[14%] bottom-[20%] h-[20vh] bg-[linear-gradient(90deg,rgba(200,255,0,0.18),transparent_20%,transparent_80%,rgba(255,60,0,0.16))] opacity-50 [clip-path:polygon(0_100%,0_72%,100%_38%,100%_100%)]" />
          <div className="absolute inset-x-0 bottom-[26%] h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_35%),linear-gradient(180deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.34)_58%,rgba(0,0,0,0.72)_100%)]" />

      {showChrome ? (
        <>
          <div
            ref={menuRef}
            className="absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 items-center gap-6 text-zinc-200 lg:flex"
          >
            <div className="space-y-1">
              <span className="block h-px w-8 bg-white/70" />
              <span className="block h-px w-5 bg-white/55" />
              <span className="block h-px w-8 bg-white/70" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] [writing-mode:vertical-rl]">
              {sideLabel}
            </span>
          </div>

          <div
            ref={scrollProgressRef}
            className="absolute bottom-8 left-1/2 z-20 hidden w-[min(360px,calc(100%-2rem))] -translate-x-1/2 text-white/80 md:block"
          >
            <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.35em]">
              <span>Scroll</span>
              <span>
                {String(currentSection).padStart(2, '0')} / {String(totalSections).padStart(2, '0')}
              </span>
            </div>
            <div className="h-px w-full bg-white/15">
              <div
                className="h-full bg-lime-300 transition-[width] duration-200"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>
        </>
      ) : null}

      {children ? (
        <div className="relative z-10 h-full">{children}</div>
      ) : (
        <div className="relative z-10 flex min-h-screen items-end px-6 pb-16 pt-28 text-white">
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-4xl">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-lime-300">
                Immersive Horizon
              </p>
              <h1 ref={titleRef} className="mb-6 flex flex-wrap gap-x-2 text-[clamp(4rem,14vw,11rem)] leading-[0.86]">
                {titleCharacters.map((character, index) => (
                  <span key={`${character}-${index}`} className="title-char inline-flex overflow-hidden">
                    {character === ' ' ? '\u00A0' : character}
                  </span>
                ))}
              </h1>
              <div ref={subtitleRef} className="space-y-2 text-lg text-white/76 sm:text-2xl">
                {subtitleLines.map((line) => (
                  <p key={line} className="subtitle-line">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Component = HorizonHeroSection;
