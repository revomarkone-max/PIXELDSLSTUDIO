// PixelDSL Studio v3.0 — Three.js 3D Primitive Rig & Perspective Engine
// Zero-dependency client-side WebGL 3D renderer with cel-shading, inverted-hull outlines,
// perspective/isometric camera projection, 3D bone animation, normal maps, and palette snapping.

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['three'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./vendor/three.min.js'));
  } else {
    root.Pixel3DStudio = factory(root.THREE);
  }
}(typeof self !== 'undefined' ? self : this, function (THREE) {
  'use strict';

  if (!THREE) {
    console.warn('[Pixel3DStudio] THREE is not loaded.');
  }

  // Built-in Retro Palettes for Quantization
  const RETRO_PALETTES = {
    pico8: [
      [0, 0, 0], [29, 43, 83], [126, 37, 83], [0, 135, 81],
      [171, 82, 54], [95, 87, 79], [194, 195, 199], [255, 241, 232],
      [255, 0, 77], [255, 163, 0], [255, 236, 39], [0, 228, 54],
      [41, 173, 255], [131, 118, 156], [255, 119, 168], [255, 204, 170]
    ],
    gameboy: [
      [15, 56, 15], [48, 98, 48], [139, 172, 15], [155, 188, 15]
    ],
    db32: [
      [0, 0, 0], [34, 32, 52], [69, 40, 60], [102, 57, 49],
      [143, 86, 59], [223, 113, 38], [217, 160, 102], [238, 195, 154],
      [251, 242, 54], [153, 229, 80], [106, 190, 48], [55, 148, 110],
      [75, 105, 47], [82, 75, 36], [50, 60, 57], [63, 63, 116],
      [48, 96, 130], [91, 110, 225], [99, 155, 255], [95, 205, 228],
      [203, 219, 252], [255, 255, 255], [155, 173, 183], [132, 126, 135],
      [105, 106, 106], [89, 86, 82], [118, 66, 138], [172, 50, 50],
      [217, 87, 99], [215, 123, 186], [143, 151, 74], [138, 111, 48]
    ]
  };

  class Pixel3DStudio {
    constructor(options = {}) {
      this.THREE = THREE;
      this.width = options.width || 32;
      this.height = options.height || 32;
      this.canvas = options.canvas || null;
      this.previewCanvas = options.previewCanvas || null;

      this.cameraMode = options.cameraMode || 'perspective'; // 'perspective' | 'orthographic'
      this.yaw = options.yaw || 25; // degrees
      this.pitch = options.pitch || 18; // degrees
      this.cameraDistance = options.distance || 6.2;
      this.fov = options.fov || 42;

      this.activeModel = options.model || 'humanoid';
      this.activeAction = options.action || 'walk';
      this.frameTime = 0;
      this.celSteps = options.celSteps !== undefined ? options.celSteps : 3;
      this.useOutlines = options.useOutlines !== false;
      this.outlineThickness = options.outlineThickness || 0.045;
      this.outlineColor = options.outlineColor || 0x14182e;
      this.snapPalette = options.snapPalette || 'none'; // 'none' | 'pico8' | 'gameboy' | 'db32'
      this.currentPalette = options.palette || null;

      this.equipment = {
        weapon: options.weapon !== undefined ? options.weapon : 'sword',
        shield: options.shield !== undefined ? options.shield : true,
        helmet: options.helmet !== undefined ? options.helmet : true,
        cape: options.cape || false
      };

      this.models = {};
      this.activeMeshGroup = null;

      this.initScene();
      this.buildModel(this.activeModel);
    }

    initScene() {
      if (!this.THREE) return;
      const THREE = this.THREE;

      this.scene = new THREE.Scene();
      this.scene.background = null; // transparent

      // Lights Rig
      // 1. Key Directional Light (Warm Sun)
      this.dirLight = new THREE.DirectionalLight(0xfffaed, 1.4);
      this.dirLight.position.set(3, 5, 4);
      this.scene.add(this.dirLight);

      // 2. Cool Ambient Fill Light
      this.ambLight = new THREE.AmbientLight(0x404d6e, 0.75);
      this.scene.add(this.ambLight);

      // 3. Rim / Back Light (Contour Separation)
      this.rimLight = new THREE.DirectionalLight(0x93c5fd, 0.65);
      this.rimLight.position.set(-3, 4, -4);
      this.scene.add(this.rimLight);

      // Cameras
      this.perspCamera = new THREE.PerspectiveCamera(this.fov, this.width / this.height, 0.1, 100);
      const aspect = this.width / this.height;
      const orthoSize = 2.4;
      this.orthoCamera = new THREE.OrthographicCamera(
        -orthoSize * aspect, orthoSize * aspect,
        orthoSize, -orthoSize,
        0.1, 100
      );

      this.updateCameraTransform();

      // Offscreen low-res WebGL renderer for pixel-art quantization
      if (typeof document !== 'undefined') {
        this.renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          preserveDrawingBuffer: true
        });
        this.renderer.setSize(this.width, this.height, false);
        this.renderer.setClearColor(0x000000, 0);
        this.renderTarget = new THREE.WebGLRenderTarget(this.width, this.height, {
          minFilter: THREE.NearestFilter,
          magFilter: THREE.NearestFilter,
          format: THREE.RGBAFormat
        });
      }
    }

    // Interactive high-res 3D orbit viewport
    initOrbitView(canvasElement) {
      if (!canvasElement || !this.THREE) return;
      this.orbitCanvas = canvasElement;
      this.orbitRenderer = new this.THREE.WebGLRenderer({
        canvas: canvasElement,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true
      });
      this.orbitRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.orbitRenderer.setClearColor(0x0a0c16, 0.85);
      this.resizeOrbitView();
    }

    resizeOrbitView() {
      if (!this.orbitRenderer || !this.orbitCanvas) return;
      const w = this.orbitCanvas.clientWidth || 400;
      const h = this.orbitCanvas.clientHeight || 400;
      this.orbitRenderer.setSize(w, h, false);
    }

    renderOrbitView() {
      if (!this.orbitRenderer || !this.orbitCanvas) return;
      this.updateCameraTransform();
      const aspect = (this.orbitCanvas.clientWidth || 400) / (this.orbitCanvas.clientHeight || 400);
      this.perspCamera.aspect = aspect;
      this.perspCamera.updateProjectionMatrix();

      const orthoSize = 2.4;
      this.orthoCamera.left = -orthoSize * aspect;
      this.orthoCamera.right = orthoSize * aspect;
      this.orthoCamera.updateProjectionMatrix();

      this.orbitRenderer.render(this.scene, this.getCamera());
    }

    updateCameraTransform() {
      const yawRad = (this.yaw * Math.PI) / 180;
      const pitchRad = (this.pitch * Math.PI) / 180;

      const cosP = Math.cos(pitchRad);
      const sinP = Math.sin(pitchRad);
      const sinY = Math.sin(yawRad);
      const cosY = Math.cos(yawRad);

      const cx = this.cameraDistance * cosP * sinY;
      const cy = this.cameraDistance * sinP + 1.2; // target center height
      const cz = this.cameraDistance * cosP * cosY;

      const target = new this.THREE.Vector3(0, 1.2, 0);

      this.perspCamera.fov = this.fov;
      this.perspCamera.aspect = this.width / this.height;
      this.perspCamera.position.set(cx, cy, cz);
      this.perspCamera.lookAt(target);
      this.perspCamera.updateProjectionMatrix();

      const aspect = this.width / this.height;
      const orthoSize = 2.3;
      this.orthoCamera.left = -orthoSize * aspect;
      this.orthoCamera.right = orthoSize * aspect;
      this.orthoCamera.top = orthoSize;
      this.orthoCamera.bottom = -orthoSize;
      this.orthoCamera.position.set(cx, cy, cz);
      this.orthoCamera.lookAt(target);
      this.orthoCamera.updateProjectionMatrix();
    }

    getCamera() {
      return this.cameraMode === 'orthographic' ? this.orthoCamera : this.perspCamera;
    }

    // Material builder with cel-shading ramp and inverted-hull outline
    createCelMaterial(colorHex, isSpecular = false) {
      const THREE = this.THREE;
      const mat = new THREE.MeshLambertMaterial({
        color: colorHex,
        reflectivity: isSpecular ? 0.8 : 0.2
      });
      return mat;
    }

    createMeshWithOutline(geometry, material, outlineColor = this.outlineColor) {
      const THREE = this.THREE;
      const group = new THREE.Group();

      const mainMesh = new THREE.Mesh(geometry, material);
      group.add(mainMesh);
      group.mainMesh = mainMesh;

      if (this.useOutlines) {
        const outlineMat = new THREE.MeshBasicMaterial({
          color: outlineColor,
          side: THREE.BackSide
        });
        const outlineMesh = new THREE.Mesh(geometry, outlineMat);
        const scaleBoost = 1.0 + (this.outlineThickness / (geometry.boundingSphere ? geometry.boundingSphere.radius || 1 : 1));
        outlineMesh.scale.multiplyScalar(scaleBoost);
        group.add(outlineMesh);
        group.outlineMesh = outlineMesh;
      }

      return group;
    }

    // =========================================================================
    // 3D MODEL BUILDERS
    // =========================================================================

    buildModel(modelType = 'humanoid') {
      const THREE = this.THREE;
      if (this.activeMeshGroup) {
        this.scene.remove(this.activeMeshGroup);
        this.activeMeshGroup = null;
      }

      this.activeModel = modelType;
      const root = new THREE.Group();
      this.bones = {};

      if (modelType === 'humanoid' || modelType === 'chibi') {
        const isChibi = modelType === 'chibi';
        const headScale = isChibi ? 1.5 : 1.0;
        const bodyScale = isChibi ? 0.75 : 1.0;
        const limbScale = isChibi ? 0.7 : 1.0;

        const skinMat = this.createCelMaterial(0xffccaa);
        const armorMat = this.createCelMaterial(0x2563eb);
        const darkArmorMat = this.createCelMaterial(0x1d4ed8);
        const steelMat = this.createCelMaterial(0xe2e8f0, true);
        const goldMat = this.createCelMaterial(0xfacc15, true);
        const leatherMat = this.createCelMaterial(0x78350f);
        const hairMat = this.createCelMaterial(0x451a03);

        // 1. Pelvis / Hips (Root of body)
        const pelvisGeom = new THREE.BoxGeometry(0.7 * bodyScale, 0.45 * bodyScale, 0.5 * bodyScale);
        const pelvis = this.createMeshWithOutline(pelvisGeom, darkArmorMat);
        pelvis.position.set(0, 1.25 * bodyScale, 0);
        root.add(pelvis);
        this.bones['pelvis'] = pelvis;

        // 2. Spine & Torso (Chest)
        const torsoGeom = new THREE.CylinderGeometry(0.55 * bodyScale, 0.45 * bodyScale, 0.85 * bodyScale, 14);
        const torso = this.createMeshWithOutline(torsoGeom, armorMat);
        torso.position.set(0, 0.65 * bodyScale, 0);
        pelvis.add(torso);
        this.bones['torso'] = torso;

        // Chest Armor Plate
        const plateGeom = new THREE.BoxGeometry(0.6 * bodyScale, 0.55 * bodyScale, 0.25 * bodyScale);
        const plate = this.createMeshWithOutline(plateGeom, steelMat);
        plate.position.set(0, 0.05 * bodyScale, 0.22 * bodyScale);
        torso.add(plate);

        // Gold Emblem
        const emblemGeom = new THREE.CylinderGeometry(0.12 * bodyScale, 0.12 * bodyScale, 0.06, 8);
        const emblem = this.createMeshWithOutline(emblemGeom, goldMat);
        emblem.rotation.x = Math.PI / 2;
        emblem.position.set(0, 0.05 * bodyScale, 0.36 * bodyScale);
        torso.add(emblem);

        // 3. Neck & Head
        const neckGeom = new THREE.CylinderGeometry(0.18 * bodyScale, 0.22 * bodyScale, 0.25 * bodyScale, 10);
        const neck = this.createMeshWithOutline(neckGeom, skinMat);
        neck.position.set(0, 0.52 * bodyScale, 0);
        torso.add(neck);
        this.bones['neck'] = neck;

        const headGeom = new THREE.SphereGeometry(0.48 * headScale, 16, 12);
        const head = this.createMeshWithOutline(headGeom, skinMat);
        head.position.set(0, 0.44 * headScale, 0);
        neck.add(head);
        this.bones['head'] = head;

        // Hair Cap
        const hairGeom = new THREE.SphereGeometry(0.52 * headScale, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55);
        const hair = this.createMeshWithOutline(hairGeom, hairMat);
        hair.position.set(0, 0.06 * headScale, -0.02 * headScale);
        head.add(hair);

        // Eyes
        const eyeGeom = new THREE.BoxGeometry(0.08 * headScale, 0.10 * headScale, 0.05);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
        const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
        eyeL.position.set(-0.16 * headScale, 0.02 * headScale, 0.44 * headScale);
        head.add(eyeL);
        const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
        eyeR.position.set(0.16 * headScale, 0.02 * headScale, 0.44 * headScale);
        head.add(eyeR);

        // Helmet (if enabled)
        if (this.equipment.helmet && !isChibi) {
          const helmGeom = new THREE.SphereGeometry(0.54 * headScale, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.65);
          const helm = this.createMeshWithOutline(helmGeom, steelMat);
          helm.position.set(0, 0.05 * headScale, 0);
          head.add(helm);

          const crestGeom = new THREE.BoxGeometry(0.08, 0.3, 0.65);
          const crest = this.createMeshWithOutline(crestGeom, goldMat);
          crest.position.set(0, 0.52 * headScale, 0);
          head.add(crest);
        }

        // 4. Arms & Forearms
        // Left Arm
        const shoulderL = this.createMeshWithOutline(new THREE.SphereGeometry(0.24 * bodyScale, 10, 8), steelMat);
        shoulderL.position.set(-0.55 * bodyScale, 0.32 * bodyScale, 0);
        torso.add(shoulderL);
        this.bones['shoulder_l'] = shoulderL;

        const armLGeom = new THREE.CylinderGeometry(0.16 * limbScale, 0.14 * limbScale, 0.65 * limbScale, 10);
        const armL = this.createMeshWithOutline(armLGeom, armorMat);
        armL.position.set(0, -0.38 * limbScale, 0);
        shoulderL.add(armL);
        this.bones['arm_l'] = armL;

        const elbowL = new THREE.Group();
        elbowL.position.set(0, -0.35 * limbScale, 0);
        armL.add(elbowL);
        this.bones['elbow_l'] = elbowL;

        const forearmLGeom = new THREE.CylinderGeometry(0.15 * limbScale, 0.12 * limbScale, 0.60 * limbScale, 10);
        const forearmL = this.createMeshWithOutline(forearmLGeom, steelMat);
        forearmL.position.set(0, -0.30 * limbScale, 0);
        elbowL.add(forearmL);
        this.bones['forearm_l'] = forearmL;

        // Shield on Left Forearm
        if (this.equipment.shield) {
          const shieldGeom = new THREE.CylinderGeometry(0.48 * bodyScale, 0.28 * bodyScale, 0.85 * bodyScale, 12);
          const shield = this.createMeshWithOutline(shieldGeom, steelMat);
          shield.rotation.y = -Math.PI / 2;
          shield.position.set(-0.25 * bodyScale, 0, 0);
          forearmL.add(shield);
        }

        // Right Arm
        const shoulderR = this.createMeshWithOutline(new THREE.SphereGeometry(0.24 * bodyScale, 10, 8), steelMat);
        shoulderR.position.set(0.55 * bodyScale, 0.32 * bodyScale, 0);
        torso.add(shoulderR);
        this.bones['shoulder_r'] = shoulderR;

        const armRGeom = new THREE.CylinderGeometry(0.16 * limbScale, 0.14 * limbScale, 0.65 * limbScale, 10);
        const armR = this.createMeshWithOutline(armRGeom, armorMat);
        armR.position.set(0, -0.38 * limbScale, 0);
        shoulderR.add(armR);
        this.bones['arm_r'] = armR;

        const elbowR = new THREE.Group();
        elbowR.position.set(0, -0.35 * limbScale, 0);
        armR.add(elbowR);
        this.bones['elbow_r'] = elbowR;

        const forearmRGeom = new THREE.CylinderGeometry(0.15 * limbScale, 0.12 * limbScale, 0.60 * limbScale, 10);
        const forearmR = this.createMeshWithOutline(forearmRGeom, steelMat);
        forearmR.position.set(0, -0.30 * limbScale, 0);
        elbowR.add(forearmR);
        this.bones['forearm_r'] = forearmR;

        // Weapon in Right Hand
        if (this.equipment.weapon === 'sword') {
          const swordGroup = new THREE.Group();
          swordGroup.position.set(0, -0.32 * limbScale, 0.15 * limbScale);
          swordGroup.rotation.x = Math.PI / 2;

          const hilt = this.createMeshWithOutline(new THREE.CylinderGeometry(0.06, 0.06, 0.3, 8), leatherMat);
          swordGroup.add(hilt);
          const guard = this.createMeshWithOutline(new THREE.BoxGeometry(0.42, 0.07, 0.12), goldMat);
          guard.position.set(0, 0.15, 0);
          swordGroup.add(guard);
          const blade = this.createMeshWithOutline(new THREE.BoxGeometry(0.14, 1.25, 0.05), steelMat);
          blade.position.set(0, 0.78, 0);
          swordGroup.add(blade);

          forearmR.add(swordGroup);
          this.bones['weapon'] = swordGroup;
        } else if (this.equipment.weapon === 'staff') {
          const staffGroup = new THREE.Group();
          staffGroup.position.set(0, -0.32 * limbScale, 0.15 * limbScale);
          staffGroup.rotation.x = Math.PI / 2;
          const shaft = this.createMeshWithOutline(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 8), leatherMat);
          staffGroup.add(shaft);
          const gem = this.createMeshWithOutline(new THREE.OctahedronGeometry(0.22), this.createCelMaterial(0x06b6d4, true));
          gem.position.set(0, 0.95, 0);
          staffGroup.add(gem);
          forearmR.add(staffGroup);
          this.bones['weapon'] = staffGroup;
        }

        // 5. Legs & Feet
        // Left Leg
        const hipL = new THREE.Group();
        hipL.position.set(-0.24 * bodyScale, -0.25 * bodyScale, 0);
        pelvis.add(hipL);
        this.bones['hip_l'] = hipL;

        const thighLGeom = new THREE.CylinderGeometry(0.20 * limbScale, 0.16 * limbScale, 0.75 * limbScale, 10);
        const thighL = this.createMeshWithOutline(thighLGeom, darkArmorMat);
        thighL.position.set(0, -0.38 * limbScale, 0);
        hipL.add(thighL);
        this.bones['thigh_l'] = thighL;

        const kneeL = new THREE.Group();
        kneeL.position.set(0, -0.38 * limbScale, 0);
        thighL.add(kneeL);
        this.bones['knee_l'] = kneeL;

        const calfLGeom = new THREE.CylinderGeometry(0.17 * limbScale, 0.14 * limbScale, 0.70 * limbScale, 10);
        const calfL = this.createMeshWithOutline(calfLGeom, leatherMat);
        calfL.position.set(0, -0.35 * limbScale, 0);
        kneeL.add(calfL);
        this.bones['calf_l'] = calfL;

        const footLGeom = new THREE.BoxGeometry(0.22 * limbScale, 0.16 * limbScale, 0.42 * limbScale);
        const footL = this.createMeshWithOutline(footLGeom, leatherMat);
        footL.position.set(0, -0.42 * limbScale, 0.10 * limbScale);
        kneeL.add(footL);

        // Right Leg
        const hipR = new THREE.Group();
        hipR.position.set(0.24 * bodyScale, -0.25 * bodyScale, 0);
        pelvis.add(hipR);
        this.bones['hip_r'] = hipR;

        const thighRGeom = new THREE.CylinderGeometry(0.20 * limbScale, 0.16 * limbScale, 0.75 * limbScale, 10);
        const thighR = this.createMeshWithOutline(thighRGeom, darkArmorMat);
        thighR.position.set(0, -0.38 * limbScale, 0);
        hipR.add(thighR);
        this.bones['thigh_r'] = thighR;

        const kneeR = new THREE.Group();
        kneeR.position.set(0, -0.38 * limbScale, 0);
        thighR.add(kneeR);
        this.bones['knee_r'] = kneeR;

        const calfRGeom = new THREE.CylinderGeometry(0.17 * limbScale, 0.14 * limbScale, 0.70 * limbScale, 10);
        const calfR = this.createMeshWithOutline(calfRGeom, leatherMat);
        calfR.position.set(0, -0.35 * limbScale, 0);
        kneeR.add(calfR);
        this.bones['calf_r'] = calfR;

        const footRGeom = new THREE.BoxGeometry(0.22 * limbScale, 0.16 * limbScale, 0.42 * limbScale);
        const footR = this.createMeshWithOutline(footRGeom, leatherMat);
        footR.position.set(0, -0.42 * limbScale, 0.10 * limbScale);
        kneeR.add(footR);

      } else if (modelType === 'dragon') {
        const scalesMat = this.createCelMaterial(0xdc2626);
        const darkScalesMat = this.createCelMaterial(0x991b1b);
        const wingMat = this.createCelMaterial(0xf97316);
        const hornMat = this.createCelMaterial(0xf1f5f9, true);

        // Torso
        const torso = this.createMeshWithOutline(new THREE.CylinderGeometry(0.65, 0.85, 1.6, 12), scalesMat);
        torso.rotation.x = Math.PI / 2.3;
        torso.position.set(0, 1.2, 0);
        root.add(torso);
        this.bones['torso'] = torso;

        // Serpentine Neck & Head
        const neck = this.createMeshWithOutline(new THREE.CylinderGeometry(0.35, 0.50, 1.0, 10), scalesMat);
        neck.position.set(0, 0.9, 0.6);
        neck.rotation.x = -Math.PI / 4;
        torso.add(neck);
        this.bones['neck'] = neck;

        const head = this.createMeshWithOutline(new THREE.BoxGeometry(0.6, 0.45, 0.9), scalesMat);
        head.position.set(0, 0.6, 0.2);
        neck.add(head);
        this.bones['head'] = head;

        // Horns
        const hornL = this.createMeshWithOutline(new THREE.ConeGeometry(0.14, 0.75, 8), hornMat);
        hornL.position.set(-0.25, 0.35, -0.2);
        hornL.rotation.x = -Math.PI / 3;
        head.add(hornL);
        const hornR = this.createMeshWithOutline(new THREE.ConeGeometry(0.14, 0.75, 8), hornMat);
        hornR.position.set(0.25, 0.35, -0.2);
        hornR.rotation.x = -Math.PI / 3;
        head.add(hornR);

        // Bat Wings
        const wingL = new THREE.Group();
        wingL.position.set(-0.6, 0.2, 0);
        torso.add(wingL);
        this.bones['wing_l'] = wingL;
        const wingMeshL = this.createMeshWithOutline(new THREE.BoxGeometry(1.6, 0.08, 1.2), wingMat);
        wingMeshL.position.set(-0.8, 0, 0);
        wingL.add(wingMeshL);

        const wingR = new THREE.Group();
        wingR.position.set(0.6, 0.2, 0);
        torso.add(wingR);
        this.bones['wing_r'] = wingR;
        const wingMeshR = this.createMeshWithOutline(new THREE.BoxGeometry(1.6, 0.08, 1.2), wingMat);
        wingMeshR.position.set(0.8, 0, 0);
        wingR.add(wingMeshR);

        // Tail
        const tail = this.createMeshWithOutline(new THREE.CylinderGeometry(0.2, 0.55, 1.8, 10), darkScalesMat);
        tail.position.set(0, -1.0, -0.4);
        tail.rotation.x = -Math.PI / 3;
        torso.add(tail);
        this.bones['tail'] = tail;

      } else if (modelType === 'golem') {
        const stoneMat = this.createCelMaterial(0x64748b);
        const darkStoneMat = this.createCelMaterial(0x334155);
        const runeMat = this.createCelMaterial(0x06b6d4, true);

        const torso = this.createMeshWithOutline(new THREE.BoxGeometry(1.6, 1.4, 1.0), stoneMat);
        torso.position.set(0, 1.4, 0);
        root.add(torso);
        this.bones['torso'] = torso;

        // Glowing Rune in chest
        const rune = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.1), runeMat);
        rune.position.set(0, 0.1, 0.52);
        torso.add(rune);

        const head = this.createMeshWithOutline(new THREE.BoxGeometry(0.7, 0.55, 0.65), stoneMat);
        head.position.set(0, 0.95, 0);
        torso.add(head);

        // Fists
        const shoulderL = this.createMeshWithOutline(new THREE.SphereGeometry(0.45, 10, 8), darkStoneMat);
        shoulderL.position.set(-1.15, 0.4, 0);
        torso.add(shoulderL);
        this.bones['arm_l'] = shoulderL;
        const fistL = this.createMeshWithOutline(new THREE.BoxGeometry(0.55, 0.75, 0.55), stoneMat);
        fistL.position.set(0, -0.65, 0);
        shoulderL.add(fistL);

        const shoulderR = this.createMeshWithOutline(new THREE.SphereGeometry(0.45, 10, 8), darkStoneMat);
        shoulderR.position.set(1.15, 0.4, 0);
        torso.add(shoulderR);
        this.bones['arm_r'] = shoulderR;
        const fistR = this.createMeshWithOutline(new THREE.BoxGeometry(0.55, 0.75, 0.55), stoneMat);
        fistR.position.set(0, -0.65, 0);
        shoulderR.add(fistR);

        // Legs
        const legL = this.createMeshWithOutline(new THREE.BoxGeometry(0.55, 1.1, 0.55), darkStoneMat);
        legL.position.set(-0.45, -0.85, 0);
        torso.add(legL);
        this.bones['leg_l'] = legL;

        const legR = this.createMeshWithOutline(new THREE.BoxGeometry(0.55, 1.1, 0.55), darkStoneMat);
        legR.position.set(0.45, -0.85, 0);
        torso.add(legR);
        this.bones['leg_r'] = legR;

      } else if (modelType === 'spider') {
        const bodyMat = this.createCelMaterial(0x1e1b4b);
        const darkBodyMat = this.createCelMaterial(0x0f172a);
        const eyeMat = this.createCelMaterial(0xef4444, true);
        const patternMat = this.createCelMaterial(0x818cf8);

        // Cephalothorax (Front Body)
        const ceph = this.createMeshWithOutline(new THREE.SphereGeometry(0.5, 12, 10), darkBodyMat);
        ceph.scale.set(1.0, 0.6, 1.2);
        ceph.position.set(0, 0.6, 0.2);
        root.add(ceph);
        this.bones['torso'] = ceph;

        // Abdomen (Large rear bulb)
        const abdo = this.createMeshWithOutline(new THREE.SphereGeometry(0.85, 14, 12), bodyMat);
        abdo.scale.set(1.1, 0.9, 1.4);
        abdo.position.set(0, 0.25, -1.3);
        ceph.add(abdo);

        // Dorsal Chevron
        const chev = this.createMeshWithOutline(new THREE.BoxGeometry(0.4, 0.08, 0.6), patternMat);
        chev.position.set(0, 0.8, 0);
        abdo.add(chev);

        // 8 Red Eyes
        for (let i = -2; i <= 2; i++) {
          if (i === 0) continue;
          const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), eyeMat);
          eye.position.set(i * 0.12, 0.1, 0.55);
          ceph.add(eye);
        }

        // 8 Articulated Legs
        this.bones.legs = [];
        for (let side = -1; side <= 1; side += 2) {
          for (let l = 0; l < 4; l++) {
            const legRoot = new THREE.Group();
            legRoot.position.set(side * 0.45, 0, (l - 1.5) * 0.35);
            ceph.add(legRoot);

            const femur = this.createMeshWithOutline(new THREE.CylinderGeometry(0.08, 0.06, 0.9, 8), darkBodyMat);
            femur.position.set(side * 0.4, 0.3, 0);
            femur.rotation.z = side * 0.8;
            legRoot.add(femur);

            const tibia = this.createMeshWithOutline(new THREE.CylinderGeometry(0.06, 0.04, 1.1, 8), bodyMat);
            tibia.position.set(side * 0.8, -0.4, 0);
            tibia.rotation.z = -side * 0.9;
            femur.add(tibia);

            this.bones.legs.push({ root: legRoot, side, index: l });
          }
        }

      } else if (modelType === 'chest') {
        const woodMat = this.createCelMaterial(0x854d0e);
        const goldMat = this.createCelMaterial(0xfacc15, true);
        const ironMat = this.createCelMaterial(0x334155, true);

        // Chest Base Box
        const base = this.createMeshWithOutline(new THREE.BoxGeometry(1.6, 0.8, 1.2), woodMat);
        base.position.set(0, 0.5, 0);
        root.add(base);
        this.bones['torso'] = base;

        // Gold Trim Bands
        const band1 = this.createMeshWithOutline(new THREE.BoxGeometry(1.64, 0.82, 0.14), ironMat);
        base.add(band1);
        const lock = this.createMeshWithOutline(new THREE.BoxGeometry(0.24, 0.28, 0.12), goldMat);
        lock.position.set(0, 0.2, 0.62);
        base.add(lock);

        // Hinged Lid Pivot
        const lidPivot = new THREE.Group();
        lidPivot.position.set(0, 0.4, -0.6);
        base.add(lidPivot);
        this.bones['lid'] = lidPivot;

        const lid = this.createMeshWithOutline(new THREE.CylinderGeometry(0.62, 0.62, 1.6, 12, 1, false, 0, Math.PI), woodMat);
        lid.rotation.z = Math.PI / 2;
        lid.position.set(0, 0, 0.6);
        lidPivot.add(lid);

        // Glowing treasure inside
        const treasure = this.createMeshWithOutline(new THREE.BoxGeometry(1.3, 0.3, 0.9), goldMat);
        treasure.position.set(0, 0.15, 0);
        base.add(treasure);

      } else if (modelType === 'staff') {
        const woodMat = this.createCelMaterial(0x78350f);
        const goldMat = this.createCelMaterial(0xfacc15, true);
        const gemMat = this.createCelMaterial(0x06b6d4, true);

        const haft = this.createMeshWithOutline(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 10), woodMat);
        haft.position.set(0, 1.2, 0);
        root.add(haft);
        this.bones['torso'] = haft;

        // Gold Filigree Rings
        for (let y = -0.8; y <= 0.8; y += 0.4) {
          const ring = this.createMeshWithOutline(new THREE.TorusGeometry(0.11, 0.03, 8, 16), goldMat);
          ring.rotation.x = Math.PI / 2;
          ring.position.set(0, y, 0);
          haft.add(ring);
        }

        // Top Crown
        const crown = this.createMeshWithOutline(new THREE.TorusGeometry(0.35, 0.08, 8, 16, Math.PI * 1.5), goldMat);
        crown.position.set(0, 1.35, 0);
        crown.rotation.z = -Math.PI * 0.25;
        haft.add(crown);

        // Floating Arcane Gem
        const gem = this.createMeshWithOutline(new THREE.OctahedronGeometry(0.28), gemMat);
        gem.position.set(0, 1.45, 0);
        haft.add(gem);
        this.bones['gem'] = gem;

      } else if (modelType === 'sword_shield') {
        const steelMat = this.createCelMaterial(0xe2e8f0, true);
        const goldMat = this.createCelMaterial(0xfacc15, true);
        const leatherMat = this.createCelMaterial(0x78350f);
        const shieldMat = this.createCelMaterial(0x2563eb);

        // Floating Armament Group
        const group = new THREE.Group();
        group.position.set(0, 1.2, 0);
        root.add(group);
        this.bones['torso'] = group;

        // Shield (Left)
        const shield = this.createMeshWithOutline(new THREE.CylinderGeometry(0.7, 0.45, 1.3, 14), shieldMat);
        shield.position.set(-0.65, 0, 0);
        shield.rotation.y = Math.PI * 0.15;
        group.add(shield);
        const rim = this.createMeshWithOutline(new THREE.TorusGeometry(0.65, 0.06, 8, 20), goldMat);
        rim.position.set(-0.65, 0, 0.1);
        group.add(rim);

        // Broadsword (Right)
        const sword = new THREE.Group();
        sword.position.set(0.65, 0, 0);
        sword.rotation.z = -Math.PI * 0.1;
        group.add(sword);
        this.bones['weapon'] = sword;

        const blade = this.createMeshWithOutline(new THREE.BoxGeometry(0.18, 1.8, 0.06), steelMat);
        blade.position.set(0, 0.6, 0);
        sword.add(blade);
        const guard = this.createMeshWithOutline(new THREE.BoxGeometry(0.65, 0.1, 0.14), goldMat);
        guard.position.set(0, -0.3, 0);
        sword.add(guard);
        const hilt = this.createMeshWithOutline(new THREE.CylinderGeometry(0.07, 0.07, 0.45, 8), leatherMat);
        hilt.position.set(0, -0.55, 0);
        sword.add(hilt);
      }

      this.activeMeshGroup = root;
      this.scene.add(root);
      return root;
    }

    // =========================================================================
    // 3D KINEMATICS & ANIMATION
    // =========================================================================

    updatePose(timeInSeconds, action = this.activeAction) {
      const b = this.bones;
      if (!b) return;

      const t = timeInSeconds * Math.PI * 2.0;

      if (this.activeModel === 'humanoid' || this.activeModel === 'chibi') {
        if (action === 't_pose') {
          if (b.pelvis) b.pelvis.position.y = 1.25;
          if (b.shoulder_l) b.shoulder_l.rotation.set(0, 0, Math.PI / 2);
          if (b.shoulder_r) b.shoulder_r.rotation.set(0, 0, -Math.PI / 2);
          if (b.elbow_l) b.elbow_l.rotation.set(0, 0, 0);
          if (b.elbow_r) b.elbow_r.rotation.set(0, 0, 0);
          if (b.hip_l) b.hip_l.rotation.set(0, 0, 0);
          if (b.hip_r) b.hip_r.rotation.set(0, 0, 0);
          if (b.knee_l) b.knee_l.rotation.set(0, 0, 0);
          if (b.knee_r) b.knee_r.rotation.set(0, 0, 0);
          if (b.torso) b.torso.rotation.set(0, 0, 0);

        } else if (action === 'idle') {
          const breath = Math.sin(t * 1.2);
          if (b.pelvis) b.pelvis.position.y = 1.25 + breath * 0.02;
          if (b.torso) b.torso.scale.y = 1.0 + breath * 0.03;
          if (b.head) b.head.rotation.x = breath * 0.04;
          if (b.shoulder_l) b.shoulder_l.rotation.set(breath * 0.05, 0, breath * 0.02);
          if (b.shoulder_r) b.shoulder_r.rotation.set(-breath * 0.05, 0, -breath * 0.02);
          if (b.elbow_l) b.elbow_l.rotation.set(0.15, 0, 0);
          if (b.elbow_r) b.elbow_r.rotation.set(0.15, 0, 0);
          if (b.hip_l) b.hip_l.rotation.set(0, 0, 0);
          if (b.hip_r) b.hip_r.rotation.set(0, 0, 0);

        } else if (action === 'walk') {
          const legSwing = Math.sin(t * 2.0) * 0.52;
          const armSwing = Math.sin(t * 2.0) * 0.48;
          const hipBob = Math.abs(Math.sin(t * 2.0)) * 0.06;

          if (b.pelvis) {
            b.pelvis.position.y = 1.25 - hipBob;
            b.pelvis.rotation.y = -legSwing * 0.2;
          }
          if (b.torso) b.torso.rotation.y = legSwing * 0.25;

          if (b.hip_l) b.hip_l.rotation.x = legSwing;
          if (b.knee_l) b.knee_l.rotation.x = Math.max(0, -legSwing * 0.85);

          if (b.hip_r) b.hip_r.rotation.x = -legSwing;
          if (b.knee_r) b.knee_r.rotation.x = Math.max(0, legSwing * 0.85);

          if (b.shoulder_l) b.shoulder_l.rotation.x = -armSwing;
          if (b.elbow_l) b.elbow_l.rotation.x = Math.max(0.1, armSwing * 0.6);

          if (b.shoulder_r) b.shoulder_r.rotation.x = armSwing;
          if (b.elbow_r) b.elbow_r.rotation.x = Math.max(0.1, -armSwing * 0.6);

        } else if (action === 'run') {
          const runSwing = Math.sin(t * 3.2) * 0.82;
          const hipBob = Math.abs(Math.sin(t * 3.2)) * 0.12;

          if (b.pelvis) {
            b.pelvis.position.y = 1.25 - hipBob;
            b.pelvis.rotation.x = 0.22;
          }
          if (b.hip_l) b.hip_l.rotation.x = runSwing;
          if (b.knee_l) b.knee_l.rotation.x = Math.max(0, -runSwing * 1.1);

          if (b.hip_r) b.hip_r.rotation.x = -runSwing;
          if (b.knee_r) b.knee_r.rotation.x = Math.max(0, runSwing * 1.1);

          if (b.shoulder_l) b.shoulder_l.rotation.x = -runSwing * 0.9;
          if (b.elbow_l) b.elbow_l.rotation.x = 0.65;

          if (b.shoulder_r) b.shoulder_r.rotation.x = runSwing * 0.9;
          if (b.elbow_r) b.elbow_r.rotation.x = 0.65;

        } else if (action === 'attack') {
          const slash = Math.sin(t * 2.5);
          if (b.torso) b.torso.rotation.y = slash * 0.55;
          if (b.shoulder_r) {
            b.shoulder_r.rotation.x = -0.5 + slash * 1.2;
            b.shoulder_r.rotation.z = -0.4 + slash * 0.8;
          }
          if (b.elbow_r) b.elbow_r.rotation.x = 0.45;
        }

      } else if (this.activeModel === 'dragon') {
        const flap = Math.sin(t * 2.0) * 0.75;
        if (b.wing_l) b.wing_l.rotation.z = flap;
        if (b.wing_r) b.wing_r.rotation.z = -flap;
        if (b.tail) b.tail.rotation.y = Math.sin(t * 2.0 - 0.8) * 0.35;
        if (b.torso) b.torso.position.y = 1.2 + Math.sin(t * 2.0) * 0.08;

      } else if (this.activeModel === 'golem') {
        const stomp = Math.sin(t * 1.5) * 0.45;
        if (b.arm_l) b.arm_l.rotation.x = stomp;
        if (b.arm_r) b.arm_r.rotation.x = -stomp;
        if (b.leg_l) b.leg_l.rotation.x = -stomp;
        if (b.leg_r) b.leg_r.rotation.x = stomp;
        if (b.torso) b.torso.position.y = 1.4 - Math.abs(stomp) * 0.08;

      } else if (this.activeModel === 'spider') {
        const crawl = Math.sin(t * 3.0);
        if (b.torso) b.torso.position.y = 0.6 + Math.abs(crawl) * 0.04;
        if (b.legs) {
          b.legs.forEach(leg => {
            const phase = ((leg.index % 2 === 0 ? 0 : Math.PI) + (leg.side > 0 ? 0 : Math.PI * 0.5));
            const swing = Math.sin(t * 3.0 + phase) * 0.35;
            leg.root.rotation.y = swing;
            leg.root.rotation.z = Math.max(-0.2, swing * 0.5);
          });
        }

      } else if (this.activeModel === 'chest') {
        if (action === 'open') {
          const openAngle = Math.min(Math.PI * 0.65, Math.max(0, (Math.sin(t * 1.5) + 1.0) * 0.5 * Math.PI * 0.65));
          if (b.lid) b.lid.rotation.x = -openAngle;
        } else if (action === 'attack') {
          const snap = Math.max(0, Math.sin(t * 4.0)) * Math.PI * 0.45;
          if (b.lid) b.lid.rotation.x = -snap;
        } else {
          if (b.lid) b.lid.rotation.x = 0;
        }

      } else if (this.activeModel === 'staff') {
        const bob = Math.sin(t * 1.5) * 0.08;
        if (b.torso) b.torso.position.y = 1.2 + bob;
        if (b.gem) {
          b.gem.rotation.y = t * 2.0;
          b.gem.rotation.x = Math.sin(t) * 0.2;
        }

      } else if (this.activeModel === 'sword_shield') {
        const bob = Math.sin(t * 1.5) * 0.06;
        if (b.torso) b.torso.position.y = 1.2 + bob;
        if (b.weapon) b.weapon.rotation.z = -Math.PI * 0.1 + Math.sin(t * 1.5) * 0.08;
      }
    }

    // =========================================================================
    // RENDERING & PIXEL-ART QUANTIZATION
    // =========================================================================

    renderToPixelBuffer(targetW = this.width, targetH = this.height) {
      if (!this.renderer || !this.renderTarget) return null;

      const curW = targetW;
      const curH = targetH;
      if (this.renderTarget.width !== curW || this.renderTarget.height !== curH) {
        this.renderTarget.setSize(curW, curH);
        this.renderer.setSize(curW, curH, false);
      }

      this.updateCameraTransform();

      // 1. Render Scene to WebGLRenderTarget
      this.renderer.setRenderTarget(this.renderTarget);
      this.renderer.clear();
      this.renderer.render(this.scene, this.getCamera());
      this.renderer.setRenderTarget(null);

      // 2. Read Raw Pixels
      const rawPixels = new Uint8Array(curW * curH * 4);
      this.renderer.readRenderTargetPixels(this.renderTarget, 0, 0, curW, curH, rawPixels);

      // WebGL reads bottom-up; flip vertically to standard top-down image
      const flippedBuffer = new Uint8ClampedArray(curW * curH * 4);
      for (let y = 0; y < curH; y++) {
        const srcRow = (curH - 1 - y) * curW * 4;
        const dstRow = y * curW * 4;
        for (let x = 0; x < curW * 4; x++) {
          flippedBuffer[dstRow + x] = rawPixels[srcRow + x];
        }
      }

      // 3. Post-Process: Cel-Shading Luminance Stepping & Palette Snapping
      const finalBuffer = new Uint8ClampedArray(curW * curH * 4);
      const symbolGrid = [];
      const palette = RETRO_PALETTES[this.snapPalette] || null;

      for (let i = 0; i < curW * curH; i++) {
        const idx = i * 4;
        const r = flippedBuffer[idx];
        const g = flippedBuffer[idx + 1];
        const b = flippedBuffer[idx + 2];
        const a = flippedBuffer[idx + 3];

        if (a < 20) {
          finalBuffer[idx] = 0;
          finalBuffer[idx + 1] = 0;
          finalBuffer[idx + 2] = 0;
          finalBuffer[idx + 3] = 0;
          symbolGrid.push('.');
          continue;
        }

        // Discrete Cel-Shading Stepping
        let fr = r, fg = g, fb = b;
        if (this.celSteps > 0 && this.celSteps < 8) {
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          const stepSize = 255 / this.celSteps;
          const steppedLum = Math.round(lum / stepSize) * stepSize;
          const lumFactor = lum > 0 ? steppedLum / lum : 1.0;
          fr = Math.min(255, Math.max(0, Math.round(r * lumFactor)));
          fg = Math.min(255, Math.max(0, Math.round(g * lumFactor)));
          fb = Math.min(255, Math.max(0, Math.round(b * lumFactor)));
        }

        // Palette Snapping (if selected)
        if (palette) {
          let bestDist = Infinity;
          let bestCol = [fr, fg, fb];
          for (let p = 0; p < palette.length; p++) {
            const pr = palette[p][0];
            const pg = palette[p][1];
            const pb = palette[p][2];
            const dist = (fr - pr) * (fr - pr) + (fg - pg) * (fg - pg) + (fb - pb) * (fb - pb);
            if (dist < bestDist) {
              bestDist = dist;
              bestCol = palette[p];
            }
          }
          fr = bestCol[0];
          fg = bestCol[1];
          fb = bestCol[2];
        }

        finalBuffer[idx] = fr;
        finalBuffer[idx + 1] = fg;
        finalBuffer[idx + 2] = fb;
        finalBuffer[idx + 3] = 255;
        symbolGrid.push('x');
      }

      return {
        width: curW,
        height: curH,
        buffer: finalBuffer,
        grid: symbolGrid
      };
    }

    // Tangent-Space 3D Normal Map Render
    renderNormalMapToPixelBuffer(targetW = this.width, targetH = this.height) {
      if (!this.renderer || !this.renderTarget) return null;

      const curW = targetW;
      const curH = targetH;
      if (this.renderTarget.width !== curW || this.renderTarget.height !== curH) {
        this.renderTarget.setSize(curW, curH);
        this.renderer.setSize(curW, curH, false);
      }

      this.updateCameraTransform();

      const originalOverride = this.scene.overrideMaterial;
      this.scene.overrideMaterial = new this.THREE.MeshNormalMaterial();

      this.renderer.setRenderTarget(this.renderTarget);
      this.renderer.clear();
      this.renderer.render(this.scene, this.getCamera());
      this.renderer.setRenderTarget(null);
      this.scene.overrideMaterial = originalOverride;

      const rawPixels = new Uint8Array(curW * curH * 4);
      this.renderer.readRenderTargetPixels(this.renderTarget, 0, 0, curW, curH, rawPixels);

      const flippedBuffer = new Uint8ClampedArray(curW * curH * 4);
      for (let y = 0; y < curH; y++) {
        const srcRow = (curH - 1 - y) * curW * 4;
        const dstRow = y * curW * 4;
        for (let x = 0; x < curW; x++) {
          const s = srcRow + x * 4;
          const d = dstRow + x * 4;
          const a = rawPixels[s + 3];
          if (a < 20) {
            // Flat normal for background: standard (128, 128, 255, 0)
            flippedBuffer[d] = 128;
            flippedBuffer[d + 1] = 128;
            flippedBuffer[d + 2] = 255;
            flippedBuffer[d + 3] = 0;
          } else {
            flippedBuffer[d] = rawPixels[s];
            flippedBuffer[d + 1] = rawPixels[s + 1];
            flippedBuffer[d + 2] = rawPixels[s + 2];
            flippedBuffer[d + 3] = 255;
          }
        }
      }

      return {
        width: curW,
        height: curH,
        buffer: flippedBuffer
      };
    }

    // Draws crisp upscaled preview onto an interactive Canvas element
    drawToCanvas(targetCanvas, pixelData) {
      if (!targetCanvas || !pixelData) return;
      const ctx = targetCanvas.getContext('2d');
      const w = pixelData.width;
      const h = pixelData.height;

      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const offCtx = off.getContext('2d');
      const imgData = offCtx.createImageData(w, h);
      imgData.data.set(pixelData.buffer);
      offCtx.putImageData(imgData, 0, 0);

      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
      ctx.drawImage(off, 0, 0, targetCanvas.width, targetCanvas.height);
    }

    // 4-Way RPG Directional Spritesheet Generator
    generate4WaySheet(action = this.activeAction, numFrames = 6) {
      const originalYaw = this.yaw;
      const originalTime = this.frameTime;
      const dirs = [
        { name: 'down', yaw: 0 },
        { name: 'right', yaw: 90 },
        { name: 'up', yaw: 180 },
        { name: 'left', yaw: 270 }
      ];

      const w = this.width;
      const h = this.height;
      const sheetCanvas = document.createElement('canvas');
      sheetCanvas.width = w * numFrames;
      sheetCanvas.height = h * 4;
      const ctx = sheetCanvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = w;
      tempCanvas.height = h;
      const tempCtx = tempCanvas.getContext('2d');

      for (let d = 0; d < 4; d++) {
        this.yaw = dirs[d].yaw;
        for (let f = 0; f < numFrames; f++) {
          const t = f / numFrames;
          this.updatePose(t, action);
          const pixelRes = this.renderToPixelBuffer(w, h);
          const imgData = tempCtx.createImageData(w, h);
          imgData.data.set(pixelRes.buffer);
          tempCtx.putImageData(imgData, 0, 0);
          ctx.drawImage(tempCanvas, f * w, d * h);
        }
      }

      this.yaw = originalYaw;
      this.updatePose(originalTime, action);

      return sheetCanvas;
    }

    // Export complete 3D model as a native PixelDSL JSON specification
    exportToPixelDSLSpec(numFrames = 1) {
      const originalTime = this.frameTime;
      const hexChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let charIdx = 0;
      const colorToChar = {};
      const paletteMap = { '.': 'transparent' };

      const frames = [];

      for (let f = 0; f < numFrames; f++) {
        const t = numFrames > 1 ? f / numFrames : originalTime;
        this.updatePose(t, this.activeAction);
        const pixelRes = this.renderToPixelBuffer();
        if (!pixelRes) continue;

        const gridRows = [];
        for (let y = 0; y < pixelRes.height; y++) {
          let rowStr = '';
          for (let x = 0; x < pixelRes.width; x++) {
            const idx = (y * pixelRes.width + x) * 4;
            const a = pixelRes.buffer[idx + 3];
            if (a === 0) {
              rowStr += '.';
            } else {
              const r = pixelRes.buffer[idx].toString(16).padStart(2, '0');
              const g = pixelRes.buffer[idx + 1].toString(16).padStart(2, '0');
              const b = pixelRes.buffer[idx + 2].toString(16).padStart(2, '0');
              const hex = `#${r}${g}${b}`;

              if (!colorToChar[hex]) {
                const ch = hexChars[charIdx % hexChars.length];
                charIdx++;
                colorToChar[hex] = ch;
                paletteMap[ch] = hex;
              }
              rowStr += colorToChar[hex];
            }
          }
          gridRows.push(rowStr);
        }
        frames.push(gridRows);
      }

      this.updatePose(originalTime, this.activeAction);

      const spec = {
        name: `3d_${this.activeModel}_${this.activeAction}_${this.width}x${this.height}`,
        prompt: `3D Projected ${this.activeModel} (${this.cameraMode}, yaw=${this.yaw}°, pitch=${this.pitch}°)`,
        width: this.width,
        height: this.height,
        fps: 8,
        palette: paletteMap,
        postProcess: {
          autoOutline: false,
          autoShading: false
        },
        grid: frames[0]
      };

      if (frames.length > 1) {
        spec.frames = frames.slice(1).map(grid => ({ grid }));
      }

      return spec;
    }
  }

  return Pixel3DStudio;
}));
