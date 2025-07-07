// HumanHardinessQuiz.jsx
import React, { useState } from "react";
import html2canvas from "html2canvas";
import Image from "next/image";
import { motion } from "framer-motion";

const basicInputs = [
  { label: "Ideal Avg Temp (°F)", key: "temp", type: "number" },
  { label: "Humidity Preference (%)", key: "humidity", type: "number" },
  { label: "Sunny Days per Year", key: "sunnyDays", type: "number" },
  { label: "Annual Rainfall (inches)", key: "rain", type: "number" },
  { label: "Annual Snowfall (inches)", key: "snow", type: "number" },
];

const questions = [
  {
    text: "Your Ideal Morning Vibe:",
    options: [
      { label: "Crisp air, hot coffee, hoodie weather.", value: "cold" },
      { label: "Misty, rainy window, lo-fi jazz and incense.", value: "mild" },
      { label: "Sunrise sweat session, cold plunge, desert stillness.", value: "warm" },
      { label: "Ocean breeze, fresh fruit, barefoot walk.", value: "hot" },
      { label: "Long sleep, brunch on a patio, sun warming your skin.", value: "mild" },
    ],
  },
  {
    text: "Ideal Year-Round Temperature Range?",
    options: [
      { label: "30–60°F", value: "cold" },
      { label: "45–75°F", value: "mild" },
      { label: "60–90°F", value: "warm" },
      { label: "70–100°F", value: "hot" },
    ],
  },
  {
    text: "Humidity Preference?",
    options: [
      { label: "Dry as a bone", value: "cold" },
      { label: "Light humidity is fine", value: "mild" },
      { label: "Moist and misty", value: "warm" },
      { label: "Thick tropical soup", value: "hot" },
    ],
  },
  {
    text: "How Do You Handle Cold Snaps?",
    options: [
      { label: "I love them", value: "cold" },
      { label: "I cope fine", value: "mild" },
      { label: "I get cranky", value: "warm" },
      { label: "Nope", value: "hot" },
    ],
  },
  {
    text: "How Do You Handle Heatwaves?",
    options: [
      { label: "I’m melting", value: "cold" },
      { label: "I’ll survive", value: "mild" },
      { label: "I adapt", value: "warm" },
      { label: "Love them", value: "hot" },
    ],
  },
];

const zoneResults = {
  cold: {
    label: "Zones 2–4",
    description:
      "You thrive in the chill! Think northern forests, cozy cabins, and firepit culture.",
    states: ["Alaska", "Montana", "Minnesota", "Upper Michigan"],
    map: "/maps/zone_cold.png",
  },
  mild: {
    label: "Zones 5–7",
    description:
      "Balanced and adaptable—perfect for seasonal changes and hybrid vibes.",
    states: ["Vermont", "New York", "Colorado", "Oregon"],
    map: "/maps/zone_mild.png",
  },
  warm: {
    label: "Zones 8–9",
    description:
      "Warm days and dry spells suit you. You're a sun-seeker with a taste for adventure.",
    states: ["Texas", "California", "Nevada", "Arizona"],
    map: "/maps/zone_warm.png",
  },
  hot: {
    label: "Zone 10+",
    description:
      "You crave heat and humidity. Tropical, spicy, and always glowing.",
    states: ["Florida", "Louisiana", "Southern California", "Hawaii"],
    map: "/maps/zone_hot.png",
  },
};

const estimateZone = (values) => {
  const { temp, humidity, sunnyDays, rain, snow } = values;
  if (temp < 50 || snow > 40) return "cold";
  if (temp >= 50 && temp <= 70 && humidity < 60) return "mild";
  if (temp > 70 && humidity < 70) return "warm";
  return "hot";
};

export default function HumanHardinessQuiz() {
  const [darkMode, setDarkMode] = useState(false);
  const [mode, setMode] = useState("quiz");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({ temp: "", humidity: "", sunnyDays: "", rain: "", snow: "" });
  const [showInputs, setShowInputs] = useState(true);

  const handleAnswer = (value) => {
    const newAnswers = [...answers, value];
    if (current + 1 === questions.length) {
      const count = {};
      newAnswers.forEach((val) => {
        count[val] = (count[val] || 0) + 1;
      });
      const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
      setResult(zoneResults[top]);
    } else {
      setAnswers(newAnswers);
      setCurrent(current + 1);
    }
  };

  const handleDownload = () => {
    const card = document.getElementById("share-card");
    html2canvas(card).then((canvas) => {
      const link = document.createElement("a");
      link.download = "hardiness-zone.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const handleBasicSubmit = () => {
    const parsed = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, parseFloat(v)]));
    const zone = estimateZone(parsed);
    setResult(zoneResults[zone]);
  };

  return (
    <div
      className={`max-w-2xl mx-auto p-4 rounded-xl shadow-xl border ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">🌿 Human Hardiness Quiz</h1>
        <div className="flex gap-2">
          <button className="border px-2 py-1" onClick={() => setMode("quiz")}>Quiz Mode</button>
          <button className="border px-2 py-1" onClick={() => setMode("basic")}>Basic Mode</button>
          <button className="border px-2 py-1" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {!result && mode === "quiz" && (
        <div className="mb-4 border p-4 rounded space-y-4">
          <h2 className="text-xl font-bold">{questions[current].text}</h2>
          {questions[current].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option.value)}
              className="w-full text-left border px-4 py-2 rounded hover:bg-gray-100"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {!result && mode === "basic" && (
        <div className="mb-4 border p-4 rounded space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Enter Your Ideal Conditions</h2>
            <label className="text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={showInputs}
                onChange={() => setShowInputs(!showInputs)}
              />
              Enable Detailed Inputs
            </label>
          </div>
          {showInputs && (
            <>
              {basicInputs.map((input) => (
                <div key={input.key} className="space-y-1">
                  <label className="block font-medium">{input.label}</label>
                  <input
                    type={input.type}
                    className="w-full border rounded px-2 py-1 text-black"
                    value={form[input.key]}
                    onChange={(e) => setForm({ ...form, [input.key]: e.target.value })}
                  />
                </div>
              ))}
              <button className="mt-4 w-full border px-4 py-2 rounded hover:bg-gray-100" onClick={handleBasicSubmit}>
                Submit
              </button>
            </>
          )}
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div id="share-card" className="mb-6 border p-4 rounded space-y-4 bg-white text-black">
            <h2 className="text-2xl font-bold">
              Your Human Hardiness Zone: {result.label} 🌍
            </h2>
            <p>{result.description}</p>
            <div>
              <strong>Recommended States:</strong> {result.states.join(", ")}
            </div>
            <Image
              src={result.map}
              alt="Zone Map"
              width={600}
              height={400}
              className="rounded-xl border"
            />
            <div className="flex gap-2 mt-4">
              <button
                className="border px-4 py-2 rounded hover:bg-gray-100"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `I’m a ${result.label} human 🌱 - perfect for life in ${result.states[0]}!`
                  )
                }
              >
                📤 Share Your Zone
              </button>
              <button className="border px-4 py-2 rounded hover:bg-gray-100" onClick={handleDownload}>
                💾 Save Card
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
