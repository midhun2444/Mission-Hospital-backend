const Doctor = require("../models/Doctor");
const Department = require("../models/Department");

/**
 * Lightweight rule-based responder so the assistant works out of the box
 * with no external API key. Swap the body of this function for a call to
 * your LLM provider of choice (e.g. the Anthropic Messages API) to make
 * the assistant fully conversational — the request/response shape below
 * (POST /api/ai/chat -> { reply }) will stay the same either way.
 */
async function chat(req, res) {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "message is required" });
    const m = message.toLowerCase();

    if (m.includes("timing") || m.includes("hour")) {
      return res.json({ reply: "Our OPD is open 8:00 AM - 8:00 PM, Monday to Saturday. Emergency is open 24/7." });
    }
    if (m.includes("emergency")) {
      return res.json({ reply: "Emergency is open 24/7 — call 0470-2602228 or come straight to the hospital in Varkala." });
    }
    if (m.includes("location") || m.includes("where")) {
      return res.json({ reply: "We're located at Varkala - 695141, Thiruvananthapuram, Kerala." });
    }
    if (m.includes("doctor") || m.includes("available") || m.includes("cardio") || m.includes("ortho")) {
      const departments = await Department.find().limit(5).select("name");
      const names = departments.map((d) => d.name).join(", ");
      return res.json({ reply: `We have specialists across departments including ${names}. Tell me a department and I can list available doctors and dates.` });
    }
    if (m.includes("book")) {
      return res.json({ reply: "I can help book that — which department or doctor, and what date works for you?" });
    }
    if (m.includes("cancel")) {
      return res.json({ reply: "I can cancel an appointment — please share the appointment ID." });
    }

    return res.json({ reply: "I can help with hospital timings, doctor availability, departments, or booking an appointment — what do you need?" });
  } catch (err) {
    res.status(500).json({ message: "AI assistant failed to respond", error: err.message });
  }
}

module.exports = { chat };
