import express from "express";

const app = express();
const port = 3000;
const backendUrl = process.env.BACKEND_URL || "http://backend:5000";

app.use(express.json());

app.get("/", (req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>To-Do Item Form</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 0 16px; }
    label { display: block; margin: 16px 0; }
    input, textarea { box-sizing: border-box; display: block; width: 100%; padding: 10px; margin-top: 6px; }
    textarea { min-height: 120px; }
    button { padding: 10px 18px; cursor: pointer; }
    #message { margin-top: 18px; }
  </style>
</head>
<body>
  <h1>Add a To-Do Item</h1>
  <form id="itemForm">
    <label>
      Item Name
      <input name="itemName" required>
    </label>
    <label>
      Item Description
      <textarea name="itemDescription" required></textarea>
    </label>
    <button type="submit">Submit item</button>
  </form>
  <p id="message" role="status"></p>

  <script>
    const form = document.getElementById("itemForm");
    const message = document.getElementById("message");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      message.textContent = "Submitting...";

      const formData = new FormData(form);
      const item = Object.fromEntries(formData.entries());

      try {
        const response = await fetch("/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Submission failed.");
        }

        message.textContent = result.message;
        form.reset();
      } catch (error) {
        message.textContent = "Error: " + error.message;
      }
    });
  </script>
</body>
</html>`);
});

app.post("/submit", async (req, res) => {
  try {
    const response = await fetch(backendUrl + "/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const result = await response.json();
    res.status(response.status).json(result);
  } catch (error) {
    res.status(502).json({
      error: "Could not connect to the Flask backend."
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "frontend is running" });
});

app.listen(port, "0.0.0.0", () => {
  console.log("Frontend listening on port " + port);
});
