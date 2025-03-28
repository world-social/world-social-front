'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiRequest } from '@/lib/api';

// Function to generate a random UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function SignUpForm(
  { onRegistered }: {
    onRegistered: () => void;
  }
): React.ReactElement {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    worldId: '', // Initialize as empty string
  });

  // Generate UUID on client side only
  useEffect(() => {
    setFormData(prev => ({ ...prev, worldId: generateUUID() }));
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          worldId: formData.worldId,
        }),
      });

      if (response.status === 'success' && response.data) {
        // Store the token
        localStorage.setItem('auth_token', response.data.token);
        // Store user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // Redirect to home page
        // Optionally update state if you need it
        setRegistered(true);
        onRegistered();
        router.push('/home-page');
      } else {
        setError(response.error || 'Failed to create account');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // If needed, you can trigger onRegistered when the registered state changes:
  // useEffect(() => {
  //   if (registered) {
  //     onRegistered();
  //   }
  // }, [registered, onRegistered]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>
          Join WorldSocial and start sharing your moments with the world
        </CardDescription>
      </CardHeader>
      {loading ? (
        <CardContent className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                minLength={3}
                maxLength={30}
                pattern="^[a-zA-Z0-9_]+$"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <p className="text-sm text-center text-gray-500">
              Already have an account?{' '}
              <a href="/login" className="text-primary hover:underline">
                Sign in
              </a>
            </p>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
