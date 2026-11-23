import mongoose from 'mongoose';

const loginSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.Mixed, default: null },
    userEmail: { type: String, required: true },
    userName: { type: String, default: '' },
    action: { type: String, enum: ['LOGIN', 'SIGNUP', 'LOGOUT'], default: 'LOGIN' },
    status: { type: String, enum: ['SUCCESS', 'FAILED'], default: 'SUCCESS' },
    ipAddress: { type: String, default: '127.0.0.1' },
    userAgent: { type: String, default: 'Web Browser' },
    loginTime: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    collection: 'logins'
  }
);

const Login = mongoose.model('Login', loginSchema);
export default Login;
