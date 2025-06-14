// utils/console-override.js
class EnhancedConsole {
  constructor() {
    // Backup original console
    this.originalConsole = { ...console };
    this.showDebugInfo = true;
    this.isClient = typeof window !== "undefined";
    this.ignoreNodeModules = true;
    
    // Cache để tránh tạo regex nhiều lần
    this.nodeModulesRegex = /[\/\\]node_modules[\/\\]/;
    this.stackLineRegex = /at\s+(.+?)\s+\((.+):(\d+):(\d+)\)|at\s+(.+):(\d+):(\d+)/;
  }

  getDebugInfo() {
    // Sử dụng cách đơn giản hơn để lấy stack trace
    const err = new Error();
    const timestamp = new Date().toLocaleTimeString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    if (!err.stack) {
      return {
        file: "unknown",
        line: 0,
        function: "unknown",
        timestamp,
        environment: this.isClient ? "client" : "server",
        shouldIgnore: false,
      };
    }

    // Chỉ split và xử lý một phần stack cần thiết
    const stackLines = err.stack.split("\n").slice(4, 8); // Chỉ lấy 4 dòng đầu tiên
    let callerLine = "";
    let shouldIgnore = false;

    for (const line of stackLines) {
      // Bỏ qua internal methods
      if (line.includes("EnhancedConsole") || 
          line.includes("enhancedLog") || 
          line.includes("console-override")) {
        continue;
      }

      // Kiểm tra node_modules với regex đã cache
      if (this.ignoreNodeModules && this.nodeModulesRegex.test(line)) {
        shouldIgnore = true;
        continue;
      }

      callerLine = line;
      break;
    }

    if (shouldIgnore && !callerLine) {
      return {
        file: "node_modules",
        line: 0,
        function: "node_modules",
        timestamp,
        environment: this.isClient ? "client" : "server",
        shouldIgnore: true,
      };
    }

    // Parse caller line với regex đã cache
    const match = callerLine.match(this.stackLineRegex);

    if (match) {
      const functionName = match[1] || "anonymous";
      const filePath = match[2] || match[5] || "unknown";
      const lineNumber = parseInt(match[3] || match[6] || "0", 10);

      // Rút gọn path một cách hiệu quả hơn
      const fileName = this.getShortFileName(filePath);

      return {
        file: fileName,
        line: lineNumber,
        function: functionName.includes(".") 
          ? functionName.split(".").pop() || functionName 
          : functionName,
        timestamp,
        environment: this.isClient ? "client" : "server",
        shouldIgnore: false,
      };
    }

    return {
      file: "unknown",
      line: 0,
      function: "unknown",
      timestamp,
      environment: this.isClient ? "client" : "server",
      shouldIgnore: false,
    };
  }

  // Helper method tối ưu để rút gọn filename
  getShortFileName(filePath) {
    const lastSlash = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
    if (lastSlash === -1) return filePath;
    
    const secondLastSlash = Math.max(
      filePath.lastIndexOf('/', lastSlash - 1),
      filePath.lastIndexOf('\\', lastSlash - 1)
    );
    
    return secondLastSlash === -1 
      ? filePath.substring(lastSlash + 1)
      : filePath.substring(secondLastSlash + 1);
  }

  // Tối ưu formatData để tránh JSON.stringify không cần thiết
  formatData(data) {
    if (data === null || data === undefined) {
      return String(data);
    }

    if (typeof data !== "object") {
      return String(data);
    }

    // Kiểm tra DOM elements trước
    if (data.nodeType || data.constructor?.name === "HTMLElement") {
      return `[${data.constructor?.name || "HTMLElement"}]`;
    }

    // Chỉ stringify object phức tạp
    try {
      // Giới hạn độ sâu để tránh circular reference và tiết kiệm memory
      return JSON.stringify(data, this.getCircularReplacer(), 2);
    } catch {
      return String(data);
    }
  }

