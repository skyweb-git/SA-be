import Booking from '../models/Booking.js';
import Lead from '../models/Lead.js';
import { sendBookingNotification } from '../config/mailer.js';

// @desc    Create a new booking enquiry / reservation
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res, next) => {
  try {
    const { name, fullName, email, phone, room, unitInterest, roomId, checkIn, checkOut, message, guestsCount, assignedToId, assignedToName } = req.body;

    const guestName = (name || fullName || '').trim();
    const guestEmail = (email || '').trim();

    if (!guestName || !guestEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least your full name and email address.'
      });
    }

    let checkInDate = checkIn ? new Date(checkIn) : new Date();
    if (isNaN(checkInDate.getTime())) checkInDate = new Date();

    let checkOutDate = checkOut ? new Date(checkOut) : new Date(Date.now() + 86400000 * 2);
    if (isNaN(checkOutDate.getTime())) checkOutDate = new Date(checkInDate.getTime() + 86400000 * 2);

    const roomChoice = room || unitInterest || 'Any Room / Best Available';
    const targetEmpId = assignedToId || 'emp-02';
    const targetEmpName = assignedToName || 'Front Desk Manager';

    const newBooking = await Booking.create({
      name: guestName,
      email: guestEmail,
      phone: phone || '',
      room: roomChoice,
      roomId: roomId || null,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      message: message || '',
      guestsCount: guestsCount ? Number(guestsCount) : 1
    });

    // Also auto-sync to Leads collection so the admin sees it in real time
    let createdLead = null;
    try {
      createdLead = await Lead.create({
        id: 'lead-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        fullName: guestName,
        email: guestEmail,
        phone: phone || '',
        preferredMethod: phone ? 'WhatsApp' : 'Email',
        unitInterest: roomChoice,
        checkIn: typeof checkIn === 'string' && checkIn ? checkIn : checkInDate.toISOString().split('T')[0],
        checkOut: typeof checkOut === 'string' && checkOut ? checkOut : checkOutDate.toISOString().split('T')[0],
        message: message || '',
        source: 'Website Booking Form',
        status: 'New',
        assignedToId: targetEmpId,
        assignedToName: targetEmpName,
        assignedTo: targetEmpId,
        assignedEmployeeName: targetEmpName,
        notes: `Online inquiry from website booking form for ${roomChoice}. Dates: ${checkIn || 'TBD'} to ${checkOut || 'TBD'}.`
      });
    } catch (leadSyncErr) {
      console.warn('Auto-sync to Lead collection warning:', leadSyncErr.message);
    }

    // Trigger SMTP email notifications asynchronously (non-blocking)
    sendBookingNotification({
      name: guestName,
      email: guestEmail,
      phone,
      room: roomChoice,
      checkIn,
      checkOut,
      message
    }).catch(mailErr => console.warn('[SMTP Notice] Booking email error:', mailErr.message));

    res.status(201).json({
      success: true,
      message: 'Booking enquiry submitted successfully. Our team will contact you shortly.',
      data: newBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Public (or Admin)
export const getBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Public (or Admin)
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id
// @access  Public (or Admin)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, confirmed, cancelled, or completed.'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      message: `Booking marked as ${status}`,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Public (or Admin)
export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, message: 'Booking removed successfully' });
  } catch (error) {
    next(error);
  }
};
