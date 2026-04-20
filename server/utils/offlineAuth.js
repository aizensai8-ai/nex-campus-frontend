import jwt from 'jsonwebtoken';

const OFFLINE_ADMIN_EMAIL = process.env.OFFLINE_ADMIN_EMAIL;
const OFFLINE_ADMIN_PASSWORD = process.env.OFFLINE_ADMIN_PASSWORD;
const OFFLINE_ADMIN_ID = process.env.OFFLINE_ADMIN_ID || '000000000000000000000001';

const buildOfflineAdminUser = () => ({
  _id: OFFLINE_ADMIN_ID,
  name: 'Admin',
  email: OFFLINE_ADMIN_EMAIL,
  role: 'admin',
  usn: '',
  semester: null,
  section: null,
  address: '',
  avatar: '',
  getSignedJwtToken() {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  },
});

export const isOfflineMongo = () => false;

export const createOfflineAdminUser = () => buildOfflineAdminUser();

export const getOfflineAdminUserByEmail = (email) => {
  if (!email || !OFFLINE_ADMIN_EMAIL) return null;
  if (email.toLowerCase() !== OFFLINE_ADMIN_EMAIL.toLowerCase()) return null;
  return buildOfflineAdminUser();
};

export const getOfflineAdminUserById = (id) => {
  if (id !== OFFLINE_ADMIN_ID) return null;
  return buildOfflineAdminUser();
};

export const isOfflineAdminPassword = (password) =>
  OFFLINE_ADMIN_PASSWORD ? password === OFFLINE_ADMIN_PASSWORD : false;
