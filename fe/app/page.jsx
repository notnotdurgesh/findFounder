import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Lightbulb, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">CoFounderMatch</div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Find Your Perfect Co-Founder Match
        </h1>
        <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Connect visionary founders with innovative ideas to skilled developers ready to build the next big thing.
        </p>
        <div className="flex justify-center space-x-4 mb-16">
          <Link href="/founder/signup">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              I'm a Founder <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/developer/signup">
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900">
              I'm a Developer <Code className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <Lightbulb className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4 mx-auto" />
            <h2 className="text-xl font-semibold mb-2">Innovative Ideas</h2>
            <p className="text-gray-600 dark:text-gray-300">Connect with founders who have groundbreaking ideas waiting to be brought to life.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <Code className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4 mx-auto" />
            <h2 className="text-xl font-semibold mb-2">Skilled Developers</h2>
            <p className="text-gray-600 dark:text-gray-300">Find talented developers ready to turn your vision into a reality.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <Users className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4 mx-auto" />
            <h2 className="text-xl font-semibold mb-2">Perfect Matches</h2>
            <p className="text-gray-600 dark:text-gray-300">Our algorithm ensures you find the ideal co-founder to complement your skills.</p>
          </div>
        </div>

        <div className="bg-blue-600 dark:bg-blue-800 text-white py-12 px-4 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">Join thousands of founders and developers who've found their perfect match.</p>
          <Button size="lg" variant="secondary">
            Get Started Now
          </Button>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">© 2023 CoFounderMatch. All rights reserved.</div>
          <div className="space-x-4">
            <Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

