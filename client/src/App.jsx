import { Link, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import PhotoDetail from "./pages/PhotoDetail";
import Upload from "./pages/Upload";

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}
export default function App() {
  const { user, logout } = useAuth();
  return <>
    <header className="topbar"><Link className="brand" to="/">Alzikrayat</Link>
      <nav><Link to="/">Gallery</Link>{user && <Link to="/upload">Upload</Link>}
      {user ? <><span className="welcome">Hi {user.firstName}</span><button className="small" onClick={logout}>Logout</button></> :
      <Link to="/login">Please Login</Link>}</nav>
    </header>
    <main className="container"><Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={user ? <Navigate to="/"/> : <Auth/>}/>
      <Route path="/upload" element={<Protected><Upload/></Protected>}/>
      <Route path="/photos/:id" element={<PhotoDetail/>}/>
      <Route path="*" element={<h2>Page not found</h2>}/>
    </Routes></main>
    <footer>Alzikrayat · Photo Sharing Application · Project 4</footer>
  </>;
  
}
