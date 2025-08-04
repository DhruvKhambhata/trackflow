// This script can be run as a cron job to send daily reminders
const fetch = require("node-fetch")

async function sendDailyReminders() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "daily-reminder",
      }),
    })

    if (response.ok) {
      console.log("Daily reminders sent successfully")
    } else {
      console.error("Failed to send daily reminders")
    }
  } catch (error) {
    console.error("Error sending daily reminders:", error)
  }
}

sendDailyReminders()
