// ============================================
// REACT ROUTER v6 — ROUTING & NAVIGATION
// ============================================
// Install: npm install react-router-dom
// Docs: https://reactrouter.com

// ---- 1. BASIC SETUP ----

const basicSetup = `
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      {/* Navigation */}
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      {/* Route Definitions */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />  {/* 404 catch-all */}
      </Routes>
    </BrowserRouter>
  );
}

function Home() { return <h1>Home Page</h1>; }
function About() { return <h1>About Page</h1>; }
function Contact() { return <h1>Contact Page</h1>; }
function NotFound() { return <h1>404 — Page Not Found</h1>; }
`;

// ---- 2. LINK vs NAVLINK ----

const linkVsNavLink = `
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      {/* Link: basic navigation (no active styling) */}
      <Link to="/">Home</Link>

      {/* NavLink: adds 'active' class when route matches */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) => isActive ? 'nav-active' : ''}
        style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
      >
        Dashboard
      </NavLink>

      {/* end prop: only active on exact match */}
      <NavLink to="/products" end>Products</NavLink>
    </nav>
  );
}
`;

// ---- 3. DYNAMIC ROUTES & useParams ----

const dynamicRoutes = `
import { Routes, Route, useParams, Link } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/users" element={<UserList />} />
      <Route path="/users/:userId" element={<UserProfile />} />
      <Route path="/posts/:postId/comments/:commentId" element={<Comment />} />
    </Routes>
  );
}

// ===== useParams: access route parameters =====
function UserProfile() {
  const { userId } = useParams();
  // userId is a string, convert if needed: Number(userId)

  return <h1>User Profile: {userId}</h1>;
}

function Comment() {
  const { postId, commentId } = useParams();
  return <p>Post {postId}, Comment {commentId}</p>;
}

function UserList() {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          <Link to={\`/users/\${user.id}\`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  );
}
`;

// ---- 4. useNavigate (Programmatic Navigation) ----

const useNavigateExample = `
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);

    if (success) {
      navigate('/dashboard');           // go to path
      // navigate('/dashboard', { replace: true }); // replace history entry
      // navigate(-1);                  // go back
      // navigate(-2);                  // go back 2 pages
      // navigate(1);                   // go forward
    }
  };

  // Pass state to destination
  const goToCheckout = () => {
    navigate('/checkout', {
      state: { from: '/cart', items: cartItems }
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

// Access navigation state at destination
import { useLocation } from 'react-router-dom';

function Checkout() {
  const location = useLocation();
  const { from, items } = location.state || {};
  return <p>Came from: {from}</p>;
}
`;

// ---- 5. useSearchParams (Query Strings) ----

const searchParamsExample = `
import { useSearchParams } from 'react-router-dom';

// URL: /products?category=electronics&sort=price&page=2
function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category');   // 'electronics'
  const sort = searchParams.get('sort');            // 'price'
  const page = Number(searchParams.get('page')) || 1;

  const updateCategory = (cat) => {
    setSearchParams(prev => {
      prev.set('category', cat);
      prev.set('page', '1');  // reset page
      return prev;
    });
  };

  const clearFilters = () => {
    setSearchParams({});  // removes all params
  };

  return (
    <div>
      <p>Category: {category}, Sort: {sort}, Page: {page}</p>
      <button onClick={() => updateCategory('books')}>Books</button>
      <button onClick={clearFilters}>Clear</button>
    </div>
  );
}
`;

// ---- 6. NESTED ROUTES & Outlet ----

const nestedRoutes = `
import { Routes, Route, Outlet, Link } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        {/* index = default child route */}
        <Route index element={<DashboardHome />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="users/:id" element={<UserDetail />} />
      </Route>
    </Routes>
  );
}

// Parent layout renders <Outlet> where child routes appear
function DashboardLayout() {
  return (
    <div className="dashboard">
      <aside>
        <nav>
          <Link to="/dashboard">Overview</Link>
          <Link to="/dashboard/analytics">Analytics</Link>
          <Link to="/dashboard/settings">Settings</Link>
        </nav>
      </aside>
      <main>
        <Outlet />  {/* Child route renders here */}
      </main>
    </div>
  );
}

function DashboardHome() { return <h2>Dashboard Overview</h2>; }
function Analytics() { return <h2>Analytics</h2>; }
function Settings() { return <h2>Settings</h2>; }
`;

// ---- 7. PROTECTED ROUTES ----

const protectedRoutes = `
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Auth context (simplified)
function useAuth() {
  // In real app, from AuthContext
  return { user: null, isAuthenticated: false };
}

// ===== Protected Route Wrapper =====
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, save attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children || <Outlet />;
}

// ===== Role-Based Route =====
function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/unauthorized" replace />;

  return children || <Outlet />;
}

// ===== Usage in Routes =====
function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/users" element={<ManageUsers />} />
      </Route>
    </Routes>
  );
}

// Redirect back after login
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async () => {
    await login(credentials);
    navigate(from, { replace: true });  // go to originally requested page
  };
}
`;

// ---- 8. LAZY LOADING ROUTES ----

const lazyLoading = `
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load route components (code splitting)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Analytics = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}

// Each lazy-loaded component is a separate JS bundle
// Only downloaded when the route is visited
// Reduces initial bundle size significantly
`;

// ---- 9. useLocation ----

const useLocationExample = `
import { useLocation } from 'react-router-dom';

function BreadCrumbs() {
  const location = useLocation();
  // location.pathname  → '/dashboard/settings'
  // location.search    → '?tab=profile'
  // location.hash      → '#section-2'
  // location.state     → { from: '/login' }
  // location.key       → unique key for this entry

  const crumbs = location.pathname.split('/').filter(Boolean);
  return (
    <nav>
      {crumbs.map((crumb, i) => (
        <span key={i}> / {crumb}</span>
      ))}
    </nav>
  );
}

// Track page views
function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    analytics.pageView(location.pathname);
  }, [location]);

  return null;
}
`;

// ---- SUMMARY ----
console.log("=== React Router v6 Summary ===");
console.log(`
  Core Components:
    <BrowserRouter>  — Wraps app, enables routing
    <Routes>         — Container for Route definitions
    <Route>          — Maps path to component
    <Link>           — Navigation (no page reload)
    <NavLink>        — Link with active state styling
    <Navigate>       — Redirect component
    <Outlet>         — Renders child routes (nested routing)

  Hooks:
    useParams()       — Access route parameters (:id)
    useNavigate()     — Programmatic navigation
    useSearchParams() — Read/write query strings
    useLocation()     — Current location object

  Patterns:
    Nested routes     — Layout + <Outlet>
    Protected routes  — Auth check wrapper
    Lazy loading      — React.lazy + Suspense
    404 handling      — path="*" catch-all
`);
