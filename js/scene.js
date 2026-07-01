/* ============================================================
   3D intro scene — loads a real gamer setup model,
   auto-frames it, glues a live terminal onto the monitor, and dives
   into it on click / scroll / Enter to reveal the portfolio.
   ============================================================ */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

(function () {
  "use strict";

  const intro = document.getElementById("intro");
  const canvas = document.getElementById("intro-canvas");
  if (!intro || !canvas) return;
  if (window.__introFallback) clearTimeout(window.__introFallback);

  const root = document.documentElement;
  const loader = document.getElementById("intro-loader");
  const ui = document.getElementById("intro-ui");
  const brand = document.getElementById("intro-brand");
  const skip = document.getElementById("intro-skip");
  const enterBtn = document.getElementById("intro-enter");
  const replay = document.getElementById("intro-replay");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const C = { bg: 0x05060a, accent: 0x22d3ee };

  /* ---- Frame & terminal placement (tuned against the gamer setup model) ---- */
  const TARGET_WIDTH = 6.2;        // model is scaled so its width = this

  let renderer, scene, camera, screenTex, screenCanvas, screenCtx;
  let raf = 0, started = 0, typingStart = 0;
  let hover = 0, hoverTarget = 0;
  let entering = false, enterT = 0, entered = false;
  let modelReady = false;
  let terminal = null;
  const targets = [];              // raycast targets (terminal + monitor meshes)
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const clock = { last: 0 };

  // Camera framing (filled once the model is measured)
  const baseCam = new THREE.Vector3(0, 1.4, 6);
  const lookAt = new THREE.Vector3(0, 1, 0);
  const enterTarget = new THREE.Vector3(0, 1, 1);
  const lookTarget = new THREE.Vector3(0, 1, 0);
  const enterStart = new THREE.Vector3();
  const lookFrom = new THREE.Vector3();
  const tmpLook = new THREE.Vector3();

  /* ----------------------------------------------------------
     Terminal screen (typewriter on a canvas texture)
     ---------------------------------------------------------- */
  const LINES = [
    { t: "nam@portfolio:~$ whoami", c: "#22d3ee" },
    { t: "Tran Bac Nam — AI Engineer & Architect", c: "#e7e9ee" },
    { t: "", c: "#000" },
    { t: "nam@portfolio:~$ cat stack.txt", c: "#22d3ee" },
    { t: "LLM · vLLM · RAG · Agentic AI · MLOps", c: "#a78bfa" },
    { t: "", c: "#000" },
    { t: "nam@portfolio:~$ ./enter_portfolio", c: "#22d3ee" },
    { t: "launching interface", c: "#f472b6" },
  ];
  const TOTAL_CHARS = LINES.reduce((n, l) => n + l.t.length, 0);

  function buildScreenTexture() {
    screenCanvas = document.createElement("canvas");
    screenCanvas.width = 1024;
    screenCanvas.height = 640;
    screenCtx = screenCanvas.getContext("2d");
    screenTex = new THREE.CanvasTexture(screenCanvas);
    screenTex.colorSpace = THREE.SRGBColorSpace;
    screenTex.anisotropy = 4;
    drawScreen(0, true);
  }

  function drawScreen(shownChars, cursorOn) {
    const ctx = screenCtx, W = screenCanvas.width, H = screenCanvas.height;
    ctx.fillStyle = "#060912";
    ctx.fillRect(0, 0, W, H);
    const g = ctx.createRadialGradient(W * 0.5, H * 0.35, 80, W * 0.5, H * 0.5, W * 0.7);
    g.addColorStop(0, "rgba(34,211,238,0.10)");
    g.addColorStop(1, "rgba(6,9,18,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(0,0,0,0.10)";
    for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2);

    ctx.fillStyle = "#0c1018";
    ctx.fillRect(0, 0, W, 74);
    const dots = ["#ff5f56", "#ffbd2e", "#27c93f"];
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.arc(46 + i * 34, 37, 9, 0, Math.PI * 2);
      ctx.fillStyle = dots[i]; ctx.fill();
    }
    ctx.font = "500 24px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#6b7180"; ctx.textAlign = "center";
    ctx.fillText("— bash —", W / 2, 46);
    ctx.textAlign = "left";

    ctx.font = "500 31px 'JetBrains Mono', monospace";
    let remaining = shownChars, y = 150;
    const lh = 52;
    let cx = 64, cy = y;
    for (let i = 0; i < LINES.length; i++) {
      const line = LINES[i], len = line.t.length;
      let txt;
      if (remaining >= len) { txt = line.t; remaining -= len; }
      else { txt = line.t.slice(0, Math.max(0, remaining)); remaining = -1; }
      ctx.fillStyle = line.c;
      if (txt) ctx.fillText(txt, 64, y);
      cx = 64 + ctx.measureText(txt).width + 4; cy = y;
      y += lh;
      if (remaining < 0) break;
    }
    if (cursorOn) { ctx.fillStyle = "#22d3ee"; ctx.fillRect(cx, cy - 27, 16, 31); }
    if (screenTex) screenTex.needsUpdate = true;
  }

  /* ----------------------------------------------------------
     Scene scaffold
     ---------------------------------------------------------- */
  function buildScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(C.bg);
    scene.fog = new THREE.Fog(C.bg, 9, 22);

    camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.copy(baseCam);
    camera.lookAt(lookAt);

    // Image-based lighting for nice PBR materials
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    scene.add(new THREE.HemisphereLight(0x3a4a6b, 0x05060a, 0.5));
    const key = new THREE.DirectionalLight(0xcfe3ff, 1.4);
    key.position.set(-5, 8, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1; key.shadow.camera.far = 30;
    key.shadow.camera.left = -8; key.shadow.camera.right = 8;
    key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
    key.shadow.bias = -0.0004;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xa78bfa, 0.5);
    rim.position.set(6, 4, -6);
    scene.add(rim);

    // Floor catches contact shadow
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({ color: 0x070810, roughness: 0.95 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Depth: faint starfield
    const sg = new THREE.BufferGeometry();
    const n = 140, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = Math.random() * 10 + 1;
      pos[i * 3 + 2] = -8 - Math.random() * 12;
    }
    sg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0x556080, size: 0.05, transparent: true, opacity: 0.55 })));
  }

  /* ----------------------------------------------------------
     Helpers to measure named sub-trees
     ---------------------------------------------------------- */
  function boxOfNamed(rootObj, substr) {
    const b = new THREE.Box3();
    let found = false;
    const needle = substr.toLowerCase();
    rootObj.traverse(function (o) {
      if (o.isMesh && o.name.toLowerCase().indexOf(needle) !== -1) {
        b.expandByObject(o);
        found = true;
      }
    });
    return found ? b : null;
  }

  function meshesNamed(rootObj, substr) {
    const out = [];
    const needle = substr.toLowerCase();
    rootObj.traverse(function (o) {
      if (o.isMesh && o.name.toLowerCase().indexOf(needle) !== -1) out.push(o);
    });
    return out;
  }

  function leftMonitorPanel(rootObj) {
    const monBox = boxOfNamed(rootObj, "monitor");
    if (!monBox) return null;
    const exactPanel =
      meshesNamed(rootObj, "mt_monitor_screen")[0] ||
      meshesNamed(rootObj, "monitor_screen")[0];
    if (exactPanel) {
      const box = new THREE.Box3().setFromObject(exactPanel);
      return {
        mesh: exactPanel,
        box: box,
        size: box.getSize(new THREE.Vector3()),
        center: box.getCenter(new THREE.Vector3())
      };
    }

    const monSize = monBox.getSize(new THREE.Vector3());
    const panels = [];

    meshesNamed(rootObj, "monitor").forEach(function (mesh) {
      const b = new THREE.Box3().setFromObject(mesh);
      const s = b.getSize(new THREE.Vector3());
      const c = b.getCenter(new THREE.Vector3());
      const aspect = s.x / Math.max(s.y, 0.0001);

      if (
        s.x > monSize.x * 0.22 &&
        s.y > monSize.y * 0.28 &&
        aspect > 1.25 &&
        aspect < 2.2
      ) {
        panels.push({ mesh: mesh, box: b, size: s, center: c });
      }
    });

    panels.sort(function (a, b) { return a.center.x - b.center.x; });
    return panels[0] || null;
  }

  /* ----------------------------------------------------------
     Load + place the desk model
     ---------------------------------------------------------- */
  function loadModel() {
    const gltf = new GLTFLoader();
    gltf.load(
      "assets/models/gamer_setup_pack.glb",
      function (res) {
        const model = res.scene;
        model.traverse(function (o) {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
            if (o.material) o.material.envMapIntensity = 0.7;
          }
        });

        const deskGroup = new THREE.Group();
        deskGroup.add(model);
        scene.add(deskGroup);
        deskGroup.updateMatrixWorld(true);

        // 1) Orient: rotate so the monitors face +Z (toward the camera).
        //    Front direction = from monitor cluster toward the keyboard.
        const monBox0 = boxOfNamed(deskGroup, "monitor");
        const kbBox0 = boxOfNamed(deskGroup, "keyboard");
        if (monBox0 && kbBox0) {
          const mc = monBox0.getCenter(new THREE.Vector3());
          const kc = kbBox0.getCenter(new THREE.Vector3());
          const front = new THREE.Vector3(kc.x - mc.x, 0, kc.z - mc.z);
          if (front.lengthSq() > 1e-6) {
            front.normalize();
            deskGroup.rotation.y = -Math.atan2(front.x, front.z);
          }
        }
        deskGroup.updateMatrixWorld(true);

        // 2) Scale to a known width, then recenter (centered on X/Z, sitting on y=0)
        let box = new THREE.Box3().setFromObject(deskGroup);
        let size = box.getSize(new THREE.Vector3());
        const s = TARGET_WIDTH / Math.max(size.x, 0.0001);
        deskGroup.scale.setScalar(s);
        deskGroup.updateMatrixWorld(true);
        box = new THREE.Box3().setFromObject(deskGroup);
        const c = box.getCenter(new THREE.Vector3());
        deskGroup.position.x -= c.x;
        deskGroup.position.z -= c.z;
        deskGroup.position.y -= box.min.y;
        deskGroup.updateMatrixWorld(true);

        // 3) Measure the monitor cluster in final world space
        const monBox = boxOfNamed(deskGroup, "monitor") || new THREE.Box3().setFromObject(deskGroup);

        // 4) Live terminal plane on the LEFT monitor.
        //    Placement is derived from the actual left display panel, not the
        //    full arm/dual-monitor cluster, so it sits flush in the 3D screen.
        const panel = leftMonitorPanel(deskGroup);
        const panelBox = panel ? panel.box : monBox;
        const panelC = panelBox.getCenter(new THREE.Vector3());
        const panelSize = panelBox.getSize(new THREE.Vector3());
        const screenAspect = screenCanvas.width / screenCanvas.height;
        let termW = panelSize.x * 0.94;
        let termH = termW / screenAspect;
        const maxTermH = panelSize.y * 0.88;
        if (termH > maxTermH) {
          termH = maxTermH;
          termW = termH * screenAspect;
        }
        const termNormal = new THREE.Vector3(0, 0, 1);
        const termPos = new THREE.Vector3(panelC.x, panelC.y, panelBox.max.z + 0.05);
        const termX = termPos.x;
        const termY = termPos.y;
        const termZ = termPos.z;
        const termMat = new THREE.MeshBasicMaterial({
          map: screenTex,
          toneMapped: false,
          side: THREE.DoubleSide
        });
        if (panel && panel.mesh) {
          panel.mesh.material = termMat;
          panel.mesh.renderOrder = 4;
          terminal = panel.mesh;
          terminal.userData.pulseScale = false;
          targets.push(panel.mesh);
        } else {
          terminal = new THREE.Mesh(new THREE.PlaneGeometry(termW, termH), termMat);
          terminal.position.copy(termPos);
          terminal.renderOrder = 10;
          terminal.userData.pulseScale = true;
          scene.add(terminal);
          targets.push(terminal);
        }
        meshesNamed(deskGroup, "monitor").forEach(function (m) { targets.push(m); });

        // glow spill from the screen
        const glow = new THREE.PointLight(C.accent, 1.6, 6, 2);
        glow.position.copy(termPos).addScaledVector(termNormal, 0.4);
        scene.add(glow);

        // 5) Frame the camera in a 3/4 view of the left monitor
        baseCam.set(termX + 0.37, termY + 0.12, termZ + 3.05);
        lookAt.set(termX + 0.07, termY - 0.06, termZ - 0.20);
        camera.position.copy(baseCam);
        camera.lookAt(lookAt);

        // Enter = dive toward the terminal
        enterTarget.copy(termPos).addScaledVector(termNormal, 0.5);
        lookTarget.set(termX, termY, termZ);

        modelReady = true;
        if (loader) loader.classList.add("hidden");
        [ui, brand, skip].forEach(function (el) { el && el.classList.add("show"); });
      },
      undefined,
      function (err) {
        // Model failed — skip the intro gracefully
        console.warn("gamer_setup_pack.glb failed to load", err);
        bail();
      }
    );
  }

  /* ----------------------------------------------------------
     Hover / enter / resize
     ---------------------------------------------------------- */
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  function updateHover(clientX, clientY) {
    if (entering || entered || !modelReady) return;
    const r = canvas.getBoundingClientRect();
    ndc.x = ((clientX - r.left) / r.width) * 2 - 1;
    ndc.y = -((clientY - r.top) / r.height) * 2 + 1;
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(targets, false).length > 0;
    hoverTarget = hit ? 1 : 0;
    intro.style.cursor = hit ? "pointer" : "grab";
  }

  function beginEnter() {
    if (entering || entered || !modelReady) return;
    entering = true;
    intro.style.cursor = "default";
  }

  function finishIntro() {
    entered = true; entering = false;
    root.classList.remove("intro-lock");
    intro.classList.add("intro--gone");
    if (replay) requestAnimationFrame(function () { replay.classList.add("show"); });
    setTimeout(function () { cancelAnimationFrame(raf); raf = 0; }, 950);
  }

  function reopen() {
    if (!renderer || !modelReady) return;
    entered = false; entering = false; enterT = 0; typingStart = 0; started = 0;
    camera.position.copy(baseCam); camera.lookAt(lookAt);
    root.classList.add("intro-lock");
    intro.classList.remove("intro--gone");
    intro.style.cursor = "grab";
    if (replay) replay.classList.remove("show");
    window.scrollTo(0, 0);
    if (!raf) { clock.last = 0; raf = requestAnimationFrame(loop); }
  }

  function bail() {
    root.classList.remove("intro-lock");
    intro.classList.add("intro--gone");
    cancelAnimationFrame(raf); raf = 0;
  }

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    const aspect = w / h;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(w, h, false);
    camera.aspect = aspect;
    camera.fov = aspect < 0.65 ? 56 : aspect < 1 ? 48 : 42;
    camera.updateProjectionMatrix();
    // Portrait screens need a wider, higher frame so the desk and terminal
    // stay composed instead of being cropped by the narrow viewport.
    camera.__extra = aspect < 1 ? (1 - aspect) * (baseCam.z * 1.45) : 0;
    camera.__lift = aspect < 1 ? (1 - aspect) * 0.55 : 0;
  }

  function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (!started) { started = now; typingStart = now; clock.last = now; }
    const dt = Math.min((now - clock.last) / 1000, 0.05);
    clock.last = now;
    const t = (now - started) / 1000;

    const shown = Math.min(TOTAL_CHARS, Math.floor((now - typingStart) / 32));
    drawScreen(shown, Math.floor(now / 480) % 2 === 0);

    hover += (hoverTarget - hover) * Math.min(1, dt * 10);
    if (terminal && terminal.userData.pulseScale) terminal.scale.setScalar(1 + hover * 0.015);

    const extra = camera.__extra || 0;
    const lift = camera.__lift || 0;
    if (!entering && !entered) {
      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3);
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3);
      const bob = reduceMotion ? 0 : Math.sin(t * 0.6) * 0.05;
      camera.position.x = baseCam.x + pointer.x * 0.9;
      camera.position.y = baseCam.y + lift + pointer.y * 0.4 + bob;
      camera.position.z = baseCam.z + extra - Math.abs(pointer.x) * 0.15;
      tmpLook.set(lookAt.x, lookAt.y + lift * 0.45, lookAt.z);
      camera.lookAt(tmpLook);
    } else if (entering) {
      enterT = Math.min(1, enterT + dt / 1.5);
      const e = easeInOut(enterT);
      if (enterT <= dt + 0.0001) { enterStart.copy(camera.position); lookFrom.copy(lookAt); }
      camera.position.lerpVectors(enterStart, enterTarget, e);
      tmpLook.lerpVectors(lookFrom, lookTarget, e);
      camera.lookAt(tmpLook);
      if (enterT > 0.55 && !intro.classList.contains("intro--gone")) finishIntro();
    }

    renderer.render(scene, camera);
  }

  /* ----------------------------------------------------------
     Init
     ---------------------------------------------------------- */
  function init() {
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    } catch (err) { bail(); return; }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    buildScreenTexture();
    buildScene();
    resize();
    loadModel();
    raf = requestAnimationFrame(loop);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", function (e) {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      updateHover(e.clientX, e.clientY);
    }, { passive: true });

    canvas.addEventListener("pointerdown", function (e) {
      if (entering || entered || !modelReady) return;
      const r = canvas.getBoundingClientRect();
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.intersectObjects(targets, false).length) beginEnter();
    });

    intro.addEventListener("wheel", function (e) { e.preventDefault(); beginEnter(); }, { passive: false });
    intro.addEventListener("touchmove", function (e) { e.preventDefault(); beginEnter(); }, { passive: false });
    window.addEventListener("keydown", function (e) {
      if (entered || entering) return;
      if (e.key === "Enter" || e.key === " " || e.key === "Escape" || e.key === "ArrowDown") beginEnter();
    });
    if (enterBtn) enterBtn.addEventListener("click", beginEnter);
    if (skip) skip.addEventListener("click", beginEnter);
    if (replay) replay.addEventListener("click", reopen);

    // Debug hook (lets tooling capture a clean still frame)
    window.__introDbg = {
      pause: function () { cancelAnimationFrame(raf); raf = 0; renderer.render(scene, camera); },
      resume: function () { if (!raf) { clock.last = 0; raf = requestAnimationFrame(loop); } },
      info: function () {
        return {
          modelReady: modelReady,
          targets: targets.length,
          cam: camera.position.toArray().map(function (v) { return +v.toFixed(2); }),
          term: terminal ? terminal.position.toArray().map(function (v) { return +v.toFixed(2); }) : null
        };
      },
      names: function () {
        var seen = {};
        scene.traverse(function (o) { if (o.isMesh) seen[o.name] = (seen[o.name] || 0) + 1; });
        return Object.keys(seen).slice(0, 40);
      },
      boxes: function () {
        var mb = boxOfNamed(scene, "monitor");
        var full = new THREE.Box3().setFromObject(scene);
        var f = function (b) { return b ? { min: b.min.toArray().map(function(v){return +v.toFixed(2);}), max: b.max.toArray().map(function(v){return +v.toFixed(2);}) } : null; };
        return { monitors: f(mb), full: f(full) };
      },
      setTerm: function (x, y, z, w, h) {
        terminal.geometry.dispose();
        terminal.geometry = new THREE.PlaneGeometry(w, h);
        terminal.position.set(x, y, z);
        renderer.render(scene, camera);
      },
      setCam: function (x, y, z, lx, ly, lz) {
        baseCam.set(x, y, z);
        lookAt.set(lx, ly, lz);
        camera.position.copy(baseCam);
        camera.lookAt(lookAt);
        renderer.render(scene, camera);
      }
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
