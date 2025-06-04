[span_151](start_span)import { useState, useContext } from ‘react’;[span_151](end_span)
[span_152](start_span)import { AuthContext } from ‘../context/AuthContext’;[span_152](end_span)
[span_153](start_span)import { useNavigate } from ‘react-router-dom’;[span_153](end_span)

[span_154](start_span)export default function Login() {[span_154](end_span)
  [span_155](start_span)const [email, setEmail] = useState(‘’);[span_155](end_span)
  [span_156](start_span)const [password, setPassword] = useState(‘’);[span_156](end_span)
  [span_157](start_span)const [error, setError] = useState(‘’);[span_157](end_span)
  [span_158](start_span)const { login } = useContext(AuthContext);[span_158](end_span)
  [span_159](start_span)const navigate = useNavigate();[span_159](end_span)

  [span_160](start_span)const handleSubmit = async (e) => {[span_160](end_span)
    [span_161](start_span)e.preventDefault();[span_161](end_span)
    [span_162](start_span)try {[span_162](end_span)
      [span_163](start_span)await login(email, password);[span_163](end_span)
      [span_164](start_span)navigate(‘/’);[span_164](end_span)
    [span_165](start_span)} catch (err) {[span_165](end_span)
      [span_166](start_span)setError(‘Invalid credentials’);[span_166](end_span)
    }
  };

  [span_167](start_span)return ([span_167](end_span)
    <div className=”login-form”>
      <h2>Login</h2>
      {error && <p className=”error”>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          Type=”email”
          Placeholder=”Email”
          Value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          Type=”password”
          Placeholder=”Password”
          Value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type=”submit”>Login</button>
      </form>
    </div>
  );
[span_168](start_span)}

