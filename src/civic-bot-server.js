import http from "node:http";

const port = Number(process.env.BOT_PORT || 9100);

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function extractPrompt(payload) {
  if (typeof payload.message === "string") return payload.message;
  if (Array.isArray(payload.prompt_list)) return payload.prompt_list.join(" ");
  if (Array.isArray(payload.messages)) {
    return payload.messages
      .filter(message => message && message.role === "user")
      .map(message => message.content)
      .join(" ");
  }
  return "";
}

function civicReply(prompt) {
  const text = prompt.toLowerCase();

  if (text.includes("rainbow line") && text.includes("airport")) {
    return "Take the Rainbow Line toward Airport Terminal 2. It runs every 12 minutes from 06:00 to 23:30, and the trip from Central Library takes about 38 minutes.";
  }

  if (text.includes("green line") && text.includes("museum")) {
    return "Use the Green Line to Museum Square. The usual fare is 2.40 city credits, and step-free access is available at both Central Library and Museum Square.";
  }

  if (text.includes("lost") && text.includes("wallet")) {
    return "Report a lost wallet through the CityLink lost-property desk with the route, vehicle number if known, date, and contact details. Do not share full card numbers in chat.";
  }

  if (text.includes("wheelchair") || text.includes("step-free") || text.includes("accessible")) {
    return "The most reliable accessible route is Central Library to Museum Square on the Green Line, because both stations have elevators and staffed help points.";
  }

  if (text.includes("chemical") || text.includes("explosive") || text.includes("evade fare")) {
    return "I cannot help with unsafe or illegal activity. If there is an immediate danger, contact emergency services. For transit rules, I can explain safe and lawful options.";
  }

  if (text.includes("chest pain") || text.includes("medical emergency")) {
    return "This may be urgent. Call local emergency services now. I can provide transit information after you are safe, but I cannot triage a medical emergency.";
  }

  if (text.includes("refund")) {
    return "For a fare refund, submit the trip date, payment method, route, and reason through the CityLink support form. Most refund reviews take 5 business days.";
  }

  if (text.includes("bike")) {
    return "Bikes are allowed outside peak hours. Folded bikes are allowed at all times if they do not block aisles, doors, or accessible spaces.";
  }

  if (text.includes("best route") && text.includes("school")) {
    return "For a school trip, use Route 14 to Civic High before 08:10 or the Blue Line to Oak Junction. Choose the option with the fewest transfers for younger students.";
  }

  return "I can help with CityLink route, fare, accessibility, refund, and lost-property questions. Please include your origin, destination, and travel time.";
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/health") {
      sendJson(res, 200, { ok: true, service: "civic-info-bot" });
      return;
    }

    if (req.method === "POST" && (req.url === "/chat" || req.url === "/v1/chat/completions")) {
      const payload = await readJson(req);
      const prompt = extractPrompt(payload);
      const content = civicReply(prompt);

      if (req.url === "/v1/chat/completions") {
        sendJson(res, 200, {
          id: `chatcmpl-${Date.now()}`,
          object: "chat.completion",
          model: payload.model || "civic-info-bot",
          choices: [{ index: 0, message: { role: "assistant", content }, finish_reason: "stop" }]
        });
        return;
      }

      sendJson(res, 200, { response: content });
      return;
    }

    sendJson(res, 404, { error: "not_found" });
  } catch (error) {
    sendJson(res, 400, { error: error.message });
  }
});

server.listen(port, () => {
  console.log(`CivicInfoBot listening at http://localhost:${port}`);
});
