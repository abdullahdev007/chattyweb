import { spawn, execSync } from "child_process";

console.log("🚀 Starting development server...");

// Function to kill port 5000 using netstat
function killPort5000() {
  try {
    console.log("🔄 Killing processes on port 5000...");

    const netstatOutput = execSync("netstat -ano | findstr :5000", {
      encoding: "utf8",
    });

    if (netstatOutput.trim()) {
      const lines = netstatOutput.split("\n").filter((line) => line.trim());

      lines.forEach((line) => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
          const pid = parts[4];
          if (pid && !isNaN(pid)) {
            try {
              execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
            } catch (killError) {
              // Ignore errors, continue with next process
            }
          }
        }
      });
    }

    console.log("✅ Port 5000 cleared");
  } catch (error) {
    // Port is already free or no processes found
    console.log("✅ Port 5000 is free");
  }
}

// Function to start the server
function startServer() {
  const server = spawn("tsx", ["src/server.ts"], {
    stdio: "inherit",
    shell: true,
  });

  server.on("error", (error) => {
    console.error("❌ Server error:", error);
  });

  server.on("close", (code) => {
    console.log(`📴 Server exited with code ${code}`);
  });

  // Handle shutdown signals
  const shutdown = () => {
    server.kill("SIGTERM");
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

// Main execution
try {
  killPort5000();

  setTimeout(() => {
    startServer();
  }, 2000);
} catch (error) {
  console.error("❌ Error:", error);
  process.exit(1);
}
