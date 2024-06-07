import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../useContext";

const Card = ({ children }) => (
  <div className="border p-4 rounded shadow-md bg-white">{children}</div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-2xl font-bold mb-2">{children}</h2>
);

const CardDescription = ({ children }) => (
  <p className="text-gray-600 mb-4">{children}</p>
);

const CardHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

const CardContent = ({ children }) => (
  <div>{children}</div>
);

const CardFooter = ({ children }) => (
  <div className="mt-4">{children}</div>
);

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block mb-1">{children}</label>
);

const Input = ({ id, placeholder, type, required, value, onChange }) => (
  <input
    id={id}
    type={type}
    className="border rounded px-4 py-2 w-full"
    placeholder={placeholder}
    required={required}
    value={value}
    onChange={onChange}
  />
);

const Link = ({ href, children }) => (
  <a href={href} className="text-sm font-medium text-gray-900 hover:underline dark:text-gray-50">{children}</a>
);

const Button = ({ children, className, ...rest }) => (
  <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`} {...rest}>
    {children}
  </button>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {user} = useContext(UserContext);
  { 
    if (user) {
      window.location.href = '/';
    }
  }
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://socialnetwork-zqhn.onrender.com/login', { email, password }, { withCredentials: true });
      console.log(response.data);
      // handle successful login here
      if (response.data.status === 'success') {
        window.location.href = '/'; // Navigate to the root route
      }

      // handle failed login here
      

    } catch (error) {
      console.error('There was an error!', error);
      // handle error here
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>Enter your email and password below to access your account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#">Forgot password?</Link>
              </div>
              <Input
                id="password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">Sign in</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
