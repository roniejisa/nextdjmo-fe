const suspiciousElements = [
  // ===== SCREEN RECORDING RELATED =====
  'div[id*="screen"]',
  'div[id*="record"]',
  'div[id*="capture"]',
  'div[id*="recording"]',
  'div[id*="screencast"]',
  'div[id*="screencap"]',
  'div[id*="screenshot"]',
  'div[id*="desktop"]',
  'div[id*="display"]',
  'div[id*="share"]',
  'div[id*="broadcast"]',
  'div[id*="stream"]',
  'div[id*="video"]',
  'div[id*="cam"]',
  'div[id*="rec"]',
  'div[id*="snap"]',
  'div[id*="grab"]',
  'div[id*="shot"]',

  // ===== CLASS NAMES =====
  'div[class*="record"]',
  'div[class*="capture"]',
  'div[class*="recording"]',
  'div[class*="screencast"]',
  'div[class*="screencap"]',
  'div[class*="screenshot"]',
  'div[class*="desktop"]',
  'div[class*="share"]',
  'div[class*="broadcast"]',
  'div[class*="stream"]',
  'div[class*="cam"]',
  'div[class*="rec"]',
  'div[class*="snap"]',
  'div[class*="grab"]',
  'div[class*="shot"]',

  // ===== CHROME EXTENSIONS =====
  'iframe[src*="chrome-extension"]',
  'script[src*="chrome-extension"]',
  'link[href*="chrome-extension"]',
  'img[src*="chrome-extension"]',
  'embed[src*="chrome-extension"]',
  'object[data*="chrome-extension"]',

  // ===== FIREFOX EXTENSIONS =====
  'iframe[src*="moz-extension"]',
  'script[src*="moz-extension"]',
  'link[href*="moz-extension"]',
  'img[src*="moz-extension"]',

  // ===== EDGE EXTENSIONS =====
  'iframe[src*="ms-browser-extension"]',
  'script[src*="ms-browser-extension"]',

  // ===== SAFARI EXTENSIONS =====
  'iframe[src*="safari-extension"]',
  'script[src*="safari-extension"]',

  // ===== POPULAR SCREEN RECORDING SOFTWARE =====
  // OBS Studio
  'div[id*="obs"]',
  'div[class*="obs"]',
  'div[id*="studio"]',
  'div[class*="studio"]',

  // Bandicam
  'div[id*="bandicam"]',
  'div[class*="bandicam"]',
  'div[id*="bandi"]',
  'div[class*="bandi"]',

  // Camtasia
  'div[id*="camtasia"]',
  'div[class*="camtasia"]',
  'div[id*="techsmith"]',
  'div[class*="techsmith"]',

  // Snagit
  'div[id*="snagit"]',
  'div[class*="snagit"]',
  'div[id*="snag"]',
  'div[class*="snag"]',

  // Fraps
  'div[id*="fraps"]',
  'div[class*="fraps"]',

  // Action!
  'div[id*="action"]',
  'div[class*="action"]',
  'div[id*="mirillis"]',
  'div[class*="mirillis"]',

  // XSplit
  'div[id*="xsplit"]',
  'div[class*="xsplit"]',

  // Shadowplay
  'div[id*="shadowplay"]',
  'div[class*="shadowplay"]',
  'div[id*="nvidia"]',
  'div[class*="nvidia"]',
  'div[id*="geforce"]',
  'div[class*="geforce"]',

  // Windows Game Bar
  'div[id*="gamebar"]',
  'div[class*="gamebar"]',
  'div[id*="xbox"]',
  'div[class*="xbox"]',
  'div[id*="game-bar"]',
  'div[class*="game-bar"]',

  // QuickTime
  'div[id*="quicktime"]',
  'div[class*="quicktime"]',

  // VLC
  'div[id*="vlc"]',
  'div[class*="vlc"]',

  // FFmpeg
  'div[id*="ffmpeg"]',
  'div[class*="ffmpeg"]',

  // Loom
  'div[id*="loom"]',
  'div[class*="loom"]',

  // Zoom
  'div[id*="zoom"]',
  'div[class*="zoom"]',

  // Teams
  'div[id*="teams"]',
  'div[class*="teams"]',
  'div[id*="microsoft"]',
  'div[class*="microsoft"]',

  // Skype
  'div[id*="skype"]',
  'div[class*="skype"]',

  // Discord
  'div[id*="discord"]',
  'div[class*="discord"]',

  // Streamlabs
  'div[id*="streamlabs"]',
  'div[class*="streamlabs"]',

  // Wirecast
  'div[id*="wirecast"]',
  'div[class*="wirecast"]',

  // ManyCam
  'div[id*="manycam"]',
  'div[class*="manycam"]',

  // ===== MOBILE SCREEN RECORDING =====
  'div[id*="mobizen"]',
  'div[class*="mobizen"]',
  'div[id*="apowersoft"]',
  'div[class*="apowersoft"]',
  'div[id*="du-recorder"]',
  'div[class*="du-recorder"]',
  'div[id*="az-recorder"]',
  'div[class*="az-recorder"]',

  // ===== SUSPICIOUS ATTRIBUTES =====
  '[data-testid*="screen"]',
  '[data-testid*="record"]',
  '[data-testid*="capture"]',
  '[data-cy*="screen"]',
  '[data-cy*="record"]',
  '[data-cy*="capture"]',
  '[aria-label*="screen"]',
  '[aria-label*="record"]',
  '[aria-label*="capture"]',
  '[title*="screen"]',
  '[title*="record"]',
  '[title*="capture"]',
  '[alt*="screen"]',
  '[alt*="record"]',
  '[alt*="capture"]',

  // ===== CANVAS ELEMENTS (POTENTIALLY USED FOR SCREEN CAPTURE) =====
  'canvas[id*="screen"]',
  'canvas[id*="record"]',
  'canvas[id*="capture"]',
  'canvas[class*="screen"]',
  'canvas[class*="record"]',
  'canvas[class*="capture"]',

  // ===== VIDEO ELEMENTS (POTENTIALLY SHOWING SCREEN CONTENT) =====
  'video[id*="screen"]',
  'video[id*="desktop"]',
  'video[id*="display"]',
  'video[class*="screen"]',
  'video[class*="desktop"]',
  'video[class*="display"]',

  // ===== IFRAME SUSPICIOUS SOURCES =====
  'iframe[src*="screen"]',
  'iframe[src*="record"]',
  'iframe[src*="capture"]',
  'iframe[src*="broadcast"]',
  'iframe[src*="stream"]',

  // ===== BUTTON ELEMENTS =====
  'button[id*="screen"]',
  'button[id*="record"]',
  'button[id*="capture"]',
  'button[class*="screen"]',
  'button[class*="record"]',
  'button[class*="capture"]',
  'input[value*="screen"]',
  'input[value*="record"]',
  'input[value*="capture"]',

  // ===== GENERIC SUSPICIOUS PATTERNS =====
  '[id*="overlay"]',
  '[class*="overlay"]',
  '[id*="popup"]',
  '[class*="popup"]',
  '[id*="modal"][id*="screen"]',
  '[class*="modal"][class*="screen"]',
  '[id*="dialog"][id*="screen"]',
  '[class*="dialog"][class*="screen"]',

  // ===== WEB-BASED SCREEN RECORDERS =====
  'div[id*="screencastify"]',
  'div[class*="screencastify"]',
  'div[id*="nimbus"]',
  'div[class*="nimbus"]',
  'div[id*="clipchamp"]',
  'div[class*="clipchamp"]',
  'div[id*="recordscreen"]',
  'div[class*="recordscreen"]',
  'div[id*="screencapture"]',
  'div[class*="screencapture"]',
  'div[id*="webrtc"]',
  'div[class*="webrtc"]',

  // ===== DEVELOPER TOOLS =====
  'div[id*="devtools"]',
  'div[class*="devtools"]',
  'div[id*="inspector"]',
  'div[class*="inspector"]',
  'div[id*="debugger"]',
  'div[class*="debugger"]',
  'div[id*="console"]',
  'div[class*="console"]',

  // ===== CHROME SPECIFIC =====
  'div[id*="chrome"]',
  'div[class*="chrome"]',
  '[id*="__CHROME_EXTENSION__"]',
  '[class*="__CHROME_EXTENSION__"]',

  // ===== MEDIA STREAM API ELEMENTS =====
  'div[id*="mediastream"]',
  'div[class*="mediastream"]',
  'div[id*="getusermedia"]',
  'div[class*="getusermedia"]',
  'div[id*="getdisplaymedia"]',
  'div[class*="getdisplaymedia"]',
];

