// src/pages/HomePage.jsx
export default function HomePage({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between p-4 text-neutral-800 dark:text-neutral-200">
          <button className="p-2 -ml-2">
            {/* Hamburger icon */}
            <svg
              fill="currentColor"
              height="24"
              width="24"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
            </svg>
          </button>

          <h1 className="text-lg font-bold">Dashboard</h1>

          <button className="p-2 -mr-2">
            {/* Search icon */}
            <svg
              fill="currentColor"
              height="24"
              width="24"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex px-4 gap-4">
            <a
              href="#"
              className="flex flex-col items-center justify-center border-b-2 border-primary text-primary pb-3 pt-2"
            >
              <p className="text-sm font-semibold">Feed/Discussion</p>
            </a>
            <a
              href="#"
              className="flex flex-col items-center justify-center border-b-2 border-transparent text-neutral-500 dark:text-neutral-400 pb-3 pt-2"
            >
              <p className="text-sm font-semibold">Profile</p>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 space-y-6">
        {/* Trending */}
        <div className="flex items-center gap-4 rounded-lg bg-white dark:bg-neutral-800 p-4 shadow-sm">
          <div className="flex-1 space-y-1">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Trending</p>
            <h2 className="text-base font-bold text-neutral-800 dark:text-neutral-100">
              The Future of AI in Social Media
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Explore how AI is reshaping social media platforms.
            </p>
          </div>
          <div
            className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-lg flex-shrink-0"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBGT37bUTU28VXYprWz4aMZEhn10WDFl95BH5b9qXH3ChxkdGp4UGVtlV7vrEKr4hdpNLJVkspt6-DFuyM8PZBXqYi_ewwXpDS4l8ETO6q88-ye411k2IZa65Ne2MDpF8ppSuUi3OHh20R2AYELwiJ0BsLbpq1TFdMbUV_2qmyu0Au1jPLxunxJB9q8hr7v2jNOImMgZr1HhQxdfMTqHmfQPgB8eu2y_qTlDFtT1tSoHCbGz8lXHARDDegYBt5x3w22QdOt9gsppYgt")',
            }}
          ></div>
        </div>

        {/* Latest Posts */}
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 px-4">Latest Posts</h3>

        <div className="space-y-4">
          {/* Post example */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
            <div className="p-4 flex gap-4">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-0QiuKy5x9q0UHjAWdEk3t2bxEegvksZdkFGvoTo3gnWMo2HOsh52DU9g65mwc96ay-2tu1TygCx6rJYvQ4iRuG-z93Xirwf0oVanIHNe7EnVfjWxB-prtrRj3YTe6kvjjeOMfDgV-tlc_GRUP1TzIcunXTzHoc6S0RnVO_aNUSrXBuDukk02OP0MflexYc-YhjMDfHys9zieNInfW4My5q5my33kaDkeiZctQlEg1ayTEDZ-y3qVhuATTrbwAsjwbGCTXc0b0gsy"
                alt="Ethan Harper avatar"
                className="h-12 w-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-neutral-800 dark:text-neutral-100">Ethan Harper</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">2h ago</p>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                  Excited to share my latest project on sustainable living. Check it out! #sustainability #ecofriendly
                </p>
              </div>
            </div>
            <div className="flex justify-around border-t border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 text-sm font-medium">
              <button className="flex-1 flex items-center justify-center gap-2 p-3 hover:bg-primary/10">
                <span>23</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 p-3 hover:bg-primary/10">
                <span>12</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 p-3 hover:bg-primary/10">
                <span>5</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-background-light dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex justify-around items-start pt-2 pb-3">
          <a className="flex flex-col items-center justify-end gap-1 text-primary" href="#">Feed</a>
          <a className="flex flex-col items-center justify-end gap-1 text-neutral-500 dark:text-neutral-400" href="#">Profile</a>
          <a className="flex flex-col items-center justify-end gap-1 text-neutral-500 dark:text-neutral-400" href="#">Chat</a>
          <a className="flex flex-col items-center justify-end gap-1 text-neutral-500 dark:text-neutral-400" href="#">Notifications</a>
        </div>
      </footer>
    </div>
  );
}

