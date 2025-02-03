const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');

exports.register = async (req, res) => {
  
  const { fullname, email, password, phone, role, expiration_date ,Actif } = req.body;
  try {
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Validate expiration date if provided
    if (expiration_date && new Date(expiration_date) <= new Date()) {
      return res.status(400).json({ error: 'Expiration date must be in the future.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user object
    const user = new User({
      fullname,
      email,
      password: hashedPassword,
      phone,
      role,
      expiration_date,
      Actif
    });
    

    // Save the user to the database
    await user.save();

    // Create an email verification token
    const verificationToken = jwt.sign(
      { userId: user._id, status: user.status, expiration_date: user.expiration_date,emailVerifiedAt: user.emailVerifiedAt },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // The token will expire in 1 day
    );

    // Generate the verification link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // Set up the email transporter using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

    // Create the email content
    const verificationEmail = `
      <html>
        <body>
          <h2>Welcome to MyApp!</h2>
          <p>We are excited to have you on board. To complete your registration, please verify your email address by clicking the link below:</p>
          <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none;">Verify Your Email</a>
          <p>If you did not register for an account, please ignore this email.</p>
        </body>
      </html>
    `;

    // Send the email with the verification link
    await transporter.sendMail({
      from: `"MyApp Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: verificationEmail
    }
    
  );

    // Respond with a success message
    res.status(201).json({ message: 'User registered successfully. Please verify your email.' });

  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findByIdAndUpdate(userId, { emailVerifiedAt: new Date() }, { new: true });

    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Verification link expired. Please request a new one.' });
    }
    res.status(400).json({ error: 'Invalid token.' });
  }
};



  exports.resendVerificationEmail = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: 'User not found.' });
  
      if (user.emailVerifiedAt) {
        return res.status(400).json({ error: 'Email is already verified.' });
      }
  
      const verificationToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      const verificationLink = `${process.env.FRONTEND_URL}/api/auth/verify-email?token=${verificationToken}`;
      const verificationEmail = `
        <p>Hello ${user.fullname},</p>
        <p>Please verify your email using the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
      `;
  
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      await transporter.sendMail({
        from: `"Course" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Email Verification',
        html: verificationEmail,
      });
  
      res.status(200).json({ message: 'Verification email sent.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error.' });
    }
  };exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      // Check if the email is verified
      if (!user.emailVerifiedAt) {
        return res.status(403).json({ error: 'Please verify your email before logging in.' });
      }
  
      // Create JWT token with emailVerifiedAt added
      const token = jwt.sign(
        { 
          id: user._id, 
          role: user.role, 
          status: user.status, 
          Actif: user.Actif, 
          expiration_date: user.expiration_date,
          emailVerifiedAt: user.emailVerifiedAt // Add the emailVerifiedAt to the token payload
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      res.status(200).json({ 
        token, 
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          status: user.status,
          Actif: user.Actif,
          expiration_date: user.expiration_date,
          emailVerifiedAt: user.emailVerifiedAt // Include it in the user data response as well
        }
      });
  
    } catch (err) {
      console.error('Error during login:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  
  
  
  exports.AcceptedUser = async (req, res) => {
    try {
      // Ensure the Authorization header exists
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: 'Authorization token missing' });
      }
  
      // Extract the token from the "Bearer <token>" format
      const token = authHeader.split(' ')[1];  // This assumes the format is "Bearer <token>"
  
      // If the token is not present after the split, return an error
      if (!token) {
        return res.status(401).json({ message: 'Token missing' });
      }
  
      console.log('Received token:', token);  // Log the token to debug
  
      // Verify the token using your JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Decodes the JWT token
  
      console.log('Decoded token:', decoded);  // Log the decoded token for debugging
  
      // Get the user ID from the decoded token
      const loggedInUserId = decoded.id;
  
      // Fetch all users with status = 'accepted' excluding the logged-in user
      const users = await User.find({ 
        _id: { $ne: loggedInUserId },  // Exclude the logged-in user
        status: 'accepted'  // Only get users whose status is 'accepted'
      });
  
      // Return the users in the response
      res.status(200).json(users);  // Sends the list of users to the client
    } catch (error) {
      console.error('Error verifying token or fetching users:', error);
  
      // Handle invalid or expired token
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };


  exports.RejectedUser = async (req, res) => {
    try {
      // Ensure the Authorization header exists
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: 'Authorization token missing' });
      }
  
      // Extract the token from the "Bearer <token>" format
      const token = authHeader.split(' ')[1];  // This assumes the format is "Bearer <token>"
  
      // If the token is not present after the split, return an error
      if (!token) {
        return res.status(401).json({ message: 'Token missing' });
      }
  
      console.log('Received token:', token);  // Log the token to debug
  
      // Verify the token using your JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Decodes the JWT token
  
      console.log('Decoded token:', decoded);  // Log the decoded token for debugging
  
      // Get the user ID from the decoded token
      const loggedInUserId = decoded.id;
  
      // Fetch all users with status = 'rejected' excluding the logged-in user
      const users = await User.find({ 
        _id: { $ne: loggedInUserId },  // Exclude the logged-in user
        status: 'rejected'  // Only get users whose status is 'rejected'
      });
  
      // Return the users in the response
      res.status(200).json(users);  // Sends the list of rejected users to the client
    } catch (error) {
      console.error('Error verifying token or fetching users:', error);
  
      // Handle invalid or expired token
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
  exports.WaitingUser = async (req, res) => {
    try {
      // Ensure the Authorization header exists
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: 'Authorization token missing' });
      }
  
      // Extract the token from the "Bearer <token>" format
      const token = authHeader.split(' ')[1];  // This assumes the format is "Bearer <token>"
  
      // If the token is not present after the split, return an error
      if (!token) {
        return res.status(401).json({ message: 'Token missing' });
      }
  
      console.log('Received token:', token);  // Log the token to debug
  
      // Verify the token using your JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Decodes the JWT token
  
      console.log('Decoded token:', decoded);  // Log the decoded token for debugging
  
      // Get the user ID from the decoded token
      const loggedInUserId = decoded.id;
  
      // Fetch all users with status = 'waiting' excluding the logged-in user
      const users = await User.find({ 
        _id: { $ne: loggedInUserId },  // Exclude the logged-in user
        status: 'waiting'  // Only get users whose status is 'waiting'
      });
  
      // Return the users in the response
      res.status(200).json(users);  // Sends the list of waiting users to the client
    } catch (error) {
      console.error('Error verifying token or fetching users:', error);
  
      // Handle invalid or expired token
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
  
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailContent = `
      <html>
        <body>
          <h2>Forgot Your Password?</h2>
          <p>We received a request to reset your password. To reset your password, click the link below:</p>
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none;">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"MyApp" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: emailContent,
    });

    res.status(200).json({ message: 'Password reset link sent. Please check your email.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully. You can now log in with your new password.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

  
// controllers/authController.js
exports.updateUserByEmail = async (req, res) => {
  const { email } = req.params;
  const { fullname, phone, role, password, expiration_date, status,Actif } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (fullname) user.fullname = fullname;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (Actif) user.Actif = Actif;

    if (expiration_date && new Date(expiration_date) > new Date()) {
      user.expiration_date = expiration_date;
    }

    if (status) {
      const validStatuses = ['accepted', 'rejected', 'waiting'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value.' });
      }
      user.status = status;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Server error during user update' });
  }
};


exports.logoutUser = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure req.user.id is correctly populated
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.Actif = false; // Set user as inactive
    await user.save();

    res.status(200).json({ message: 'User successfully logged out' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Logout route in backend (Express)
exports.logoutUser = async (req, res) => {
  try {
    const userId = req.user.id;  // Assuming user data is added to req.user after token authentication

    // Find user by ID and set Actif to false
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.Actif = false; // Set Actif to false
    await user.save();

    res.status(200).json({ message: 'Logged out successfully, Actif set to false' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};
