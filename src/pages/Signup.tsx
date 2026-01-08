
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, FileText, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ApiService } from "@/services/apiService";

const Signup = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [name, setName] = useState('');
    const [exam, setExam] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !exam || !password) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            const studentData = {
                name,
                exam,
                password
            };

            const newStudent = await ApiService.createStudent(studentData);

            toast({
                title: "Success",
                description: `Student registered successfully! Your Student ID is: ${newStudent.id}`,
            });

            // Optional: Auto-login or redirect to login with ID pre-filled if possible
            // For now, redirect to login
            navigate('/login');

        } catch (error) {
            console.error('Signup error:', error);
            toast({
                title: "Error",
                description: "Failed to register student. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex justify-center items-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link to="/" className="inline-block">
                        <h1 className="text-3xl font-bold">
                            <span className="text-gray-800">APP</span>
                            <span className="text-ethicproc-700">COM</span>
                        </h1>
                    </Link>
                    <p className="text-gray-600 mt-2">Student Registration</p>
                </div>

                <Card className="shadow-lg border-0">
                    <CardContent className="p-6">
                        <div className="mb-6">
                            <Link to="/login" className="text-sm text-gray-500 hover:text-ethicproc-700 flex items-center gap-1 mb-4">
                                <ArrowLeft size={14} /> Back to Login
                            </Link>
                            <h2 className="text-2xl font-bold mb-2 text-ethicproc-700">
                                Create Account
                            </h2>
                            <p className="text-gray-600">
                                Register for your exam session
                            </p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        <User size={18} />
                                    </span>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10"
                                        placeholder="Enter your full name"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="exam">Exam Name</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        <FileText size={18} />
                                    </span>
                                    <Input
                                        id="exam"
                                        value={exam}
                                        onChange={(e) => setExam(e.target.value)}
                                        className="pl-10"
                                        placeholder="e.g. Ethics Final Exam"
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
                                        placeholder="Create a password"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-ethicproc-700 hover:bg-ethicproc-800 mt-2"
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Sign Up'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Signup;
