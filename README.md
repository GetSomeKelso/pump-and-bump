# Pump & Bump

A simple web app that gives you a daily pushup goal based on how many days old your baby is (counted from conception). If your baby is 55 days old, your goal is 55 pushups that day. Log your reps throughout the day and watch your progress ring fill up.

## How It Works

1. Enter your baby's conception date
2. Each day, you'll see how many pushups to do (equal to the baby's age in days)
3. Log pushups as you do them — they add up throughout the day
4. Hit your goal and get a completion message
5. Check your history to see how you've been doing

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
