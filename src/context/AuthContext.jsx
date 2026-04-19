import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const safeParse = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (_) {
    return null;
  }
};

const decodeJwtPayload = (token) => {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch (_) {
    return null;
  }
};

const readAuthStorage = () => {
  const localToken = localStorage.getItem(TOKEN_KEY);
  const sessionToken = sessionStorage.getItem(TOKEN_KEY);
  if (localToken) {
    return {
      rememberMe: true,
      token: localToken,
      user: safeParse(localStorage.getItem(USER_KEY)),
    };
  }
  if (sessionToken) {
    return {
      rememberMe: false,
      token: sessionToken,
      user: safeParse(sessionStorage.getItem(USER_KEY)),
    };
  }
  return { rememberMe: false, token: null, user: null };
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
};

const persistAuth = (token, user, rememberMe) => {
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    return;
  }

  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readAuthStorage());
  const { token: storedToken, user: storedUser, rememberMe } = session;
  const [user, setUser] = useState(storedUser);
  const [loading, setLoading] = useState(true);

  // Restore session on mount. If the backend is temporarily unavailable,
  // keep any cached user so an already signed-in session stays usable.
  useEffect(() => {
    if (!storedToken) {
      setLoading(false);
      return;
    }

    if (storedUser) {
      setUser(storedUser);
    }

    api.get('/api/auth/me')
      .then((res) => {
        const nextUser = res?.data;
        if (nextUser) {
          persistAuth(storedToken, nextUser, rememberMe);
          setSession({ token: storedToken, user: nextUser, rememberMe });
          setUser(nextUser);
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          clearToken();
          setUser(null);
          return;
        }

        // Keep the cached session alive on temporary backend issues.
        if (!storedUser) {
          const claims = decodeJwtPayload(storedToken) || {};
          setUser({
            id: claims.id || 'pending',
            name: claims.role === 'admin' ? 'Sai' : 'Signed in user',
            email: '',
            role: claims.role || 'student',
            usn: '',
            semester: null,
            section: null,
            address: '',
            avatar: '',
          });
        }
      })
      .finally(() => setLoading(false));
  }, [rememberMe, storedToken]);

  // /api/auth/login returns { success, token, user } — no `data` key → NOT unwrapped
  const login = useCallback(async (email, password, rememberMe = false) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { token, user } = res.data;
    persistAuth(token, user, rememberMe);
    setSession({ token, user, rememberMe });
    setUser(user);
    return user;
  }, []);

  // /api/auth/register same shape
  const register = useCallback(async (data, rememberMe = false) => {
    const res = await api.post('/api/auth/register', data);
    const { token, user } = res.data;
    persistAuth(token, user, rememberMe);
    setSession({ token, user, rememberMe });
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setSession({ token: null, user: null, rememberMe: false });
    setUser(null);
  }, []);

  // Merge partial updates into the stored user (e.g. after profile save)
  const updateUser = useCallback((updates) => {
    setUser((prev) => prev ? { ...prev, ...updates } : prev);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