const suspiciousTextPatterns = [
  // English
  /screen.*record/i,
  /record.*screen/i,
  /capture.*screen/i,
  /screen.*capture/i,
  /screen.*shot/i,
  /screenshot/i,
  /screen.*grab/i,
  /desktop.*record/i,
  /record.*desktop/i,
  /video.*record/i,
  /record.*video/i,
  /start.*record/i,
  /stop.*record/i,
  /recording/i,
  /broadcaster/i,
  /streaming/i,
  /live.*stream/i,
  /screen.*share/i,
  /share.*screen/i,
  /display.*capture/i,
  /capture.*display/i,

  // Vietnamese
  /quay.*màn.*hình/i,
  /ghi.*màn.*hình/i,
  /chụp.*màn.*hình/i,
  /thu.*âm/i,
  /ghi.*âm/i,
  /quay.*video/i,
  /ghi.*hình/i,
  /chia.*sẻ.*màn.*hình/i,
  /bắt.*đầu.*quay/i,
  /dừng.*quay/i,
  /đang.*quay/i,
  /livestream/i,
  /phát.*trực.*tiếp/i,

  // Chinese
  /录屏/i,
  /屏幕录制/i,
  /截屏/i,
  /录像/i,
  /录音/i,
  /直播/i,
  /屏幕共享/i,

  // Japanese
  /画面録画/i,
  /スクリーンショット/i,
  /画面キャプチャ/i,
  /録画/i,
  /配信/i,

  // Korean
  /화면녹화/i,
  /스크린샷/i,
  /화면캡처/i,
  /녹화/i,
  /방송/i,

  // Spanish
  /grabar.*pantalla/i,
  /captura.*pantalla/i,
  /grabación/i,
  /transmisión/i,

  // French
  /enregistrer.*écran/i,
  /capture.*écran/i,
  /enregistrement/i,
  /diffusion/i,

  // German
  /bildschirm.*aufnahme/i,
  /screenshot/i,
  /aufzeichnung/i,
  /übertragung/i,

  // Russian
  /запись.*экрана/i,
  /скриншот/i,
  /захват.*экрана/i,
  /трансляция/i,

  // Software names
  /obs.*studio/i,
  /bandicam/i,
  /camtasia/i,
  /fraps/i,
  /snagit/i,
  /xsplit/i,
  /shadowplay/i,
  /streamlabs/i,
  /wirecast/i,
  /loom/i,
  /screencastify/i,
  /nimbus/i,
  /clipchamp/i,
  /apowersoft/i,
  /mobizen/i,
  /az.*screen.*recorder/i,
  /du.*recorder/i,
  /game.*bar/i,
  /nvidia.*share/i,
  /amd.*relive/i,

  // Technical terms
  /mediarecorder/i,
  /getdisplaymedia/i,
  /getusermedia/i,
  /webrtc/i,
  /canvas.*stream/i,
  /video.*stream/i,
  /media.*stream/i,
  /screen.*api/i,
  /capture.*api/i,
];

// ===== SECURITY CONSTANTS =====
const SECURITY_CONFIG = {
  CHECK_INTERVAL: 100, // ms
  VIOLATION_THRESHOLD: 3,
  BLOCKED_MESSAGE: "Nội dung này không được phép sử dụng",
  ALLOWED_DEVTOOLS_TIME: 2000, // ms
  MICROPHONE_CHECK_INTERVAL: 1000, // ms - kiểm tra microphone mỗi giây
};

// ===== SECURITY DETECTION SYSTEM =====

export class SecurityDetector {
  constructor(onViolation) {
    this.onViolation = onViolation;
    this.violationCount = 0;
    this.isBlocked = false;
    this.intervalId = null;
    this.lastDevToolsCheck = 0;
    this.originalConsole = { ...console };
    this.mediaRecorders = new Set();
    this.observers = [];
    this.isFullscreen = false;

    this.audioContext = null;
    this.microphoneStream = null;
    this.audioAnalyser = null;
    this.microphoneCheckInterval = null;
    this.microphoneAccessCount = 0;
    this.suspiciousAudioActivity = 0;
    this.audioPermissionState = "unknown";
    this.originalGetUserMedia = null;
    this.startMonitoring();
  }

  startMonitoring() {
    // Kiểm tra định kỳ
    this.intervalId = setInterval(() => {
      this.performSecurityChecks();
    }, SECURITY_CONFIG.CHECK_INTERVAL);

    // Thiết lập các event listeners
    this.setupEventListeners();

    // Khởi tạo các biện pháp bảo vệ
    this.initializeProtections();
  }

  // THÊM: Phương thức kiểm tra microphone access
  initMicrophoneDetection() {
    // Kiểm tra permission ban đầu
    this.checkMicrophonePermission();

    // Monitor getUserMedia calls
    this.monitorGetUserMedia();

    // Kiểm tra định kỳ microphone state
    this.microphoneCheckInterval = setInterval(() => {
      this.checkMicrophoneActivity();
    }, SECURITY_CONFIG.MICROPHONE_CHECK_INTERVAL);

    // Monitor audio context creation
    this.monitorAudioContext();
  }

  // THÊM: Kiểm tra permission microphone
  async checkMicrophonePermission() {
    try {
      if (navigator.permissions) {
        const micPermission = await navigator.permissions.query({
          name: "microphone",
        });
        this.audioPermissionState = micPermission.state;

        // Nếu microphone được granted mà không phải do user action
        if (micPermission.state === "granted") {
          this.reportViolation(
            "Microphone permission already granted - possible recording software"
          );
        }

        // Listen for permission changes
        micPermission.onchange = () => {
          if (
            micPermission.state === "granted" &&
            this.audioPermissionState !== "granted"
          ) {
            this.reportViolation(
              "Microphone permission granted - recording detected"
            );
          }
          this.audioPermissionState = micPermission.state;
        };
      }
    } catch (error) {
      // Nếu không thể check permission, có thể là do blocking software
      this.reportViolation(
        "Cannot check microphone permission - possible interference"
      );
    }
  }

  // THÊM: Monitor getUserMedia cho microphone
  monitorGetUserMedia() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.originalGetUserMedia = navigator.mediaDevices.getUserMedia;
      const self = this;

