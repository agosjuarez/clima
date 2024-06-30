import mongoose from 'mongoose';

const historialSchema = new mongoose.Schema({
    city: { type: String, required: true },
    horaBusqueda: {
      type: Date,
      required: true,
      default: Date.now,
    }
  });

export const Historial= mongoose.model('Historial', historialSchema);