  // Cache circular replacer để tránh tạo mới mỗi lần
  getCircularReplacer() {
    if (!this._circularReplacer) {
      const seen = new WeakSet();
      this._circularReplacer = (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return "[Circular]";
          }
          seen.add(value);
          
          // Handle DOM elements
          if (value.nodeType || value.constructor?.name === "HTMLElement") {
            return `[${value.constructor?.name || "HTMLElement"}]`;
          }
        }
        return value;
      };
    }
    return this._circularReplacer;
  }

  shouldShowDebug() {
    // Cache environment check
    if (this._shouldShowCache === undefined) {
      this._shouldShowCache = (
        this.showDebugInfo &&
        (process.env.NODE_ENV === "development" ||
          (this.isClient && localStorage?.getItem("debug-console") === "true"))
      );
    }
    return this._shouldShowCache;
  }

  enhancedLog(level, args) {
    // Kiểm tra args sớm để tránh xử lý không cần thiết
    if (!args.length) {
      return this.originalConsole[level]();
    }

    const debugInfo = this.shouldShowDebug() ? this.getDebugInfo() : null;

    // Nếu shouldIgnore = true, chỉ log đơn giản
    if (debugInfo?.shouldIgnore) {
      return this.originalConsole[level](...args);
    }

    if (this.isClient) {
      this.handleClientLog(level, args, debugInfo);
    } else {
      this.handleServerLog(level, args, debugInfo);
    }
  }

  // Tách riêng client logging để code dễ đọc hơn
  handleClientLog(level, args, debugInfo) {
    if (debugInfo && !debugInfo.shouldIgnore) {
      const styles = this.getClientStyles();
      const envIcon = "🌐";

      this.originalConsole.groupCollapsed(
        `%c${envIcon} ${debugInfo.file}:${debugInfo.line} ${debugInfo.function}() ${debugInfo.timestamp}`,
        styles[level]
      );

      // Tối ưu việc log arguments
      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (typeof arg === "object" && arg !== null) {
          this.originalConsole[level](`Arg ${i}:`, arg);
        } else {
          this.originalConsole[level](`Arg ${i}: ${arg}`);
        }
      }

      this.originalConsole.groupEnd();
    } else {
      this.originalConsole[level](...args);
    }
  }

  // Cache styles để tránh tạo object mới mỗi lần
  getClientStyles() {
    if (!this._clientStyles) {
      this._clientStyles = {
        log: "color: #4A90E2; font-weight: 500; background: #f8fafc; padding: 2px 6px; border-radius: 3px",
        error: "color: #E53E3E; font-weight: 600; background: #fed7d7; padding: 2px 6px; border-radius: 3px",
        warn: "color: #D69E2E; font-weight: 500; background: #fefcbf; padding: 2px 6px; border-radius: 3px",
        info: "color: #38A169; font-weight: 500; background: #c6f6d5; padding: 2px 6px; border-radius: 3px",
        debug: "color: #805AD5; font-weight: 500; background: #e9d8fd; padding: 2px 6px; border-radius: 3px",
      };
    }
    return this._clientStyles;
  }

  // Tách riêng server logging
  handleServerLog(level, args, debugInfo) {
    const colors = this.getServerColors();

    if (debugInfo && !debugInfo.shouldIgnore) {
      const envIcon = "⚙️";
      
      // Tối ưu string concatenation
      const header = `${colors.bold}${colors[level]}┌─ ${envIcon}  ${debugInfo.file}:${debugInfo.line} ${debugInfo.function}() ${colors.dim}${debugInfo.timestamp}${colors.reset}`;
      
      this.originalConsole[level](header);

      // Tối ưu việc format args
      const formattedArgs = args.map(arg => 
        typeof arg === "string" ? arg : this.formatData(arg)
      ).join(" ");
      
      this.originalConsole[level](`${colors[level]}├─ ${colors.reset}${formattedArgs}`);
      this.originalConsole[level](`${colors[level]}└────────────────────${colors.reset}`);
      this.originalConsole[level](""); // Empty line
    } else {
      // Simple log
      this.originalConsole[level](...args);
    }
  }

  // Cache server colors
  getServerColors() {
    if (!this._serverColors) {
      this._serverColors = {
        log: "\x1b[96m",    // Bright Cyan
        error: "\x1b[91m",  // Bright Red
        warn: "\x1b[93m",   // Bright Yellow
        info: "\x1b[92m",   // Bright Green
        debug: "\x1b[95m",  // Bright Magenta
        reset: "\x1b[0m",
        dim: "\x1b[2m",
        bold: "\x1b[1m",
      };
    }
    return this._serverColors;
  }

  // Console method overrides - giữ nguyên logic nhưng gọi enhancedLog
  log(...args) { this.enhancedLog("log", args); }
  error(...args) { this.enhancedLog("error", args); }
  warn(...args) { this.enhancedLog("warn", args); }
  info(...args) { this.enhancedLog("info", args); }
  debug(...args) { this.enhancedLog("debug", args); }

  // Preserve other console methods - giữ nguyên
  table(...args) {
    if (this.shouldShowDebug()) {
      const debugInfo = this.getDebugInfo();
      if (debugInfo && !debugInfo.shouldIgnore) {
        const prefix = this.isClient
          ? `🌐  ${debugInfo.file}:${debugInfo.line} ${debugInfo.timestamp}`
          : `⚙️  ${debugInfo.file}:${debugInfo.line} ${debugInfo.timestamp}`;
        this.originalConsole.log(prefix);
      }
    }
    this.originalConsole.table(...args);
  }

  // Các method khác giữ nguyên
  group(...args) { return this.originalConsole.group(...args); }
  groupCollapsed(...args) { return this.originalConsole.groupCollapsed(...args); }
  groupEnd() { return this.originalConsole.groupEnd(); }
  clear() { return this.originalConsole.clear(); }
  count(label) { return this.originalConsole.count(label); }
  countReset(label) { return this.originalConsole.countReset(label); }
  time(label) { return this.originalConsole.time(label); }
  timeEnd(label) { return this.originalConsole.timeEnd(label); }
  timeLog(label, ...args) { return this.originalConsole.timeLog(label, ...args); }
  trace(...args) { return this.originalConsole.trace(...args); }
  dir(obj, options) { return this.originalConsole.dir(obj, options); }
  dirxml(...args) { return this.originalConsole.dirxml(...args); }
  assert(condition, ...args) { return this.originalConsole.assert(condition, ...args); }

  // Utility methods
  toggleDebug(show) {
    this.showDebugInfo = show !== undefined ? show : !this.showDebugInfo;
    // Clear cache khi toggle
    this._shouldShowCache = undefined;

    if (this.isClient && typeof localStorage !== "undefined") {
      localStorage.setItem("debug-console", this.showDebugInfo.toString());
    }

    const status = this.showDebugInfo ? "ON" : "OFF";
    this.originalConsole.info(`🔧 Enhanced console debug: ${status}`);
  }

  toggleNodeModules(ignore) {
    this.ignoreNodeModules = ignore !== undefined ? ignore : !this.ignoreNodeModules;
    const status = this.ignoreNodeModules ? "IGNORED" : "SHOWN";
    this.originalConsole.info(`📦 Node modules logs: ${status}`);
  }

  restore() {
    Object.keys(this.originalConsole).forEach((key) => {
      console[key] = this.originalConsole[key];
    });
    this.originalConsole.info("🔄 Console restored to original");
  }

  // Special methods - tối ưu
  api(req, res, data) {
    if (this.isClient) return;

    const method = req.method || "UNKNOWN";
    const url = req.url || "unknown";

    this.originalConsole.log(`\x1b[35m╭─── 🚀 API REQUEST ───╮\x1b[0m`);
    this.originalConsole.log(`\x1b[35m│ ${method} ${url}\x1b[0m`);
    
    if (req.query && Object.keys(req.query).length > 0) {
      this.originalConsole.log(`\x1b[35m│ Query:\x1b[0m`, req.query);
    }
    if (req.body && Object.keys(req.body).length > 0) {
      this.originalConsole.log(`\x1b[35m│ Body:\x1b[0m`, req.body);
    }
    if (data) {
      this.originalConsole.log(`\x1b[35m│ Response:\x1b[0m`, data);
    }
    
    this.originalConsole.log(`\x1b[35m╰─────────────────────╯\x1b[0m\n`);
  }

  json(data, label) {
    const prefix = label || "[JSON]";
    if (this.isClient) {
      this.originalConsole.group(`%c${prefix}`, "color: #ff6b9d; font-weight: bold");
      this.originalConsole.log(data);
      this.originalConsole.groupEnd();
    } else {
      this.log(data);
    }
  }
}

