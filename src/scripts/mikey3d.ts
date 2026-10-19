// Interactive 3D owl body for the Mikey window. Loaded only when that window is on screen.
import {
  Scene, PerspectiveCamera, WebGLRenderer, Mesh, MeshStandardMaterial, LineSegments, EdgesGeometry,
  LineBasicMaterial, Group, Box3, Vector3, HemisphereLight, DirectionalLight, Color,
} from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Real print colours: matte charcoal PLA body, copper-painted plinth.
const PARTS = [
  { file: '/mikey/owl_front.stl', color: '#34302c', metal: 0 },
  { file: '/mikey/owl_back_lid.stl', color: '#2c2825', metal: 0 },
  { file: '/mikey/base_plinth.stl', color: '#c97b4a', metal: 0.45 },
];

function fallback(host: HTMLElement) {
  host.innerHTML = '<img src="/mikey/owl.webp" alt="Mikey the owl robot body: a faceted egg with a copper octagon face on a hexagonal plinth" width="800" height="600" loading="lazy" />';
}

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

async function build(host: HTMLElement) {
  if (!hasWebGL()) { fallback(host); return; }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const w = host.clientWidth || 600;
  const h = host.clientHeight || 450;
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', 'Mikey the owl robot body in 3D — drag to turn it');
  const scene = new Scene();
  scene.add(new HemisphereLight(0xffffff, 0x8a7a66, 2.2));
  const sun = new DirectionalLight(0xffffff, 1.6);
  sun.position.set(1, 2, 1.5);
  scene.add(sun);
  const camera = new PerspectiveCamera(32, w / h, 1, 5000);
  const owl = new Group();
  const loader = new STLLoader();
  const geoms = await Promise.all(PARTS.map((p) => loader.loadAsync(p.file)));
  geoms.forEach((g, i) => {
    g.computeVertexNormals();
    const mesh = new Mesh(g, new MeshStandardMaterial({ color: new Color(PARTS[i].color), roughness: 0.8, metalness: PARTS[i].metal }));
    const edges = new LineSegments(new EdgesGeometry(g, 24), new LineBasicMaterial({ color: new Color(i === 2 ? '#7a4422' : '#7d746a') }));
    owl.add(mesh, edges);
  });
  owl.rotation.x = -Math.PI / 2; // CAD is Z-up; three.js is Y-up
  const turn = new Group();
  turn.rotation.y = Math.PI; // face the camera
  turn.add(owl);
  scene.add(turn);
  const box = new Box3().setFromObject(turn);
  const size = box.getSize(new Vector3());
  const centre = box.getCenter(new Vector3());
  turn.position.sub(centre);
  const dist = Math.max(size.x, size.y, size.z) * 2.1;
  camera.position.set(dist * 0.55, dist * 0.25, dist * 0.8);
  camera.lookAt(0, 0, 0);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.autoRotate = !reduce;
  controls.autoRotateSpeed = 1.2;
  host.replaceChildren(renderer.domElement);
  let alive = true;
  const loop = () => {
    if (!alive) return;
    if (!document.contains(host)) { alive = false; renderer.dispose(); return; }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  };
  loop();
}

export function mountMikey3d(win: Element) {
  const host = win.querySelector<HTMLElement>('[data-mikey3d]');
  if (!host || host.dataset.ready) return;
  host.dataset.ready = '1';
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      io.disconnect();
      build(host).catch(() => fallback(host));
    }
  });
  io.observe(host);
}
