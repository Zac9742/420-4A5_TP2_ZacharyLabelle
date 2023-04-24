const { v4: uuidv4 } = require("uuid");
const HttpErreur = require("../models/http-erreur");

const Prof = require("../models/prof");
const UnCours = require("../models/unCours");

const PROFESSEURS = [
  {
    dateEmbauche: "2023-04-18",
    nom: "Labranche",
    prenom: "Sylvain",
    image: "",
    listeCours: []
  },
];

const getProfById = async (requete, reponse, next) => {
  const profId = requete.params.profId;
  let prof;
  try {
    prof = await Prof.findById(profId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération du professeur", 500)
    );
  }
  if (!prof) {
    return next(new HttpErreur("Aucun professeur trouvé pour l'id fourni", 404));
  }
  reponse.json({ prof: prof.toObject({ getters: true }) });
};

const creerProf = async (requete, reponse, next) => {
  const { dateEmbauche, nom, prenom, image, listeCours } = requete.body;
  const nouveauProf = new Prof({
    dateEmbauche,
    nom,
    prenom,
    image,
    listeCours,
  });

  try {

    await nouveauProf.save();
  
  } catch (err) {
    const erreur = new HttpErreur("Création du professeur échouée", 500);
    return next(erreur);
  }
  reponse.status(201).json({ prof: nouveauProf });
};

const updateProf = async (requete, reponse, next) => {
  const { dateEmbauche, nom, prenom } = requete.body;
  const profId = requete.params.profId;

  let prof;

  try {
    prof = await Prof.findById(profId);
    prof.dateEmbauche = dateEmbauche;
    prof.nom = nom;
    prof.prenom = prenom;

    await prof.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la mise à jour du professeur", 500)
    );
  }

  reponse.status(200).json({ prof: prof.toObject({ getters: true }) });
};

const supprimerProf = async (requete, reponse, next) => {
  const profId = requete.params.profId;
  let prof;

  try {
    prof = await Prof.findById(profId);
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression du professeur", 500)
    );
  }
  if(!prof){
    return next(new HttpErreur("Impossible de trouver le professeur", 404));
  }

  try{

    await prof.remove();
    await UnCours.updateMany({ prof: profId }, { $unset: { prof: 1 } });

  }catch{
    return next(
      new HttpErreur("Erreur lors de la suppression du professeur", 500)
    );
  }
  reponse.status(200).json({ message: "Professeur supprimé" });
};

exports.getProfById = getProfById;
exports.creerProf = creerProf;
exports.updateProf = updateProf;
exports.supprimerProf = supprimerProf;
