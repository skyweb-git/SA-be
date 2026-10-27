import express from 'express';
import Employee from '../models/Employee.js';

const router = express.Router();

const INITIAL_EMPLOYEES = [
  {
    id: 'emp-admin-gmail',
    name: 'Edion Royal Admin',
    email: 'edionroyalcpt@gmail.com',
    password: 'admin123',
    role: 'admin',
    department: 'Management',
    designation: 'General Manager & Admin',
    phone: '+27 78 972 4254',
    status: 'Active',
    avatar: '👑',
    dailyCallTarget: 30,
    dailyEmailTarget: 20
  },
  {
    id: 'emp-03',
    name: 'nvc',
    email: 'vikhyathnimmlapudi@gmail.com',
    password: 'Pass@4605',
    role: 'employee',
    department: 'Telecalling & Direct Sales',
    designation: 'Telecalling Specialist',
    phone: '7396514989',
    status: 'Active',
    avatar: '💼',
    dailyCallTarget: 35,
    dailyEmailTarget: 20
  },
  {
    id: 'emp-01',
    name: 'Executive Super Admin',
    email: 'admin@edionroyal.co.za',
    password: 'admin123',
    role: 'admin',
    department: 'Management',
    designation: 'General Manager & Admin',
    phone: '+27 78 972 4254',
    status: 'Active',
    avatar: '👑',
    dailyCallTarget: 30,
    dailyEmailTarget: 20
  },
  {
    id: 'emp-02',
    name: 'Front Desk Manager',
    email: 'manager@edionroyal.co.za',
    password: 'welcome123',
    role: 'employee',
    department: 'Front Desk & Reservations',
    designation: 'Guest Relations Manager',
    phone: '+27 78 972 4254',
    status: 'Active',
    avatar: '💼',
    dailyCallTarget: 30,
    dailyEmailTarget: 20
  }
];

// Helper to ensure initial employees exist in MongoDB
export const seedInitialEmployees = async () => {
  try {
    for (const emp of INITIAL_EMPLOYEES) {
      const exists = await Employee.findOne({ email: emp.email.toLowerCase() });
      if (!exists) {
        await Employee.create(emp);
        console.log(`[Employee Seed] Created employee: ${emp.email}`);
      } else if (!exists.password || exists.password !== emp.password) {
        exists.password = emp.password;
        await exists.save();
      }
    }
  } catch (err) {
    console.warn('[Employee Seed Warning]', err.message);
  }
};

// GET /api/employees
router.get('/', async (req, res, next) => {
  try {
    let employees = await Employee.find().sort({ createdAt: -1 });
    if (!employees || employees.length === 0) {
      await seedInitialEmployees();
      employees = await Employee.find().sort({ createdAt: -1 });
    }
    res.status(200).json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    // Graceful fallback to initial array if DB temporarily unavailable
    res.status(200).json({ success: true, count: INITIAL_EMPLOYEES.length, data: INITIAL_EMPLOYEES });
  }
});

// POST /api/employees
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const newEmp = await Employee.create({
      id: data.id || ('emp-' + Date.now().toString(36)),
      name: data.name,
      email: (data.email || '').trim().toLowerCase(),
      password: data.password || 'welcome123',
      phone: data.phone || '',
      role: data.role || 'employee',
      department: data.department || 'Front Desk & Reservations',
      designation: data.designation || 'Staff Member',
      status: data.status || 'Active',
      avatar: data.avatar || '💼',
      dailyCallTarget: Number(data.dailyCallTarget) || 30,
      dailyEmailTarget: Number(data.dailyEmailTarget) || 20
    });
    res.status(201).json({ success: true, data: newEmp });
  } catch (error) {
    next(error);
  }
});

// PUT /api/employees/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Employee.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: updated, message: 'Employee updated successfully' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/employees/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await Employee.findOneAndDelete({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    });
    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
