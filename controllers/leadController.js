import Lead from '../models/Lead.js';
import Booking from '../models/Booking.js';

// @desc    Get all leads
// @route   GET /api/leads
// @access  Public / Admin
export const getLeads = async (req, res, next) => {
  try {
    let leads = await Lead.find().sort({ createdAt: -1 });
    
    // Also include any Bookings that may have been created directly
    if (leads.length === 0) {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      if (bookings.length > 0) {
        leads = bookings.map(b => ({
          id: b._id.toString(),
          _id: b._id,
          fullName: b.name,
          email: b.email,
          phone: b.phone,
          unitInterest: b.room,
          checkIn: b.checkIn ? new Date(b.checkIn).toISOString().split('T')[0] : '',
          checkOut: b.checkOut ? new Date(b.checkOut).toISOString().split('T')[0] : '',
          message: b.message,
          status: b.status === 'confirmed' ? 'Confirmed' : b.status === 'cancelled' ? 'Cancelled' : 'New',
          source: 'Website Booking Form',
          createdAt: b.createdAt
        }));
      }
    }

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Public / Admin
export const createLead = async (req, res, next) => {
  try {
    const leadData = req.body;
    const targetEmpId = leadData.assignedToId || leadData.assignedTo || 'emp-02';
    const targetEmpName = leadData.assignedToName || leadData.assignedEmployeeName || (targetEmpId === 'emp-02' ? 'Front Desk Manager' : 'Unassigned');

    const newLead = await Lead.create({
      id: leadData.id || ('lead-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6)),
      fullName: leadData.fullName || leadData.name || 'Anonymous Guest',
      phone: leadData.phone || '',
      email: leadData.email || '',
      preferredMethod: leadData.preferredMethod || (leadData.phone ? 'WhatsApp' : 'Email'),
      source: leadData.source || 'Website Booking Form',
      message: leadData.message || '',
      status: leadData.status || 'New',
      unitInterest: leadData.unitInterest || leadData.room || 'Any Room / Best Available',
      checkIn: leadData.checkIn || '',
      checkOut: leadData.checkOut || '',
      budget: leadData.budget || '',
      assignedToId: targetEmpId,
      assignedToName: targetEmpName,
      assignedTo: targetEmpId,
      assignedEmployeeName: targetEmpName,
      notes: leadData.notes || '',
      followUpDate: leadData.followUpDate || ''
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: newLead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Public / Admin
export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const lead = await Lead.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      updates,
      { new: true }
    );

    if (!lead) {
      // Check if it's a booking record
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        await Booking.findByIdAndUpdate(id, {
          status: (updates.status || '').toLowerCase()
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Public / Admin
export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Lead.findOneAndDelete({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      await Booking.findByIdAndDelete(id);
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