      navigator.mediaDevices.getUserMedia = function (constraints) {
        self.microphoneAccessCount++;

        // Kiểm tra nếu có request microphone
        if (constraints && constraints.audio) {
          self.reportViolation(
            "Microphone access requested - recording detected"
          );

          // Nếu có cả video và audio, rất nghi ngờ screen recording với audio
          if (constraints.video) {
            self.reportViolation("Video + Audio recording detected", 2);
          }
        }

        // Cho phép request nhưng monitor stream
        return self.originalGetUserMedia
          .call(navigator.mediaDevices, constraints)
          .then((stream) => {
            if (stream.getAudioTracks().length > 0) {
              self.monitorAudioStream(stream);
            }
            return stream;
          });
      };
    }

    // Monitor legacy getUserMedia
    if (navigator.getUserMedia) {
      const originalLegacy = navigator.getUserMedia;
      navigator.getUserMedia = function (constraints, success, error) {
        if (constraints && constraints.audio) {
          this.reportViolation("Legacy microphone access - recording detected");
        }
        return originalLegacy.call(navigator, constraints, success, error);
      }.bind(this);
    }
  }

  // THÊM: Monitor audio stream
  monitorAudioStream(stream) {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
      }

      const source = this.audioContext.createMediaStreamSource(stream);
      this.audioAnalyser = this.audioContext.createAnalyser();
      this.audioAnalyser.fftSize = 256;

      source.connect(this.audioAnalyser);

      // Analyze audio activity
      this.analyzeAudioActivity();

      // Monitor stream state
      stream.getAudioTracks().forEach((track) => {
        track.onended = () => {
          this.reportViolation("Audio track ended unexpectedly");
        };

        // Check if track is being recorded
        if (track.readyState === "live" && track.enabled) {
          this.reportViolation(
            "Live audio track detected - recording in progress"
          );
        }
      });
    } catch (error) {
      this.reportViolation(
        "Audio context creation failed - possible interference"
      );
    }
  }

  // THÊM: Phân tích hoạt động audio
  analyzeAudioActivity() {
    if (!this.audioAnalyser) return;

    const bufferLength = this.audioAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkAudio = () => {
      this.audioAnalyser.getByteFrequencyData(dataArray);

      // Tính average amplitude
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;

      // Nếu có audio activity mà không có user interaction
      if (average > 10) {
        // Threshold cho background audio
        this.suspiciousAudioActivity++;

        if (this.suspiciousAudioActivity > 100) {
          // 100 lần check = ~100 giây
          this.reportViolation("Sustained audio activity - recording detected");
        }
      }

      // Continue monitoring
      if (!this.isBlocked) {
        requestAnimationFrame(checkAudio);
      }
    };

    checkAudio();
  }

  // THÊM: Monitor AudioContext creation
  monitorAudioContext() {
    const OriginalAudioContext =
      window.AudioContext || window.webkitAudioContext;

    if (OriginalAudioContext) {
      const self = this;

      window.AudioContext = function (...args) {
        self.reportViolation("AudioContext created - possible audio recording");
        return new OriginalAudioContext(...args);
      };

      if (window.webkitAudioContext) {
        window.webkitAudioContext = function (...args) {
          self.reportViolation(
            "WebkitAudioContext created - possible audio recording"
          );
          return new OriginalAudioContext(...args);
        };
      }
    }
  }

  // THÊM: Kiểm tra microphone activity
  checkMicrophoneActivity() {
    try {
      // Kiểm tra active media streams
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        navigator.mediaDevices
          .enumerateDevices()
          .then((devices) => {
            const audioInputs = devices.filter(
              (device) => device.kind === "audioinput"
            );

            // Nếu có nhiều audio input devices active
            if (audioInputs.length > 2) {
              this.reportViolation(
                "Multiple audio input devices - recording software detected"
              );
            }

            // Check device labels (chỉ available nếu có permission)
            audioInputs.forEach((device) => {
              if (device.label) {
                const label = device.label.toLowerCase();
                // Kiểm tra tên device nghi ngờ
                const suspiciousNames = [
                  "obs",
                  "streamlabs",
                  "bandicam",
                  "virtual",
                  "voicemeeter",
                  "cable",
                  "loopback",
                  "soundflower",
                  "audio repeater",
                ];

                if (suspiciousNames.some((name) => label.includes(name))) {
                  this.reportViolation(
                    `Suspicious audio device detected: ${device.label}`
                  );
                }
              }
            });
          })
          .catch(() => {
            // Nếu không thể enumerate devices
            this.reportViolation(
              "Cannot enumerate audio devices - possible interference"
            );
          });
      }

      // Kiểm tra audio context state
      if (this.audioContext) {
        if (
          this.audioContext.state === "running" &&
          this.suspiciousAudioActivity === 0
        ) {
          // Audio context running nhưng không có activity từ user
          this.reportViolation("Audio context running without user activity");
        }
      }
    } catch (error) {
      this.reportViolation("Audio check failed - possible interference");
    }
  }

  // THÊM: Detect screen recording với audio
  detectScreenRecordingWithAudio() {
    // Kiểm tra combination của screen recording và audio
    const hasScreenCapture = this.mediaRecorders.size > 0;
    const hasAudioAccess = this.microphoneAccessCount > 0;
    const hasAudioActivity = this.suspiciousAudioActivity > 0;

    if (hasScreenCapture && (hasAudioAccess || hasAudioActivity)) {
      this.reportViolation("Screen recording with audio detected", 3);
      return true;
    }

    // Kiểm tra MediaRecorder với audio tracks
    for (const recorder of this.mediaRecorders) {
      if (recorder.stream && recorder.stream.getAudioTracks().length > 0) {
        this.reportViolation("MediaRecorder with audio tracks detected", 2);
        return true;
      }
    }

    return false;
  }

  detectWindowManagerChanges() {
    // Monitor window composition changes
    let lastCompositionTime = performance.now();

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "paint") {
          const currentTime = performance.now();
          const timeDiff = currentTime - lastCompositionTime;

          // Snipping Tool causes composition timing changes
          if (timeDiff > 100 && timeDiff < 500) {
            this.reportViolation("Window composition anomaly");
          }
          lastCompositionTime = currentTime;
        }
      }
    });

    observer.observe({ entryTypes: ["paint"] });
  }
  // Detect clipboard activity patterns của Snipping Tool
  detectClipboardPatterns() {
    let clipboardAccess = 0;
    const startTime = Date.now();

    // Override clipboard API
    if (navigator.clipboard) {
      const originalWrite = navigator.clipboard.writeText;
      navigator.clipboard.writeText = function (...args) {
        clipboardAccess++;
        const timePassed = Date.now() - startTime;

        // Snipping Tool có pattern clipboard access đặc trước
        if (timePassed < 5000 && clipboardAccess > 2) {
          this.reportViolation("Snipping Tool clipboard pattern detected");
        }

        return originalWrite.apply(this, args);
      };
    }
  }
  // Thêm vào SecurityDetector class
  detectHardwareAcceleration() {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);

        // Store GPU info để detect GPU scheduling changes
        this.gpuInfo = { renderer, vendor };

        // Monitor GPU performance degradation (screen recording affects GPU)
        this.monitorGPUPerformance();
      }
    }
  }

  monitorGPUPerformance() {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");

    if (!gl) return;

    // Try to get GPU disjoint timer extension
    const ext =
      gl.getExtension("EXT_disjoint_timer_query") ||
      gl.getExtension("EXT_disjoint_timer_query_webgl2");

    if (ext) {
      this.monitorWithTimerQuery(gl, ext);
    } else {
      // Fallback to simple timing
      this.monitorWithSimpleTiming(gl);
    }
  }

  monitorWithTimerQuery(gl, ext) {
    const query = ext.createQueryEXT();

    setInterval(() => {
      ext.beginQueryEXT(ext.TIME_ELAPSED_EXT, query);

      // Perform GPU work
      this.performGPUWork(gl);

      ext.endQueryEXT(ext.TIME_ELAPSED_EXT);

      // Check if query is ready
      setTimeout(() => {
        if (ext.getQueryObjectEXT(query, ext.QUERY_RESULT_AVAILABLE_EXT)) {
          const timeElapsed = ext.getQueryObjectEXT(
            query,
            ext.QUERY_RESULT_EXT
          );

          if (!this.baselineGPUTime) {
            this.baselineGPUTime = timeElapsed;
          } else if (timeElapsed > this.baselineGPUTime * 1.8) {
            this.reportViolation(
              "GPU timer query shows performance degradation"
            );
          }
        }
      }, 100);
    }, 5000);
  }

  performGPUWork(gl) {
    // Simple GPU workload for timing
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      512,
      512,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.deleteTexture(texture);
  }

  detectMemoryAnomalies() {
    if (!performance.memory) return false;

    // Lấy thông tin memory ban đầu
    if (!this.baselineMemory) {
      this.baselineMemory = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now(),
      };

      // Ước tính RAM khả dụng cho browser
      this.estimatedAvailableRAM = performance.memory.jsHeapSizeLimit;

      return false;
    }

    const current = performance.memory.usedJSHeapSize;
    const baseline = this.baselineMemory.used;
    const growth = current - baseline;
    const timeElapsed = Date.now() - this.baselineMemory.timestamp;

    // Tính toán ngưỡng động dựa trên khả năng memory
    const availableMemory = this.estimatedAvailableRAM;

    // Ngưỡng memory growth theo phần trăm thay vì số tuyệt đối
    const growthThresholdPercent = 0.15; // 15% của available memory
    const growthThreshold = availableMemory * growthThresholdPercent;

    // Ngưỡng tối thiểu và tối đa để tránh false positive
    const minThreshold = 10 * 1024 * 1024; // 10MB tối thiểu
    const maxThreshold = 100 * 1024 * 1024; // 100MB tối đa

    const finalThreshold = Math.max(
      minThreshold,
      Math.min(growthThreshold, maxThreshold)
    );

    // Kiểm tra memory growth bất thường
    if (growth > finalThreshold) {
      // Thêm kiểm tra thời gian để tránh false positive khi app load ban đầu
      if (timeElapsed > 30000) {
        // Chỉ check sau 30 giây
        this.reportViolation(
          `Suspicious memory growth: ${Math.round(growth / 1024 / 1024)}MB`
        );
        return true;
      }
    }

    // Kiểm tra memory usage rate - tốc độ tăng memory
    const growthRate = growth / (timeElapsed / 1000); // bytes per second
    const suspiciousGrowthRate = 1024 * 1024; // 1MB/second

    if (growthRate > suspiciousGrowthRate && timeElapsed > 10000) {
      this.reportViolation(
        `High memory growth rate: ${Math.round(growthRate / 1024)}KB/s`
      );
      return true;
    }

    // Kiểm tra memory fragmentation (có thể do screen recording software)
    const fragmentationRatio = current / performance.memory.totalJSHeapSize;
    if (fragmentationRatio > 0.8) {
      // 80% fragmentation
      this.reportViolation("High memory fragmentation detected");
      return true;
    }

    // Cập nhật baseline memory định kỳ (mỗi 5 phút)
    if (timeElapsed > 300000) {
      // 5 minutes
      this.baselineMemory = {
        used: current,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now(),
      };
    }

    return false;
  }

  setupEventListeners() {
    // Ngăn chặn các phím tắt
    document.addEventListener("keydown", this.preventKeyboardShortcuts);
    document.addEventListener("keypress", this.preventKeyboardShortcuts);
    document.addEventListener("keyup", this.preventKeyboardShortcuts);

    // Theo dõi print
    window.addEventListener("beforeprint", this.handlePrintAttempt);
    window.addEventListener("afterprint", this.handlePrintAttempt);
  }

  initializeProtections() {
    // Vô hiệu hóa selection
    document.body.style.userSelect = "none";
    // Ngăn chặn drag
    document.body.style.userDrag = "none";

    // Thêm CSS chống inspection
    this.injectAntiInspectionCSS();

    // Theo dõi MediaRecorder API
    this.monitorMediaRecorder();

    // Theo dõi Screen Capture API
    this.monitorScreenCapture();

    //  Thêm method mới để detect theo tên process
    this.detectRecordingSoftware();

    // Ngăn chặn console
    // this.disableConsole();

    // Theo dõi DOM mutations
    this.setupDOMMutationObserver();

    this.detectHardwareAcceleration();
    this.detectClipboardPatterns();
    this.detectWindowManagerChanges();
    this.detectMemoryAnomalies();
    this.detectSnippingToolTiming();
    this.detectResolutionChanges();
    this.initMicrophoneDetection();
    this.detectScreenRecordingWithAudio();
  }

  detectSnippingToolTiming() {
    let eventTimings = [];

    ["keydown", "keyup", "mousedown", "mouseup"].forEach((eventType) => {
      document.addEventListener(eventType, (e) => {
        const timing = {
          type: eventType,
          timestamp: performance.now(),
          key: e.key || "mouse",
        };

        eventTimings.push(timing);

        // Keep only recent events
        eventTimings = eventTimings.filter(
          (t) => timing.timestamp - t.timestamp < 2000
        );

        // Analyze pattern - Snipping Tool có sequence đặc trưng
        if (this.isSnippingToolPattern(eventTimings)) {
          this.reportViolation("Snipping Tool event pattern detected");
        }
      });
    });
  }

  isSnippingToolPattern(timings) {
    // Pattern: Win key -> Shift -> S trong vòng 500ms
    const recent = timings.slice(-3);
    if (recent.length < 3) return false;

    const [first, second, third] = recent;
    const timespan = third.timestamp - first.timestamp;

    return (
      timespan < 500 &&
      first.key === "Meta" &&
      second.key === "Shift" &&
      third.key === "s"
    );
  }

  detectResolutionChanges() {
    let lastScreenData = {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
    };

    setInterval(() => {
      const current = {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
      };

      // Snipping Tool có thể trigger resolution changes
      if (JSON.stringify(current) !== JSON.stringify(lastScreenData)) {
        this.reportViolation("Screen resolution changed");
        lastScreenData = current;
      }
    }, 500);
  }

  injectAntiInspectionCSS() {
    const style = document.createElement("style");
    style.textContent = `
      * {
        -webkit-touch-callout: none !important;
        -webkit-user-select: none !important;
        -khtml-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-user-drag: none !important;
        user-drag: none !important;
      }
      
      video {
        pointer-events: auto !important;
      }
      
      @media print {
        * {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  detectWindowSizeChanges() {
    const currentTime = Date.now();
    const currentSize = {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
    };

    if (!this.lastWindowSize) {
      this.lastWindowSize = currentSize;
      this.lastWindowCheck = currentTime;
      return false;
    }

    // Kiểm tra thay đổi kích thước bất thường
    const widthDiff = Math.abs(
      currentSize.innerWidth - this.lastWindowSize.innerWidth
    );
    const heightDiff = Math.abs(
      currentSize.innerHeight - this.lastWindowSize.innerHeight
    );
    const timeDiff = currentTime - this.lastWindowCheck;

    // Nếu có thay đổi size lớn trong thời gian ngắn (có thể do recording software)
    if (timeDiff < 1000 && (widthDiff > 100 || heightDiff > 100)) {
      return true;
    }

    this.lastWindowSize = currentSize;
    this.lastWindowCheck = currentTime;
    return false;
  }

  performSecurityChecks() {
    if (this.isBlocked) return;

    // Kiểm tra DevTools
    // if (this.detectDevTools()) {
    //   this.reportViolation("DevTools detected");
    // }

    // Kiểm tra screen recording
    if (this.detectScreenRecording()) {
      this.reportViolation("Screen recording detected");
    }

    // Kiểm tra extensions
    if (this.detectSuspiciousExtensions()) {
      this.reportViolation("Suspicious extensions detected");
    }

    // THÊM: Kiểm tra window size changes (OBS có thể thay đổi)
    if (this.detectWindowSizeChanges()) {
      this.reportViolation("Suspicious window changes");
    }

    // THÊM: Kiểm tra Snipping Tool specific
    if (this.detectSnippingTool()) {
      return true;
    }

    // THÊM: Kiểm tra Windows Game DVR
    if (this.detectWindowsGameDVR()) {
      return true;
    }
  }

  detectSnippingTool() {
    try {
      // 1. Kiểm tra Clipboard API có bị monitor không
      if (navigator.clipboard) {
        // Snipping Tool thường hook clipboard
        const originalRead = navigator.clipboard.readText;
        let isHooked = false;

        navigator.clipboard.readText = function () {
          isHooked = true;
          return originalRead.apply(this, arguments);
        };

        // Test clipboard
        setTimeout(() => {
          if (isHooked) {
            this.reportViolation(
              "Clipboard monitoring detected - Snipping Tool"
            );
          }
        }, 10);
      }

      // 2. Kiểm tra keyboard event timing
      let keyEventCount = 0;
      const keyStart = Date.now();

      const keyHandler = (e) => {
        keyEventCount++;
        const timePassed = Date.now() - keyStart;

        // Nếu có quá nhiều key event trong thời gian ngắn
        if (timePassed < 1000 && keyEventCount > 10) {
          this.reportViolation(
            "Abnormal keyboard activity - possible Snipping Tool"
          );
          document.removeEventListener("keydown", keyHandler);
        }
      };

      document.addEventListener("keydown", keyHandler);

      // 3. Kiểm tra Window focus/blur pattern
      let focusBlurCount = 0;
      const focusStart = Date.now();

      const focusHandler = () => {
        focusBlurCount++;
        const timePassed = Date.now() - focusStart;

        if (timePassed < 2000 && focusBlurCount > 5) {
          this.reportViolation("Suspicious focus pattern - Snipping Tool");
          window.removeEventListener("focus", focusHandler);
          window.removeEventListener("blur", focusHandler);
        }
      };

      window.addEventListener("focus", focusHandler);
      window.addEventListener("blur", focusHandler);
    } catch (error) {
      return true;
    }

    return false;
  }

  // THÊM method kiểm tra Windows Game DVR
  detectWindowsGameDVR() {
    try {
      // 1. Kiểm tra Game Bar hotkey
      let gameBarDetected = false;

      const gameBarHandler = (e) => {
        // Win + G (Game Bar)
        if (e.metaKey && e.key.toLowerCase() === "g") {
          gameBarDetected = true;
          this.reportViolation("Game Bar hotkey detected");
        }

        // Win + Alt + R (Start/Stop recording)
        if (e.metaKey && e.altKey && e.key.toLowerCase() === "r") {
          gameBarDetected = true;
          this.reportViolation("Game DVR recording hotkey detected");
        }
      };

      document.addEventListener("keydown", gameBarHandler);

      // 2. Kiểm tra performance timing pattern của Game DVR
      const entries = performance.getEntriesByType("navigation");
      if (entries.length > 0) {
        const timing = entries[0];
        // Game DVR có thể làm chậm navigation
        if (timing.loadEventEnd - timing.navigationStart > 8000) {
          return true;
        }
      }

      // 3. Kiểm tra GPU scheduling priority
      if (this.gpuInfo) {
        const gpuString =
          `${this.gpuInfo.vendor} ${this.gpuInfo.renderer}`.toLowerCase();

        // Game DVR ưu tiên sử dụng hardware acceleration
        if (
          gpuString.includes("nvidia") ||
          gpuString.includes("amd") ||
          gpuString.includes("intel")
        ) {
          // Kiểm tra có process nào đang sử dụng GPU cao không
          const canvas = document.createElement("canvas");
          const gl = canvas.getContext("webgl");

          if (gl) {
            const startTime = performance.now();

            // Tạo GPU workload nhẹ
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array(1000),
              gl.STATIC_DRAW
            );

            const endTime = performance.now();

            // Nếu GPU operation chậm bất thường
            if (endTime - startTime > 5) {
              return true;
            }
          }
        }
      }

      return gameBarDetected;
    } catch (error) {
      return true;
    }
  }

  detectDevTools() {
    const now = Date.now();

    // Phương pháp 1: Kiểm tra thời gian thực thi
    const start = now;
    debugger;
    const end = Date.now();

    if (end - start > 100) {
      return true;
    }

    // Phương pháp 2: Kiểm tra kích thước cửa sổ
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;

    if (widthThreshold || heightThreshold) {
      return true;
    }

    // Phương pháp 3: Kiểm tra console
    let devtools = false;
    const consoleCheck = () => {
      devtools = true;
    };
    console.log("%c", consoleCheck);
    return devtools;
  }

  // 1. Sửa detectScreenRecording() - thêm detection cho các phần mềm phổ biến
  detectScreenRecording() {
    // Kiểm tra MediaRecorder hoạt động
    if (this.mediaRecorders.size > 0) {
      return true;
    }

    // THÊM: Kiểm tra các tiến trình screen recording phổ biến
    try {
      // Kiểm tra title của window - OBS thường thay đổi title
      const windowTitle = document.title;
      if (windowTitle !== document.title) {
        return true;
      }

      // Kiểm tra performance entries cho screen capture
      const entries = performance.getEntriesByType("navigation");
      if (entries.length > 0) {
        const entry = entries[0];
        // Nếu có screen capture, thời gian load sẽ bất thường
        if (entry.loadEventEnd - entry.navigationStart > 10000) {
          return true;
        }
      }

      // THÊM: Kiểm tra canvas fingerprinting - OBS/Bandicam có thể ảnh hưởng
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillText("Screen recording test", 2, 2);
      const fingerprint = canvas.toDataURL();

      // Lưu fingerprint đầu tiên
      if (!this.initialFingerprint) {
        this.initialFingerprint = fingerprint;
      } else if (this.initialFingerprint !== fingerprint) {
        return true; // Canvas bị thay đổi - có thể do screen recording
      }
    } catch (error) {
      // Nếu có lỗi bất thường, có thể do screen recording software
      return true;
    }

    // Kiểm tra getDisplayMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      // Patch getDisplayMedia để phát hiện
      const original = navigator.mediaDevices.getDisplayMedia;
      navigator.mediaDevices.getDisplayMedia = () => {
        this.reportViolation("Screen capture attempt");
        return Promise.reject(new Error("Screen capture blocked"));
      };
    }

    return false;
  }

  detectSuspiciousExtensions() {
    // Kiểm tra các extension phổ biến dùng để record

    for (const selector of suspiciousElements) {
      if (document.querySelector(selector)) {
        console.log(selector);
        return true;
      }
    }

    return false;
  }

  isSuspiciousElement(element) {
    if (!element) return false;
    // ===== SUSPICIOUS TEXT PATTERNS =====

    const textContent = element
      ? String(element.textContent || "").toLowerCase()
      : "";
    const className = element
      ? String(element.className || "").toLowerCase()
      : "";
    const id = element ? String(element.id || "").toLowerCase() : "";
    const dataAttributes = Array.from(element.attributes || [])
      .filter((attr) => attr.name.startsWith("data-"))
      .map((attr) => `${attr.name}=${attr.value}`)
      .join(" ")
      .toLowerCase();

    const fullText = `${textContent} ${className} ${id} ${dataAttributes}`;

    // Check against text patterns
    const hasSupiciousText = suspiciousTextPatterns.some((pattern) => {
      return pattern.test(fullText);
    });

    if (hasSupiciousText) return true;

    // Check for suspicious URLs in src/href attributes
    const src = element.src || element.href || "";
    const suspiciousUrlPatterns = [
      /chrome-extension/i,
      /moz-extension/i,
      /ms-browser-extension/i,
      /safari-extension/i,
      /screen.*record/i,
      /record.*screen/i,
      /capture/i,
      /obs/i,
      /bandicam/i,
      /streamlabs/i,
    ];

    const hasSuspiciousUrl = suspiciousUrlPatterns.some((pattern) =>
      pattern.test(src)
    );

    if (hasSuspiciousUrl) return true;

    // Check for specific attributes that indicate recording software
    const suspiciousAttributes = [
      "data-recording",
      "data-capture",
      "data-screen",
      "data-obs",
      "data-stream",
      "recording",
      "capturing",
      "streaming",
    ];

    const hasSuspiciousAttribute = suspiciousAttributes.some(
      (attr) =>
        element.hasAttribute(attr) ||
        element.getAttribute("class")?.includes(attr) ||
        element.getAttribute("id")?.includes(attr)
    );

    return hasSuspiciousAttribute;
  }

  monitorSuspiciousNetworkActivity() {
    // Override fetch API
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      const url = args[0];
      const suspiciousUrlKeywords = [
        "upload",
        "stream",
        "broadcast",
        "record",
        "capture",
        "obs",
        "bandicam",
        "screencast",
        "video-upload",
        "media-upload",
        "file-upload",
        "twitch",
        "youtube",
        "facebook",
        "tiktok",
        "instagram",
      ];

      if (typeof url === "string") {
        const hasSupiciousKeyword = suspiciousUrlKeywords.some((keyword) =>
          url.toLowerCase().includes(keyword)
        );

        if (hasSuspiciousKeyword) {
          console.warn("Suspicious network request detected:", url);
          // Có thể block hoặc report violation ở đây
        }
      }

      return originalFetch.apply(this, args);
    };

    // Override XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...args) {
      if (typeof url === "string") {
        const suspiciousUrlKeywords = [
          "upload",
          "stream",
          "broadcast",
          "record",
          "capture",
          "obs",
          "bandicam",
          "screencast",
          "video-upload",
        ];

        const hasSuspiciousKeyword = suspiciousUrlKeywords.some((keyword) =>
          url.toLowerCase().includes(keyword)
        );

        if (hasSuspiciousKeyword) {
          console.warn("Suspicious XHR request detected:", url);
          // Có thể block hoặc report violation ở đây
        }
      }

      return originalXHROpen.apply(this, arguments);
    };
  }

  monitorMediaRecorder() {
    if (window.MediaRecorder) {
      const OriginalMediaRecorder = window.MediaRecorder;

      window.MediaRecorder = class extends OriginalMediaRecorder {
        constructor(...args) {
          super(...args);
          this.detector = this;
          this.mediaRecorders.add(this);
          this.reportViolation("MediaRecorder created");
        }

        start(...args) {
          this.reportViolation("Recording started");
          return super.start(...args);
        }
      };
    }
  }

  monitorScreenCapture() {
    // Patch getDisplayMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      const original = navigator.mediaDevices.getDisplayMedia;
      navigator.mediaDevices.getDisplayMedia = (...args) => {
        this.reportViolation("Screen capture requested");
        return Promise.reject(new Error("Screen capture blocked"));
      };
    }

    // THÊM: Monitor getUserMedia cho screen capture
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
      navigator.mediaDevices.getUserMedia = (constraints) => {
        // Kiểm tra nếu constraints có screen capture
        if (
          constraints &&
          (constraints.video === true ||
            (constraints.video && constraints.video.mediaSource))
        ) {
          this.reportViolation("Screen capture via getUserMedia detected");
          return Promise.reject(new Error("Screen capture blocked"));
        }
        return originalGetUserMedia.call(navigator.mediaDevices, constraints);
      };
    }

    // THÊM: Monitor WebRTC cho screen sharing
    if (window.RTCPeerConnection) {
      const OriginalRTC = window.RTCPeerConnection;
      window.RTCPeerConnection = function (...args) {
        const pc = new OriginalRTC(...args);
        const originalAddTrack = pc.addTrack;

        pc.addTrack = function (track, ...streams) {
          // Kiểm tra nếu track là screen capture
          if (
            track &&
            track.getSettings &&
            track.getSettings().displaySurface
          ) {
            this.reportViolation("Screen sharing via WebRTC detected");
            throw new Error("Screen sharing blocked");
          }
          return originalAddTrack.call(this, track, ...streams);
        };

        return pc;
      };
    }

    // Monitor clipboard API (cho Snipping Tool)
    if (navigator.clipboard) {
      const originalWriteText = navigator.clipboard.writeText;
      const originalWrite = navigator.clipboard.write;

      navigator.clipboard.writeText = (...args) => {
        this.reportViolation("Clipboard access detected");
        return originalWriteText.apply(navigator.clipboard, args);
      };

      navigator.clipboard.write = (...args) => {
        this.reportViolation("Clipboard write detected");
        return originalWrite.apply(navigator.clipboard, args);
      };
    }

    // THÊM: Monitor window focus changes - screen recording software có thể ảnh hưởng
    let focusChangeCount = 0;
    const startTime = Date.now();

    window.addEventListener("focus", () => {
      focusChangeCount++;
      const timePassed = Date.now() - startTime;

      // Nếu có quá nhiều focus changes trong thời gian ngắn
      if (timePassed < 30000 && focusChangeCount > 10) {
        this.reportViolation(
          "Suspicious focus changes - possible screen recording"
        );
      }
    });

    window.addEventListener("blur", () => {
      focusChangeCount++;
    });
  }

  detectRecordingSoftware() {
    // THÊM: Kiểm tra performance timing cho screen recording
    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;

    // Screen recording software có thể làm chậm load time
    if (loadTime > 15000) {
      // 15 giây
      return true;
    }

    // THÊM: Kiểm tra memory usage bất thường
    if (performance.memory) {
      const memInfo = performance.memory;
      // Nếu memory usage cao bất thường (screen recording software tốn RAM)
      if (memInfo.usedJSHeapSize > 100 * 1024 * 1024) {
        // 100MB
        return true;
      }
    }

    // THÊM: Kiểm tra network timing - screen recording có thể ảnh hưởng
    const entries = performance.getEntriesByType("resource");
    let suspiciousRequests = 0;

    entries.forEach((entry) => {
      // Kiểm tra request có thời gian phản hồi bất thường
      if (entry.responseEnd - entry.requestStart > 5000) {
        suspiciousRequests++;
      }
    });

    if (suspiciousRequests > 5) {
      return true;
    }

    return false;
  }

  disableConsole() {
    const noop = () => {};
    const methods = [
      "log",
      "debug",
      "info",
      "warn",
      "error",
      "assert",
      "dir",
      "dirxml",
      "group",
      "groupEnd",
      "time",
      "timeEnd",
      "count",
      "trace",
      "profile",
      "profileEnd",
    ];

    methods.forEach((method) => {
      if (console[method]) {
        console[method] = noop;
      }
    });
  }

  setupDOMMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Kiểm tra các node mới được thêm
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;

            // Kiểm tra các element nghi ngờ
            if (this.isSuspiciousElement(element)) {
              this.reportViolation("Suspicious element detected");
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    this.observers.push(observer);
  }

  preventKeyboardShortcuts = (e) => {
    const forbiddenKeys = [
      { key: "F12" },
      { key: "u", ctrl: true },
      { key: "U", ctrl: true },
      { key: "i", ctrl: true },
      { key: "I", ctrl: true },
      { key: "s", ctrl: true },
      { key: "S", ctrl: true },
      { key: "p", ctrl: true },
      { key: "P", ctrl: true },
      { key: "j", ctrl: true, shift: true },
      { key: "J", ctrl: true, shift: true },
      { key: "c", ctrl: true, shift: true },
      { key: "C", ctrl: true, shift: true },
      { key: "i", ctrl: true, shift: true },
      { key: "I", ctrl: true, shift: true },
      // Windows Game Bar
      { key: "g", meta: true },
      { key: "G", meta: true },
      // Screenshot shortcuts
      { key: "PrintScreen" },
      { code: "PrintScreen" },
      { keyCode: 44 },
      { key: "s", meta: true, shift: true }, // Win + Shift + S
      { key: "S", meta: true, shift: true },
      // Context menu
      { key: "ContextMenu" },
      { key: "Meta", metaKey: true },
      { keyCode: 93 },
      // Right click simulation
      { key: "F10", shift: true },
    ];

    const current = {
      key: e.key,
      ctrl: e.ctrlKey,
      shift: e.shiftKey,
      alt: e.altKey,
      metaKey: e.metaKey, // Windows key hoặc Cmd key trên Mac
      meta: e.meta,
      code: e.code,
      keyCode: e.keyCode,
      which: e.which,
    };

    const isForbidden = forbiddenKeys.some((forbidden) => {
      // Check key match
      const keyMatch =
        forbidden.key === current.key ||
        forbidden.code === current.code ||
        forbidden.keyCode === current.keyCode ||
        forbidden.which === current.which;
      forbidden.metaKey === current.metaKey;

      if (!keyMatch) return false;

      // Check modifiers - tất cả modifier trong forbidden phải match
      const ctrlMatch =
        forbidden.ctrl === undefined || forbidden.ctrl === current.ctrl;
      const shiftMatch =
        forbidden.shift === undefined || forbidden.shift === current.shift;
      const altMatch =
        forbidden.alt === undefined || forbidden.alt === current.alt;
      const metaMatch =
        forbidden.meta === undefined || forbidden.meta === current.meta;

      return ctrlMatch && shiftMatch && altMatch && metaMatch;
    });

    if (isForbidden) {
      e.preventDefault();
      e.stopPropagation();
      this.reportViolation(`Forbidden key combination: ${e.key}`, 3);
      return false;
    }
  };

  handlePrintAttempt = (e) => {
    e.preventDefault();
    this.reportViolation("Print attempt");
    return false;
  };

  reportViolation(reason, count = 1) {
    this.violationCount += count;
    console.warn(`Security violation #${this.violationCount}: ${reason}`);

    if (this.violationCount >= SECURITY_CONFIG.VIOLATION_THRESHOLD) {
      this.blockContent();
    }
  }

  blockContent() {
    if (this.isBlocked) return;

    this.isBlocked = true;
    this.onViolation();
  }

  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Cleanup event listeners
    document.removeEventListener("keypress", this.preventKeyboardShortcuts);
    document.removeEventListener("keydown", this.preventKeyboardShortcuts);
    document.removeEventListener("keyup", this.preventKeyboardShortcuts);
    window.removeEventListener("beforeprint", this.handlePrintAttempt);
    window.removeEventListener("afterprint", this.handlePrintAttempt);

    // Cleanup observers
    this.observers.forEach((observer) => observer.disconnect());

    // Restore console
    Object.assign(console, this.originalConsole);
  }
}

