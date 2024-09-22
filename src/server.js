const { exec } = require("child_process");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.post("/propose", (req, res) => {
  const { title, content, proposer } = req.body;
  const command = `leo run propose "{ title: ${title}, content: ${content}, proposer: ${proposer} }"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: stderr });
    } else {
      res.json({ message: stdout });
    }
  });
});

app.post("/new_ticket", (req, res) => {
  const { pid, owner } = req.body;
  const command = `leo run new_ticket ${pid} ${owner}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: stderr });
    } else {
      res.json({ message: stdout });
    }
  });
});

app.post("/vote", (req, res) => {
  const { pid, owner, nonce, type } = req.body;
  const command = `leo run ${type} "{ owner: ${owner}.private, pid: ${pid}.private, _nonce: ${nonce}.group.public }"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: stderr });
    } else {
      res.json({ message: stdout });
    }
  });
});

app.listen(3001, () => {
  console.log("Backend server running on port 3001");
});
