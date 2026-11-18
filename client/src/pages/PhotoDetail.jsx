
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { imageUrl } from "../api";
import { useAuth } from "../context/AuthContext";

export default function PhotoDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/photos/${id}`)
      .then(r => {
        setItem(r.data.photo);
        setComments(r.data.comments);
      })
      .catch(e => setError(e.response?.data?.message || "Could not load photo."));
  }, [id]);

  async function addComment(e) {
    e.preventDefault();
    setError("");

    try {
      const r = await api.post(`/photos/${id}/comments`, { comment });
      setComments([...comments, r.data]);
      setComment("");
    } catch (e) {
      setError(e.response?.data?.message || "Could not add comment.");
    }
  }

  async function remove() {
    if (!confirm("Delete this photo permanently?")) return;

    try {
      await api.delete(`/photos/${id}`);
      navigate("/");
    } catch (e) {
      setError(e.response?.data?.message || "Delete failed.");
    }
  }

  if (error && !item) return <p className="error">{error}</p>;
  if (!item) return <p>Loading photo...</p>;

  const isOwner = user && (
    user.id === item.userId?._id || user.id === item.userId
  );

  return (
    <div className="detail">
      <section>
        <img
          className="detail-image"
          src={imageUrl(item.fileName)}
          alt={item.title}
        />

        <div className="detail-heading">
          <div>
            <h1>{item.title}</h1>

            <p className="muted">
              Shared by {item.userId?.firstName} {item.userId?.lastName}
            </p>

            <p>{item.description}</p>
          </div>

          {isOwner && (
            <button className="danger" onClick={remove}>
              Delete photo
            </button>
          )}
        </div>
      </section>

      <aside className="comments card">
        <h2>Comments ({comments.length})</h2>

        {comments.map(c => (
          <div className="comment" key={c._id}>
            <strong>
              {c.userId?.firstName} {c.userId?.lastName}
            </strong>

            <p>{c.comment}</p>
          </div>
        ))}

        {user ? (
          <form onSubmit={addComment}>
            <textarea
              rows="3"
              placeholder="Write a comment..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
            />

            <button>Add comment</button>
          </form>
        ) : (
          <p className="muted">Please login to comment.</p>
        )}

        {error && <p className="error">{error}</p>}
      </aside>
    </div>
  );
}
