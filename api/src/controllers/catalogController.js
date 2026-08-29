const { searchMovies } = require("../services/tmdbService");

// GET /catalog/search?query=... - protegido, role ORGANIZER
async function searchCatalog(req, res) {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Parâmetro query é obrigatório." });
    }

    const results = await searchMovies(query);
    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar no catálogo do TMDb." });
  }
}

module.exports = { searchCatalog };
