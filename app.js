/* Site Inspection v3.0 — Project (Estate) -> Multiple Structural Elements -> HD Appendix X Report */
(function () {
  "use strict";

  var APP_DB = "site-inspection-v3";
  var APP_VER = 1;
  var LANG_KEY = "site-inspection-v3-lang";
  var BASEMAP_KEY = "site-inspection-v3-basemap";
  var LAYOUT_KEY = "site-inspection-v3-layout";
  var TZ = "Asia/Hong_Kong";
  var MAX_EDGE = 2048;
  var THUMB_EDGE = 480;
  var JPEG_Q = 0.82;

  var CHECKLIST_SCHEMA = [
    {
      sectionEn: "Overall Conditions",
      sectionZh: "1. 整體結構狀況（Overall Conditions）",
      items: [
        { code: "1.1", en: "Overall structural condition", zh: "整體結構狀況" },
        { code: "1.2", en: "Any painting detached", zh: "油漆剝落" }
      ]
    },
    {
      sectionEn: "Steel Conditions",
      sectionZh: "2. 鋼結構狀況（Steel Conditions）",
      items: [
        { code: "2.1", en: "Steel members condition (Any deflection, distortion, differential settlement)", zh: "鋼構件狀況（撓度、變形、不均勻沉降）" },
        { code: "2.2", en: "Rusting condition on members", zh: "鋼構件生鏽情況" },
        { code: "2.3", en: "Rusting condition on supports (Bolts, nuts, plates)", zh: "支座生鏽情況（螺栓、螺母、鋼板）" },
        { code: "2.4", en: "Welding condition", zh: "焊縫狀況" },
        { code: "2.5", en: "Purlins, Channel Condition", zh: "檁條及槽鋼狀況" },
        { code: "2.6", en: "Cladding Condition (Any soil, debris or planting detached)", zh: "飾面／覆蓋層狀況（泥土、雜物或植物）" }
      ]
    },
    {
      sectionEn: "Concrete Conditions",
      sectionZh: "3. 混凝土結構狀況（Concrete Conditions）",
      items: [
        { code: "3.1", en: "Any crack on structural elements", zh: "結構構件裂縫" },
        { code: "3.2", en: "Any spalling on structural elements", zh: "結構構件剝落" },
        { code: "3.3", en: "Any settlement on structural elements", zh: "結構構件沉降" }
      ]
    },
    {
      sectionEn: "Miscellaneous",
      sectionZh: "4. 其他項目（Miscellaneous）",
      items: [
        { code: "4.1", en: "Retaining Wall condition (Any seepage, crack)", zh: "護土牆狀況（滲水、裂縫）" },
        { code: "4.2", en: "Shelter tie post raking mounted on building wall condition", zh: "簷篷／遮蔽處斜撐固定於外牆狀況" },
        { code: "4.3", en: "Others (if any)", zh: "其他項目（如有請填寫）", hasCustomText: true }
      ]
    }
  ];

  var ALL_ITEMS = [];
  CHECKLIST_SCHEMA.forEach(function (sec) { sec.items.forEach(function (it) { ALL_ITEMS.push(it); }); });
  var RATINGS = ["G", "F", "S", "NA"];

  var STEEL_CODES = ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6"];
  var SMART_NA_PRESETS = {
    "Covered Walkway": ["4.1"],
    "Covered Walkway Shelter": ["4.1"],
    "Staircase": STEEL_CODES.concat(["4.1", "4.2"]),
    "Protective Barriers / Railing Parapets": STEEL_CODES.concat(["4.1", "4.2"]),
    "Trellis / Pergola": ["4.1"],
    "Canopy": ["4.1"],
    "Pavilion / Gazebo": ["4.1"],
    "Footbridge": ["4.1"],
    "Freestanding Lift Tower": ["4.1"],
    "Noise / Acoustic Barrier": ["4.1", "4.2"],
    "Boundary / Perimeter Wall & Fencing": ["4.1", "4.2"],
    "Signage Structure / Entrance Portal": ["4.1", "4.2"],
    "Hanging Structure": ["4.1"],
    "Retaining Wall": STEEL_CODES.concat(["4.2"]),
    "Planter": STEEL_CODES.concat(["4.1", "4.2"]),
    "Parapet Wall / Railing Parapet": STEEL_CODES.concat(["4.1", "4.2"]),
    "Screen Wall / Basement Wall": STEEL_CODES.concat(["4.1", "4.2"]),
    "External Staircase": STEEL_CODES.concat(["4.1", "4.2"]),
    "Ramp / BFA Ramp": STEEL_CODES.concat(["4.1", "4.2"]),
    "Paving / Estate Road / EVA": STEEL_CODES.concat(["4.1", "4.2"]),
    "Man-made Slope": STEEL_CODES.concat(["4.1", "4.2"]),
    "Surface Drainage Channel": STEEL_CODES.concat(["4.1", "4.2"]),
    "Underground Drain / Manhole / Catchpit": STEEL_CODES.concat(["4.1", "4.2"]),
    "Suspended Manhole": STEEL_CODES.concat(["4.1", "4.2"]),
    "Refuse Collection Point (RCP) / Bin Bay": STEEL_CODES.concat(["4.1", "4.2"]),
    "Sports / Play Facility": STEEL_CODES.concat(["4.1", "4.2"]),
    "Street Furniture / Utility Plinth": STEEL_CODES.concat(["4.1", "4.2"]),
    "Columns / Beams / Slabs": STEEL_CODES.concat(["4.1", "4.2"]),
    "Cantilevered Projecting Structure": STEEL_CODES.concat(["4.1", "4.2"]),
    "Transfer Structure": STEEL_CODES.concat(["4.1", "4.2"]),
    "Exposed Pile Cap": STEEL_CODES.concat(["4.1", "4.2"])
  };

  var I18N = {
    zh: {
      htmlLang: "zh-HK",
      title: "地盤巡查",
      tagline: "屋邨專案 → 多項 Structural Elements → Appendix X 巡查報告",
      langBtn: "EN",
      tabProjects: "屋邨專案",
      tabProjectDetail: "構建物列表",
      tabElement: "構建物巡查",
      tabAlbum: "相簿",
      tabMap: "地圖",
      tabExport: "匯出備份",
      searchProj: "搜尋屋邨、DMO、SE 或日期",
      newProject: "+ 新增屋邨專案",
      emptyProjects: "未有屋邨巡查專案。撳「+ 新增屋邨專案」開一條村開始巡查。",
      backProjects: "← 返回專案列表",
      backProject: "← 返回構建物列表",
      editProject: "編輯專案資料",
      addElement: "+ 新增 Structural Element",
      projectReport: "生成整份屋邨巡查報告 (PDF)",
      projectZip: "匯出此專案 ZIP",
      deleteProject: "刪除專案",
      searchElem: "搜尋構建物名稱、位置或 Remarks",
      fltAll: "全部",
      fltSse: "需 SSE 關注 (Rank S)",
      fltFollowup: "跟進中",
      fltNormal: "正常",
      emptyElements: "呢個屋邨專案暫時未有 Structural Element。撳「+ 新增 Structural Element」開始逐項巡查。",
      projModalNew: "新增屋邨巡查專案（Project）",
      projModalEdit: "編輯屋邨專案資料",
      rmoAll: "全部 RMO",
      projRmo: "RMO 區域（七區）",
      projDmo: "DMO / District（自動填入）",
      projNature: "屋邨性質 / 管理（自動填入）",
      autofillMsg: "已自動帶入屋邨主檔資料：",
      projEstate: "屋邨名稱 (Estate) *",
      projDate: "巡查日期 (Inspection Date) *",
      projHandover: "移交日期 (Handover Date)",
      projSe: "Reported by SE（姓名／職位）",
      projSse: "Endorsed by SSE（姓名／職位）",
      projNotes: "專案總備註（可選）",
      secElemHeader: "構建物資料（Structural Element）",
      elemReport: "列印此項 Appendix X",
      elemName: "構建物類型／名稱 (Inspected Structure) *",
      elemLoc: "具體位置／座數（例如 Block 1 入口）",
      elemStatus: "巡查狀態",
      elemWhen: "巡查時間（自動）",
      statusNormal: "正常 (Normal)",
      statusFollowup: "跟進中 (Follow-up)",
      statusSse: "需 SSE 關注 (Rank S)",
      elemGps: "此構建物定位：",
      refreshGps: "更新 GPS",
      pickMapLoc: "地圖點選補位",
      gpsLoading: "定位中…",
      secChecklistTitle: "HD Appendix X 結構評級（G 良好 / F 一般 / S 嚴重 / NA 不適用）",
      fillNa: "未填項設為 NA",
      overallGradeTitle: "一鍵整體評級（免逐項點擊）",
      skipNaLabel: "跳過已設為 NA 的項目",
      elemPlaceholder: "-- 選擇外部工程 / 結構構件 --",
      worksPlaceholder: "-- 選擇 External Works 類別（自動填入下方）--",
      elemCustomOpt: "其他（自行輸入名稱）…",
      elemCustomPh: "請輸入自訂構建物名稱…",
      smartNaToast: "已按構建物類型自動將不適用項目預設為 NA",
      overallAppliedToast: "已套用整體評級：",
      clearRatings: "清除評級",
      checklistHint: "Rank：G = Good（良好）；F = Fair（一般）；S = Severe（嚴重）；NA = Not Applicable（不適用）。如任何項目為 S，請於 5.1 Remarks 詳述並提請 SSE 關注。",
      sseAlert: "⚠️ 偵測到評級 S (Severe)：請喺下方「5.1 Remarks」詳細說明結構狀況並提請 SSE 關注。",
      othersPlaceholder: "請輸入 4.3 其他巡查項目名稱…",
      secRemarksTitle: "5.1 Remarks 及補充說明",
      remarks: "5.1 Remarks（結構狀況詳述／SSE 關注事項）",
      condition: "現場現況補充（可選）",
      works: "External works 說明（可選）",
      photos: "此構建物巡查相片",
      takePhoto: "影相",
      pickPhoto: "從相簿選取",
      photoHint: "相片只歸屬呢個 Structural Element，支援自動定位及每張相獨立備註，生成報告時會跟返所屬構建物排版。",
      photoNotePlaceholder: "輸入相片備註…",
      saveElem: "儲存此構建物",
      save: "儲存",
      cancel: "取消",
      deleteElem: "刪除此構建物",
      confirmOk: "確定",
      confirmDelProj: "確定刪除成個屋邨專案，連同入面所有 Structural Elements 同相片？此操作無法還原。",
      confirmDelElem: "確定刪除此 Structural Element 同佢所有相片？此操作無法還原。",
      confirmClear: "確定清除呢部裝置上所有專案、構建物同相片？",
      sseRemarksConfirm: "此構建物有評級 S (Severe) 項目，但「5.1 Remarks」仲係空白。確定照樣儲存？",
      saved: "已儲存",
      deleted: "已刪除",
      noCoords: "無坐標",
      hasCoords: "有坐標",
      elemCount: "項構建物",
      photosCount: "張相",
      allProjects: "全部屋邨專案",
      emptyAlbum: "未有巡查相片。",
      mapHintOnline: "線上地圖模式。標記來自各構建物及相片坐標。",
      mapHintOffline: "離線模式：顯示坐標清單同簡易相對位置圖。",
      mapEmpty: "未有帶坐標嘅構建物或相片。",
      basemapArcgis: "底圖：街道圖（按此切衛星圖）",
      basemapOsm: "底圖：衛星圖（按此切街道圖）",
      exportTitle: "匯出 ZIP 與備份還原",
      exportBlurb: "可揀單一屋邨專案或全部專案匯出 ZIP（包含 Excel 總表、CSV、JSON 備份及按構建物命名嘅相片）。",
      lblExportProj: "選擇匯出範圍",
      exportZipBtn: "匯出所選檔案",
      prePdfOnly: "只出 PDF",
      preExcelOnly: "只出 Excel",
      preBackupOnly: "只出 Data Backup",
      preBothAll: "全部（PDF + Excel + Backup）",
      lblExpPdf: "PDF 巡查報告",
      descExpPdf: "第 1 版 Summary + SE/SSE 簽名位，其後每頁詳列各構建物及相片",
      lblExpExcel: "Excel 報表 (.xlsx)",
      descExpExcel: "包含所有屋邨、構建物 1.1–4.3 評級及 Remarks 總表",
      lblExpBackup: "Data Backup (.json + 相片)",
      descExpBackup: "可還原嘅完整專案備份（連同相片打包成 ZIP）",
      needExportPick: "請最少剔選一項匯出格式。",
      importBtn: "匯入 JSON 備份還原",
      importDone: "還原完成！匯入專案數：",
      importFail: "無法讀取備份檔，請確認係 v3 匯出嘅 backup.json。",
      exportEmpty: "所選範圍未有任何紀錄。",
      exportDone: "已開始下載 ZIP。",
      exportFail: "匯出失敗。",
      exporting: "正在打包 ZIP…",
      privacyTitle: "私隱同儲存",
      privacyBlurb: "所有屋邨專案、構建物評級同相片均存放於本機 IndexedDB，唔會上傳伺服器。",
      clearAll: "清除全部資料",
      cleared: "已清除全部資料",
      storage: "儲存用量",
      storageUnknown: "瀏覽器未提供用量數字。",
      fileBanner: "目前為 file:// 模式，建議部署到 HTTPS 網站並用 iPad Safari 開啟。",
      insecureBanner: "目前並非 HTTPS，相機、GPS 與離線安裝可能受限。",
      offline: "離線",
      online: "已連線",
      needEstate: "請填寫屋邨名稱。",
      needElemName: "請填寫構建物名稱。",
      gpsPhoto: "已儲存相片（附坐標）",
      noGpsPhoto: "已儲存相片（無坐標）",
      photoFail: "無法處理相片。",
      pickerTitle: "地圖點選補錄坐標",
      pickerHint: "點擊地圖放置標記，再撳「套用坐標」。",
      pickerApply: "套用坐標",
      reportModalTitle: "結構巡查報告預覽（可列印／存為 PDF）",
      reportDownloadPdf: "直接下載 PDF 檔",
      reportPrintNow: "系統列印",
      close: "關閉",
      simplePlot: "簡易相對位置圖",
      maxRate: "評級"
    },
    en: {
      htmlLang: "en",
      title: "Site Inspection",
      tagline: "Estate Project → Multiple Structural Elements → Appendix X Report",
      langBtn: "中文",
      tabProjects: "Projects",
      tabProjectDetail: "Elements",
      tabElement: "Inspect Element",
      tabAlbum: "Album",
      tabMap: "Map",
      tabExport: "Export",
      searchProj: "Search estate, DMO, SE, or date",
      newProject: "+ New Estate Project",
      emptyProjects: "No estate projects yet. Tap “+ New Estate Project” to start today's inspection.",
      backProjects: "← All Projects",
      backProject: "← Back to Elements",
      editProject: "Edit Project",
      addElement: "+ Add Structural Element",
      projectReport: "Full Estate Inspection Report (PDF)",
      projectZip: "Export Project ZIP",
      deleteProject: "Delete Project",
      searchElem: "Search element name, location, or remarks",
      fltAll: "All",
      fltSse: "SSE Attention (Rank S)",
      fltFollowup: "Follow-up",
      fltNormal: "Normal",
      emptyElements: "No structural elements in this project yet. Tap “+ Add Structural Element” to begin.",
      projModalNew: "New Estate Inspection Project",
      projModalEdit: "Edit Estate Project",
      rmoAll: "全部 RMO",
      projRmo: "RMO 區域（七區）",
      projDmo: "DMO / District（自動填入）",
      projNature: "屋邨性質 / 管理（自動填入）",
      autofillMsg: "已自動帶入屋邨主檔資料：",
      projEstate: "Estate Name *",
      projDate: "Inspection Date *",
      projHandover: "Handover Date (mm/yyyy)",
      projSe: "Reported by SE (Name / Post)",
      projSse: "Endorsed by SSE (Name / Post)",
      projNotes: "Project Notes (Optional)",
      secElemHeader: "Structural Element Details",
      elemReport: "Print Single Appendix X",
      elemName: "Inspected Structure / Element *",
      elemLoc: "Specific Location / Block (e.g. Block 1 Entrance)",
      elemStatus: "Status",
      elemWhen: "Inspected At (Auto)",
      statusNormal: "Normal",
      statusFollowup: "Follow-up",
      statusSse: "SSE Attention (Rank S)",
      elemGps: "Element Location:",
      refreshGps: "Refresh GPS",
      pickMapLoc: "Pick on Map",
      gpsLoading: "Locating…",
      secChecklistTitle: "HD Appendix X Checklist (G Good / F Fair / S Severe / NA Not Applicable)",
      fillNa: "Set Empty to NA",
      overallGradeTitle: "Overall Quick Grading (One-Tap)",
      skipNaLabel: "Skip NA items",
      elemPlaceholder: "-- Select External Work / Structure --",
      worksPlaceholder: "-- Select External Works Type (Auto-fill below) --",
      elemCustomOpt: "Other (Type Custom Name)...",
      elemCustomPh: "Enter custom structure name...",
      smartNaToast: "Auto-set irrelevant items to NA for this structure",
      overallAppliedToast: "Applied overall grade: ",
      clearRatings: "Clear Ratings",
      checklistHint: "Rank: G - Good, F - Fair, S - Severe, NA - Not Applicable. For Rank S (Severe), elaborate in 5.1 Remarks and draw SSE's attention.",
      sseAlert: "⚠️ Rank S (Severe) detected: Elaborate structural conditions in 5.1 Remarks and draw SSE's attention.",
      othersPlaceholder: "Specify 4.3 Others item…",
      secRemarksTitle: "5.1 Remarks & Notes",
      remarks: "5.1 Remarks (Elaboration / SSE Attention)",
      condition: "Current Condition (Optional)",
      works: "External Works Description (Optional)",
      photos: "Element Inspection Photos",
      takePhoto: "Take Photo",
      pickPhoto: "Choose from Library",
      photoHint: "Photos belong specifically to this Structural Element, with GPS and individual captions included in the report.",
      photoNotePlaceholder: "Add photo caption…",
      saveElem: "Save Element",
      save: "Save",
      cancel: "Cancel",
      deleteElem: "Delete Element",
      confirmOk: "Confirm",
      confirmDelProj: "Delete this entire Estate Project along with all its Structural Elements and photos? Cannot be undone.",
      confirmDelElem: "Delete this Structural Element and its photos? Cannot be undone.",
      confirmClear: "Clear all projects, elements, and photos on this device?",
      sseRemarksConfirm: "This element has Rank S (Severe) items, but 5.1 Remarks is empty. Save anyway?",
      saved: "Saved",
      deleted: "Deleted",
      noCoords: "No coordinates",
      hasCoords: "Geotagged",
      elemCount: "elements",
      photosCount: "photos",
      allProjects: "All Estate Projects",
      emptyAlbum: "No inspection photos yet.",
      mapHintOnline: "Online map showing geotagged elements and photos.",
      mapHintOffline: "Offline mode: showing coordinate list and relative plot.",
      mapEmpty: "No geotagged elements or photos yet.",
      basemapArcgis: "Basemap: Street (Switch to Satellite)",
      basemapOsm: "Basemap: Satellite (Switch to Street)",
      exportTitle: "Export ZIP & Backup Restore",
      exportBlurb: "Export a single Estate Project or all projects as ZIP (Excel summary, CSVs, JSON backup, and photos organized by element).",
      lblExportProj: "Export Scope",
      exportZipBtn: "Export Selected",
      prePdfOnly: "PDF Only",
      preExcelOnly: "Excel Only",
      preBackupOnly: "Data Backup Only",
      preBothAll: "All (PDF + Excel + Backup)",
      lblExpPdf: "PDF Inspection Report",
      descExpPdf: "Page 1 Summary + SE/SSE Signatures, followed by Element pages & photos",
      lblExpExcel: "Excel Workbook (.xlsx)",
      descExpExcel: "Full table of Estate, Elements, 1.1–4.3 ratings & Remarks",
      lblExpBackup: "Data Backup (.json + Photos)",
      descExpBackup: "Restorable JSON backup (bundled with photos in ZIP)",
      needExportPick: "Please select at least one export format.",
      importBtn: "Restore JSON Backup",
      importDone: "Restored projects: ",
      importFail: "Could not read backup file. Please choose a v3 backup.json.",
      exportEmpty: "No data in selected scope.",
      exportDone: "ZIP download started.",
      exportFail: "Export failed.",
      exporting: "Packaging ZIP…",
      privacyTitle: "Privacy & Storage",
      privacyBlurb: "All projects, elements, and photos stay locally in IndexedDB.",
      clearAll: "Clear All Data",
      cleared: "All data cleared",
      storage: "Storage used",
      storageUnknown: "Storage usage unavailable.",
      fileBanner: "Opened as file://. Deploy to HTTPS and open in iPad Safari for full PWA features.",
      insecureBanner: "Not HTTPS. Camera, GPS, and offline install may be limited.",
      offline: "Offline",
      online: "Online",
      needEstate: "Please enter Estate Name.",
      needElemName: "Please enter Structural Element name.",
      gpsPhoto: "Photo saved (geotagged)",
      noGpsPhoto: "Photo saved (no coordinates)",
      photoFail: "Could not process photo.",
      pickerTitle: "Pick Location on Map",
      pickerHint: "Tap on the map to place a pin, then tap Apply.",
      pickerApply: "Apply Location",
      reportModalTitle: "Inspection Report Preview (Print / Save PDF)",
      reportDownloadPdf: "Download PDF File",
      reportPrintNow: "System Print",
      close: "Close",
      simplePlot: "Simple Relative Plot",
      maxRate: "Rank"
    }
  };

  var state = {
    lang: "zh",
    basemap: "arcgis",
    layoutPref: "auto",
    tab: "projects",
    filterRmo: "all",
    filterStatus: "all",
    pendingEstateCoords: null,
    projects: [],
    elements: [],
    photos: [],
    currentProjectId: null,
    currentElementId: null,
    isNewElementUnsaved: false,
    currentRatings: {},
    currentOthersText: "",
    currentGps: null,
    map: null,
    tileLayer: null,
    pickerMap: null,
    pickerMarker: null,
    pickerLatLng: null,
    objectUrls: [],
    lastReportProjs: []
  };

  function $(id) { return document.getElementById(id); }
  function t(key) { return (I18N[state.lang] || I18N.zh)[key] || key; }
  function uid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
  function xmlEsc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function slug(s) {
    return (String(s || "").trim().replace(/[\\/:*?"<>|]+/g, "_").replace(/\s+/g, "_") || "item").slice(0, 36);
  }
  function hktParts(date) {
    var fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    });
    var m = {};
    fmt.formatToParts(date).forEach(function (p) { if (p.type !== "literal") m[p.type] = p.value; });
    return m;
  }
  function todayYmd() {
    var p = hktParts(new Date());
    return p.year + "-" + p.month + "-" + p.day;
  }
  function fmtHkt(iso) {
    if (!iso) return "";
    var p = hktParts(new Date(iso));
    return p.year + "-" + p.month + "-" + p.day + " " + p.hour + ":" + p.minute;
  }
  function fmtDateDisplay(ymd) {
    if (!ymd) return "";
    var parts = String(ymd).split("-");
    return parts.length === 3 ? parts[2] + "/" + parts[1] + "/" + parts[0] : ymd;
  }
  function stampHkt(iso) {
    var p = hktParts(iso ? new Date(iso) : new Date());
    return p.year + p.month + p.day + "-" + p.hour + p.minute + p.second;
  }
  function hasCoords(obj) {
    return !!(obj && typeof obj.lat === "number" && typeof obj.lng === "number" && isFinite(obj.lat) && isFinite(obj.lng));
  }
  function fmtCoord(lat, lng) {
    return hasCoords({ lat: lat, lng: lng }) ? lat.toFixed(6) + ", " + lng.toFixed(6) : t("noCoords");
  }
  function rankSeverity(val) {
    if (val === "S" || val === "5" || val === "4") return 3;
    if (val === "F" || val === "3") return 2;
    if (val === "G" || val === "2" || val === "1") return 1;
    return 0;
  }
  function maxRatingOf(ratings) {
    var max = 0;
    Object.keys(ratings || {}).forEach(function (k) {
      var s = rankSeverity(ratings[k]);
      if (s > max) max = s;
    });
    return max === 3 ? "S" : max === 2 ? "F" : max === 1 ? "G" : "";
  }
  function hasSevereRating(ratings) { return maxRatingOf(ratings) === "S"; }
  function elemStatusOf(el) { return el.status || (hasSevereRating(el.ratings) ? "sse" : "normal"); }

  function showConfirm(msg) {
    return new Promise(function (resolve) {
      $("confirmMsg").textContent = msg;
      $("btnConfirmOk").textContent = t("confirmOk");
      $("btnConfirmCancel").textContent = t("cancel");
      $("confirmModal").hidden = false;
      function done(v) {
        $("confirmModal").hidden = true;
        $("btnConfirmOk").removeEventListener("click", ok);
        $("btnConfirmCancel").removeEventListener("click", no);
        resolve(v);
      }
      function ok() { done(true); }
      function no() { done(false); }
      $("btnConfirmOk").addEventListener("click", ok);
      $("btnConfirmCancel").addEventListener("click", no);
    });
  }
  function toast(msg) {
    var el = $("toast");
    el.textContent = msg; el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.hidden = true; }, 2800);
  }
  function revokeUrls() {
    state.objectUrls.forEach(function (u) { try { URL.revokeObjectURL(u); } catch (e) {} });
    state.objectUrls = [];
  }
  function urlFor(blob) {
    var u = URL.createObjectURL(blob);
    state.objectUrls.push(u);
    return u;
  }

  /* ---------- IndexedDB (3 stores: projects, elements, photos) ---------- */
  var dbPromise = null, useMem = false;
  var mem = { projects: {}, elements: {}, photos: {} };

  function openDb() {
    if (useMem) return Promise.resolve(null);
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve) {
      if (!window.indexedDB) { useMem = true; resolve(null); return; }
      try {
        var req = indexedDB.open(APP_DB, APP_VER);
        req.onupgradeneeded = function () {
          var db = req.result;
          if (!db.objectStoreNames.contains("projects")) db.createObjectStore("projects", { keyPath: "id" });
          if (!db.objectStoreNames.contains("elements")) {
            var es = db.createObjectStore("elements", { keyPath: "id" });
            es.createIndex("byProject", "projectId", { unique: false });
          }
          if (!db.objectStoreNames.contains("photos")) {
            var ps = db.createObjectStore("photos", { keyPath: "id" });
            ps.createIndex("byElement", "elementId", { unique: false });
            ps.createIndex("byProject", "projectId", { unique: false });
          }
        };
        req.onsuccess = function () { resolve(req.result); };
        req.onerror = function () { useMem = true; resolve(null); };
      } catch (e) { useMem = true; resolve(null); }
    });
    return dbPromise;
  }
  function txDone(tx) {
    return new Promise(function (res, rej) {
      tx.oncomplete = function () { res(); };
      tx.onerror = function () { rej(tx.error); };
      tx.onabort = function () { rej(tx.error || new Error("abort")); };
    });
  }
  function reqDone(req) {
    return new Promise(function (res, rej) {
      req.onsuccess = function () { res(req.result); };
      req.onerror = function () { rej(req.error); };
    });
  }
  async function getAll(store) {
    var db = await openDb();
    if (!db) return Object.values(mem[store]);
    return reqDone(db.transaction(store).objectStore(store).getAll());
  }
  async function putItem(store, obj) {
    var db = await openDb();
    if (!db) { mem[store][obj.id] = obj; return; }
    var tx = db.transaction(store, "readwrite");
    tx.objectStore(store).put(obj);
    await txDone(tx);
  }
  async function deleteItem(store, id) {
    var db = await openDb();
    if (!db) { delete mem[store][id]; return; }
    var tx = db.transaction(store, "readwrite");
    tx.objectStore(store).delete(id);
    await txDone(tx);
  }
  async function deleteElementCascade(elemId) {
    var ph = state.photos.filter(function (p) { return p.elementId === elemId; });
    var db = await openDb();
    if (!db) {
      delete mem.elements[elemId];
      ph.forEach(function (p) { delete mem.photos[p.id]; });
      return;
    }
    var tx = db.transaction(["elements", "photos"], "readwrite");
    tx.objectStore("elements").delete(elemId);
    ph.forEach(function (p) { tx.objectStore("photos").delete(p.id); });
    await txDone(tx);
  }
  async function deleteProjectCascade(projId) {
    var els = state.elements.filter(function (e) { return e.projectId === projId; });
    var ph = state.photos.filter(function (p) { return p.projectId === projId; });
    var db = await openDb();
    if (!db) {
      delete mem.projects[projId];
      els.forEach(function (e) { delete mem.elements[e.id]; });
      ph.forEach(function (p) { delete mem.photos[p.id]; });
      return;
    }
    var tx = db.transaction(["projects", "elements", "photos"], "readwrite");
    tx.objectStore("projects").delete(projId);
    els.forEach(function (e) { tx.objectStore("elements").delete(e.id); });
    ph.forEach(function (p) { tx.objectStore("photos").delete(p.id); });
    await txDone(tx);
  }
  async function clearAllData() {
    var db = await openDb();
    if (!db) { mem = { projects: {}, elements: {}, photos: {} }; return; }
    var tx = db.transaction(["projects", "elements", "photos"], "readwrite");
    tx.objectStore("projects").clear();
    tx.objectStore("elements").clear();
    tx.objectStore("photos").clear();
    await txDone(tx);
  }

  async function reloadData() {
    state.projects = (await getAll("projects")).sort(function (a, b) {
      return String(b.inspectionDate || b.createdAt || "").localeCompare(String(a.inspectionDate || a.createdAt || ""));
    });
    state.elements = (await getAll("elements")).sort(function (a, b) {
      return String(a.createdAt || "").localeCompare(String(b.createdAt || ""));
    });
    state.photos = (await getAll("photos")).sort(function (a, b) {
      return String(a.takenAt || "").localeCompare(String(b.takenAt || ""));
    });
  }
  function getProject(id) { return state.projects.filter(function (p) { return p.id === id; })[0] || null; }
  function getElement(id) { return state.elements.filter(function (e) { return e.id === id; })[0] || null; }
  function elementsOf(projId) { return state.elements.filter(function (e) { return e.projectId === projId && !e.isDraft; }); }
  function photosOfElement(elemId) { return state.photos.filter(function (p) { return p.elementId === elemId; }); }
  function photosOfProject(projId) { return state.photos.filter(function (p) { return p.projectId === projId; }); }

  /* ---------- GPS, EXIF & Images ---------- */
  function getDeviceGps() {
    return new Promise(function (resolve) {
      if (!navigator.geolocation) { resolve(null); return; }
      var done = false;
      var timer = setTimeout(function () { if (!done) { done = true; resolve(null); } }, 8500);
      try {
        navigator.geolocation.getCurrentPosition(
          function (pos) {
            if (done) return; done = true; clearTimeout(timer);
            resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, source: "device" });
          },
          function () { if (!done) { done = true; clearTimeout(timer); resolve(null); } },
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 20000 }
        );
      } catch (e) { clearTimeout(timer); resolve(null); }
    });
  }
  function getAscii(v, o, l) { var s = ""; for (var i = 0; i < l; i++) s += String.fromCharCode(v.getUint8(o + i)); return s; }
  function readRational(v, o, le) { var n = v.getUint32(o, le), d = v.getUint32(o + 4, le); return d ? n / d : 0; }
  function findTagOffset(v, ifd, ts, le, tag) {
    if (ifd + 2 > v.byteLength) return null;
    var n = v.getUint16(ifd, le);
    for (var i = 0; i < n; i++) {
      var e = ifd + 2 + i * 12;
      if (e + 12 > v.byteLength) break;
      if (v.getUint16(e, le) === tag) return v.getUint32(e + 8, le);
    }
    return null;
  }
  function findTagValue(v, ifd, ts, le, tag, kind) {
    if (ifd + 2 > v.byteLength) return null;
    var n = v.getUint16(ifd, le);
    for (var i = 0; i < n; i++) {
      var e = ifd + 2 + i * 12;
      if (e + 12 > v.byteLength) break;
      if (v.getUint16(e, le) !== tag) continue;
      var cnt = v.getUint32(e + 4, le), vo = e + 8;
      if (kind === "ascii") {
        var b = cnt > 4 ? ts + v.getUint32(vo, le) : vo, s = "";
        for (var c = 0; c < cnt && b + c < v.byteLength; c++) { var ch = v.getUint8(b + c); if (!ch) break; s += String.fromCharCode(ch); }
        return s;
      }
      if (kind === "rational3") {
        var st = ts + v.getUint32(vo, le);
        if (st + 24 > v.byteLength) return null;
        return readRational(v, st, le) + readRational(v, st + 8, le) / 60 + readRational(v, st + 16, le) / 3600;
      }
    }
    return null;
  }
  function readGpsFromExif(buffer) {
    try {
      var v = new DataView(buffer);
      if (v.byteLength < 12 || v.getUint16(0, false) !== 0xffd8) return null;
      var o = 2;
      while (o + 4 < v.byteLength) {
        if (v.getUint8(o) !== 0xff) break;
        var m = v.getUint8(o + 1), sz = v.getUint16(o + 2, false);
        if (m === 0xe1 && o + 10 < v.byteLength && getAscii(v, o + 4, 4) === "Exif") {
          var ts = o + 10, end = v.getUint16(ts, false);
          var le = end === 0x4949 ? true : (end === 0x4d4d ? false : null);
          if (le === null || v.getUint16(ts + 2, le) !== 0x002a) return null;
          var ifd0 = ts + v.getUint32(ts + 4, le);
          var go = findTagOffset(v, ifd0, ts, le, 0x8825);
          if (go == null) return null;
          var gi = ts + go;
          var lr = findTagValue(v, gi, ts, le, 0x0001, "ascii"), nr = findTagValue(v, gi, ts, le, 0x0003, "ascii");
          var la = findTagValue(v, gi, ts, le, 0x0002, "rational3"), ln = findTagValue(v, gi, ts, le, 0x0004, "rational3");
          if (la == null || ln == null) return null;
          return { lat: (lr && lr[0].toUpperCase() === "S" ? -1 : 1) * la, lng: (nr && nr[0].toUpperCase() === "W" ? -1 : 1) * ln, accuracy: null, source: "exif" };
        }
        if (m === 0xda) break;
        o += 2 + sz;
      }
    } catch (e) {}
    return null;
  }
  async function fileToArrayBuffer(f) {
    if (f.arrayBuffer) return f.arrayBuffer();
    return new Promise(function (res, rej) { var fr = new FileReader(); fr.onload = function () { res(fr.result); }; fr.onerror = function () { rej(fr.error); }; fr.readAsArrayBuffer(f); });
  }
  async function decodeImage(blob) {
    if (window.createImageBitmap) { try { return await createImageBitmap(blob); } catch (e) {} }
    var u = URL.createObjectURL(blob);
    try {
      return await new Promise(function (res, rej) { var img = new Image(); img.onload = function () { res(img); }; img.onerror = function () { rej(new Error("img")); }; img.src = u; });
    } finally { URL.revokeObjectURL(u); }
  }
  function drawToBlob(src, maxEdge, q) {
    var w = src.width || src.naturalWidth, h = src.height || src.naturalHeight;
    var sc = Math.min(1, maxEdge / Math.max(w, h));
    var cw = Math.max(1, Math.round(w * sc)), ch = Math.max(1, Math.round(h * sc));
    var c = document.createElement("canvas"); c.width = cw; c.height = ch;
    c.getContext("2d").drawImage(src, 0, 0, cw, ch);
    return new Promise(function (res, rej) {
      c.toBlob(function (b) { if (!b) rej(new Error("blob")); else res({ blob: b, width: cw, height: ch }); }, "image/jpeg", q);
    });
  }

  /* ---------- CSV & XLSX builders ---------- */
  function csvEsc(s) { var v = s == null ? "" : String(s); return /[",\r\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function buildCsv(rows) { return "\uFEFF" + rows.map(function (r) { return r.map(csvEsc).join(","); }).join("\r\n"); }
  function colName(n) { var s = "", x = n; while (x > 0) { var m = (x - 1) % 26; s = String.fromCharCode(65 + m) + s; x = Math.floor((x - 1) / 26); } return s; }
  function buildXlsxBlob(rows) {
    var sRows = rows.map(function (row, r) {
      var cells = row.map(function (val, c) { return '<c r="' + colName(c + 1) + (r + 1) + '" t="inlineStr"><is><t>' + xmlEsc(val) + "</t></is></c>"; }).join("");
      return '<row r="' + (r + 1) + '">' + cells + "</row>";
    }).join("");
    var zip = new JSZip();
    zip.file("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>');
    zip.file("_rels/.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
    zip.file("xl/workbook.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Structural_Inspection" sheetId="1" r:id="rId1"/></sheets></workbook>');
    zip.file("xl/_rels/workbook.xml.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>');
    zip.file("xl/worksheets/sheet1.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>' + sRows + "</sheetData></worksheet>");
    return zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }

  /* ---------- UI & Language ---------- */
  function isFileProtocol() { return location.protocol === "file:"; }
  function registerPwa() {
    if (isFileProtocol() || !("serviceWorker" in navigator) || !window.isSecureContext) return;
    navigator.serviceWorker.register("./sw.js").catch(function (e) { console.warn("SW skip", e); });
  }
  function updateBanner() {
    var el = $("modeBanner");
    if (isFileProtocol()) { el.textContent = t("fileBanner"); el.hidden = false; }
    else if (!window.isSecureContext) { el.textContent = t("insecureBanner"); el.hidden = false; }
    else el.hidden = true;
  }

  function applyAdaptiveLayout() {
    var w = window.innerWidth || document.documentElement.clientWidth || 1024;
    var isPhone = state.layoutPref === "phone" || (state.layoutPref === "auto" && w < 768);
    document.body.classList.toggle("layout-phone", isPhone);
    document.body.classList.toggle("layout-ipad", !isPhone);
    document.body.classList.toggle("is-forced-phone", state.layoutPref === "phone" && w >= 768);
    var btn = $("btnLayoutMode");
    if (btn) {
      if (state.layoutPref === "auto") {
        btn.textContent = isPhone ? (state.lang === "zh" ? "自動·電話" : "Auto·Phone") : (state.lang === "zh" ? "自動·iPad" : "Auto·iPad");
      } else if (state.layoutPref === "phone") {
        btn.textContent = state.lang === "zh" ? "電話版" : "Phone";
      } else {
        btn.textContent = state.lang === "zh" ? "iPad 版" : "iPad";
      }
    }
    if (state.map) setTimeout(function () { if (state.map) state.map.invalidateSize(); }, 120);
  }

  function updateConnBadge() {
    var el = $("connBadge");
    if (isFileProtocol()) { el.hidden = true; return; }
    el.hidden = false;
    el.textContent = navigator.onLine ? t("online") : t("offline");
  }

  function applyLang() {
    var p = I18N[state.lang];
    document.documentElement.lang = p.htmlLang;
    document.title = p.title + " v3.5.2";
    $("appTitle").textContent = p.title;
    $("appTagline").textContent = p.tagline;
    $("btnLang").textContent = p.langBtn;
    $("tab-projects").textContent = p.tabProjects;
    $("tab-projectDetail").textContent = p.tabProjectDetail;
    $("tab-element").textContent = p.tabElement;
    $("tab-album").textContent = p.tabAlbum;
    $("tab-map").textContent = p.tabMap;
    $("tab-export").textContent = p.tabExport;
    $("searchProjInput").placeholder = p.searchProj;
    $("btnNewProject").textContent = p.newProject;
    $("btnBackToProjects").textContent = p.backProjects;
    $("btnBackToProject").textContent = p.backProject;
    $("btnEditProject").textContent = p.editProject;
    $("btnAddElement").textContent = p.addElement;
    $("btnProjectReport").textContent = p.projectReport;
    $("btnProjectZip").textContent = p.projectZip;
    $("btnDeleteProject").textContent = p.deleteProject;
    $("searchElemInput").placeholder = p.searchElem;
    $("fltAll").textContent = p.fltAll;
    $("fltSse").textContent = p.fltSse;
    $("fltFollowup").textContent = p.fltFollowup;
    $("fltNormal").textContent = p.fltNormal;
    $("rmoAll").textContent = p.rmoAll;
    $("lblProjRmo").textContent = p.projRmo;
    $("lblProjDmo").textContent = p.projDmo;
    $("lblProjNature").textContent = p.projNature;
    $("lblProjEstate").textContent = p.projEstate;
    $("lblProjDate").textContent = p.projDate;
    $("lblProjHandover").textContent = p.projHandover;
    $("lblProjSe").textContent = p.projSe;
    $("lblProjSse").textContent = p.projSse;
    $("lblProjNotes").textContent = p.projNotes;
    $("btnProjCancel").textContent = p.cancel;
    $("btnProjSave").textContent = p.save;
    $("secElemHeader").textContent = p.secElemHeader;
    $("btnElemReport").textContent = p.elemReport;
    $("lblElemName").textContent = p.elemName;
    $("lblElemLoc").textContent = p.elemLoc;
    $("lblElemStatus").textContent = p.elemStatus;
    $("lblElemWhen").textContent = p.elemWhen;
    var st = $("fieldElemStatus");
    st.options[0].textContent = p.statusNormal;
    st.options[1].textContent = p.statusFollowup;
    st.options[2].textContent = p.statusSse;
    $("lblElemGps").textContent = p.elemGps;
    $("btnRefreshGps").textContent = p.refreshGps;
    $("btnPickMapLoc").textContent = p.pickMapLoc;
    $("secChecklistTitle").textContent = p.secChecklistTitle;
    $("btnFillNa").textContent = p.fillNa;
    if ($("lblOverallGrade")) $("lblOverallGrade").textContent = p.overallGradeTitle;
    if ($("lblSkipNa")) $("lblSkipNa").textContent = p.skipNaLabel;
    if ($("optElemPlaceholder")) $("optElemPlaceholder").textContent = p.elemPlaceholder;
    if ($("optWorksPlaceholder")) $("optWorksPlaceholder").textContent = p.worksPlaceholder;
    if ($("optElemCustom")) $("optElemCustom").textContent = p.elemCustomOpt;
    if ($("fieldElemName")) $("fieldElemName").placeholder = p.elemCustomPh;
    $("btnClearRatings").textContent = p.clearRatings;
    $("checklistHint").textContent = p.checklistHint;
    $("secRemarksTitle").textContent = p.secRemarksTitle;
    $("lblRemarks").textContent = p.remarks;
    $("lblCondition").textContent = p.condition;
    $("lblWorks").textContent = p.works;
    $("lblPhotos").textContent = p.photos;
    $("btnTakePhoto").textContent = p.takePhoto;
    $("btnPickPhoto").textContent = p.pickPhoto;
    $("photoHint").textContent = p.photoHint;
    $("btnSaveElem").textContent = p.saveElem;
    $("btnCancelElem").textContent = p.cancel;
    $("btnDeleteElem").textContent = p.deleteElem;
    $("exportTitle").textContent = p.exportTitle;
    $("exportBlurb").textContent = p.exportBlurb;
    $("lblExportProj").textContent = p.lblExportProj;
    $("btnExportSelected").textContent = p.exportZipBtn;
    $("prePdfOnly").textContent = p.prePdfOnly;
    $("preExcelOnly").textContent = p.preExcelOnly;
    $("preBackupOnly").textContent = p.preBackupOnly;
    $("preBothAll").textContent = p.preBothAll;
    $("lblExpPdf").textContent = p.lblExpPdf;
    $("descExpPdf").textContent = p.descExpPdf;
    $("lblExpExcel").textContent = p.lblExpExcel;
    $("descExpExcel").textContent = p.descExpExcel;
    $("lblExpBackup").textContent = p.lblExpBackup;
    $("descExpBackup").textContent = p.descExpBackup;
    $("btnImportBackup").textContent = p.importBtn;
    $("privacyTitle").textContent = p.privacyTitle;
    $("privacyBlurb").textContent = p.privacyBlurb;
    $("btnClearAll").textContent = p.clearAll;
    $("pickerTitle").textContent = p.pickerTitle;
    $("pickerHint").textContent = p.pickerHint;
    $("btnPickerCancel").textContent = p.cancel;
    $("btnPickerApply").textContent = p.pickerApply;
    $("reportModalTitle").textContent = p.reportModalTitle;
    $("btnReportDownloadPdf").textContent = p.reportDownloadPdf;
    $("btnReportPrintNow").textContent = p.reportPrintNow;
    $("btnReportClose2").textContent = p.close;
    $("btnToggleBasemap").textContent = state.basemap === "arcgis" ? p.basemapArcgis : p.basemapOsm;
    updateBanner();
    updateConnBadge();
    applyAdaptiveLayout();
    renderChecklistUi();
    updateElemGpsText();
  }

  function populateProjectDropdowns() {
    ["albumProjectFilter", "mapProjectFilter", "exportProjectSelect"].forEach(function (id) {
      var sel = $(id);
      var prev = sel.value || "all";
      sel.innerHTML = '<option value="all">' + xmlEsc(t("allProjects")) + '</option>';
      state.projects.forEach(function (proj) {
        var opt = document.createElement("option");
        opt.value = proj.id;
        opt.textContent = (proj.dmo ? "[" + proj.dmo + "] " : "") + proj.estate + " (" + fmtDateDisplay(proj.inspectionDate) + ")";
        sel.appendChild(opt);
      });
      sel.value = state.projects.some(function (p) { return p.id === prev; }) ? prev : "all";
    });
  }

  async function cleanupEmptyElementDraft() {
    if (!state.currentElementId || !state.isNewElementUnsaved) return;
    var photos = photosOfElement(state.currentElementId);
    var dirty = ($("fieldElemName").value || "").trim() || ($("fieldElemLoc").value || "").trim() ||
      ($("fieldRemarks").value || "").trim() || Object.keys(state.currentRatings).length > 0;
    if (!dirty && !photos.length) {
      await deleteElementCascade(state.currentElementId);
      state.currentElementId = null;
      state.isNewElementUnsaved = false;
      await reloadData();
    }
  }

  async function showTab(name) {
    if (state.tab === "element" && name !== "element") await cleanupEmptyElementDraft();
    state.tab = name;
    $("tab-projectDetail").hidden = !state.currentProjectId;
    $("tab-element").hidden = !state.currentElementId;
    ["projects", "projectDetail", "element", "album", "map", "export"].forEach(function (id) {
      var view = $("view-" + id), tab = $("tab-" + id), on = id === name;
      view.classList.toggle("is-active", on);
      view.hidden = !on;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    });
    populateProjectDropdowns();
    if (name === "projects") renderProjects();
    if (name === "projectDetail") renderProjectDetail();
    if (name === "album") renderAlbum();
    if (name === "map") renderMap();
    if (name === "export") refreshStorage();
  }

  /* ---------- Render Projects List ---------- */
  function renderProjects() {
    var q = ($("searchProjInput").value || "").trim().toLowerCase();
    var list = $("projectsList");
    list.innerHTML = "";
    var rows = state.projects.filter(function (p) {
      if (state.filterRmo !== "all" && (p.rmo || "") !== state.filterRmo) return false;
      if (!q) return true;
      return [p.rmo, p.estate, p.estateZh, p.dmo, p.inspectionDate, p.seName, p.sseName, p.notes].join(" ").toLowerCase().indexOf(q) !== -1;
    });
    $("projectsEmpty").hidden = rows.length > 0;
    $("projectsEmpty").textContent = t("emptyProjects");

    rows.forEach(function (proj) {
      var els = elementsOf(proj.id);
      var phCount = photosOfProject(proj.id).length;
      var sseCount = els.filter(function (e) { return elemStatusOf(e) === "sse" || hasSevereRating(e.ratings); }).length;

      var card = document.createElement("article");
      card.className = "card card-project";
      card.tabIndex = 0;

      var ic = document.createElement("div");
      ic.className = "card-icon";
      ic.textContent = (proj.rmo || proj.dmo || proj.estate || "HD").slice(0, 3).toUpperCase();

      var body = document.createElement("div");
      var h = document.createElement("h3");
      h.textContent = (proj.rmo ? "[" + proj.rmo + "] " : "") + proj.estate + (proj.estateZh ? " (" + proj.estateZh + ")" : "");
      var meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = fmtDateDisplay(proj.inspectionDate) + " · " + els.length + " " + t("elemCount") + " · " + phCount + " " + t("photosCount") + (proj.seName ? " · SE: " + proj.seName : "");
      body.appendChild(h);
      body.appendChild(meta);

      var badges = document.createElement("div");
      badges.className = "badges";
      if (sseCount > 0) {
        var b = document.createElement("span");
        b.className = "badge badge-danger";
        b.textContent = t("fltSse") + ": " + sseCount;
        badges.appendChild(b);
      } else {
        var b2 = document.createElement("span");
        b2.className = "badge badge-ok";
        b2.textContent = els.length + " " + t("elemCount");
        badges.appendChild(b2);
      }

      card.appendChild(ic); card.appendChild(body); card.appendChild(badges);
      card.addEventListener("click", function () { openProject(proj.id); });
      list.appendChild(card);
    });
  }

  function openProjectModal(proj) {
    $("projModalTitle").textContent = proj ? t("projModalEdit") : t("projModalNew");
    $("fieldProjId").value = proj ? proj.id : "";
    $("fieldProjRmo").value = proj ? (proj.rmo || "") : (state.filterRmo !== "all" ? state.filterRmo : "");
    $("fieldProjDmo").value = proj ? (proj.dmo || "") : "";
    $("fieldProjEstate").value = proj ? (proj.estate || "") : "";
    $("fieldProjEstate").dataset.zh = proj ? (proj.estateZh || "") : "";
    $("fieldProjDate").value = proj ? (proj.inspectionDate || todayYmd()) : todayYmd();
    $("fieldProjHandover").value = proj ? (proj.handoverDate || "") : "";
    $("fieldProjNature").value = proj ? (proj.nature || "") : "";
    $("fieldProjSe").value = proj ? (proj.seName || "") : "";
    $("fieldProjSse").value = proj ? (proj.sseName || "") : "";
    $("fieldProjNotes").value = proj ? (proj.notes || "") : "";
    state.pendingEstateCoords = proj && hasCoords(proj.estateGps) ? Object.assign({}, proj.estateGps) : null;
    $("autofillBanner").hidden = true;
    $("estateAcList").hidden = true;
    $("projectModal").hidden = false;
    $("fieldProjEstate").focus();
  }

  async function saveProjectForm() {
    var estate = $("fieldProjEstate").value.trim();
    if (!estate) { toast(t("needEstate")); $("fieldProjEstate").focus(); return; }
    var id = $("fieldProjId").value || uid();
    var existing = getProject(id);
    var proj = {
      id: id,
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rmo: $("fieldProjRmo").value.trim(),
      dmo: $("fieldProjDmo").value.trim(),
      estate: estate,
      estateZh: $("fieldProjEstate").dataset.zh || (existing ? existing.estateZh || "" : ""),
      nature: $("fieldProjNature").value.trim(),
      estateGps: state.pendingEstateCoords || (existing ? existing.estateGps || null : null),
      inspectionDate: $("fieldProjDate").value || todayYmd(),
      handoverDate: $("fieldProjHandover").value.trim(),
      seName: $("fieldProjSe").value.trim(),
      sseName: $("fieldProjSse").value.trim(),
      notes: $("fieldProjNotes").value.trim()
    };
    await putItem("projects", proj);
    await reloadData();
    $("projectModal").hidden = true;
    toast(t("saved"));
    openProject(proj.id);
  }

  function openProject(projId) {
    state.currentProjectId = projId;
    showTab("projectDetail");
  }

  /* ---------- Render Project Detail (Elements inside Project) ---------- */
  function renderProjectDetail() {
    revokeUrls();
    var proj = getProject(state.currentProjectId);
    if (!proj) { showTab("projects"); return; }

    var allEls = elementsOf(proj.id);
    var phTotal = photosOfProject(proj.id).length;
    $("crumbProjectName").textContent = proj.estate;
    $("heroEstateTitle").textContent = (proj.rmo ? "[" + proj.rmo + "] " : "") + proj.estate + (proj.estateZh ? " (" + proj.estateZh + ")" : "");
    $("heroEstateMeta").textContent =
      fmtDateDisplay(proj.inspectionDate) +
      (proj.dmo ? " · " + proj.dmo : "") + (proj.handoverDate ? " · Handover: " + proj.handoverDate : "") + (proj.nature ? " · " + proj.nature : "") +
      (proj.seName ? " · SE: " + proj.seName : "") +
      (proj.sseName ? " · SSE: " + proj.sseName : "") +
      " · " + allEls.length + " " + t("elemCount") + " · " + phTotal + " " + t("photosCount");

    var q = ($("searchElemInput").value || "").trim().toLowerCase();
    var rows = allEls.filter(function (el) {
      var st = elemStatusOf(el);
      if (state.filterStatus !== "all" && st !== state.filterStatus) return false;
      if (!q) return true;
      return [el.name, el.location, el.remarks, el.condition, el.externalWorks].join(" ").toLowerCase().indexOf(q) !== -1;
    });

    var list = $("elementsList");
    list.innerHTML = "";
    $("elementsEmpty").hidden = rows.length > 0;
    $("elementsEmpty").textContent = t("emptyElements");

    rows.forEach(function (el, idx) {
      var photos = photosOfElement(el.id);
      var card = document.createElement("article");
      card.className = "card";
      card.tabIndex = 0;

      var thumb;
      if (photos[0] && (photos[0].thumb || photos[0].blob)) {
        thumb = document.createElement("img");
        thumb.className = "card-thumb";
        thumb.alt = "";
        thumb.src = urlFor(photos[0].thumb || photos[0].blob);
      } else {
        thumb = document.createElement("div");
        thumb.className = "card-thumb";
        thumb.textContent = "#" + (idx + 1);
      }

      var body = document.createElement("div");
      var h = document.createElement("h3");
      h.textContent = "#" + (idx + 1) + " " + (el.name || "Element") + (el.location ? " — " + el.location : "");
      var meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = fmtHkt(el.createdAt) + " · " + photos.length + " " + t("photosCount") + (el.remarks ? " · " + el.remarks.slice(0, 60) : "");
      body.appendChild(h); body.appendChild(meta);

      var badges = document.createElement("div");
      badges.className = "badges";
      var st = elemStatusOf(el);
      var sb = document.createElement("span");
      sb.className = "badge " + (st === "sse" ? "badge-danger" : st === "followup" ? "badge-warn" : "badge-ok");
      sb.textContent = st === "sse" ? t("fltSse") : st === "followup" ? t("fltFollowup") : t("fltNormal");
      badges.appendChild(sb);

      var mr = maxRatingOf(el.ratings);
      if (mr) {
        var rb = document.createElement("span");
        rb.className = "badge " + (mr === "S" ? "badge-danger" : mr === "F" ? "badge-warn" : "badge-ok");
        rb.textContent = t("maxRate") + ": " + mr;
        badges.appendChild(rb);
      }
      var hasGps = hasCoords(el.gps) || photos.some(function (p) { return hasCoords(p); });
      var gb = document.createElement("span");
      gb.className = "badge " + (hasGps ? "badge-ok" : "badge-neutral");
      gb.textContent = hasGps ? t("hasCoords") : t("noCoords");
      badges.appendChild(gb);

      card.appendChild(thumb); card.appendChild(body); card.appendChild(badges);
      card.addEventListener("click", function () { openElement(el.id); });
      list.appendChild(card);
    });
  }

  /* ---------- Structural Element Form + Checklist ---------- */
  function renderChecklistUi() {
    var wrap = $("checklistContainer");
    if (!wrap) return;
    wrap.innerHTML = "";
    CHECKLIST_SCHEMA.forEach(function (sec) {
      var secEl = document.createElement("div");
      secEl.className = "cl-section";
      var h = document.createElement("div");
      h.className = "cl-section-title";
      h.textContent = state.lang === "zh" ? sec.sectionZh : sec.sectionEn;
      secEl.appendChild(h);

      sec.items.forEach(function (item) {
        var row = document.createElement("div");
        row.className = "cl-row";
        var code = document.createElement("div");
        code.className = "cl-code";
        code.textContent = item.code;

        var lbl = document.createElement("div");
        lbl.className = "cl-label";
        lbl.innerHTML = state.lang === "zh" ? (xmlEsc(item.zh) + "<small>" + xmlEsc(item.en) + "</small>") : xmlEsc(item.en);
        if (item.hasCustomText) {
          var inp = document.createElement("input");
          inp.type = "text";
          inp.placeholder = t("othersPlaceholder");
          inp.value = state.currentOthersText || "";
          inp.style.cssText = "margin-top:6px;min-height:36px;padding:6px 10px;border:1px solid var(--line);border-radius:8px;width:100%;";
          inp.addEventListener("input", function () { state.currentOthersText = inp.value; });
          lbl.appendChild(inp);
        }

        var grp = document.createElement("div");
        grp.className = "rating-group";
        RATINGS.forEach(function (val) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "rate-btn" + (state.currentRatings[item.code] === val ? " is-selected" : "");
          b.setAttribute("data-code", item.code);
          b.setAttribute("data-val", val);
          b.textContent = val;
          b.addEventListener("click", function () {
            if (state.currentRatings[item.code] === val) delete state.currentRatings[item.code];
            else state.currentRatings[item.code] = val;
            updateChecklistSelection();
          });
          grp.appendChild(b);
        });
        row.appendChild(code); row.appendChild(lbl); row.appendChild(grp);
        secEl.appendChild(row);
      });
      wrap.appendChild(secEl);
    });
    updateSseBanner();
  }
  function updateChecklistSelection() {
    document.querySelectorAll(".rate-btn").forEach(function (b) {
      b.classList.toggle("is-selected", state.currentRatings[b.getAttribute("data-code")] === b.getAttribute("data-val"));
    });
    updateSseBanner();
  }
  function updateSseBanner() {
    var sev = hasSevereRating(state.currentRatings);
    $("sseAlertBanner").hidden = !sev;
    $("sseAlertBanner").textContent = t("sseAlert");
    if (sev && $("fieldElemStatus").value === "normal") $("fieldElemStatus").value = "sse";
  }
  function updateElemGpsText() {
    var el = $("elemGpsText");
    if (!el) return;
    if (hasCoords(state.currentGps)) {
      el.textContent = fmtCoord(state.currentGps.lat, state.currentGps.lng) + (state.currentGps.accuracy ? " (±" + Math.round(state.currentGps.accuracy) + "m)" : "");
    } else el.textContent = t("noCoords");
  }

  function syncElemSelectFromInput() {
    var sel = $("fieldElemSelect");
    var inp = $("fieldElemName");
    if (!sel || !inp) return;
    var val = (inp.value || "").trim();
    if (!val) {
      sel.value = "";
      inp.hidden = true;
      inp.required = false;
      return;
    }
    var found = false;
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === val) { found = true; break; }
    }
    if (found) {
      sel.value = val;
      inp.hidden = true;
      inp.required = false;
    } else {
      sel.value = "__CUSTOM__";
      inp.hidden = false;
      inp.required = true;
    }
  }

  function clearOverallQuickHighlight() {
    var bar = $("overallGradeBar");
    if (!bar) return;
    bar.querySelectorAll(".grade-quick-btn").forEach(function (b) {
      b.classList.remove("is-active");
    });
  }

  function applySmartNaPreset(elemType) {
    var preset = SMART_NA_PRESETS[elemType];
    if (!preset) return;
    // Only auto-apply if user has not entered any G/F/S ratings yet
    var hasRanked = Object.keys(state.currentRatings).some(function (k) {
      var v = state.currentRatings[k];
      return v && v !== "NA" && v !== "N.A.";
    });
    if (hasRanked) return;
    state.currentRatings = {};
    preset.forEach(function (code) { state.currentRatings[code] = "NA"; });
    clearOverallQuickHighlight();
    updateChecklistSelection();
    toast(t("smartNaToast"));
  }

  function fillElementForm(el) {
    var proj = getProject(el.projectId);
    $("crumbElemContext").textContent = (proj ? proj.estate + " › " : "") + (el.name || t("addElement"));
    $("fieldElemId").value = el.id;
    $("fieldElemName").value = el.name || "";
    syncElemSelectFromInput();
    clearOverallQuickHighlight();
    $("fieldElemLoc").value = el.location || "";
    $("fieldElemStatus").value = elemStatusOf(el);
    $("fieldElemWhen").value = fmtHkt(el.createdAt) + " (HKT)";
    $("fieldRemarks").value = el.remarks || "";
    $("fieldCondition").value = el.condition || "";
    $("fieldWorks").value = el.externalWorks || "";
    if ($("fieldWorksSelect")) $("fieldWorksSelect").value = "";
    state.currentRatings = Object.assign({}, el.ratings || {});
    state.currentOthersText = el.othersText || "";
    state.currentGps = el.gps ? Object.assign({}, el.gps) : null;
    $("btnDeleteElem").hidden = !!el.isDraft;
    $("btnElemReport").hidden = !!el.isDraft;
    renderChecklistUi();
    updateElemGpsText();
    renderPhotoGrid(el.id);
  }

  async function startNewElement() {
    if (!state.currentProjectId) return;
    var el = {
      id: uid(), projectId: state.currentProjectId,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      name: "", location: "", status: "normal", ratings: {}, othersText: "",
      remarks: "", condition: "", externalWorks: "", gps: null, isDraft: true
    };
    state.currentElementId = el.id;
    state.isNewElementUnsaved = true;
    await putItem("elements", el);
    await reloadData();
    fillElementForm(el);
    showTab("element");
    if ($("fieldElemSelect")) $("fieldElemSelect").focus(); else $("fieldElemName").focus();
    $("elemGpsText").textContent = t("gpsLoading");
    getDeviceGps().then(function (gps) {
      if (state.currentElementId === el.id && !hasCoords(state.currentGps)) {
        state.currentGps = gps;
        updateElemGpsText();
      }
    });
  }

  function openElement(elemId) {
    var el = getElement(elemId);
    if (!el) return;
    state.currentProjectId = el.projectId;
    state.currentElementId = el.id;
    state.isNewElementUnsaved = !!el.isDraft;
    fillElementForm(el);
    showTab("element");
  }

  async function saveElementForm() {
    var el = getElement(state.currentElementId);
    if (!el) return;
    var name = $("fieldElemName").value.trim();
    if (!name) { toast(t("needElemName")); if ($("fieldElemName").hidden && $("fieldElemSelect")) $("fieldElemSelect").focus(); else $("fieldElemName").focus(); return; }
    var remarks = $("fieldRemarks").value.trim();
    if (hasSevereRating(state.currentRatings) && !remarks) {
      if (!(await showConfirm(t("sseRemarksConfirm")))) { $("fieldRemarks").focus(); return; }
    }
    var updated = {
      id: el.id, projectId: el.projectId,
      createdAt: el.createdAt, updatedAt: new Date().toISOString(),
      name: name, location: $("fieldElemLoc").value.trim(),
      status: $("fieldElemStatus").value,
      ratings: Object.assign({}, state.currentRatings),
      othersText: state.currentOthersText.trim(),
      remarks: remarks,
      condition: $("fieldCondition").value.trim(),
      externalWorks: $("fieldWorks").value.trim(),
      gps: state.currentGps ? Object.assign({}, state.currentGps) : null,
      isDraft: false
    };
    await putItem("elements", updated);
    state.isNewElementUnsaved = false;
    state.currentElementId = null;
    await reloadData();
    toast(t("saved"));
    showTab("projectDetail");
  }

  function renderPhotoGrid(elemId) {
    var box = $("photoGrid");
    box.innerHTML = "";
    photosOfElement(elemId).forEach(function (p) {
      var card = document.createElement("div");
      card.className = "photo-card";
      var img = document.createElement("img");
      img.alt = "";
      img.src = urlFor(p.thumb || p.blob);
      img.addEventListener("click", function () { openLightbox(p); });
      var cap = document.createElement("div");
      cap.className = "cap";
      cap.textContent = fmtCoord(p.lat, p.lng);
      var note = document.createElement("input");
      note.type = "text"; note.className = "photo-note";
      note.placeholder = t("photoNotePlaceholder");
      note.value = p.caption || "";
      note.addEventListener("change", async function () { p.caption = note.value.trim(); await putItem("photos", p); });
      var del = document.createElement("button");
      del.type = "button"; del.className = "btn-icon"; del.textContent = "×";
      del.addEventListener("click", async function (ev) {
        ev.stopPropagation();
        await deleteItem("photos", p.id);
        await reloadData();
        renderPhotoGrid(elemId);
      });
      card.appendChild(img); card.appendChild(del); card.appendChild(cap); card.appendChild(note);
      box.appendChild(card);
    });
  }

  async function addPhotoFiles(fileList, wantDeviceGps) {
    if (!state.currentElementId || !state.currentProjectId) return;
    var files = Array.prototype.slice.call(fileList || []).filter(function (f) {
      return !!(f && (/^image\//.test(f.type || "") || /\.(jpe?g|png|heic|heif|webp|gif)$/i.test(f.name || "")));
    });
    if (!files.length) return;
    $("btnTakePhoto").disabled = true; $("btnPickPhoto").disabled = true;
    var deviceGps = hasCoords(state.currentGps) ? state.currentGps : null;
    if (wantDeviceGps) {
      var fresh = await getDeviceGps();
      if (hasCoords(fresh)) { deviceGps = fresh; state.currentGps = fresh; updateElemGpsText(); }
    }
    for (var i = 0; i < files.length; i++) {
      try {
        var buf = await fileToArrayBuffer(files[i]);
        var exif = readGpsFromExif(buf);
        var gps = hasCoords(exif) ? exif : (hasCoords(deviceGps) ? deviceGps : null);
        if (hasCoords(gps) && !hasCoords(state.currentGps)) { state.currentGps = gps; updateElemGpsText(); }
        var dec = await decodeImage(new Blob([buf], { type: files[i].type || "image/jpeg" }));
        var full = await drawToBlob(dec, MAX_EDGE, JPEG_Q);
        var thumb = await drawToBlob(dec, THUMB_EDGE, 0.8);
        if (dec.close) dec.close();
        await putItem("photos", {
          id: uid(), projectId: state.currentProjectId, elementId: state.currentElementId,
          blob: full.blob, thumb: thumb.blob, width: full.width, height: full.height, mime: "image/jpeg",
          lat: gps ? gps.lat : null, lng: gps ? gps.lng : null,
          accuracy: gps && gps.accuracy != null ? gps.accuracy : null,
          gpsSource: gps ? gps.source : "none", caption: "", takenAt: new Date().toISOString(), originalName: files[i].name || ""
        });
        toast(hasCoords(gps) ? t("gpsPhoto") : t("noGpsPhoto"));
      } catch (e) { console.warn(e); toast(t("photoFail")); }
    }
    $("btnTakePhoto").disabled = false; $("btnPickPhoto").disabled = false;
    await reloadData();
    renderPhotoGrid(state.currentElementId);
  }

  /* ---------- Album & Map ---------- */
  function openLightbox(photo) {
    var el = getElement(photo.elementId), proj = getProject(photo.projectId);
    $("lightboxImg").src = urlFor(photo.blob || photo.thumb);
    $("lightboxCap").textContent = [proj && proj.estate, el && el.name, photo.caption, fmtHkt(photo.takenAt), fmtCoord(photo.lat, photo.lng)].filter(Boolean).join(" · ");
    $("lightbox").hidden = false;
  }
  function renderAlbum() {
    revokeUrls();
    var projFilter = $("albumProjectFilter").value || "all";
    var box = $("albumGrid"); box.innerHTML = "";
    var list = state.photos.filter(function (p) {
      var el = getElement(p.elementId);
      if (!el || el.isDraft) return false;
      return projFilter === "all" || p.projectId === projFilter;
    }).slice().reverse();
    $("albumEmpty").hidden = list.length > 0;
    $("albumEmpty").textContent = t("emptyAlbum");
    list.forEach(function (p) {
      var el = getElement(p.elementId), proj = getProject(p.projectId);
      var card = document.createElement("div"); card.className = "album-card";
      var img = document.createElement("img"); img.src = urlFor(p.thumb || p.blob); img.alt = "";
      img.addEventListener("click", function () { openLightbox(p); });
      var cap = document.createElement("div"); cap.className = "cap";
      cap.textContent = (proj ? proj.estate + " · " : "") + (el ? el.name : "") + (p.caption ? " — " + p.caption : "");
      card.appendChild(img); card.appendChild(cap); box.appendChild(card);
    });
  }

  function createBasemapLayer() {
    if (state.basemap === "osm") {
      return L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, attribution: "Tiles &copy; Esri" });
    }
    return L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, attribution: "Tiles &copy; Esri" });
  }
  function renderMap() {
    var projFilter = $("mapProjectFilter").value || "all";
    var pts = [];
    state.elements.filter(function (e) { return !e.isDraft && (projFilter === "all" || e.projectId === projFilter); }).forEach(function (el) {
      var proj = getProject(el.projectId);
      var phs = photosOfElement(el.id).filter(function (p) { return hasCoords(p); });
      if (phs.length) {
        phs.forEach(function (p) {
          pts.push({ lat: p.lat, lng: p.lng, label: (proj ? proj.estate + " — " : "") + el.name, sub: (el.location || "") + (p.caption ? " · " + p.caption : "") });
        });
      } else if (hasCoords(el.gps)) {
        pts.push({ lat: el.gps.lat, lng: el.gps.lng, label: (proj ? proj.estate + " — " : "") + el.name, sub: el.location || "" });
      }
    });

    var online = navigator.onLine && !isFileProtocol();
    $("mapHint").textContent = online ? t("mapHintOnline") : t("mapHintOffline");
    if (!online || typeof L === "undefined") {
      $("mapCanvas").hidden = true;
      if (state.map) { state.map.remove(); state.map = null; }
      var wrap = $("mapOffline"); wrap.hidden = false;
      wrap.innerHTML = pts.length ? "<h2>" + xmlEsc(t("simplePlot")) + "</h2><ol>" + pts.map(function (p) { return "<li>" + xmlEsc(p.label + " — " + fmtCoord(p.lat, p.lng)) + "</li>"; }).join("") + "</ol>" : "<p>" + xmlEsc(t("mapEmpty")) + "</p>";
      return;
    }
    $("mapCanvas").hidden = false;
    $("mapOffline").hidden = pts.length > 0;
    if (!pts.length) $("mapOffline").innerHTML = "<p>" + xmlEsc(t("mapEmpty")) + "</p>";
    if (L.Icon && L.Icon.Default && !L.Icon.Default.imagePath) L.Icon.Default.imagePath = "./vendor/leaflet/images/";
    if (!state.map) {
      state.map = L.map("mapCanvas", { zoomControl: true });
      state.tileLayer = createBasemapLayer().addTo(state.map);
    }
    if (state._markers) state._markers.forEach(function (m) { state.map.removeLayer(m); });
    state._markers = [];
    var bounds = [];
    pts.forEach(function (p) {
      var m = L.marker([p.lat, p.lng]).bindPopup("<strong>" + xmlEsc(p.label) + "</strong><br>" + xmlEsc(p.sub) + "<br>" + xmlEsc(fmtCoord(p.lat, p.lng)));
      m.addTo(state.map); state._markers.push(m); bounds.push([p.lat, p.lng]);
    });
    setTimeout(function () {
      if (!state.map) return;
      state.map.invalidateSize();
      if (bounds.length === 1) state.map.setView(bounds[0], 17);
      else if (bounds.length > 1) state.map.fitBounds(bounds, { padding: [32, 32], maxZoom: 18 });
      else state.map.setView([22.3193, 114.1694], 11);
    }, 80);
  }
  function openMapPicker() {
    if (typeof L === "undefined") { toast(t("mapHintOffline")); return; }
    $("pickerModal").hidden = false;
    var curProj = getProject(state.currentProjectId);
    var fallbackGps = curProj && hasCoords(curProj.estateGps) ? curProj.estateGps : null;
    var la = hasCoords(state.currentGps) ? state.currentGps.lat : (fallbackGps ? fallbackGps.lat : 22.3193);
    var ln = hasCoords(state.currentGps) ? state.currentGps.lng : (fallbackGps ? fallbackGps.lng : 114.1694);
    state.pickerLatLng = { lat: la, lng: ln };
    setTimeout(function () {
      if (state.pickerMap) { state.pickerMap.remove(); state.pickerMap = null; }
      state.pickerMap = L.map("pickerMap").setView([la, ln], (hasCoords(state.currentGps) || fallbackGps) ? 16 : 12);
      createBasemapLayer().addTo(state.pickerMap);
      state.pickerMarker = L.marker([la, ln]).addTo(state.pickerMap);
      state.pickerMap.on("click", function (e) { state.pickerLatLng = { lat: e.latlng.lat, lng: e.latlng.lng }; state.pickerMarker.setLatLng(e.latlng); });
      state.pickerMap.invalidateSize();
    }, 60);
  }

  /* ---------- Report Builder (Full Estate Report & Single Element Appendix X) ---------- */
  function buildElementReportPageHtml(proj, el, idxLabel, includeSignoff) {
    var photos = photosOfElement(el.id);
    var ratings = el.ratings || {};
    var rowsHtml = "";
    CHECKLIST_SCHEMA.forEach(function (sec) {
      rowsHtml += '<tr><th colspan="6">' + xmlEsc(sec.sectionEn) + '</th></tr>';
      sec.items.forEach(function (item) {
        var label = item.en + (item.hasCustomText && el.othersText ? " : " + el.othersText : "");
        var chosen = ratings[item.code] || "";
        var cols = RATINGS.map(function (r) {
          return '<td style="text-align:center;">' + (chosen === r ? '<span class="circled">' + r + '</span>' : r) + '</td>';
        }).join("");
        rowsHtml += '<tr><td>' + item.code + '</td><td>' + xmlEsc(label) + '</td>' + cols + '</tr>';
      });
    });
    var photosHtml = photos.length ? '<div class="report-photos">' + photos.map(function (p, i) {
      return '<figure><img src="' + urlFor(p.thumb || p.blob) + '"><figcaption><strong>' + xmlEsc(idxLabel) + ' Photo ' + (i + 1) + '</strong>' +
        (p.caption ? ': ' + xmlEsc(p.caption) : '') + ' (' + xmlEsc(fmtCoord(p.lat, p.lng)) + ')</figcaption></figure>';
    }).join("") + '</div>' : '';

    return '<div class="report-page">' +
      '<div style="display:flex;justify-content:space-between;font-size:0.78rem;"><span>' + xmlEsc(idxLabel) + '</span><span>Appendix X</span></div>' +
      '<h3>HOUSING DEPARTMENT</h3><h3>ESTATE MANAGEMENT DIVISION</h3><h3>SUMMARY REPORT OF STRUCTURAL INSPECTION</h3>' +
      '<table class="report-meta">' +
      '<tr><td><strong>RMO / DMO:</strong> ' + xmlEsc((proj.rmo ? proj.rmo + " · " : "") + (proj.dmo || "-")) + '</td><td><strong>Estate:</strong> ' + xmlEsc((proj.estate || "-") + (proj.estateZh ? " (" + proj.estateZh + ")" : "")) + '</td><td><strong>Inspection Date:</strong> ' + xmlEsc(fmtDateDisplay(proj.inspectionDate)) + '</td></tr>' +
      '<tr><td colspan="2"><strong>Inspected Structure:</strong> ' + xmlEsc(el.name + (el.location ? " (" + el.location + ")" : "")) + '</td><td><strong>Handover Date:</strong> ' + xmlEsc(proj.handoverDate || "-") + '</td></tr>' +
      '</table>' +
      '<p style="font-size:0.75rem;margin-bottom:5px;">* Rank: G - Good, F - Fair, S - Severe, NA - Not Applicable. For Rank (S) Severe, the Assessment Engineer shall elaborate the structural conditions in the Remarks and draw his/her SSE\'s attention.</p>' +
      '<table class="report-table"><tr><th style="width:40px;">Item</th><th>Description</th><th>G</th><th>F</th><th>S</th><th>NA</th></tr>' +
      rowsHtml +
      '<tr><td><strong>5.1</strong></td><td colspan="5"><strong>Remarks:</strong> ' + xmlEsc(el.remarks || "-") +
      (el.condition ? '<br><em>Condition:</em> ' + xmlEsc(el.condition) : '') +
      (el.externalWorks ? '<br><em>External Works:</em> ' + xmlEsc(el.externalWorks) : '') + '</td></tr>' +
      '</table>' +
      (includeSignoff ? (
        '<table class="report-meta" style="margin-top:10px;">' +
        '<tr><td><strong>Reported by SE:</strong> ' + xmlEsc(proj.seName || "________________") + '<br><br>Signature: ________________ &nbsp; Date: ' + xmlEsc(fmtDateDisplay(proj.inspectionDate)) + '</td>' +
        '<td><strong>Endorsed by SSE:</strong> ' + xmlEsc(proj.sseName || "________________") + '<br><br>Signature: ________________ &nbsp; Date: ____________</td></tr>' +
        '</table>'
      ) : '') + photosHtml + '</div>';
  }

  function openProjectReport(projId) {
    var proj = getProject(projId);
    if (!proj) return;
    var els = elementsOf(proj.id);
    if (!els.length) { toast(t("emptyElements")); return; }
    var sseCount = els.filter(function (e) { return hasSevereRating(e.ratings) || elemStatusOf(e) === "sse"; }).length;

    var summaryRows = els.map(function (el, i) {
      var mr = maxRatingOf(el.ratings);
      var ph = photosOfElement(el.id).length;
      return '<tr><td>' + (i + 1) + '</td><td><strong>' + xmlEsc(el.name) + '</strong>' + (el.location ? '<br><small>' + xmlEsc(el.location) + '</small>' : '') + '</td>' +
        '<td style="text-align:center;">' + (mr || "-") + '</td>' +
        '<td style="text-align:center;">' + (mr === "S" ? '<strong style="color:#b42318;">SSE Attention</strong>' : xmlEsc(elemStatusOf(el))) + '</td>' +
        '<td style="text-align:center;">' + ph + '</td>' +
        '<td>' + xmlEsc(el.remarks || "-") + '</td></tr>';
    }).join("");

    var coverHtml = '<div class="report-page">' +
      '<div style="text-align:right;font-size:0.78rem;">Page 1 — Summary Report (Appendix X)</div>' +
      '<h3>HOUSING DEPARTMENT — ESTATE MANAGEMENT DIVISION</h3>' +
      '<h3 style="font-size:1.12rem;margin:4px 0 10px;">SUMMARY REPORT OF STRUCTURAL INSPECTION</h3>' +
      '<table class="report-meta">' +
      '<tr><td><strong>RMO / DMO:</strong> ' + xmlEsc((proj.rmo ? proj.rmo + " · " : "") + (proj.dmo || "-")) + '</td><td><strong>Estate:</strong> ' + xmlEsc(proj.estate + (proj.estateZh ? " (" + proj.estateZh + ")" : "")) + '</td></tr>' +
      '<tr><td><strong>Inspection Date:</strong> ' + xmlEsc(fmtDateDisplay(proj.inspectionDate)) + '</td><td><strong>Handover Date:</strong> ' + xmlEsc(proj.handoverDate || "-") + '</td></tr>' +
      '<tr><td><strong>Total Elements Inspected:</strong> ' + els.length + '</td><td><strong>SSE Attention (Rank S):</strong> <strong style="color:' + (sseCount ? '#b42318' : '#157a4b') + ';">' + sseCount + '</strong></td></tr>' +
      '</table>' +
      (proj.notes ? '<p style="font-size:0.84rem;margin:6px 0;"><strong>Project Notes:</strong> ' + xmlEsc(proj.notes) + '</p>' : '') +
      '<h4 style="margin:10px 0 6px;font-size:0.9rem;">Summary of Inspected Structural Elements</h4>' +
      '<table class="report-table"><tr><th>#</th><th>Structural Element & Location</th><th>Rank</th><th>Status</th><th>Photos</th><th>5.1 Remarks</th></tr>' +
      summaryRows + '</table>' +
      '<table class="report-meta" style="margin-top:16px;">' +
      '<tr><td style="width:50%;"><strong>Reported by SE:</strong><br><br>Signature: _______________________<br><br>Name: ' + xmlEsc(proj.seName || "_______________________") + '<br>Date: ' + xmlEsc(fmtDateDisplay(proj.inspectionDate)) + '</td>' +
      '<td style="width:50%;"><strong>Endorsed by SSE:</strong><br><br>Signature: _______________________<br><br>Name: ' + xmlEsc(proj.sseName || "_______________________") + '<br>Date: _______________________</td></tr>' +
      '</table></div>';

    var detailPages = els.map(function (el, i) { return buildElementReportPageHtml(proj, el, "Element #" + (i + 1), false); }).join("");
    state.lastReportProjs = [proj];
    $("reportSheet").innerHTML = coverHtml + detailPages;
    $("reportModal").hidden = false;
  }

  function openSingleElementReport(elemId) {
    var el = getElement(elemId);
    if (!el) return;
    var proj = getProject(el.projectId);
    if (!proj) return;
    $("reportSheet").innerHTML = buildElementReportPageHtml(proj, el, el.name, true);
    $("reportModal").hidden = false;
  }


  /* ---------- Offline Real Multi-Page A4 PDF Generator (Zero External Libs, Full CJK + Photos) ---------- */
  function wrapCanvasText(ctx, text, maxW) {
    var str = String(text == null ? "" : text);
    var lines = [];
    str.split(/\r?\n/).forEach(function (para) {
      var line = "";
      for (var i = 0; i < para.length; i++) {
        var ch = para[i];
        var test = line + ch;
        if (ctx.measureText(test).width > maxW && line.length > 0) {
          lines.push(line);
          line = ch;
        } else {
          line = test;
        }
      }
      lines.push(line);
    });
    return lines;
  }

  function dataUrlToUint8(dataUrl) {
    var bin = atob(dataUrl.split(",")[1]);
    var arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr;
  }

  function assembleJpegPagesToPdfBlob(jpegPages) {
    // A4 in PDF points: 595 x 842
    var W = 595, H = 842;
    var chunks = [];
    var offset = 0;
    var offsets = [0]; // obj 0 free

    function pushStr(s) {
      var bytes = new Uint8Array(s.length);
      for (var i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i) & 0xff;
      chunks.push(bytes);
      offset += bytes.length;
    }
    function pushBytes(u8) {
      chunks.push(u8);
      offset += u8.length;
    }
    function startObj(num) {
      offsets[num] = offset;
      pushStr(num + " 0 obj\n");
    }

    pushStr("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n");
    var n = jpegPages.length;
    // Object IDs: 1 = Catalog, 2 = Pages, then for each page i (0..n-1):
    //   imgObj = 3 + i*3, contentObj = 4 + i*3, pageObj = 5 + i*3
    startObj(1);
    pushStr("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

    var kids = [];
    for (var k = 0; k < n; k++) kids.push((5 + k * 3) + " 0 R");
    startObj(2);
    pushStr("<< /Type /Pages /Kids [" + kids.join(" ") + "] /Count " + n + " >>\nendobj\n");

    for (var i = 0; i < n; i++) {
      var pg = jpegPages[i];
      var imgId = 3 + i * 3;
      var cntId = 4 + i * 3;
      var pageId = 5 + i * 3;

      startObj(imgId);
      pushStr("<< /Type /XObject /Subtype /Image /Width " + pg.w + " /Height " + pg.h +
        " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + pg.bytes.length + " >>\nstream\n");
      pushBytes(pg.bytes);
      pushStr("\nendstream\nendobj\n");

      var contentStr = "q\n" + W + " 0 0 " + H + " 0 0 cm\n/Im0 Do\nQ\n";
      startObj(cntId);
      pushStr("<< /Length " + contentStr.length + " >>\nstream\n" + contentStr + "endstream\nendobj\n");

      startObj(pageId);
      pushStr("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + W + " " + H + "] " +
        "/Resources << /XObject << /Im0 " + imgId + " 0 R >> >> /Contents " + cntId + " 0 R >>\nendobj\n");
    }

    var totalObjs = 3 + n * 3;
    var xrefOffset = offset;
    pushStr("xref\n0 " + totalObjs + "\n");
    pushStr("0000000000 65535 f \n");
    for (var j = 1; j < totalObjs; j++) {
      var offStr = String(offsets[j] || 0).padStart(10, "0");
      pushStr(offStr + " 00000 n \n");
    }
    pushStr("trailer\n<< /Size " + totalObjs + " /Root 1 0 R >>\nstartxref\n" + xrefOffset + "\n%%EOF");
    return new Blob(chunks, { type: "application/pdf" });
  }

  function newA4Canvas() {
    var c = document.createElement("canvas");
    c.width = 1240; c.height = 1754; // 150 DPI A4
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#111827";
    ctx.strokeStyle = "#334155";
    return { c: c, ctx: ctx };
  }

  function drawCell(ctx, x, y, w, h, text, opts) {
    opts = opts || {};
    if (opts.fill) { ctx.fillStyle = opts.fill; ctx.fillRect(x, y, w, h); }
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = opts.color || "#111827";
    ctx.font = (opts.bold ? "bold " : "") + (opts.size || 20) + "px 'PingFang HK', 'Noto Sans TC', Arial, sans-serif";
    ctx.textBaseline = "top";
    var pad = opts.pad != null ? opts.pad : 8;
    var lines = wrapCanvasText(ctx, text, w - pad * 2);
    var lh = (opts.size || 20) * 1.3;
    lines.forEach(function (ln, idx) {
      if (y + pad + idx * lh > y + h - 4) return;
      if (opts.align === "center") {
        var tw = ctx.measureText(ln).width;
        ctx.fillText(ln, x + (w - tw) / 2, y + pad + idx * lh);
      } else {
        ctx.fillText(ln, x + pad, y + pad + idx * lh);
      }
    });
  }

  async function renderSummaryPageCanvas(proj, els) {
    var pg = newA4Canvas(), ctx = pg.ctx;
    var M = 60, W = 1120, y = 55;
    var sseCount = els.filter(function (e) { return hasSevereRating(e.ratings) || elemStatusOf(e) === "sse"; }).length;

    ctx.fillStyle = "#475569";
    ctx.font = "18px Arial, sans-serif";
    ctx.fillText("Page 1 — Summary Report (Appendix X)", M + W - 320, y);
    y += 32;

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 26px Arial, sans-serif";
    var h1 = "HOUSING DEPARTMENT — ESTATE MANAGEMENT DIVISION";
    ctx.fillText(h1, M + (W - ctx.measureText(h1).width) / 2, y);
    y += 36;
    ctx.font = "bold 28px Arial, sans-serif";
    var h2 = "SUMMARY REPORT OF STRUCTURAL INSPECTION";
    ctx.fillText(h2, M + (W - ctx.measureText(h2).width) / 2, y);
    y += 48;

    // Metadata Table
    var rowH = 44;
    drawCell(ctx, M, y, W / 2, rowH, "RMO / DMO: " + (proj.rmo ? proj.rmo + " · " : "") + (proj.dmo || "-"), { size: 19, bold: true });
    drawCell(ctx, M + W / 2, y, W / 2, rowH, "Estate: " + proj.estate + (proj.estateZh ? " (" + proj.estateZh + ")" : ""), { size: 19, bold: true });
    y += rowH;
    drawCell(ctx, M, y, W / 2, rowH, "Inspection Date: " + fmtDateDisplay(proj.inspectionDate), { size: 19 });
    drawCell(ctx, M + W / 2, y, W / 2, rowH, "Handover Date: " + (proj.handoverDate || "-"), { size: 19 });
    y += rowH;
    drawCell(ctx, M, y, W / 2, rowH, "Total Elements Inspected: " + els.length, { size: 19, bold: true });
    drawCell(ctx, M + W / 2, y, W / 2, rowH, "SSE Attention (Rank S): " + sseCount, { size: 19, bold: true, color: sseCount ? "#b42318" : "#157a4b" });
    y += rowH + 18;

    if (proj.notes) {
      drawCell(ctx, M, y, W, 56, "Project Notes: " + proj.notes, { size: 18, fill: "#f8fafc" });
      y += 70;
    }

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 22px 'PingFang HK', Arial, sans-serif";
    ctx.fillText("Summary of Inspected Structural Elements", M, y);
    y += 32;

    // Table Header
    var cols = [55, 310, 105, 165, 85, 400];
    var hdrs = ["#", "Structural Element & Location", "Rank", "Status", "Photos", "5.1 Remarks"];
    var cx = M;
    for (var i = 0; i < cols.length; i++) {
      drawCell(ctx, cx, y, cols[i], 40, hdrs[i], { size: 17, bold: true, fill: "#e2e8f0", align: i === 0 || i === 2 || i === 4 ? "center" : "left" });
      cx += cols[i];
    }
    y += 40;

    var maxTableY = 1390;
    if (!els.length) {
      drawCell(ctx, M, y, W, 46, "No structural elements recorded yet.", { size: 18, align: "center", color: "#64748b" });
      y += 46;
    } else {
      for (var r = 0; r < els.length; r++) {
        if (y + 58 > maxTableY) {
          drawCell(ctx, M, y, W, 38, "... (" + (els.length - r) + " more elements detailed on following pages)", { size: 16, align: "center", color: "#475569" });
          y += 38;
          break;
        }
        var el = els[r];
        var mr = maxRatingOf(el.ratings);
        var phCnt = photosOfElement(el.id).length;
        var stLabel = mr === "S" ? "SSE Attention" : elemStatusOf(el);
        var rh = 58;
        cx = M;
        var vals = [
          String(r + 1),
          el.name + (el.location ? "\n" + el.location : ""),
          mr ? String(mr) : "-",
          stLabel,
          String(phCnt),
          el.remarks || "-"
        ];
        for (var cIdx = 0; cIdx < cols.length; cIdx++) {
          drawCell(ctx, cx, y, cols[cIdx], rh, vals[cIdx], {
            size: 16,
            bold: cIdx === 3 && mr === "S",
            color: cIdx === 3 && mr === "S" ? "#b42318" : "#111827",
            align: cIdx === 0 || cIdx === 2 || cIdx === 4 ? "center" : "left"
          });
          cx += cols[cIdx];
        }
        y += rh;
      }
    }

    // SE / SSE Signature Block anchored cleanly at bottom of Page 1 Summary!
    var sigY = Math.max(y + 28, 1455);
    var sigH = 220;
    drawCell(ctx, M, sigY, W / 2, sigH,
      "Reported by SE:\n\nSignature: ____________________________\n\nName: " + (proj.seName || "____________________________") + "\nDate: " + fmtDateDisplay(proj.inspectionDate),
      { size: 19, pad: 14, fill: "#fcfcfd" }
    );
    drawCell(ctx, M + W / 2, sigY, W / 2, sigH,
      "Endorsed by SSE:\n\nSignature: ____________________________\n\nName: " + (proj.sseName || "____________________________") + "\nDate: ____________________________",
      { size: 19, pad: 14, fill: "#fcfcfd" }
    );

    return { w: pg.c.width, h: pg.c.height, bytes: dataUrlToUint8(pg.c.toDataURL("image/jpeg", 0.88)) };
  }

  async function renderElementPagesCanvas(proj, el, idxNum) {
    var pages = [];
    var pg = newA4Canvas(), ctx = pg.ctx;
    var M = 60, W = 1120, y = 52;

    ctx.fillStyle = "#475569";
    ctx.font = "18px Arial, sans-serif";
    ctx.fillText("Element #" + idxNum + " — " + proj.estate, M, y);
    ctx.fillText("Appendix X", M + W - 105, y);
    y += 30;

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 24px Arial, sans-serif";
    var t1 = "HOUSING DEPARTMENT — SUMMARY REPORT OF STRUCTURAL INSPECTION";
    ctx.fillText(t1, M + (W - ctx.measureText(t1).width) / 2, y);
    y += 38;

    drawCell(ctx, M, y, W * 0.65, 42, "Inspected Structure: " + el.name + (el.location ? " (" + el.location + ")" : ""), { size: 18, bold: true });
    drawCell(ctx, M + W * 0.65, y, W * 0.35, 42, "Date: " + fmtDateDisplay(proj.inspectionDate), { size: 18 });
    y += 42;
    drawCell(ctx, M, y, W * 0.5, 38, "RMO / DMO: " + (proj.rmo ? proj.rmo + " · " : "") + (proj.dmo || "-"), { size: 17 });
    drawCell(ctx, M + W * 0.5, y, W * 0.5, 38, "Estate: " + proj.estate + "  |  Handover: " + (proj.handoverDate || "-"), { size: 17 });
    y += 46;

    // Checklist table (1.1 - 4.3)
    var codeW = 70, rateW = 74, descW = W - codeW - rateW * RATINGS.length;
    drawCell(ctx, M, y, codeW, 34, "Item", { size: 16, bold: true, fill: "#e2e8f0", align: "center" });
    drawCell(ctx, M + codeW, y, descW, 34, "Inspection Item Description", { size: 16, bold: true, fill: "#e2e8f0" });
    for (var ri = 0; ri < RATINGS.length; ri++) {
      drawCell(ctx, M + codeW + descW + ri * rateW, y, rateW, 34, RATINGS[ri], { size: 15, bold: true, fill: "#e2e8f0", align: "center" });
    }
    y += 34;

    var ratings = el.ratings || {};
    CHECKLIST_SCHEMA.forEach(function (sec) {
      drawCell(ctx, M, y, W, 30, sec.sectionEn, { size: 16, bold: true, fill: "#f1f5f9", pad: 6 });
      y += 30;
      sec.items.forEach(function (it) {
        var rh = 38;
        var desc = it.en + (it.hasCustomText && el.othersText ? " : " + el.othersText : "");
        drawCell(ctx, M, y, codeW, rh, it.code, { size: 15, bold: true, align: "center", pad: 8 });
        drawCell(ctx, M + codeW, y, descW, rh, desc, { size: 15, pad: 8 });
        var chosen = ratings[it.code] || "";
        for (var j = 0; j < RATINGS.length; j++) {
          var rx = M + codeW + descW + j * rateW;
          var isSel = chosen === RATINGS[j];
          drawCell(ctx, rx, y, rateW, rh, RATINGS[j], {
            size: 15, bold: isSel, align: "center", pad: 8,
            color: isSel ? "#b42318" : "#64748b",
            fill: isSel ? "#fef2f2" : null
          });
          if (isSel) {
            ctx.strokeStyle = "#b42318";
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.ellipse(rx + rateW / 2, y + rh / 2, 20, 14, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        y += rh;
      });
    });

    // 5.1 Remarks
    var remText = "5.1 Remarks: " + (el.remarks || "-") +
      (el.condition ? "\nCondition: " + el.condition : "") +
      (el.externalWorks ? "\nExternal Works: " + el.externalWorks : "");
    drawCell(ctx, M, y, W, 115, remText, { size: 16, pad: 10, fill: "#fcfcfd" });
    y += 130;

    // Element Photos (up to 2 photos on bottom of same page, overflow to next page 4 per page)
    var photos = photosOfElement(el.id);
    if (photos.length) {
      var colW = (W - 24) / 2, imgH = 260;
      var pIdx = 0;
      if (y + imgH + 45 <= 1700) {
        for (var c = 0; c < 2 && pIdx < photos.length; c++, pIdx++) {
          await drawPhotoBox(ctx, M + c * (colW + 24), y, colW, imgH, photos[pIdx], "Element #" + idxNum + " Photo " + (pIdx + 1));
        }
      }
      pages.push({ w: pg.c.width, h: pg.c.height, bytes: dataUrlToUint8(pg.c.toDataURL("image/jpeg", 0.86)) });

      while (pIdx < photos.length) {
        var pg2 = newA4Canvas(), ctx2 = pg2.ctx;
        ctx2.fillStyle = "#0f172a";
        ctx2.font = "bold 22px 'PingFang HK', Arial, sans-serif";
        ctx2.fillText("Element #" + idxNum + " — " + el.name + " (Inspection Photos)", M, 55);
        var py = 105;
        for (var row = 0; row < 2 && pIdx < photos.length; row++) {
          for (var col = 0; col < 2 && pIdx < photos.length; col++, pIdx++) {
            await drawPhotoBox(ctx2, M + col * (colW + 24), py + row * 420, colW, 340, photos[pIdx], "Element #" + idxNum + " Photo " + (pIdx + 1));
          }
        }
        pages.push({ w: pg2.c.width, h: pg2.c.height, bytes: dataUrlToUint8(pg2.c.toDataURL("image/jpeg", 0.86)) });
      }
    } else {
      pages.push({ w: pg.c.width, h: pg.c.height, bytes: dataUrlToUint8(pg.c.toDataURL("image/jpeg", 0.86)) });
    }
    return pages;
  }

  async function drawPhotoBox(ctx, x, y, w, imgH, photo, label) {
    ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1.2;
    ctx.strokeRect(x, y, w, imgH + 54);
    try {
      var blob = photo.blob || photo.thumb;
      if (blob) {
        var img = await decodeImage(blob);
        var iw = img.width || img.naturalWidth, ih = img.height || img.naturalHeight;
        var ratio = Math.min((w - 12) / iw, (imgH - 12) / ih);
        var dw = iw * ratio, dh = ih * ratio;
        ctx.drawImage(img, x + (w - dw) / 2, y + (imgH - dh) / 2, dw, dh);
        if (img.close) img.close();
      }
    } catch (e) {}
    var cap = label + (photo.caption ? ": " + photo.caption : "") + " (" + fmtCoord(photo.lat, photo.lng) + ")";
    ctx.fillStyle = "#1e293b";
    ctx.font = "15px 'PingFang HK', Arial, sans-serif";
    wrapCanvasText(ctx, cap, w - 16).slice(0, 2).forEach(function (ln, idx) {
      ctx.fillText(ln, x + 8, y + imgH + 6 + idx * 20);
    });
  }

  async function buildPdfBlobForProjects(targetProjs) {
    var allPages = [];
    for (var i = 0; i < targetProjs.length; i++) {
      var proj = targetProjs[i];
      var els = elementsOf(proj.id);
      allPages.push(await renderSummaryPageCanvas(proj, els));
      for (var j = 0; j < els.length; j++) {
        var elPages = await renderElementPagesCanvas(proj, els[j], j + 1);
        allPages = allPages.concat(elPages);
      }
    }
    return assembleJpegPagesToPdfBlob(allPages);
  }

  /* ---------- Export ZIP & Backup Restore ---------- */
  function downloadBlob(blob, filename) {
    var a = document.createElement("a");
    var href = URL.createObjectURL(blob);
    a.href = href; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(href); }, 2000);
  }


  function buildExportRows(targetProjs) {
    var header = ["Project ID", "RMO Region", "DMO", "Estate", "Inspection Date", "Handover Date", "SE", "SSE", "Element #", "Structural Element", "Location", "Status", "Rank", "SSE Attention"];
    ALL_ITEMS.forEach(function (it) { header.push(it.code + " " + it.en); });
    header.push("4.3 Others", "5.1 Remarks", "Condition", "External Works", "Element GPS", "Photo Count");
    var recRows = [header];
    var photoRows = [["Estate", "Structural Element", "Location", "Photo File", "Taken At (HKT)", "Caption", "Lat", "Lng", "GPS Source"]];
    targetProjs.forEach(function (proj) {
      elementsOf(proj.id).forEach(function (el, idx) {
        var phs = photosOfElement(el.id);
        var mr = maxRatingOf(el.ratings);
        var row = [
          proj.id, proj.rmo || "", proj.dmo || "", proj.estate + (proj.estateZh ? " (" + proj.estateZh + ")" : ""),
          proj.inspectionDate, proj.handoverDate || "", proj.seName || "", proj.sseName || "",
          String(idx + 1), el.name, el.location || "", elemStatusOf(el), mr || "", mr === "S" ? "YES" : "NO"
        ];
        ALL_ITEMS.forEach(function (it) { row.push((el.ratings && el.ratings[it.code]) || ""); });
        row.push(el.othersText || "", el.remarks || "", el.condition || "", el.externalWorks || "", hasCoords(el.gps) ? fmtCoord(el.gps.lat, el.gps.lng) : "", String(phs.length));
        recRows.push(row);
        phs.forEach(function (p, pi) {
          var fn = "photos/" + slug(proj.estate) + "/" + String(idx + 1).padStart(2, "0") + "_" + slug(el.name) + "_" + String(pi + 1).padStart(2, "0") + ".jpg";
          photoRows.push([proj.estate, el.name, el.location || "", fn, fmtHkt(p.takenAt), p.caption || "", p.lat != null ? p.lat : "", p.lng != null ? p.lng : "", p.gpsSource || ""]);
        });
      });
    });
    return { recRows: recRows, photoRows: photoRows };
  }

  function openMultiProjectReport(targetProjs) {
    var pages = [];
    targetProjs.forEach(function (proj) {
      var els = elementsOf(proj.id);
      if (!els.length) return;
      var sseCount = els.filter(function (e) { return hasSevereRating(e.ratings) || elemStatusOf(e) === "sse"; }).length;
      var summaryRows = els.map(function (el, i) {
        var mr = maxRatingOf(el.ratings);
        return '<tr><td>' + (i + 1) + '</td><td><strong>' + xmlEsc(el.name) + '</strong>' + (el.location ? '<br><small>' + xmlEsc(el.location) + '</small>' : '') + '</td>' +
          '<td style="text-align:center;">' + (mr || "-") + '</td>' +
          '<td style="text-align:center;">' + (mr === "S" ? '<strong style="color:#b42318;">SSE Attention</strong>' : xmlEsc(elemStatusOf(el))) + '</td>' +
          '<td style="text-align:center;">' + photosOfElement(el.id).length + '</td>' +
          '<td>' + xmlEsc(el.remarks || "-") + '</td></tr>';
      }).join("");
      pages.push('<div class="report-page">' +
        '<div style="text-align:right;font-size:0.78rem;">Page 1 — Summary Report (Appendix X)</div>' +
        '<h3>HOUSING DEPARTMENT — ESTATE MANAGEMENT DIVISION</h3>' +
        '<h3 style="font-size:1.12rem;margin:4px 0 10px;">SUMMARY REPORT OF STRUCTURAL INSPECTION</h3>' +
        '<table class="report-meta">' +
        '<tr><td><strong>RMO / DMO:</strong> ' + xmlEsc((proj.rmo ? proj.rmo + " · " : "") + (proj.dmo || "-")) + '</td><td><strong>Estate:</strong> ' + xmlEsc(proj.estate + (proj.estateZh ? " (" + proj.estateZh + ")" : "")) + '</td></tr>' +
        '<tr><td><strong>Inspection Date:</strong> ' + xmlEsc(fmtDateDisplay(proj.inspectionDate)) + '</td><td><strong>Handover Date:</strong> ' + xmlEsc(proj.handoverDate || "-") + '</td></tr>' +
        '<tr><td><strong>Total Elements Inspected:</strong> ' + els.length + '</td><td><strong>SSE Attention (Rank S):</strong> <strong style="color:' + (sseCount ? '#b42318' : '#157a4b') + ';">' + sseCount + '</strong></td></tr>' +
        '</table>' +
        (proj.notes ? '<p style="font-size:0.84rem;margin:6px 0;"><strong>Project Notes:</strong> ' + xmlEsc(proj.notes) + '</p>' : '') +
        '<h4 style="margin:10px 0 6px;font-size:0.9rem;">Summary of Inspected Structural Elements</h4>' +
        '<table class="report-table"><tr><th>#</th><th>Structural Element & Location</th><th>Rank</th><th>Status</th><th>Photos</th><th>5.1 Remarks</th></tr>' +
        summaryRows + '</table>' +
        '<table class="report-meta" style="margin-top:16px;">' +
        '<tr><td style="width:50%;"><strong>Reported by SE:</strong><br><br>Signature: _______________________<br><br>Name: ' + xmlEsc(proj.seName || "_______________________") + '<br>Date: ' + xmlEsc(fmtDateDisplay(proj.inspectionDate)) + '</td>' +
        '<td style="width:50%;"><strong>Endorsed by SSE:</strong><br><br>Signature: _______________________<br><br>Name: ' + xmlEsc(proj.sseName || "_______________________") + '<br>Date: _______________________</td></tr>' +
        '</table></div>');
      els.forEach(function (el, i) { pages.push(buildElementReportPageHtml(proj, el, "Element #" + (i + 1), false)); });
    });
    if (!pages.length) { toast(t("exportEmpty")); return false; }
    state.lastReportProjs = targetProjs;
    $("reportSheet").innerHTML = pages.join("");
    $("reportModal").hidden = false;
    return true;
  }

  async function runSelectedExport() {
    var wantPdf = $("chkExpPdf").checked;
    var wantExcel = $("chkExpExcel").checked;
    var wantBackup = $("chkExpBackup").checked;
    if (!wantPdf && !wantExcel && !wantBackup) { toast(t("needExportPick")); return; }

    var projIdFilter = $("exportProjectSelect").value || "all";
    var targetProjs = projIdFilter === "all" ? state.projects : state.projects.filter(function (p) { return p.id === projIdFilter; });
    if (!targetProjs.length) { toast(t("exportEmpty")); return; }
    var prefix = targetProjs.length === 1 ? slug(targetProjs[0].estate) + "_" + targetProjs[0].inspectionDate : "Estate_Inspections";
    var countSel = (wantPdf ? 1 : 0) + (wantExcel ? 1 : 0) + (wantBackup ? 1 : 0);

    $("exportStatus").textContent = t("exporting");
    try {
      if (countSel === 1) {
        if (wantPdf) {
          var pdfBlob = await buildPdfBlobForProjects(targetProjs);
          var pdfName = prefix + "_Inspection_Report_" + stampHkt() + ".pdf";
          downloadBlob(pdfBlob, pdfName);
          $("exportStatus").textContent = t("exportDone") + " (" + pdfName + ")";
        } else if (wantExcel) {
          if (typeof JSZip === "undefined") { toast(t("exportFail")); return; }
          var rows = buildExportRows(targetProjs);
          var xlsxBlob = await buildXlsxBlob(rows.recRows);
          var xlsxName = prefix + "_Inspection_Summary_" + stampHkt() + ".xlsx";
          downloadBlob(xlsxBlob, xlsxName);
          $("exportStatus").textContent = t("exportDone") + " (" + xlsxName + ")";
        } else if (wantBackup) {
          var elems = [];
          targetProjs.forEach(function (p) { elems = elems.concat(elementsOf(p.id)); });
          var jsonName = prefix + "_backup_" + stampHkt() + ".json";
          downloadBlob(new Blob([JSON.stringify({ version: 3, exportedAt: new Date().toISOString(), projects: targetProjs, elements: elems }, null, 2)], { type: "application/json" }), jsonName);
          $("exportStatus").textContent = t("exportDone") + " (" + jsonName + ")";
        }
        toast(t("exportDone"));
        return;
      }

      // Multiple selected -> package selected outputs cleanly into one ZIP!
      if (typeof JSZip === "undefined") { toast(t("exportFail")); return; }
      var zip = new JSZip();
      var included = [];
      if (wantPdf) {
        var pName = prefix + "_Inspection_Report.pdf";
        zip.file(pName, await buildPdfBlobForProjects(targetProjs));
        included.push("PDF");
      }
      if (wantExcel) {
        var rData = buildExportRows(targetProjs);
        zip.file(prefix + "_Inspection_Summary.xlsx", await buildXlsxBlob(rData.recRows));
        zip.file("inspection_summary.csv", buildCsv(rData.recRows));
        included.push("Excel");
      }
      if (wantBackup) {
        var bElems = [];
        var rData2 = buildExportRows(targetProjs);
        targetProjs.forEach(function (proj) {
          var els = elementsOf(proj.id);
          bElems = bElems.concat(els);
          els.forEach(function (el, idx) {
            photosOfElement(el.id).forEach(function (p, pi) {
              var fn = "photos/" + slug(proj.estate) + "/" + String(idx + 1).padStart(2, "0") + "_" + slug(el.name) + "_" + String(pi + 1).padStart(2, "0") + ".jpg";
              if (p.blob) zip.file(fn, p.blob);
            });
          });
        });
        zip.file("inspection_photos.csv", buildCsv(rData2.photoRows));
        zip.file("backup.json", JSON.stringify({ version: 3, exportedAt: new Date().toISOString(), projects: targetProjs, elements: bElems }, null, 2));
        included.push("Backup + Photos");
      }
      var zName = prefix + "_" + stampHkt() + ".zip";
      downloadBlob(await zip.generateAsync({ type: "blob" }), zName);
      $("exportStatus").textContent = t("exportDone") + " [" + included.join(" + ") + "] → " + zName;
      toast(t("exportDone"));
    } catch (err) {
      console.error(err);
      $("exportStatus").textContent = t("exportFail");
      toast(t("exportFail"));
    }
  }

  async function runZipExport(projIdFilter) {
    if (typeof JSZip === "undefined") { toast(t("exportFail")); return; }
    var targetProjs = projIdFilter === "all" ? state.projects : state.projects.filter(function (p) { return p.id === projIdFilter; });
    var targetElems = [];
    targetProjs.forEach(function (p) { targetElems = targetElems.concat(elementsOf(p.id)); });
    if (!targetProjs.length) { toast(t("exportEmpty")); return; }

    $("exportStatus").textContent = t("exporting");
    try {
      var zip = new JSZip();
      var header = ["Project ID", "RMO Region", "DMO", "Estate", "Inspection Date", "Handover Date", "SE", "SSE", "Element #", "Structural Element", "Location", "Status", "Rank", "SSE Attention"];
      ALL_ITEMS.forEach(function (it) { header.push(it.code + " " + it.en); });
      header.push("4.3 Others", "5.1 Remarks", "Condition", "External Works", "Element GPS", "Photo Count");

      var recRows = [header];
      var photoRows = [["Estate", "Structural Element", "Location", "Photo File", "Taken At (HKT)", "Caption", "Lat", "Lng", "GPS Source"]];

      targetProjs.forEach(function (proj) {
        var els = elementsOf(proj.id);
        els.forEach(function (el, idx) {
          var phs = photosOfElement(el.id);
          var mr = maxRatingOf(el.ratings);
          var row = [
            proj.id, proj.rmo || "", proj.dmo || "", proj.estate + (proj.estateZh ? " (" + proj.estateZh + ")" : ""), proj.inspectionDate, proj.handoverDate || "", proj.seName || "", proj.sseName || "",
            String(idx + 1), el.name, el.location || "", elemStatusOf(el), mr || "", mr === "S" ? "YES" : "NO"
          ];
          ALL_ITEMS.forEach(function (it) { row.push((el.ratings && el.ratings[it.code]) || ""); });
          row.push(el.othersText || "", el.remarks || "", el.condition || "", el.externalWorks || "", hasCoords(el.gps) ? fmtCoord(el.gps.lat, el.gps.lng) : "", String(phs.length));
          recRows.push(row);

          phs.forEach(function (p, pi) {
            var fn = "photos/" + slug(proj.estate) + "/" + String(idx + 1).padStart(2, "0") + "_" + slug(el.name) + "_" + String(pi + 1).padStart(2, "0") + ".jpg";
            if (p.blob) zip.file(fn, p.blob);
            photoRows.push([proj.estate, el.name, el.location || "", fn, fmtHkt(p.takenAt), p.caption || "", p.lat != null ? p.lat : "", p.lng != null ? p.lng : "", p.gpsSource || ""]);
          });
        });
      });

      var basePrefix = targetProjs.length === 1 ? slug(targetProjs[0].estate) + "_" + targetProjs[0].inspectionDate : "Estate_Inspections";
      zip.file(basePrefix + "_Inspection_Report.pdf", await buildPdfBlobForProjects(targetProjs));
      zip.file(basePrefix + "_Inspection_Summary.xlsx", await buildXlsxBlob(recRows));
      zip.file("inspection_summary.csv", buildCsv(recRows));
      zip.file("inspection_photos.csv", buildCsv(photoRows));
      zip.file("backup.json", JSON.stringify({ version: 3, exportedAt: new Date().toISOString(), projects: targetProjs, elements: targetElems }, null, 2));

      var prefix = targetProjs.length === 1 ? slug(targetProjs[0].estate) + "_" + targetProjs[0].inspectionDate : "Estate_Inspections_v3";
      downloadBlob(await zip.generateAsync({ type: "blob" }), prefix + "_" + stampHkt() + ".zip");
      $("exportStatus").textContent = t("exportDone");
      toast(t("exportDone"));
    } catch (err) {
      console.error(err);
      $("exportStatus").textContent = t("exportFail");
      toast(t("exportFail"));
    }
  }

  async function importJsonBackup(file) {
    try {
      var data = JSON.parse(await file.text());
      var projs = Array.isArray(data.projects) ? data.projects : [];
      var els = Array.isArray(data.elements) ? data.elements : [];
      if (!projs.length) throw new Error("empty");
      for (var i = 0; i < projs.length; i++) await putItem("projects", projs[i]);
      for (var j = 0; j < els.length; j++) { els[j].isDraft = false; await putItem("elements", els[j]); }
      await reloadData();
      toast(t("importDone") + projs.length);
      showTab("projects");
    } catch (e) { toast(t("importFail")); }
  }

  async function refreshStorage() {
    var el = $("storageInfo");
    var summary = state.projects.length + " projects · " + state.elements.filter(function (e) { return !e.isDraft; }).length + " elements · " + state.photos.length + " photos";
    if (navigator.storage && navigator.storage.estimate) {
      try {
        var est = await navigator.storage.estimate();
        el.textContent = t("storage") + ": " + ((est.usage || 0) / (1024 * 1024)).toFixed(2) + " MB (" + summary + ")";
        return;
      } catch (e) {}
    }
    el.textContent = summary;
  }


  function renderEstateAutocomplete() {
    var list = $("estateAcList");
    var master = window.ESTATES_MASTER || [];
    var rmo = $("fieldProjRmo").value || "";
    var q = ($("fieldProjEstate").value || "").trim().toLowerCase();
    var matches = master.filter(function (e) {
      if (rmo && e.r && e.r !== rmo) return false;
      if (!q) return !!rmo;
      return (e.n + " " + e.z + " " + e.c + " " + e.d).toLowerCase().indexOf(q) !== -1;
    }).slice(0, 30);

    if (!matches.length) { list.hidden = true; return; }
    list.innerHTML = "";
    matches.forEach(function (e) {
      var item = document.createElement("div");
      item.className = "ac-item";
      item.innerHTML = '<div><strong>' + xmlEsc(e.n) + (e.z ? ' · ' + xmlEsc(e.z) : '') + '</strong>' +
        '<small>' + xmlEsc([e.d, e.t, e.h ? 'Handover ' + e.h : ''].filter(Boolean).join(' · ')) + '</small></div>' +
        (e.r ? '<span class="ac-tag">' + xmlEsc(e.r) + '</span>' : '');
      item.addEventListener("mousedown", function (ev) {
        ev.preventDefault();
        applyEstateMasterItem(e);
      });
      list.appendChild(item);
    });
    list.hidden = false;
  }

  function applyEstateMasterItem(e) {
    $("fieldProjEstate").value = e.n;
    $("fieldProjEstate").dataset.zh = e.z || "";
    if (e.r) $("fieldProjRmo").value = e.r;
    $("fieldProjDmo").value = e.d || "";
    $("fieldProjHandover").value = e.h || "";
    $("fieldProjNature").value = [e.t, e.m, e.c].filter(Boolean).join(" / ");
    state.pendingEstateCoords = (e.la != null && e.ln != null) ? { lat: e.la, lng: e.ln, accuracy: null, source: "master" } : null;
    $("autofillBanner").textContent = t("autofillMsg") + (e.r ? "[" + e.r + "] " : "") + e.n + (e.z ? " (" + e.z + ")" : "") + (e.h ? " · Handover " + e.h : "");
    $("autofillBanner").hidden = false;
    $("estateAcList").hidden = true;
  }

  /* ---------- Event Binding ---------- */
  function bind() {
    document.querySelectorAll(".tab").forEach(function (btn) {
      btn.addEventListener("click", function () { showTab(btn.getAttribute("data-tab")); });
    });
    $("btnLang").addEventListener("click", function () {
      state.lang = state.lang === "zh" ? "en" : "zh";
      try { localStorage.setItem(LANG_KEY, state.lang); } catch (e) {}
      applyLang();
      if (state.tab === "projects") renderProjects();
      if (state.tab === "projectDetail") renderProjectDetail();
      if (state.tab === "album") renderAlbum();
      if (state.tab === "map") renderMap();
    });
    $("searchProjInput").addEventListener("input", renderProjects);
    document.querySelectorAll("#rmoFilterBar .rmo-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.filterRmo = chip.getAttribute("data-rmo");
        document.querySelectorAll("#rmoFilterBar .rmo-chip").forEach(function (c) { c.classList.toggle("is-active", c === chip); });
        renderProjects();
      });
    });
    $("fieldProjEstate").addEventListener("input", function () {
      $("fieldProjEstate").dataset.zh = "";
      renderEstateAutocomplete();
    });
    $("fieldProjEstate").addEventListener("focus", renderEstateAutocomplete);
    $("fieldProjRmo").addEventListener("change", function () {
      if (document.activeElement === $("fieldProjRmo")) renderEstateAutocomplete();
    });
    $("fieldProjEstate").addEventListener("blur", function () {
      setTimeout(function () { $("estateAcList").hidden = true; }, 180);
    });

    $("btnNewProject").addEventListener("click", function () { openProjectModal(null); });
    $("btnEditProject").addEventListener("click", function () { openProjectModal(getProject(state.currentProjectId)); });
    $("btnProjCancel").addEventListener("click", function () { $("projectModal").hidden = true; });
    $("projectForm").addEventListener("submit", function (e) { e.preventDefault(); saveProjectForm(); });
    $("btnBackToProjects").addEventListener("click", function () { showTab("projects"); });
    $("btnBackToProject").addEventListener("click", function () { showTab("projectDetail"); });
    $("btnAddElement").addEventListener("click", startNewElement);
    $("btnProjectReport").addEventListener("click", function () { openProjectReport(state.currentProjectId); });
    $("btnProjectZip").addEventListener("click", function () { runZipExport(state.currentProjectId); });
    $("btnDeleteProject").addEventListener("click", async function () {
      if (!state.currentProjectId || !(await showConfirm(t("confirmDelProj")))) return;
      await deleteProjectCascade(state.currentProjectId);
      state.currentProjectId = null; state.currentElementId = null;
      await reloadData(); toast(t("deleted")); showTab("projects");
    });

    $("searchElemInput").addEventListener("input", renderProjectDetail);
    document.querySelectorAll("#statusFilterBar .chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.filterStatus = chip.getAttribute("data-filter");
        document.querySelectorAll("#statusFilterBar .chip").forEach(function (c) { c.classList.toggle("is-active", c === chip); });
        renderProjectDetail();
      });
    });

    $("elementForm").addEventListener("submit", function (e) { e.preventDefault(); saveElementForm(); });
    $("btnCancelElem").addEventListener("click", async function () {
      await cleanupEmptyElementDraft();
      state.currentElementId = null; state.isNewElementUnsaved = false;
      showTab("projectDetail");
    });
    $("btnDeleteElem").addEventListener("click", async function () {
      if (!state.currentElementId || !(await showConfirm(t("confirmDelElem")))) return;
      await deleteElementCascade(state.currentElementId);
      state.currentElementId = null; state.isNewElementUnsaved = false;
      await reloadData(); toast(t("deleted")); showTab("projectDetail");
    });
    $("btnElemReport").addEventListener("click", function () { openSingleElementReport(state.currentElementId); });
    $("btnFillNa").addEventListener("click", function () {
      ALL_ITEMS.forEach(function (it) { if (!state.currentRatings[it.code]) state.currentRatings[it.code] = "NA"; });
      updateChecklistSelection();
    });
    $("btnClearRatings").addEventListener("click", function () { state.currentRatings = {}; clearOverallQuickHighlight(); updateChecklistSelection(); });
    if ($("fieldWorksSelect")) {
      $("fieldWorksSelect").addEventListener("change", function () {
        var val = $("fieldWorksSelect").value;
        if (!val) return;
        var cur = ($("fieldWorks").value || "").trim();
        $("fieldWorks").value = cur ? (cur.indexOf(val) === -1 ? cur + ", " + val : cur) : val;
        $("fieldWorksSelect").value = "";
      });
    }
    if ($("fieldElemSelect")) {
      $("fieldElemSelect").addEventListener("change", function () {
        var val = $("fieldElemSelect").value;
        var inp = $("fieldElemName");
        if (val === "__CUSTOM__") {
          inp.value = "";
          inp.hidden = false;
          inp.required = true;
          inp.focus();
        } else {
          inp.value = val;
          inp.hidden = true;
          inp.required = false;
          if (val) applySmartNaPreset(val);
        }
      });
    }
    if ($("overallGradeBar")) {
      $("overallGradeBar").addEventListener("click", function (e) {
        var btn = e.target.closest(".grade-quick-btn");
        if (!btn) return;
        var grade = btn.getAttribute("data-grade");
        var skipNa = $("chkSkipNa") ? $("chkSkipNa").checked : true;
        clearOverallQuickHighlight();
        btn.classList.add("is-active");
        ALL_ITEMS.forEach(function (it) {
          if (grade !== "NA" && skipNa && (state.currentRatings[it.code] === "NA" || state.currentRatings[it.code] === "N.A.")) return;
          state.currentRatings[it.code] = grade;
        });
        updateChecklistSelection();
        toast(t("overallAppliedToast") + grade);
      });
    }
    $("btnRefreshGps").addEventListener("click", async function () {
      $("elemGpsText").textContent = t("gpsLoading");
      var gps = await getDeviceGps();
      if (hasCoords(gps)) { state.currentGps = gps; toast(t("hasCoords")); } else toast(t("noCoords"));
      updateElemGpsText();
    });
    $("btnPickMapLoc").addEventListener("click", openMapPicker);
    $("btnPickerCancel").addEventListener("click", function () { $("pickerModal").hidden = true; });
    $("btnPickerApply").addEventListener("click", function () {
      if (state.pickerLatLng) {
        state.currentGps = { lat: state.pickerLatLng.lat, lng: state.pickerLatLng.lng, accuracy: null, source: "manual" };
        updateElemGpsText(); toast(t("hasCoords"));
      }
      $("pickerModal").hidden = true;
    });
    $("btnTakePhoto").addEventListener("click", function () { $("fileCamera").value = ""; $("fileCamera").click(); });
    $("btnPickPhoto").addEventListener("click", function () { $("fileLibrary").value = ""; $("fileLibrary").click(); });
    $("fileCamera").addEventListener("change", function (e) { addPhotoFiles(e.target.files, true); });
    $("fileLibrary").addEventListener("change", function (e) { addPhotoFiles(e.target.files, false); });

    $("albumProjectFilter").addEventListener("change", renderAlbum);
    $("mapProjectFilter").addEventListener("change", renderMap);
    $("btnToggleBasemap").addEventListener("click", function () {
      state.basemap = state.basemap === "arcgis" ? "osm" : "arcgis";
      try { localStorage.setItem(BASEMAP_KEY, state.basemap); } catch (e) {}
      $("btnToggleBasemap").textContent = state.basemap === "arcgis" ? t("basemapArcgis") : t("basemapOsm");
      if (state.map && state.tileLayer) { state.map.removeLayer(state.tileLayer); state.tileLayer = createBasemapLayer().addTo(state.map); }
    });

    function setExportPreset(pdf, excel, backup, activeId) {
      $("chkExpPdf").checked = pdf;
      $("chkExpExcel").checked = excel;
      $("chkExpBackup").checked = backup;
      ["prePdfOnly", "preExcelOnly", "preBackupOnly", "preBothAll"].forEach(function (id) {
        $(id).classList.toggle("is-active", id === activeId);
      });
    }
    $("prePdfOnly").addEventListener("click", function () { setExportPreset(true, false, false, "prePdfOnly"); });
    $("preExcelOnly").addEventListener("click", function () { setExportPreset(false, true, false, "preExcelOnly"); });
    $("preBackupOnly").addEventListener("click", function () { setExportPreset(false, false, true, "preBackupOnly"); });
    $("preBothAll").addEventListener("click", function () { setExportPreset(true, true, true, "preBothAll"); });
    $("btnExportSelected").addEventListener("click", runSelectedExport);
    $("btnImportBackup").addEventListener("click", function () { $("fileImportBackup").value = ""; $("fileImportBackup").click(); });
    $("fileImportBackup").addEventListener("change", function (e) { if (e.target.files && e.target.files[0]) importJsonBackup(e.target.files[0]); });
    $("btnClearAll").addEventListener("click", async function () {
      if (!(await showConfirm(t("confirmClear")))) return;
      await clearAllData();
      state.currentProjectId = null; state.currentElementId = null;
      await reloadData(); toast(t("cleared")); showTab("projects"); refreshStorage();
    });

    $("btnCloseReport").addEventListener("click", function () { $("reportModal").hidden = true; });
    $("btnReportClose2").addEventListener("click", function () { $("reportModal").hidden = true; });
    $("btnReportDownloadPdf").addEventListener("click", async function () {
      var list = state.lastReportProjs && state.lastReportProjs.length ? state.lastReportProjs : (state.currentProjectId ? [getProject(state.currentProjectId)].filter(Boolean) : []);
      if (!list.length) return;
      toast(t("exporting"));
      var blob = await buildPdfBlobForProjects(list);
      var nm = (list.length === 1 ? slug(list[0].estate) + "_" + list[0].inspectionDate : "Estate_Inspections") + "_Inspection_Report.pdf";
      downloadBlob(blob, nm);
      toast(t("exportDone"));
    });
    $("btnReportPrintNow").addEventListener("click", function () { window.print(); });
    $("btnCloseLightbox").addEventListener("click", function () { $("lightbox").hidden = true; $("lightboxImg").removeAttribute("src"); });
    $("lightbox").addEventListener("click", function (e) { if (e.target === $("lightbox")) { $("lightbox").hidden = true; $("lightboxImg").removeAttribute("src"); } });
    $("btnLayoutMode").addEventListener("click", function () {
      state.layoutPref = state.layoutPref === "auto" ? "phone" : (state.layoutPref === "phone" ? "ipad" : "auto");
      try { localStorage.setItem(LAYOUT_KEY, state.layoutPref); } catch (e) {}
      applyAdaptiveLayout();
    });
    window.addEventListener("resize", applyAdaptiveLayout);
    window.addEventListener("online", updateConnBadge);
    window.addEventListener("offline", updateConnBadge);
  }

  async function init() {
    try {
      var sl = localStorage.getItem(LANG_KEY); if (sl === "en" || sl === "zh") state.lang = sl;
      var sb = localStorage.getItem(BASEMAP_KEY); if (sb === "osm" || sb === "arcgis") state.basemap = sb;
      var lp = localStorage.getItem(LAYOUT_KEY); if (lp === "auto" || lp === "phone" || lp === "ipad") state.layoutPref = lp;
    } catch (e) {}
    bind();
    applyLang();
    await reloadData();
    for (var i = 0; i < state.elements.length; i++) {
      var e = state.elements[i];
      if (e.isDraft && !photosOfElement(e.id).length && !e.name) await deleteElementCascade(e.id);
    }
    await reloadData();
    populateProjectDropdowns();
    renderProjects();
    registerPwa();
  }
  init();
})();
