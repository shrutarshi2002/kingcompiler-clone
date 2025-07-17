"use client";
import { useEffect, useRef, useState } from "react";

// Monkey SVG with sign board for output
function MonkeyWithSign({ output }) {
  return (
    <div className="relative flex flex-col items-center w-[220px] h-[220px] select-none">
      {/* Monkey image */}
      <img
        src="/monkey.png"
        alt="Monkey"
        className="w-full h-full object-contain"
      />
      {/* Sign board overlay */}
      <div
        className="absolute left-1/2"
        style={{
          top: 170, // move signboard lower for bigger monkey
          transform: "translateX(-50%)",
          width: 200, // set width to 400px
          height: 100, // set height to 400px
          background: "#fffbe7",
          border: "4px solid #a67c52",
          borderRadius: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          boxSizing: "border-box",
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 20, // still big, but allows more text
            color: "#222",
            width: "100%",
            textAlign: "center",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap", // allow multiline
            lineHeight: 1.3,
          }}
        >
          {output || "Output"}
        </span>
      </div>
    </div>
  );
}

// To use Monaco Editor, install with:
// npm install @monaco-editor/react
import MonacoEditor from "@monaco-editor/react";

export default function FunCoding() {
  const [code, setCode] = useState('print("Hello, King!")');
  const [output, setOutput] = useState("");
  const pyodideRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Load Pyodide on mount
  useEffect(() => {
    let ignore = false;
    async function loadPyodideScript() {
      if (window.loadPyodide) {
        const pyodide = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
        });
        if (!ignore) pyodideRef.current = pyodide;
      } else {
        // Dynamically load the script if not present
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
        script.onload = async () => {
          const pyodide = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
          });
          if (!ignore) pyodideRef.current = pyodide;
        };
        document.body.appendChild(script);
      }
    }
    loadPyodideScript();
    return () => {
      ignore = true;
    };
  }, []);

  // Speak output using browser speech synthesis
  function speakOutput(text) {
    if (!window.speechSynthesis) return;
    setIsSpeaking(true);
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.pitch = 2; // Even more childish
    utter.rate = 1.25; // Slightly faster
    // Try to pick a higher-pitched or childlike voice if available
    const voices = window.speechSynthesis.getVoices();
    utter.voice =
      voices.find((v) => /child|kid|boy|girl/i.test(v.name)) ||
      voices.find((v) => v.name.toLowerCase().includes("female")) ||
      voices[0];
    utter.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  }

  async function runCode() {
    setOutput("Running...");
    setIsSpeaking(false);
    if (!pyodideRef.current) {
      setOutput("Pyodide not loaded yet.");
      return;
    }
    try {
      // Redirect sys.stdout to capture print() output
      await pyodideRef.current.runPythonAsync(
        `import sys\nfrom io import StringIO\nsys.stdout = mystdout = StringIO()`
      );
      let result = await pyodideRef.current.runPythonAsync(code);
      const printed = await pyodideRef.current.runPythonAsync(
        "mystdout.getvalue()"
      );
      let finalOutput = printed.trim();
      // If nothing was printed, show the result of the last expression
      if (!finalOutput && result !== undefined) finalOutput = String(result);
      setOutput(finalOutput || "No output.");
      speakOutput(finalOutput || "No output.");
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  }

  // Install Black in Pyodide if not already installed
  async function ensureBlackInstalled() {
    if (!pyodideRef.current) return false;
    if (!pyodideRef.current.isBlackInstalled) {
      try {
        await pyodideRef.current.loadPackage(["micropip"]);
        await pyodideRef.current.runPythonAsync(
          'import micropip\nawait micropip.install("black")'
        );
        pyodideRef.current.isBlackInstalled = true;
      } catch (e) {
        return false;
      }
    }
    return true;
  }

  // Fix code using Black
  async function fixCode() {
    setOutput("");
    if (!pyodideRef.current) {
      setOutput("Pyodide not loaded yet.");
      return;
    }
    setOutput("Fixing code...");
    const ok = await ensureBlackInstalled();
    if (!ok) {
      setOutput("Failed to load Black formatter.");
      return;
    }
    try {
      const formatted = await pyodideRef.current.runPythonAsync(
        `\nimport black\nfrom black import FileMode\ncode = '''${code.replace(
          /'/g,
          "''"
        )}'''\ntry:\n    fixed = black.format_str(code, mode=FileMode())\nexcept Exception as e:\n    fixed = None\nfixed\n`
      );
      if (!formatted) {
        setOutput(
          "❌ Could not fix code: Please check your indentation or syntax."
        );
      } else {
        setCode(formatted);
        setOutput("Code formatted!");
      }
    } catch (err) {
      setOutput("Error formatting code: " + err.message);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left: Python Editor */}
      <div className="w-full md:w-1/2 flex flex-col">
        <h3 className="font-bold mb-2">Write Python Code</h3>
        <div style={{ height: 320 }}>
          <MonacoEditor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 16,
              minimap: { enabled: false },
              wordWrap: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: "on",
              tabSize: 4,
              insertSpaces: true,
              autoIndent: "full",
              formatOnPaste: true,
              formatOnType: true,
              matchBrackets: "always",
            }}
          />
        </div>
        <button
          className="mt-4 px-4 py-2 bg-yellow-400 rounded font-semibold"
          onClick={runCode}
          disabled={isSpeaking}
        >
          Run Code
        </button>
        <button
          className="mt-4 ml-2 px-4 py-2 bg-blue-400 rounded font-semibold text-white"
          onClick={fixCode}
          disabled={isSpeaking}
        >
          Fix Code
        </button>
      </div>
      {/* Right: Output with Monkey */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
        <h3 className="font-bold mb-2">Output</h3>
        <MonkeyWithSign output={output} />
        {isSpeaking && (
          <div className="mt-2 text-yellow-600 font-semibold animate-pulse">
            🐒 Speaking...
          </div>
        )}
      </div>
    </div>
  );
}
