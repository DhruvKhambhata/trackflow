import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  BarChart3,
  Calendar,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              TrackFlow
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="w-full sm:w-auto">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Track Your Daily
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Progress
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Build better habits with our intuitive activity tracker. Set goals,
            monitor progress, and achieve your dreams one day at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Tracking Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Powerful features designed to help you build lasting habits and
            achieve your goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Target className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>Goal Setting</CardTitle>
              <CardDescription>
                Set personalized daily targets for each activity and track your
                progress towards achieving them.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-purple-600 mb-4" />
              <CardTitle>Progress Analytics</CardTitle>
              <CardDescription>
                Visualize your progress with beautiful charts and insights to
                understand your habits better.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Calendar className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle>Daily Tracking</CardTitle>
              <CardDescription>
                Log your activities daily with our intuitive interface and never
                miss a day of progress.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-orange-600 mb-4" />
              <CardTitle>Streak Tracking</CardTitle>
              <CardDescription>
                Build momentum with streak tracking that motivates you to
                maintain consistent habits.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Activity className="w-12 h-12 text-red-600 mb-4" />
              <CardTitle>Custom Activities</CardTitle>
              <CardDescription>
                Create unlimited custom activities tailored to your personal
                goals and lifestyle.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-indigo-600 mb-4" />
              <CardTitle>Progress Sharing</CardTitle>
              <CardDescription>
                Share your achievements and stay motivated with friends and
                family support.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your habits?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of users who have already started their journey to
            better habits and personal growth.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-blue-600">
              Start Your Journey Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 TrackFlow. Built for better habits and personal growth.</p>
        </div>
      </footer>
    </div>
  );
}
