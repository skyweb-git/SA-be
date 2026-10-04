import express from 'express';
import Session from '../models/Session.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// POST /api/sessions/login
router.post('/login', async (req, res) => {
  try {
    const { employeeId, employeeEmail, employeeName, role } = req.body;
    if (!employeeEmail) {
      return res.status(400).json({ success: false, message: 'employeeEmail is required' });
    }

    const sessionId = `sess-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
    const session = await Session.create({
      sessionId,
      employeeId: employeeId || 'emp-' + Date.now().toString(36),
      employeeEmail: employeeEmail.trim().toLowerCase(),
      employeeName: employeeName || '',
      role: role || 'employee',
      loginTime: new Date(),
      lastHeartbeat: new Date(),
      isActive: true,
      activeScreenSeconds: 0,
      idleSeconds: 0,
      totalSeconds: 0,
      status: 'ACTIVE'
    });

    res.status(200).json({
      success: true,
      data: { sessionId: session.sessionId }
    });
  } catch (err) {
    console.warn('[Session Login Warning]', err.message);
    const fallbackId = `sess-fb-${Date.now()}`;
    res.status(200).json({
      success: true,
      data: { sessionId: fallbackId }
    });
  }
});

// POST /api/sessions/heartbeat
router.post('/heartbeat', async (req, res) => {
  try {
    const { sessionId, isActive, activeDeltaSeconds = 30 } = req.body;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'sessionId is required' });
    }

    const session = await Session.findOne({ sessionId });
    if (session) {
      const delta = Number(activeDeltaSeconds) || 30;
      session.lastHeartbeat = new Date();
      session.isActive = Boolean(isActive);

      if (isActive) {
        session.activeScreenSeconds = (session.activeScreenSeconds || 0) + delta;
      } else {
        session.idleSeconds = (session.idleSeconds || 0) + delta;
      }

      const elapsed = Math.floor((Date.now() - new Date(session.loginTime).getTime()) / 1000);
      session.totalSeconds = Math.max((session.activeScreenSeconds || 0) + (session.idleSeconds || 0), elapsed);

      await session.save();
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.warn('[Session Heartbeat Warning]', err.message);
    res.status(200).json({ success: true, fallback: true });
  }
});

// POST /api/sessions/logout
router.post('/logout', async (req, res) => {
  try {
    const { sessionId, employeeEmail } = req.body;

    let query = {};
    if (sessionId) {
      query.sessionId = sessionId;
    } else if (employeeEmail) {
      query = { employeeEmail: employeeEmail.toLowerCase(), status: 'ACTIVE' };
    }

    const session = await Session.findOne(query);
    if (session) {
      session.logoutTime = new Date();
      session.status = 'LOGGED_OUT';
      session.isActive = false;

      const elapsed = Math.floor((new Date(session.logoutTime).getTime() - new Date(session.loginTime).getTime()) / 1000);
      session.totalSeconds = Math.max((session.activeScreenSeconds || 0) + (session.idleSeconds || 0), elapsed);

      await session.save();
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.warn('[Session Logout Warning]', err.message);
    res.status(200).json({ success: true, fallback: true });
  }
});

// GET /api/sessions/monitoring
router.get('/monitoring', async (req, res) => {
  try {
    const dateStr = req.query.date || new Date().toISOString().split('T')[0];
    const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);

    const employees = await Employee.find().lean();
    const sessions = await Session.find({
      loginTime: { $gte: startOfDay, $lte: endOfDay }
    }).lean();

    const data = employees.map((emp) => {
      const empSessions = sessions.filter(
        (s) => s.employeeEmail === emp.email.toLowerCase() || s.employeeId === emp.id || s.employeeId === emp._id?.toString()
      );

      const activeSession = empSessions.find(
        (s) => s.status === 'ACTIVE' && Date.now() - new Date(s.lastHeartbeat).getTime() < 120000
      );

      let liveStatus = 'Offline';
      if (activeSession) {
        liveStatus = activeSession.isActive ? 'Online' : 'Idle';
      }

      const totalWorkingSeconds = empSessions.reduce((acc, s) => acc + (s.totalSeconds || 0), 0);
      const activeScreenSeconds = empSessions.reduce((acc, s) => acc + (s.activeScreenSeconds || 0), 0);
      const productivityRatio = totalWorkingSeconds > 0
        ? Math.min(100, Math.round((activeScreenSeconds / totalWorkingSeconds) * 100))
        : 0;

      const firstLoginTime = empSessions.length > 0 ? empSessions[0].loginTime : null;
      const lastSession = empSessions[empSessions.length - 1];
      const lastLogoutTime = lastSession ? (lastSession.logoutTime || lastSession.lastHeartbeat) : null;

      return {
        id: emp.id || emp._id,
        name: emp.name,
        email: emp.email,
        role: emp.role || 'employee',
        department: emp.department || 'Front Desk & Reservations',
        designation: emp.designation || 'Staff Member',
        avatar: emp.avatar || '💼',
        liveStatus,
        firstLoginTime,
        lastLogoutTime,
        totalWorkingSeconds,
        activeScreenSeconds,
        productivityRatio,
        callsDone: 0,
        emailsSent: 0,
        dailyCallTarget: emp.dailyCallTarget || 30,
        dailyEmailTarget: emp.dailyEmailTarget || 20,
        sessionsCount: empSessions.length,
        sessions: empSessions
      };
    });

    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    console.warn('[Session Monitoring Warning]', err.message);
    res.status(200).json({ success: true, count: 0, data: [] });
  }
});

// GET /api/sessions/employee/:employeeId
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const sessions = await Session.find({
      $or: [{ employeeId }, { employeeEmail: employeeId.toLowerCase() }]
    })
      .sort({ loginTime: -1 })
      .limit(50)
      .lean();

    res.status(200).json({ success: true, data: sessions });
  } catch (err) {
    console.warn('[Employee Session Audit Warning]', err.message);
    res.status(200).json({ success: true, data: [] });
  }
});

export default router;
