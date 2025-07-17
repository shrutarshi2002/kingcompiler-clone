// filepath: f:\next.js projects\kingcompiler-clone\src\app\learning-games\practice-coding\DragDropGameWithTopics.js
import React, { useState } from "react";

export default function DragDropGameWithTopics() {
  // Topics and their code blocks
  const topics = [
    { key: "about", name: "About Python" },
    { key: "print", name: "Print Statements" },
    { key: "variables", name: "Variables" },
    { key: "datatypes", name: "Data Types" },
    { key: "math", name: "Math & Operators" },
    { key: "ifelse", name: "If…Else Conditions" },
    { key: "loops", name: "Loops" },
    { key: "functions", name: "Functions" },
    { key: "lists", name: "Lists (Arrays)" },
    { key: "strings", name: "String Manipulation" },
    { key: "input", name: "User Input" },
  ];

  // Example blocks for each topic, including topic-specific print blocks
  const blocksByTopic = {
    about: [{ id: 1, text: "# Python is a popular programming language" }],
    print: [
      { id: 2, text: 'print("Hello, World!")', output: "Hello, World!" },
      { id: 3, text: "print(5 + 3)", output: "8" },
    ],
    variables: [
      { id: 4, text: "x = 10" },
      { id: 5, text: 'y = "King"' },
      { id: 6, text: "print(x)", output: "10" },
      { id: 7, text: "print(y)", output: "King" },
    ],
    datatypes: [
      { id: 8, text: "a = 5  # int" },
      { id: 9, text: "b = 3.14  # float" },
      { id: 10, text: "c = 'hello'  # str" },
      { id: 11, text: "print(a)", output: "5" },
      { id: 12, text: "print(b)", output: "3.14" },
      { id: 13, text: "print(c)", output: "hello" },
    ],
    math: [
      { id: 14, text: "result = 2 + 3 * 4" },
      { id: 15, text: "z = 10 / 2" },
      { id: 16, text: "print(result)", output: "14" },
      { id: 17, text: "print(z)", output: "5.0" },
    ],
    ifelse: [
      { id: 18, text: "x = 7" },
      { id: 19, text: "if x > 5:" },
      { id: 20, text: "    print('x is big')", output: "x is big" },
      { id: 21, text: "else:" },
      { id: 22, text: "    print('x is small')", output: "x is small" },
    ],
    loops: [
      { id: 23, text: "for i in range(3):" },
      { id: 24, text: "    print(i)", output: "0\n1\n2" },
    ],
    functions: [
      { id: 25, text: "def greet(name):" },
      { id: 26, text: "    print('Hello', name)", output: "Hello King" },
      { id: 27, text: "greet('King')", output: "Hello King" },
    ],
    lists: [
      { id: 28, text: "my_list = [1, 2, 3]" },
      { id: 29, text: "print(my_list[0])", output: "1" },
    ],
    strings: [
      { id: 30, text: "s = 'hello'" },
      { id: 31, text: "print(s.upper())", output: "HELLO" },
    ],
    input: [
      { id: 32, text: "name = input('Enter your name: ')" },
      { id: 33, text: "print('Hi', name)", output: "Hi <input>" },
    ],
  };

  // Output simulation for each block (uses output property if present)
  function getBlockOutput(block) {
    return block.output || "";
  }

  const [selectedTopic, setSelectedTopic] = useState("print");
  const [availableBlocks, setAvailableBlocks] = useState(
    blocksByTopic["print"]
  );
  const [dropBlocks, setDropBlocks] = useState([]);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [output, setOutput] = useState("");

  // Update available blocks when topic changes
  function handleTopicChange(topicKey) {
    setSelectedTopic(topicKey);
    setAvailableBlocks(blocksByTopic[topicKey]);
    setDropBlocks([]);
    setOutput("");
  }

  // Drag and drop handlers
  function handleDragStart(block) {
    setDraggedBlock(block);
  }

  function handleDropBlock() {
    if (!draggedBlock) return;
    // Prevent duplicate blocks in drop area
    if (!dropBlocks.find((b) => b.id === draggedBlock.id)) {
      setDropBlocks([...dropBlocks, draggedBlock]);
    }
    setDraggedBlock(null);
  }

  function handleRemoveDropBlock(id) {
    setDropBlocks(dropBlocks.filter((b) => b.id !== id));
  }

  // Simulate output (very basic, just for demo)
  function handleShowOutput() {
    let out = dropBlocks
      .map((b) => getBlockOutput(b))
      .filter(Boolean)
      .join("\n");
    setOutput(out || "No output.");
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left Side: Topic filter and available blocks */}
      <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between min-h-[400px]">
        <div>
          <h4 className="font-bold mb-2">Select Topic</h4>
          <select
            className="w-full mb-4 p-2 border rounded"
            value={selectedTopic}
            onChange={(e) => handleTopicChange(e.target.value)}
          >
            {topics.map((topic) => (
              <option key={topic.key} value={topic.key}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Available Blocks</h4>
          <div className="flex flex-col gap-2">
            {availableBlocks.map((block) => (
              <div
                key={block.id}
                draggable
                onDragStart={() => handleDragStart(block)}
                className="p-2 bg-gray-100 rounded border cursor-move"
              >
                {block.text}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right Side: Drop area and output */}
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <div
          className="bg-white rounded-lg shadow-lg p-4 min-h-[200px] flex flex-col"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropBlock}
        >
          <h4 className="font-bold mb-2">Drop Blocks Here</h4>
          {dropBlocks.length === 0 && (
            <div className="text-gray-400 italic">
              Drag blocks here to build your code
            </div>
          )}
          <ul>
            {dropBlocks.map((block) => (
              <li
                key={block.id}
                className="mb-2 p-2 bg-yellow-50 rounded border flex justify-between items-center"
              >
                <span>{block.text}</span>
                <button
                  className="ml-2 text-xs text-red-500"
                  onClick={() => handleRemoveDropBlock(block.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <button
            className="px-4 py-2 bg-yellow-400 rounded font-semibold mb-2"
            onClick={handleShowOutput}
          >
            Show Output
          </button>
          <div className="mt-2">
            <h4 className="font-bold">Output:</h4>
            <pre className="bg-gray-100 rounded p-2 min-h-[40px]">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
