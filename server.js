const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error:', err));

const PeliculaSchema = new mongoose.Schema({
  titulo: String,
  genero: String,
  calificacion: Number,
  anio: Number
});

const Pelicula = mongoose.model('Pelicula', PeliculaSchema);

// GET - Obtener todas
app.get('/peliculas', async (req, res) => {
  const peliculas = await Pelicula.find().sort({ _id: -1 });
  res.json(peliculas);
});

// POST - Agregar nueva
app.post('/peliculas', async (req, res) => {
  const nueva = new Pelicula(req.body);
  await nueva.save();
  res.json({ mensaje: 'Película registrada', nueva });
});

// DELETE - Eliminar
app.delete('/peliculas/:id', async (req, res) => {
  await Pelicula.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Película eliminada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));