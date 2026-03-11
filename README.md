# 💪 Pump & Bump

A dad-focused web app that gives you a daily pushup goal based on how many days old your baby is. If your baby is 55 days from conception, your goal is 55 pushups that day. Log your reps throughout the day, watch your progress ring fill up, and follow along with weekly developmental milestones.

## How It Works

1. Enter the **Last Menstrual Period (LMP) date** and **cycle length** (default is 28 days — adjust if her cycle is longer or shorter)
2. The app estimates the conception date and calculates how old your baby is each day
3. Your daily pushup goal = baby's age in days from conception
4. Log pushups as you do them — they add up throughout the day
5. Hit your goal and get a completion message
6. Check your **estimated due date** countdown and **weekly milestone** facts about your baby's development
7. Review your last 7 days of history to track your consistency

## Features

- **Adjustable cycle length** — Not every woman has a standard 28-day cycle. Slide to set 20–45 days and the app recalculates conception automatically
- **Estimated due date** — See when your baby is expected to arrive with a day countdown
- **Weekly milestones** — Fun developmental facts for each week of pregnancy (e.g. "Heart begins beating" at week 4)
- **Progress ring** — Visual circular progress that fills as you log reps
- **History tracker** — See your last 7 days with goal vs. actual reps
- **Offline-ready** — All data stays in your browser (localStorage), nothing sent to a server

## Using the App

### Option 1: Use it online (easiest)

If someone has deployed this app, just open the link they shared with you. No install needed.

### Option 2: Run it on your computer

You'll need **Node.js** installed first. If you don't have it:

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the version that says **"LTS"** (the one on the left)
3. Run the installer and follow the prompts — just click Next/Continue through everything

Once Node.js is installed:

1. **Download this project** — click the green **"Code"** button on GitHub, then click **"Download ZIP"**
2. **Unzip** the downloaded file to a folder on your computer
3. **Open a terminal** in that folder:
   - **Windows:** Open the folder, click the address bar at the top, type `cmd`, and press Enter
   - **Mac:** Right-click the folder and choose "Open in Terminal"
4. **Install dependencies** — type this and press Enter:
   ```
   npm install
   ```
5. **Start the app** — type this and press Enter:
   ```
   npm run dev
   ```
6. **Open your browser** and go to the address shown in the terminal (usually `http://localhost:5173`)

To stop the app, go back to the terminal and press `Ctrl + C`.

## Your Data

All your data is saved in your browser only (localStorage). Nothing is sent to a server. If you clear your browser data, your history will be lost.

## Tech Stack

- [React](https://react.dev) + [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- localStorage for persistence
