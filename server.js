
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
// Allow CORS for all origins (for development)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const submissionsFile = path.join(__dirname, 'submissions.json');

// Ensure submissions file exists
if (!fs.existsSync(submissionsFile)) {
  fs.writeFileSync(submissionsFile, '[]');
}

app.post('/contact', (req, res) => {
  const submission = req.body;
  if (!submission || !submission.name || !submission.email || !submission.message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  const submissions = JSON.parse(fs.readFileSync(submissionsFile));
  submissions.push({ ...submission, date: new Date().toISOString() });
  fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
