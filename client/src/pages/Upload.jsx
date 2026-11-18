
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    if (!photo) {
      return setError("Choose an image first.");
    }

    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("photo", photo);

    setBusy(true);
    setError("");

    try {
      const result = await api.post("/photos", data);
      navigate(`/photos/${result.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="form-page card">
      <p className="eyebrow">SHARE WITH THE COMMUNITY</p>

      <h1>Upload a Photo</h1>

      <p className="muted">
        Add a photo and tell others a little about this moment.
      </p>

      <form onSubmit={submit}>
        <label>
          Photo title

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter photo title"
            required
            maxLength="100"
          />
        </label>

        <label>
          Description

          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Write something about your photo..."
            maxLength="1000"
            rows="4"
          />
        </label>

        <label>
          Choose image

          <input
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            onChange={e => setPhoto(e.target.files[0])}
            required
          />
        </label>

        <p className="muted">
          JPG, PNG, GIF or WEBP · Maximum 5 MB
        </p>

        {error && <p className="error">{error}</p>}

        <button disabled={busy}>
          {busy ? "Uploading..." : "Upload Photo"}
        </button>
      </form>
    </section>
  );
}
