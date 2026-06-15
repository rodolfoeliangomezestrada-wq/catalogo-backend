const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error:', err));

const PeliculaSchema = new mongoose.Schema({
  titulo: String,
  genero: String,
  calificacion: Number,
  anio: Number,
  sinopsis: String,
  portadaUrl: String
});

const Pelicula = mongoose.model('Pelicula', PeliculaSchema);

app.get('/peliculas', async (req, res) => {
  const peliculas = await Pelicula.find().sort({ _id: -1 });
  res.json(peliculas);
});

app.post('/peliculas', async (req, res) => {
  const nueva = new Pelicula(req.body);
  await nueva.save();
  res.json({ mensaje: 'Película registrada', nueva });
});

app.put('/peliculas/:id', async (req, res) => {
  const actualizada = await Pelicula.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(actualizada);
});

app.delete('/peliculas/:id', async (req, res) => {
  await Pelicula.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Película eliminada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));