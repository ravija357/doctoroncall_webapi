// import express from 'express';

// const router = express.Router();

// // TEMP endpoints for Sprint 2 demo
// router.post('/register', (req, res) => {
//   const { email, password } = req.body;
  
//   if (!email || !password) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Email and password required',
//       validation: true 
//     });
//   }
  
//   if (password.length < 6) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Password must be 6+ characters (DTO validation)',
//       validation: true 
//     });
//   }
  
//   res.status(201).json({ 
//     success: true,
//     message: 'User registered (role: user)',
//     data: { 
//       user: { email, role: 'user' }, 
//       token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-token' 
//     }
//   });
// });

// router.post('/login', (req, res) => {
//   const { email, password } = req.body;
  
//   if (!email || !password) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Email and password required',
//       validation: true 
//     });
//   }
  
//   res.json({ 
//     success: true,
//     message: 'Login successful',
//     data: { 
//       user: { email, role: 'user' }, 
//       token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-token' 
//     }
//   });
// });

// export default router;



import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;
