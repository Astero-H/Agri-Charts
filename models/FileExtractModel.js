const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schéma pour les prix par mois
const prixParMoisSchema = new Schema({
  mois: String,
  prix: Number
}, { _id: false }); // _id: false: pas d'identifiant MongoDB automatique pour ces sous-documents

// Définir le schéma pour les marchés
const marcheSchema = new Schema({
  nom: String,
  prixParMois: [prixParMoisSchema]
});

// Schéma pour les stades
const stadeSchema = new Schema({
  nom: String,
  marchés: [marcheSchema]
});

// Schéma pour les produits
const produitSchema = new Schema({
  libellé: String,
  unité: String,
  stades: [stadeSchema]
});

// Création du modèle à partir du schéma des produits
const FileExtractModel = mongoose.model('FileExtractModel', produitSchema, 'bananes');

module.exports = FileExtractModel;
