[span_227](start_span)import { useState, useEffect, useContext } from ‘react’;[span_227](end_span)
[span_228](start_span)import { AuthContext } from ‘../context/AuthContext’;[span_228](end_span)
[span_229](start_span)import axios from ‘axios’;[span_229](end_span)
Import Lightbox from ‘react-image-lightbox’; [span_230](start_span)// Corrected Import to import[span_230](end_span)
[span_231](start_span)import ‘react-image-lightbox/style.css’;[span_231](end_span)
Import ‘../styles/gallery.css’; [span_232](start_span)// Corrected Import to import[span_232](end_span)

[span_233](start_span)export default function Gallery() {[span_233](end_span)
  [span_234](start_span)const { user } = useContext(AuthContext);[span_234](end_span)
  [span_235](start_span)const [images, setImages] = useState([]);[span_235](end_span)
  [span_236](start_span)const [loading, setLoading] = useState(true);[span_236](end_span)
  [span_237](start_span)const [selected, setSelected] = useState([]);[span_237](end_span)
  [span_238](start_span)const [lightboxIndex, setLightboxIndex] = useState(-1);[span_238](end_span)

  [span_239](start_span)// Fetch images[span_239](end_span)
  [span_240](start_span)useEffect(() => {[span_240](end_span)
    Const fetchImages = async () => {
      Try {
        [span_241](start_span)const res = await axios.get(‘/api/images’, {[span_241](end_span)
          Headers: {
            Authorization: `Bearer ${localStorage.getItem(‘token’)}`
          }
        });
        [span_242](start_span)setImages(res.data);[span_242](end_span)
      } catch (err) {
        [span_243](start_span)console.error(‘Failed to fetch images:’, err);[span_243](end_span) // Corrected Console.error to console.error
      } finally {
        [span_244](start_span)setLoading(false);[span_244](end_span)
      }
    };
    If (user) fetchImages(); [span_245](start_span)// Corrected If to if[span_245](end_span)
  }, [user]);

  [span_246](start_span)// Toggle image selection[span_246](end_span)
  [span_247](start_span)const toggleSelect = (id) => {[span_247](end_span)
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(imgId => imgId !== id)
        : [...prev, id]
    );
  [span_248](start_span)};[span_248](end_span)

  [span_249](start_span)// Download selected images[span_249](end_span)
  [span_250](start_span)const downloadSelected = async () => {[span_250](end_span)
    Try {
      [span_251](start_span)const res = await axios.post(‘/api/images/download’, { ids: selected }, {[span_251](end_span)
        [span_252](start_span)responseType: ‘blob’,[span_252](end_span)
        [span_253](start_span)headers: { Authorization: `Bearer ${localStorage.getItem(‘token’)}` }[span_253](end_span)
      });
      [span_254](start_span)const url = window.URL.createObjectURL(new Blob([res.data]));[span_254](end_span)
      [span_255](start_span)const link = document.createElement(‘a’);[span_255](end_span)
      [span_256](start_span)link.href = url;[span_256](end_span)
      [span_257](start_span)link.setAttribute(‘download’, `photos-${new Date().toISOString()}.zip`);[span_257](end_span)
      [span_258](start_span)document.body.appendChild(link);[span_258](end_span)
      [span_259](start_span)link.click();[span_259](end_span)
      [span_260](start_span)link.remove();[span_260](end_span)
    } catch (err) {
      [span_261](start_span)alert(‘Download failed: ‘ + err.response?.data?.error);[span_261](end_span)
    }
  };

  [span_262](start_span)if (loading) return <div className=”loading-spinner”>Loading...</div>;[span_262](end_span) // Corrected If to if

  [span_263](start_span)return ([span_263](end_span)
    <div className=”gallery-container”>
      <div className=”gallery-header”>
        <h2>Your Photo Gallery ({images.length}/35)</h2>
        {selected.length > 0 && (
          <button onClick={downloadSelected} className=”download-btn”>
            Download Selected ({selected.length})
          </button>
        )}
      </div>

      {images.length === 0 ? [span_264](start_span)(
        <p className=”empty-gallery”>No photos yet. Upload your first image!</p>
      ) : (
        <div className=”image-grid”>
          {images.map((image, index) => (
            <div
              Key={image._id}
              className={`gallery-item ${selected.includes(image._id) ? ‘selected’ : ‘’}`}[span_264](end_span)
              [span_265](start_span)onClick={() => setLightboxIndex(index)}[span_265](end_span)
            >
              <div
                [span_266](start_span)className=”select-checkbox”[span_266](end_span)
                onClick={(e) => {
                  [span_267](start_span)e.stopPropagation();[span_267](end_span)
                  [span_268](start_span)toggleSelect(image._id);[span_268](end_span)
                }}
              >
                {selected.includes(image._id) ? [span_269](start_span)’✓’ : ‘’}[span_269](end_span)
              </div>
              <img
                [span_270](start_span)[span_271](start_span)src={image.url}[span_270](end_span)[span_271](end_span) // Corrected Src to src
                [span_272](start_span)alt={`Uploaded by ${user.email}`}[span_272](end_span)
                [span_273](start_span)[span_274](start_span)loading=”lazy”[span_273](end_span)[span_274](end_span) // Corrected Loading to loading
              />
              [span_275](start_span)<div className=”image-meta”>[span_275](end_span)
                [span_276](start_span)<span>{formatFileSize(image.size)}</span>[span_276](end_span)
                [span_277](start_span)<span>{new Date(image.uploadedAt).toLocaleDateString()}</span>[span_277](end_span)
              </div>
            </div>
          ))}
        </div>
      )}

      [span_278](start_span){/* Lightbox */}[span_278](end_span)
      [span_279](start_span){lightboxIndex >= 0 && ([span_279](end_span)
        <Lightbox
          [span_280](start_span)mainSrc={images[lightboxIndex]?.url}[span_280](end_span)
          [span_281](start_span)nextSrc={images[(lightboxIndex + 1) % images.length]?.url}[span_281](end_span)
          [span_282](start_span)prevSrc={images[(lightboxIndex + images.length – 1) % images.length]?.url}[span_282](end_span) // Corrected – to –
          [span_283](start_span)onCloseRequest={() => setLightboxIndex(-1)}[span_283](end_span)
          [span_284](start_span)onMovePrevRequest={() => setLightboxIndex((lightboxIndex + images.length – 1) % images.length)}[span_284](end_span) // Corrected – to –
          [span_285](start_span)onMoveNextRequest={() => setLightboxIndex((lightboxIndex + 1) % images.length)}[span_285](end_span)
          [span_286](start_span)enableZoom={true}[span_286](end_span)
          [span_287](start_span)clickOutsideToClose={true}[span_287](end_span)
        />
      )}
    </div>
  );
[span_288](start_span)}

// Helper function to format file size[span_288](end_span)
[span_289](start_span)function formatFileSize(bytes) {[span_289](end_span)
  [span_290](start_span)if (bytes < 1024) return `${bytes} B`;[span_290](end_span) // Corrected If to if
  [span_291](start_span)if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;[span_291](end_span) // Corrected If to if
  [span_292](start_span)return `${(bytes / 1048576).toFixed(1)} MB`;[span_292](end_span) // Corrected Return to return
}

