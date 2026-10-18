// PixelDSL Studio v2 — Interactive Web Controller (English UI, Undo/Redo, Hotkeys, Visual Frames & Layers)

(function () {
  const defaultPresetKey = window.PIXEL_PRESETS["ginger_cat_walk_120x80"] ? "ginger_cat_walk_120x80" : Object.keys(window.PIXEL_PRESETS)[0];
  let currentSpec = JSON.parse(JSON.stringify(window.PIXEL_PRESETS[defaultPresetKey].data));
  let lastRender = null;
  let editorMode = "json";
  let activeTool = "pose"; // "pose" | "inspect" | "light" | "brush" | "eraser"
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

  // Skeletal Rig Interactive State
  let selectedBoneId = null;
  let hoveredBoneId = null;
  let isDraggingBone = false;
  let boneDragMode = "rotate";
  let showSkeletonDebug = true;

  // Undo / Redo History Stack
  const undoStack = [];
  const redoStack = [];
  const MAX_HISTORY = 60;

  // Animation state
  let currentFrame = 0;
  let animTimer = null;

  // -------------------------------------------------------------
  // High-Performance Reusable Scratch Canvas Pool (Zero GC Thrashing)
  // -------------------------------------------------------------
  const _scratchPool = new Map();
  function getScratchBuffer(key, w, h) {
    let item = _scratchPool.get(key);
    if (!item) {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const imgData = ctx.createImageData(w, h);
      item = { canvas, ctx, imgData, w, h };
      _scratchPool.set(key, item);
    } else if (item.w !== w || item.h !== h) {
      item.canvas.width = w;
      item.canvas.height = h;
      item.imgData = item.ctx.createImageData(w, h);
      item.w = w;
      item.h = h;
    }
    return item;
  }

  function downloadBlob(filename, content, mimeType = "text/plain") {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  // DOM Elements
  const panelLeft = document.getElementById("panelLeft");
  const btnToggleCodePanel = document.getElementById("btnToggleCodePanel");
  const btnCollapseCode = document.getElementById("btnCollapseCode");

  const presetSelect = document.getElementById("presetSelect");
  const btnNewSprite = document.getElementById("btnNewSprite");
  const codeEditor = document.getElementById("codeEditor");
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
  const btnToggleBonesDebug = document.getElementById("btnToggleBonesDebug");
  const btnResetFramePose = document.getElementById("btnResetFramePose");

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
    codeEditor.value = JSON.stringify(currentSpec, null, 2);
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
        engineBadge.textContent = "🦴 PixelRig (FK)";
        engineBadge.className = "engine-badge badge-rig";
        setTool("pose");
      } else if (currentSpec.type === "shader") {
        engineBadge.textContent = "✨ GLSL Shader";
        engineBadge.className = "engine-badge badge-shader";
        setTool("inspect");
      } else if (Array.isArray(currentSpec.layers) && currentSpec.layers.length > 0) {
        engineBadge.textContent = "📐 Quilez 2.5D SDF";
        engineBadge.className = "engine-badge badge-layers";
        setTool("inspect");
      } else {
        engineBadge.textContent = "📐 PixelDSL";
        engineBadge.className = "engine-badge badge-layers";
        setTool("inspect");
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
    const rigDef = (currentSpec.rig && typeof currentSpec.rig === "object") ? currentSpec.rig : currentSpec;
    const bones = Array.isArray(rigDef.bones) ? rigDef.bones : (Array.isArray(currentSpec.bones) ? currentSpec.bones : []);
    if (boneCountBadge) boneCountBadge.textContent = bones.length;

    let currentPose = null;
    if (currentFrame > 0 && Array.isArray(currentSpec.frames) && currentSpec.frames[currentFrame - 1]) {
      const fDef = currentSpec.frames[currentFrame - 1];
      if (!fDef.pose) fDef.pose = {};
      currentPose = fDef.pose;
    } else if (currentFrame > 0 && Array.isArray(currentSpec.poses) && currentSpec.poses[currentFrame - 1]) {
      currentPose = currentSpec.poses[currentFrame - 1];
    }

    for (let i = 0; i < bones.length; i++) {
      const bone = bones[i];
      const item = document.createElement("div");
      const isSelected = bone.id === selectedBoneId;
      item.className = "bone-item" + (isSelected ? " selected" : "");
      item.dataset.boneId = bone.id;

      item.addEventListener("click", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
        selectedBoneId = (selectedBoneId === bone.id) ? null : bone.id;
        renderBonesList();
        renderAll();
      });

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
      if (isSelected) {
        nameSpan.style.color = "var(--accent)";
        nameSpan.style.fontWeight = "bold";
      }

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

      // Controls row: Angle adjustment slider + number input + 0° reset button
      const ctrlRow = document.createElement("div");
      ctrlRow.style.display = "flex";
      ctrlRow.style.alignItems = "center";
      ctrlRow.style.gap = "6px";
      ctrlRow.style.marginTop = "3px";

      const angleLabel = document.createElement("span");
      angleLabel.style.fontSize = "10.5px";
      angleLabel.style.color = "var(--text-muted)";
      angleLabel.style.minWidth = "42px";
      angleLabel.textContent = currentPose ? "dAngle:" : "Angle:";

      const angleSlider = document.createElement("input");
      angleSlider.type = "range";
      angleSlider.style.flex = "1";
      angleSlider.style.accentColor = "var(--accent)";
      angleSlider.min = "-180";
      angleSlider.max = "180";

      const numInput = document.createElement("input");
      numInput.type = "number";
      numInput.style.width = "48px";
      numInput.style.padding = "1px 3px";
      numInput.style.fontSize = "11px";
      numInput.style.fontFamily = "var(--font-mono)";
      numInput.style.textAlign = "center";
      numInput.min = "-180";
      numInput.max = "180";

      let curAngle = 0;
      if (currentPose) {
        curAngle = (currentPose[bone.id] && typeof currentPose[bone.id].dAngle === "number")
          ? Math.round(currentPose[bone.id].dAngle)
          : 0;
      } else {
        curAngle = typeof bone.angle === "number" ? Math.round(bone.angle) : 0;
      }
      angleSlider.value = String(curAngle);
      numInput.value = String(curAngle);

      const applyAngleChange = (val) => {
        val = Math.max(-180, Math.min(180, Math.round(val)));
        angleSlider.value = String(val);
        numInput.value = String(val);
        if (currentPose) {
          if (!currentPose[bone.id]) currentPose[bone.id] = {};
          currentPose[bone.id].dAngle = val;
        } else {
          bone.angle = val;
        }
        syncEditorFromSpec();
        renderAll();
      };

      angleSlider.addEventListener("input", () => {
        applyAngleChange(parseInt(angleSlider.value, 10) || 0);
      });
      numInput.addEventListener("change", () => {
        pushUndoState();
        applyAngleChange(parseInt(numInput.value, 10) || 0);
      });

      const btnZero = document.createElement("button");
      btnZero.className = "btn btn-sm";
      btnZero.style.padding = "1px 5px";
      btnZero.style.fontSize = "10px";
      btnZero.textContent = "0°";
      btnZero.title = "Reset angle to 0°";
      btnZero.addEventListener("click", (e) => {
        e.stopPropagation();
        pushUndoState();
        applyAngleChange(0);
      });

      ctrlRow.appendChild(angleLabel);
      ctrlRow.appendChild(angleSlider);
      ctrlRow.appendChild(numInput);
      ctrlRow.appendChild(btnZero);
      item.appendChild(ctrlRow);

      // Expanded Detail Inspector when selected: Z-Depth, Position/Offset, Radii tapering, Length, Parent
      if (isSelected) {
        const detailPanel = document.createElement("div");
        detailPanel.className = "bone-detail-panel";
        detailPanel.style.marginTop = "6px";
        detailPanel.style.padding = "8px";
        detailPanel.style.background = "rgba(15, 23, 42, 0.75)";
        detailPanel.style.border = "1px solid var(--accent)";
        detailPanel.style.borderRadius = "6px";
        detailPanel.style.display = "flex";
        detailPanel.style.flexDirection = "column";
        detailPanel.style.gap = "6px";

        // Helper to create slider rows
        const createSliderRow = (labelText, min, max, step, curVal, onInput) => {
          const row = document.createElement("div");
          row.style.display = "flex";
          row.style.alignItems = "center";
          row.style.gap = "6px";

          const lbl = document.createElement("span");
          lbl.style.fontSize = "10.5px";
          lbl.style.color = "var(--text-muted)";
          lbl.style.minWidth = "58px";
          lbl.textContent = labelText;

          const slider = document.createElement("input");
          slider.type = "range";
          slider.min = String(min);
          slider.max = String(max);
          slider.step = String(step);
          slider.value = String(curVal);
          slider.style.flex = "1";
          slider.style.accentColor = "var(--accent)";

          const valBadge = document.createElement("span");
          valBadge.style.fontFamily = "var(--font-mono)";
          valBadge.style.fontSize = "10.5px";
          valBadge.style.color = "var(--text-bright)";
          valBadge.style.minWidth = "40px";
          valBadge.style.textAlign = "right";
          valBadge.textContent = String(curVal);

          slider.addEventListener("input", () => {
            const v = parseFloat(slider.value) || 0;
            onInput(v, valBadge);
          });

          row.appendChild(lbl);
          row.appendChild(slider);
          row.appendChild(valBadge);
          return { row, slider, valBadge };
        };

        // 1. Z-Depth Slider with Perspective Scale Percentage
        const curZ = typeof bone.z === "number" ? bone.z : 1.0;
        const zRowObj = createSliderRow("Z-Depth:", -2.0, 5.0, 0.1, curZ, (val, badge) => {
          bone.z = val;
          const zFactor = Math.max(0.55, Math.min(2.0, 1.0 + (val - 1.0) * 0.18));
          badge.textContent = `${val.toFixed(1)} (${Math.round(zFactor * 100)}%)`;
          syncEditorFromSpec();
          renderAll();
        });
        const zInitFactor = Math.max(0.55, Math.min(2.0, 1.0 + (curZ - 1.0) * 0.18));
        zRowObj.valBadge.textContent = `${curZ.toFixed(1)} (${Math.round(zInitFactor * 100)}%)`;
        zRowObj.valBadge.title = "Z-depth layer with perspective scaling factor";
        detailPanel.appendChild(zRowObj.row);

        // 2. Position / Offset X, Y
        const posRow = document.createElement("div");
        posRow.style.display = "flex";
        posRow.style.alignItems = "center";
        posRow.style.gap = "6px";
        const isRoot = !bone.parent;
        const posLbl = document.createElement("span");
        posLbl.style.fontSize = "10.5px";
        posLbl.style.color = "var(--text-muted)";
        posLbl.style.minWidth = "58px";
        posLbl.textContent = isRoot ? "Pos X, Y:" : "Offset:";

        const inpX = document.createElement("input");
        inpX.type = "number";
        inpX.step = "0.5";
        inpX.style.width = "46px";
        inpX.style.padding = "2px 4px";
        inpX.style.fontSize = "10.5px";
        inpX.style.textAlign = "center";
        inpX.value = isRoot ? (bone.x ?? 0) : ((bone.offset && bone.offset[0]) ?? 0);

        const inpY = document.createElement("input");
        inpY.type = "number";
        inpY.step = "0.5";
        inpY.style.width = "46px";
        inpY.style.padding = "2px 4px";
        inpY.style.fontSize = "10.5px";
        inpY.style.textAlign = "center";
        inpY.value = isRoot ? (bone.y ?? 0) : ((bone.offset && bone.offset[1]) ?? 0);

        const updatePos = () => {
          pushUndoState();
          const vx = parseFloat(inpX.value) || 0;
          const vy = parseFloat(inpY.value) || 0;
          if (isRoot) {
            bone.x = vx;
            bone.y = vy;
          } else {
            bone.offset = [vx, vy];
          }
          syncEditorFromSpec();
          renderAll();
        };
        inpX.addEventListener("change", updatePos);
        inpY.addEventListener("change", updatePos);

        posRow.appendChild(posLbl);
        posRow.appendChild(inpX);
        posRow.appendChild(inpY);
        detailPanel.appendChild(posRow);

        // 3. Radius Base (r1) and Radius Tip (r2) - limb tapering
        const curR1 = Number(bone.r1 ?? 2.0);
        const curR2 = Number(bone.r2 ?? curR1);
        const r1Row = createSliderRow("r1 (Base):", 0.5, 25.0, 0.5, curR1, (val, badge) => {
          bone.r1 = val;
          badge.textContent = val.toFixed(1);
          syncEditorFromSpec();
          renderAll();
        });
        detailPanel.appendChild(r1Row.row);

        const r2Row = createSliderRow("r2 (Tip):", 0.5, 25.0, 0.5, curR2, (val, badge) => {
          bone.r2 = val;
          badge.textContent = val.toFixed(1);
          syncEditorFromSpec();
          renderAll();
        });
        detailPanel.appendChild(r2Row.row);

        // 4. Length Slider
        const curLen = Number(bone.length ?? 0);
        const lenRow = createSliderRow("Length:", 0, 45, 0.5, curLen, (val, badge) => {
          bone.length = val;
          badge.textContent = val.toFixed(1);
          syncEditorFromSpec();
          renderAll();
        });
        detailPanel.appendChild(lenRow.row);

        // 5. Parent Selector
        const parentRow = document.createElement("div");
        parentRow.style.display = "flex";
        parentRow.style.alignItems = "center";
        parentRow.style.gap = "6px";
        const pLbl = document.createElement("span");
        pLbl.style.fontSize = "10.5px";
        pLbl.style.color = "var(--text-muted)";
        pLbl.style.minWidth = "58px";
        pLbl.textContent = "Parent:";

        const pSel = document.createElement("select");
        pSel.style.flex = "1";
        pSel.style.fontSize = "11px";
        pSel.style.padding = "2px 4px";
        
        const optNone = document.createElement("option");
        optNone.value = "";
        optNone.textContent = "None (Root Bone)";
        pSel.appendChild(optNone);

        bones.forEach((b) => {
          if (b.id !== bone.id) {
            const opt = document.createElement("option");
            opt.value = b.id;
            opt.textContent = b.id;
            if (b.id === bone.parent) opt.selected = true;
            pSel.appendChild(opt);
          }
        });
        if (!bone.parent) optNone.selected = true;

        pSel.addEventListener("change", () => {
          pushUndoState();
          if (pSel.value) {
            bone.parent = pSel.value;
            if (!Array.isArray(bone.offset)) bone.offset = [0, 0];
          } else {
            delete bone.parent;
            if (typeof bone.x !== "number") bone.x = 24;
            if (typeof bone.y !== "number") bone.y = 24;
          }
          syncEditorFromSpec();
          renderBonesList();
          renderAll();
        });
        parentRow.appendChild(pLbl);
        parentRow.appendChild(pSel);
        detailPanel.appendChild(parentRow);

        item.appendChild(detailPanel);
      }

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

  if (btnToggleBonesDebug) {
    btnToggleBonesDebug.classList.toggle("active", showSkeletonDebug);
    btnToggleBonesDebug.addEventListener("click", () => {
      showSkeletonDebug = !showSkeletonDebug;
      btnToggleBonesDebug.classList.toggle("active", showSkeletonDebug);
      renderAll();
    });
  }

  if (btnResetFramePose) {
    btnResetFramePose.addEventListener("click", () => {
      if (currentFrame <= 0) return;
      pushUndoState();
      if (Array.isArray(currentSpec.frames) && currentSpec.frames[currentFrame - 1]) {
        currentSpec.frames[currentFrame - 1].pose = {};
      }
      syncEditorFromSpec();
      renderBonesList();
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
      const onionScratch = getScratchBuffer("main_onion", width, height);
      onionScratch.imgData.data.set(prevRender.buffer);
      onionScratch.ctx.putImageData(onionScratch.imgData, 0, 0);
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.drawImage(onionScratch.canvas, 0, 0, width * scale, height * scale);
      ctx.restore();
    }

    const offScratch = getScratchBuffer("main_offscreen", width, height);
    const activeBuf = (showNormalMap && lastRender.normalBuffer) ? lastRender.normalBuffer : buffer;
    offScratch.imgData.data.set(activeBuf);
    offScratch.ctx.putImageData(offScratch.imgData, 0, 0);

    ctx.drawImage(offScratch.canvas, 0, 0, width * scale, height * scale);

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
        const isSelected = bId === selectedBoneId;
        const isHovered = bId === hoveredBoneId;

        const sx = bState.start[0] * scale + scale * 0.5;
        const sy = bState.start[1] * scale + scale * 0.5;
        const ex = bState.end[0] * scale + scale * 0.5;
        const ey = bState.end[1] * scale + scale * 0.5;

        // Bone segment line
        ctx.strokeStyle = isSelected
          ? "rgba(255, 215, 0, 0.95)"
          : (isHovered ? "rgba(0, 255, 255, 1.0)" : "rgba(0, 210, 240, 0.65)");
        ctx.lineWidth = isSelected ? Math.max(3, scale * 0.4) : Math.max(1.5, scale * 0.22);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // Joint at start (yellow/gold)
        ctx.fillStyle = isSelected ? "#ffffff" : "#ffe600";
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(2.5, scale * 0.3), 0, Math.PI * 2);
        ctx.fill();

        // Joint at end / rotation handle (larger if hovered or selected)
        const endRadius = (isSelected || isHovered) ? Math.max(4.5, scale * 0.55) : Math.max(2.5, scale * 0.3);
        ctx.fillStyle = isSelected ? "#ffd700" : (isHovered ? "#00ffff" : "#ff5555");
        ctx.beginPath();
        ctx.arc(ex, ey, endRadius, 0, Math.PI * 2);
        ctx.fill();

        // Rotation arc / gizmo if selected
        if (isSelected) {
          ctx.strokeStyle = "rgba(255, 215, 0, 0.6)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          const dist = Math.hypot(ex - sx, ey - sy);
          ctx.arc(sx, sy, Math.max(10, dist), 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Bone name tag
        if (isSelected || isHovered || scale >= 8) {
          ctx.fillStyle = isSelected ? "#ffd700" : "rgba(255, 255, 255, 0.85)";
          ctx.font = "bold 9px sans-serif";
          ctx.fillText(bId, (sx + ex) * 0.5 + 4, (sy + ey) * 0.5 - 2);
        }
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
    p1Ctx.drawImage(offScratch.canvas, 0, 0, preview1x.width, preview1x.height);

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
        ptCtx.drawImage(offScratch.canvas, tx * cellW, ty * cellH, cellW, cellH);
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

  // Canvas Tools (Pose, Inspect, 3D Light)
  function setTool(toolName) {
    activeTool = toolName;
    document.querySelectorAll("[data-tool]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tool === toolName);
    });
    if (activeTool === "pose") {
      showSkeletonDebug = true;
      if (btnToggleBonesDebug) btnToggleBonesDebug.classList.add("active");
    }
    renderAll();
  }

  document.querySelectorAll("[data-tool]").forEach((btn) => {
    btn.addEventListener("click", () => setTool(btn.dataset.tool));
  });

  function getCanvasPixelCoords(evt) {
    if (!lastRender) return null;
    const rect = mainCanvas.getBoundingClientRect();
    const scaleX = lastRender.width / rect.width;
    const scaleY = lastRender.height / rect.height;
    const x = Math.floor((evt.clientX - rect.left) * scaleX);
    const y = Math.floor((evt.clientY - rect.top) * scaleY);
    return { x, y };
  }

  function getCanvasPreciseCoords(evt) {
    if (!lastRender) return null;
    const rect = mainCanvas.getBoundingClientRect();
    const scaleX = lastRender.width / rect.width;
    const scaleY = lastRender.height / rect.height;
    const x = (evt.clientX - rect.left) * scaleX;
    const y = (evt.clientY - rect.top) * scaleY;
    return { x, y };
  }

  mainCanvas.addEventListener("pointerdown", (evt) => {
    isPointerDown = true;
    const pt = getCanvasPreciseCoords(evt);
    if (!pt || !lastRender) return;

    if (currentSpec.type === "rig") {
      const fkMap = PixelDSLRenderer.solveFkRig(currentSpec, currentFrame);
      let hitStartId = null;
      let minStartDist = 9999;
      let hitEndId = null;
      let minEndDist = 9999;

      for (const [bid, bState] of Object.entries(fkMap)) {
        const dStart = Math.hypot(pt.x - bState.start[0], pt.y - bState.start[1]);
        if (dStart < 7.0 && dStart < minStartDist) {
          minStartDist = dStart;
          hitStartId = bid;
        }
        const dEnd = Math.hypot(pt.x - bState.end[0], pt.y - bState.end[1]);
        if (dEnd < 7.0 && dEnd < minEndDist) {
          minEndDist = dEnd;
          hitEndId = bid;
        }
      }

      if (hitStartId && (!hitEndId || minStartDist < minEndDist * 0.95)) {
        selectedBoneId = hitStartId;
        isDraggingBone = true;
        boneDragMode = "translate";
        pushUndoState();
        renderBonesList();
        renderAll();
        return;
      } else if (hitEndId) {
        selectedBoneId = hitEndId;
        isDraggingBone = true;
        boneDragMode = "rotate";
        pushUndoState();
        renderBonesList();
        renderAll();
        return;
      } else if (hitStartId) {
        selectedBoneId = hitStartId;
        isDraggingBone = true;
        boneDragMode = "translate";
        pushUndoState();
        renderBonesList();
        renderAll();
        return;
      }
    }
  });

  window.addEventListener("pointerup", () => {
    if (isDraggingBone) {
      isDraggingBone = false;
      syncEditorFromSpec();
      renderBonesList();
      renderAll();
    }
    isPointerDown = false;
    strokeSnapshotRecorded = false;
  });

  mainCanvas.addEventListener("pointermove", (evt) => {
    const pt = getCanvasPreciseCoords(evt);
    if (!pt || !lastRender) return;
    const pixelPt = getCanvasPixelCoords(evt);
    hoverCoord = pixelPt;

    // Interactive Bone Drag (Translation or Rotation)
    if (isDraggingBone && selectedBoneId && currentSpec.type === "rig") {
      const fkMap = PixelDSLRenderer.solveFkRig(currentSpec, currentFrame);
      const bState = fkMap[selectedBoneId];
      if (bState && bState.bone) {
        if (boneDragMode === "translate") {
          // Translate bone position or offset
          if (!bState.bone.parent) {
            // Root bone translation
            const newX = Math.round(pt.x * 10) / 10;
            const newY = Math.round(pt.y * 10) / 10;
            if (currentFrame > 0) {
              if (!Array.isArray(currentSpec.frames)) currentSpec.frames = [];
              while (currentSpec.frames.length < currentFrame) currentSpec.frames.push({ pose: {} });
              const fDef = currentSpec.frames[currentFrame - 1];
              if (!fDef.pose) fDef.pose = {};
              fDef.pose[selectedBoneId] = fDef.pose[selectedBoneId] || {};
              fDef.pose[selectedBoneId].dx = Math.round((newX - (bState.bone.x || 0)) * 10) / 10;
              fDef.pose[selectedBoneId].dy = Math.round((newY - (bState.bone.y || 0)) * 10) / 10;
            } else {
              bState.bone.x = newX;
              bState.bone.y = newY;
            }
            cursorInfo.textContent = `✥ Moving root '${selectedBoneId}' | X: ${newX}, Y: ${newY}`;
          } else {
            // Child bone offset translation
            const parentId = bState.bone.parent;
            const parentXform = fkMap[parentId] || { end: [0, 0], angle: 0 };
            const prad = (parentXform.angle * Math.PI) / 180.0;
            const pcos = Math.cos(prad);
            const psin = Math.sin(prad);
            const dxWorld = pt.x - parentXform.end[0];
            const dyWorld = pt.y - parentXform.end[1];
            const localDx = dxWorld * pcos + dyWorld * psin;
            const localDy = -dxWorld * psin + dyWorld * pcos;
            const finalDx = Math.round(localDx * 10) / 10;
            const finalDy = Math.round(localDy * 10) / 10;
            if (currentFrame > 0) {
              if (!Array.isArray(currentSpec.frames)) currentSpec.frames = [];
              while (currentSpec.frames.length < currentFrame) currentSpec.frames.push({ pose: {} });
              const fDef = currentSpec.frames[currentFrame - 1];
              if (!fDef.pose) fDef.pose = {};
              fDef.pose[selectedBoneId] = fDef.pose[selectedBoneId] || {};
              const baseOffset = Array.isArray(bState.bone.offset) ? bState.bone.offset : [0, 0];
              fDef.pose[selectedBoneId].dx = Math.round((finalDx - baseOffset[0]) * 10) / 10;
              fDef.pose[selectedBoneId].dy = Math.round((finalDy - baseOffset[1]) * 10) / 10;
            } else {
              bState.bone.offset = [finalDx, finalDy];
            }
            cursorInfo.textContent = `✥ Moving bone '${selectedBoneId}' offset | dx: ${finalDx}, dy: ${finalDy}`;
          }
          renderBonesList();
          renderAll();
          return;
        } else {
          // Rotate bone angle
          const startX = bState.start[0];
          const startY = bState.start[1];
          const mouseAngleDeg = (Math.atan2(pt.y - startY, pt.x - startX) * 180.0) / Math.PI;
          const parentAngle = bState.parentAngle || 0;
          let desiredRelAngle = mouseAngleDeg - parentAngle;
          desiredRelAngle = Math.round(((desiredRelAngle + 180) % 360 + 360) % 360 - 180);

          if (currentFrame > 0) {
            if (!Array.isArray(currentSpec.frames)) currentSpec.frames = [];
            while (currentSpec.frames.length < currentFrame) currentSpec.frames.push({ pose: {} });
            const fDef = currentSpec.frames[currentFrame - 1];
            if (!fDef.pose) fDef.pose = {};
            const baseAngle = (bState.bone && typeof bState.bone.angle === "number") ? bState.bone.angle : 0;
            fDef.pose[selectedBoneId] = fDef.pose[selectedBoneId] || {};
            fDef.pose[selectedBoneId].dAngle = desiredRelAngle - baseAngle;
          } else {
            bState.bone.angle = desiredRelAngle;
          }

          renderBonesList();
          renderAll();
          cursorInfo.textContent = `🦴 Rotating '${selectedBoneId}' | Angle: ${desiredRelAngle}°`;
          return;
        }
      }
    }

    // Bone hover detection for cursor feedback
    if (currentSpec.type === "rig") {
      const fkMap = PixelDSLRenderer.solveFkRig(currentSpec, currentFrame);
      let newHovered = null;
      let hoverHandleType = "end";
      let minDist = 9999;
      for (const [bid, bState] of Object.entries(fkMap)) {
        const dStart = Math.hypot(pt.x - bState.start[0], pt.y - bState.start[1]);
        if (dStart < 6.0 && dStart < minDist) {
          minDist = dStart;
          newHovered = bid;
          hoverHandleType = "start";
        }
        const dEnd = Math.hypot(pt.x - bState.end[0], pt.y - bState.end[1]);
        if (dEnd < 6.0 && dEnd < minDist) {
          minDist = dEnd;
          newHovered = bid;
          hoverHandleType = "end";
        }
      }
      if (newHovered !== hoveredBoneId) {
        hoveredBoneId = newHovered;
        mainCanvas.style.cursor = hoveredBoneId ? (hoverHandleType === "start" ? "move" : "crosshair") : "default";
        renderAll();
      }
      if (hoveredBoneId) {
        if (hoverHandleType === "start") {
          cursorInfo.textContent = `✥ Joint '${hoveredBoneId}' (Origin) | Drag to TRANSLATE position`;
        } else {
          cursorInfo.textContent = `⟳ Joint '${hoveredBoneId}' (Tip) | Drag to ROTATE angle`;
        }
        return;
      }
    }

    const { width, height, buffer, symbolBuffer } = lastRender;
    if (pixelPt && pixelPt.x >= 0 && pixelPt.x < width && pixelPt.y >= 0 && pixelPt.y < height) {
      const idx = (pixelPt.y * width + pixelPt.x) * 4;
      const r = buffer[idx], g = buffer[idx + 1], b = buffer[idx + 2], a = buffer[idx + 3];
      const sym = (symbolBuffer && symbolBuffer[pixelPt.y * width + pixelPt.x]) || ".";
      const hex = PixelDSLRenderer.rgbaToHex(r, g, b, a);
      cursorInfo.textContent = `X: ${pixelPt.x}, Y: ${pixelPt.y} | Sym: '${sym}' | Color: ${hex} | Tool: ${activeTool.toUpperCase()}`;
    }
    renderAll();
  });

  mainCanvas.addEventListener("pointerleave", () => {
    hoverCoord = null;
    hoveredBoneId = null;
    mainCanvas.style.cursor = "default";
    cursorInfo.textContent = "Hover over canvas or drag bone joints to pose | Tool: " + activeTool.toUpperCase();
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

  // ==========================================
  // Toast Notification System
  // ==========================================
  function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast-message toast-${type}`;
    let icon = "✨";
    if (type === "success") icon = "✓";
    if (type === "error") icon = "✕";
    if (type === "copy") icon = "📋";
    toast.innerHTML = `<span style="font-size: 14px;">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px) scale(0.95)";
      setTimeout(() => toast.remove(), 250);
    }, 2400);
  }

  // ==========================================
  // Workspace 0: Art Zone Controller
  // ==========================================
  const CANONICAL_T_POSE_128 = {
    type: "rig",
    title: "128px Canonical Humanoid T-Pose",
    width: 128,
    height: 128,
    outline: "o",
    outlineWidth: 1.0,
    palette: {
      ".": "transparent",
      "o": "#0f172a",
      "skin": "#f6c49c",
      "skin_hi": "#ffeedd",
      "skin_dark": "#c88e66",
      "skin_shadow": "#8c5638",
      "eyes": "#1e293b",
      "shirt": "#3b82f6",
      "shirt_dark": "#1d4ed8",
      "pants": "#334155",
      "pants_dark": "#1e293b",
      "boots": "#78350f",
      "boots_dark": "#451a03",
      "belt": "#ca8a04"
    },
    rig: {
      bones: [
        // Pelvis (Root bone, upright spine)
        { id: "pelvis", x: 64, y: 70, length: 8, angle: -90, r1: 9.5, r2: 10.0, z: 1.0, fill: "pants" },
        // Torso
        { id: "torso", parent: "pelvis", offset: [0, 0], length: 14, angle: 0, r1: 10.0, r2: 11.5, z: 1.1, fill: "shirt" },
        // Chest
        { id: "chest", parent: "torso", offset: [0, 0], length: 14, angle: 0, r1: 11.5, r2: 11.0, z: 1.2, fill: "shirt" },
        // Neck (Properly elevated above chest radius!)
        { id: "neck", parent: "chest", offset: [0, 0], length: 10, angle: 0, r1: 5.5, r2: 5.5, z: 1.3, fill: "skin_dark" },
        // Head (Oval with front-view centered dual eyes)
        {
          id: "head",
          parent: "neck",
          offset: [0, 0],
          length: 0,
          shape: "head_oval",
          r1: 13.5,
          r2: 12.0,
          z: 1.5,
          fill: "skin",
          features: {
            eyes: { spacing: 9.0, dy: -1.0, w: 2.5, h: 3.5, color: "eyes" }
          }
        },

        // Left Arm (Horizontal T-Pose, extends to the left, world angle 180°)
        { id: "clavicle_l", parent: "chest", offset: [-2, -12], length: 8, angle: -90, r1: 5.5, r2: 5.0, z: 1.25, fill: "shirt_dark" },
        { id: "arm_l_upper", parent: "clavicle_l", offset: [0, 0], length: 16, angle: 0, r1: 5.0, r2: 4.4, z: 1.25, fill: "skin" },
        { id: "arm_l_lower", parent: "arm_l_upper", offset: [0, 0], length: 15, angle: 0, r1: 4.4, r2: 3.8, z: 1.25, fill: "skin" },
        { id: "hand_l", parent: "arm_l_lower", offset: [0, 0], length: 7, angle: 0, r1: 3.8, r2: 3.0, z: 1.25, fill: "skin" },

        // Right Arm (Horizontal T-Pose, extends to the right, world angle 0°)
        { id: "clavicle_r", parent: "chest", offset: [-2, 12], length: 8, angle: 90, r1: 5.5, r2: 5.0, z: 1.25, fill: "shirt_dark" },
        { id: "arm_r_upper", parent: "clavicle_r", offset: [0, 0], length: 16, angle: 0, r1: 5.0, r2: 4.4, z: 1.25, fill: "skin" },
        { id: "arm_r_lower", parent: "arm_r_upper", offset: [0, 0], length: 15, angle: 0, r1: 4.4, r2: 3.8, z: 1.25, fill: "skin" },
        { id: "hand_r", parent: "arm_r_lower", offset: [0, 0], length: 7, angle: 0, r1: 3.8, r2: 3.0, z: 1.25, fill: "skin" },

        // Left Leg (Standing vertical, extends downwards)
        { id: "leg_l_thigh", parent: "pelvis", offset: [-8, -10], length: 21, angle: 180, r1: 7.2, r2: 5.8, z: 1.0, fill: "pants" },
        { id: "leg_l_shin", parent: "leg_l_thigh", offset: [0, 0], length: 20, angle: 0, r1: 5.8, r2: 4.8, z: 1.0, fill: "pants" },
        { id: "foot_l", parent: "leg_l_shin", offset: [0, 0], length: 7, angle: 25, r1: 4.8, r2: 3.4, z: 1.0, fill: "boots" },

        // Right Leg (Standing vertical, extends downwards)
        { id: "leg_r_thigh", parent: "pelvis", offset: [-8, 10], length: 21, angle: 180, r1: 7.2, r2: 5.8, z: 1.0, fill: "pants" },
        { id: "leg_r_shin", parent: "leg_r_thigh", offset: [0, 0], length: 20, angle: 0, r1: 5.8, r2: 4.8, z: 1.0, fill: "pants" },
        { id: "foot_r", parent: "leg_r_shin", offset: [0, 0], length: 7, angle: -25, r1: 4.8, r2: 3.4, z: 1.0, fill: "boots" }
      ]
    }
  };

  let artZoneSpec = JSON.parse(JSON.stringify(CANONICAL_T_POSE_128));
  let artZonePaintBuffer = new Uint8ClampedArray(128 * 128 * 4);
  let artZoneTool = "pencil";
  let artZoneColor = "#f6c49c";
  let artZoneBrushSize = 1;
  let artZoneFillShape = true;
  let artZoneSelectedBoneId = null;
  let artZoneHoveredBoneId = null;
  let artZoneDragMode = null;
  let artZoneDragStart = null;
  let artZoneLastPt = null;
  let artZoneShowGrid = true;
  let artZoneShowBones = true;
  let artZoneShowNormals = false;
  let artZoneZoom = 4;
  let artZoneLastRender = null;
  const artZoneUndoStack = [];
  const artZoneRedoStack = [];

  const ART_ZONE_PALETTE = [
    "#f6c49c", "#ffeedd", "#c88e66", "#8c5638", "#4e2418",
    "#3b82f6", "#1d4ed8", "#1e3a8a", "#0f172a",
    "#334155", "#64748b", "#94a3b8", "#e2e8f0", "#ffffff",
    "#ca8a04", "#eab308", "#ef4444", "#10b981", "#8b5cf6", "#06b6d4"
  ];

  function pushArtZoneUndo() {
    if (artZoneUndoStack.length >= 40) artZoneUndoStack.shift();
    artZoneUndoStack.push({
      spec: JSON.parse(JSON.stringify(artZoneSpec)),
      paint: new Uint8ClampedArray(artZonePaintBuffer)
    });
    artZoneRedoStack.length = 0;
    updateArtZoneUndoRedoButtons();
  }

  function updateArtZoneUndoRedoButtons() {
    const btnUndo = document.getElementById("btnArtZoneUndo");
    const btnRedo = document.getElementById("btnArtZoneRedo");
    if (btnUndo) btnUndo.disabled = artZoneUndoStack.length === 0;
    if (btnRedo) btnRedo.disabled = artZoneRedoStack.length === 0;
  }

  function renderArtZone() {
    const canvas = document.getElementById("artZoneCanvas");
    const overlay = document.getElementById("artZoneOverlay");
    const wrapper = document.getElementById("artZoneCanvasWrapper");
    if (!canvas || !overlay) return;

    const ctx = canvas.getContext("2d");
    const octx = overlay.getContext("2d");
    const w = 128;
    const h = 128;

    // Adjust canvas wrapper size based on zoom
    const zoomScale = (artZoneZoom === "auto" || !artZoneZoom) ? 4 : parseInt(artZoneZoom, 10);
    const displaySize = w * zoomScale;
    if (wrapper) {
      wrapper.style.width = `${displaySize}px`;
      wrapper.style.height = `${displaySize}px`;
    }

    // 1. Render Base 128px Skeletal Rig
    let rigRes;
    try {
      rigRes = PixelDSLRenderer.renderRig(artZoneSpec, 0);
    } catch (err) {
      console.error("ArtZone renderRig error:", err);
      rigRes = {
        width: 128,
        height: 128,
        buffer: new Uint8ClampedArray(128 * 128 * 4),
        normalBuffer: new Uint8ClampedArray(128 * 128 * 4)
      };
    }
    artZoneLastRender = rigRes;

    // 2. Composite Painted Pixels onto Output Buffer
    const compositeBuf = new Uint8ClampedArray(w * h * 4);
    const baseBuf = artZoneShowNormals ? rigRes.normalBuffer : rigRes.buffer;
    compositeBuf.set(baseBuf);

    if (!artZoneShowNormals) {
      for (let i = 0; i < w * h; i++) {
        const bIdx = i * 4;
        const pA = artZonePaintBuffer[bIdx + 3];
        if (pA > 0) {
          compositeBuf[bIdx] = artZonePaintBuffer[bIdx];
          compositeBuf[bIdx + 1] = artZonePaintBuffer[bIdx + 1];
          compositeBuf[bIdx + 2] = artZonePaintBuffer[bIdx + 2];
          compositeBuf[bIdx + 3] = pA;
        }
      }
    }

    const imgData = new ImageData(compositeBuf, w, h);
    ctx.putImageData(imgData, 0, 0);

    // 3. Render Overlay: Grid, Skeleton Rig, Gizmos
    octx.clearRect(0, 0, w, h);

    if (artZoneShowGrid && zoomScale >= 2) {
      octx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      octx.lineWidth = 0.5;
      for (let x = 0; x <= w; x += 8) {
        octx.beginPath();
        octx.moveTo(x, 0);
        octx.lineTo(x, h);
        octx.stroke();
      }
      for (let y = 0; y <= h; y += 8) {
        octx.beginPath();
        octx.moveTo(0, y);
        octx.lineTo(w, y);
        octx.stroke();
      }
    }

    if (artZoneShowBones && artZoneSpec.rig && Array.isArray(artZoneSpec.rig.bones)) {
      const fkMap = PixelDSLRenderer.solveFkRig(artZoneSpec.rig.bones, {});
      octx.save();
      for (const [bid, bState] of Object.entries(fkMap)) {
        const isSel = bid === artZoneSelectedBoneId;
        const isHov = bid === artZoneHoveredBoneId;

        const sx = bState.start[0];
        const sy = bState.start[1];
        const ex = bState.end[0];
        const ey = bState.end[1];

        // Bone segment line
        octx.strokeStyle = isSel
          ? "rgba(255, 215, 0, 0.95)"
          : (isHov ? "rgba(0, 255, 255, 1.0)" : "rgba(0, 210, 240, 0.6)");
        octx.lineWidth = isSel ? 2.5 : 1.2;
        octx.beginPath();
        octx.moveTo(sx, sy);
        octx.lineTo(ex, ey);
        octx.stroke();

        // Start Joint (Move handle): diamond / square
        octx.fillStyle = isSel ? "#ffffff" : "#ffe600";
        octx.strokeStyle = "#000000";
        octx.lineWidth = 0.8;
        octx.beginPath();
        octx.rect(sx - 2, sy - 2, 4, 4);
        octx.fill();
        octx.stroke();

        // End Joint (Rotate handle): circle
        const endRad = isSel || isHov ? 3.5 : 2.2;
        octx.fillStyle = isSel ? "#ffd700" : (isHov ? "#00ffff" : "#ff4444");
        octx.beginPath();
        octx.arc(ex, ey, endRad, 0, Math.PI * 2);
        octx.fill();
        octx.stroke();

        // Selected rotation guide
        if (isSel) {
          octx.strokeStyle = "rgba(255, 215, 0, 0.5)";
          octx.lineWidth = 1;
          octx.setLineDash([2, 2]);
          octx.beginPath();
          const dist = Math.hypot(ex - sx, ey - sy);
          octx.arc(sx, sy, Math.max(6, dist), 0, Math.PI * 2);
          octx.stroke();
          octx.setLineDash([]);
        }

        // Label
        if (isSel || isHov) {
          octx.fillStyle = isSel ? "#ffd700" : "#ffffff";
          octx.font = "bold 8px sans-serif";
          octx.fillText(bid, (sx + ex) * 0.5 + 3, (sy + ey) * 0.5 - 2);
        }
      }
      octx.restore();
    }

    updateArtZoneInspector();
  }

  function updateArtZoneInspector() {
    const title = document.getElementById("artZoneInspectorTitle");
    const body = document.getElementById("artZoneInspectorBody");
    if (!title || !body) return;

    const isRigTool = ["pose", "move", "add_bone", "parent_bone"].includes(artZoneTool) || Boolean(artZoneSelectedBoneId);

    if (isRigTool) {
      title.textContent = `🦴 Rig: ${artZoneSelectedBoneId || "No Bone Selected"}`;
      body.innerHTML = "";

      const bones = artZoneSpec.rig && Array.isArray(artZoneSpec.rig.bones) ? artZoneSpec.rig.bones : [];
      const bone = bones.find(b => b.id === artZoneSelectedBoneId);

      if (!bone) {
        body.innerHTML = `
          <div style="color: var(--text-muted); font-size: 11px; text-align: center; padding: 12px 6px;">
            Click any bone joint on canvas to inspect, move, or rotate.
          </div>
        `;
        return;
      }

      // Helper to create slider
      const createRow = (labelText, min, max, step, curVal, onInput) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "6px";

        const lbl = document.createElement("span");
        lbl.style.fontSize = "10.5px";
        lbl.style.color = "var(--text-muted)";
        lbl.style.minWidth = "60px";
        lbl.textContent = labelText;

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = String(min);
        slider.max = String(max);
        slider.step = String(step);
        slider.value = String(curVal);
        slider.style.flex = "1";
        slider.style.accentColor = "var(--accent)";

        const valBadge = document.createElement("span");
        valBadge.style.fontFamily = "var(--font-mono)";
        valBadge.style.fontSize = "10.5px";
        valBadge.style.color = "var(--text-bright)";
        valBadge.style.minWidth = "42px";
        valBadge.style.textAlign = "right";
        valBadge.textContent = String(curVal);

        slider.addEventListener("input", () => {
          const v = parseFloat(slider.value) || 0;
          onInput(v, valBadge);
        });

        row.appendChild(lbl);
        row.appendChild(slider);
        row.appendChild(valBadge);
        return { row, slider, valBadge };
      };

      // 1. Z-Depth Slider with Perspective Scale percentage
      const curZ = typeof bone.z === "number" ? bone.z : 1.0;
      const zRowObj = createRow("Z-Depth:", -2.0, 5.0, 0.1, curZ, (val, badge) => {
        bone.z = val;
        const zFactor = Math.max(0.55, Math.min(2.0, 1.0 + (val - 1.0) * 0.18));
        badge.textContent = `${val.toFixed(1)} (${Math.round(zFactor * 100)}%)`;
        renderArtZone();
      });
      const zInitFactor = Math.max(0.55, Math.min(2.0, 1.0 + (curZ - 1.0) * 0.18));
      zRowObj.valBadge.textContent = `${curZ.toFixed(1)} (${Math.round(zInitFactor * 100)}%)`;
      body.appendChild(zRowObj.row);

      // 2. Position / Offset
      const posRow = document.createElement("div");
      posRow.style.display = "flex";
      posRow.style.alignItems = "center";
      posRow.style.gap = "6px";
      const isRoot = !bone.parent;
      const posLbl = document.createElement("span");
      posLbl.style.fontSize = "10.5px";
      posLbl.style.color = "var(--text-muted)";
      posLbl.style.minWidth = "60px";
      posLbl.textContent = isRoot ? "Pos X, Y:" : "Offset:";

      const inpX = document.createElement("input");
      inpX.type = "number";
      inpX.step = "0.5";
      inpX.style.width = "48px";
      inpX.style.padding = "2px 4px";
      inpX.style.fontSize = "10.5px";
      inpX.style.textAlign = "center";
      inpX.value = isRoot ? (bone.x ?? 64) : ((bone.offset && bone.offset[0]) ?? 0);

      const inpY = document.createElement("input");
      inpY.type = "number";
      inpY.step = "0.5";
      inpY.style.width = "48px";
      inpY.style.padding = "2px 4px";
      inpY.style.fontSize = "10.5px";
      inpY.style.textAlign = "center";
      inpY.value = isRoot ? (bone.y ?? 64) : ((bone.offset && bone.offset[1]) ?? 0);

      const updatePos = () => {
        pushArtZoneUndo();
        const vx = parseFloat(inpX.value) || 0;
        const vy = parseFloat(inpY.value) || 0;
        if (isRoot) {
          bone.x = vx;
          bone.y = vy;
        } else {
          bone.offset = [vx, vy];
        }
        renderArtZone();
      };
      inpX.addEventListener("change", updatePos);
      inpY.addEventListener("change", updatePos);
      posRow.appendChild(posLbl);
      posRow.appendChild(inpX);
      posRow.appendChild(inpY);
      body.appendChild(posRow);

      // 3. Radii Tapering (r1 Base and r2 Tip)
      const curR1 = Number(bone.r1 ?? 4.0);
      const curR2 = Number(bone.r2 ?? curR1);
      const r1Row = createRow("r1 (Base):", 0.5, 30.0, 0.5, curR1, (val, badge) => {
        bone.r1 = val;
        badge.textContent = val.toFixed(1);
        renderArtZone();
      });
      body.appendChild(r1Row.row);

      const r2Row = createRow("r2 (Tip):", 0.5, 30.0, 0.5, curR2, (val, badge) => {
        bone.r2 = val;
        badge.textContent = val.toFixed(1);
        renderArtZone();
      });
      body.appendChild(r2Row.row);

      // 4. Length Slider
      const curLen = Number(bone.length ?? 0);
      const lenRow = createRow("Length:", 0, 60, 0.5, curLen, (val, badge) => {
        bone.length = val;
        badge.textContent = val.toFixed(1);
        renderArtZone();
      });
      body.appendChild(lenRow.row);

      // 5. Angle Slider
      const curAngle = Number(bone.angle ?? 0);
      const angRow = createRow("Angle:", -180, 180, 1, curAngle, (val, badge) => {
        bone.angle = val;
        badge.textContent = `${Math.round(val)}°`;
        renderArtZone();
      });
      angRow.valBadge.textContent = `${Math.round(curAngle)}°`;
      body.appendChild(angRow.row);

      // 6. Parent Selector
      const pRow = document.createElement("div");
      pRow.style.display = "flex";
      pRow.style.alignItems = "center";
      pRow.style.gap = "6px";
      const pLbl = document.createElement("span");
      pLbl.style.fontSize = "10.5px";
      pLbl.style.color = "var(--text-muted)";
      pLbl.style.minWidth = "60px";
      pLbl.textContent = "Parent:";

      const pSel = document.createElement("select");
      pSel.className = "artzone-select";
      pSel.style.flex = "1";
      const optRoot = document.createElement("option");
      optRoot.value = "";
      optRoot.textContent = "None (Root Bone)";
      pSel.appendChild(optRoot);

      bones.forEach(b => {
        if (b.id !== bone.id) {
          const opt = document.createElement("option");
          opt.value = b.id;
          opt.textContent = b.id;
          if (b.id === bone.parent) opt.selected = true;
          pSel.appendChild(opt);
        }
      });
      if (!bone.parent) optRoot.selected = true;

      pSel.addEventListener("change", () => {
        pushArtZoneUndo();
        if (pSel.value) {
          bone.parent = pSel.value;
          if (!Array.isArray(bone.offset)) bone.offset = [0, 0];
        } else {
          delete bone.parent;
          if (typeof bone.x !== "number") bone.x = 64;
          if (typeof bone.y !== "number") bone.y = 64;
        }
        renderArtZone();
      });
      pRow.appendChild(pLbl);
      pRow.appendChild(pSel);
      body.appendChild(pRow);

      // 7. Delete bone button
      const btnDel = document.createElement("button");
      btnDel.className = "btn btn-sm btn-danger";
      btnDel.style.marginTop = "4px";
      btnDel.textContent = `🗑️ Delete '${bone.id}'`;
      btnDel.addEventListener("click", () => {
        pushArtZoneUndo();
        artZoneSpec.rig.bones = artZoneSpec.rig.bones.filter(b => b.id !== bone.id);
        artZoneSelectedBoneId = null;
        renderArtZone();
      });
      body.appendChild(btnDel);

    } else {
      title.textContent = `✏️ Tool: ${artZoneTool.toUpperCase()}`;
      body.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="color: var(--text-muted); font-size: 11px;">Brush Size:</span>
            <div style="display: flex; gap: 4px;">
              ${[1, 2, 3, 4].map(sz => `
                <button class="btn btn-sm ${artZoneBrushSize === sz ? "btn-primary" : ""}" style="padding: 2px 7px; font-size: 10px;" data-art-brush-size="${sz}">${sz}px</button>
              `).join("")}
            </div>
          </div>
          ${["rect", "circle"].includes(artZoneTool) ? `
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="color: var(--text-muted); font-size: 11px;">Fill Shape:</span>
              <label style="display: inline-flex; align-items: center; gap: 4px; cursor: pointer; font-size: 11px;">
                <input type="checkbox" id="chkArtZoneFillShape" ${artZoneFillShape ? "checked" : ""} />
                <span>Solid</span>
              </label>
            </div>
          ` : ""}
          <div style="color: var(--text-muted); font-size: 10.5px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 6px;">
            Click &amp; drag on canvas to paint. Switch to 🦴 Pose/Move above to adjust bone skeleton.
          </div>
        </div>
      `;

      body.querySelectorAll("[data-art-brush-size]").forEach(b => {
        b.addEventListener("click", () => {
          artZoneBrushSize = parseInt(b.dataset.artBrushSize, 10) || 1;
          updateArtZoneInspector();
        });
      });
      const chkFill = body.querySelector("#chkArtZoneFillShape");
      if (chkFill) {
        chkFill.addEventListener("change", () => {
          artZoneFillShape = chkFill.checked;
        });
      }
    }
  }

  function initArtZone() {
    const overlay = document.getElementById("artZoneOverlay");
    if (!overlay) return;

    // 1. Tool Selection Buttons
    document.querySelectorAll("[data-art-tool]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-art-tool]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        artZoneTool = btn.dataset.artTool;
        const cursorInfo = document.getElementById("artZoneCursorInfo");
        if (cursorInfo) {
          cursorInfo.textContent = `128×128 Canonical T-Pose | Tool: ${artZoneTool.toUpperCase()}`;
        }
        renderArtZone();
      });
    });

    // 2. Swatches & Color Picker
    const swatchesContainer = document.getElementById("artZonePaletteSwatches");
    if (swatchesContainer) {
      swatchesContainer.innerHTML = "";
      ART_ZONE_PALETTE.forEach(hex => {
        const sw = document.createElement("div");
        sw.className = "artzone-swatch-btn" + (hex === artZoneColor ? " active" : "");
        sw.style.backgroundColor = hex;
        sw.title = hex;
        sw.addEventListener("click", () => {
          artZoneColor = hex;
          swatchesContainer.querySelectorAll(".artzone-swatch-btn").forEach(s => s.classList.remove("active"));
          sw.classList.add("active");
          const preview = document.getElementById("artZoneColorPreview");
          if (preview) preview.style.background = hex;
          const nativePick = document.getElementById("artZoneNativeColorPicker");
          if (nativePick) nativePick.value = hex;
        });
        swatchesContainer.appendChild(sw);
      });
    }

    const nativePicker = document.getElementById("artZoneNativeColorPicker");
    if (nativePicker) {
      nativePicker.addEventListener("input", () => {
        artZoneColor = nativePicker.value;
        const preview = document.getElementById("artZoneColorPreview");
        if (preview) preview.style.background = artZoneColor;
      });
    }

    // 3. Overlays & Zoom Checkboxes
    const chkGrid = document.getElementById("chkArtZoneGrid");
    if (chkGrid) chkGrid.addEventListener("change", () => { artZoneShowGrid = chkGrid.checked; renderArtZone(); });

    const chkBones = document.getElementById("chkArtZoneBones");
    if (chkBones) chkBones.addEventListener("change", () => { artZoneShowBones = chkBones.checked; renderArtZone(); });

    const chkNormals = document.getElementById("chkArtZoneNormals");
    if (chkNormals) chkNormals.addEventListener("change", () => { artZoneShowNormals = chkNormals.checked; renderArtZone(); });

    const selZoom = document.getElementById("selArtZoneZoom");
    if (selZoom) selZoom.addEventListener("change", () => { artZoneZoom = selZoom.value; renderArtZone(); });

    // 4. Action Buttons
    const btnReset = document.getElementById("btnArtZoneResetTPose");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        if (confirm("Reset canvas to canonical 128px front-view T-pose skeleton?")) {
          pushArtZoneUndo();
          artZoneSpec = JSON.parse(JSON.stringify(CANONICAL_T_POSE_128));
          artZonePaintBuffer.fill(0);
          artZoneSelectedBoneId = null;
          renderArtZone();
          showToast("✓ Canvas reset to canonical 128px T-pose", "success");
        }
      });
    }

    const btnUndo = document.getElementById("btnArtZoneUndo");
    if (btnUndo) {
      btnUndo.addEventListener("click", () => {
        if (artZoneUndoStack.length === 0) return;
        artZoneRedoStack.push({
          spec: JSON.parse(JSON.stringify(artZoneSpec)),
          paint: new Uint8ClampedArray(artZonePaintBuffer)
        });
        const prev = artZoneUndoStack.pop();
        artZoneSpec = prev.spec;
        artZonePaintBuffer.set(prev.paint);
        updateArtZoneUndoRedoButtons();
        renderArtZone();
      });
    }

    const btnRedo = document.getElementById("btnArtZoneRedo");
    if (btnRedo) {
      btnRedo.addEventListener("click", () => {
        if (artZoneRedoStack.length === 0) return;
        artZoneUndoStack.push({
          spec: JSON.parse(JSON.stringify(artZoneSpec)),
          paint: new Uint8ClampedArray(artZonePaintBuffer)
        });
        const next = artZoneRedoStack.pop();
        artZoneSpec = next.spec;
        artZonePaintBuffer.set(next.paint);
        updateArtZoneUndoRedoButtons();
        renderArtZone();
      });
    }

    const btnExportPng = document.getElementById("btnArtZoneExportPng");
    if (btnExportPng) {
      btnExportPng.addEventListener("click", () => {
        const off = document.createElement("canvas");
        off.width = 128;
        off.height = 128;
        const octx = off.getContext("2d");
        const rigRes = PixelDSLRenderer.renderRig(artZoneSpec, 0);
        const comp = new Uint8ClampedArray(128 * 128 * 4);
        comp.set(rigRes.buffer);
        for (let i = 0; i < 128 * 128; i++) {
          const idx = i * 4;
          if (artZonePaintBuffer[idx + 3] > 0) {
            comp[idx] = artZonePaintBuffer[idx];
            comp[idx + 1] = artZonePaintBuffer[idx + 1];
            comp[idx + 2] = artZonePaintBuffer[idx + 2];
            comp[idx + 3] = artZonePaintBuffer[idx + 3];
          }
        }
        octx.putImageData(new ImageData(comp, 128, 128), 0, 0);
        const a = document.createElement("a");
        a.download = "character_128px_tpose.png";
        a.href = off.toDataURL("image/png");
        a.click();
        showToast("✓ Downloaded character_128px_tpose.png (128×128)", "success");
      });
    }

    const btnToStudio = document.getElementById("btnArtZoneToStudio");
    if (btnToStudio) {
      btnToStudio.addEventListener("click", () => {
        currentSpec = JSON.parse(JSON.stringify(artZoneSpec));
        if (codeEditor) {
          codeEditor.value = JSON.stringify(currentSpec, null, 2);
        }
        const studioTab = document.querySelector('.workspace-tab[data-workspace="studio"]');
        if (studioTab) studioTab.click();
        renderAll();
        showToast("✓ Transferred 128px sprite to Canvas Studio!", "success");
      });
    }

    const btnInspectorCollapse = document.getElementById("btnArtZoneInspectorCollapse");
    const inspectorElem = document.getElementById("artZoneInspector");
    if (btnInspectorCollapse && inspectorElem) {
      btnInspectorCollapse.addEventListener("click", () => {
        inspectorElem.classList.toggle("collapsed");
        btnInspectorCollapse.textContent = inspectorElem.classList.contains("collapsed") ? "+" : "✕";
      });
    }

    // 5. Canvas Drawing & Rigging Pointer Interaction
    const getCoords = (evt) => {
      const rect = overlay.getBoundingClientRect();
      const x = Math.floor(((evt.clientX - rect.left) / rect.width) * 128);
      const y = Math.floor(((evt.clientY - rect.top) / rect.height) * 128);
      const fx = ((evt.clientX - rect.left) / rect.width) * 128;
      const fy = ((evt.clientY - rect.top) / rect.height) * 128;
      return { x: Math.max(0, Math.min(127, x)), y: Math.max(0, Math.min(127, y)), fx, fy };
    };

    const plotPixel = (px, py, colHex, isEraser = false) => {
      if (px < 0 || px >= 128 || py < 0 || py >= 128) return;
      const idx = (py * 128 + px) * 4;
      if (isEraser) {
        artZonePaintBuffer[idx] = 0;
        artZonePaintBuffer[idx + 1] = 0;
        artZonePaintBuffer[idx + 2] = 0;
        artZonePaintBuffer[idx + 3] = 0;
      } else {
        const rgba = PixelDSLRenderer.parseColor(colHex);
        artZonePaintBuffer[idx] = rgba[0];
        artZonePaintBuffer[idx + 1] = rgba[1];
        artZonePaintBuffer[idx + 2] = rgba[2];
        artZonePaintBuffer[idx + 3] = 255;
      }
    };

    const drawBrush = (cx, cy, colHex, isEraser = false) => {
      const r = artZoneBrushSize - 1;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (dx * dx + dy * dy <= r * r + 0.5) {
            plotPixel(cx + dx, cy + dy, colHex, isEraser);
          }
        }
      }
    };

    const drawLineBresenham = (x0, y0, x1, y1, colHex, isEraser = false) => {
      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);
      const sx = (x0 < x1) ? 1 : -1;
      const sy = (y0 < y1) ? 1 : -1;
      let err = dx - dy;

      while (true) {
        drawBrush(x0, y0, colHex, isEraser);
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
      }
    };

    overlay.addEventListener("pointerdown", (evt) => {
      const pt = getCoords(evt);
      artZoneDragStart = pt;
      artZoneLastPt = pt;
      pushArtZoneUndo();

      if (["pencil", "eraser"].includes(artZoneTool)) {
        artZoneDragMode = "draw";
        drawBrush(pt.x, pt.y, artZoneColor, artZoneTool === "eraser");
        renderArtZone();
      } else if (artZoneTool === "picker") {
        if (artZoneLastRender) {
          const idx = (pt.y * 128 + pt.x) * 4;
          const r = artZonePaintBuffer[idx + 3] > 0 ? artZonePaintBuffer[idx] : artZoneLastRender.buffer[idx];
          const g = artZonePaintBuffer[idx + 3] > 0 ? artZonePaintBuffer[idx + 1] : artZoneLastRender.buffer[idx + 1];
          const b = artZonePaintBuffer[idx + 3] > 0 ? artZonePaintBuffer[idx + 2] : artZoneLastRender.buffer[idx + 2];
          artZoneColor = PixelDSLRenderer.rgbaToHex(r, g, b, 255);
          const preview = document.getElementById("artZoneColorPreview");
          if (preview) preview.style.background = artZoneColor;
        }
      } else if (artZoneTool === "bucket") {
        // Flood Fill on paint buffer
        const startIdx = (pt.y * 128 + pt.x) * 4;
        const tr = artZonePaintBuffer[startIdx];
        const tg = artZonePaintBuffer[startIdx + 1];
        const tb = artZonePaintBuffer[startIdx + 2];
        const ta = artZonePaintBuffer[startIdx + 3];
        const fillRGBA = PixelDSLRenderer.parseColor(artZoneColor);

        if (tr !== fillRGBA[0] || tg !== fillRGBA[1] || tb !== fillRGBA[2] || ta !== 255) {
          const queue = [[pt.x, pt.y]];
          const visited = new Uint8Array(128 * 128);
          while (queue.length > 0) {
            const [qx, qy] = queue.pop();
            const qIdx = (qy * 128 + qx) * 4;
            if (qx < 0 || qx >= 128 || qy < 0 || qy >= 128 || visited[qy * 128 + qx]) continue;
            visited[qy * 128 + qx] = 1;

            if (artZonePaintBuffer[qIdx] === tr && artZonePaintBuffer[qIdx + 1] === tg &&
                artZonePaintBuffer[qIdx + 2] === tb && artZonePaintBuffer[qIdx + 3] === ta) {
              artZonePaintBuffer[qIdx] = fillRGBA[0];
              artZonePaintBuffer[qIdx + 1] = fillRGBA[1];
              artZonePaintBuffer[qIdx + 2] = fillRGBA[2];
              artZonePaintBuffer[qIdx + 3] = 255;
              queue.push([qx + 1, qy], [qx - 1, qy], [qx, qy + 1], [qx, qy - 1]);
            }
          }
          renderArtZone();
        }
      } else if (["line", "rect", "circle"].includes(artZoneTool)) {
        artZoneDragMode = "shape";
      } else if (["pose", "move", "add_bone", "parent_bone"].includes(artZoneTool)) {
        const fkMap = PixelDSLRenderer.solveFkRig(artZoneSpec.rig.bones, {});
        let hitStartId = null;
        let minStartDist = 9999;
        let hitEndId = null;
        let minEndDist = 9999;

        for (const [bid, bState] of Object.entries(fkMap)) {
          const ds = Math.hypot(pt.fx - bState.start[0], pt.fy - bState.start[1]);
          if (ds < 7.0 && ds < minStartDist) { minStartDist = ds; hitStartId = bid; }
          const de = Math.hypot(pt.fx - bState.end[0], pt.fy - bState.end[1]);
          if (de < 7.0 && de < minEndDist) { minEndDist = de; hitEndId = bid; }
        }

        if (artZoneTool === "parent_bone") {
          const clickedBone = hitStartId || hitEndId;
          if (clickedBone && artZoneSelectedBoneId && clickedBone !== artZoneSelectedBoneId) {
            const b = artZoneSpec.rig.bones.find(x => x.id === artZoneSelectedBoneId);
            if (b) {
              b.parent = clickedBone;
              showToast(`✓ Parented '${b.id}' to '${clickedBone}'`, "success");
            }
          }
          renderArtZone();
          return;
        }

        if (artZoneTool === "add_bone") {
          artZoneDragMode = "add_bone";
        } else if (artZoneTool === "move" || (hitStartId && minStartDist <= minEndDist)) {
          artZoneSelectedBoneId = hitStartId || hitEndId;
          artZoneDragMode = "move";
        } else if (artZoneTool === "pose" || hitEndId) {
          artZoneSelectedBoneId = hitEndId || hitStartId;
          artZoneDragMode = "pose";
        }
        renderArtZone();
      }
    });

    overlay.addEventListener("pointermove", (evt) => {
      const pt = getCoords(evt);
      const cursorInfo = document.getElementById("artZoneCursorInfo");
      if (cursorInfo) {
        cursorInfo.textContent = `X: ${pt.x}, Y: ${pt.y} | Tool: ${artZoneTool.toUpperCase()} | Color: ${artZoneColor}`;
      }

      if (!artZoneDragMode) {
        // Hover detection for bones
        if (["pose", "move", "parent_bone"].includes(artZoneTool)) {
          const fkMap = PixelDSLRenderer.solveFkRig(artZoneSpec.rig.bones, {});
          let hov = null;
          let minDist = 9999;
          for (const [bid, bState] of Object.entries(fkMap)) {
            const d = Math.min(
              Math.hypot(pt.fx - bState.start[0], pt.fy - bState.start[1]),
              Math.hypot(pt.fx - bState.end[0], pt.fy - bState.end[1])
            );
            if (d < 6.0 && d < minDist) { minDist = d; hov = bid; }
          }
          if (hov !== artZoneHoveredBoneId) {
            artZoneHoveredBoneId = hov;
            renderArtZone();
          }
        }
        return;
      }

      if (artZoneDragMode === "draw") {
        drawLineBresenham(artZoneLastPt.x, artZoneLastPt.y, pt.x, pt.y, artZoneColor, artZoneTool === "eraser");
        artZoneLastPt = pt;
        renderArtZone();
      } else if (artZoneDragMode === "shape") {
        // Redraw preview overlay
        renderArtZone();
        const octx = overlay.getContext("2d");
        octx.save();
        octx.strokeStyle = artZoneColor;
        octx.fillStyle = artZoneColor;
        octx.lineWidth = 1;
        if (artZoneTool === "line") {
          octx.beginPath();
          octx.moveTo(artZoneDragStart.x + 0.5, artZoneDragStart.y + 0.5);
          octx.lineTo(pt.x + 0.5, pt.y + 0.5);
          octx.stroke();
        } else if (artZoneTool === "rect") {
          const rx = Math.min(artZoneDragStart.x, pt.x);
          const ry = Math.min(artZoneDragStart.y, pt.y);
          const rw = Math.abs(pt.x - artZoneDragStart.x);
          const rh = Math.abs(pt.y - artZoneDragStart.y);
          if (artZoneFillShape) octx.fillRect(rx, ry, rw, rh);
          else octx.strokeRect(rx + 0.5, ry + 0.5, rw, rh);
        } else if (artZoneTool === "circle") {
          const r = Math.hypot(pt.x - artZoneDragStart.x, pt.y - artZoneDragStart.y);
          octx.beginPath();
          octx.arc(artZoneDragStart.x, artZoneDragStart.y, r, 0, Math.PI * 2);
          if (artZoneFillShape) octx.fill();
          else octx.stroke();
        }
        octx.restore();
      } else if (artZoneDragMode === "pose" && artZoneSelectedBoneId) {
        const bones = artZoneSpec.rig.bones;
        const b = bones.find(x => x.id === artZoneSelectedBoneId);
        const fkMap = PixelDSLRenderer.solveFkRig(bones, {});
        const bState = fkMap[artZoneSelectedBoneId];
        if (b && bState) {
          const startX = bState.start[0];
          const startY = bState.start[1];
          const mouseAngleDeg = (Math.atan2(pt.fy - startY, pt.fx - startX) * 180.0) / Math.PI;
          const parentAngle = bState.parentAngle || 0;
          let desiredRelAngle = mouseAngleDeg - parentAngle;
          desiredRelAngle = Math.round(((desiredRelAngle + 180) % 360 + 360) % 360 - 180);
          b.angle = desiredRelAngle;
          renderArtZone();
        }
      } else if (artZoneDragMode === "move" && artZoneSelectedBoneId) {
        const bones = artZoneSpec.rig.bones;
        const b = bones.find(x => x.id === artZoneSelectedBoneId);
        const fkMap = PixelDSLRenderer.solveFkRig(bones, {});
        if (b) {
          if (!b.parent) {
            b.x = Math.round(pt.fx * 10) / 10;
            b.y = Math.round(pt.fy * 10) / 10;
          } else {
            const pXform = fkMap[b.parent] || { end: [0, 0], angle: 0 };
            const prad = (pXform.angle * Math.PI) / 180.0;
            const pcos = Math.cos(prad);
            const psin = Math.sin(prad);
            const dxWorld = pt.fx - pXform.end[0];
            const dyWorld = pt.fy - pXform.end[1];
            const localDx = dxWorld * pcos + dyWorld * psin;
            const localDy = -dxWorld * psin + dyWorld * pcos;
            b.offset = [Math.round(localDx * 10) / 10, Math.round(localDy * 10) / 10];
          }
          renderArtZone();
        }
      }
    });

    window.addEventListener("pointerup", () => {
      if (artZoneDragMode === "shape" && artZoneDragStart && artZoneLastPt) {
        // Commit shape to paint buffer
        if (artZoneTool === "line") {
          drawLineBresenham(artZoneDragStart.x, artZoneDragStart.y, artZoneLastPt.x, artZoneLastPt.y, artZoneColor, false);
        } else if (artZoneTool === "rect") {
          const rx0 = Math.min(artZoneDragStart.x, artZoneLastPt.x);
          const rx1 = Math.max(artZoneDragStart.x, artZoneLastPt.x);
          const ry0 = Math.min(artZoneDragStart.y, artZoneLastPt.y);
          const ry1 = Math.max(artZoneDragStart.y, artZoneLastPt.y);
          for (let y = ry0; y <= ry1; y++) {
            for (let x = rx0; x <= rx1; x++) {
              if (artZoneFillShape || x === rx0 || x === rx1 || y === ry0 || y === ry1) {
                plotPixel(x, y, artZoneColor, false);
              }
            }
          }
        } else if (artZoneTool === "circle") {
          const r = Math.round(Math.hypot(artZoneLastPt.x - artZoneDragStart.x, artZoneLastPt.y - artZoneDragStart.y));
          const cx = artZoneDragStart.x;
          const cy = artZoneDragStart.y;
          for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
              const d = Math.hypot(dx, dy);
              if (artZoneFillShape ? (d <= r + 0.5) : (Math.abs(d - r) <= 0.75)) {
                plotPixel(cx + dx, cy + dy, artZoneColor, false);
              }
            }
          }
        }
      } else if (artZoneDragMode === "add_bone" && artZoneDragStart && artZoneLastPt) {
        const dx = artZoneLastPt.fx - artZoneDragStart.fx;
        const dy = artZoneLastPt.fy - artZoneDragStart.fy;
        const len = Math.round(Math.hypot(dx, dy) * 10) / 10;
        if (len >= 3) {
          const ang = Math.round((Math.atan2(dy, dx) * 180.0) / Math.PI);
          const newId = "bone_" + (artZoneSpec.rig.bones.length + 1);
          artZoneSpec.rig.bones.push({
            id: newId,
            x: Math.round(artZoneDragStart.fx * 10) / 10,
            y: Math.round(artZoneDragStart.fy * 10) / 10,
            length: len,
            angle: ang,
            r1: 4.5,
            r2: 4.0,
            z: 1.2,
            fill: "skin"
          });
          artZoneSelectedBoneId = newId;
          showToast(`✓ Created new bone '${newId}'`, "success");
        }
      }

      artZoneDragMode = null;
      artZoneDragStart = null;
      renderArtZone();
    });

    renderArtZone();
  }

  // ==========================================
  // Workspace Switcher
  // ==========================================
  function initWorkspaces() {
    const tabs = document.querySelectorAll(".workspace-tab");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const targetWs = tab.dataset.workspace;
        tabs.forEach(t => t.classList.toggle("active", t === tab));
        const wsMap = {
          artzone: "workspaceArtZone",
          studio: "workspaceStudio",
          forge: "workspaceForge",
          paperdoll: "workspacePaperDoll",
          three3d: "workspaceThree3D",
          compass: "workspaceCompass",
          exporter: "workspaceExporter"
        };
        document.querySelectorAll(".workspace-view").forEach(v => {
          const isActive = (v.id === wsMap[targetWs]);
          v.classList.toggle("active", isActive);
        });

        if (targetWs === "artzone") {
          renderArtZone();
        } else if (targetWs === "studio") {
          renderAll();
        } else if (targetWs === "forge") {
          compileAndRenderForge();
        } else if (targetWs === "paperdoll") {
          compileAndRenderPaperDoll();
        } else if (targetWs === "three3d") {
          if (studio3D) studio3D.resizeOrbitView();
          start3DStudioLoop();
        } else if (targetWs === "compass") {
          renderCompassDemo();
        }
      });
    });

    const btnOpenArtZone = document.getElementById("btnOpenArtZone");
    if (btnOpenArtZone) {
      btnOpenArtZone.addEventListener("click", () => {
        const tab = document.querySelector('.workspace-tab[data-workspace="artzone"]');
        if (tab) tab.click();
      });
    }
  }

  // ==========================================
  // Workspace 2: Archetype Forge Controller
  // ==========================================
  let forgeActiveCat = "creatures";
  let forgeActiveArchId = "humanoid";
  let forgeWidth = 48;
  let forgeHeight = 48;
  let forgeHeadScale = 1.0;
  let forgeBuildScale = 1.0;
  let forgeAction = "walk";
  let forgeFrames = 8;
  let forgeTheme = "classic";
  let forgeOutline = "none";
  let forgeFrameIndex = 0;
  let forgeIsPlaying = true;
  let compiledForgeSpec = null;
  let forgeLoopTimer = null;

  function initArchetypeForge() {
    if (!window.ArchetypeCompiler) return;

    const forgeCategoryPills = document.getElementById("forgeCategoryPills");
    const forgeArchetypeGrid = document.getElementById("forgeArchetypeGrid");
    const forgeSizePills = document.getElementById("forgeSizePills");
    const inputForgeHeadScale = document.getElementById("inputForgeHeadScale");
    const lblForgeHeadScale = document.getElementById("lblForgeHeadScale");
    const inputForgeBuildScale = document.getElementById("inputForgeBuildScale");
    const lblForgeBuildScale = document.getElementById("lblForgeBuildScale");
    const selForgeAction = document.getElementById("selForgeAction");
    const inputForgeFrames = document.getElementById("inputForgeFrames");
    const lblForgeFrames = document.getElementById("lblForgeFrames");
    const selForgeTheme = document.getElementById("selForgeTheme");
    const selForgeOutline = document.getElementById("selForgeOutline");
    const btnForgeOpenInStudio = document.getElementById("btnForgeOpenInStudio");
    const btnForgeExportPng = document.getElementById("btnForgeExportPng");
    const btnForgeExportSheet = document.getElementById("btnForgeExportSheet");
    const btnForgeExportNormal = document.getElementById("btnForgeExportNormal");
    const btnForgeCopyJson = document.getElementById("btnForgeCopyJson");
    const btnForgePlayAnim = document.getElementById("btnForgePlayAnim");
    const selForgeFps = document.getElementById("selForgeFps");
    const chkForgeSkeleton = document.getElementById("chkForgeSkeleton");
    const chkForgeNormals = document.getElementById("chkForgeNormals");
    const chkForgeDepthTint = document.getElementById("chkForgeDepthTint");
    const selForgeZoom = document.getElementById("selForgeZoom");
    const rowHeadScale = document.getElementById("rowHeadScale");

    const selForgeSubtype = document.getElementById("selForgeSubtype");
    const rowForgeSubtype = document.getElementById("rowForgeSubtype");

    function renderCategoryPills() {
      if (!forgeCategoryPills) return;
      forgeCategoryPills.innerHTML = "";
      const categories = window.ArchetypeCompiler.getCategories();
      for (const [catKey, catData] of Object.entries(categories)) {
        const btn = document.createElement("button");
        btn.className = `forge-category-pill ${catKey === forgeActiveCat ? "active" : ""}`;
        btn.textContent = catData.label;
        btn.addEventListener("click", () => {
          forgeActiveCat = catKey;
          renderCategoryPills();
          const archs = categories[catKey].archetypes;
          if (archs.length > 0) {
            forgeActiveArchId = archs[0].id;
          }
          renderArchetypeGrid();
          updateActionOptions();
          updateSubtypeOptions();
          compileAndRenderForge(true);
        });
        forgeCategoryPills.appendChild(btn);
      }
    }

    function renderArchetypeGrid() {
      if (!forgeArchetypeGrid) return;
      forgeArchetypeGrid.innerHTML = "";
      const categories = window.ArchetypeCompiler.getCategories();
      const currentCatData = categories[forgeActiveCat];
      if (!currentCatData) return;

      const icons = {
        humanoid: "🧍", quadruped_feline: "🐱", quadruped_canine: "🐺", avian_bird: "🦅",
        mythic_dragon: "🐉", crawler_spider: "🕷️", serpent_snake: "🐍", golem_stone: "🗿",
        tree_deciduous: "🌳", plant_flower: "🌼", mushroom_fungus: "🍄", rock_boulder: "🪨",
        building_structure: "🏰",
        weapon_sword: "⚔️", weapon_bow: "🏹", weapon_staff: "🪄", armor_shield: "🛡️", potion_bottle: "🧪",
        projectile_orb: "💥", spell_lightning: "⚡", spell_fireball: "🔥",
        autotile_terrain: "🗺️", tile_grass: "🌱", tile_dirt: "🟫", tile_sand: "🏖️", tile_stone: "🧱", tile_water: "🌊"
      };

      for (const arch of currentCatData.archetypes) {
        const card = document.createElement("div");
        card.className = `forge-archetype-card ${arch.id === forgeActiveArchId ? "active" : ""}`;
        card.innerHTML = `
          <div class="arch-card-header">
            <span class="arch-card-icon">${icons[arch.id] || "📦"}</span>
            <span>${arch.name.replace(/^(Tile|Weapon|Spell|Armor)\s+/, "").split(" (")[0]}</span>
          </div>
          <div class="arch-card-desc">${arch.description ? arch.description.substring(0, 34) + "..." : arch.type}</div>
        `;
        card.addEventListener("click", () => {
          forgeActiveArchId = arch.id;
          renderArchetypeGrid();
          updateActionOptions();
          updateSubtypeOptions();
          if (rowHeadScale) {
            rowHeadScale.style.display = (arch.id === "humanoid" || arch.id.includes("quadruped")) ? "flex" : "none";
          }
          compileAndRenderForge(true);
        });
        forgeArchetypeGrid.appendChild(card);
      }
    }

    function updateSubtypeOptions() {
      if (!selForgeSubtype || !rowForgeSubtype) return;
      selForgeSubtype.innerHTML = "";
      const arch = window.ArchetypeCompiler.getArchetype(forgeActiveArchId);
      if (!arch || !arch.subtypes || Object.keys(arch.subtypes).length === 0) {
        rowForgeSubtype.style.display = "none";
        return;
      }
      rowForgeSubtype.style.display = "flex";
      for (const [subKey, subDesc] of Object.entries(arch.subtypes)) {
        const opt = document.createElement("option");
        opt.value = subKey;
        opt.textContent = subKey.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        opt.title = typeof subDesc === "string" ? subDesc : "";
        selForgeSubtype.appendChild(opt);
      }
    }

    if (selForgeSubtype) {
      selForgeSubtype.addEventListener("change", () => {
        compileAndRenderForge(true);
      });
    }

    function updateActionOptions() {
      if (!selForgeAction) return;
      selForgeAction.innerHTML = "";
      const arch = window.ArchetypeCompiler.getArchetype(forgeActiveArchId);
      if (!arch) return;

      const actions = arch.locomotion ? Object.keys(arch.locomotion) : (arch.motion ? Object.keys(arch.motion) : ["default"]);
      actions.forEach(act => {
        const opt = document.createElement("option");
        opt.value = act;
        opt.textContent = act.charAt(0).toUpperCase() + act.slice(1).replace("_", " ");
        selForgeAction.appendChild(opt);
      });
      forgeAction = actions[0];
      selForgeAction.value = forgeAction;
    }

    // Size Pills
    if (forgeSizePills) {
      forgeSizePills.querySelectorAll(".forge-size-pill").forEach(pill => {
        pill.addEventListener("click", () => {
          forgeSizePills.querySelectorAll(".forge-size-pill").forEach(p => p.classList.remove("active"));
          pill.classList.add("active");
          forgeWidth = parseInt(pill.dataset.w, 10);
          forgeHeight = parseInt(pill.dataset.h, 10);
          compileAndRenderForge();
        });
      });
    }

    // Sliders
    if (inputForgeHeadScale) {
      inputForgeHeadScale.addEventListener("input", () => {
        forgeHeadScale = parseInt(inputForgeHeadScale.value, 10) / 100.0;
        if (lblForgeHeadScale) lblForgeHeadScale.textContent = `${forgeHeadScale.toFixed(2)}×`;
        compileAndRenderForge();
      });
    }

    if (inputForgeBuildScale) {
      inputForgeBuildScale.addEventListener("input", () => {
        forgeBuildScale = parseInt(inputForgeBuildScale.value, 10) / 100.0;
        if (lblForgeBuildScale) lblForgeBuildScale.textContent = `${forgeBuildScale.toFixed(2)}×`;
        compileAndRenderForge();
      });
    }

    if (selForgeAction) {
      selForgeAction.addEventListener("change", () => {
        forgeAction = selForgeAction.value;
        compileAndRenderForge(true);
      });
    }

    if (inputForgeFrames) {
      inputForgeFrames.addEventListener("input", () => {
        forgeFrames = parseInt(inputForgeFrames.value, 10);
        if (lblForgeFrames) lblForgeFrames.textContent = `${forgeFrames} frame${forgeFrames > 1 ? "s" : ""}`;
        compileAndRenderForge(true);
      });
    }

    if (selForgeTheme) {
      selForgeTheme.addEventListener("change", () => {
        forgeTheme = selForgeTheme.value;
        compileAndRenderForge();
      });
    }

    if (selForgeOutline) {
      selForgeOutline.addEventListener("change", () => {
        forgeOutline = selForgeOutline.value;
        compileAndRenderForge();
      });
    }

    // Overlays
    if (chkForgeSkeleton) chkForgeSkeleton.addEventListener("change", () => drawForgeFrame());
    if (chkForgeNormals) chkForgeNormals.addEventListener("change", () => drawForgeFrame());
    if (chkForgeDepthTint) chkForgeDepthTint.addEventListener("change", () => drawForgeFrame());
    if (selForgeZoom) selForgeZoom.addEventListener("change", () => drawForgeFrame());

    // Playback
    if (btnForgePlayAnim) {
      btnForgePlayAnim.addEventListener("click", () => {
        forgeIsPlaying = !forgeIsPlaying;
        btnForgePlayAnim.textContent = forgeIsPlaying ? "⏸ Pause" : "▶ Play";
      });
    }

    if (selForgeFps) {
      selForgeFps.addEventListener("change", () => {
        startForgeAnimLoop();
      });
    }

    // Inject into Studio
    if (btnForgeOpenInStudio) {
      btnForgeOpenInStudio.addEventListener("click", () => {
        if (!compiledForgeSpec) return;
        currentSpec = JSON.parse(JSON.stringify(compiledForgeSpec));
        syncEditorFromSpec();
        syncInspectorFromSpec();
        // Switch to Studio tab
        document.querySelectorAll(".workspace-tab").forEach(t => t.classList.toggle("active", t.dataset.workspace === "studio"));
        document.querySelectorAll(".workspace-view").forEach(v => v.classList.toggle("active", v.id === "workspaceStudio"));
        renderAll();
        showToast(`⚡ Injected "${compiledForgeSpec.name}" into Canvas Studio!`, "success");
      });
    }

    // Export buttons
    if (btnForgeExportPng) {
      btnForgeExportPng.addEventListener("click", () => {
        if (!compiledForgeSpec) return;
        const res = PixelDSLRenderer.render(compiledForgeSpec, forgeFrameIndex);
        const c = document.createElement("canvas");
        c.width = res.width;
        c.height = res.height;
        const ctx = c.getContext("2d");
        const imgData = ctx.createImageData(res.width, res.height);
        imgData.data.set(res.buffer);
        ctx.putImageData(imgData, 0, 0);
        const a = document.createElement("a");
        a.href = c.toDataURL("image/png");
        a.download = `${compiledForgeSpec.name}_f${forgeFrameIndex + 1}.png`;
        a.click();
        showToast(`💾 Exported native PNG (1:1) to downloads!`, "success");
      });
    }

    if (btnForgeExportSheet) {
      btnForgeExportSheet.addEventListener("click", () => {
        if (!compiledForgeSpec) return;
        const numFrames = Math.max(1, compiledForgeSpec.frames ? compiledForgeSpec.frames.length : 1);
        const w = compiledForgeSpec.width;
        const h = compiledForgeSpec.height;
        const c = document.createElement("canvas");
        c.width = w * numFrames;
        c.height = h;
        const ctx = c.getContext("2d");
        for (let fi = 0; fi < numFrames; fi++) {
          const res = PixelDSLRenderer.render(compiledForgeSpec, fi);
          const imgData = ctx.createImageData(w, h);
          imgData.data.set(res.buffer);
          ctx.putImageData(imgData, fi * w, 0);
        }
        const a = document.createElement("a");
        a.href = c.toDataURL("image/png");
        a.download = `${compiledForgeSpec.name}_sheet.png`;
        a.click();
        showToast(`🎞️ Exported Sprite Sheet (${numFrames} frames)!`, "success");
      });
    }

    if (btnForgeExportNormal) {
      btnForgeExportNormal.addEventListener("click", () => {
        if (!compiledForgeSpec) return;
        const res = PixelDSLRenderer.render(compiledForgeSpec, forgeFrameIndex);
        if (res.normalBuffer) {
          const c = document.createElement("canvas");
          c.width = res.width;
          c.height = res.height;
          const ctx = c.getContext("2d");
          const imgData = ctx.createImageData(res.width, res.height);
          imgData.data.set(res.normalBuffer);
          ctx.putImageData(imgData, 0, 0);
          const a = document.createElement("a");
          a.href = c.toDataURL("image/png");
          a.download = `${compiledForgeSpec.name}_normal.png`;
          a.click();
          showToast(`💡 Exported 2.5D Normal Map PNG!`, "success");
        } else {
          showToast("Normal map not available for this primitive mode.", "error");
        }
      });
    }

    if (btnForgeCopyJson) {
      btnForgeCopyJson.addEventListener("click", () => {
        if (!compiledForgeSpec) return;
        navigator.clipboard.writeText(JSON.stringify(compiledForgeSpec, null, 2));
        showToast("📋 Copied PixelDSL JSON spec to clipboard!", "copy");
      });
    }

    renderCategoryPills();
    renderArchetypeGrid();
    updateActionOptions();
    updateSubtypeOptions();
    compileAndRenderForge(true);
    startForgeAnimLoop();
  }

  function compileAndRenderForge(resetFrame = false) {
    if (!window.ArchetypeCompiler) return;
    if (resetFrame) forgeFrameIndex = 0;

    compiledForgeSpec = window.ArchetypeCompiler.compile({
      archetypeId: forgeActiveArchId,
      width: forgeWidth,
      height: forgeHeight,
      action: forgeAction,
      frames: forgeFrames,
      headScale: forgeHeadScale,
      buildScale: forgeBuildScale,
      paletteTheme: forgeTheme,
      outlineMode: forgeOutline
    });

    updateForgeBlueprintUI();
    updateForgeTimelineStrip();
    drawForgeFrame();
  }

  function drawForgeFrame() {
    const forgeCanvas = document.getElementById("forgeCanvas");
    if (!forgeCanvas || !compiledForgeSpec) return;

    const numFrames = Math.max(1, compiledForgeSpec.frames ? compiledForgeSpec.frames.length : 1);
    forgeFrameIndex = forgeFrameIndex % numFrames;

    const lblForgeFrameIndicator = document.getElementById("lblForgeFrameIndicator");
    if (lblForgeFrameIndicator) {
      lblForgeFrameIndicator.textContent = `Frame ${forgeFrameIndex + 1} / ${numFrames}`;
    }

    // Active thumbnail in strip
    const strip = document.getElementById("forgeTimelineStrip");
    if (strip) {
      strip.querySelectorAll(".forge-frame-thumb").forEach((t, idx) => {
        t.classList.toggle("active", idx === forgeFrameIndex);
      });
    }

    const renderRes = PixelDSLRenderer.render(compiledForgeSpec, forgeFrameIndex);
    const w = renderRes.width;
    const h = renderRes.height;

    // Zoom scale
    const selZoom = document.getElementById("selForgeZoom");
    let scale = 8;
    if (selZoom && selZoom.value !== "auto") {
      scale = parseInt(selZoom.value, 10);
    } else {
      scale = Math.max(2, Math.min(16, Math.floor(320 / Math.max(w, h))));
    }

    forgeCanvas.width = w * scale;
    forgeCanvas.height = h * scale;
    const ctx = forgeCanvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    // Draw base pixel buffer or normal buffer
    const chkNormals = document.getElementById("chkForgeNormals");
    const chkDepthTint = document.getElementById("chkForgeDepthTint");
    const useNormals = chkNormals && chkNormals.checked && renderRes.normalBuffer;

    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const octx = off.getContext("2d");
    const imgData = octx.createImageData(w, h);

    if (useNormals) {
      imgData.data.set(renderRes.normalBuffer);
    } else {
      imgData.data.set(renderRes.buffer);
    }

    // Optional Z-Depth tinting overlay
    if (chkDepthTint && chkDepthTint.checked && renderRes.depthBuffer) {
      for (let i = 0; i < w * h; i++) {
        if (imgData.data[i * 4 + 3] > 0) {
          const z = renderRes.depthBuffer[i];
          if (z <= 1.0) { // shadow
            imgData.data[i * 4] = Math.floor(imgData.data[i * 4] * 0.4);
            imgData.data[i * 4 + 2] = Math.min(255, imgData.data[i * 4 + 2] + 120);
          } else if (z >= 3.0) { // highlight foreground
            imgData.data[i * 4] = Math.min(255, imgData.data[i * 4] + 100);
            imgData.data[i * 4 + 1] = Math.min(255, imgData.data[i * 4 + 1] + 80);
          }
        }
      }
    }

    octx.putImageData(imgData, 0, 0);
    ctx.drawImage(off, 0, 0, forgeCanvas.width, forgeCanvas.height);

    // Optional Skeleton Wireframe Overlay
    const chkSkeleton = document.getElementById("chkForgeSkeleton");
    if (chkSkeleton && chkSkeleton.checked && compiledForgeSpec.type === "rig" && renderRes.bonesMap) {
      drawSkeletonOverlay(ctx, renderRes.bonesMap, scale);
    }
  }

  function drawSkeletonOverlay(ctx, bonesMap, scale) {
    ctx.save();
    ctx.lineWidth = 1.5;
    for (const [id, b] of Object.entries(bonesMap)) {
      if (!b.p0 || !b.p1) continue;
      const x0 = b.p0[0] * scale;
      const y0 = b.p0[1] * scale;
      const x1 = b.p1[0] * scale;
      const y1 = b.p1[1] * scale;

      // Bone line
      ctx.strokeStyle = "rgba(168, 85, 247, 0.75)";
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();

      // Joint circle
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.beginPath();
      ctx.arc(x0, y0, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function updateForgeTimelineStrip() {
    const strip = document.getElementById("forgeTimelineStrip");
    if (!strip || !compiledForgeSpec) return;
    strip.innerHTML = "";

    const numFrames = Math.max(1, compiledForgeSpec.frames ? compiledForgeSpec.frames.length : 1);
    const w = compiledForgeSpec.width;
    const h = compiledForgeSpec.height;

    for (let fi = 0; fi < numFrames; fi++) {
      const thumb = document.createElement("canvas");
      thumb.className = `forge-frame-thumb ${fi === forgeFrameIndex ? "active" : ""}`;
      thumb.width = 48;
      thumb.height = 48;
      const tctx = thumb.getContext("2d");
      tctx.imageSmoothingEnabled = false;

      const fres = PixelDSLRenderer.render(compiledForgeSpec, fi);
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d");
      const imgData = octx.createImageData(w, h);
      imgData.data.set(fres.buffer);
      octx.putImageData(imgData, 0, 0);

      tctx.drawImage(off, 0, 0, 48, 48);

      thumb.addEventListener("click", () => {
        forgeFrameIndex = fi;
        drawForgeFrame();
      });
      strip.appendChild(thumb);
    }
  }

  function updateForgeBlueprintUI() {
    const badgeForgeType = document.getElementById("badgeForgeType");
    const forgeBlueprintSummary = document.getElementById("forgeBlueprintSummary");
    const lblForgeStructureTitle = document.getElementById("lblForgeStructureTitle");
    const forgeStructureList = document.getElementById("forgeStructureList");

    if (!compiledForgeSpec) return;
    const isRig = compiledForgeSpec.type === "rig";

    if (badgeForgeType) {
      badgeForgeType.textContent = isRig ? "🦴 Skeletal Rig" : "✨ 2.5D SDF Layers";
      badgeForgeType.style.background = isRig ? "rgba(168, 85, 247, 0.2)" : "rgba(59, 130, 246, 0.2)";
      badgeForgeType.style.borderColor = isRig ? "rgba(168, 85, 247, 0.4)" : "rgba(59, 130, 246, 0.4)";
      badgeForgeType.style.color = isRig ? "#d8b4fe" : "#93c5fd";
    }

    if (forgeBlueprintSummary) {
      const arch = window.ArchetypeCompiler.getArchetype(forgeActiveArchId);
      const boneCount = isRig ? (compiledForgeSpec.rig ? compiledForgeSpec.rig.bones.length : 0) : (compiledForgeSpec.layers ? compiledForgeSpec.layers.length : 0);
      const animFrames = Math.max(1, compiledForgeSpec.frames ? compiledForgeSpec.frames.length : 1);
      forgeBlueprintSummary.innerHTML = `
        <div style="font-weight: 700; color: #fff; margin-bottom: 2px;">${compiledForgeSpec.label}</div>
        <div style="color: var(--text-muted); font-size: 11px;">${arch ? arch.description : ""}</div>
        <div style="display: flex; gap: 8px; margin-top: 6px; font-family: var(--font-mono); font-size: 10.5px;">
          <span>Resolution: <b>${compiledForgeSpec.width}×${compiledForgeSpec.height}</b></span>
          <span>Elements: <b>${boneCount}</b></span>
          <span>Loop: <b>${animFrames}f</b></span>
        </div>
      `;
    }

    if (lblForgeStructureTitle) {
      lblForgeStructureTitle.textContent = isRig ? "Skeletal Rig Hierarchy" : "SDF Layer Stack";
    }

    if (forgeStructureList) {
      forgeStructureList.innerHTML = "";
      if (isRig && compiledForgeSpec.rig) {
        for (const b of compiledForgeSpec.rig.bones) {
          const row = document.createElement("div");
          row.className = "blueprint-bone-row";
          row.innerHTML = `
            <span style="color: #cbd5e1; font-weight: 600;">${b.id}</span>
            <span style="color: var(--text-muted); font-size: 10px;">Z=${b.z !== undefined ? b.z : 1} | L=${b.length || 0}px</span>
          `;
          forgeStructureList.appendChild(row);
        }
      } else if (compiledForgeSpec.layers) {
        for (const lay of compiledForgeSpec.layers) {
          const row = document.createElement("div");
          row.className = "blueprint-bone-row";
          row.innerHTML = `
            <span style="color: #cbd5e1; font-weight: 600;">${lay.id}</span>
            <span style="color: var(--text-muted); font-size: 10px;">${lay.type || lay.shape || "layer"} (${lay.opMode || lay.op || "draw"})</span>
          `;
          forgeStructureList.appendChild(row);
        }
      }
    }
  }

  function startForgeAnimLoop() {
    if (forgeLoopTimer) clearInterval(forgeLoopTimer);
    const selForgeFps = document.getElementById("selForgeFps");
    const fps = parseInt(selForgeFps ? selForgeFps.value : 8, 10) || 8;
    forgeLoopTimer = setInterval(() => {
      if (!forgeIsPlaying || !compiledForgeSpec) return;
      const numFrames = Math.max(1, compiledForgeSpec.frames ? compiledForgeSpec.frames.length : 1);
      if (numFrames > 1) {
        forgeFrameIndex = (forgeFrameIndex + 1) % numFrames;
        drawForgeFrame();
      }
    }, 1000 / fps);
  }

  // ==========================================
  // Workspace 3: Modular Paper Doll Studio
  // ==========================================
  let paperDollActiveMannequin = "humanoid";
  let paperDollActiveLoadout = "paladin";
  let paperDollActiveTheme = "steel";
  let paperDollActiveAction = "walk";
  let paperDollEquippedSlots = {
    head: "iron_helm",
    torso: "steel_cuirass",
    hands: "steel_gauntlets",
    legs: "plate_greaves",
    feet: "iron_sabatons",
    weapon: "runed_broadsword",
    shield: "kite_shield",
    back: "red_cape"
  };
  let paperDollActiveDirection = "down";
  let paperDollUseIK = true;
  let compiled4WaySpecs = null;
  let paperDollFrameIndex = 0;
  let paperDollIsPlaying = true;
  let paperDollAnimTimer = null;
  let compiledPaperDollSpec = null;

  function initPaperDoll() {
    if (!window.PaperDollEngine) return;

    const PDE = window.PaperDollEngine;

    // 1. Mannequin Buttons
    const mannequinBtns = document.querySelectorAll("#paperDollMannequinBtns button[data-mannequin]");
    mannequinBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        paperDollActiveMannequin = btn.dataset.mannequin;
        mannequinBtns.forEach(b => b.classList.toggle("active", b === btn));
        compileAndRenderPaperDoll();
      });
    });

    // 2. Direction Buttons (4-Way Top-Down / Profile)
    const directionBtns = document.querySelectorAll("#paperDollDirectionBtns button[data-direction]");
    directionBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        paperDollActiveDirection = btn.dataset.direction;
        directionBtns.forEach(b => b.classList.toggle("active", b === btn));
        const is4Way = paperDollActiveDirection === "4way";
        const wSingle = document.getElementById("paperDollCanvasWrapper");
        const w4Way = document.getElementById("paperDoll4WayContainer");
        if (wSingle) wSingle.style.display = is4Way ? "none" : "inline-flex";
        if (w4Way) w4Way.style.display = is4Way ? "grid" : "none";
        compileAndRenderPaperDoll();
      });
    });

    // 2b. Ground Contact Analytical IK Toggle
    const chkIK = document.getElementById("chkPaperDollIK");
    if (chkIK) {
      chkIK.addEventListener("change", () => {
        paperDollUseIK = chkIK.checked;
        compileAndRenderPaperDoll();
      });
    }

    // 3. Loadout Selector
    const selLoadout = document.getElementById("selPaperDollLoadout");
    if (selLoadout) {
      selLoadout.addEventListener("change", () => {
        const loadoutKey = selLoadout.value;
        const ld = PDE.LOADOUTS[loadoutKey];
        if (ld) {
          paperDollActiveLoadout = loadoutKey;
          paperDollActiveMannequin = ld.mannequin || "humanoid";
          paperDollActiveTheme = ld.theme || "steel";
          paperDollEquippedSlots = Object.assign({}, ld.slots);

          // Update UI controls
          mannequinBtns.forEach(b => b.classList.toggle("active", b.dataset.mannequin === paperDollActiveMannequin));
          const selTheme = document.getElementById("selPaperDollTheme");
          if (selTheme) selTheme.value = paperDollActiveTheme;

          populatePaperDollSlotsUI();
          compileAndRenderPaperDoll();
        }
      });
    }

    // 4. Theme Selector
    const selTheme = document.getElementById("selPaperDollTheme");
    if (selTheme) {
      selTheme.addEventListener("change", () => {
        paperDollActiveTheme = selTheme.value;
        compileAndRenderPaperDoll();
      });
    }

    // 5. Action Pills
    const actionPills = document.querySelectorAll("#paperDollActionPills button[data-action]");
    actionPills.forEach(pill => {
      pill.addEventListener("click", () => {
        paperDollActiveAction = pill.dataset.action;
        actionPills.forEach(p => p.classList.toggle("active", p === pill));
        paperDollFrameIndex = 0;
        compileAndRenderPaperDoll();
        startPaperDollAnimLoop();
      });
    });

    // 6. Playback Controls
    const btnPlay = document.getElementById("btnPaperDollPlayAnim");
    if (btnPlay) {
      btnPlay.addEventListener("click", () => {
        paperDollIsPlaying = !paperDollIsPlaying;
        btnPlay.textContent = paperDollIsPlaying ? "⏸ Pause" : "▶ Play";
      });
    }

    const selFps = document.getElementById("selPaperDollFps");
    if (selFps) {
      selFps.addEventListener("change", () => {
        startPaperDollAnimLoop();
      });
    }

    // 7. Viewport Overlays
    const chkBones = document.getElementById("chkPaperDollBones");
    const chkNormals = document.getElementById("chkPaperDollNormals");
    const chkZTiers = document.getElementById("chkPaperDollZTiers");
    const selZoom = document.getElementById("selPaperDollZoom");

    [chkBones, chkNormals, chkZTiers, selZoom].forEach(el => {
      if (el) el.addEventListener("change", () => drawPaperDollFrame());
    });

    // 8. Action Card Buttons
    const btnStudio = document.getElementById("btnPaperDollOpenInStudio");
    if (btnStudio) {
      btnStudio.addEventListener("click", () => {
        if (!compiledPaperDollSpec) return;
        currentSpec = JSON.parse(JSON.stringify(compiledPaperDollSpec));
        syncEditorFromSpec();
        syncInspectorFromSpec();
        document.querySelectorAll(".workspace-tab").forEach(t => t.classList.toggle("active", t.dataset.workspace === "studio"));
        document.querySelectorAll(".workspace-view").forEach(v => v.classList.toggle("active", v.id === "workspaceStudio"));
        renderAll();
        showToast(`⚡ Injected "${compiledPaperDollSpec.label}" into Canvas Studio!`, "success");
      });
    }

    const btnPng = document.getElementById("btnPaperDollExportPng");
    if (btnPng) {
      btnPng.addEventListener("click", () => {
        exportPaperDollPng();
      });
    }

    const btnSheet = document.getElementById("btnPaperDollExportSheet");
    if (btnSheet) {
      btnSheet.addEventListener("click", () => {
        exportPaperDollSheet();
      });
    }

    const btn4Way = document.getElementById("btnPaperDollExport4Way");
    if (btn4Way) {
      btn4Way.addEventListener("click", () => {
        exportPaperDoll4WaySheet();
      });
    }

    const btnNormal = document.getElementById("btnPaperDollExportNormal");
    if (btnNormal) {
      btnNormal.addEventListener("click", () => {
        exportPaperDollNormal();
      });
    }

    const btnJson = document.getElementById("btnPaperDollCopyJson");
    if (btnJson) {
      btnJson.addEventListener("click", () => {
        if (!compiledPaperDollSpec) return;
        navigator.clipboard.writeText(JSON.stringify(compiledPaperDollSpec, null, 2));
        showToast("📋 Copied Paper Doll JSON spec to clipboard!", "copy");
      });
    }

    populatePaperDollSlotsUI();
    compileAndRenderPaperDoll();
    startPaperDollAnimLoop();
  }

  function populatePaperDollSlotsUI() {
    const container = document.getElementById("paperDollSlotsContainer");
    if (!container || !window.PaperDollEngine) return;
    const PDE = window.PaperDollEngine;

    container.innerHTML = "";

    PDE.SLOTS.forEach(slotDef => {
      const row = document.createElement("div");
      row.className = "paperdoll-slot-row";

      const iconSpan = document.createElement("span");
      iconSpan.className = "paperdoll-slot-icon";
      iconSpan.textContent = slotDef.icon;
      iconSpan.title = slotDef.name;

      const sel = document.createElement("select");
      sel.className = "paperdoll-slot-select";
      sel.dataset.slot = slotDef.id;

      // Fill options with items matching this slot
      const matchingItems = Object.values(PDE.ITEMS).filter(it => it.slot === slotDef.id || it.id === "none");
      matchingItems.forEach(it => {
        const opt = document.createElement("option");
        opt.value = it.id;
        opt.textContent = it.name;
        if (paperDollEquippedSlots[slotDef.id] === it.id) {
          opt.selected = true;
        }
        sel.appendChild(opt);
      });

      const currentItem = paperDollEquippedSlots[slotDef.id] || "none";
      const isEquipped = currentItem !== "none";

      const toggleBtn = document.createElement("button");
      toggleBtn.className = "paperdoll-slot-toggle" + (isEquipped ? " equipped" : "");
      toggleBtn.textContent = isEquipped ? "Equipped" : "Empty";

      sel.addEventListener("change", () => {
        paperDollEquippedSlots[slotDef.id] = sel.value;
        const active = sel.value !== "none";
        toggleBtn.className = "paperdoll-slot-toggle" + (active ? " equipped" : "");
        toggleBtn.textContent = active ? "Equipped" : "Empty";
        compileAndRenderPaperDoll();
      });

      toggleBtn.addEventListener("click", () => {
        if (paperDollEquippedSlots[slotDef.id] && paperDollEquippedSlots[slotDef.id] !== "none") {
          paperDollEquippedSlots[slotDef.id] = "none";
          sel.value = "none";
          toggleBtn.className = "paperdoll-slot-toggle";
          toggleBtn.textContent = "Empty";
        } else {
          paperDollEquippedSlots[slotDef.id] = slotDef.defaultItem;
          sel.value = slotDef.defaultItem;
          toggleBtn.className = "paperdoll-slot-toggle equipped";
          toggleBtn.textContent = "Equipped";
        }
        compileAndRenderPaperDoll();
      });

      row.appendChild(iconSpan);
      row.appendChild(sel);
      row.appendChild(toggleBtn);
      container.appendChild(row);
    });
  }

  function flipImageDataInPlace(imgData, isNormal) {
    const w = imgData.width, h = imgData.height;
    const d = imgData.data;
    const halfW = Math.floor(w / 2);
    for (let y = 0; y < h; y++) {
      const rowOffset = y * w * 4;
      for (let x = 0; x < halfW; x++) {
        const i1 = rowOffset + x * 4;
        const i2 = rowOffset + (w - 1 - x) * 4;

        const r1 = d[i1], g1 = d[i1 + 1], b1 = d[i1 + 2], a1 = d[i1 + 3];
        const r2 = d[i2], g2 = d[i2 + 1], b2 = d[i2 + 2], a2 = d[i2 + 3];

        if (isNormal) {
          d[i1]     = 255 - r2;
          d[i1 + 1] = g2;
          d[i1 + 2] = b2;
          d[i1 + 3] = a2;

          d[i2]     = 255 - r1;
          d[i2 + 1] = g1;
          d[i2 + 2] = b1;
          d[i2 + 3] = a1;
        } else {
          d[i1]     = r2;
          d[i1 + 1] = g2;
          d[i1 + 2] = b2;
          d[i1 + 3] = a2;

          d[i2]     = r1;
          d[i2 + 1] = g1;
          d[i2 + 2] = b1;
          d[i2 + 3] = a1;
        }
      }
      if (isNormal && (w % 2 === 1)) {
        const midI = rowOffset + halfW * 4;
        d[midI] = 255 - d[midI];
      }
    }
    return imgData;
  }

  function flipImageDataH(ctx, imgData, isNormal) {
    return flipImageDataInPlace(imgData, isNormal);
  }


  function compileAndRenderPaperDoll() {
    if (!window.PaperDollEngine) return;
    const PDE = window.PaperDollEngine;
    const is4Way = paperDollActiveDirection === "4way";
    const dirToAssemble = is4Way ? "down" : paperDollActiveDirection;

    compiledPaperDollSpec = PDE.assembleSpec(
      paperDollActiveMannequin,
      paperDollEquippedSlots,
      paperDollActiveAction,
      {
        theme: paperDollActiveTheme,
        outline: "o",
        outlineWidth: 1,
        selOut: true,
        direction: dirToAssemble,
        useIK: paperDollUseIK
      }
    );

    if (is4Way) {
      compiled4WaySpecs = {
        down: compiledPaperDollSpec,
        left: PDE.assembleSpec(paperDollActiveMannequin, paperDollEquippedSlots, paperDollActiveAction, {
          theme: paperDollActiveTheme, outline: "o", outlineWidth: 1, selOut: true, direction: "left", useIK: paperDollUseIK
        }),
        right: PDE.assembleSpec(paperDollActiveMannequin, paperDollEquippedSlots, paperDollActiveAction, {
          theme: paperDollActiveTheme, outline: "o", outlineWidth: 1, selOut: true, direction: "right", useIK: paperDollUseIK
        }),
        up: PDE.assembleSpec(paperDollActiveMannequin, paperDollEquippedSlots, paperDollActiveAction, {
          theme: paperDollActiveTheme, outline: "o", outlineWidth: 1, selOut: true, direction: "up", useIK: paperDollUseIK
        })
      };
    } else {
      compiled4WaySpecs = null;
    }

    // Update Bone Count Badge
    const badgeCount = document.getElementById("badgePaperDollBoneCount");
    const totalBones = (compiledPaperDollSpec.rig && compiledPaperDollSpec.rig.bones) ? compiledPaperDollSpec.rig.bones.length : 0;
    if (badgeCount) {
      badgeCount.textContent = `${totalBones} Active Bones [${paperDollActiveDirection.toUpperCase()}]`;
    }

    // Update Combat Stats
    const summary = PDE.calculateLoadoutSummary(paperDollActiveMannequin, paperDollEquippedSlots, paperDollActiveTheme);
    const statsCard = document.getElementById("paperDollStatsCard");
    if (statsCard) {
      const st = summary.stats;
      statsCard.innerHTML = `
        <div class="paperdoll-stat-item">
          <span class="stat-item-label">⚔️ Attack Power</span>
          <span class="stat-item-value" style="color: #f87171;">${st.atk || 0}</span>
        </div>
        <div class="paperdoll-stat-item">
          <span class="stat-item-label">🛡️ Armor Rating</span>
          <span class="stat-item-value" style="color: #60a5fa;">${st.def || 0}</span>
        </div>
        <div class="paperdoll-stat-item">
          <span class="stat-item-label">⚖️ Total Weight</span>
          <span class="stat-item-value" style="color: #fbbf24;">${(st.weight || 0).toFixed(1)} kg</span>
        </div>
        <div class="paperdoll-stat-item">
          <span class="stat-item-label">🔮 Magic / Mana</span>
          <span class="stat-item-value" style="color: #c084fc;">+${st.mana || 0}</span>
        </div>
      `;
    }

    // Update Z-Tier Stack
    const zStack = document.getElementById("paperDollZTierStack");
    if (zStack && compiledPaperDollSpec.rig && compiledPaperDollSpec.rig.bones) {
      const sortedBones = [...compiledPaperDollSpec.rig.bones].sort((a, b) => Number(b.z || 0) - Number(a.z || 0));
      zStack.innerHTML = sortedBones.map(b => `
        <div class="ztier-layer-row">
          <span class="ztier-layer-name">${b.id}</span>
          <span class="ztier-layer-tag">Z = ${(Number(b.z || 0)).toFixed(2)}</span>
        </div>
      `).join("");
    }

    buildPaperDollTimelineStrip();
    drawPaperDollFrame();
  }

  function buildPaperDollTimelineStrip() {
    const strip = document.getElementById("paperDollTimelineStrip");
    if (!strip || !compiledPaperDollSpec) return;
    strip.innerHTML = "";

    const numFrames = Math.max(1, compiledPaperDollSpec.frames ? compiledPaperDollSpec.frames.length : 1);
    for (let fi = 0; fi < numFrames; fi++) {
      const thumb = document.createElement("div");
      thumb.className = "forge-frame-thumb" + (fi === paperDollFrameIndex ? " active" : "");
      thumb.title = `Scrub to Frame ${fi + 1}`;

      const tCanvas = document.createElement("canvas");
      tCanvas.width = 36;
      tCanvas.height = 36;
      const tCtx = tCanvas.getContext("2d");
      tCtx.imageSmoothingEnabled = false;

      const fRes = PixelDSLRenderer.renderRig(compiledPaperDollSpec, fi + 1);
      const off = document.createElement("canvas");
      off.width = fRes.width;
      off.height = fRes.height;
      const offCtx = off.getContext("2d");
      let imgData = offCtx.createImageData(fRes.width, fRes.height);
      imgData.data.set(fRes.buffer);
      if (paperDollActiveDirection === "left") {
        imgData = flipImageDataH(offCtx, imgData, false);
      }
      offCtx.putImageData(imgData, 0, 0);

      tCtx.drawImage(off, 0, 0, 36, 36);

      const numBadge = document.createElement("span");
      numBadge.className = "thumb-num";
      numBadge.textContent = fi + 1;

      thumb.appendChild(tCanvas);
      thumb.appendChild(numBadge);

      const fIdx = fi;
      thumb.addEventListener("click", () => {
        paperDollFrameIndex = fIdx;
        drawPaperDollFrame();
      });
      strip.appendChild(thumb);
    }
  }

  function drawPaperDollFrame() {
    if (!compiledPaperDollSpec) return;

    const numFrames = Math.max(1, compiledPaperDollSpec.frames ? compiledPaperDollSpec.frames.length : 1);
    paperDollFrameIndex = paperDollFrameIndex % numFrames;

    const lblIndicator = document.getElementById("lblPaperDollFrameIndicator");
    if (lblIndicator) {
      lblIndicator.textContent = `Frame ${paperDollFrameIndex + 1} / ${numFrames}`;
    }

    // Active thumb in strip
    const strip = document.getElementById("paperDollTimelineStrip");
    if (strip) {
      strip.querySelectorAll(".forge-frame-thumb").forEach((t, idx) => {
        t.classList.toggle("active", idx === paperDollFrameIndex);
      });
    }

    const showNormals = Boolean(document.getElementById("chkPaperDollNormals") && document.getElementById("chkPaperDollNormals").checked);
    const showBones = Boolean(document.getElementById("chkPaperDollBones") && document.getElementById("chkPaperDollBones").checked);

    // -------------------------------------------------------------
    // A. 4-WAY SYNCHRONIZED GRID VIEW
    // -------------------------------------------------------------
    if (paperDollActiveDirection === "4way" && compiled4WaySpecs) {
      const quadConfigs = [
        { id: "canvas4WayDown", spec: compiled4WaySpecs.down, flip: false },
        { id: "canvas4WayLeft", spec: compiled4WaySpecs.right, flip: true },
        { id: "canvas4WayRight", spec: compiled4WaySpecs.right, flip: false },
        { id: "canvas4WayUp", spec: compiled4WaySpecs.up, flip: false }
      ];

      quadConfigs.forEach(cfg => {
        const qCanvas = document.getElementById(cfg.id);
        if (!qCanvas) return;
        const qCtx = qCanvas.getContext("2d");
        qCtx.imageSmoothingEnabled = false;

        const rf = PixelDSLRenderer.renderRig(cfg.spec, paperDollFrameIndex + 1);
        const qw = rf.width, qh = rf.height;
        const scratch = getScratchBuffer("pd_4way_" + cfg.id, qw, qh);

        if (showNormals && rf.normalBuffer) {
          scratch.imgData.data.set(rf.normalBuffer);
          if (cfg.flip) flipImageDataInPlace(scratch.imgData, true);
        } else {
          scratch.imgData.data.set(rf.buffer);
          if (cfg.flip) flipImageDataInPlace(scratch.imgData, false);
        }
        scratch.ctx.putImageData(scratch.imgData, 0, 0);

        qCtx.clearRect(0, 0, qCanvas.width, qCanvas.height);
        qCtx.drawImage(scratch.canvas, 0, 0, qCanvas.width, qCanvas.height);
      });
      return;
    }

    // -------------------------------------------------------------
    // B. SINGLE DIRECTION VIEW
    // -------------------------------------------------------------
    const canvas = document.getElementById("paperDollCanvas");
    if (!canvas) return;

    const isLeft = paperDollActiveDirection === "left";
    const specToRender = isLeft ? (compiled4WaySpecs ? compiled4WaySpecs.right : compiledPaperDollSpec) : compiledPaperDollSpec;
    const renderRes = PixelDSLRenderer.renderRig(specToRender, paperDollFrameIndex + 1);
    const w = renderRes.width;
    const h = renderRes.height;

    const selZoom = document.getElementById("selPaperDollZoom");
    const scale = selZoom ? parseInt(selZoom.value, 10) || 8 : 8;

    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    const scratch = getScratchBuffer("pd_single", w, h);
    if (showNormals && renderRes.normalBuffer) {
      scratch.imgData.data.set(renderRes.normalBuffer);
      if (isLeft) flipImageDataInPlace(scratch.imgData, true);
    } else {
      scratch.imgData.data.set(renderRes.buffer);
      if (isLeft) flipImageDataInPlace(scratch.imgData, false);
    }
    scratch.ctx.putImageData(scratch.imgData, 0, 0);

    ctx.drawImage(scratch.canvas, 0, 0, canvas.width, canvas.height);

    // Draw skeletal rig bone overlay if requested
    if (showBones && compiledPaperDollSpec.rig && Array.isArray(compiledPaperDollSpec.rig.bones)) {
      const fDef = (compiledPaperDollSpec.frames && compiledPaperDollSpec.frames[paperDollFrameIndex]) || {};
      const pose = fDef.pose || {};
      const fk = PixelDSLRenderer.solveFkRig(compiledPaperDollSpec.rig.bones, pose);

      ctx.save();
      ctx.scale(scale, scale);

      for (const [bid, xf] of Object.entries(fk)) {
        let ax = xf.start[0];
        let ay = xf.start[1];
        let bx = xf.end[0];
        let by = xf.end[1];
        if (isLeft) {
          ax = w - 1 - ax;
          bx = w - 1 - bx;
        }
        const isEq = bid.startsWith("eq_");

        ctx.strokeStyle = isEq ? "rgba(234, 179, 8, 0.85)" : "rgba(99, 102, 241, 0.85)";
        ctx.lineWidth = 1 / scale;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();

        ctx.fillStyle = isEq ? "#facc15" : "#60a5fa";
        ctx.beginPath();
        ctx.arc(ax, ay, 1.2 / scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ec4899";
        ctx.beginPath();
        ctx.arc(bx, by, 0.9 / scale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function startPaperDollAnimLoop() {
    if (paperDollAnimTimer) clearInterval(paperDollAnimTimer);
    const selFps = document.getElementById("selPaperDollFps");
    const fps = selFps ? parseInt(selFps.value, 10) || 8 : 8;

    paperDollAnimTimer = setInterval(() => {
      const ws = document.getElementById("workspacePaperDoll");
      if (!ws || !ws.classList.contains("active")) return;
      if (!paperDollIsPlaying || !compiledPaperDollSpec) return;

      const numFrames = Math.max(1, compiledPaperDollSpec.frames ? compiledPaperDollSpec.frames.length : 1);
      if (numFrames > 1) {
        paperDollFrameIndex = (paperDollFrameIndex + 1) % numFrames;
        drawPaperDollFrame();
      }
    }, 1000 / fps);
  }

  function exportPaperDollPng() {
    if (!compiledPaperDollSpec) return;
    const isLeft = paperDollActiveDirection === "left";
    const res = PixelDSLRenderer.renderRig(compiledPaperDollSpec, paperDollFrameIndex + 1);
    const canvas = document.createElement("canvas");
    canvas.width = res.width;
    canvas.height = res.height;
    const ctx = canvas.getContext("2d");
    let imgData = ctx.createImageData(res.width, res.height);
    imgData.data.set(res.buffer);
    if (isLeft) imgData = flipImageDataH(ctx, imgData, false);
    ctx.putImageData(imgData, 0, 0);

    const a = document.createElement("a");
    a.download = `${compiledPaperDollSpec.name}_f${paperDollFrameIndex + 1}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
    showToast(`💾 Exported 1:1 PNG: ${a.download}`, "success");
  }

  function exportPaperDollNormal() {
    if (!compiledPaperDollSpec) return;
    const isLeft = paperDollActiveDirection === "left";
    const res = PixelDSLRenderer.renderRig(compiledPaperDollSpec, paperDollFrameIndex + 1);
    if (!res.normalBuffer) return;
    const canvas = document.createElement("canvas");
    canvas.width = res.width;
    canvas.height = res.height;
    const ctx = canvas.getContext("2d");
    let imgData = ctx.createImageData(res.width, res.height);
    imgData.data.set(res.normalBuffer);
    if (isLeft) imgData = flipImageDataH(ctx, imgData, true);
    ctx.putImageData(imgData, 0, 0);

    const a = document.createElement("a");
    a.download = `${compiledPaperDollSpec.name}_normal.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
    showToast(`💡 Exported Normal Map: ${a.download}`, "success");
  }

  function exportPaperDoll4WaySheet() {
    if (!window.PaperDollEngine) return;
    const PDE = window.PaperDollEngine;

    const directions = ["down", "left", "right", "up"];
    const actionDef = PDE.ACTIONS[paperDollActiveAction] || PDE.ACTIONS.walk;
    const numFrames = actionDef.frames || 8;

    const specs = {
      down: PDE.assembleSpec(paperDollActiveMannequin, paperDollEquippedSlots, paperDollActiveAction, {
        theme: paperDollActiveTheme, outline: "o", outlineWidth: 1, selOut: true, direction: "down", useIK: paperDollUseIK
      }),
      right: PDE.assembleSpec(paperDollActiveMannequin, paperDollEquippedSlots, paperDollActiveAction, {
        theme: paperDollActiveTheme, outline: "o", outlineWidth: 1, selOut: true, direction: "right", useIK: paperDollUseIK
      }),
      up: PDE.assembleSpec(paperDollActiveMannequin, paperDollEquippedSlots, paperDollActiveAction, {
        theme: paperDollActiveTheme, outline: "o", outlineWidth: 1, selOut: true, direction: "up", useIK: paperDollUseIK
      })
    };

    const w = specs.down.width;
    const h = specs.down.height;

    const sheetCanvas = document.createElement("canvas");
    sheetCanvas.width = w * numFrames;
    sheetCanvas.height = h * 4;
    const sCtx = sheetCanvas.getContext("2d");
    sCtx.imageSmoothingEnabled = false;

    const normCanvas = document.createElement("canvas");
    normCanvas.width = w * numFrames;
    normCanvas.height = h * 4;
    const nCtx = normCanvas.getContext("2d");
    nCtx.imageSmoothingEnabled = false;

    for (let rowIdx = 0; rowIdx < directions.length; rowIdx++) {
      const dir = directions[rowIdx];
      const isLeft = dir === "left";
      const specToUse = isLeft ? specs.right : specs[dir];

      for (let fi = 0; fi < numFrames; fi++) {
        const rf = PixelDSLRenderer.renderRig(specToUse, fi + 1);

        const fCanvas = document.createElement("canvas");
        fCanvas.width = w;
        fCanvas.height = h;
        const fCtx = fCanvas.getContext("2d");

        let imgData = fCtx.createImageData(w, h);
        imgData.data.set(rf.buffer);
        if (isLeft) imgData = flipImageDataH(fCtx, imgData, false);
        fCtx.putImageData(imgData, 0, 0);
        sCtx.drawImage(fCanvas, fi * w, rowIdx * h);

        if (rf.normalBuffer) {
          const fnCanvas = document.createElement("canvas");
          fnCanvas.width = w;
          fnCanvas.height = h;
          const fnCtx = fnCanvas.getContext("2d");

          let normData = fnCtx.createImageData(w, h);
          normData.data.set(rf.normalBuffer);
          if (isLeft) normData = flipImageDataH(fnCtx, normData, true);
          fnCtx.putImageData(normData, 0, 0);
          nCtx.drawImage(fnCanvas, fi * w, rowIdx * h);
        }
      }
    }

    const a = document.createElement("a");
    a.download = `paperdoll_${paperDollActiveMannequin}_${paperDollActiveAction}_4way_sheet.png`;
    a.href = sheetCanvas.toDataURL("image/png");
    a.click();

    const aNorm = document.createElement("a");
    aNorm.download = `paperdoll_${paperDollActiveMannequin}_${paperDollActiveAction}_4way_normal.png`;
    aNorm.href = normCanvas.toDataURL("image/png");
    aNorm.click();

    showToast(`🎮 Exported 4-Way Spritesheet & Normal Map (${sheetCanvas.width}×${sheetCanvas.height})!`, "success");
  }

  function exportPaperDollSheet() {
    if (!compiledPaperDollSpec) return;
    const numFrames = Math.max(1, compiledPaperDollSpec.frames ? compiledPaperDollSpec.frames.length : 1);
    const f1 = PixelDSLRenderer.renderRig(compiledPaperDollSpec, 1);
    const sheetCanvas = document.createElement("canvas");
    sheetCanvas.width = f1.width * numFrames;
    sheetCanvas.height = f1.height;
    const sCtx = sheetCanvas.getContext("2d");
    sCtx.imageSmoothingEnabled = false;

    for (let fi = 0; fi < numFrames; fi++) {
      const rf = PixelDSLRenderer.renderRig(compiledPaperDollSpec, fi + 1);
      const fCanvas = document.createElement("canvas");
      fCanvas.width = rf.width;
      fCanvas.height = rf.height;
      const fCtx = fCanvas.getContext("2d");
      const imgData = fCtx.createImageData(rf.width, rf.height);
      imgData.data.set(rf.buffer);
      fCtx.putImageData(imgData, 0, 0);

      sCtx.drawImage(fCanvas, fi * f1.width, 0);
    }

    const a = document.createElement("a");
    a.download = `${compiledPaperDollSpec.name}_sheet.png`;
    a.href = sheetCanvas.toDataURL("image/png");
    a.click();
    showToast(`🎞️ Exported Sprite Sheet: ${a.download} (${sheetCanvas.width}×${sheetCanvas.height})`, "success");
  }

  // ==========================================
  // Workspace 4: 4-Way Compass Showcase
  // ==========================================
  let compassHeading = "south";
  let compassFrameIndex = 0;
  let compassIsPlaying = true;
  let compassAnimTimer = null;

  function getCompassSpecs() {
    if (!window.PaperDollEngine) return null;
    const PDE = window.PaperDollEngine;
    const mannequin = paperDollActiveMannequin || "humanoid";
    const equipped = (paperDollEquippedSlots && Object.keys(paperDollEquippedSlots).length > 0)
      ? paperDollEquippedSlots
      : (PDE.LOADOUTS.paladin ? PDE.LOADOUTS.paladin.slots : {});
    const theme = paperDollActiveTheme || "steel";

    return {
      down: PDE.assembleSpec(mannequin, equipped, "walk", { theme, outline: "o", outlineWidth: 1, selOut: true, direction: "down", useIK: true }),
      up: PDE.assembleSpec(mannequin, equipped, "walk", { theme, outline: "o", outlineWidth: 1, selOut: true, direction: "up", useIK: true }),
      right: PDE.assembleSpec(mannequin, equipped, "walk", { theme, outline: "o", outlineWidth: 1, selOut: true, direction: "right", useIK: true })
    };
  }

  function initCompass() {
    const compassButtons = document.querySelectorAll(".compass-btn");
    const detailsBox = document.getElementById("compassDetailsBox");
    const pillDirName = document.getElementById("pillDirName");
    const pillZOrder = document.getElementById("pillZOrder");
    const btnToggleCompassPlay = document.getElementById("btnToggleCompassPlay");

    const descriptions = {
      north: "North (180° Back View): Automatic reverse Z-sort! Backplate, cape, and quiver in foreground (Z=2). Facial features occluded.",
      south: "South (0° Front View): Standard frontal pose. Eyes, buckles, chest insignia, and front shield in foreground (Z=2).",
      east: "East (90° Side Profile): Profile silhouette, forward leg stride, leading shield arm in Z=2, rear arm in Z=0.",
      west: "West (270° Side Profile): Symmetrically mirrored East profile. Preserves silhouette consistency with zero redraw.",
      iso: "Isometric 2.5D (45° Projection): Axonometric foreshortening matrix for tactical turn-based RPGs and ARPG engines."
    };

    const zOrderLabels = {
      south: "Z-Order: Standard (Front Z=2, Rear Z=0)",
      north: "Z-Order: Inverted (Cape & Backplate Z=2, Face Occluded)",
      east: "Z-Order: Profile (Near Arm Z=2, Stride Walk)",
      west: "Z-Order: Mirrored Profile (Symmetric East)",
      iso: "Z-Order: 2.5D Axonometric Projection"
    };

    compassButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        compassHeading = btn.dataset.dir;
        compassButtons.forEach(b => b.classList.toggle("active", b === btn));
        if (pillDirName) {
          pillDirName.textContent = btn.textContent.split("\n")[0];
        }
        if (pillZOrder) {
          pillZOrder.textContent = zOrderLabels[compassHeading] || "Z-Order: Standard";
        }
        if (detailsBox) {
          detailsBox.innerHTML = `<strong>${btn.textContent.split("\n")[0]}</strong><p>${descriptions[compassHeading] || ""}</p>`;
        }
        renderCompassDemo();
      });
    });

    if (btnToggleCompassPlay) {
      btnToggleCompassPlay.addEventListener("click", () => {
        compassIsPlaying = !compassIsPlaying;
        btnToggleCompassPlay.textContent = compassIsPlaying ? "⏸️ Pause" : "▶️ Play";
      });
    }

    startCompassAnimLoop();
  }

  function startCompassAnimLoop() {
    if (compassAnimTimer) clearInterval(compassAnimTimer);
    compassAnimTimer = setInterval(() => {
      const ws = document.getElementById("workspaceCompass");
      if (!ws || !ws.classList.contains("active")) return;
      if (!compassIsPlaying) return;
      compassFrameIndex = (compassFrameIndex + 1) % 8;
      renderCompassDemo();
    }, 125);
  }

  function renderCompassDemo() {
    const canvas = document.getElementById("compassCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    let res = null;
    let flipH = false;
    let isIso = false;

    const specs = getCompassSpecs();
    if (specs) {
      let targetSpec = specs.down;
      if (compassHeading === "north") {
        targetSpec = specs.up;
      } else if (compassHeading === "east") {
        targetSpec = specs.right;
      } else if (compassHeading === "west") {
        targetSpec = specs.right;
        flipH = true;
      } else if (compassHeading === "iso") {
        targetSpec = specs.down;
        isIso = true;
      }

      const numFrames = Math.max(1, targetSpec.frames ? targetSpec.frames.length : 1);
      const fi = (compassFrameIndex % numFrames) + 1;
      res = PixelDSLRenderer.renderRig(targetSpec, fi);
    } else if (window.ArchetypeCompiler) {
      const baseArch = window.ArchetypeCompiler.compile({
        archetypeId: "humanoid",
        width: 32,
        height: 36,
        action: "walk",
        frames: 4,
        headScale: 1.0,
        paletteTheme: "cyberpunk"
      });
      res = PixelDSLRenderer.render(baseArch, compassFrameIndex % 4);
      if (compassHeading === "west") flipH = true;
      if (compassHeading === "iso") isIso = true;
    }

    if (!res) return;

    const scale = 5;
    canvas.width = 256;
    canvas.height = 256;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scratch = getScratchBuffer("compass_offscreen", res.width, res.height);
    scratch.imgData.data.set(res.buffer);
    if (flipH) flipImageDataInPlace(scratch.imgData, false);
    scratch.ctx.putImageData(scratch.imgData, 0, 0);

    ctx.save();
    const drawW = res.width * scale;
    const drawH = res.height * scale;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    if (isIso) {
      ctx.translate(cx, cy + 12);
      ctx.transform(1, 0.22, -0.22, 0.88, 0, 0);
      ctx.drawImage(scratch.canvas, -drawW / 2, -drawH / 2, drawW, drawH);
    } else {
      ctx.drawImage(scratch.canvas, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
    }
    ctx.restore();
  }

  // ==========================================
  // Workspace 5: Game Engine Exporter
  // ==========================================
  function initExporter() {
    const btnCopyGodotScript = document.getElementById("btnCopyGodotScript");
    if (btnCopyGodotScript) {
      btnCopyGodotScript.addEventListener("click", () => {
        const script = `# Godot 4 AnimatedSprite2D Setup Script
extends AnimatedSprite2D

func _ready():
    var mat = CanvasItemMaterial.new()
    mat.light_mode = CanvasItemMaterial.LIGHT_MODE_NORMAL
    self.material = mat
    self.play("walk_down")`;
        navigator.clipboard.writeText(script);
        showToast("🤖 Copied Godot 4 Setup Script to clipboard!", "copy");
      });
    }

    const btnExportGodotTres = document.getElementById("btnExportGodotTres");
    if (btnExportGodotTres) {
      btnExportGodotTres.addEventListener("click", () => {
        const mannequin = paperDollActiveMannequin || "humanoid";
        const action = paperDollActiveAction || "walk";
        const sheetName = `paperdoll_${mannequin}_${action}_4way_sheet.png`;
        const tresName = `paperdoll_${mannequin}_${action}_4way.tres`;
        const w = 48, h = 48, numFrames = 8, fps = 8.0;

        const directions = [
          { dir: "down", row: 0, anim: `${action}_down` },
          { dir: "left", row: 1, anim: `${action}_left` },
          { dir: "right", row: 2, anim: `${action}_right` },
          { dir: "up", row: 3, anim: `${action}_up` }
        ];

        let subResources = "";
        let animBlocks = [];

        directions.forEach(d => {
          let frameRefs = [];
          for (let fi = 0; fi < numFrames; fi++) {
            const subId = `AtlasTexture_${d.dir}_${fi}`;
            subResources += `[sub_resource type="AtlasTexture" id="${subId}"]\n`;
            subResources += `atlas = ExtResource("1_sheet")\n`;
            subResources += `region = Rect2(${fi * w}, ${d.row * h}, ${w}, ${h})\n\n`;

            frameRefs.push(`{\n"duration": 1.0,\n"texture": SubResource("${subId}")\n}`);
          }
          animBlocks.push(`{\n"frames": [${frameRefs.join(", ")}],\n"loop": true,\n"name": &"${d.anim}",\n"speed": ${fps.toFixed(1)}\n}`);
        });

        const totalSteps = 2 + directions.length * numFrames;
        const tresContent = `[gd_resource type="SpriteFrames" load_steps=${totalSteps} format=3 uid="uid://pixeldsl_${mannequin}_${action}"]

[ext_resource type="Texture2D" path="res://${sheetName}" id="1_sheet"]

${subResources}[resource]
animations = [${animBlocks.join(", ")}]
`;
        downloadBlob(tresName, tresContent, "text/plain");
        showToast(`🤖 Exported Godot 4 Resource: ${tresName}!`, "success");
      });
    }

    const btnCopyUnityScript = document.getElementById("btnCopyUnityScript");
    if (btnCopyUnityScript) {
      btnCopyUnityScript.addEventListener("click", () => {
        const script = `// Unity 2D URP Lit Setup
using UnityEngine;
public class PixelDSLSprite : MonoBehaviour {
    void Start() {
        var sr = GetComponent<SpriteRenderer>();
        var mat = new Material(Shader.Find("Universal Render Pipeline/2D/Sprite-Lit-Default"));
        sr.material = mat;
    }
}`;
        navigator.clipboard.writeText(script);
        showToast("🎮 Copied Unity URP Script to clipboard!", "copy");
      });
    }

    const btnExportUnityJson = document.getElementById("btnExportUnityJson");
    if (btnExportUnityJson) {
      btnExportUnityJson.addEventListener("click", () => {
        const mannequin = paperDollActiveMannequin || "humanoid";
        const action = paperDollActiveAction || "walk";
        const sheetName = `paperdoll_${mannequin}_${action}_4way_sheet.png`;
        const normName = `paperdoll_${mannequin}_${action}_4way_normal.png`;
        const jsonName = `paperdoll_${mannequin}_${action}_4way_atlas.json`;
        const w = 48, h = 48, numFrames = 8;
        const directions = ["down", "left", "right", "up"];

        const framesObj = {};
        directions.forEach((dir, rowIdx) => {
          for (let fi = 0; fi < numFrames; fi++) {
            const frameKey = `${mannequin}_${action}_${dir}_f${fi + 1}`;
            framesObj[frameKey] = {
              frame: { x: fi * w, y: rowIdx * h, w: w, h: h },
              rotated: false,
              trimmed: false,
              spriteSourceSize: { x: 0, y: 0, w: w, h: h },
              sourceSize: { w: w, h: h },
              pivot: { x: 0.5, y: 0.5 }
            };
          }
        });

        const unityData = {
          frames: framesObj,
          meta: {
            app: "PixelDSL Studio",
            version: "3.2",
            image: sheetName,
            normalMap: normName,
            format: "RGBA8888",
            size: { w: w * numFrames, h: h * 4 },
            scale: "1",
            smartupdate: "$TexturePacker:SmartUpdate:pixeldsl_studio$"
          }
        };

        downloadBlob(jsonName, JSON.stringify(unityData, null, 2), "application/json");
        showToast(`🎮 Exported Unity 2D SpriteAtlas: ${jsonName}!`, "success");
      });
    }

    const btnExportDemoWebp = document.getElementById("btnExportDemoWebp");
    if (btnExportDemoWebp) {
      btnExportDemoWebp.addEventListener("click", () => {
        showToast("⚡ Sample WebP Export sequence ready!", "success");
      });
    }

    const btnExportAssetBundle = document.getElementById("btnExportAssetBundle");
    if (btnExportAssetBundle) {
      btnExportAssetBundle.addEventListener("click", () => {
        const mannequin = paperDollActiveMannequin || "humanoid";
        const action = paperDollActiveAction || "walk";
        const bundleName = `pixeldsl_${mannequin}_engine_bundle.json`;

        const bundle = {
          schema: "PixelDSL-Engine-Asset-Bundle-v3.2",
          generator: "PixelDSL Studio Autonomous Suite",
          license: "CC0-1.0 Universal (Public Domain)",
          metadata: {
            mannequin: mannequin,
            action: action,
            theme: paperDollActiveTheme || "steel",
            ik_ground_contact: paperDollUseIK,
            dimensions: { frameWidth: 48, frameHeight: 48, framesCount: 8, rows: 4 },
            directions: ["down", "left", "right", "up"],
            files: {
              diffuse_sheet: `paperdoll_${mannequin}_${action}_4way_sheet.png`,
              normal_map_sheet: `paperdoll_${mannequin}_${action}_4way_normal.png`,
              godot4_resource: `paperdoll_${mannequin}_${action}_4way.tres`,
              unity_atlas: `paperdoll_${mannequin}_${action}_4way_atlas.json`
            }
          },
          equipment: paperDollEquippedSlots || {},
          active_spec: compiledPaperDollSpec || null
        };

        downloadBlob(bundleName, JSON.stringify(bundle, null, 2), "application/json");
        showToast(`📦 Exported Engine Asset Bundle: ${bundleName}!`, "success");
      });
    }
  }

  // ==========================================
  // Workspace 6: Three.js 3D Primitive Studio
  // ==========================================
  let studio3D = null;
  let anim3DPlaying = true;
  let anim3DFps = 8;
  let anim3DLastTime = 0;
  let anim3DTime = 0;
  let anim3DCurrentFrame = 0;
  let isOrbitDragging = false;
  let orbitStartX = 0;
  let orbitStartY = 0;
  let orbitStartYaw = 0;
  let orbitStartPitch = 0;
  let anim3DLoopId = null;

  function init3DStudio() {
    if (typeof Pixel3DStudio === "undefined" || typeof THREE === "undefined") {
      console.warn("[3D Studio] Pixel3DStudio or THREE is not available.");
      return;
    }

    const orbitCanvas = document.getElementById("threeOrbitCanvas");
    const pixelCanvas = document.getElementById("threePixelCanvas");
    if (!orbitCanvas || !pixelCanvas) return;

    studio3D = new Pixel3DStudio({
      width: 32,
      height: 32,
      model: "humanoid",
      action: "walk",
      yaw: 25,
      pitch: 18,
      celSteps: 3,
      useOutlines: true,
      outlineThickness: 0.045
    });

    studio3D.initOrbitView(orbitCanvas);

    // Orbit Drag Controls on orbitCanvas
    orbitCanvas.addEventListener("pointerdown", (e) => {
      isOrbitDragging = true;
      orbitStartX = e.clientX;
      orbitStartY = e.clientY;
      orbitStartYaw = studio3D.yaw;
      orbitStartPitch = studio3D.pitch;
      orbitCanvas.setPointerCapture(e.pointerId);
    });

    orbitCanvas.addEventListener("pointermove", (e) => {
      if (!isOrbitDragging) return;
      const dx = e.clientX - orbitStartX;
      const dy = e.clientY - orbitStartY;
      studio3D.yaw = Math.round((orbitStartYaw + dx * 0.55 + 360) % 360);
      studio3D.pitch = Math.round(Math.max(-60, Math.min(85, orbitStartPitch - dy * 0.55)));

      const sliderYaw = document.getElementById("sliderThreeYaw");
      const lblYaw = document.getElementById("lblThreeYaw");
      if (sliderYaw) sliderYaw.value = studio3D.yaw;
      if (lblYaw) lblYaw.textContent = `${studio3D.yaw}°`;

      const sliderPitch = document.getElementById("sliderThreePitch");
      const lblPitch = document.getElementById("lblThreePitch");
      if (sliderPitch) sliderPitch.value = studio3D.pitch;
      if (lblPitch) lblPitch.textContent = `${studio3D.pitch}°`;
    });

    const stopDrag = (e) => {
      if (isOrbitDragging) {
        isOrbitDragging = false;
        try { orbitCanvas.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    };
    orbitCanvas.addEventListener("pointerup", stopDrag);
    orbitCanvas.addEventListener("pointercancel", stopDrag);

    orbitCanvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      studio3D.cameraDistance = Math.max(3.0, Math.min(12.0, studio3D.cameraDistance + e.deltaY * 0.005));
      const sliderDist = document.getElementById("sliderThreeDist");
      const lblDist = document.getElementById("lblThreeDist");
      if (sliderDist) sliderDist.value = studio3D.cameraDistance.toFixed(1);
      if (lblDist) lblDist.textContent = studio3D.cameraDistance.toFixed(1);
    }, { passive: false });

    // Window resize
    window.addEventListener("resize", () => {
      if (studio3D) studio3D.resizeOrbitView();
    });

    // Model Selector
    const modelBtns = document.querySelectorAll("#threeModelBtns [data-three-model]");
    modelBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        modelBtns.forEach(b => b.classList.toggle("active", b === btn));
        const model = btn.dataset.threeModel;
        studio3D.buildModel(model);

        // Show/hide equipment section (only humanoid & chibi have full equipment)
        const equipGroup = document.getElementById("groupThreeEquipment");
        if (equipGroup) {
          equipGroup.style.display = (model === "humanoid" || model === "chibi") ? "block" : "none";
        }
        // Show/hide open action pill (only for chest)
        const pillOpen = document.getElementById("pillActionOpen");
        if (pillOpen) {
          pillOpen.style.display = (model === "chest") ? "inline-flex" : "none";
        }
      });
    });

    // Camera Projection
    const camBtns = document.querySelectorAll("#threeCamProjBtns [data-three-cam]");
    camBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        camBtns.forEach(b => b.classList.toggle("active", b === btn));
        studio3D.cameraMode = btn.dataset.threeCam;
        const fovGroup = document.getElementById("groupThreeFov");
        if (fovGroup) {
          fovGroup.style.display = studio3D.cameraMode === "perspective" ? "block" : "none";
        }
      });
    });

    // Quick Presets
    const presetAngles = {
      iso: { yaw: 45, pitch: 30 },
      front: { yaw: 0, pitch: 0 },
      side_r: { yaw: 90, pitch: 0 },
      back: { yaw: 180, pitch: 0 },
      side_l: { yaw: 270, pitch: 0 },
      top: { yaw: 0, pitch: 85 }
    };
    const presetBtns = document.querySelectorAll(".three-preset-grid [data-preset-angle]");
    presetBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        presetBtns.forEach(b => b.classList.toggle("active", b === btn));
        const p = presetAngles[btn.dataset.presetAngle];
        if (p) {
          studio3D.yaw = p.yaw;
          studio3D.pitch = p.pitch;
          const sY = document.getElementById("sliderThreeYaw");
          const lY = document.getElementById("lblThreeYaw");
          if (sY) sY.value = p.yaw;
          if (lY) lY.textContent = `${p.yaw}°`;
          const sP = document.getElementById("sliderThreePitch");
          const lP = document.getElementById("lblThreePitch");
          if (sP) sP.value = p.pitch;
          if (lP) lP.textContent = `${p.pitch}°`;
        }
      });
    });

    // Sliders
    const setupSlider = (sliderId, labelId, suffix, callback) => {
      const slider = document.getElementById(sliderId);
      const label = document.getElementById(labelId);
      if (slider) {
        slider.addEventListener("input", () => {
          const val = parseFloat(slider.value);
          if (label) label.textContent = `${slider.value}${suffix}`;
          callback(val);
        });
      }
    };

    setupSlider("sliderThreeYaw", "lblThreeYaw", "°", (v) => { studio3D.yaw = v; });
    setupSlider("sliderThreePitch", "lblThreePitch", "°", (v) => { studio3D.pitch = v; });
    setupSlider("sliderThreeDist", "lblThreeDist", "", (v) => { studio3D.cameraDistance = v; });
    setupSlider("sliderThreeFov", "lblThreeFov", "°", (v) => { studio3D.fov = v; });
    setupSlider("sliderThreeOutlineThick", "lblThreeOutlineThick", "", (v) => {
      studio3D.outlineThickness = v;
      studio3D.buildModel(studio3D.activeModel);
    });
    setupSlider("sliderThreeSunIntensity", "lblThreeSunIntensity", "", (v) => {
      if (studio3D.dirLight) studio3D.dirLight.intensity = v;
    });
    setupSlider("sliderThreeAmbIntensity", "lblThreeAmbIntensity", "", (v) => {
      if (studio3D.ambLight) studio3D.ambLight.intensity = v;
    });
    setupSlider("sliderThreeRimIntensity", "lblThreeRimIntensity", "", (v) => {
      if (studio3D.rimLight) studio3D.rimLight.intensity = v;
    });

    // Equipment controls
    const selWeapon = document.getElementById("selThreeWeapon");
    if (selWeapon) {
      selWeapon.addEventListener("change", () => {
        studio3D.equipment.weapon = selWeapon.value;
        studio3D.buildModel(studio3D.activeModel);
      });
    }

    const chkShield = document.getElementById("chkThreeShield");
    if (chkShield) {
      chkShield.addEventListener("change", () => {
        studio3D.equipment.shield = chkShield.checked;
        studio3D.buildModel(studio3D.activeModel);
      });
    }

    const chkHelmet = document.getElementById("chkThreeHelmet");
    if (chkHelmet) {
      chkHelmet.addEventListener("change", () => {
        studio3D.equipment.helmet = chkHelmet.checked;
        studio3D.buildModel(studio3D.activeModel);
      });
    }

    // Resolution pills
    const resBtns = document.querySelectorAll("#threeResBtns [data-three-res]");
    resBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        resBtns.forEach(b => b.classList.toggle("active", b === btn));
        const res = parseInt(btn.dataset.threeRes, 10);
        studio3D.width = res;
        studio3D.height = res;
        const badge = document.getElementById("lblThreeResBadge");
        if (badge) badge.textContent = `${res}×${res} px`;
      });
    });

    // Cel steps
    const celBtns = document.querySelectorAll("#threeCelBtns [data-three-cel]");
    celBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        celBtns.forEach(b => b.classList.toggle("active", b === btn));
        studio3D.celSteps = parseInt(btn.dataset.threeCel, 10);
      });
    });

    // Outlines
    const chkOutlines = document.getElementById("chkThreeOutlines");
    if (chkOutlines) {
      chkOutlines.addEventListener("change", () => {
        studio3D.useOutlines = chkOutlines.checked;
        studio3D.buildModel(studio3D.activeModel);
      });
    }

    const selOutlineColor = document.getElementById("selThreeOutlineColor");
    if (selOutlineColor) {
      selOutlineColor.addEventListener("change", () => {
        studio3D.outlineColor = parseInt(selOutlineColor.value, 16);
        studio3D.buildModel(studio3D.activeModel);
      });
    }

    // Palette snapping
    const selPalette = document.getElementById("selThreePalette");
    if (selPalette) {
      selPalette.addEventListener("change", () => {
        studio3D.snapPalette = selPalette.value;
      });
    }

    // Action pills
    const actionPills = document.querySelectorAll("#threeActionPills [data-three-action]");
    actionPills.forEach(pill => {
      pill.addEventListener("click", () => {
        actionPills.forEach(p => p.classList.toggle("active", p === pill));
        studio3D.activeAction = pill.dataset.threeAction;
      });
    });

    // Playback
    const btnPlay = document.getElementById("btnThreePlayAnim");
    if (btnPlay) {
      btnPlay.addEventListener("click", () => {
        anim3DPlaying = !anim3DPlaying;
        btnPlay.textContent = anim3DPlaying ? "⏸ Pause" : "▶ Play";
      });
    }

    const selFps = document.getElementById("selThreeFps");
    if (selFps) {
      selFps.addEventListener("change", () => {
        anim3DFps = parseInt(selFps.value, 10);
      });
    }

    const selZoom = document.getElementById("selThreeZoom");
    if (selZoom) {
      selZoom.addEventListener("change", () => {
        const zoom = parseInt(selZoom.value, 10);
        const sz = Math.min(512, Math.max(128, studio3D.width * zoom));
        pixelCanvas.style.width = `${sz}px`;
        pixelCanvas.style.height = `${sz}px`;
      });
    }

    // Action Buttons
    // 1. Bake 3D to Canvas Studio
    const btnBake = document.getElementById("btnThreeBakeStudio");
    if (btnBake) {
      btnBake.addEventListener("click", () => {
        const numFrames = studio3D.activeAction === "t_pose" ? 1 : 6;
        const spec = studio3D.exportToPixelDSLSpec(numFrames);
        if (spec) {
          currentSpec = spec;
          currentFrame = 0;
          pickDefaultActiveSymbol();
          syncEditorFromSpec();
          syncInspectorFromSpec();
          renderAll();

          // Switch to Studio workspace
          const studioTab = document.querySelector('.workspace-tab[data-workspace="studio"]');
          if (studioTab) studioTab.click();
          showToast(`🔥 Baked 3D ${studio3D.activeModel} into Canvas Studio!`, "success");
        }
      });
    }

    // 2. Export 1:1 PNG
    const btnPng = document.getElementById("btnThreeExportPng");
    if (btnPng) {
      btnPng.addEventListener("click", () => {
        const pixelRes = studio3D.renderToPixelBuffer();
        if (!pixelRes) return;
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = pixelRes.width;
        tempCanvas.height = pixelRes.height;
        const ctx = tempCanvas.getContext("2d");
        const imgData = ctx.createImageData(pixelRes.width, pixelRes.height);
        imgData.data.set(pixelRes.buffer);
        ctx.putImageData(imgData, 0, 0);

        downloadCanvasPng(tempCanvas, `3d_${studio3D.activeModel}_${studio3D.activeAction}_${pixelRes.width}x${pixelRes.height}.png`);
        showToast("💾 Exported 1:1 Pixel PNG!", "success");
      });
    }

    // 3. Export Sprite Sheet
    const btnSheet = document.getElementById("btnThreeExportSheet");
    if (btnSheet) {
      btnSheet.addEventListener("click", () => {
        const numFrames = 6;
        const w = studio3D.width;
        const h = studio3D.height;
        const sheetCanvas = document.createElement("canvas");
        sheetCanvas.width = w * numFrames;
        sheetCanvas.height = h;
        const ctx = sheetCanvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = w;
        tempCanvas.height = h;
        const tempCtx = tempCanvas.getContext("2d");

        const curT = studio3D.frameTime;
        for (let f = 0; f < numFrames; f++) {
          studio3D.updatePose(f / numFrames, studio3D.activeAction);
          const pixelRes = studio3D.renderToPixelBuffer(w, h);
          const imgData = tempCtx.createImageData(w, h);
          imgData.data.set(pixelRes.buffer);
          tempCtx.putImageData(imgData, 0, 0);
          ctx.drawImage(tempCanvas, f * w, 0);
        }
        studio3D.updatePose(curT, studio3D.activeAction);

        downloadCanvasPng(sheetCanvas, `3d_${studio3D.activeModel}_${studio3D.activeAction}_sheet_${w * numFrames}x${h}.png`);
        showToast("🎞️ Exported Animated Sprite Sheet!", "success");
      });
    }

    // 4. Export 3D Normal Map
    const btnNormal = document.getElementById("btnThreeExportNormal");
    if (btnNormal) {
      btnNormal.addEventListener("click", () => {
        const normRes = studio3D.renderNormalMapToPixelBuffer();
        if (!normRes) return;
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = normRes.width;
        tempCanvas.height = normRes.height;
        const ctx = tempCanvas.getContext("2d");
        const imgData = ctx.createImageData(normRes.width, normRes.height);
        imgData.data.set(normRes.buffer);
        ctx.putImageData(imgData, 0, 0);

        downloadCanvasPng(tempCanvas, `3d_${studio3D.activeModel}_${normRes.width}x${normRes.height}_normal.png`);
        showToast("💡 Exported 3D Tangent Normal Map!", "success");
      });
    }

    // 5. Export 4-Way RPG Spritesheet
    const btn4Way = document.getElementById("btnThreeExport4Way");
    if (btn4Way) {
      btn4Way.addEventListener("click", () => {
        const sheetCanvas = studio3D.generate4WaySheet(studio3D.activeAction, 6);
        downloadCanvasPng(sheetCanvas, `3d_${studio3D.activeModel}_${studio3D.activeAction}_4way_${sheetCanvas.width}x${sheetCanvas.height}.png`);
        showToast("🎮 Exported 4-Way RPG Directional Spritesheet!", "success");
      });
    }

    // 6. Copy JSON Spec
    const btnCopyJson = document.getElementById("btnThreeCopyJson");
    if (btnCopyJson) {
      btnCopyJson.addEventListener("click", () => {
        const spec = studio3D.exportToPixelDSLSpec(1);
        if (spec) {
          navigator.clipboard.writeText(JSON.stringify(spec, null, 2)).then(() => {
            showToast("📋 Copied 3D PixelDSL JSON to clipboard!", "success");
          });
        }
      });
    }

    start3DStudioLoop();
  }

  function start3DStudioLoop() {
    if (anim3DLoopId) cancelAnimationFrame(anim3DLoopId);

    function tick(now) {
      anim3DLoopId = requestAnimationFrame(tick);
      if (!studio3D) return;

      const ws3D = document.getElementById("workspaceThree3D");
      if (!ws3D || !ws3D.classList.contains("active")) {
        return;
      }

      if (!anim3DLastTime) anim3DLastTime = now;
      const dt = (now - anim3DLastTime) / 1000;
      anim3DLastTime = now;

      // Turntable Auto-spin
      const chkTurntable = document.getElementById("chkThreeTurntable");
      if (chkTurntable && chkTurntable.checked) {
        studio3D.yaw = (studio3D.yaw + dt * 35) % 360;
        const sY = document.getElementById("sliderThreeYaw");
        const lY = document.getElementById("lblThreeYaw");
        if (sY) sY.value = Math.round(studio3D.yaw);
        if (lY) lY.textContent = `${Math.round(studio3D.yaw)}°`;
      }

      // Animation playback
      if (anim3DPlaying && studio3D.activeAction !== "t_pose") {
        anim3DTime += dt;
        studio3D.frameTime = anim3DTime;
        studio3D.updatePose(anim3DTime, studio3D.activeAction);

        const totalFrames = 8;
        anim3DCurrentFrame = Math.floor((anim3DTime * anim3DFps) % totalFrames);
        const lblFrame = document.getElementById("lblThreeFrameIndicator");
        if (lblFrame) lblFrame.textContent = `Frame ${anim3DCurrentFrame + 1} / ${totalFrames}`;
      } else if (studio3D.activeAction === "t_pose") {
        studio3D.updatePose(0, "t_pose");
        const lblFrame = document.getElementById("lblThreeFrameIndicator");
        if (lblFrame) lblFrame.textContent = `T-Pose`;
      }

      // Render 3D orbit viewport
      studio3D.renderOrbitView();

      // Render pixel-art preview
      const pixelCanvas = document.getElementById("threePixelCanvas");
      const chkShowNormals = document.getElementById("chkThreeShowNormals");
      if (chkShowNormals && chkShowNormals.checked) {
        const normRes = studio3D.renderNormalMapToPixelBuffer();
        if (normRes) studio3D.drawToCanvas(pixelCanvas, normRes);
      } else {
        const pixelRes = studio3D.renderToPixelBuffer();
        if (pixelRes) studio3D.drawToCanvas(pixelCanvas, pixelRes);
      }
    }

    anim3DLoopId = requestAnimationFrame(tick);
  }

  // Boot
  initPresets();
  pickDefaultActiveSymbol();
  syncEditorFromSpec();
  syncInspectorFromSpec();
  renderAll();
  initWorkspaces();
  initArtZone();
  initArchetypeForge();
  initPaperDoll();
  initCompass();
  initExporter();
  init3DStudio();
})();
