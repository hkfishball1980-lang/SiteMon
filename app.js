/* Site Inspection v2.0 — Offline iPad PWA with HD Structural Inspection Checklist (Appendix X) */
(function () {
  "use strict";

  var APP_DB = "site-inspection-v1";
  var APP_VER = 1;
  var LANG_KEY = "site-inspection-v2-lang";
  var BASEMAP_KEY = "site-inspection-v2-basemap";
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
  CHECKLIST_SCHEMA.forEach(function (sec) {
    sec.items.forEach(function (it) { ALL_ITEMS.push(it); });
  });

  var RATINGS = ["1", "2", "3", "4", "5", "N.A."];

  var I18N = {
    zh: {
      htmlLang: "zh-HK",
      title: "地盤巡查",
      tagline: "離線 iPad 結構巡查（HD Appendix X）· 資料只存本機",
      langBtn: "EN",
      tabRecords: "紀錄",
      tabEdit: "新增",
      tabEditOpen: "編輯",
      tabAlbum: "相簿",
      tabMap: "地圖",
      tabExport: "匯出",
      search: "搜尋屋邨、DMO、構建物、備註或現況",
      newRecord: "新增巡查",
      fltAll: "全部",
      fltSse: "需 SSE 關注 (4–5)",
      fltFollowup: "跟進中",
      fltNormal: "正常",
      emptyRecords: "未有符合條件嘅巡查紀錄。撳「新增巡查」開始。",
      emptyAlbum: "未有相片。喺紀錄入面影相或選相後，會喺呢度出現。",
      secHeaderTitle: "基本資料（HD Appendix X）",
      secChecklistTitle: "結構巡查評級 Checklist（1 良好 – 5 嚴重 / N.A.）",
      secRemarksTitle: "5.1 備註、補充說明及簽署",
      printReport: "列印 Appendix X 報告",
      when: "巡查日期時間（自動）",
      dmo: "DMO",
      site: "屋邨／地盤名稱 (Estate) *",
      structure: "巡查構建物 (Inspected Structure)",
      handover: "移交日期 (Handover Date)",
      status: "巡查狀態",
      statusNormal: "正常 (Normal)",
      statusFollowup: "跟進中 (Follow-up)",
      statusSse: "需 SSE 關注 (Rating 4–5)",
      recGps: "紀錄定位：",
      refreshGps: "更新 GPS",
      pickMapLoc: "地圖點選補位",
      gpsLoading: "定位中…",
      fillNa: "未填項設為 N.A.",
      clearRatings: "清除評級",
      checklistHint: "評級：1–3 一般至可接受；4 = Poor（差）；5 = Severe（嚴重）。如任何項目選 4 或 5，請於 5.1 Remarks 詳述並提請 SSE 關注。",
      sseAlert: "⚠️ 偵測到評級 4 (Poor) 或 5 (Severe)：請務必喺下方「5.1 Remarks」詳細說明結構狀況，並提請 SSE 關注。",
      othersPlaceholder: "請輸入 4.3 其他巡查項目名稱…",
      remarks: "5.1 Remarks（結構狀況詳述／SSE 關注事項）",
      condition: "現場現況補充（可選）",
      works: "External works 說明（可選）",
      seName: "Reported by SE（姓名／職位）",
      sseName: "Endorsed by SSE（姓名／職位）",
      photos: "巡查相片",
      takePhoto: "影相",
      pickPhoto: "從相簿選取",
      photoHint: "開啟新紀錄時已自動預熱 GPS；相片會自動讀取 EXIF 或裝置定位（無訊號亦可用紀錄定位兜底），每張相片下方可直接輸入備註。",
      photoNotePlaceholder: "輸入相片備註…",
      save: "儲存紀錄",
      exportSingle: "匯出此紀錄 ZIP",
      cancel: "取消",
      delete: "刪除紀錄",
      confirmOk: "確定",
      confirmDelete: "確定刪除呢條紀錄同佢嘅相片？此操作唔可以還原。",
      confirmClear: "確定清除呢部裝置上所有巡查紀錄同相片？此操作唔可以還原。",
      draftCancel: "取消後會放棄今次未儲存嘅新紀錄同相片。確定？",
      sseRemarksConfirm: "呢條紀錄有評級 4 或 5 項目，但「5.1 Remarks」仲係空白。確定照樣儲存？",
      saved: "已儲存紀錄",
      deleted: "已刪除紀錄",
      cancelled: "已取消",
      noCoords: "無坐標",
      hasCoords: "有坐標",
      photosCount: "張相",
      exportTitle: "匯出與備份還原",
      exportBlurb: "在本機產生 ZIP（含 Appendix X 完整 Excel、CSV、JSON 備份檔及相片）。可按日期篩選匯出，避免相片過多。",
      dateFrom: "開始日期（可選）",
      dateTo: "結束日期（可選）",
      exportBtn: "匯出 ZIP",
      importBtn: "匯入 JSON 備份還原",
      importDone: "備份還原完成：",
      importFail: "無法讀取備份檔，請確認係本 App 匯出嘅 backup.json。",
      exportEmpty: "所選範圍內未有紀錄可以匯出。",
      exportDone: "已開始下載 ZIP 匯出檔。",
      exportFail: "匯出失敗。",
      exporting: "正在打包匯出…",
      privacyTitle: "私隱同儲存空間",
      privacyBlurb: "所有巡查資料同相片只存放於本機瀏覽器 IndexedDB，唔會上傳任何伺服器。建議定期匯出 ZIP 備份。",
      clearAll: "清除全部資料",
      cleared: "已清除全部資料",
      storage: "儲存用量",
      storageUnknown: "瀏覽器未提供用量數字。",
      fileBanner: "目前為本機檔（file://）模式。建議部署到 GitHub Pages（HTTPS）並以 iPad Safari 開啟，以啟用相機、GPS 及離線快取。",
      insecureBanner: "目前頁面並非 HTTPS，相機、GPS 與離線安裝可能受限。",
      offline: "離線",
      online: "已連線",
      mapHintOnline: "線上地圖模式。標記來自巡查相片及紀錄坐標。",
      mapHintOffline: "目前離線，顯示坐標清單同簡易相對位置圖。",
      mapEmpty: "未有帶坐標嘅紀錄或相片。",
      basemapArcgis: "底圖：街道圖（按此切衛星圖）",
      basemapOsm: "底圖：衛星圖（按此切街道圖）",
      noGpsPhoto: "已儲存相片（無坐標）",
      gpsPhoto: "已儲存相片（已附坐標）",
      photoFail: "無法處理呢張相片。",
      needSite: "請填寫屋邨／地盤名稱。",
      lightboxClose: "關閉",
      pickerTitle: "地圖點選補錄坐標",
      pickerHint: "點擊地圖任何位置放置標記，再按「套用坐標」。",
      pickerApply: "套用坐標",
      reportModalTitle: "HD Appendix X 結構巡查摘要報告預覽",
      reportPrintNow: "列印／存為 PDF",
      simplePlot: "簡易相對位置圖",
      maxRate: "最高評級"
    },
    en: {
      htmlLang: "en",
      title: "Site Inspection",
      tagline: "Offline iPad Structural Inspection (HD Appendix X) · Local Only",
      langBtn: "中文",
      tabRecords: "Records",
      tabEdit: "New",
      tabEditOpen: "Edit",
      tabAlbum: "Album",
      tabMap: "Map",
      tabExport: "Export",
      search: "Search estate, DMO, structure, remarks, or condition",
      newRecord: "New Inspection",
      fltAll: "All",
      fltSse: "SSE Attention (4–5)",
      fltFollowup: "Follow-up",
      fltNormal: "Normal",
      emptyRecords: "No matching inspection records. Tap “New Inspection” to start.",
      emptyAlbum: "No photos yet. Photos added to records appear here.",
      secHeaderTitle: "Inspection Header (HD Appendix X)",
      secChecklistTitle: "Structural Inspection Checklist (1 Good – 5 Severe / N.A.)",
      secRemarksTitle: "5.1 Remarks, Notes & Sign-off",
      printReport: "Print Appendix X Report",
      when: "Inspection Date & Time (Auto)",
      dmo: "DMO",
      site: "Estate / Site Name *",
      structure: "Inspected Structure",
      handover: "Handover Date (mm/yyyy)",
      status: "Status",
      statusNormal: "Normal",
      statusFollowup: "Follow-up",
      statusSse: "SSE Attention (Rating 4–5)",
      recGps: "Record Location:",
      refreshGps: "Refresh GPS",
      pickMapLoc: "Pick on Map",
      gpsLoading: "Locating…",
      fillNa: "Set Empty to N.A.",
      clearRatings: "Clear Ratings",
      checklistHint: "Ratings: 1–3 Acceptable; 4 = Poor; 5 = Severe. For ratings 4 or 5, elaborate in 5.1 Remarks and draw SSE's attention.",
      sseAlert: "⚠️ Rating 4 (Poor) or 5 (Severe) detected: Please elaborate structural conditions in 5.1 Remarks and draw SSE's attention.",
      othersPlaceholder: "Specify 4.3 Others item…",
      remarks: "5.1 Remarks (Elaboration / SSE Attention)",
      condition: "Current Condition (Optional)",
      works: "External Works Description (Optional)",
      seName: "Reported by SE (Name / Post)",
      sseName: "Endorsed by SSE (Name / Post)",
      photos: "Inspection Photos",
      takePhoto: "Take Photo",
      pickPhoto: "Choose from Library",
      photoHint: "GPS pre-warms automatically when creating a record. Photos use EXIF, device GPS, or record location fallback. Add captions below each photo.",
      photoNotePlaceholder: "Add photo caption…",
      save: "Save Record",
      exportSingle: "Export This Record ZIP",
      cancel: "Cancel",
      delete: "Delete Record",
      confirmOk: "Confirm",
      confirmDelete: "Delete this record and its photos? This cannot be undone.",
      confirmClear: "Clear all inspection records and photos on this device? This cannot be undone.",
      draftCancel: "Discard this unsaved inspection record and its photos?",
      sseRemarksConfirm: "This record has rating 4 or 5 items, but 5.1 Remarks is empty. Save anyway?",
      saved: "Record saved",
      deleted: "Record deleted",
      cancelled: "Cancelled",
      noCoords: "No coordinates",
      hasCoords: "Geotagged",
      photosCount: "photos",
      exportTitle: "Export & Backup Restore",
      exportBlurb: "Generates a local ZIP with Appendix X Excel, CSV, JSON backup, and photos. Filter by date range if needed.",
      dateFrom: "From Date (Optional)",
      dateTo: "To Date (Optional)",
      exportBtn: "Export ZIP",
      importBtn: "Restore JSON Backup",
      importDone: "Backup restored: ",
      importFail: "Could not parse backup file. Please choose a backup.json exported by this app.",
      exportEmpty: "No records match the selected date range.",
      exportDone: "ZIP export download started.",
      exportFail: "Export failed.",
      exporting: "Packaging ZIP…",
      privacyTitle: "Privacy & Storage",
      privacyBlurb: "All records and photos stay in local browser IndexedDB storage. Export ZIP backups regularly.",
      clearAll: "Clear All Data",
      cleared: "All data cleared",
      storage: "Storage used",
      storageUnknown: "Browser did not report storage usage.",
      fileBanner: "Opened via file://. Deploy to GitHub Pages (HTTPS) and open in iPad Safari for camera, GPS, and offline PWA.",
      insecureBanner: "Not served over HTTPS. Camera, GPS, and offline install may be limited.",
      offline: "Offline",
      online: "Online",
      mapHintOnline: "Online map. Markers come from inspection photos and record locations.",
      mapHintOffline: "Offline mode: showing coordinate list and simple relative plot.",
      mapEmpty: "No geotagged records or photos yet.",
      basemapArcgis: "Basemap: Street (Switch to Satellite)",
      basemapOsm: "Basemap: Satellite (Switch to Street)",
      noGpsPhoto: "Photo saved (no coordinates)",
      gpsPhoto: "Photo saved (geotagged)",
      photoFail: "Could not process this photo.",
      needSite: "Please enter Estate / Site Name.",
      lightboxClose: "Close",
      pickerTitle: "Pick Location on Map",
      pickerHint: "Tap anywhere on the map to place a pin, then tap Apply.",
      pickerApply: "Apply Location",
      reportModalTitle: "HD Appendix X Structural Inspection Summary",
      reportPrintNow: "Print / Save PDF",
      simplePlot: "Simple Relative Plot",
      maxRate: "Max Rating"
    }
  };

  var state = {
    lang: "zh",
    basemap: "arcgis",
    tab: "records",
    filterStatus: "all",
    records: [],
    photosByRecord: {},
    currentId: null,
    isNewUnsaved: false,
    currentRatings: {},
    currentOthersText: "",
    currentGps: null,
    map: null,
    tileLayer: null,
    pickerMap: null,
    pickerMarker: null,
    pickerLatLng: null,
    objectUrls: [],
    savingPhoto: false
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

  function showConfirm(msg) {
    return new Promise(function (resolve) {
      var overlay = $("confirmModal");
      $("confirmMsg").textContent = msg;
      $("btnConfirmOk").textContent = t("confirmOk");
      $("btnConfirmCancel").textContent = t("cancel");
      overlay.hidden = false;
      function done(val) {
        overlay.hidden = true;
        $("btnConfirmOk").removeEventListener("click", onOk);
        $("btnConfirmCancel").removeEventListener("click", onCancel);
        resolve(val);
      }
      function onOk() { done(true); }
      function onCancel() { done(false); }
      $("btnConfirmOk").addEventListener("click", onOk);
      $("btnConfirmCancel").addEventListener("click", onCancel);
    });
  }

  function hktParts(date) {
    var fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    });
    var map = {};
    fmt.formatToParts(date).forEach(function (p) { if (p.type !== "literal") map[p.type] = p.value; });
    return map;
  }

  function fmtHkt(iso) {
    if (!iso) return "";
    var p = hktParts(new Date(iso));
    return p.year + "-" + p.month + "-" + p.day + " " + p.hour + ":" + p.minute;
  }

  function fmtDateShort(iso) {
    if (!iso) return "";
    var p = hktParts(new Date(iso));
    return p.day + "/" + p.month + "/" + p.year;
  }

  function fmtDateYmd(iso) {
    if (!iso) return "";
    var p = hktParts(new Date(iso));
    return p.year + "-" + p.month + "-" + p.day;
  }

  function stampHkt(iso) {
    var p = hktParts(iso ? new Date(iso) : new Date());
    return p.year + p.month + p.day + "-" + p.hour + p.minute + p.second;
  }

  function slug(s) {
    return (String(s || "").trim().replace(/[\\/:*?"<>|]+/g, "_").replace(/\s+/g, "_") || "site").slice(0, 40);
  }

  function hasCoords(obj) {
    return !!(obj && typeof obj.lat === "number" && typeof obj.lng === "number" && isFinite(obj.lat) && isFinite(obj.lng));
  }

  function fmtCoord(lat, lng) {
    if (!hasCoords({ lat: lat, lng: lng })) return t("noCoords");
    return lat.toFixed(6) + ", " + lng.toFixed(6);
  }

  function maxRatingOf(ratings) {
    var max = 0;
    Object.keys(ratings || {}).forEach(function (k) {
      var n = parseInt(ratings[k], 10);
      if (!isNaN(n) && n > max) max = n;
    });
    return max;
  }

  function hasSevereRating(ratings) {
    return maxRatingOf(ratings) >= 4;
  }

  /* ---------- IndexedDB with in-memory fallback ---------- */
  var dbPromise = null;
  var memStore = { records: {}, photos: {} };
  var useMem = false;

  function openDb() {
    if (useMem) return Promise.resolve(null);
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve) {
      if (!window.indexedDB) { useMem = true; resolve(null); return; }
      try {
        var req = indexedDB.open(APP_DB, APP_VER);
        req.onupgradeneeded = function () {
          var db = req.result;
          if (!db.objectStoreNames.contains("records")) db.createObjectStore("records", { keyPath: "id" });
          if (!db.objectStoreNames.contains("photos")) {
            var ps = db.createObjectStore("photos", { keyPath: "id" });
            ps.createIndex("byRecord", "recordId", { unique: false });
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
      tx.onabort = function () { rej(tx.error || new Error("aborted")); };
    });
  }
  function reqDone(req) {
    return new Promise(function (res, rej) {
      req.onsuccess = function () { res(req.result); };
      req.onerror = function () { rej(req.error); };
    });
  }

  async function getAllRecords() {
    var db = await openDb();
    if (!db) return Object.values(memStore.records);
    return reqDone(db.transaction("records").objectStore("records").getAll());
  }
  async function getAllPhotos() {
    var db = await openDb();
    if (!db) return Object.values(memStore.photos);
    return reqDone(db.transaction("photos").objectStore("photos").getAll());
  }
  async function getRecord(id) {
    var db = await openDb();
    if (!db) return memStore.records[id] || null;
    return reqDone(db.transaction("records").objectStore("records").get(id));
  }
  async function putRecord(rec) {
    var db = await openDb();
    if (!db) { memStore.records[rec.id] = rec; return; }
    var tx = db.transaction("records", "readwrite");
    tx.objectStore("records").put(rec);
    await txDone(tx);
  }
  async function putPhoto(photo) {
    var db = await openDb();
    if (!db) { memStore.photos[photo.id] = photo; return; }
    var tx = db.transaction("photos", "readwrite");
    tx.objectStore("photos").put(photo);
    await txDone(tx);
  }
  async function photosFor(recordId) {
    var db = await openDb();
    if (!db) return Object.values(memStore.photos).filter(function (p) { return p.recordId === recordId; });
    return reqDone(db.transaction("photos").objectStore("photos").index("byRecord").getAll(recordId));
  }
  async function deletePhoto(id) {
    var db = await openDb();
    if (!db) { delete memStore.photos[id]; return; }
    var tx = db.transaction("photos", "readwrite");
    tx.objectStore("photos").delete(id);
    await txDone(tx);
  }
  async function deleteRecordAndPhotos(id) {
    var list = await photosFor(id);
    var db = await openDb();
    if (!db) {
      delete memStore.records[id];
      list.forEach(function (p) { delete memStore.photos[p.id]; });
      return;
    }
    var tx = db.transaction(["records", "photos"], "readwrite");
    tx.objectStore("records").delete(id);
    list.forEach(function (p) { tx.objectStore("photos").delete(p.id); });
    await txDone(tx);
  }
  async function clearAllData() {
    var db = await openDb();
    if (!db) { memStore.records = {}; memStore.photos = {}; return; }
    var tx = db.transaction(["records", "photos"], "readwrite");
    tx.objectStore("records").clear();
    tx.objectStore("photos").clear();
    await txDone(tx);
  }

  /* ---------- GPS & EXIF ---------- */
  function getDeviceGps() {
    return new Promise(function (resolve) {
      if (!navigator.geolocation) { resolve(null); return; }
      var done = false;
      var timer = setTimeout(function () { if (!done) { done = true; resolve(null); } }, 8500);
      try {
        navigator.geolocation.getCurrentPosition(
          function (pos) {
            if (done) return;
            done = true; clearTimeout(timer);
            resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, source: "device" });
          },
          function () { if (!done) { done = true; clearTimeout(timer); resolve(null); } },
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 20000 }
        );
      } catch (e) { clearTimeout(timer); resolve(null); }
    });
  }

  function getAscii(view, offset, len) {
    var s = "";
    for (var i = 0; i < len; i++) s += String.fromCharCode(view.getUint8(offset + i));
    return s;
  }
  function readRational(view, offset, le) {
    var num = view.getUint32(offset, le), den = view.getUint32(offset + 4, le);
    return den ? num / den : 0;
  }
  function findTagOffset(view, ifd, tiffStart, le, tag) {
    if (ifd + 2 > view.byteLength) return null;
    var n = view.getUint16(ifd, le);
    for (var i = 0; i < n; i++) {
      var entry = ifd + 2 + i * 12;
      if (entry + 12 > view.byteLength) break;
      if (view.getUint16(entry, le) === tag) return view.getUint32(entry + 8, le);
    }
    return null;
  }
  function findTagValue(view, ifd, tiffStart, le, tag, kind) {
    if (ifd + 2 > view.byteLength) return null;
    var n = view.getUint16(ifd, le);
    for (var i = 0; i < n; i++) {
      var entry = ifd + 2 + i * 12;
      if (entry + 12 > view.byteLength) break;
      if (view.getUint16(entry, le) !== tag) continue;
      var count = view.getUint32(entry + 4, le);
      var valueOff = entry + 8;
      if (kind === "ascii") {
        var bytes = count > 4 ? tiffStart + view.getUint32(valueOff, le) : valueOff;
        var s = "";
        for (var c = 0; c < count && bytes + c < view.byteLength; c++) {
          var ch = view.getUint8(bytes + c);
          if (ch === 0) break;
          s += String.fromCharCode(ch);
        }
        return s;
      }
      if (kind === "rational3") {
        var start = tiffStart + view.getUint32(valueOff, le);
        if (start + 24 > view.byteLength) return null;
        return readRational(view, start, le) + readRational(view, start + 8, le) / 60 + readRational(view, start + 16, le) / 3600;
      }
    }
    return null;
  }
  function readGpsFromExif(buffer) {
    try {
      var view = new DataView(buffer);
      if (view.byteLength < 12 || view.getUint16(0, false) !== 0xffd8) return null;
      var offset = 2;
      while (offset + 4 < view.byteLength) {
        if (view.getUint8(offset) !== 0xff) break;
        var marker = view.getUint8(offset + 1);
        var size = view.getUint16(offset + 2, false);
        if (marker === 0xe1) {
          var start = offset + 4;
          if (start + 6 < view.byteLength && getAscii(view, start, 4) === "Exif") {
            var tiffStart = start + 6;
            var endian = view.getUint16(tiffStart, false);
            var le = endian === 0x4949 ? true : (endian === 0x4d4d ? false : null);
            if (le === null || view.getUint16(tiffStart + 2, le) !== 0x002a) return null;
            var ifd0 = tiffStart + view.getUint32(tiffStart + 4, le);
            var gpsOffset = findTagOffset(view, ifd0, tiffStart, le, 0x8825);
            if (gpsOffset == null) return null;
            var gpsIfd = tiffStart + gpsOffset;
            var latRef = findTagValue(view, gpsIfd, tiffStart, le, 0x0001, "ascii");
            var lngRef = findTagValue(view, gpsIfd, tiffStart, le, 0x0003, "ascii");
            var lat = findTagValue(view, gpsIfd, tiffStart, le, 0x0002, "rational3");
            var lng = findTagValue(view, gpsIfd, tiffStart, le, 0x0004, "rational3");
            if (lat == null || lng == null) return null;
            return {
              lat: (latRef && latRef.charAt(0).toUpperCase() === "S" ? -1 : 1) * lat,
              lng: (lngRef && lngRef.charAt(0).toUpperCase() === "W" ? -1 : 1) * lng,
              accuracy: null, source: "exif"
            };
          }
        }
        if (marker === 0xda) break;
        offset += 2 + size;
      }
    } catch (e) { return null; }
    return null;
  }

  /* ---------- Image Decoding & Resizing ---------- */
  async function fileToArrayBuffer(file) {
    if (file.arrayBuffer) return file.arrayBuffer();
    return new Promise(function (res, rej) {
      var fr = new FileReader();
      fr.onload = function () { res(fr.result); };
      fr.onerror = function () { rej(fr.error); };
      fr.readAsArrayBuffer(file);
    });
  }
  async function decodeImage(blob) {
    if (window.createImageBitmap) {
      try { return await createImageBitmap(blob); } catch (e) {}
    }
    var u = URL.createObjectURL(blob);
    try {
      return await new Promise(function (res, rej) {
        var img = new Image();
        img.onload = function () { res(img); };
        img.onerror = function () { rej(new Error("img")); };
        img.src = u;
      });
    } finally { URL.revokeObjectURL(u); }
  }
  function drawToBlob(source, maxEdge, quality) {
    var w = source.width || source.naturalWidth, h = source.height || source.naturalHeight;
    var scale = Math.min(1, maxEdge / Math.max(w, h));
    var cw = Math.max(1, Math.round(w * scale)), ch = Math.max(1, Math.round(h * scale));
    var canvas = document.createElement("canvas");
    canvas.width = cw; canvas.height = ch;
    canvas.getContext("2d").drawImage(source, 0, 0, cw, ch);
    return new Promise(function (res, rej) {
      canvas.toBlob(function (blob) {
        if (!blob) rej(new Error("toBlob")); else res({ blob: blob, width: cw, height: ch });
      }, "image/jpeg", quality);
    });
  }

  /* ---------- Export helpers (CSV + XLSX) ---------- */
  function xmlEsc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function csvEsc(s) {
    var v = s == null ? "" : String(s);
    return /[",\r\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }
  function buildCsv(rows) {
    return "\uFEFF" + rows.map(function (r) { return r.map(csvEsc).join(","); }).join("\r\n");
  }
  function colName(n) {
    var s = "", x = n;
    while (x > 0) { var m = (x - 1) % 26; s = String.fromCharCode(65 + m) + s; x = Math.floor((x - 1) / 26); }
    return s;
  }
  function buildXlsxBlob(rows) {
    var sheetRows = rows.map(function (row, r) {
      var cells = row.map(function (val, c) {
        return '<c r="' + colName(c + 1) + (r + 1) + '" t="inlineStr"><is><t>' + xmlEsc(val) + "</t></is></c>";
      }).join("");
      return '<row r="' + (r + 1) + '">' + cells + "</row>";
    }).join("");
    var zip = new JSZip();
    zip.file("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>');
    zip.file("_rels/.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
    zip.file("xl/workbook.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Inspection_Records" sheetId="1" r:id="rId1"/></sheets></workbook>');
    zip.file("xl/_rels/workbook.xml.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>');
    zip.file("xl/worksheets/sheet1.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>' + sheetRows + "</sheetData></worksheet>");
    return zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }

  /* ---------- UI Helpers ---------- */
  function toast(msg) {
    var el = $("toast");
    el.textContent = msg;
    el.hidden = false;
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
  function isFileProtocol() { return location.protocol === "file:"; }
  function registerPwa() {
    if (isFileProtocol() || !("serviceWorker" in navigator) || !window.isSecureContext) return;
    navigator.serviceWorker.register("./sw.js").catch(function (err) { console.warn("SW skipped", err); });
  }
  function updateBanner() {
    var el = $("modeBanner");
    if (isFileProtocol()) { el.textContent = t("fileBanner"); el.hidden = false; }
    else if (!window.isSecureContext) { el.textContent = t("insecureBanner"); el.hidden = false; }
    else { el.hidden = true; }
  }
  function updateConnBadge() {
    var el = $("connBadge");
    if (isFileProtocol()) { el.hidden = true; return; }
    el.hidden = false;
    el.textContent = navigator.onLine ? t("online") : t("offline");
  }

  /* ---------- Render Checklist ---------- */
  function renderChecklistUi() {
    var wrap = $("checklistContainer");
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
        if (state.lang === "zh") {
          lbl.innerHTML = xmlEsc(item.zh) + "<small>" + xmlEsc(item.en) + "</small>";
        } else {
          lbl.textContent = item.en;
        }
        if (item.hasCustomText) {
          var inp = document.createElement("input");
          inp.type = "text";
          inp.id = "fieldOthersText";
          inp.placeholder = t("othersPlaceholder");
          inp.value = state.currentOthersText || "";
          inp.style.marginTop = "6px";
          inp.style.minHeight = "36px";
          inp.style.padding = "6px 10px";
          inp.style.border = "1px solid var(--line)";
          inp.style.borderRadius = "8px";
          inp.style.width = "100%";
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

        row.appendChild(code);
        row.appendChild(lbl);
        row.appendChild(grp);
        secEl.appendChild(row);
      });
      wrap.appendChild(secEl);
    });
    updateSseBanner();
  }

  function updateChecklistSelection() {
    document.querySelectorAll(".rate-btn").forEach(function (b) {
      var code = b.getAttribute("data-code");
      var val = b.getAttribute("data-val");
      b.classList.toggle("is-selected", state.currentRatings[code] === val);
    });
    updateSseBanner();
  }

  function updateSseBanner() {
    var severe = hasSevereRating(state.currentRatings);
    $("sseAlertBanner").hidden = !severe;
    $("sseAlertBanner").textContent = t("sseAlert");
    if (severe && $("fieldStatus").value === "normal") {
      $("fieldStatus").value = "sse";
    }
  }

  function applyLang() {
    var pack = I18N[state.lang];
    document.documentElement.lang = pack.htmlLang;
    document.title = pack.title + " v2.0";
    $("appTitle").textContent = pack.title;
    $("appTagline").textContent = pack.tagline;
    $("btnLang").textContent = pack.langBtn;
    $("tab-records").textContent = pack.tabRecords;
    $("tab-edit").textContent = state.currentId && !state.isNewUnsaved ? pack.tabEditOpen : pack.tabEdit;
    $("tab-album").textContent = pack.tabAlbum;
    $("tab-map").textContent = pack.tabMap;
    $("tab-export").textContent = pack.tabExport;
    $("searchInput").placeholder = pack.search;
    $("lblSearch").textContent = pack.search;
    $("btnNewFromList").textContent = pack.newRecord;
    $("fltAll").textContent = pack.fltAll;
    $("fltSse").textContent = pack.fltSse;
    $("fltFollowup").textContent = pack.fltFollowup;
    $("fltNormal").textContent = pack.fltNormal;
    $("secHeaderTitle").textContent = pack.secHeaderTitle;
    $("secChecklistTitle").textContent = pack.secChecklistTitle;
    $("secRemarksTitle").textContent = pack.secRemarksTitle;
    $("btnPrintReport").textContent = pack.printReport;
    $("lblWhen").textContent = pack.when;
    $("lblDmo").textContent = pack.dmo;
    $("lblSite").textContent = pack.site;
    $("lblStructure").textContent = pack.structure;
    $("lblHandover").textContent = pack.handover;
    $("lblStatus").textContent = pack.status;
    var stSel = $("fieldStatus");
    stSel.options[0].textContent = pack.statusNormal;
    stSel.options[1].textContent = pack.statusFollowup;
    stSel.options[2].textContent = pack.statusSse;
    $("lblRecGps").textContent = pack.recGps;
    $("btnRefreshGps").textContent = pack.refreshGps;
    $("btnPickMapLoc").textContent = pack.pickMapLoc;
    $("btnFillNa").textContent = pack.fillNa;
    $("btnClearRatings").textContent = pack.clearRatings;
    $("checklistHint").textContent = pack.checklistHint;
    $("lblRemarks").textContent = pack.remarks;
    $("lblCondition").textContent = pack.condition;
    $("lblWorks").textContent = pack.works;
    $("lblSeName").textContent = pack.seName;
    $("lblSseName").textContent = pack.sseName;
    $("lblPhotos").textContent = pack.photos;
    $("btnTakePhoto").textContent = pack.takePhoto;
    $("btnPickPhoto").textContent = pack.pickPhoto;
    $("photoHint").textContent = pack.photoHint;
    $("btnSave").textContent = pack.save;
    $("btnExportSingle").textContent = pack.exportSingle;
    $("btnCancel").textContent = pack.cancel;
    $("btnDelete").textContent = pack.delete;
    $("exportTitle").textContent = pack.exportTitle;
    $("exportBlurb").textContent = pack.exportBlurb;
    $("lblDateFrom").textContent = pack.dateFrom;
    $("lblDateTo").textContent = pack.dateTo;
    $("btnExport").textContent = pack.exportBtn;
    $("btnImportBackup").textContent = pack.importBtn;
    $("privacyTitle").textContent = pack.privacyTitle;
    $("privacyBlurb").textContent = pack.privacyBlurb;
    $("btnClearAll").textContent = pack.clearAll;
    $("btnCloseLightbox").setAttribute("aria-label", pack.lightboxClose);
    $("pickerTitle").textContent = pack.pickerTitle;
    $("pickerHint").textContent = pack.pickerHint;
    $("btnPickerCancel").textContent = pack.cancel;
    $("btnPickerApply").textContent = pack.pickerApply;
    $("reportModalTitle").textContent = pack.reportModalTitle;
    $("btnReportPrintNow").textContent = pack.reportPrintNow;
    $("btnReportClose2").textContent = pack.lightboxClose;
    $("btnToggleBasemap").textContent = state.basemap === "arcgis" ? pack.basemapArcgis : pack.basemapOsm;
    updateBanner();
    updateConnBadge();
    renderChecklistUi();
    updateRecGpsText();
  }

  function updateRecGpsText() {
    var el = $("recGpsText");
    if (!el) return;
    if (hasCoords(state.currentGps)) {
      var txt = fmtCoord(state.currentGps.lat, state.currentGps.lng);
      if (state.currentGps.accuracy) txt += " (±" + Math.round(state.currentGps.accuracy) + "m)";
      el.textContent = txt;
    } else {
      el.textContent = t("noCoords");
    }
  }

  /* ---------- Clean up untouched empty draft on tab switch ---------- */
  async function cleanupEmptyDraftIfNeeded() {
    if (!state.currentId || !state.isNewUnsaved) return;
    var photos = state.photosByRecord[state.currentId] || [];
    var hasText = ($("fieldSite").value || "").trim() || ($("fieldDmo").value || "").trim() ||
      ($("fieldStructure").value || "").trim() || ($("fieldRemarks").value || "").trim() ||
      ($("fieldCondition").value || "").trim() || ($("fieldWorks").value || "").trim() ||
      Object.keys(state.currentRatings).length > 0;
    if (!hasText && photos.length === 0) {
      await deleteRecordAndPhotos(state.currentId);
      state.currentId = null;
      state.isNewUnsaved = false;
      $("tab-edit").textContent = t("tabEdit");
      await reloadData();
    }
  }

  async function showTab(name) {
    if (state.tab === "edit" && name !== "edit") {
      await cleanupEmptyDraftIfNeeded();
    }
    state.tab = name;
    ["records", "edit", "album", "map", "export"].forEach(function (id) {
      var view = $("view-" + id), tab = $("tab-" + id), on = id === name;
      view.classList.toggle("is-active", on);
      view.hidden = !on;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    });
    if (name === "records") renderRecords();
    if (name === "album") renderAlbum();
    if (name === "map") renderMap();
    if (name === "export") refreshStorage();
  }

  async function reloadData() {
    var recs = await getAllRecords();
    recs.sort(function (a, b) { return String(b.createdAt || "").localeCompare(String(a.createdAt || "")); });
    state.records = recs;
    var photos = await getAllPhotos();
    var map = {};
    photos.forEach(function (p) {
      if (!map[p.recordId]) map[p.recordId] = [];
      map[p.recordId].push(p);
    });
    Object.keys(map).forEach(function (k) {
      map[k].sort(function (a, b) { return String(a.takenAt || "").localeCompare(String(b.takenAt || "")); });
    });
    state.photosByRecord = map;
  }

  function recordStatusOf(rec) {
    if (rec.status) return rec.status;
    return hasSevereRating(rec.ratings) ? "sse" : "normal";
  }

  function recordMatches(rec, q) {
    var st = recordStatusOf(rec);
    if (state.filterStatus !== "all" && st !== state.filterStatus) return false;
    if (!q) return true;
    var photos = state.photosByRecord[rec.id] || [];
    var blob = [
      rec.siteName, rec.dmo, rec.structure, rec.remarks, rec.condition, rec.externalWorks,
      rec.seName, rec.sseName, fmtHkt(rec.createdAt)
    ].concat(photos.map(function (p) { return (p.caption || "") + " " + fmtCoord(p.lat, p.lng); })).join(" ").toLowerCase();
    return blob.indexOf(q) !== -1;
  }

  function renderRecords() {
    revokeUrls();
    var q = ($("searchInput").value || "").trim().toLowerCase();
    var list = $("recordsList");
    list.innerHTML = "";
    var rows = state.records.filter(function (r) { return !r.isDraft && recordMatches(r, q); });
    $("recordsEmpty").hidden = rows.length > 0;
    $("recordsEmpty").textContent = t("emptyRecords");

    rows.forEach(function (rec) {
      var photos = state.photosByRecord[rec.id] || [];
      var card = document.createElement("article");
      card.className = "card";
      card.tabIndex = 0;
      card.setAttribute("role", "button");

      var thumb;
      if (photos[0] && (photos[0].thumb || photos[0].blob)) {
        thumb = document.createElement("img");
        thumb.className = "card-thumb";
        thumb.alt = "";
        thumb.src = urlFor(photos[0].thumb || photos[0].blob);
      } else {
        thumb = document.createElement("div");
        thumb.className = "card-thumb";
        thumb.textContent = t("photos");
      }

      var body = document.createElement("div");
      var h = document.createElement("h3");
      h.textContent = (rec.dmo ? "[" + rec.dmo + "] " : "") + (rec.siteName || t("newRecord")) + (rec.structure ? " · " + rec.structure : "");
      var meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = fmtHkt(rec.createdAt) + " · " + photos.length + " " + t("photosCount");
      body.appendChild(h);
      body.appendChild(meta);

      var badges = document.createElement("div");
      badges.className = "badges";
      var st = recordStatusOf(rec);
      var stBadge = document.createElement("span");
      if (st === "sse") { stBadge.className = "badge badge-danger"; stBadge.textContent = t("fltSse"); }
      else if (st === "followup") { stBadge.className = "badge badge-warn"; stBadge.textContent = t("fltFollowup"); }
      else { stBadge.className = "badge badge-ok"; stBadge.textContent = t("fltNormal"); }
      badges.appendChild(stBadge);

      var mr = maxRatingOf(rec.ratings);
      if (mr > 0) {
        var rb = document.createElement("span");
        rb.className = "badge " + (mr >= 5 ? "badge-danger" : mr >= 4 ? "badge-warn" : "badge-neutral");
        rb.textContent = t("maxRate") + " " + mr;
        badges.appendChild(rb);
      }

      var hasGps = hasCoords(rec.gps) || photos.some(function (p) { return hasCoords(p); });
      var gb = document.createElement("span");
      gb.className = "badge " + (hasGps ? "badge-ok" : "badge-neutral");
      gb.textContent = hasGps ? t("hasCoords") : t("noCoords");
      badges.appendChild(gb);

      card.appendChild(thumb);
      card.appendChild(body);
      card.appendChild(badges);
      card.addEventListener("click", function () { openRecord(rec.id); });
      list.appendChild(card);
    });
  }

  function fillForm(rec) {
    $("fieldId").value = rec.id;
    $("fieldWhen").value = fmtHkt(rec.createdAt) + " (HKT)";
    $("fieldDmo").value = rec.dmo || "";
    $("fieldSite").value = rec.siteName || "";
    $("fieldStructure").value = rec.structure || "";
    $("fieldHandover").value = rec.handoverDate || "";
    $("fieldStatus").value = recordStatusOf(rec);
    $("fieldRemarks").value = rec.remarks || "";
    $("fieldCondition").value = rec.condition || "";
    $("fieldWorks").value = rec.externalWorks || "";
    $("fieldSeName").value = rec.seName || "";
    $("fieldSseName").value = rec.sseName || "";
    state.currentRatings = Object.assign({}, rec.ratings || {});
    state.currentOthersText = rec.othersText || "";
    state.currentGps = rec.gps ? Object.assign({}, rec.gps) : null;
    $("btnDelete").hidden = !!rec.isDraft;
    $("btnExportSingle").hidden = !!rec.isDraft;
    $("btnPrintReport").hidden = !!rec.isDraft;
    $("tab-edit").textContent = rec.isDraft ? t("tabEdit") : t("tabEditOpen");
    renderChecklistUi();
    updateRecGpsText();
    renderPhotoGrid(rec.id);
  }

  function renderPhotoGrid(recordId) {
    var box = $("photoGrid");
    box.innerHTML = "";
    var photos = state.photosByRecord[recordId] || [];
    photos.forEach(function (p) {
      var card = document.createElement("div");
      card.className = "photo-card";
      var img = document.createElement("img");
      img.alt = "";
      img.src = urlFor(p.thumb || p.blob);
      img.addEventListener("click", function () { openLightbox(p); });
      var cap = document.createElement("div");
      cap.className = "cap";
      cap.textContent = fmtCoord(p.lat, p.lng) + (hasCoords(p) && p.accuracy ? " · ±" + Math.round(p.accuracy) + "m" : "");
      var note = document.createElement("input");
      note.type = "text";
      note.className = "photo-note";
      note.placeholder = t("photoNotePlaceholder");
      note.value = p.caption || "";
      note.addEventListener("change", async function () {
        p.caption = note.value.trim();
        await putPhoto(p);
      });
      var del = document.createElement("button");
      del.type = "button";
      del.className = "btn-icon";
      del.textContent = "×";
      del.addEventListener("click", function (ev) { ev.stopPropagation(); removePhoto(p.id); });
      card.appendChild(img);
      card.appendChild(del);
      card.appendChild(cap);
      card.appendChild(note);
      box.appendChild(card);
    });
  }

  async function openRecord(id) {
    await reloadData();
    var rec = state.records.filter(function (r) { return r.id === id; })[0];
    if (!rec) return;
    state.currentId = id;
    state.isNewUnsaved = !!rec.isDraft;
    fillForm(rec);
    showTab("edit");
  }

  async function startNewRecord() {
    var rec = {
      id: uid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dmo: "", siteName: "", structure: "", handoverDate: "",
      status: "normal", ratings: {}, othersText: "",
      remarks: "", condition: "", externalWorks: "",
      seName: "", sseName: "", gps: null, isDraft: true
    };
    state.currentId = rec.id;
    state.isNewUnsaved = true;
    await putRecord(rec);
    await reloadData();
    fillForm(rec);
    showTab("edit");
    $("fieldSite").focus();
    // Pre-warm GPS silently in background
    $("recGpsText").textContent = t("gpsLoading");
    getDeviceGps().then(function (gps) {
      if (state.currentId === rec.id && !hasCoords(state.currentGps)) {
        state.currentGps = gps;
        updateRecGpsText();
      }
    });
  }

  async function saveCurrent() {
    if (!state.currentId) return;
    var existing = await getRecord(state.currentId);
    if (!existing) return;
    var siteName = $("fieldSite").value.trim();
    if (!siteName) { toast(t("needSite")); $("fieldSite").focus(); return; }
    var remarks = $("fieldRemarks").value.trim();
    if (hasSevereRating(state.currentRatings) && !remarks) {
      var proceed = await showConfirm(t("sseRemarksConfirm"));
      if (!proceed) { $("fieldRemarks").focus(); return; }
    }
    var rec = {
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
      dmo: $("fieldDmo").value.trim(),
      siteName: siteName,
      structure: $("fieldStructure").value.trim(),
      handoverDate: $("fieldHandover").value.trim(),
      status: $("fieldStatus").value,
      ratings: Object.assign({}, state.currentRatings),
      othersText: state.currentOthersText.trim(),
      remarks: remarks,
      condition: $("fieldCondition").value.trim(),
      externalWorks: $("fieldWorks").value.trim(),
      seName: $("fieldSeName").value.trim(),
      sseName: $("fieldSseName").value.trim(),
      gps: state.currentGps ? Object.assign({}, state.currentGps) : null,
      isDraft: false
    };
    await putRecord(rec);
    state.isNewUnsaved = false;
    await reloadData();
    fillForm(rec);
    toast(t("saved"));
    showTab("records");
  }

  async function cancelEdit() {
    if (!state.currentId) { showTab("records"); return; }
    var existing = await getRecord(state.currentId);
    if (existing && existing.isDraft) {
      var photos = state.photosByRecord[existing.id] || [];
      var dirty = ($("fieldSite").value || "").trim() || photos.length > 0 || Object.keys(state.currentRatings).length > 0;
      if (dirty && !(await showConfirm(t("draftCancel")))) return;
      await deleteRecordAndPhotos(existing.id);
      toast(t("cancelled"));
    }
    state.currentId = null;
    state.isNewUnsaved = false;
    $("tab-edit").textContent = t("tabEdit");
    await reloadData();
    showTab("records");
  }

  async function deleteCurrent() {
    if (!state.currentId) return;
    if (!(await showConfirm(t("confirmDelete")))) return;
    await deleteRecordAndPhotos(state.currentId);
    state.currentId = null;
    state.isNewUnsaved = false;
    $("tab-edit").textContent = t("tabEdit");
    await reloadData();
    toast(t("deleted"));
    showTab("records");
  }

  async function addPhotoFiles(fileList, wantDeviceGps) {
    if (!state.currentId) await startNewRecord();
    var files = Array.prototype.slice.call(fileList || []).filter(function (f) {
      return !!(f && (/^image\//.test(f.type || "") || /\.(jpe?g|png|heic|heif|webp|gif)$/i.test(f.name || "")));
    });
    if (!files.length) return;
    state.savingPhoto = true;
    $("btnTakePhoto").disabled = true;
    $("btnPickPhoto").disabled = true;
    var deviceGps = hasCoords(state.currentGps) ? state.currentGps : null;
    if (wantDeviceGps) {
      var fresh = await getDeviceGps();
      if (hasCoords(fresh)) {
        deviceGps = fresh;
        state.currentGps = fresh;
        updateRecGpsText();
      }
    }
    for (var i = 0; i < files.length; i++) {
      try {
        var buf = await fileToArrayBuffer(files[i]);
        var exifGps = readGpsFromExif(buf);
        var gps = hasCoords(exifGps) ? exifGps : (hasCoords(deviceGps) ? deviceGps : null);
        if (hasCoords(gps) && !hasCoords(state.currentGps)) {
          state.currentGps = gps;
          updateRecGpsText();
        }
        var decoded = await decodeImage(new Blob([buf], { type: files[i].type || "image/jpeg" }));
        var full = await drawToBlob(decoded, MAX_EDGE, JPEG_Q);
        var thumb = await drawToBlob(decoded, THUMB_EDGE, 0.8);
        if (decoded.close) decoded.close();
        await putPhoto({
          id: uid(), recordId: state.currentId,
          blob: full.blob, thumb: thumb.blob,
          width: full.width, height: full.height, mime: "image/jpeg",
          lat: gps ? gps.lat : null, lng: gps ? gps.lng : null,
          accuracy: gps && gps.accuracy != null ? gps.accuracy : null,
          gpsSource: gps ? gps.source : "none",
          caption: "", takenAt: new Date().toISOString(), originalName: files[i].name || ""
        });
        toast(hasCoords(gps) ? t("gpsPhoto") : t("noGpsPhoto"));
      } catch (err) { console.warn(err); toast(t("photoFail")); }
    }
    state.savingPhoto = false;
    $("btnTakePhoto").disabled = false;
    $("btnPickPhoto").disabled = false;
    await reloadData();
    renderPhotoGrid(state.currentId);
  }

  async function removePhoto(id) {
    await deletePhoto(id);
    await reloadData();
    if (state.currentId) renderPhotoGrid(state.currentId);
    if (state.tab === "album") renderAlbum();
  }

  /* ---------- Album & Lightbox ---------- */
  function renderAlbum() {
    revokeUrls();
    var box = $("albumGrid");
    box.innerHTML = "";
    var items = [];
    state.records.filter(function (r) { return !r.isDraft; }).forEach(function (rec) {
      (state.photosByRecord[rec.id] || []).forEach(function (p) { items.push({ rec: rec, photo: p }); });
    });
    $("albumEmpty").hidden = items.length > 0;
    $("albumEmpty").textContent = t("emptyAlbum");
    items.sort(function (a, b) { return String(b.photo.takenAt || "").localeCompare(String(a.photo.takenAt || "")); });
    items.forEach(function (item) {
      var p = item.photo, rec = item.rec;
      var card = document.createElement("div");
      card.className = "album-card";
      var img = document.createElement("img");
      img.alt = rec.siteName || "";
      img.src = urlFor(p.thumb || p.blob);
      img.addEventListener("click", function () { openLightbox(p, rec); });
      var cap = document.createElement("div");
      cap.className = "cap";
      cap.textContent = (rec.siteName || "") + (p.caption ? " — " + p.caption : "") + " · " + fmtHkt(p.takenAt);
      card.appendChild(img); card.appendChild(cap); box.appendChild(card);
    });
  }
  function openLightbox(photo, rec) {
    $("lightboxImg").src = urlFor(photo.blob || photo.thumb);
    var bits = [];
    if (rec && rec.siteName) bits.push(rec.siteName);
    if (photo.caption) bits.push(photo.caption);
    bits.push(fmtHkt(photo.takenAt));
    bits.push(fmtCoord(photo.lat, photo.lng));
    $("lightboxCap").textContent = bits.join(" · ");
    $("lightbox").hidden = false;
  }
  function closeLightbox() { $("lightbox").hidden = true; $("lightboxImg").removeAttribute("src"); }

  /* ---------- Map & Manual Picker ---------- */
  function createBasemapLayer() {
    if (state.basemap === "osm") {
      return L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, attribution: "Tiles &copy; Esri" });
    }
    return L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, attribution: "Tiles &copy; Esri" });
  }

  function collectMappedPoints() {
    var pts = [];
    state.records.filter(function (r) { return !r.isDraft; }).forEach(function (rec) {
      var photos = state.photosByRecord[rec.id] || [];
      var addedPhoto = false;
      photos.forEach(function (p) {
        if (!hasCoords(p)) return;
        addedPhoto = true;
        pts.push({ lat: p.lat, lng: p.lng, label: rec.siteName || t("newRecord"), sub: (p.caption || rec.structure || "") + " · " + fmtHkt(p.takenAt) });
      });
      if (!addedPhoto && hasCoords(rec.gps)) {
        pts.push({ lat: rec.gps.lat, lng: rec.gps.lng, label: rec.siteName || t("newRecord"), sub: (rec.structure || "") + " · " + fmtHkt(rec.createdAt) });
      }
    });
    return pts;
  }

  function renderSimplePlot(pts) {
    var wrap = $("mapOffline");
    wrap.hidden = false;
    if (!pts.length) { wrap.innerHTML = "<p>" + xmlEsc(t("mapEmpty")) + "</p>"; return; }
    var w = 640, h = 220, pad = 28;
    var lats = pts.map(function (p) { return p.lat; }), lngs = pts.map(function (p) { return p.lng; });
    var minLa = Math.min.apply(null, lats), maxLa = Math.max.apply(null, lats);
    var minLo = Math.min.apply(null, lngs), maxLo = Math.max.apply(null, lngs);
    var spanLa = Math.max(maxLa - minLa, 0.0002), spanLo = Math.max(maxLo - minLo, 0.0002);
    var dots = pts.map(function (p, i) {
      var x = pad + ((p.lng - minLo) / spanLo) * (w - pad * 2);
      var y = pad + (1 - (p.lat - minLa) / spanLa) * (h - pad * 2);
      return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="6" fill="#0f766e"></circle>' +
        '<text x="' + (x + 8).toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" font-size="11" fill="#14222a">' + xmlEsc((i + 1) + ". " + p.label) + "</text>";
    }).join("");
    var list = pts.map(function (p, i) { return "<li>" + xmlEsc((i + 1) + ". " + p.label + " — " + fmtCoord(p.lat, p.lng)) + "</li>"; }).join("");
    wrap.innerHTML = "<h2>" + xmlEsc(t("simplePlot")) + "</h2><svg class=\"plot\" viewBox=\"0 0 " + w + " " + h + "\">" + dots + "</svg><ol>" + list + "</ol>";
  }

  function renderMap() {
    var pts = collectMappedPoints();
    var online = navigator.onLine && !isFileProtocol();
    $("mapHint").textContent = online ? t("mapHintOnline") : t("mapHintOffline");
    if (!online || typeof L === "undefined") {
      $("mapCanvas").hidden = true;
      if (state.map) { state.map.remove(); state.map = null; }
      renderSimplePlot(pts);
      return;
    }
    $("mapCanvas").hidden = false;
    $("mapOffline").hidden = pts.length > 0;
    if (!pts.length) $("mapOffline").innerHTML = "<p>" + xmlEsc(t("mapEmpty")) + "</p>";
    if (L.Icon && L.Icon.Default && !L.Icon.Default.imagePath) {
      L.Icon.Default.imagePath = "./vendor/leaflet/images/";
    }
    if (!state.map) {
      state.map = L.map("mapCanvas", { zoomControl: true });
      state.tileLayer = createBasemapLayer().addTo(state.map);
    }
    if (state._markers) state._markers.forEach(function (m) { state.map.removeLayer(m); });
    state._markers = [];
    var bounds = [];
    pts.forEach(function (p) {
      var m = L.marker([p.lat, p.lng]).bindPopup("<strong>" + xmlEsc(p.label) + "</strong><br>" + xmlEsc(p.sub) + "<br>" + xmlEsc(fmtCoord(p.lat, p.lng)));
      m.addTo(state.map);
      state._markers.push(m);
      bounds.push([p.lat, p.lng]);
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
    var initLat = hasCoords(state.currentGps) ? state.currentGps.lat : 22.3193;
    var initLng = hasCoords(state.currentGps) ? state.currentGps.lng : 114.1694;
    state.pickerLatLng = { lat: initLat, lng: initLng };
    setTimeout(function () {
      if (state.pickerMap) { state.pickerMap.remove(); state.pickerMap = null; }
      state.pickerMap = L.map("pickerMap").setView([initLat, initLng], hasCoords(state.currentGps) ? 17 : 12);
      createBasemapLayer().addTo(state.pickerMap);
      state.pickerMarker = L.marker([initLat, initLng]).addTo(state.pickerMap);
      state.pickerMap.on("click", function (e) {
        state.pickerLatLng = { lat: e.latlng.lat, lng: e.latlng.lng };
        state.pickerMarker.setLatLng(e.latlng);
      });
      state.pickerMap.invalidateSize();
    }, 60);
  }

  /* ---------- Printable HD Appendix X Summary Report ---------- */
  async function openReportPreview() {
    if (!state.currentId) return;
    var rec = await getRecord(state.currentId);
    if (!rec) return;
    var photos = state.photosByRecord[rec.id] || [];
    var ratings = rec.ratings || {};

    var rowsHtml = "";
    CHECKLIST_SCHEMA.forEach(function (sec) {
      rowsHtml += '<tr><th colspan="8">' + xmlEsc(sec.sectionEn) + '</th></tr>';
      sec.items.forEach(function (item) {
        var label = item.en;
        if (item.hasCustomText && rec.othersText) label += " : " + rec.othersText;
        var chosen = ratings[item.code] || "";
        var cols = RATINGS.map(function (r) {
          return '<td style="text-align:center;">' + (chosen === r ? '<span class="circled">' + r + '</span>' : r) + '</td>';
        }).join("");
        rowsHtml += '<tr><td>' + item.code + '</td><td>' + xmlEsc(label) + '</td>' + cols + '</tr>';
      });
    });

    var photosHtml = "";
    if (photos.length) {
      photosHtml = '<div class="report-photos">' + photos.map(function (p, i) {
        return '<figure><img src="' + urlFor(p.thumb || p.blob) + '"><figcaption>Photo ' + (i + 1) +
          (p.caption ? ': ' + xmlEsc(p.caption) : '') + ' (' + xmlEsc(fmtCoord(p.lat, p.lng)) + ')</figcaption></figure>';
      }).join("") + '</div>';
    }

    $("reportSheet").innerHTML =
      '<div style="text-align:right;font-size:0.78rem;">Appendix X</div>' +
      '<h3>HOUSING DEPARTMENT</h3><h3>ESTATE MANAGEMENT DIVISION</h3><h3>SUMMARY REPORT OF STRUCTURAL INSPECTION</h3>' +
      '<table class="report-meta">' +
      '<tr><td><strong>DMO:</strong> ' + xmlEsc(rec.dmo || "-") + '</td><td><strong>Estate:</strong> ' + xmlEsc(rec.siteName || "-") + '</td><td><strong>Inspection Date:</strong> ' + xmlEsc(fmtDateShort(rec.createdAt)) + '</td></tr>' +
      '<tr><td colspan="2"><strong>Inspected Structure:</strong> ' + xmlEsc(rec.structure || "-") + '</td><td><strong>Handover Date:</strong> ' + xmlEsc(rec.handoverDate || "-") + '</td></tr>' +
      '</table>' +
      '<p style="font-size:0.76rem;margin-bottom:6px;">* Ratings (1) Good to (5) Severe. For ratings (4) poor / (5) severe, elaborate in Remarks and draw SSE\'s attention.</p>' +
      '<table class="report-table"><tr><th style="width:40px;">Item</th><th>Description</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>N.A.</th></tr>' +
      rowsHtml +
      '<tr><td><strong>5.1</strong></td><td colspan="7"><strong>Remarks:</strong><br>' + xmlEsc(rec.remarks || "-") +
      (rec.condition ? '<br><em>Condition:</em> ' + xmlEsc(rec.condition) : '') +
      (rec.externalWorks ? '<br><em>External Works:</em> ' + xmlEsc(rec.externalWorks) : '') + '</td></tr>' +
      '</table>' +
      '<table class="report-meta" style="margin-top:12px;">' +
      '<tr><td><strong>Reported by SE:</strong> ' + xmlEsc(rec.seName || "________________") + '<br><br>Signature: ________________ &nbsp; Date: ' + xmlEsc(fmtDateShort(rec.createdAt)) + '</td>' +
      '<td><strong>Endorsed by SSE:</strong> ' + xmlEsc(rec.sseName || "________________") + '<br><br>Signature: ________________ &nbsp; Date: ____________</td></tr>' +
      '</table>' + photosHtml;

    $("reportModal").hidden = false;
  }

  /* ---------- Export ZIP (All / Filtered / Single) + Backup JSON Restore ---------- */
  function downloadBlob(blob, filename) {
    var a = document.createElement("a");
    var href = URL.createObjectURL(blob);
    a.href = href; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(href); }, 2000);
  }

  async function runZipExport(targetRecords, prefixName) {
    if (typeof JSZip === "undefined") { toast(t("exportFail")); return; }
    if (!targetRecords.length) { toast(t("exportEmpty")); return; }
    $("exportStatus").textContent = t("exporting");
    try {
      var zip = new JSZip();
      var header = ["Record ID", "Inspection Date (HKT)", "DMO", "Estate / Site", "Inspected Structure", "Handover Date", "Status", "Max Rating", "SSE Attention"];
      ALL_ITEMS.forEach(function (it) { header.push(it.code + " " + it.en); });
      header.push("4.3 Others Text", "5.1 Remarks", "Current Condition", "External Works", "Reported by SE", "Endorsed by SSE", "Record GPS", "Photo Count");

      var recRows = [header];
      var photoRows = [["Record ID", "Estate / Site", "Photo File", "Taken At (HKT)", "Caption", "Latitude", "Longitude", "GPS Source"]];
      var backupObj = { version: 2, exportedAt: new Date().toISOString(), records: targetRecords };

      for (var i = 0; i < targetRecords.length; i++) {
        var r = targetRecords[i];
        var photos = state.photosByRecord[r.id] || [];
        var mr = maxRatingOf(r.ratings);
        var row = [
          r.id, fmtHkt(r.createdAt), r.dmo || "", r.siteName || "", r.structure || "", r.handoverDate || "",
          recordStatusOf(r), mr || "", mr >= 4 ? "YES" : "NO"
        ];
        ALL_ITEMS.forEach(function (it) { row.push((r.ratings && r.ratings[it.code]) || ""); });
        row.push(r.othersText || "", r.remarks || "", r.condition || "", r.externalWorks || "", r.seName || "", r.sseName || "", hasCoords(r.gps) ? fmtCoord(r.gps.lat, r.gps.lng) : "", String(photos.length));
        recRows.push(row);

        photos.forEach(function (p, idx) {
          var fname = "photos/" + stampHkt(r.createdAt) + "_" + slug(r.siteName) + "_" + String(idx + 1).padStart(2, "0") + ".jpg";
          if (p.blob) zip.file(fname, p.blob);
          photoRows.push([r.id, r.siteName || "", fname, fmtHkt(p.takenAt), p.caption || "", p.lat != null ? p.lat : "", p.lng != null ? p.lng : "", p.gpsSource || ""]);
        });
      }

      var xlsxBlob = await buildXlsxBlob(recRows);
      zip.file("inspection_records.xlsx", xlsxBlob);
      zip.file("inspection_records.csv", buildCsv(recRows));
      zip.file("inspection_photos.csv", buildCsv(photoRows));
      zip.file("backup.json", JSON.stringify(backupObj, null, 2));

      var out = await zip.generateAsync({ type: "blob" });
      downloadBlob(out, (prefixName || "Site_Inspection_v2") + "_" + stampHkt() + ".zip");
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
      var text = await file.text();
      var data = JSON.parse(text);
      var recs = Array.isArray(data.records) ? data.records : [];
      if (!recs.length) throw new Error("empty");
      for (var i = 0; i < recs.length; i++) {
        if (recs[i] && recs[i].id) {
          recs[i].isDraft = false;
          await putRecord(recs[i]);
        }
      }
      await reloadData();
      toast(t("importDone") + recs.length);
      showTab("records");
    } catch (e) {
      toast(t("importFail"));
    }
  }

  async function refreshStorage() {
    var el = $("storageInfo");
    if (navigator.storage && navigator.storage.estimate) {
      try {
        var est = await navigator.storage.estimate();
        var mb = ((est.usage || 0) / (1024 * 1024)).toFixed(2);
        el.textContent = t("storage") + ": " + mb + " MB (" + state.records.filter(function (r) { return !r.isDraft; }).length + " records)";
        return;
      } catch (e) {}
    }
    el.textContent = t("storageUnknown");
  }

  async function clearAll() {
    if (!(await showConfirm(t("confirmClear")))) return;
    await clearAllData();
    state.currentId = null;
    state.isNewUnsaved = false;
    await reloadData();
    toast(t("cleared"));
    showTab("records");
    refreshStorage();
  }

  /* ---------- Event Binding ---------- */
  function bind() {
    document.querySelectorAll(".tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tab = btn.getAttribute("data-tab");
        if (tab === "edit" && !state.currentId) { startNewRecord(); return; }
        showTab(tab);
      });
    });
    document.querySelectorAll("#statusFilterBar .chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.filterStatus = chip.getAttribute("data-filter");
        document.querySelectorAll("#statusFilterBar .chip").forEach(function (c) { c.classList.toggle("is-active", c === chip); });
        renderRecords();
      });
    });
    $("btnLang").addEventListener("click", function () {
      state.lang = state.lang === "zh" ? "en" : "zh";
      try { localStorage.setItem(LANG_KEY, state.lang); } catch (e) {}
      applyLang();
      if (state.tab === "records") renderRecords();
      if (state.tab === "album") renderAlbum();
      if (state.tab === "map") renderMap();
    });
    $("searchInput").addEventListener("input", renderRecords);
    $("btnNewFromList").addEventListener("click", startNewRecord);
    $("recordForm").addEventListener("submit", function (e) { e.preventDefault(); saveCurrent(); });
    $("btnCancel").addEventListener("click", cancelEdit);
    $("btnDelete").addEventListener("click", deleteCurrent);
    $("btnPrintReport").addEventListener("click", openReportPreview);
    $("btnCloseReport").addEventListener("click", function () { $("reportModal").hidden = true; });
    $("btnReportClose2").addEventListener("click", function () { $("reportModal").hidden = true; });
    $("btnReportPrintNow").addEventListener("click", function () { window.print(); });
    $("btnRefreshGps").addEventListener("click", async function () {
      $("recGpsText").textContent = t("gpsLoading");
      var gps = await getDeviceGps();
      if (hasCoords(gps)) { state.currentGps = gps; toast(t("hasCoords")); }
      else toast(t("noCoords"));
      updateRecGpsText();
    });
    $("btnPickMapLoc").addEventListener("click", openMapPicker);
    $("btnPickerCancel").addEventListener("click", function () { $("pickerModal").hidden = true; });
    $("btnPickerApply").addEventListener("click", function () {
      if (state.pickerLatLng) {
        state.currentGps = { lat: state.pickerLatLng.lat, lng: state.pickerLatLng.lng, accuracy: null, source: "manual" };
        updateRecGpsText();
        toast(t("hasCoords"));
      }
      $("pickerModal").hidden = true;
    });
    $("btnFillNa").addEventListener("click", function () {
      ALL_ITEMS.forEach(function (it) { if (!state.currentRatings[it.code]) state.currentRatings[it.code] = "N.A."; });
      updateChecklistSelection();
    });
    $("btnClearRatings").addEventListener("click", function () {
      state.currentRatings = {};
      updateChecklistSelection();
    });
    $("btnTakePhoto").addEventListener("click", function () { $("fileCamera").value = ""; $("fileCamera").click(); });
    $("btnPickPhoto").addEventListener("click", function () { $("fileLibrary").value = ""; $("fileLibrary").click(); });
    $("fileCamera").addEventListener("change", function (e) { addPhotoFiles(e.target.files, true); });
    $("fileLibrary").addEventListener("change", function (e) { addPhotoFiles(e.target.files, false); });
    $("btnExportSingle").addEventListener("click", async function () {
      if (!state.currentId) return;
      var rec = await getRecord(state.currentId);
      if (rec) runZipExport([rec], "Inspection_" + slug(rec.siteName));
    });
    $("btnExport").addEventListener("click", function () {
      var from = $("exportFrom").value, to = $("exportTo").value;
      var list = state.records.filter(function (r) {
        if (r.isDraft) return false;
        var ymd = fmtDateYmd(r.createdAt);
        if (from && ymd < from) return false;
        if (to && ymd > to) return false;
        return true;
      });
      runZipExport(list, "Site_Inspection_v2");
    });
    $("btnImportBackup").addEventListener("click", function () { $("fileImportBackup").value = ""; $("fileImportBackup").click(); });
    $("fileImportBackup").addEventListener("change", function (e) {
      if (e.target.files && e.target.files[0]) importJsonBackup(e.target.files[0]);
    });
    $("btnClearAll").addEventListener("click", clearAll);
    $("btnCloseLightbox").addEventListener("click", closeLightbox);
    $("lightbox").addEventListener("click", function (e) { if (e.target === $("lightbox")) closeLightbox(); });
    $("btnToggleBasemap").addEventListener("click", function () {
      state.basemap = state.basemap === "arcgis" ? "osm" : "arcgis";
      try { localStorage.setItem(BASEMAP_KEY, state.basemap); } catch (e) {}
      $("btnToggleBasemap").textContent = state.basemap === "arcgis" ? t("basemapArcgis") : t("basemapOsm");
      if (state.map && state.tileLayer) {
        state.map.removeLayer(state.tileLayer);
        state.tileLayer = createBasemapLayer().addTo(state.map);
      }
    });
    window.addEventListener("online", updateConnBadge);
    window.addEventListener("offline", updateConnBadge);
  }

  async function init() {
    try {
      var savedLang = localStorage.getItem(LANG_KEY);
      if (savedLang === "en" || savedLang === "zh") state.lang = savedLang;
      var savedBm = localStorage.getItem(BASEMAP_KEY);
      if (savedBm === "osm" || savedBm === "arcgis") state.basemap = savedBm;
    } catch (e) {}
    bind();
    applyLang();
    await reloadData();
    // Clean up any stray empty drafts from older sessions
    for (var i = 0; i < state.records.length; i++) {
      var r = state.records[i];
      if (r.isDraft && !(state.photosByRecord[r.id] || []).length && !r.siteName) {
        await deleteRecordAndPhotos(r.id);
      }
    }
    await reloadData();
    renderRecords();
    registerPwa();
  }

  init();
})();
