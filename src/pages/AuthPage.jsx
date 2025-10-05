import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import "../styles/AuthForm.css";

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page relative flex flex-col min-h-screen">
      {/* Background image with blur */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{
          backgroundImage: "url('https://ums.paruluniversity.ac.in/Default/assets/pages/img/1.jpg')",
          zIndex: -1,
        }}
      ></div>

      <main className="flex-grow flex flex-col justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-sm mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary">PUVerse</h1>
            <p className="mt-2 text-base text-muted-foreground">
              {isLogin ? "Welcome back! Please enter your details." : "Create an account to get started."}
            </p>
          </div>

          <div className="flex bg-muted p-1 rounded-full mb-8">
            <button
              className={`w-1/2 py-2.5 rounded-full text-sm font-semibold shadow-sm ${
                isLogin ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              className={`w-1/2 py-2.5 rounded-full text-sm font-semibold shadow-sm ${
                !isLogin ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          <AuthForm onLogin={onLogin} isLogin={isLogin} />
        </div>
      </main>

      <footer className="py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
        <div className="flex justify-center items-center space-x-4">
          <a className="hover:underline" href="#">About</a>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <a className="hover:underline" href="#">Help</a>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <a className="hover:underline" href="#">More</a>
        </div>
      </footer>
    </div>
  );
}