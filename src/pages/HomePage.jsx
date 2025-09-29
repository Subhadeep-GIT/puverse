export default function HomePage({ user, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.username}!</h1>
      <p className="mb-6">This is your PUVerse Home Page.</p>
      <button
        onClick={onLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}