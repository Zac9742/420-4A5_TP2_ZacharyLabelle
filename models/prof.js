const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const profSchema = new Schema({
    dateEmbauche:{type: String, required: true},
    nom: {type: String, required: true},
    prenom: {type: String, required: true},
    image: {type: String, required: true},
    listeCours: [{type: mongoose.Types.ObjectId, required: true, ref:"UnCours"}]
});



module.exports = mongoose.model("Prof", profSchema);