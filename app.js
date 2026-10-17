// PixelDSL Studio v2 — Interactive Web Controller (English UI, Undo/Redo, Hotkeys, Visual Frames & Layers)

(function () {
  let currentSpec = JSON.parse(JSON.stringify(window.PIXEL_PRESETS.turtle_grid_32x32.data));
  let lastRender = null;
  let editorMode = "json"; // "json" | "grid"
  let activeTool = "brush"; // "brush" | "eraser" | "picker" | "bucket"
  let activeSymbol = "S";
  let zoomLevel = "auto";
  let showGridLines = true;
  let showCenterAxes = false;
  let showNormalMap = false;
  let showOnionSkin = false;
  let isPointerDown = false;
  let strokeSnapshotRecorded = false;
  let hoverCoord = null;
  let selectedLayerIndex = -1;

  // Undo / Redo History Stack
  const undoStack = [];
  const redoStack = [];
  const MAX_HISTORY = 60;

  // Animation state
  let currentFrame = 0;
  let animTimer = null;

  // DOM Elements
  const panelLeft = document.getElementById("panelLeft");
  const btnToggleCodePanel = document.getElementById("btnToggleCodePanel");
  const btnCollapseCode = document.getElementById("btnCollapseCode");

  const presetSelect = document.getElementById("presetSelect");
  const btnNewSprite = document.getElementById("btnNewSprite");
  const codeEditor = document.getElementById("codeEditor");
  const tabJson = document.getElementById("tabJson");
  const tabGrid = document.getElementById("tabGrid");
  const btnNormalizeGrid = document.getElementById("btnNormalizeGrid");
  const btnBakeToGrid = document.getElementById("btnBakeToGrid");
  const editorStatus = document.getElementById("editorStatus");
  const editorMeta = document.getElementById("editorMeta");
  const aiDiagnosticsBadge = document.getElementById("aiDiagnosticsBadge");

  const btnUndo = document.getElementById("btnUndo");
  const btnRedo = document.getElementById("btnRedo");

  const mainCanvas = document.getElementById("mainCanvas");
  const canvasWrapper = document.getElementById("canvasWrapper");
  const viewportArea = document.getElementById("viewportArea");
  const preview1x = document.getElementById("preview1x");
  const previewTiled = document.getElementById("previewTiled");
  const cursorInfo = document.getElementById("cursorInfo");
  const canvasDimInfo = document.getElementById("canvasDimInfo");

  const zoomSelect = document.getElementById("zoomSelect");
  const bgSelect = document.getElementById("bgSelect");
  const chkGridLines = document.getElementById("chkGridLines");
  const chkCenterAxes = document.getElementById("chkCenterAxes");
  const chkNormalMap = document.getElementById("chkNormalMap");

  const timelineFrames = document.getElementById("timelineFrames");
  const btnPlayAnim = document.getElementById("btnPlayAnim");
  const selAnimFps = document.getElementById("selAnimFps");
  const chkOnionSkin = document.getElementById("chkOnionSkin");
  const btnAddFrame = document.getElementById("btnAddFrame");
  const btnDeleteFrame = document.getElementById("btnDeleteFrame");

  const engineBadge = document.getElementById("engineBadge");

  // Rig Inspector Elements
  const groupRigInspector = document.getElementById("groupRigInspector");
  const boneCountBadge = document.getElementById("boneCountBadge");
  const bonesList = document.getElementById("bonesList");
  const btnAddBone = document.getElementById("btnAddBone");
  const btnToggleBonesDebug = document.getElementById("btnToggleBonesDebug");
  let showSkeletonDebug = false;

  // Shader Inspector Elements
  const groupShaderInspector = document.getElementById("groupShaderInspector");
  const selShaderType = document.getElementById("selShaderType");
  const selShaderDither = document.getElementById("selShaderDither");
  const inputShaderDitherStrength = document.getElementById("inputShaderDitherStrength");
  const lblShaderDitherStrength = document.getElementById("lblShaderDitherStrength");
  const selShaderFrames = document.getElementById("selShaderFrames");
  const btnRecompileShader = document.getElementById("btnRecompileShader");
  const groupLayersInspector = document.getElementById("groupLayersInspector");

  const layerCountBadge = document.getElementById("layerCountBadge");
  const layersList = document.getElementById("layersList");
  const btnAddEllipseLayer = document.getElementById("btnAddEllipseLayer");
  const btnAddRectLayer = document.getElementById("btnAddRectLayer");
  const selAddAdvancedLayer = document.getElementById("selAddAdvancedLayer");
  const btnShowAllLayers = document.getElementById("btnShowAllLayers");

  const inputWidth = document.getElementById("inputWidth");
  const inputHeight = document.getElementById("inputHeight");
  const btnApplySize = document.getElementById("btnApplySize");
  const sizePillsContainer = document.getElementById("sizePills");

  const selSymmetry = document.getElementById("selSymmetry");
  const chkAutoOutline = document.getElementById("chkAutoOutline");
  const inputOutlineColor = document.getElementById("inputOutlineColor");
  const chkAutoShading = document.getElementById("chkAutoShading");
  const inputShadingStrength = document.getElementById("inputShadingStrength");
  const chkSdfShading = document.getElementById("chkSdfShading");
  const chkSelOut = document.getElementById("chkSelOut");

  const selPalettePreset = document.getElementById("selPalettePreset");
  const paletteList = document.getElementById("paletteList");
  const btnAddSymbol = document.getElementById("btnAddSymbol");
  const btnAddRamp = document.getElementById("btnAddRamp");

  const btnExport1x = document.getElementById("btnExport1x");
  const btnExportNormal = document.getElementById("btnExportNormal");
  const btnExportSheet = document.getElementById("btnExportSheet");
  const btnExportUpscaled = document.getElementById("btnExportUpscaled");

  // Mutator & Archetype Generator Modal Elements
  const modalMutate = document.getElementById("modalMutate");
  const btnOpenMutateModal = document.getElementById("btnOpenMutateModal");
  const btnCloseMutateModal = document.getElementById("btnCloseMutateModal");
  const btnCloseMutateFooter = document.getElementById("btnCloseMutateFooter");
  const selGenArchetype = document.getElementById("selGenArchetype");
  const inputGenSeed = document.getElementById("inputGenSeed");
  const btnGenerate3x3Arch = document.getElementById("btnGenerate3x3Arch");
  const inputMutateRate = document.getElementById("inputMutateRate");
  const lblMutateRate = document.getElementById("lblMutateRate");
  const btnEvolve3x3Current = document.getElementById("btnEvolve3x3Current");
  const mutateGrid3x3 = document.getElementById("mutateGrid3x3");

  // Prompt Modal Elements
  const modalPrompt = document.getElementById("modalPrompt");
  const btnOpenPromptModal = document.getElementById("btnOpenPromptModal");
  const btnClosePromptModal = document.getElementById("btnClosePromptModal");
  const promptUserRequest = document.getElementById("promptUserRequest");
  const promptSizeSelect = document.getElementById("promptSizeSelect");
  const promptModeSelect = document.getElementById("promptModeSelect");
  const promptOutput = document.getElementById("promptOutput");
  const btnCopyPrompt = document.getElementById("btnCopyPrompt");

  // History Management (Undo / Redo)
  function pushUndoState() {
    const snap = JSON.stringify(currentSpec);
    if (undoStack.length > 0 && undoStack[undoStack.length - 1] === snap) return;
    undoStack.push(snap);
    if (undoStack.length > MAX_HISTORY) undoStack.shift();
    redoStack.length = 0;
    updateUndoRedoButtons();
  }

  function performUndo() {
    if (undoStack.length === 0) return;
    redoStack.push(JSON.stringify(currentSpec));
    const prev = undoStack.pop();
    currentSpec = JSON.parse(prev);
    updateUndoRedoButtons();
    syncEditorFromSpec();
    syncInspectorFromSpec();
    renderAll();
  }

  function performRedo() {
    if (redoStack.length === 0) return;
    undoStack.push(JSON.stringify(currentSpec));
    const next = redoStack.pop();
    currentSpec = JSON.parse(next);
    updateUndoRedoButtons();
    syncEditorFromSpec();
    syncInspectorFromSpec();
    renderAll();
  }

  function updateUndoRedoButtons() {
    btnUndo.disabled = undoStack.length === 0;
    btnRedo.disabled = redoStack.length === 0;
  }

  btnUndo.addEventListener("click", performUndo);
  btnRedo.addEventListener("click", performRedo);

  // Collapsible Left Code Panel
  function toggleCodePanel(forceState) {
    const isCollapsed = typeof forceState === "boolean"
      ? !forceState
      : !panelLeft.classList.contains("collapsed");
    panelLeft.classList.toggle("collapsed", isCollapsed);
    btnToggleCodePanel.classList.toggle("active", !isCollapsed);
    setTimeout(() => renderAll(), 20);
  }

  btnToggleCodePanel.addEventListener("click", () => toggleCodePanel());
  btnCollapseCode.addEventListener("click", () => toggleCodePanel(false));

  // Global Keyboard Shortcuts: Alt+Z (Undo), Alt+Y (Redo), D (Pencil), E (Eraser), S (Eyedropper), G (Bucket)
  window.addEventListener("keydown", (evt) => {
    const key = evt.key.toLowerCase();

    // Alt+Z -> Undo (works globally!)
    if (evt.altKey && !evt.ctrlKey && !evt.metaKey && key === "z") {
      evt.preventDefault();
      if (evt.shiftKey) {
        performRedo();
      } else {
        performUndo();
      }
      return;
    }

    // Alt+Y -> Redo
    if (evt.altKey && !evt.ctrlKey && !evt.metaKey && key === "y") {
      evt.preventDefault();
      performRedo();
      return;
    }

    // Ignore single-key tool shortcuts if typing in an input/textarea/select
    const tag = (evt.target && evt.target.tagName) ? evt.target.tagName.toUpperCase() : "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

    // Also allow Ctrl+Z / Ctrl+Y when not focused in text inputs
    if ((evt.ctrlKey || evt.metaKey) && key === "z") {
      evt.preventDefault();
      if (evt.shiftKey) performRedo();
      else performUndo();
      return;
    }
    if ((evt.ctrlKey || evt.metaKey) && key === "y") {
      evt.preventDefault();
      performRedo();
      return;
    }

    if (!evt.altKey && !evt.ctrlKey && !evt.metaKey) {
      if (key === "d") {
        evt.preventDefault();
        setTool("brush");
      } else if (key === "e") {
        evt.preventDefault();
        setTool("eraser");
      } else if (key === "s") {
        evt.preventDefault();
        setTool("picker");
      } else if (key === "g") {
        evt.preventDefault();
        setTool("bucket");
      }
    }
  });

  function createNewCleanSprite() {
    pushUndoState();
    stopAnim();
    currentFrame = 0;
    selectedLayerIndex = -1;
    const w = PixelDSLRenderer.clampSize(currentSpec.width, 32);
    const h = PixelDSLRenderer.clampSize(currentSpec.height, 32);
    currentSpec = {
      name: `new_sprite_${w}x${h}`,
      width: w,
      height: h,
      symmetry: "none",
      rle: false,
      palettePreset: "endesga32",
      ramps: {
        "S": { "base": "#3e8948", "light": "L", "dark": "B", "outline": "O" }
      },
      palette: {
        ".": "transparent",
        "O": "#14182e",
        "S": "#3e8948",
        "L": "#73d95c",
        "B": "#265c42",
        "w": "#ffffff"
      },
      postProcess: {
        autoOutline: false,
        outlineColor: "#14182e",
        autoShading: false,
        shadingStrength: 0.16,
        sdfShading: false
      },
      layers: [],
      frames: [],
      grid: Array.from({ length: h }, () => ".".repeat(w))
    };
    activeSymbol = "S";
    setTool("brush");
    syncEditorFromSpec();
    syncInspectorFromSpec();
    renderAll();
  }

  if (btnNewSprite) {
    btnNewSprite.addEventListener("click", createNewCleanSprite);
  }

  function initPresets() {
    presetSelect.innerHTML = "";
    for (const [key, item] of Object.entries(window.PIXEL_PRESETS)) {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = item.label;
      presetSelect.appendChild(opt);
    }
    presetSelect.addEventListener("change", () => {
      const preset = window.PIXEL_PRESETS[presetSelect.value];
      if (preset) {
        stopAnim();
        currentFrame = 0;
        selectedLayerIndex = -1;
        undoStack.length = 0;
        redoStack.length = 0;
        updateUndoRedoButtons();
        currentSpec = JSON.parse(JSON.stringify(preset.data));
        pickDefaultActiveSymbol();
        syncEditorFromSpec();
        syncInspectorFromSpec();
        renderAll();
      }
    });
  }

  function pickDefaultActiveSymbol() {
    const resolved = PixelDSLRenderer.resolveFullPalette(currentSpec);
    const keys = Object.keys(resolved).filter((k) => k !== "." && k !== " ");
    if (keys.length > 0 && (!resolved[activeSymbol] || activeSymbol === ".")) {
      activeSymbol = keys[0];
    }
  }

  function computeEffectiveZoom(w, h) {
    if (zoomLevel !== "auto") return parseInt(zoomLevel, 10) || 8;
    const rect = viewportArea.getBoundingClientRect();
    const availW = Math.max(200, rect.width - 48);
    const availH = Math.max(200, rect.height - 48);
    const maxScale = Math.floor(Math.min(availW / w, availH / h));
    return Math.max(3, Math.min(36, maxScale));
  }

  function syncEditorFromSpec() {
    if (editorMode === "json") {
      codeEditor.classList.remove("grid-mode");
      codeEditor.value = JSON.stringify(currentSpec, null, 2);
    } else {
      codeEditor.classList.add("grid-mode");
      const w = PixelDSLRenderer.clampSize(currentSpec.width, 32);
      const h = PixelDSLRenderer.clampSize(currentSpec.height, 32);
      const norm = PixelDSLRenderer.normalizeGrid(
        currentSpec.grid && currentSpec.grid.length > 0
          ? currentSpec.grid
          : (lastRender ? PixelDSLRenderer.bakeToGrid(lastRender, PixelDSLRenderer.resolveFullPalette(currentSpec)) : []),
        w,
        h,
        Boolean(currentSpec.rle),
        currentSpec.symmetry || "none"
      );
      codeEditor.value = norm.normalized.join("\n");
    }
  }

  function syncInspectorFromSpec() {
    const w = PixelDSLRenderer.clampSize(currentSpec.width, 32);
    const h = PixelDSLRenderer.clampSize(currentSpec.height, 32);
    inputWidth.value = w;
    inputHeight.value = h;

    document.querySelectorAll(".size-pill").forEach((pill) => {
      const pw = parseInt(pill.dataset.w, 10);
      const ph = parseInt(pill.dataset.h, 10);
      pill.classList.toggle("active", pw === w && ph === h);
    });

    selSymmetry.value = currentSpec.symmetry || "none";
    selPalettePreset.value = currentSpec.palettePreset || "";

    const post = currentSpec.postProcess || {};
    chkAutoOutline.checked = Boolean(post.autoOutline);
    inputOutlineColor.value = (post.outlineColor || "#14182e").slice(0, 7);
    chkAutoShading.checked = Boolean(post.autoShading);
    inputShadingStrength.value = Math.round((Number(post.shadingStrength ?? 0.16)) * 100);
    if (chkSdfShading) chkSdfShading.checked = Boolean(post.sdfShading);
    if (chkSelOut) chkSelOut.checked = Boolean(post.selOut);

    // Update active engine badge
    if (engineBadge) {
      if (currentSpec.type === "rig") {
        engineBadge.textContent = "🦴 Rig Engine (FK)";
        engineBadge.className = "engine-badge badge-rig";
      } else if (currentSpec.type === "shader") {
        engineBadge.textContent = "✨ GLSL Shader";
        engineBadge.className = "engine-badge badge-shader";
      } else if (Array.isArray(currentSpec.layers) && currentSpec.layers.length > 0) {
        engineBadge.textContent = "📐 2.5D SDF";
        engineBadge.className = "engine-badge badge-layers";
      } else {
        engineBadge.textContent = "🔲 Grid";
        engineBadge.className = "engine-badge badge-grid";
      }
    }

    // Toggle inspector panels depending on active spec type
    if (groupRigInspector && groupShaderInspector && groupLayersInspector) {
      if (currentSpec.type === "rig") {
        groupRigInspector.style.display = "";
        groupShaderInspector.style.display = "none";
        groupLayersInspector.style.display = "none";
        renderBonesList();
      } else if (currentSpec.type === "shader") {
        groupRigInspector.style.display = "none";
        groupShaderInspector.style.display = "";
        groupLayersInspector.style.display = "none";
        syncShaderInspector();
      } else {
        groupRigInspector.style.display = "none";
        groupShaderInspector.style.display = "none";
        groupLayersInspector.style.display = "";
        renderLayersList();
      }
    } else {
      renderLayersList();
    }

    renderPaletteList();
  }

  // Interactive Skeletal Rig Bones Inspector
  function renderBonesList() {
    if (!bonesList) return;
    bonesList.innerHTML = "";
    const bones = Array.isArray(currentSpec.bones) ? currentSpec.bones : [];
    if (boneCountBadge) boneCountBadge.textContent = bones.length;

    const currentPose = (currentFrame > 0 && Array.isArray(currentSpec.poses) && currentSpec.poses[currentFrame - 1])
      ? currentSpec.poses[currentFrame - 1]
      : null;

    for (let i = 0; i < bones.length; i++) {
      const bone = bones[i];
      const item = document.createElement("div");
      item.className = "bone-item";

      const mainRow = document.createElement("div");
      mainRow.className = "layer-row-main";

      const info = document.createElement("div");
      info.className = "layer-info";

      const badge = document.createElement("span");
      badge.className = "bone-badge";
      badge.textContent = bone.parent ? `↳ ${bone.parent}` : "ROOT";

      const nameSpan = document.createElement("span");
      nameSpan.className = "layer-name";
      nameSpan.textContent = bone.id || `bone_${i + 1}`;

      info.appendChild(badge);
      info.appendChild(nameSpan);

      const metaSpan = document.createElement("span");
      metaSpan.style.fontFamily = "var(--font-mono)";
      metaSpan.style.fontSize = "10.5px";
      metaSpan.style.color = "var(--text-muted)";
      metaSpan.textContent = `L:${bone.length ?? 0} R:${bone.r1 ?? 0}`;

      mainRow.appendChild(info);
      mainRow.appendChild(metaSpan);
      item.appendChild(mainRow);

      // Controls row: Angle adjustment slider
      const ctrlRow = document.createElement("div");
      ctrlRow.style.display = "flex";
      ctrlRow.style.alignItems = "center";
      ctrlRow.style.gap = "6px";
      ctrlRow.style.marginTop = "2px";

      const angleLabel = document.createElement("span");
      angleLabel.style.fontSize = "10.5px";
      angleLabel.style.color = "var(--text-muted)";
      angleLabel.style.minWidth = "40px";
      angleLabel.textContent = currentPose ? "dAngle:" : "Angle:";

      const angleSlider = document.createElement("input");
      angleSlider.type = "range";
      angleSlider.style.flex = "1";
      angleSlider.style.accentColor = "var(--accent)";

      const angleVal = document.createElement("span");
      angleVal.style.fontFamily = "var(--font-mono)";
      angleVal.style.fontSize = "10.5px";
      angleVal.style.minWidth = "32px";
      angleVal.style.textAlign = "right";

      if (currentPose) {
        angleSlider.min = "-90";
        angleSlider.max = "90";
        const curD = (currentPose[bone.id] && typeof currentPose[bone.id].dAngle === "number")
          ? currentPose[bone.id].dAngle
          : 0;
        angleSlider.value = String(curD);
        angleVal.textContent = `${curD > 0 ? "+" : ""}${curD}°`;
      } else {
        angleSlider.min = "-180";
        angleSlider.max = "180";
        const curA = typeof bone.angle === "number" ? bone.angle : 0;
        angleSlider.value = String(curA);
        angleVal.textContent = `${curA}°`;
      }

      angleSlider.addEventListener("input", () => {
        const val = parseInt(angleSlider.value, 10);
        if (currentPose) {
          angleVal.textContent = `${val > 0 ? "+" : ""}${val}°`;
          if (!currentSpec.poses) currentSpec.poses = [];
          if (!currentSpec.poses[currentFrame - 1]) currentSpec.poses[currentFrame - 1] = {};
          if (!currentSpec.poses[currentFrame - 1][bone.id]) currentSpec.poses[currentFrame - 1][bone.id] = {};
          currentSpec.poses[currentFrame - 1][bone.id].dAngle = val;
        } else {
          angleVal.textContent = `${val}°`;
          bone.angle = val;
        }
        syncEditorFromSpec();
        renderAll();
      });

      ctrlRow.appendChild(angleLabel);
      ctrlRow.appendChild(angleSlider);
      ctrlRow.appendChild(angleVal);
      item.appendChild(ctrlRow);

      bonesList.appendChild(item);
    }

    if (bones.length === 0) {
      bonesList.innerHTML = `<div style="color: var(--text-muted); font-size: 11.5px; text-align: center; padding: 8px;">No bones defined in rig spec.</div>`;
    }
  }

  // Sync Shader Inspector controls
  function syncShaderInspector() {
    if (!groupShaderInspector) return;
    if (selShaderType) selShaderType.value = currentSpec.shaderType || "custom";
    if (selShaderDither) selShaderDither.value = currentSpec.dither || "bayer4x4";
    const dStr = typeof currentSpec.ditherStrength === "number" ? currentSpec.ditherStrength : 0.16;
    if (inputShaderDitherStrength) inputShaderDitherStrength.value = Math.round(dStr * 100);
    if (lblShaderDitherStrength) lblShaderDitherStrength.textContent = dStr.toFixed(2);
    if (selShaderFrames) selShaderFrames.value = String(currentSpec.framesCount || 8);
  }

  if (btnAddBone) {
    btnAddBone.addEventListener("click", () => {
      pushUndoState();
      if (!Array.isArray(currentSpec.bones)) currentSpec.bones = [];
      const idx = currentSpec.bones.length + 1;
      const lastBone = currentSpec.bones[currentSpec.bones.length - 1];
      const newBone = {
        id: `bone_${idx}`,
        parent: lastBone ? lastBone.id : null,
        length: 6,
        r1: 3,
        r2: 2.5,
        angle: 0,
        fill: activeSymbol !== "." ? activeSymbol : "S",
        outline: "O",
        z: 2,
        crease: true
      };
      if (!lastBone) {
        newBone.origin = [
          Math.floor(PixelDSLRenderer.clampSize(currentSpec.width, 32) / 2),
          Math.floor(PixelDSLRenderer.clampSize(currentSpec.height, 32) / 2)
        ];
      }
      currentSpec.bones.push(newBone);
      syncEditorFromSpec();
      renderBonesList();
      renderAll();
    });
  }

  if (btnToggleBonesDebug) {
    btnToggleBonesDebug.addEventListener("click", () => {
      showSkeletonDebug = !showSkeletonDebug;
      btnToggleBonesDebug.classList.toggle("active", showSkeletonDebug);
      renderAll();
    });
  }

  if (selShaderType) {
    selShaderType.addEventListener("change", () => {
      pushUndoState();
      currentSpec.shaderType = selShaderType.value;
      syncEditorFromSpec();
      renderAll();
    });
  }

  if (selShaderDither) {
    selShaderDither.addEventListener("change", () => {
      pushUndoState();
      currentSpec.dither = selShaderDither.value;
      syncEditorFromSpec();
      renderAll();
    });
  }

  if (inputShaderDitherStrength && lblShaderDitherStrength) {
    inputShaderDitherStrength.addEventListener("input", () => {
      const str = (parseInt(inputShaderDitherStrength.value, 10) || 16) / 100;
      lblShaderDitherStrength.textContent = str.toFixed(2);
      currentSpec.ditherStrength = str;
      syncEditorFromSpec();
      renderAll();
    });
  }

  if (selShaderFrames) {
    selShaderFrames.addEventListener("change", () => {
      pushUndoState();
      currentSpec.framesCount = parseInt(selShaderFrames.value, 10) || 8;
      syncEditorFromSpec();
      renderTimelineStrip();
      renderAll();
    });
  }

  if (btnRecompileShader) {
    btnRecompileShader.addEventListener("click", () => {
      renderAll();
    });
  }

  // Interactive Layers Viewer & Stack Inspector
  function renderLayersList() {
    layersList.innerHTML = "";
    const layers = Array.isArray(currentSpec.layers) ? currentSpec.layers : [];
    const hasGrid = Array.isArray(currentSpec.grid) && currentSpec.grid.length > 0;
    layerCountBadge.textContent = layers.length + (hasGrid ? 1 : 0);

    // Top layer: Symbolic Grid (if present)
    if (hasGrid) {
      const gridItem = document.createElement("div");
      gridItem.className = "layer-item" + (currentSpec.hideGrid ? " is-hidden" : "");

      const mainRow = document.createElement("div");
      mainRow.className = "layer-row-main";

      const info = document.createElement("div");
      info.className = "layer-info";
      info.innerHTML = `<span class="layer-op-badge">GRID</span><span class="layer-name">Symbolic Pixel Matrix (${currentSpec.grid.length} rows)</span>`;

      const actions = document.createElement("div");
      actions.className = "layer-actions";

      const btnVis = document.createElement("button");
      btnVis.className = "btn btn-sm";
      btnVis.textContent = currentSpec.hideGrid ? "🚫" : "👁";
      btnVis.title = "Toggle Symbolic Grid visibility";
      btnVis.addEventListener("click", (e) => {
        e.stopPropagation();
        pushUndoState();
        currentSpec.hideGrid = !currentSpec.hideGrid;
        syncEditorFromSpec();
        renderLayersList();
        renderAll();
      });

      actions.appendChild(btnVis);
      mainRow.appendChild(info);
      mainRow.appendChild(actions);
      gridItem.appendChild(mainRow);
      layersList.appendChild(gridItem);
    }

    const sdfShapeOps = [
      "ellipse", "rect", "polygon", "capsule", "uneven_capsule",
      "vesica", "moon", "bezier_sdf", "star", "ngon"
    ];

    // Procedural layers
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      const item = document.createElement("div");
      item.className = "layer-item" +
        (i === selectedLayerIndex ? " selected" : "") +
        (layer.hidden ? " is-hidden" : "");

      const mainRow = document.createElement("div");
      mainRow.className = "layer-row-main";

      const info = document.createElement("div");
      info.className = "layer-info";

      const opBadge = document.createElement("span");
      opBadge.className = "layer-op-badge";
      opBadge.textContent = layer.op || "layer";

      const nameSpan = document.createElement("span");
      nameSpan.className = "layer-name";
      nameSpan.textContent = layer.id || `${layer.op}_${i + 1}`;

      info.appendChild(opBadge);
      info.appendChild(nameSpan);

      const actions = document.createElement("div");
      actions.className = "layer-actions";

      const btnVis = document.createElement("button");
      btnVis.className = "btn btn-sm";
      btnVis.textContent = layer.hidden ? "🚫" : "👁";
      btnVis.title = "Show / Hide layer";
      btnVis.addEventListener("click", (e) => {
        e.stopPropagation();
        pushUndoState();
        layer.hidden = !layer.hidden;
        syncEditorFromSpec();
        renderLayersList();
        renderAll();
      });

      const btnUp = document.createElement("button");
      btnUp.className = "btn btn-sm";
      btnUp.textContent = "↑";
      btnUp.disabled = i === layers.length - 1;
      btnUp.title = "Move layer up (front)";
      btnUp.addEventListener("click", (e) => {
        e.stopPropagation();
        if (i >= layers.length - 1) return;
        pushUndoState();
        const tmp = layers[i + 1];
        layers[i + 1] = layers[i];
        layers[i] = tmp;
        if (selectedLayerIndex === i) selectedLayerIndex = i + 1;
        syncEditorFromSpec();
        renderLayersList();
        renderAll();
      });

      const btnDown = document.createElement("button");
      btnDown.className = "btn btn-sm";
      btnDown.textContent = "↓";
      btnDown.disabled = i === 0;
      btnDown.title = "Move layer down (back)";
      btnDown.addEventListener("click", (e) => {
        e.stopPropagation();
        if (i <= 0) return;
        pushUndoState();
        const tmp = layers[i - 1];
        layers[i - 1] = layers[i];
        layers[i] = tmp;
        if (selectedLayerIndex === i) selectedLayerIndex = i - 1;
        syncEditorFromSpec();
        renderLayersList();
        renderAll();
      });

      const btnDel = document.createElement("button");
      btnDel.className = "btn btn-sm";
      btnDel.textContent = "×";
      btnDel.title = "Delete layer";
      btnDel.addEventListener("click", (e) => {
        e.stopPropagation();
        pushUndoState();
        layers.splice(i, 1);
        if (selectedLayerIndex === i) selectedLayerIndex = -1;
        syncEditorFromSpec();
        renderLayersList();
        renderAll();
      });

      actions.appendChild(btnVis);
      actions.appendChild(btnUp);
      actions.appendChild(btnDown);
      actions.appendChild(btnDel);

      mainRow.appendChild(info);
      mainRow.appendChild(actions);
      mainRow.addEventListener("click", () => {
        selectedLayerIndex = selectedLayerIndex === i ? -1 : i;
        renderLayersList();
      });

      item.appendChild(mainRow);

      // Inline property editor when selected
      if (i === selectedLayerIndex) {
        const propsGrid = document.createElement("div");
        propsGrid.className = "layer-props-inline";

        if (currentFrame > 0 && layer.id) {
          if (!Array.isArray(currentSpec.frames)) currentSpec.frames = [];
          const fDef = currentSpec.frames[currentFrame - 1] || {};
          if (!fDef.layers) fDef.layers = {};
          const lMod = fDef.layers[layer.id] || {};

          const addDeltaField = (label, propKey) => {
            const wrap = document.createElement("div");
            wrap.className = "layer-prop-field";
            wrap.innerHTML = `<span>F${currentFrame + 1} ${label}</span>`;
            const inp = document.createElement("input");
            inp.type = "number";
            inp.value = lMod[propKey] ?? 0;
            inp.addEventListener("change", () => {
              pushUndoState();
              if (!currentSpec.frames[currentFrame - 1].layers) {
                currentSpec.frames[currentFrame - 1].layers = {};
              }
              if (!currentSpec.frames[currentFrame - 1].layers[layer.id]) {
                currentSpec.frames[currentFrame - 1].layers[layer.id] = {};
              }
              currentSpec.frames[currentFrame - 1].layers[layer.id][propKey] = Number(inp.value);
              syncEditorFromSpec();
              renderAll();
            });
            wrap.appendChild(inp);
            propsGrid.appendChild(wrap);
          };

          addDeltaField("dx", "dx");
          addDeltaField("dy", "dy");
          addDeltaField("dAngle°", "dAngle");
        } else {
          // Base frame properties (including v3.0 Quilez SDF parameters)
          const numericKeys = ["cx", "cy", "rx", "ry", "r", "r1", "r2", "d", "n", "innerRatio", "x", "y", "w", "h", "angle", "x1", "y1", "x2", "y2"];
          for (const k of numericKeys) {
            if (typeof layer[k] === "number") {
              const wrap = document.createElement("div");
              wrap.className = "layer-prop-field";
              wrap.innerHTML = `<span>${k}</span>`;
              const inp = document.createElement("input");
              inp.type = "number";
              inp.step = (k === "innerRatio" || k === "r1" || k === "r2") ? "0.1" : "1";
              inp.value = layer[k];
              inp.addEventListener("change", () => {
                pushUndoState();
                layer[k] = Number(inp.value);
                syncEditorFromSpec();
                renderAll();
              });
              wrap.appendChild(inp);
              propsGrid.appendChild(wrap);
            }
          }

          if (sdfShapeOps.includes(String(layer.op || "").toLowerCase())) {
            const blendWrap = document.createElement("div");
            blendWrap.className = "layer-prop-field";
            blendWrap.title = "SDF Metaball Smooth Blend radius (0 = off)";
            blendWrap.innerHTML = `<span>sBlend</span>`;
            const blendInp = document.createElement("input");
            blendInp.type = "number";
            blendInp.step = "0.5";
            blendInp.min = "0";
            blendInp.max = "12";
            blendInp.value = layer.smoothBlend ?? 0;
            blendInp.addEventListener("change", () => {
              pushUndoState();
              const val = Number(blendInp.value);
              if (val > 0) layer.smoothBlend = val;
              else delete layer.smoothBlend;
              syncEditorFromSpec();
              renderAll();
            });
            blendWrap.appendChild(blendInp);
            propsGrid.appendChild(blendWrap);

            // 2.5D Depth z-order
            const zWrap = document.createElement("div");
            zWrap.className = "layer-prop-field";
            zWrap.title = "2.5D Depth Z-Order (higher z overlaps lower z for anatomical creases)";
            zWrap.innerHTML = `<span>z-Depth</span>`;
            const zInp = document.createElement("input");
            zInp.type = "number";
            zInp.step = "1";
            zInp.value = layer.z ?? 1;
            zInp.addEventListener("change", () => {
              pushUndoState();
              layer.z = Number(zInp.value);
              syncEditorFromSpec();
              renderAll();
            });
            zWrap.appendChild(zInp);
            propsGrid.appendChild(zWrap);

            // CSG Boolean Mode selector
            const csgWrap = document.createElement("div");
            csgWrap.className = "layer-prop-field";
            csgWrap.title = "CSG Boolean combination mode with previous SDF shape";
            csgWrap.innerHTML = `<span>CSG Op</span>`;
            const csgSel = document.createElement("select");
            csgSel.style.padding = "2px 4px";
            csgSel.style.fontSize = "10.5px";
            for (const m of ["", "union", "smooth_union", "subtract", "smooth_subtract", "intersect"]) {
              const o = document.createElement("option");
              o.value = m;
              o.textContent = m || "auto";
              csgSel.appendChild(o);
            }
            csgSel.value = layer.opMode || "";
            csgSel.addEventListener("change", () => {
              pushUndoState();
              if (csgSel.value) layer.opMode = csgSel.value;
              else delete layer.opMode;
              syncEditorFromSpec();
              renderAll();
            });
            csgWrap.appendChild(csgSel);
            propsGrid.appendChild(csgWrap);

            // Surface Micro-Shader selector
            const shWrap = document.createElement("div");
            shWrap.className = "layer-prop-field";
            shWrap.title = "Procedural Surface Micro-Shader / Dither Pattern";
            shWrap.innerHTML = `<span>Shader</span>`;
            const shSel = document.createElement("select");
            shSel.style.padding = "2px 4px";
            shSel.style.fontSize = "10.5px";
            for (const s of ["none", "worley", "voronoi", "turing", "scales", "bayer4x4", "blue_noise", "checker", "sparse", "grid"]) {
              const o = document.createElement("option");
              o.value = s;
              o.textContent = s;
              shSel.appendChild(o);
            }
            shSel.value = layer.dither || layer.shader || "none";
            shSel.addEventListener("change", () => {
              pushUndoState();
              if (shSel.value && shSel.value !== "none") layer.dither = shSel.value;
              else {
                delete layer.dither;
                delete layer.shader;
              }
              syncEditorFromSpec();
              renderAll();
            });
            shWrap.appendChild(shSel);
            propsGrid.appendChild(shWrap);

            const sdfWrap = document.createElement("div");
            sdfWrap.className = "layer-prop-field";
            sdfWrap.title = "Enable 3D SDF Heightmap Normal Shading + Bayer 2×2 Dithering on this layer";
            sdfWrap.innerHTML = `<span>3D SDF</span>`;
            const sdfChk = document.createElement("input");
            sdfChk.type = "checkbox";
            sdfChk.checked = Boolean(layer.sdf);
            sdfChk.style.width = "16px";
            sdfChk.style.height = "16px";
            sdfChk.style.margin = "2px auto";
            sdfChk.addEventListener("change", () => {
              pushUndoState();
              if (sdfChk.checked) layer.sdf = true;
              else delete layer.sdf;
              syncEditorFromSpec();
              renderAll();
            });
            sdfWrap.appendChild(sdfChk);
            propsGrid.appendChild(sdfWrap);

            const creaseWrap = document.createElement("div");
            creaseWrap.className = "layer-prop-field";
            creaseWrap.title = "Draw 1px internal anatomical crease where this layer (higher z) overlaps lower-z same-fill layers";
            creaseWrap.innerHTML = `<span>Crease</span>`;
            const creaseChk = document.createElement("input");
            creaseChk.type = "checkbox";
            creaseChk.checked = Boolean(layer.crease);
            creaseChk.style.width = "16px";
            creaseChk.style.height = "16px";
            creaseChk.style.margin = "2px auto";
            creaseChk.addEventListener("change", () => {
              pushUndoState();
              if (creaseChk.checked) layer.crease = true;
              else delete layer.crease;
              syncEditorFromSpec();
              renderAll();
            });
            creaseWrap.appendChild(creaseChk);
            propsGrid.appendChild(creaseWrap);
          }
        }
        item.appendChild(propsGrid);
      }

      layersList.appendChild(item);
    }

    if (layers.length === 0 && !hasGrid) {
      layersList.innerHTML = `<div style="color: var(--text-muted); font-size: 11.5px; text-align: center; padding: 8px;">No layers yet. Draw on canvas or click + Ellipse / + Rect / + SDF Shape.</div>`;
    }
  }

  btnAddEllipseLayer.addEventListener("click", () => {
    pushUndoState();
    if (!Array.isArray(currentSpec.layers)) currentSpec.layers = [];
    const w = PixelDSLRenderer.clampSize(currentSpec.width, 32);
    const h = PixelDSLRenderer.clampSize(currentSpec.height, 32);
    const idx = currentSpec.layers.length + 1;
    currentSpec.layers.push({
      id: `ellipse_${idx}`,
      op: "ellipse",
      cx: Number(((w - 1) * 0.5).toFixed(1)),
      cy: Number(((h - 1) * 0.5).toFixed(1)),
      rx: Math.max(3, Math.floor(w / 5)),
      ry: Math.max(3, Math.floor(h / 5)),
      angle: 0,
      fill: activeSymbol !== "." ? activeSymbol : "S",
      outline: "O",
      sdf: true,
      mirror: "none"
    });
    selectedLayerIndex = currentSpec.layers.length - 1;
    syncEditorFromSpec();
    renderLayersList();
    renderAll();
  });

  btnAddRectLayer.addEventListener("click", () => {
    pushUndoState();
    if (!Array.isArray(currentSpec.layers)) currentSpec.layers = [];
    const w = PixelDSLRenderer.clampSize(currentSpec.width, 32);
    const h = PixelDSLRenderer.clampSize(currentSpec.height, 32);
    const idx = currentSpec.layers.length + 1;
    const rw = Math.max(4, Math.floor(w / 3));
    const rh = Math.max(4, Math.floor(h / 3));
    currentSpec.layers.push({
      id: `rect_${idx}`,
      op: "rect",
      x: Math.floor((w - rw) / 2),
      y: Math.floor((h - rh) / 2),
      w: rw,
      h: rh,
      rx: 1,
      fill: activeSymbol !== "." ? activeSymbol : "S",
      outline: "O",
      sdf: true,
      mirror: "none"
    });
    selectedLayerIndex = currentSpec.layers.length - 1;
    syncEditorFromSpec();
    renderLayersList();
    renderAll();
  });

  if (selAddAdvancedLayer) {
    selAddAdvancedLayer.addEventListener("change", () => {
      const opType = selAddAdvancedLayer.value;
      selAddAdvancedLayer.value = "";
      if (!opType) return;
      pushUndoState();
      if (!Array.isArray(currentSpec.layers)) currentSpec.layers = [];
      const w = PixelDSLRenderer.clampSize(currentSpec.width, 32);
      const h = PixelDSLRenderer.clampSize(currentSpec.height, 32);
      const cx = Number(((w - 1) * 0.5).toFixed(1));
      const cy = Number(((h - 1) * 0.5).toFixed(1));
      const idx = currentSpec.layers.length + 1;
      const fillSym = activeSymbol !== "." ? activeSymbol : "S";

      let newLyr = { id: `${opType}_${idx}`, op: opType, fill: fillSym, outline: "O", sdf: true, mirror: "none" };
      if (opType === "vesica") {
        Object.assign(newLyr, { cx, cy, rx: Math.max(3, Math.floor(w / 7)), ry: Math.max(6, Math.floor(h / 3.2)), angle: 0 });
      } else if (opType === "uneven_capsule") {
        Object.assign(newLyr, { x1: cx, y1: Math.floor(h * 0.72), x2: cx, y2: Math.floor(h * 0.25), r1: 4.0, r2: 2.0 });
      } else if (opType === "moon") {
        Object.assign(newLyr, { cx, cy, r: Math.max(5, Math.floor(w / 4)), r2: Math.max(4, Math.floor(w / 5)), d: 3.5, angle: 0 });
      } else if (opType === "star") {
        Object.assign(newLyr, { cx, cy, r: Math.max(5, Math.floor(w / 3.5)), n: 5, innerRatio: 0.48, angle: 0 });
      } else if (opType === "ngon") {
        Object.assign(newLyr, { cx, cy, r: Math.max(5, Math.floor(w / 3.5)), n: 6, angle: 0 });
      } else if (opType === "bezier_sdf") {
        Object.assign(newLyr, { points: [[cx - 6, cy + 5], [cx, cy - 6], [cx + 6, cy + 5]], r1: 2.2, r2: 1.2 });
      }

      currentSpec.layers.push(newLyr);
      selectedLayerIndex = currentSpec.layers.length - 1;
      syncEditorFromSpec();
      renderLayersList();
      renderAll();
    });
  }

  btnShowAllLayers.addEventListener("click", () => {
    pushUndoState();
    currentSpec.hideGrid = false;
    if (Array.isArray(currentSpec.layers)) {
      currentSpec.layers.forEach((l) => { delete l.hidden; });
    }
    syncEditorFromSpec();
    renderLayersList();
    renderAll();
  });

  // Visual Frame Timeline Strip
  function renderTimelineStrip() {
    timelineFrames.innerHTML = "";
    const totalFrames = PixelDSLRenderer.getFrameCount(currentSpec);
    const w = PixelDSLRenderer.clampSize(currentSpec.width, 32);
    const h = PixelDSLRenderer.clampSize(currentSpec.height, 32);

    for (let f = 0; f < totalFrames; f++) {
      const card = document.createElement("div");
      card.className = "frame-card" + (f === currentFrame ? " active" : "");
      card.title = `Switch to Frame ${f + 1}`;

      const thumb = document.createElement("canvas");
      thumb.className = "frame-thumb";
      thumb.width = w;
      thumb.height = h;

      const fRes = PixelDSLRenderer.render(currentSpec, f);
      thumb.getContext("2d").putImageData(new ImageData(new Uint8ClampedArray(fRes.buffer), w, h), 0, 0);

      const lbl = document.createElement("span");
      lbl.className = "frame-label";
      lbl.textContent = `#${f + 1}`;

      card.appendChild(thumb);
      card.appendChild(lbl);

      card.addEventListener("click", () => {
        stopAnim();
        currentFrame = f;
        syncInspectorFromSpec();
        renderAll();
      });

      timelineFrames.appendChild(card);
    }

    btnDeleteFrame.disabled = totalFrames <= 1 || currentFrame === 0;
  }

  btnAddFrame.addEventListener("click", () => {
    pushUndoState();
    if (!Array.isArray(currentSpec.frames)) currentSpec.frames = [];
    // Duplicate current frame overrides if on an extra frame, or create an empty frame delta object
    let newFrameObj = { layers: {} };
    if (currentFrame > 0 && currentSpec.frames[currentFrame - 1]) {
      newFrameObj = JSON.parse(JSON.stringify(currentSpec.frames[currentFrame - 1]));
    }
    currentSpec.frames.push(newFrameObj);
    currentFrame = currentSpec.frames.length;
    syncEditorFromSpec();
    renderLayersList();
    renderAll();
  });

  btnDeleteFrame.addEventListener("click", () => {
    if (currentFrame <= 0 || !Array.isArray(currentSpec.frames) || currentSpec.frames.length === 0) return;
    pushUndoState();
    currentSpec.frames.splice(currentFrame - 1, 1);
    currentFrame = Math.max(0, currentFrame - 1);
    syncEditorFromSpec();
    renderLayersList();
    renderAll();
  });

  chkOnionSkin.addEventListener("change", () => {
    showOnionSkin = chkOnionSkin.checked;
    renderAll();
  });

  function renderPaletteList() {
    paletteList.innerHTML = "";
    const resolved = PixelDSLRenderer.resolveFullPalette(currentSpec);
    if (!currentSpec.palette) currentSpec.palette = { ".": "transparent" };

    for (const [sym, colorStr] of Object.entries(resolved)) {
      const row = document.createElement("div");
      row.className = "palette-item" + (sym === activeSymbol ? " selected" : "");

      const badge = document.createElement("div");
      badge.className = "sym-badge";
      badge.textContent = sym === " " ? "␣" : sym;
      badge.title = `Select symbol '${sym}' for Pencil / Bucket`;

      const rgba = PixelDSLRenderer.parseColor(colorStr);
      const hex6 = `#${rgba[0].toString(16).padStart(2, "0")}${rgba[1].toString(16).padStart(2, "0")}${rgba[2].toString(16).padStart(2, "0")}`;

      const swatch = document.createElement("input");
      swatch.type = "color";
      swatch.className = "color-swatch-input";
      swatch.value = hex6;
      swatch.disabled = sym === ".";

      const hexInput = document.createElement("input");
      hexInput.type = "text";
      hexInput.className = "hex-input";
      hexInput.value = colorStr;
      hexInput.disabled = sym === ".";

      const alphaInput = document.createElement("input");
      alphaInput.type = "range";
      alphaInput.min = "0";
      alphaInput.max = "255";
      alphaInput.value = sym === "." ? 0 : rgba[3];
      alphaInput.className = "alpha-input";
      alphaInput.title = `Alpha Opacity: ${rgba[3]}/255`;
      alphaInput.disabled = sym === ".";

      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-sm";
      delBtn.textContent = "×";
      delBtn.style.padding = "2px 6px";
      delBtn.disabled = sym === ".";
      delBtn.title = "Delete symbol";

      row.addEventListener("click", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
        activeSymbol = sym;
        if (sym === ".") {
          setTool("eraser");
        } else if (activeTool === "eraser") {
          setTool("brush");
        }
        renderPaletteList();
      });

      swatch.addEventListener("change", () => pushUndoState());
      swatch.addEventListener("input", () => {
        const curRgba = PixelDSLRenderer.parseColor(resolved[sym]);
        const newRgba = PixelDSLRenderer.parseColor(swatch.value);
        const updated = PixelDSLRenderer.rgbaToHex(newRgba[0], newRgba[1], newRgba[2], curRgba[3] || 255);
        currentSpec.palette[sym] = updated;
        hexInput.value = updated;
        syncEditorFromSpec();
        renderAll();
      });

      hexInput.addEventListener("change", () => {
        pushUndoState();
        currentSpec.palette[sym] = hexInput.value.trim();
        syncEditorFromSpec();
        renderPaletteList();
        renderAll();
      });

      alphaInput.addEventListener("change", () => pushUndoState());
      alphaInput.addEventListener("input", () => {
        const curRgba = PixelDSLRenderer.parseColor(resolved[sym]);
        const a = parseInt(alphaInput.value, 10);
        const updated = PixelDSLRenderer.rgbaToHex(curRgba[0], curRgba[1], curRgba[2], a);
        currentSpec.palette[sym] = updated;
        hexInput.value = updated;
        alphaInput.title = `Alpha Opacity: ${a}/255`;
        syncEditorFromSpec();
        renderAll();
      });

      delBtn.addEventListener("click", () => {
        if (sym === ".") return;
        pushUndoState();
        delete currentSpec.palette[sym];
        syncEditorFromSpec();
        renderPaletteList();
        renderAll();
      });

      row.appendChild(badge);
      row.appendChild(swatch);
      row.appendChild(hexInput);
      row.appendChild(alphaInput);
      row.appendChild(delBtn);
      paletteList.appendChild(row);
    }
  }

  function renderAll() {
    const totalFrames = PixelDSLRenderer.getFrameCount(currentSpec);
    if (currentFrame >= totalFrames) currentFrame = 0;

    lastRender = PixelDSLRenderer.render(currentSpec, currentFrame);
    const { width, height, buffer, warnings, diagnostics } = lastRender;

    const layerCount = Array.isArray(currentSpec.layers) ? currentSpec.layers.length : 0;
    editorMeta.textContent = `${width}×${height} px | Layers: ${layerCount} | Frames: ${totalFrames}`;

    if (warnings.length === 0) {
      editorStatus.className = "status-ok";
      editorStatus.textContent = "✓ Valid DSL";
    } else {
      editorStatus.className = "status-warn";
      editorStatus.textContent = `⚠ Auto-padded (${warnings[0]})`;
    }

    if (diagnostics) {
      const clipText = diagnostics.clippedEdges.length > 0
        ? `⚠ Touch: ${diagnostics.clippedEdges.join(",")}`
        : "✓ Clean Edges";
      aiDiagnosticsBadge.textContent = `Fill: ${diagnostics.fillPct}% | ${clipText}`;
      aiDiagnosticsBadge.className = diagnostics.clippedEdges.length > 0 ? "status-warn" : "";
    }

    canvasDimInfo.textContent = `Canvas: ${width}×${height} px | Frame ${currentFrame + 1}/${totalFrames}`;

    const scale = computeEffectiveZoom(width, height);
    mainCanvas.width = width * scale;
    mainCanvas.height = height * scale;
    const ctx = mainCanvas.getContext("2d");
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    ctx.imageSmoothingEnabled = false;

    // Optional Onion Skin (previous frame ghost)
    if (showOnionSkin && totalFrames > 1) {
      const prevFrameIdx = (currentFrame - 1 + totalFrames) % totalFrames;
      const prevRender = PixelDSLRenderer.render(currentSpec, prevFrameIdx);
      const onionCanvas = document.createElement("canvas");
      onionCanvas.width = width;
      onionCanvas.height = height;
      onionCanvas.getContext("2d").putImageData(
        new ImageData(new Uint8ClampedArray(prevRender.buffer), width, height),
        0,
        0
      );
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.drawImage(onionCanvas, 0, 0, width * scale, height * scale);
      ctx.restore();
    }

    const offCanvas = document.createElement("canvas");
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext("2d");
    const activeBuf = (showNormalMap && lastRender.normalBuffer) ? lastRender.normalBuffer : buffer;
    const imgData = new ImageData(new Uint8ClampedArray(activeBuf), width, height);
    offCtx.putImageData(imgData, 0, 0);

    ctx.drawImage(offCanvas, 0, 0, width * scale, height * scale);

    if (showGridLines && scale >= 5) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.09)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 1; x < width; x++) {
        ctx.moveTo(x * scale + 0.5, 0);
        ctx.lineTo(x * scale + 0.5, height * scale);
      }
      for (let y = 1; y < height; y++) {
        ctx.moveTo(0, y * scale + 0.5);
        ctx.lineTo(width * scale, y * scale + 0.5);
      }
      ctx.stroke();
    }

    if (showCenterAxes) {
      ctx.strokeStyle = "rgba(59, 201, 219, 0.55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      const midX = Math.floor(width / 2) * scale + 0.5;
      const midY = Math.floor(height / 2) * scale + 0.5;
      ctx.moveTo(midX, 0);
      ctx.lineTo(midX, height * scale);
      ctx.moveTo(0, midY);
      ctx.lineTo(width * scale, midY);
      ctx.stroke();
    }

    if (showSkeletonDebug && currentSpec.type === "rig" && lastRender) {
      const fkMap = PixelDSLRenderer.solveFkRig(currentSpec, currentFrame);
      ctx.save();
      for (const [bId, bState] of Object.entries(fkMap)) {
        ctx.strokeStyle = "rgba(0, 240, 255, 0.85)";
        ctx.lineWidth = Math.max(1.5, Math.floor(scale / 4));
        ctx.beginPath();
        ctx.moveTo(bState.head[0] * scale + scale * 0.5, bState.head[1] * scale + scale * 0.5);
        ctx.lineTo(bState.tail[0] * scale + scale * 0.5, bState.tail[1] * scale + scale * 0.5);
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 230, 0, 0.95)";
        ctx.beginPath();
        ctx.arc(bState.head[0] * scale + scale * 0.5, bState.head[1] * scale + scale * 0.5, Math.max(2.5, scale * 0.35), 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255, 80, 80, 0.95)";
        ctx.beginPath();
        ctx.arc(bState.tail[0] * scale + scale * 0.5, bState.tail[1] * scale + scale * 0.5, Math.max(2.5, scale * 0.35), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (hoverCoord && hoverCoord.x >= 0 && hoverCoord.x < width && hoverCoord.y >= 0 && hoverCoord.y < height) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(
        hoverCoord.x * scale + 0.5,
        hoverCoord.y * scale + 0.5,
        scale - 1,
        scale - 1
      );
    }

    const p1Scale = width <= 16 ? 2 : 1;
    preview1x.width = width * p1Scale;
    preview1x.height = height * p1Scale;
    const p1Ctx = preview1x.getContext("2d");
    p1Ctx.imageSmoothingEnabled = false;
    p1Ctx.clearRect(0, 0, preview1x.width, preview1x.height);
    p1Ctx.drawImage(offCanvas, 0, 0, preview1x.width, preview1x.height);

    const tilePreviewSize = 96;
    previewTiled.width = tilePreviewSize;
    previewTiled.height = tilePreviewSize;
    const ptCtx = previewTiled.getContext("2d");
    ptCtx.imageSmoothingEnabled = false;
    ptCtx.clearRect(0, 0, tilePreviewSize, tilePreviewSize);
    const cellW = tilePreviewSize / 3;
    const cellH = tilePreviewSize / 3;
    for (let ty = 0; ty < 3; ty++) {
      for (let tx = 0; tx < 3; tx++) {
        ptCtx.drawImage(offCanvas, tx * cellW, ty * cellH, cellW, cellH);
      }
    }

    renderTimelineStrip();
  }

  // Animation Controls
  function stopAnim() {
    if (animTimer) {
      clearInterval(animTimer);
      animTimer = null;
    }
    btnPlayAnim.textContent = "▶ Play";
  }

  function startAnim() {
    stopAnim();
    const total = PixelDSLRenderer.getFrameCount(currentSpec);
    if (total <= 1) return;
    const fps = parseInt(selAnimFps.value, 10) || 6;
    btnPlayAnim.textContent = "⏸ Pause";
    animTimer = setInterval(() => {
      const count = PixelDSLRenderer.getFrameCount(currentSpec);
      currentFrame = (currentFrame + 1) % count;
      renderAll();
    }, Math.round(1000 / fps));
  }

  btnPlayAnim.addEventListener("click", () => {
    if (animTimer) stopAnim();
    else startAnim();
  });

  selAnimFps.addEventListener("change", () => {
    if (animTimer) startAnim();
  });

  // Code Editor input
  codeEditor.addEventListener("input", () => {
    const rawText = codeEditor.value;
    if (editorMode === "json") {
      try {
        const parsed = JSON.parse(rawText);
        pushUndoState();
        currentSpec = parsed;
        syncInspectorFromSpec();
        renderAll();
      } catch (err) {
        const lines = rawText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length >= 4 && !rawText.trim().startsWith("{")) {
          pushUndoState();
          currentSpec.height = PixelDSLRenderer.clampSize(lines.length, 32);
          currentSpec.width = PixelDSLRenderer.clampSize(lines[0].trim().length, 32);
          currentSpec.grid = lines.map((l) => l.trim());
          syncInspectorFromSpec();
          renderAll();
          return;
        }
        editorStatus.className = "status-err";
        editorStatus.textContent = `JSON Error: ${err.message}`;
      }
    } else {
      pushUndoState();
      const lines = rawText.replace(/\r/g, "").split("\n");
      currentSpec.grid = lines;
      renderAll();
    }
  });

  tabJson.addEventListener("click", () => {
    editorMode = "json";
    tabJson.classList.add("active");
    tabGrid.classList.remove("active");
    syncEditorFromSpec();
  });

  tabGrid.addEventListener("click", () => {
    editorMode = "grid";
    tabGrid.classList.add("active");
    tabJson.classList.remove("active");
    syncEditorFromSpec();
  });

  btnNormalizeGrid.addEventListener("click", () => {
    pushUndoState();
    const w = PixelDSLRenderer.clampSize(currentSpec.width, 32);
    const h = PixelDSLRenderer.clampSize(currentSpec.height, 32);
    const norm = PixelDSLRenderer.normalizeGrid(
      currentSpec.grid || [],
      w,
      h,
      Boolean(currentSpec.rle),
      currentSpec.symmetry || "none"
    );
    currentSpec.grid = norm.normalized;
    currentSpec.rle = false;
    syncEditorFromSpec();
    renderLayersList();
    renderAll();
  });

  btnBakeToGrid.addEventListener("click", () => {
    if (!lastRender) return;
    pushUndoState();
    const totalFrames = PixelDSLRenderer.getFrameCount(currentSpec);
    const mergedPalette = Object.assign(
      { ".": "transparent" },
      PixelDSLRenderer.resolveFullPalette(currentSpec),
      lastRender.resolvedPalette || {}
    );
    const bakedFrames = [];
    let baseGrid = [];
    for (let f = 0; f < totalFrames; f++) {
      const fRender = PixelDSLRenderer.render(currentSpec, f);
      if (fRender.resolvedPalette) {
        Object.assign(mergedPalette, fRender.resolvedPalette);
      }
      const rows = PixelDSLRenderer.bakeToGrid(fRender, mergedPalette);
      if (f === 0) {
        baseGrid = rows;
      } else {
        bakedFrames.push({ grid: rows });
      }
    }
    currentSpec.grid = baseGrid;
    currentSpec.frames = bakedFrames;
    delete currentSpec.motion;
    if (!currentSpec.palette) currentSpec.palette = { ".": "transparent" };
    const collectPaletteFromRows = (rows) => {
      for (const row of rows) {
        for (const ch of row) {
          if (ch !== "." && mergedPalette[ch]) {
            currentSpec.palette[ch] = mergedPalette[ch];
          }
        }
      }
    };
    collectPaletteFromRows(baseGrid);
    for (const bf of bakedFrames) {
      collectPaletteFromRows(bf.grid);
    }
    currentSpec.layers = [];
    currentSpec.rules = [];
    if (currentSpec.postProcess) {
      currentSpec.postProcess.autoOutline = false;
      currentSpec.postProcess.autoShading = false;
      currentSpec.postProcess.selOut = false;
    }
    selectedLayerIndex = -1;
    syncInspectorFromSpec();
    syncEditorFromSpec();
    renderAll();
  });

  // Canvas Tools
  function setTool(toolName) {
    activeTool = toolName;
    document.querySelectorAll("[data-tool]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tool === toolName);
    });
  }

  document.querySelectorAll("[data-tool]").forEach((btn) => {
    btn.addEventListener("click", () => setTool(btn.dataset.tool));
  });

  function ensureEditableGrid() {
    const w = PixelDSLRenderer.clampSize(currentSpec.width, 32);
    const h = PixelDSLRenderer.clampSize(currentSpec.height, 32);
    if (!Array.isArray(currentSpec.grid) || currentSpec.grid.length === 0) {
      currentSpec.grid = Array.from({ length: h }, () => ".".repeat(w));
    } else {
      const norm = PixelDSLRenderer.normalizeGrid(currentSpec.grid, w, h, Boolean(currentSpec.rle), "none");
      currentSpec.grid = norm.normalized;
      currentSpec.rle = false;
    }
  }

  function floodFillGrid(startX, startY, replacementSym) {
    ensureEditableGrid();
    const w = PixelDSLRenderer.clampSize(currentSpec.width, 32);
    const h = PixelDSLRenderer.clampSize(currentSpec.height, 32);
    const matrix = currentSpec.grid.map((r) => r.split(""));
    const targetSym = matrix[startY][startX];
    if (targetSym === replacementSym) return;

    const queue = [[startX, startY]];
    const visited = new Uint8Array(w * h);
    while (queue.length > 0) {
      const [x, y] = queue.pop();
      if (x < 0 || x >= w || y < 0 || y >= h) continue;
      if (visited[y * w + x]) continue;
      if (matrix[y][x] !== targetSym) continue;

      visited[y * w + x] = 1;
      matrix[y][x] = replacementSym;
      queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    currentSpec.grid = matrix.map((r) => r.join(""));
  }

  function applyToolAt(x, y) {
    if (!lastRender) return;
    const { width, height, symbolBuffer } = lastRender;
    if (x < 0 || x >= width || y < 0 || y >= height) return;

    if (activeTool === "picker") {
      const picked = symbolBuffer[y * width + x] || ".";
      activeSymbol = picked;
      renderPaletteList();
      setTool(picked === "." ? "eraser" : "brush");
      return;
    }

    if (activeTool === "bucket") {
      pushUndoState();
      const sym = activeSymbol === "." ? "." : activeSymbol;
      floodFillGrid(x, y, sym);
      syncEditorFromSpec();
      renderLayersList();
      renderAll();
      return;
    }

    if (!strokeSnapshotRecorded) {
      pushUndoState();
      strokeSnapshotRecorded = true;
    }

    ensureEditableGrid();
    const symToWrite = activeTool === "eraser" ? "." : activeSymbol;
    const rowChars = currentSpec.grid[y].split("");
    if (rowChars[x] === symToWrite) return;
    rowChars[x] = symToWrite;
    currentSpec.grid[y] = rowChars.join("");
    syncEditorFromSpec();
    renderLayersList();
    renderAll();
  }

  function getCanvasPixelCoords(evt) {
    if (!lastRender) return null;
    const rect = mainCanvas.getBoundingClientRect();
    const scaleX = lastRender.width / rect.width;
    const scaleY = lastRender.height / rect.height;
    const x = Math.floor((evt.clientX - rect.left) * scaleX);
    const y = Math.floor((evt.clientY - rect.top) * scaleY);
    return { x, y };
  }

  mainCanvas.addEventListener("pointerdown", (evt) => {
    isPointerDown = true;
    strokeSnapshotRecorded = false;
    const pt = getCanvasPixelCoords(evt);
    if (pt) applyToolAt(pt.x, pt.y);
  });

  window.addEventListener("pointerup", () => {
    isPointerDown = false;
    strokeSnapshotRecorded = false;
  });

  mainCanvas.addEventListener("pointermove", (evt) => {
    const pt = getCanvasPixelCoords(evt);
    if (!pt || !lastRender) return;
    hoverCoord = pt;

    const { width, height, buffer, symbolBuffer } = lastRender;
    if (pt.x >= 0 && pt.x < width && pt.y >= 0 && pt.y < height) {
      const idx = (pt.y * width + pt.x) * 4;
      const r = buffer[idx], g = buffer[idx + 1], b = buffer[idx + 2], a = buffer[idx + 3];
      const sym = symbolBuffer[pt.y * width + pt.x] || ".";
      const hex = PixelDSLRenderer.rgbaToHex(r, g, b, a);
      cursorInfo.textContent = `X: ${pt.x}, Y: ${pt.y} | Sym: '${sym}' | Color: ${hex} | Tool: ${activeTool.toUpperCase()}`;
      if (isPointerDown && (activeTool === "brush" || activeTool === "eraser")) {
        applyToolAt(pt.x, pt.y);
        return;
      }
    }
    renderAll();
  });

  mainCanvas.addEventListener("pointerleave", () => {
    hoverCoord = null;
    cursorInfo.textContent = "Hover over canvas to inspect pixels | Shortcuts: [D] Pencil, [E] Eraser, [S] Eyedropper, [G] Bucket, [Alt+Z] Undo";
    renderAll();
  });

  zoomSelect.addEventListener("change", () => {
    zoomLevel = zoomSelect.value;
    renderAll();
  });

  bgSelect.addEventListener("change", () => {
    canvasWrapper.className = `canvas-wrapper bg-${bgSelect.value}`;
  });

  chkGridLines.addEventListener("change", () => {
    showGridLines = chkGridLines.checked;
    renderAll();
  });

  chkCenterAxes.addEventListener("change", () => {
    showCenterAxes = chkCenterAxes.checked;
    renderAll();
  });

  if (chkNormalMap) {
    chkNormalMap.addEventListener("change", () => {
      showNormalMap = chkNormalMap.checked;
      renderAll();
    });
  }

  function setCanvasDimensions(w, h) {
    pushUndoState();
    const cw = PixelDSLRenderer.clampSize(w, 32);
    const ch = PixelDSLRenderer.clampSize(h, 32);
    currentSpec.width = cw;
    currentSpec.height = ch;
    if (Array.isArray(currentSpec.grid) && currentSpec.grid.length > 0) {
      const norm = PixelDSLRenderer.normalizeGrid(currentSpec.grid, cw, ch, Boolean(currentSpec.rle), "none");
      currentSpec.grid = norm.normalized;
    }
    syncInspectorFromSpec();
    syncEditorFromSpec();
    renderAll();
  }

  sizePillsContainer.querySelectorAll(".size-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      setCanvasDimensions(pill.dataset.w, pill.dataset.h);
    });
  });

  btnApplySize.addEventListener("click", () => {
    setCanvasDimensions(inputWidth.value, inputHeight.value);
  });

  selSymmetry.addEventListener("change", () => {
    pushUndoState();
    currentSpec.symmetry = selSymmetry.value;
    syncEditorFromSpec();
    renderAll();
  });

  function updatePostProcess() {
    pushUndoState();
    if (!currentSpec.postProcess) currentSpec.postProcess = {};
    currentSpec.postProcess.autoOutline = chkAutoOutline.checked;
    currentSpec.postProcess.outlineColor = inputOutlineColor.value;
    currentSpec.postProcess.autoShading = chkAutoShading.checked;
    currentSpec.postProcess.shadingStrength = Number(inputShadingStrength.value) / 100;
    if (chkSdfShading) currentSpec.postProcess.sdfShading = chkSdfShading.checked;
    if (chkSelOut) currentSpec.postProcess.selOut = chkSelOut.checked;
    syncEditorFromSpec();
    renderAll();
  }

  chkAutoOutline.addEventListener("change", updatePostProcess);
  inputOutlineColor.addEventListener("change", updatePostProcess);
  chkAutoShading.addEventListener("change", updatePostProcess);
  inputShadingStrength.addEventListener("change", updatePostProcess);
  if (chkSdfShading) chkSdfShading.addEventListener("change", updatePostProcess);
  if (chkSelOut) chkSelOut.addEventListener("change", updatePostProcess);

  selPalettePreset.addEventListener("change", () => {
    pushUndoState();
    const val = selPalettePreset.value;
    if (!val) {
      delete currentSpec.palettePreset;
    } else {
      currentSpec.palettePreset = val;
    }
    syncEditorFromSpec();
    renderPaletteList();
    renderAll();
  });

  btnAddSymbol.addEventListener("click", () => {
    const candidates = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#*$+~";
    const resolved = PixelDSLRenderer.resolveFullPalette(currentSpec);
    if (!currentSpec.palette) currentSpec.palette = { ".": "transparent" };
    let nextSym = null;
    for (const ch of candidates) {
      if (!resolved[ch]) {
        nextSym = ch;
        break;
      }
    }
    if (!nextSym) return;
    pushUndoState();
    currentSpec.palette[nextSym] = "#5c7cfa";
    activeSymbol = nextSym;
    syncEditorFromSpec();
    renderPaletteList();
  });

  btnAddRamp.addEventListener("click", () => {
    const resolved = PixelDSLRenderer.resolveFullPalette(currentSpec);
    const candidates = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const free = [];
    for (const ch of candidates) {
      if (!resolved[ch]) free.push(ch);
      if (free.length >= 3) break;
    }
    if (free.length < 3) return;
    pushUndoState();
    const [baseSym, lightSym, darkSym] = free;
    const baseHex = "#3e8948";
    const ramp = PixelDSLRenderer.generateColorRamp(baseHex);
    if (!currentSpec.ramps) currentSpec.ramps = {};
    currentSpec.ramps[baseSym] = {
      base: baseHex,
      light: lightSym,
      dark: darkSym,
      outline: "O"
    };
    if (!currentSpec.palette) currentSpec.palette = { ".": "transparent" };
    currentSpec.palette[baseSym] = ramp.base;
    currentSpec.palette[lightSym] = ramp.light;
    currentSpec.palette[darkSym] = ramp.dark;
    if (!currentSpec.palette["O"]) currentSpec.palette["O"] = ramp.outline;
    activeSymbol = baseSym;
    syncEditorFromSpec();
    renderPaletteList();
    renderAll();
  });

  // PNG Export (1:1, Normal Map, Upscaled, and Sprite Sheet)
  function downloadPNG(scaleFactor, useNormal = false) {
    if (!lastRender) return;
    const { width, height, buffer, normalBuffer } = lastRender;
    const srcBuf = (useNormal && normalBuffer) ? normalBuffer : buffer;
    const outW = width * scaleFactor;
    const outH = height * scaleFactor;

    const srcCanvas = document.createElement("canvas");
    srcCanvas.width = width;
    srcCanvas.height = height;
    srcCanvas.getContext("2d").putImageData(
      new ImageData(new Uint8ClampedArray(srcBuf), width, height),
      0,
      0
    );

    const outCanvas = document.createElement("canvas");
    outCanvas.width = outW;
    outCanvas.height = outH;
    const outCtx = outCanvas.getContext("2d");
    outCtx.imageSmoothingEnabled = false;
    outCtx.drawImage(srcCanvas, 0, 0, outW, outH);

    const link = document.createElement("a");
    const baseName = (currentSpec.name || "sprite").replace(/[^a-zA-Z0-9_-]/g, "_");
    const suffix = useNormal ? "_normal" : "";
    link.download = `${baseName}${suffix}_${outW}x${outH}.png`;
    link.href = outCanvas.toDataURL("image/png");
    link.click();
  }

  function downloadSpriteSheet() {
    const totalFrames = PixelDSLRenderer.getFrameCount(currentSpec);
    const w = PixelDSLRenderer.clampSize(currentSpec.width, 32);
    const h = PixelDSLRenderer.clampSize(currentSpec.height, 32);

    const sheetCanvas = document.createElement("canvas");
    sheetCanvas.width = w * totalFrames;
    sheetCanvas.height = h;
    const sheetCtx = sheetCanvas.getContext("2d");

    for (let f = 0; f < totalFrames; f++) {
      const res = PixelDSLRenderer.render(currentSpec, f);
      const imgData = new ImageData(new Uint8ClampedArray(res.buffer), w, h);
      sheetCtx.putImageData(imgData, f * w, 0);
    }

    const link = document.createElement("a");
    const baseName = (currentSpec.name || "sprite").replace(/[^a-zA-Z0-9_-]/g, "_");
    link.download = `${baseName}_sheet_${w * totalFrames}x${h}.png`;
    link.href = sheetCanvas.toDataURL("image/png");
    link.click();
  }

  btnExport1x.addEventListener("click", () => downloadPNG(1, false));
  if (btnExportNormal) {
    btnExportNormal.addEventListener("click", () => downloadPNG(1, true));
  }
  btnExportSheet.addEventListener("click", downloadSpriteSheet);
  btnExportUpscaled.addEventListener("click", () => {
    const w = lastRender ? lastRender.width : 32;
    const factor = w <= 16 ? 16 : w <= 32 ? 8 : w <= 64 ? 4 : 2;
    downloadPNG(factor, false);
  });

  // 3x3 Evolutionary Mutator & Seeded Archetype Generator Modal
  function populateMutateGrid3x3(mode) {
    if (!mutateGrid3x3) return;
    mutateGrid3x3.innerHTML = "";
    const baseSeed = parseInt(inputGenSeed ? inputGenSeed.value : "42", 10) || 42;
    const arch = selGenArchetype ? selGenArchetype.value : "sword";
    const rate = inputMutateRate ? (parseInt(inputMutateRate.value, 10) || 18) / 100 : 0.18;
    const curW = PixelDSLRenderer.clampSize(currentSpec.width, 32);
    const curH = PixelDSLRenderer.clampSize(currentSpec.height, 32);

    for (let i = 0; i < 9; i++) {
      const seed = baseSeed + i * 17;
      let candidateSpec;
      let labelText;
      if (mode === "archetype") {
        candidateSpec = PixelDSLRenderer.generateArchetype(arch, seed, curW, curH);
        labelText = `${arch} #${seed}`;
      } else {
        candidateSpec = i === 0
          ? JSON.parse(JSON.stringify(currentSpec))
          : PixelDSLRenderer.mutateSpec(currentSpec, seed, rate);
        labelText = i === 0 ? "Current (Parent)" : `Mutant #${seed}`;
      }

      const rendered = PixelDSLRenderer.render(candidateSpec, 0);
      const card = document.createElement("div");
      card.className = "mutate-card";

      const cvs = document.createElement("canvas");
      const scale = rendered.width <= 32 ? 3 : 2;
      cvs.width = rendered.width * scale;
      cvs.height = rendered.height * scale;
      const tmp = document.createElement("canvas");
      tmp.width = rendered.width;
      tmp.height = rendered.height;
      tmp.getContext("2d").putImageData(
        new ImageData(new Uint8ClampedArray(rendered.buffer), rendered.width, rendered.height),
        0,
        0
      );
      const cctx = cvs.getContext("2d");
      cctx.imageSmoothingEnabled = false;
      cctx.drawImage(tmp, 0, 0, cvs.width, cvs.height);

      const lbl = document.createElement("span");
      lbl.className = "mutate-card-label";
      lbl.textContent = labelText;

      card.appendChild(cvs);
      card.appendChild(lbl);

      card.addEventListener("click", () => {
        pushUndoState();
        currentSpec = JSON.parse(JSON.stringify(candidateSpec));
        currentFrame = 0;
        selectedLayerIndex = -1;
        if (inputGenSeed) inputGenSeed.value = String(seed + 1);
        pickDefaultActiveSymbol();
        syncEditorFromSpec();
        syncInspectorFromSpec();
        renderAll();
        populateMutateGrid3x3("mutate");
      });

      mutateGrid3x3.appendChild(card);
    }
  }

  if (btnOpenMutateModal && modalMutate) {
    btnOpenMutateModal.addEventListener("click", () => {
      populateMutateGrid3x3("mutate");
      modalMutate.classList.add("open");
    });
  }
  if (btnCloseMutateModal && modalMutate) {
    btnCloseMutateModal.addEventListener("click", () => modalMutate.classList.remove("open"));
  }
  if (btnCloseMutateFooter && modalMutate) {
    btnCloseMutateFooter.addEventListener("click", () => modalMutate.classList.remove("open"));
  }
  if (modalMutate) {
    modalMutate.addEventListener("click", (e) => {
      if (e.target === modalMutate) modalMutate.classList.remove("open");
    });
  }
  if (inputMutateRate && lblMutateRate) {
    inputMutateRate.addEventListener("input", () => {
      lblMutateRate.textContent = `${inputMutateRate.value}%`;
    });
  }
  if (btnGenerate3x3Arch) {
    btnGenerate3x3Arch.addEventListener("click", () => populateMutateGrid3x3("archetype"));
  }
  if (btnEvolve3x3Current) {
    btnEvolve3x3Current.addEventListener("click", () => {
      if (inputGenSeed) inputGenSeed.value = String((parseInt(inputGenSeed.value, 10) || 42) + 9);
      populateMutateGrid3x3("mutate");
    });
  }

  // Prompt Modal
  function refreshPromptModalText() {
    const [w, h] = promptSizeSelect.value.split("x").map((n) => parseInt(n, 10));
    promptOutput.value = window.SKILL_PROMPT_TEMPLATE(
      promptUserRequest.value.trim() || "32x32 pixel art turtle sprite, top-down view",
      w,
      h,
      promptModeSelect.value
    );
  }

  btnOpenPromptModal.addEventListener("click", () => {
    const w = PixelDSLRenderer.clampSize(currentSpec.width, 32);
    const sizeKey = `${w}x${w}`;
    if ([...promptSizeSelect.options].some((o) => o.value === sizeKey)) {
      promptSizeSelect.value = sizeKey;
    }
    refreshPromptModalText();
    modalPrompt.classList.add("open");
  });

  btnClosePromptModal.addEventListener("click", () => {
    modalPrompt.classList.remove("open");
  });

  modalPrompt.addEventListener("click", (e) => {
    if (e.target === modalPrompt) modalPrompt.classList.remove("open");
  });

  promptUserRequest.addEventListener("input", refreshPromptModalText);
  promptSizeSelect.addEventListener("change", refreshPromptModalText);
  promptModeSelect.addEventListener("change", refreshPromptModalText);

  btnCopyPrompt.addEventListener("click", () => {
    navigator.clipboard.writeText(promptOutput.value);
    const orig = btnCopyPrompt.textContent;
    btnCopyPrompt.textContent = "✓ Copied to Clipboard!";
    setTimeout(() => {
      btnCopyPrompt.textContent = orig;
    }, 1800);
  });

  window.addEventListener("resize", () => {
    if (zoomLevel === "auto") renderAll();
  });

  // Boot
  initPresets();
  pickDefaultActiveSymbol();
  syncEditorFromSpec();
  syncInspectorFromSpec();
  renderAll();
})();
