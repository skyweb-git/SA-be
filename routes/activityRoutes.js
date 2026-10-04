import express from 'express';

export const callRouter = express.Router();
export const emailRouter = express.Router();

let callLogs = [];
let emailLogs = [];

callRouter.get('/', (req, res) => {
  res.status(200).json({ success: true, data: callLogs });
});

callRouter.post('/', (req, res) => {
  const item = {
    id: 'call-' + Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  callLogs.unshift(item);
  res.status(201).json({ success: true, data: item });
});

emailRouter.get('/', (req, res) => {
  res.status(200).json({ success: true, data: emailLogs });
});

emailRouter.post('/', (req, res) => {
  const item = {
    id: 'email-' + Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  emailLogs.unshift(item);
  res.status(201).json({ success: true, data: item });
});
