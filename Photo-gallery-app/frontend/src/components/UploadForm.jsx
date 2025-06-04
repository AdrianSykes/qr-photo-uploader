[span_77](start_span)import { useState } from ‘react’;[span_77](end_span)
[span_78](start_span)import axios from ‘axios’;[span_78](end_span)

[span_79](start_span)export default function UploadForm() {[span_79](end_span)
  [span_80](start_span)const [file, setFile] = useState(null);[span_80](end_span)
  [span_81](start_span)const [progress, setProgress] = useState(0);[span_81](end_span)

  [span_82](start_span)const handleSubmit = async (e) => {[span_82](end_span)
    [span_83](start_span)e.preventDefault();[span_83](end_span)
    [span_84](start_span)if (!file) return;[span_84](end_span)

    [span_85](start_span)const formData = new FormData();[span_85](end_span)
    [span_86](start_span)formData.append(‘image’, file);[span_86](end_span)

    Try {
      [span_87](start_span)await axios.post(‘/api/images/upload’, formData, {[span_87](end_span)
        Headers: {
          ‘Content-Type’: ‘multipart/form-data’,
          ‘Authorization’: `Bearer ${localStorage.getItem(‘token’)}`
        },
        onUploadProgress: (progressEvent) => {
          setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
        }
      });
      [span_88](start_span)alert(‘Upload successful!’);[span_88](end_span)
      [span_89](start_span)setFile(null);[span_89](end_span)
      [span_90](start_span)setProgress(0);[span_90](end_span)
    } catch (err) {
      [span_91](start_span)alert(‘Upload failed: ‘ + err.response?.data?.error || err.message);[span_91](end_span)
    }
  };

  [span_92](start_span)return ([span_92](end_span)
    <form onSubmit={handleSubmit}>
      <input
        Type=”file”
        onChange={(e) => setFile(e.target.files[0])}
        accept=”image/*”
      />
      <button type=”submit”>Upload</button>
      {progress > 0 && <progress value={progress} max=”100” />}
    </form>
  );
[span_93](start_span)}