// Cải thiện detection microphone cho Snipping Tool
export class ImprovedMicrophoneDetector {
  constructor(onViolation) {
    this.onViolation = onViolation;
    this.microphoneIndicatorCheck = null;
    this.systemAudioCheck = null;
    this.audioDeviceMonitor = null;
    this.permissionStates = new Map();
    this.deviceChangeCount = 0;
    this.audioContexts = new Set();

    this.initMicrophoneDetection();
  }

  initMicrophoneDetection() {
    // 1. Monitor system microphone indicator
    this.monitorSystemMicrophoneIndicator();

    // 2. Detect audio device enumeration changes
    this.monitorAudioDeviceChanges();

    // 3. Monitor permission state changes
    this.monitorPermissionChanges();

    // 4. Check for system audio routing
    this.detectSystemAudioRouting();

    // 5. Monitor audio context creation patterns
    this.monitorAudioContextPatterns();

    // 6. Check Windows audio session changes
    this.monitorWindowsAudioSessions();
  }

  // CÁCH 1: Monitor system microphone indicator thông qua DOM changes
  monitorSystemMicrophoneIndicator() {
    // Snipping Tool có thể trigger DOM events khi access microphone
    let lastActiveElement = document.activeElement;

    const checkInterval = setInterval(() => {
      // Check nếu có audio elements được tạo ra
      const audioElements = document.querySelectorAll("audio, video");
      const newAudioElements = Array.from(audioElements).filter((el) => {
        return !el.hasAttribute("data-checked");
      });

      newAudioElements.forEach((el) => {
        el.setAttribute("data-checked", "true");

        // Check nếu element có microphone access
        if (el.srcObject || el.captureStream) {
          this.reportMicrophoneViolation(
            "Hidden audio element with microphone access"
          );
        }
      });

      // Check focus changes (Snipping Tool có thể steal focus)
      if (document.activeElement !== lastActiveElement) {
        const currentElement = document.activeElement;

        // Check nếu focus vào element liên quan đến audio
        if (
          currentElement &&
          (currentElement.tagName === "AUDIO" ||
            currentElement.tagName === "VIDEO" ||
            currentElement.type === "audio" ||
            currentElement.className.includes("audio") ||
            currentElement.id.includes("audio"))
        ) {
          this.reportMicrophoneViolation("Suspicious audio element focus");
        }

        lastActiveElement = currentElement;
      }
    }, 500);

    this.microphoneIndicatorCheck = checkInterval;
  }

