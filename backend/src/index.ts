// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const PORT = Number(process.env.PORT) || 3001;

// app.use(cors({ origin: 'http://localhost:3000' }));
// app.use(express.json({ limit: '10mb' }));

// mongoose.connect(process.env.MONGO_URI!)
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch((err) => console.error('❌ MongoDB error:', err));

// // Health endpoint
// app.get('/health', (req, res) => {
//   res.json({ 
//     status: 'Sprint 2 Backend API Ready ✅',
//     endpoints: [
//       'POST /api/auth/register',
//       'POST /api/auth/login'
//     ]
//   });
// });

// // Auth endpoints (hardcoded for demo - full controller later)
// app.post('/api/auth/register', (req, res) => {
//   const { email, password } = req.body;
  
//   // DTO validation simulation
//   if (!email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: 'Email and password required (Zod DTO validation)',
//       validation: true
//     });
//   }
  
//   if (password.length < 6) {
//     return res.status(400).json({
//       success: false,
//       message: 'Password must be 6+ characters (Zod DTO)',
//       validation: true
//     });
//   }
  
//   res.status(201).json({
//     success: true,
//     message: 'User registered successfully',
//     data: {
//       user: { 
//         email, 
//         role: 'user'  // REQUIRED role field
//       },
//       token: 'eyJhbGciOiJIUzI1NiJ9.demo-jwt-token-sprint2'
//     }
//   });
// });

// app.post('/api/auth/login', (req, res) => {
//   const { email, password } = req.body;
  
//   if (!email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: 'Email and password required (Zod DTO)',
//       validation: true
//     });
//   }
  
//   res.json({
//     success: true,
//     message: 'Login successful',
//     data: {
//       user: { 
//         email, 
//         role: 'user' 
//       },
//       token: 'eyJhbGciOiJIUzI1NiJ9.demo-jwt-token-sprint2'
//     }
//   });
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Backend: http://localhost:${PORT}/health`);
//   console.log(`📱 Frontend: http://localhost:3000`);
//   console.log('✅ Sprint 2 API endpoints ready!');
// });




import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './app/routes/auth.routes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' }));

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

app.get('/health', (req, res) => {
  res.json({
    status: 'Sprint 4 Backend API Ready ✅',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login'
    ]
  });
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
