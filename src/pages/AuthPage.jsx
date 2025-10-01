// src/pages/AuthPage.jsx
import AuthForm from "../components/AuthForm";

export default function AuthPage({ onLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">PUVerse</h1>
        <AuthForm onLogin={onLogin} />
      </div>
    </div>
  );
}