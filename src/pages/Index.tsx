
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Eye, Brain, Cloud } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 pt-6">
          <div className="flex items-center mb-6 md:mb-0">
            <h1 className="text-3xl font-bold">
              <span className="text-gray-800">APP</span>
              <span className="text-ethicproc-700">COM</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/login">
              <Button className="bg-ethicproc-700 hover:bg-ethicproc-800">Get Started</Button>
            </Link>
          </div>
        </header>

        <main>
          <section className="text-center mb-16 pt-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Advanced Privacy-Preserving <span className="text-ethicproc-700">Proctoring System</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Monitor student activities and ensure exam integrity without invading privacy.
              No camera or microphone required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login?role=student">
                <Button size="lg" className="bg-ethicproc-700 hover:bg-ethicproc-800 text-white px-8">
                  Start as Student
                </Button>
              </Link>
              <Link to="/login?role=admin">
                <Button size="lg" variant="outline" className="border-ethicproc-700 text-ethicproc-700 px-8">
                  Login as Admin
                </Button>
              </Link>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="border-l-4 border-l-ethicproc-500 shadow-md">
              <CardContent className="pt-6">
                <div className="bg-ethicproc-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="text-ethicproc-700" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Privacy-Focused</h3>
                <p className="text-gray-600">
                  Your data is protected with advanced encryption and privacy measures.
                  No camera or microphone recordings.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-ethicproc-500 shadow-md">
              <CardContent className="pt-6">
                <div className="bg-ethicproc-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Brain className="text-ethicproc-700" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
                <p className="text-gray-600">
                  Advanced behavioral analytics to ensure academic integrity without invasive monitoring.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-ethicproc-500 shadow-md">
              <CardContent className="pt-6">
                <div className="bg-ethicproc-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Cloud className="text-ethicproc-700" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Cloud-Based</h3>
                <p className="text-gray-600">
                  Access your exams from anywhere with secure cloud technology and real-time monitoring.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="bg-white rounded-xl p-8 shadow-lg mb-16">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">How It Works</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-ethicproc-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">
                      <span className="text-ethicproc-700 font-medium">1</span>
                    </div>
                    <p>Student logs in to the proctoring session before their exam</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-ethicproc-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">
                      <span className="text-ethicproc-700 font-medium">2</span>
                    </div>
                    <p>Our system monitors keyboard strokes, mouse movements, tab switches without recording content</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-ethicproc-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">
                      <span className="text-ethicproc-700 font-medium">3</span>
                    </div>
                    <p>AI algorithms analyze patterns to detect potential malpractice</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-ethicproc-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">
                      <span className="text-ethicproc-700 font-medium">4</span>
                    </div>
                    <p>Admins receive real-time alerts and risk scores without invasive monitoring</p>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 bg-ethicproc-100 p-6 rounded-lg">
                <h4 className="text-xl font-semibold mb-4 text-ethicproc-800">What We Monitor</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-ethicproc-500 mr-2"></div>
                      <span className="font-medium">Keyboard Activity</span>
                    </div>
                    <p className="text-sm text-gray-600">Pattern analysis without recording keystrokes</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-ethicproc-500 mr-2"></div>
                      <span className="font-medium">Mouse Movement</span>
                    </div>
                    <p className="text-sm text-gray-600">Unusual patterns or automated clicks</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-ethicproc-500 mr-2"></div>
                      <span className="font-medium">Tab Switching</span>
                    </div>
                    <p className="text-sm text-gray-600">Frequency and duration of focus changes</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-ethicproc-500 mr-2"></div>
                      <span className="font-medium">Copy/Paste</span>
                    </div>
                    <p className="text-sm text-gray-600">Attempts without recording content</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">© 2025 EthicProctor. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-ethicproc-700">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-ethicproc-700">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-ethicproc-700">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
