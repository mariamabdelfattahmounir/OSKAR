import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const DEMO_USERS = {
  'researcher.oskar@gmail.com': {
    id: 'usr_researcher_01',
    name: 'Dr. Sarah Med',
    email: 'researcher.oskar@gmail.com',
    role: 'researcher',
    title: 'Lead Principal Investigator',
    institution: 'Harvard Medical School',
    defaultRoute: '/researcher/dashboard',
  },
  'reviewer.oskar@gmail.com': {
    id: 'usr_reviewer_01',
    name: 'Prof. Alex Reviewer',
    email: 'reviewer.oskar@gmail.com',
    role: 'reviewer',
    title: 'Senior Ethics Committee Reviewer',
    institution: 'National IRB Board',
    defaultRoute: '/reviewer/dashboard',
  },
  'supervisor.oskar@gmail.com': {
    id: 'usr_supervisor_01',
    name: 'Dr. Marcus Lead',
    email: 'supervisor.oskar@gmail.com',
    role: 'supervisor',
    title: 'Department Head & Supervisor',
    institution: 'Johns Hopkins Medicine',
    defaultRoute: '/supervisor/dashboard',
  },
  'institution.oskar@gmail.com': {
    id: 'usr_institution_01',
    name: 'St. Jude Research Admin',
    email: 'institution.oskar@gmail.com',
    role: 'institution',
    title: 'Institutional Officer',
    institution: 'St. Jude Children Research Hospital',
    defaultRoute: '/institution/dashboard',
  },
  'admin.oskar@gmail.com': {
    id: 'usr_admin_01',
    name: 'System Admin',
    email: 'admin.oskar@gmail.com',
    role: 'admin',
    title: 'Super Administrator',
    institution: 'OSKAR Global Platform',
    defaultRoute: '/admin/dashboard',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('oskar_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return DEMO_USERS['researcher.oskar@gmail.com'];
  });

  const login = (email) => {
    const foundUser = DEMO_USERS[email.toLowerCase().trim()];
    const userToSet = foundUser || {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: 'researcher',
      title: 'Clinical Researcher',
      institution: 'Independent Research',
      defaultRoute: '/researcher/dashboard',
    };
    setUser(userToSet);
    try {
      localStorage.setItem('oskar_session', JSON.stringify(userToSet));
    } catch (e) {}
    return { success: true, user: userToSet };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('oskar_session');
    } catch (e) {}
  };

  const value = {
    user,
    isAuthenticated: !!user,
    role: user?.role || null,
    login,
    logout,
    demoUsers: DEMO_USERS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
