import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { imageUrl } from "../api";
export default function Home() {
  const [photos, setPhotos] = useState([]); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/photos").then(r => setPhotos(r.data)).catch(() => setError("Could not load photos. Check that the server is running.")).finally(() => setLoading(false)); }, []);
  if (loading) return <p>Loading gallery...</p>;
  return <><div className="hero"><div><p className="eyebrow">YOUR MOMENTS, YOUR STORY</p><h1>Every picture holds a memory.</h1><p className="muted">Discover and share moments with your community.</p></div></div>
    {error && <p className="error">{error}</p>}{!photos.length && !error ? <div className="empty card"><h2>No photos yet</h2><p>Log in and upload the first memory.</p></div> :
    <div className="gallery">{photos.map(photo => <Link className="photo-card" to={`/photos/${photo._id}`} key={photo._id}>
      <img src={imageUrl(photo.fileName)} alt={photo.title}/><div className="photo-info"><h3>{photo.title}</h3><p>{photo.userId?.firstName} {photo.userId?.lastName}</p></div>
    </Link>)}</div>}</>;
}
