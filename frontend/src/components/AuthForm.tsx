import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { login, register } from "../services/authService";

interface AuthFormProps {
  onLogin: (user: { id: string; name: string; email: string; status: string }) => void;
}

export const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit");
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const response = await login({ email, password });
        if (response.user && response.user.id) {
          // Store the token in localStorage
          localStorage.setItem('token', response.token);
          onLogin({
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            status: response.user.status
          });
        } else {
          console.error("Invalid response structure:", response);
        }
      } else {
        const response = await register({ name, email, password });
        if (response.user && response.user.id) {
          // Store the token in localStorage
          localStorage.setItem('token', response.token);
          onLogin({
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            status: response.user.status
          });
        } else {
          console.error("Invalid response structure:", response);
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      if (error.response?.status === 409) {
        setError("User with this email already exists. Please login instead.");
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6 text-center">
          <h3 className="text-2xl font-bold leading-none tracking-tight">
            {isLogin ? "Sign In" : "Create Account"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isLogin 
              ? "Enter your credentials to access your account" 
              : "Fill in your details to create a new account"
            }
          </p>
        </div>
        <div className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none 
                peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  placeholder="Enter your full name"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none 
              peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none 
              peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded">
                {error}
              </div>
            )}
            
            <Button
              type="submit" 
              disabled={loading}
            >
              {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 