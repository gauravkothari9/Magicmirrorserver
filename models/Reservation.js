import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
  },
  { timestamps: true }
);

export default mongoose.model('Reservation', reservationSchema);
