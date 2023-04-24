const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const unCoursSchema = new Schema({
    titre:{type: String, required: true},
    discipline: {type: String, required: true},
    nbMaxEtudiants: {type: String, required: true},
    dateDebut: {type: String, required: true},
    dateFin: {type: String, required: true},
    etudiants: [{type: mongoose.Types.ObjectId, required: true, ref:"Etudiant"}],
    prof:{type: mongoose.Types.ObjectId, required: true, ref:"Prof"}
});

module.exports = mongoose.model("UnCours", unCoursSchema);