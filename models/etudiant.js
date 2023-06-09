const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const etudiantSchema = new Schema({
    nom: {type: String, required: true},
    prenom: {type: String, required: true},
    numAdmission: {type: String, required: true, unique: true},
    listeCours: [{type: mongoose.Types.ObjectId, required: true, ref:"UnCours"}]
});

module.exports = mongoose.model("Etudiant", etudiantSchema);