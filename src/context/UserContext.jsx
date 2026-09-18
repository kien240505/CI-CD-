import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

// --- Standalone mock users storage (for offline mode) ---
let localUsers = [
  {
    id: 1,
    fullname: "Nguyễn Văn Demo",
    email: "demo@technova.com",
    password: "demo123",
    phone: "0987 000 111",
    avatar: "https://i.pravatar.cc/150?img=11"
  }
];

const userApiLogin = async (email, password) => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Đăng nhập thất bại');
    return data;
  } catch (err) {
    // Offline fallback
    const found = localUsers.find(u => u.email === email && u.password === password);
    if (found) {
      return {
        success: true,
        user: { id: found.id, fullname: found.fullname, email: found.email, phone: found.phone, avatar: found.avatar },
        message: `Chào mừng trở lại, ${found.fullname}!`
      };
    }
    throw new Error('Email hoặc mật khẩu không chính xác!');
  }
};

const userApiRegister = async ({ fullname, email, phone, password }) => {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullname, email, phone, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Đăng ký thất bại');
    return data;
  } catch (err) {
    // Offline fallback
    const exists = localUsers.find(u => u.email === email);
    if (exists) throw new Error('Email này đã được đăng ký!');
    if (password.length < 6) throw new Error('Mật khẩu phải có ít nhất 6 ký tự!');
    const newUser = {
      id: Date.now(),
      fullname,
      email,
      phone: phone || '',
      password,
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`
    };
    localUsers.push(newUser);
    return {
      success: true,
      user: { id: newUser.id, fullname: newUser.fullname, email: newUser.email, phone: newUser.phone, avatar: newUser.avatar },
      message: `Đăng ký thành công! Chào mừng ${fullname} đến với TechNova!`
    };
  }
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('technova_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('technova_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('technova_user');
    }
  }, [currentUser]);

  const login = async (email, password) => {
    const res = await userApiLogin(email, password);
    setCurrentUser(res.user);
    return res;
  };

  const register = async (formData) => {
    const res = await userApiRegister(formData);
    setCurrentUser(res.user);
    return res;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      isAuthOpen,
      setIsAuthOpen,
      authMode,
      setAuthMode,
      login,
      register,
      logout,
      openAuth
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
