import jwt from 'jsonwebtoken';

export const OFFLINE_ADMIN_EMAIL = 'jinkazamaxui@gmail.com';
export const OFFLINE_ADMIN_PASSWORD = 'sai@7860';
export const OFFLINE_ADMIN_ID = '000000000000000000000001';

const buildOfflineAdminUser = () => ({
  _id: OFFLINE_ADMIN_ID,
  name: 'Sai',
  email: OFFLINE_ADMIN_EMAIL,
  role: 'admin',
  usn: '1ck24cs104',
  semester: 4,
  section: '4C',
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
  if (!email) return null;
  if (email.toLowerCase() !== OFFLINE_ADMIN_EMAIL) return null;
  return buildOfflineAdminUser();
};

export const getOfflineAdminUserById = (id) => {
  if (id !== OFFLINE_ADMIN_ID) return null;
  return buildOfflineAdminUser();
};

export const isOfflineAdminPassword = (password) => password === OFFLINE_ADMIN_PASSWORD;
