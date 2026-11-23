export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Full name is required' });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, message: 'Email address is required' });
  }

  const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!gmailPattern.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid Gmail address ending with @gmail.com'
    });
  }

  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must contain at least 6 characters'
    });
  }

  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must contain at least one uppercase letter'
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, message: 'Email address is required' });
  }

  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  next();
};