  // CÁCH 2: Detect audio device enumeration changes (Snipping Tool có thể enumerate devices)
  monitorAudioDeviceChanges() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return;
    }

    let lastDeviceCount = 0;
    let lastDeviceList = [];

    const checkDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter((d) => d.kind === "audioinput");

        // Check nếu số lượng device thay đổi bất thường
        if (lastDeviceCount > 0 && audioInputs.length !== lastDeviceCount) {
          this.deviceChangeCount++;

          if (this.deviceChangeCount > 3) {
            this.reportMicrophoneViolation(
              "Excessive audio device enumeration"
            );
          }
        }

        // Check device labels cho virtual audio devices
        audioInputs.forEach((device) => {
          if (device.label) {
            const suspiciousLabels = [
              "virtual",
              "loopback",
              "cable",
              "obs",
              "streamlabs",
              "voicemeeter",
              "vac",
              "vb-audio",
              "soundflower",
              "audio repeater",
              "stereo mix",
              "wave",
              "blackhole",
            ];

            const label = device.label.toLowerCase();
            if (suspiciousLabels.some((sus) => label.includes(sus))) {
              this.reportMicrophoneViolation(
                `Virtual audio device: ${device.label}`
              );
            }
          }
        });

        // Check nếu có device mới xuất hiện đột ngột
        const newDevices = audioInputs.filter(
          (device) =>
            !lastDeviceList.some((old) => old.deviceId === device.deviceId)
        );

        if (newDevices.length > 0 && lastDeviceList.length > 0) {
          this.reportMicrophoneViolation("New audio device appeared suddenly");
        }

        lastDeviceCount = audioInputs.length;
        lastDeviceList = audioInputs;
      } catch (error) {
        // Nếu không thể enumerate devices, có thể bị block
        this.reportMicrophoneViolation(
          "Cannot enumerate audio devices - possible interference"
        );
      }
    };

    // Check ngay lập tức và sau đó mỗi 2 giây
    checkDevices();
    this.audioDeviceMonitor = setInterval(checkDevices, 2000);

    // Listen for devicechange events
    if (navigator.mediaDevices.addEventListener) {
      navigator.mediaDevices.addEventListener("devicechange", () => {
        this.deviceChangeCount++;
        checkDevices();
      });
    }
  }

  // CÁCH 3: Monitor permission changes chi tiết hơn
  async monitorPermissionChanges() {
    if (!navigator.permissions) return;

    try {
      // Check microphone permission
      const micPermission = await navigator.permissions.query({
        name: "microphone",
      });
      this.permissionStates.set("microphone", micPermission.state);

      micPermission.addEventListener("change", () => {
        const oldState = this.permissionStates.get("microphone");
        const newState = micPermission.state;

        // Nếu permission thay đổi từ prompt/denied sang granted
        if (oldState !== "granted" && newState === "granted") {
          this.reportMicrophoneViolation(
            "Microphone permission granted without user interaction"
          );
        }

        this.permissionStates.set("microphone", newState);
      });

      // Check camera permission (thường đi kèm với screen recording)
      try {
        const cameraPermission = await navigator.permissions.query({
          name: "camera",
        });
        this.permissionStates.set("camera", cameraPermission.state);

        cameraPermission.addEventListener("change", () => {
          const micState = this.permissionStates.get("microphone");
          const camState = cameraPermission.state;

          // Nếu cả mic và camera đều granted = screen recording with audio
          if (micState === "granted" && camState === "granted") {
            this.reportMicrophoneViolation(
              "Both microphone and camera permissions granted",
              2
            );
          }
        });
      } catch (e) {
        // Camera permission check failed
      }
    } catch (error) {
      this.reportMicrophoneViolation(
        "Cannot check permissions - system interference"
      );
    }
  }

  // CÁCH 4: Detect system audio routing (Windows specific)
  detectSystemAudioRouting() {
    // Check Web Audio API usage patterns
    const OriginalAudioContext =
      window.AudioContext || window.webkitAudioContext;

    if (OriginalAudioContext) {
      const self = this;

      // Override AudioContext constructor
      function WrappedAudioContext(...args) {
        const ctx = new OriginalAudioContext(...args);
        self.audioContexts.add(ctx);

        // Monitor audio context state
        const originalResume = ctx.resume;
        ctx.resume = function () {
          self.reportMicrophoneViolation(
            "AudioContext resumed - possible audio capture"
          );
          return originalResume.apply(this, arguments);
        };

        // Monitor createMediaStreamSource
        const originalCreateMediaStreamSource = ctx.createMediaStreamSource;
        ctx.createMediaStreamSource = function (stream) {
          if (stream && stream.getAudioTracks().length > 0) {
            self.reportMicrophoneViolation(
              "MediaStreamSource created with audio tracks"
            );
          }
          return originalCreateMediaStreamSource.apply(this, arguments);
        };

        // Monitor destination connections
        const originalDestination = ctx.destination;
        Object.defineProperty(ctx, "destination", {
          get: function () {
            self.reportMicrophoneViolation("Audio destination accessed");
            return originalDestination;
          },
        });

        return ctx;
      }

      // Replace constructors
      window.AudioContext = WrappedAudioContext;
      if (window.webkitAudioContext) {
        window.webkitAudioContext = WrappedAudioContext;
      }
    }
  }

  // CÁCH 5: Monitor audio context creation patterns
  monitorAudioContextPatterns() {
    // Check số lượng AudioContext được tạo
    setInterval(() => {
      if (this.audioContexts.size > 2) {
        this.reportMicrophoneViolation(
          `Multiple AudioContext instances: ${this.audioContexts.size}`
        );
      }

      // Check state của các AudioContext
      this.audioContexts.forEach((ctx) => {
        if (ctx.state === "running" && ctx.currentTime > 0) {
          // AudioContext đang chạy và có audio data
          this.reportMicrophoneViolation(
            "Active AudioContext with audio processing"
          );
        }
      });
    }, 3000);
  }

  // CÁCH 6: Monitor Windows audio sessions (thông qua performance metrics)
  monitorWindowsAudioSessions() {
    // Check performance degradation có thể do audio recording
    let baselinePerformance = null;

    const checkPerformance = () => {
      const currentPerf = {
        memory: performance.memory ? performance.memory.usedJSHeapSize : 0,
        timing: performance.now(),
        entries: performance.getEntriesByType("resource").length,
      };

      if (!baselinePerformance) {
        baselinePerformance = currentPerf;
        return;
      }

      // Check memory usage spike (audio recording tốn memory)
      const memoryGrowth = currentPerf.memory - baselinePerformance.memory;
      if (memoryGrowth > 50 * 1024 * 1024) {
        // 50MB
        this.reportMicrophoneViolation(
          "Suspicious memory usage - possible audio recording"
        );
      }

      // Check performance entries growth
      const entriesGrowth = currentPerf.entries - baselinePerformance.entries;
      if (entriesGrowth > 100) {
        this.reportMicrophoneViolation(
          "Excessive resource loading - possible recording software"
        );
      }
    };

    this.systemAudioCheck = setInterval(checkPerformance, 5000);
  }

  // Enhanced getUserMedia monitoring
  monitorGetUserMediaEnhanced() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return;
    }

    const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
    const self = this;

    navigator.mediaDevices.getUserMedia = function (constraints) {
      // Log tất cả các request
      console.log("getUserMedia called with:", constraints);

      if (constraints && constraints.audio) {
        // Check detailed audio constraints
        if (typeof constraints.audio === "object") {
          const audioConstraints = constraints.audio;

          // Check echo cancellation settings
          if (audioConstraints.echoCancellation === false) {
            self.reportMicrophoneViolation(
              "Audio recording without echo cancellation"
            );
          }

          // Check noise suppression settings
          if (audioConstraints.noiseSuppression === false) {
            self.reportMicrophoneViolation(
              "Audio recording without noise suppression"
            );
          }

          // Check sample rate
          if (
            audioConstraints.sampleRate &&
            audioConstraints.sampleRate > 44100
          ) {
            self.reportMicrophoneViolation("High sample rate audio recording");
          }
        }

        self.reportMicrophoneViolation("Microphone access requested", 1);
      }

      return originalGetUserMedia
        .apply(this, arguments)
        .then((stream) => {
          if (stream) {
            self.monitorStreamDetailed(stream);
          }
          return stream;
        })
        .catch((error) => {
          // Nếu bị deny nhưng vẫn có audio activity sau đó = bypass
          setTimeout(() => {
            self.checkForBypassedAudioAccess();
          }, 1000);
          throw error;
        });
    };
  }

  // Monitor stream chi tiết hơn
  monitorStreamDetailed(stream) {
    const audioTracks = stream.getAudioTracks();

    audioTracks.forEach((track) => {
      // Check track settings
      const settings = track.getSettings();

      if (settings.sampleRate && settings.sampleRate > 44100) {
        this.reportMicrophoneViolation(
          `High quality audio recording: ${settings.sampleRate}Hz`
        );
      }

      if (settings.channelCount && settings.channelCount > 2) {
        this.reportMicrophoneViolation(
          `Multi-channel audio recording: ${settings.channelCount} channels`
        );
      }

      // Monitor track state changes
      track.addEventListener("ended", () => {
        this.reportMicrophoneViolation(
          "Audio track ended - possible recording stopped"
        );
      });

      track.addEventListener("mute", () => {
        this.reportMicrophoneViolation("Audio track muted");
      });

      track.addEventListener("unmute", () => {
        this.reportMicrophoneViolation("Audio track unmuted");
      });
    });
  }

  // Check for bypassed audio access
  checkForBypassedAudioAccess() {
    // Nếu getUserMedia bị reject nhưng vẫn có AudioContext hoạt động
    if (this.audioContexts.size > 0) {
      this.audioContexts.forEach((ctx) => {
        if (ctx.state === "running") {
          this.reportMicrophoneViolation(
            "AudioContext running despite getUserMedia rejection"
          );
        }
      });
    }

    // Check nếu có audio elements với srcObject
    const mediaElements = document.querySelectorAll("audio, video");
    mediaElements.forEach((el) => {
      if (el.srcObject && el.srcObject.getAudioTracks().length > 0) {
        this.reportMicrophoneViolation(
          "Media element with audio stream despite getUserMedia rejection"
        );
      }
    });
  }

  reportMicrophoneViolation(reason, severity = 1) {
    const timestamp = new Date().toISOString();
    console.warn(
      `🎤 MICROPHONE VIOLATION [${timestamp}]: ${reason} (Severity: ${severity})`
    );

    // Call parent violation handler
    if (this.onViolation) {
      this.onViolation(`Microphone: ${reason}`, severity);
    }
  }

  destroy() {
    if (this.microphoneIndicatorCheck) {
      clearInterval(this.microphoneIndicatorCheck);
    }

    if (this.systemAudioCheck) {
      clearInterval(this.systemAudioCheck);
    }

    if (this.audioDeviceMonitor) {
      clearInterval(this.audioDeviceMonitor);
    }

    this.audioContexts.clear();
  }
}

