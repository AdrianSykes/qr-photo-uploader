[span_126](start_span)import { createContext, useState, useEffect } from ‘react’;[span_126](end_span)
[span_127](start_span)import axios from ‘axios’;[span_127](end_span)

[span_128](start_span)export const AuthContext = createContext();[span_128](end_span)

[span_129](start_span)export const AuthProvider = ({ children }) => {[span_129](end_span)
  [span_130](start_span)const [user, setUser] = useState(null);[span_130](end_span)
  [span_131](start_span)const [loading, setLoading] = useState(true);[span_131](end_span)

  useEffect(() => {
    checkAuth();
  [span_132](start_span)}, []);[span_132](end_span)

  [span_133](start_span)const checkAuth = async () => {[span_133](end_span)
    Try {
      [span_134](start_span)const token = localStorage.getItem(‘token’);[span_134](end_span)
      [span_135](start_span)if (!token) throw new Error();[span_135](end_span)

      [span_136](start_span)const res = await axios.get(‘/api/auth/me’, {[span_136](end_span)
        [span_137](start_span)headers: { Authorization: `Bearer ${token}` }[span_137](end_span)
      });
      [span_138](start_span)setUser(res.data);[span_138](end_span)
    } catch (err) {
      setUser(null);
    } finally {
      [span_139](start_span)setLoading(false);[span_139](end_span)
    }
  };

  [span_140](start_span)const login = async (email, password) => {[span_140](end_span)
    [span_141](start_span)const res = await axios.post(‘/api/auth/login’, { email, password });[span_141](end_span)
    [span_142](start_span)localStorage.setItem(‘token’, res.data.token);[span_142](end_span)
    [span_143](start_span)setUser(res.data.user);[span_143](end_span)
  };

  [span_144](start_span)const logout = () => {[span_144](end_span)
    [span_145](start_span)localStorage.removeItem(‘token’);[span_145](end_span)
    [span_146](start_span)setUser(null);[span_146](end_span)
  };

  [span_147](start_span)return ([span_147](end_span)
    [span_148](start_span)<AuthContext.Provider value={{ user, loading, login, logout }}>[span_148](end_span)
      {children}
    </AuthContext.Provider>
  );
[span_149](start_span)};[span_149](end_span)

