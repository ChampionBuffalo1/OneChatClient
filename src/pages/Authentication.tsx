import { useEffect } from 'react';
import { Command } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import AuthForm from '../components/AuthForm';
import { Link, useNavigate } from 'react-router-dom';

export interface AuthenticationProps {
  type: 'login' | 'signup';
}

export default function Authentication({ type }: AuthenticationProps) {
  // Default value of `type` is "login"
  const isLogin = (type || 'login') === 'login';
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/home');
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>OneChat - {isLogin ? 'Log in' : 'Sign Up'}</title>
      </Helmet>
      <div
        className="bg-primary text-primary-foreground container relative hidden flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
        style={{
          height: '100vh'
        }}
      >
        <div className="relative hidden h-full flex-col bg-muted p-10 lg:flex">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: "url('image.jpeg')"
            }}
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Command className="mr-2 h-6 w-6" /> OneChat Inc
          </div>
        </div>

        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">{isLogin ? 'Login to' : 'Create'} your account</h1>
              <p className="text-sm text-muted-foreground ">
                Enter your username and password to {isLogin ? type : 'create an account'}
              </p>
            </div>
            <AuthForm type={type} />
            <p className="p-2 bg-zinc-800 text-center text-md rounded-md blur:bg-zinc-400">
              <Link to={'/' + (isLogin ? 'signup' : 'login')}>{isLogin ? "Don't" : 'Already'} have a account?</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
