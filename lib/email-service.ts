interface WelcomeEmailData {
  name: string
  email: string
}

export const sendWelcomeEmail = async (userData: WelcomeEmailData) => {
  // In a real app, this would send via your email service (SendGrid, Mailgun, etc.)
  // For now, we'll simulate the email and store it locally for demo purposes

  const welcomeEmail = {
    to: userData.email,
    subject: "🎉 Welcome to TrackFlow - Let's Build Better Habits Together!",
    html: generateWelcomeEmailHTML(userData),
    sentAt: new Date().toISOString(),
    type: "welcome",
  }

  // Store in localStorage for demo (in production, this would be sent via email service)
  const existingEmails = JSON.parse(localStorage.getItem("demo-emails") || "[]")
  existingEmails.push(welcomeEmail)
  localStorage.setItem("demo-emails", JSON.stringify(existingEmails))

  // Show a notification that email was "sent"
  console.log("Welcome email sent to:", userData.email)

  return welcomeEmail
}

const generateWelcomeEmailHTML = (userData: WelcomeEmailData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to TrackFlow</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #8b5cf6, #06b6d4); padding: 40px 20px; text-align: center;">
          <div style="width: 60px; height: 60px; background: white; border-radius: 16px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #8b5cf6, #06b6d4); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 24px; font-weight: bold;">🎯</span>
            </div>
          </div>
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Welcome to TrackFlow!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">Your journey to better habits starts now</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 20px;">
          <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px;">Hi ${userData.name}! 👋</h2>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Thank you for joining TrackFlow! We're excited to help you build better habits and achieve your goals through consistent daily tracking.
          </p>

          <div style="background: linear-gradient(135deg, #f1f5f9, #e2e8f0); padding: 30px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #8b5cf6;">
            <h3 style="color: #8b5cf6; margin: 0 0 15px 0; font-size: 20px;">🚀 Get Started in 3 Easy Steps:</h3>
            <div style="space-y: 15px;">
              <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                <div style="background: #8b5cf6; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 15px; flex-shrink: 0;">1</div>
                <div>
                  <strong style="color: #1e293b;">Create Your First Activity</strong>
                  <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">Add activities you want to track daily - exercise, reading, water intake, or any habit you want to build.</p>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                <div style="background: #06b6d4; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 15px; flex-shrink: 0;">2</div>
                <div>
                  <strong style="color: #1e293b;">Log Your Progress Daily</strong>
                  <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">Take just a few seconds each day to record your progress and watch your streaks grow!</p>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; margin-bottom: 0;">
                <div style="background: #10b981; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 15px; flex-shrink: 0;">3</div>
                <div>
                  <strong style="color: #1e293b;">Track Your Analytics</strong>
                  <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">View beautiful charts and insights to understand your progress and stay motivated.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Features Grid -->
          <div style="margin: 30px 0;">
            <h3 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px; text-align: center;">✨ What You Can Do with TrackFlow</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div style="text-align: center; padding: 20px; background: #fef3f2; border-radius: 8px;">
                <div style="font-size: 32px; margin-bottom: 10px;">🎯</div>
                <strong style="color: #dc2626;">Goal Setting</strong>
                <p style="color: #7f1d1d; font-size: 12px; margin: 5px 0 0 0;">Set daily targets for each activity</p>
              </div>
              <div style="text-align: center; padding: 20px; background: #f0f9ff; border-radius: 8px;">
                <div style="font-size: 32px; margin-bottom: 10px;">📊</div>
                <strong style="color: #0369a1;">Progress Analytics</strong>
                <p style="color: #0c4a6e; font-size: 12px; margin: 5px 0 0 0;">Beautiful charts and insights</p>
              </div>
              <div style="text-align: center; padding: 20px; background: #f0fdf4; border-radius: 8px;">
                <div style="font-size: 32px; margin-bottom: 10px;">🔥</div>
                <strong style="color: #16a34a;">Streak Tracking</strong>
                <p style="color: #15803d; font-size: 12px; margin: 5px 0 0 0;">Build momentum with streaks</p>
              </div>
              <div style="text-align: center; padding: 20px; background: #fefce8; border-radius: 8px;">
                <div style="font-size: 32px; margin-bottom: 10px;">📱</div>
                <strong style="color: #ca8a04;">PWA Support</strong>
                <p style="color: #a16207; font-size: 12px; margin: 5px 0 0 0;">Install as a native app</p>
              </div>
            </div>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" 
               style="background: linear-gradient(135deg, #8b5cf6, #06b6d4); 
                      color: white; 
                      padding: 16px 32px; 
                      text-decoration: none; 
                      border-radius: 12px; 
                      display: inline-block;
                      font-weight: bold;
                      font-size: 16px;
                      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);">
              🚀 Start Tracking Now
            </a>
          </div>

          <!-- Tips Section -->
          <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #e2e8f0;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">💡 Pro Tips for Success:</h3>
            <ul style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li style="margin-bottom: 8px;"><strong>Start Small:</strong> Begin with 1-3 activities to build the habit of tracking</li>
              <li style="margin-bottom: 8px;"><strong>Be Consistent:</strong> Log your activities at the same time each day</li>
              <li style="margin-bottom: 8px;"><strong>Celebrate Wins:</strong> Acknowledge your streaks and progress milestones</li>
              <li style="margin-bottom: 0;"><strong>Stay Patient:</strong> Building habits takes time - focus on consistency over perfection</li>
            </ul>
          </div>

          <!-- Support Section -->
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #f1f5f9, #e2e8f0); border-radius: 12px; margin: 30px 0;">
            <h3 style="color: #1e293b; margin: 0 0 10px 0;">Need Help? We're Here! 🤝</h3>
            <p style="color: #64748b; margin: 0 0 15px 0; font-size: 14px;">
              Have questions or need assistance? Check out our features in the app or reach out anytime.
            </p>
            <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings" style="color: #8b5cf6; text-decoration: none; font-weight: 500;">⚙️ Settings</a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/analytics" style="color: #8b5cf6; text-decoration: none; font-weight: 500;">📊 Analytics</a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <div style="margin-bottom: 20px;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #8b5cf6, #06b6d4); border-radius: 10px; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-weight: bold; font-size: 18px;">🎯</span>
            </div>
            <h4 style="color: #1e293b; margin: 0; font-size: 18px;">TrackFlow</h4>
            <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">Build Better Habits, One Day at a Time</p>
          </div>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0 0 10px 0;">
              You're receiving this email because you created an account with TrackFlow.
            </p>
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              © 2024 TrackFlow. Made with ❤️ for building better habits.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

// Function to get demo emails (for development purposes)
export const getDemoEmails = () => {
  return JSON.parse(localStorage.getItem("demo-emails") || "[]")
}

// Function to clear demo emails
export const clearDemoEmails = () => {
  localStorage.removeItem("demo-emails")
}
