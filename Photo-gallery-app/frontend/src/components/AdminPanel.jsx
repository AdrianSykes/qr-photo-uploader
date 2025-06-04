[span_184](start_span)import { useState, useEffect } from ‘react’;[span_184](end_span)
[span_185](start_span)import axios from ‘axios’;[span_185](end_span)

[span_186](start_span)export default function AdminPanel() {[span_186](end_span)
  [span_187](start_span)const [images, setImages] = useState([]);[span_187](end_span)
  [span_188](start_span)const [loading, setLoading] = useState(true);[span_188](end_span)

  [span_189](start_span)useEffect(() => {[span_189](end_span)
    Const fetchImages = async () => {
      Try {
        [span_190](start_span)const res = await axios.get(‘/api/admin/images’, {[span_190](end_span)
          Headers: {
            Authorization: `Bearer ${localStorage.getItem(‘token’)}`
          }
        });
        [span_191](start_span)setImages(res.data);[span_191](end_span)
      } catch (err) {
        [span_192](start_span)console.error(err);[span_192](end_span) // Corrected Console.error to console.error
      } finally {
        [span_193](start_span)setLoading(false);[span_193](end_span)
      }
    };
    fetchImages();
  [span_194](start_span)}, []);[span_194](end_span)

  [span_195](start_span)const handleDelete = async (id) => {[span_195](end_span)
    [span_196](start_span)if (!window.confirm(‘Delete this image permanently?’)) return;[span_196](end_span)
    [span_197](start_span)try {[span_197](end_span)
      [span_198](start_span)await axios.delete(`/api/admin/images/${id}`, {[span_198](end_span)
        Headers: {
          Authorization: `Bearer ${localStorage.getItem(‘token’)}`
        }
      });
      [span_199](start_span)setImages(images.filter(img => img._id !== id));[span_199](end_span)
    } catch (err) {
      [span_200](start_span)alert(‘Deletion failed: ‘ + err.response?.data?.error);[span_200](end_span)
    }
  };

  [span_201](start_span)if (loading) return <div>Loading...</div>;[span_201](end_span)

  [span_202](start_span)return ([span_202](end_span)
    <div className=”admin-gallery”>
      <h2>Admin Dashboard</h2>
      <div className=”image-grid”>
        {images.map(image => (
          <div key={image._id} className=”image-card”>
            <img src={image.url} alt={image.filename} />
            <button
              onClick={() => handleDelete(image._id)}
              [span_203](start_span)className=”delete-btn”[span_203](end_span)
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
[span_204](start_span)}