// Create enhanced console instance
const enhancedConsole = new EnhancedConsole();

// Function to override global console
function overrideConsole() {
  // Override global console methods
  const methods = ['log', 'error', 'warn', 'info', 'debug', 'table', 'group', 
                   'groupCollapsed', 'groupEnd', 'clear', 'count', 'countReset', 
                   'time', 'timeEnd', 'timeLog', 'trace', 'dir', 'dirxml', 'assert'];
  
  methods.forEach(method => {
    if (typeof enhancedConsole[method] === 'function') {
      console[method] = enhancedConsole[method].bind(enhancedConsole);
    }
  });

  // Add utility methods
  console.toggleDebug = enhancedConsole.toggleDebug.bind(enhancedConsole);
  console.toggleNodeModules = enhancedConsole.toggleNodeModules.bind(enhancedConsole);
  console.restore = enhancedConsole.restore.bind(enhancedConsole);
  console.api = enhancedConsole.api.bind(enhancedConsole);
  console.json = enhancedConsole.json.bind(enhancedConsole);

  console.info("🚀 Enhanced console activated!");
}

// Auto-override in development
if (process.env.NODE_ENV === "development") {
  overrideConsole();
}

module.exports = {
  EnhancedConsole,
  overrideConsole,
  enhancedConsole,
};