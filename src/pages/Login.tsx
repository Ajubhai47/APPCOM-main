import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, User, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ApiService } from "@/services/apiService";
import { verifyDemoStudentCredentials } from "@/data/demoStudents";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam === 'admin') {
      setRole('admin');
    } else {
      setRole('student');
    }
  }, [location]);

  // Clear password when role changes
  useEffect(() => {
    setPassword('');
  }, [role]);

  const handleRoleChange = (newRole: 'student' | 'admin') => {
    setRole(newRole);
    setPassword(''); // Clear password when switching roles
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (role === 'student') {
        // Try API verification for student login
        try {
          // Note: using verifyStudentCredentials assumes we want to login against DB (or demo fallback internally)
          // The verifyStudentCredentials function returns {valid: boolean, studentId?: string}

          let result;
          try {
            result = await ApiService.verifyStudentCredentials(username, password);
          } catch (e) {
            // If API fails (server down?), falling back to demo legacy logic if available
            // But verifyDemoStudentCredentials might rely on ID being username
            console.warn("API verify failed, trying local demo check", e);
            const isDemoValid = verifyDemoStudentCredentials(username, password);
            if (isDemoValid) {
              result = { valid: true, studentId: username }; // Fallback
              toast({
                title: "Demo Mode",
                description: "Server unreachable. Using offline demo mode.",
              });
            } else {
              throw e;
            }
          }

          if (result && result.valid && result.studentId) {
            toast({
              title: "Success",
              description: "Student login successful",
            });
            // Store student ID in localStorage for session management
            localStorage.setItem('studentId', result.studentId);
            navigate('/student');
          } else {
            toast({
              title: "Error",
              description: "Invalid credentials. Please check your Student Name and password.",
              variant: "destructive",
            });
          }
        } catch (apiError) {
          console.error('Login flow error:', apiError);
          toast({
            title: "Login Failed",
            description: "Could not verify credentials. Please ensure the server is running.",
            variant: "destructive",
          });
        }
      } else {
        // Admin login - using hardcoded credentials for demo
        if (username && password === 'admin123') {
          toast({
            title: "Success",
            description: "Admin login successful",
          });
          navigate('/admin');
        } else {
          toast({
            title: "Error",
            description: "Invalid credentials. For admin login, use password: admin123",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold">
              <span className="text-gray-800">APP</span>
              <span className="text-ethicproc-700">COM</span>
            </h1>
          </Link>
          <p className="text-gray-600 mt-2">Advanced Privacy-Preserving Proctoring System</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-ethicproc-700">
                  {role === 'student' ? 'Student Login' : 'Administrator Login'}
                </h2>
                <p className="text-gray-600">
                  {role === 'student' ? 'Access your exam session' : 'Access proctoring dashboard'}
                </p>
              </div>

              <div className="flex justify-between bg-gray-100 rounded-lg mb-6">
                <button
                  onClick={() => handleRoleChange('student')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${role === 'student' ? 'bg-ethicproc-700 text-white' : 'text-gray-600'}`}
                >
                  <User size={18} />
                  Student
                </button>
                <button
                  onClick={() => handleRoleChange('admin')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${role === 'admin' ? 'bg-ethicproc-700 text-white' : 'text-gray-600'}`}
                >
                  <Shield size={18} />
                  Administrator
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">{role === 'student' ? 'Student Name' : 'Username'}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <User size={18} />
                    </span>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      placeholder={role === 'student' ? 'Enter your name' : 'Enter your username'}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <Lock size={18} />
                    </span>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {role === 'student'
                      ? "For demo: Use Student Name 'Muzzamil' and password 'Muzzamil'"
                      : "Admin password is 'admin123'"}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={loading}
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link to="/signup" className="text-sm text-ethicproc-700 hover:underline">
                      Sign up
                    </Link>
                    <a href="#" className="text-sm text-ethicproc-700 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-ethicproc-700 hover:bg-ethicproc-800"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Demo Mode:</strong> The application is currently in demo mode with pre-loaded student data.
                  Use Student Name 'Muzzamil' and password 'Muzzamil' to log in as Muzzamil.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-ethicproc-700 rounded-lg p-8 flex flex-col text-white hidden md:flex">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-6">Privacy-Focused Proctoring</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-xl mb-2">How it works</h3>
                  <p className="text-ethicproc-100">
                    Our system monitors keyboard and mouse activity patterns without
                    recording actual content. No camera or microphone access required.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-xl mb-2">For Students</h3>
                  <p className="text-ethicproc-100">
                    Take your exams with confidence knowing your privacy is protected.
                    No intrusive surveillance - just fair assessment.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-xl mb-2">For Administrators</h3>
                  <p className="text-ethicproc-100">
                    Get real-time insights into student behavior and potential malpractice
                    without invasive monitoring techniques.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-ethicproc-600">
              <p className="text-ethicproc-100">
                Need assistance? Contact our support team at support@ethicproctor.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;