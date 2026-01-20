// import { Request, Response } from 'express';
// import { z } from 'zod';
// import { AuthService } from '../services/auth.service.js';
// import { registerSchema } from '../../dto/register.dto.js';
// import { loginSchema } from '../../dto/login.dto.js';

// const service = new AuthService();

// export const register = async (req, res) => {
//   try {
//     const data = registerSchema.parse(req.body);
//     const result = await service.register(data);
//     res.status(201).json({ success: true, data: result });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const data = loginSchema.parse(req.body);
//     const result = await service.login(data);
//     res.json({ success: true, data: result });
//   } catch (error) {
//     res.status(401).json({ success: false, error: error.message });
//   }
// };





import { Request, Response } from 'express';
import { registerSchema } from '../../dto/register.dto';
import { loginSchema } from '../../dto/login.dto';
import { AuthService } from '../services/auth.service';

const service = new AuthService();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await service.register(data);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ success: false, error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await service.login(data);
    res.json({ success: true, data: result });
  } catch (err) {
    const error = err as Error;
    res.status(401).json({ success: false, error: error.message });
  }
};
