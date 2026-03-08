import React, { useState } from "react";
import "./css/PollMessage.css";

export default function PollMessage({
  onClose,
  setMessagesState,
  setSendEnabled,
}) {
  // use state for question and options
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  // for adding input blocks when all input blocks are filled
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);

    if (
      updatedOptions.every((opt) => opt.trim() !== "") &&
      updatedOptions.length < 10
    ) {
      setOptions([...updatedOptions, ""]);
    }
  };

  const canSend =
    question.trim() !== "" &&
    options.filter((opt) => opt.trim() !== "").length >= 1; // filters out the blank options from the list

  function handleSendMessage() {
    if (!canSend) return;

    const pollMessage = {
      id: Date.now(),
      type: "poll",
      question: question,
      options: options.filter((opt) => opt.trim() !== ""),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSent: true,
    };

    setMessagesState((prev) => [...prev, pollMessage]);
    setSendEnabled(false);
    onClose();
  }

  return (
    <div className="poll-overlay" onClick={onClose}>
      <div className="poll-modal" onClick={(e) => e.stopPropagation()}>
        <button className="poll-close-button" onClick={onClose}>
          &times;
        </button>

        <div className="poll-header">
          <h2>Create poll</h2>
        </div>

        <div className="poll-body">
          <label>Question</label>
          <input
            type="text"
            placeholder="Ask question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <label>Options</label>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder="+ Add option"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
          ))}
        </div>

        <div className="poll-footer">
          <button
            className="btn btn-primary"
            disabled={!canSend}
            onClick={handleSendMessage}
          >
            <i className="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
