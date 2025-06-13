// utils/console-override.js
class EnhancedConsole {
  constructor() {
    // Backup original console
    this.originalConsole = { ...console };
    this.showDebugInfo = true;
    this.isClient = typeof window !== "undefined";
    this.ignoreNodeModules = true;
  }

  getDebugInfo() {
    const stack = new Error().stack;
    const timestamp = new Date().toLocaleTimeString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    if (!stack) {
      return {
        file: "unknown",
        line: 0,
        function: "unknown",
        timestamp,
        environment: this.isClient ? "client" : "server",
        shouldIgnore: false,
      };
    }

    const stackLines = stack.split("\n");

    // Tìm caller line thực sự - bỏ qua:
    // 1. Error constructor
    // 2. getDebugInfo method
    // 3. enhancedLog method
    // 4. console method wrapper (log, error, warn, etc.)
    let callerLine = "";
    let shouldIgnore = false;

    // Bắt đầu từ index 4 để bỏ qua các internal methods
    for (let i = 4; i < stackLines.length; i++) {
      const line = stackLines[i] || "";

      // Bỏ qua nếu line chứa tên class hoặc method của enhanced console
      if (
        line.includes("EnhancedConsole") ||
        line.includes("enhancedLog") ||
        line.includes("console-override")
      ) {
        continue;
      }

      // Kiểm tra xem line có chứa node_modules không
      if (this.ignoreNodeModules && this.isFromNodeModules(line)) {
        shouldIgnore = true;
        continue;
      }

      // Nếu không phải internal methods và không phải node_modules, sử dụng line này
      callerLine = line;
      break;
    }

    // Nếu không tìm thấy caller line phù hợp, thử lấy line đầu tiên không phải internal
    if (!callerLine) {
      for (let i = 4; i < stackLines.length; i++) {
        const line = stackLines[i] || "";
        if (
          !line.includes("EnhancedConsole") &&
          !line.includes("enhancedLog") &&
          !line.includes("console-override")
        ) {
          callerLine = line;
          break;
        }
      }
    }

    // Nếu tất cả các line đều từ node_modules, return để ignore
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

    // Parse caller line để lấy thông tin file, line, function
    const match = callerLine.match(
      /at\s+(.+?)\s+\((.+):(\d+):(\d+)\)|at\s+(.+):(\d+):(\d+)/
    );

    if (match) {
      const functionName = match[1] || "anonymous";
      const filePath = match[2] || match[5] || "unknown";
      const lineNumber = parseInt(match[3] || match[6] || "0");

      // Rút gọn path - chỉ lấy filename và parent folder
      const pathParts = filePath.split(/[\/\\]/); // Support both / and \ for cross-platform
      const fileName =
        pathParts.length > 1
          ? pathParts.slice(-2).join("/")
          : pathParts[pathParts.length - 1];

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

  // Helper method để check xem có phải từ node_modules không
  isFromNodeModules(stackLine) {
    return (
      stackLine.includes("node_modules") ||
      stackLine.includes("\\node_modules\\") ||
      stackLine.includes("/node_modules/")
    );
  }

  formatData(data) {
    if (typeof data === "object" && data !== null) {
      try {
        return JSON.stringify(
          data,
          (key, value) => {
            // Handle circular references
            if (typeof value === "object" && value !== null) {
              if (value.constructor?.name === "HTMLElement" || value.nodeType) {
                return `[${value.constructor?.name || "HTMLElement"}]`;
              }
            }
            return value;
          },
          2
        );
      } catch {
        return String(data);
      }
    }
    return String(data);
  }

  shouldShowDebug() {
    // Chỉ show debug info khi development hoặc khi explicitly enabled
    return (
      this.showDebugInfo &&
      (process.env.NODE_ENV === "development" ||
        (this.isClient && localStorage.getItem("debug-console") === "true"))
    );
  }

  enhancedLog(level, args) {
    const debugInfo = this.shouldShowDebug() ? this.getDebugInfo() : null;

    // Nếu shouldIgnore = true, chỉ log đơn giản không có debug info
    if (debugInfo && debugInfo.shouldIgnore) {
      return this.originalConsole[level](...args);
    }

    if (!args.length) {
      return this.originalConsole[level]();
    }

    if (this.isClient) {
      // Client-side enhancement
      if (debugInfo && !debugInfo.shouldIgnore) {
        const styles = {
          log: "color: #4A90E2; font-weight: 500; background: #f8fafc; padding: 2px 6px; border-radius: 3px",
          error:
            "color: #E53E3E; font-weight: 600; background: #fed7d7; padding: 2px 6px; border-radius: 3px",
          warn: "color: #D69E2E; font-weight: 500; background: #fefcbf; padding: 2px 6px; border-radius: 3px",
          info: "color: #38A169; font-weight: 500; background: #c6f6d5; padding: 2px 6px; border-radius: 3px",
          debug:
            "color: #805AD5; font-weight: 500; background: #e9d8fd; padding: 2px 6px; border-radius: 3px",
        };

        const envIcon = "🌐";
        const time = debugInfo.timestamp;

        this.originalConsole.groupCollapsed(
          `%c${envIcon} ${debugInfo.file}:${debugInfo.line} ${debugInfo.function}() ${time}`,
          styles[level]
        );

        // Log original arguments
        args.forEach((arg, index) => {
          if (typeof arg === "object" && arg !== null) {
            this.originalConsole[level](`Arg ${index}:`, arg);
          } else {
            this.originalConsole[level](`Arg ${index}:`, this.formatData(arg));
          }
        });

        this.originalConsole.groupEnd();
      } else {
        // Simple log without debug info
        this.originalConsole[level](...args);
      }
    } else {
      // Server-side enhancement - màu sáng hơn và dễ đọc hơn
      const colors = {
        log: "\x1b[96m", // Bright Cyan
        error: "\x1b[91m", // Bright Red
        warn: "\x1b[93m", // Bright Yellow
        info: "\x1b[92m", // Bright Green
        debug: "\x1b[95m", // Bright Magenta
        reset: "\x1b[0m",
        dim: "\x1b[2m", // Dim text
        bold: "\x1b[1m", // Bold text
      };

      if (debugInfo && !debugInfo.shouldIgnore) {
        const envIcon = "⚙️";
        const time = debugInfo.timestamp;

        // Header với màu sáng và dễ đọc hơn
        const header = `${colors.bold}${colors[level]}┌─ ${envIcon}  ${debugInfo.file}:${debugInfo.line} ${debugInfo.function}() ${colors.dim}${time}${colors.reset}`;

        this.originalConsole[level](header);

        const formattedArgs = args.map((arg) => this.formatData(arg)).join(" ");
        this.originalConsole[level](
          `${colors[level]}├─ ${colors.reset}${formattedArgs}`
        );

        this.originalConsole[level](
          `${colors[level]}└${"─".repeat(20)}${colors.reset}`
        );
        this.originalConsole[level](""); // Thêm dòng trống để dễ đọc
      } else {
        // Simple log với màu nhẹ hơn
        const formattedArgs = args.map((arg) => this.formatData(arg));
        this.originalConsole[level](
          `${colors[level]}${formattedArgs.join(" ")}${colors.reset}`
        );
      }
    }
  }

  // Override console methods
  log(...args) {
    this.enhancedLog("log", args);
  }

  error(...args) {
    this.enhancedLog("error", args);
  }

  warn(...args) {
    this.enhancedLog("warn", args);
  }

  info(...args) {
    this.enhancedLog("info", args);
  }

  debug(...args) {
    this.enhancedLog("debug", args);
  }

  // Preserve other console methods
  table(...args) {
    if (this.shouldShowDebug()) {
      const debugInfo = this.getDebugInfo();
      if (debugInfo && !debugInfo.shouldIgnore) {
        const time = debugInfo.timestamp;
        const prefix = this.isClient
          ? `🌐  ${debugInfo.file}:${debugInfo.line} ${time}`
          : `⚙️  ${debugInfo.file}:${debugInfo.line} ${time}`;

        this.originalConsole.log(prefix);
      }
    }
    this.originalConsole.table(...args);
  }

  group(...args) {
    return this.originalConsole.group(...args);
  }

  groupCollapsed(...args) {
    return this.originalConsole.groupCollapsed(...args);
  }

  groupEnd() {
    return this.originalConsole.groupEnd();
  }

  clear() {
    return this.originalConsole.clear();
  }

  count(label) {
    return this.originalConsole.count(label);
  }

  countReset(label) {
    return this.originalConsole.countReset(label);
  }

  time(label) {
    return this.originalConsole.time(label);
  }

  timeEnd(label) {
    return this.originalConsole.timeEnd(label);
  }

  timeLog(label, ...args) {
    return this.originalConsole.timeLog(label, ...args);
  }

  trace(...args) {
    return this.originalConsole.trace(...args);
  }

  dir(obj, options) {
    return this.originalConsole.dir(obj, options);
  }

  dirxml(...args) {
    return this.originalConsole.dirxml(...args);
  }

  assert(condition, ...args) {
    return this.originalConsole.assert(condition, ...args);
  }

  // Utility methods
  toggleDebug(show) {
    this.showDebugInfo = show !== undefined ? show : !this.showDebugInfo;

    if (this.isClient) {
      localStorage.setItem("debug-console", this.showDebugInfo.toString());
    }

    const status = this.showDebugInfo ? "ON" : "OFF";
    this.originalConsole.info(`🔧 Enhanced console debug: ${status}`);
  }

  // Method để toggle việc ignore node_modules
  toggleNodeModules(ignore) {
    this.ignoreNodeModules =
      ignore !== undefined ? ignore : !this.ignoreNodeModules;
    const status = this.ignoreNodeModules ? "IGNORED" : "SHOWN";
    this.originalConsole.info(`📦 Node modules logs: ${status}`);
  }

  // Method để restore original console
  restore() {
    Object.keys(this.originalConsole).forEach((key) => {
      console[key] = this.originalConsole[key];
    });
    this.originalConsole.info("🔄 Console restored to original");
  }

  // Special methods
  api(req, res, data) {
    if (!this.isClient) {
      const method = req.method || "UNKNOWN";
      const url = req.url || "unknown";

      this.originalConsole.log(`\x1b[35m╭─── 🚀 API REQUEST ───╮\x1b[0m`);
      this.originalConsole.log(`\x1b[35m│ Method: ${method}\x1b[0m`);
      this.originalConsole.log(`\x1b[35m│ URL: ${url}\x1b[0m`);
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
  }

  json(data, label) {
    const prefix = label || "[JSON]";
    if (this.isClient) {
      this.originalConsole.group(
        `%c${prefix}`,
        "color: #ff6b9d; font-weight: bold"
      );
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
  // Override global console
  Object.getOwnPropertyNames(Object.getPrototypeOf(enhancedConsole)).forEach(
    (key) => {
      if (
        typeof enhancedConsole[key] === "function" &&
        key !== "constructor" &&
        key !== "restore"
      ) {
        console[key] = enhancedConsole[key].bind(enhancedConsole);
      }
    }
  );

  // Add special methods to console
  console.toggleDebug = enhancedConsole.toggleDebug.bind(enhancedConsole);
  console.toggleNodeModules =
    enhancedConsole.toggleNodeModules.bind(enhancedConsole);
  console.restore = enhancedConsole.restore.bind(enhancedConsole);
  console.api = enhancedConsole.api.bind(enhancedConsole);
  console.json = enhancedConsole.json.bind(enhancedConsole);

  console.info("🚀 Enhanced console activated!");
  console.info("💡 Use console.toggleDebug() to toggle debug info");
  console.info(
    "📦 Use console.toggleNodeModules() to toggle node_modules filtering"
  );
  console.info("🔄 Use console.restore() to restore original console");
}

// Auto-override in development
if (typeof window !== "undefined") {
  // Client-side auto-override
  if (process.env.NODE_ENV === "development") {
    overrideConsole();
  }
} else {
  // Server-side auto-override
  if (process.env.NODE_ENV === "development") {
    overrideConsole();
  }
}

module.exports = {
  EnhancedConsole,
  overrideConsole,
  enhancedConsole,
};
