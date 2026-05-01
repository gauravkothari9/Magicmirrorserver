import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true, maxlength: 120 },
    email:   { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone:   { type: String, required: true, trim: true, maxlength: 30 },
    topic:   {
      type: String,
      required: true,
      enum: ['general', 'purchase', 'installation', 'custom', 'aura-plus', 'privacy', 'press', 'wholesale', 'other'],
    },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    consent: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);