// Integrate vào SecurityDetector
export function enhanceSecurityDetectorWithMicrophone(SecurityDetector) {
  // Add to SecurityDetector's initializeProtections method
  const originalInitializeProtections =
    SecurityDetector.prototype.initializeProtections;

  SecurityDetector.prototype.initializeProtections = function () {
    // Call original method
    originalInitializeProtections.call(this);

    // Add improved microphone detection
    this.microphoneDetector = new ImprovedMicrophoneDetector(
      (reason, severity) => this.reportViolation(reason, severity)
    );

    // Enhanced getUserMedia monitoring
    this.microphoneDetector.monitorGetUserMediaEnhanced();
  };

  // Add to destroy method
  const originalDestroy = SecurityDetector.prototype.destroy;

  SecurityDetector.prototype.destroy = function () {
    if (this.microphoneDetector) {
      this.microphoneDetector.destroy();
    }

    originalDestroy.call(this);
  };
}

export const BlockedComponent = () => (
  <div className="video-player-container">
    <div className="video-wrapper">
      <div className="video-blocked">
        <div className="blocked-icon">🚫</div>
        <h2>{SECURITY_CONFIG.BLOCKED_MESSAGE}</h2>
        <p>Phát hiện hành vi vi phạm bảo mật. Vui lòng tải lại trang.</p>
      </div>
    </div>
  </div>
);
