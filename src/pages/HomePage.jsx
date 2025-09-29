export default function HomePage({ user, onLogout }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8 flex flex-col items-center text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-gray-800">
          Welcome, {user.username}!
        </h1>
        <p className="text-gray-600 mb-6 sm:mb-8">
          This is your PUVerse Home Page.
        </p>
        <button
          onClick={onLogout}
          className="w-full sm:w-auto px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}