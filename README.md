
# CodeBull Teaser Site

Static marketing / teaser landing page for the upcoming CodeBull trading & bot platform for learning. Provides animated charts, feature overview, demo form, sample bot code highlight, leaderboard mock and contact capture (now persists via backend).

## Contact Form Backend Integration

Contact form submissions are now sent to a Node.js/Express backend and saved in `submissions.json`.

### How to Start the Backend Server

1. Make sure you have Node.js installed.
2. Install dependencies (Express):
	```powershell
	npm install express
	```
3. Start the server:
	```powershell
	node server.js
	```
	The server will run on port 3001 by default.

### How It Works

- The contact form on the site sends submissions to `http://localhost:3001/contact`.
- Submissions are saved in `submissions.json` in the project root.
- You can view or process submissions from this file.

## Roadmap Ideas

- Replace mock leaderboard with live API
- Real historical data integration