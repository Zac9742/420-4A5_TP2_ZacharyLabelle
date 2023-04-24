const { v4: uuidv4 } = require("uuid");
const HttpErreur = require("../models/http-erreur");

const Etudiant = require("../models/etudiant");
const UnCours = require("../models/unCours");

const ETUDIANTS = [
  {
    nom: "Labelle",
    prenom: "Zachary",
    numAdmission: "2008442",
    listeCours: []
  },
];

const getEtudiantById = async (requete, reponse, next) => {
  const etudiantId = requete.params.etudiantId;
  let etudiant;
  try {
    etudiant = await Etudiant.findById(etudiantId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération de l'étudiant", 500)
    );
  }
  if (!etudiant) {
    return next(new HttpErreur("Aucun étudiant trouvé pour l'id fourni", 404));
  }
  reponse.json({ etudiant: etudiant.toObject({ getters: true }) });
};

const creerEtudiant = async (requete, reponse, next) => {
  const {nom, prenom, numAdmission, listeCours } = requete.body;
  const nouveauEtudiant = new Etudiant({
    nom,
    prenom,
    numAdmission,
    listeCours
  });

  try {
    await nouveauEtudiant.save();
    
  } catch (err) {
    const erreur = new HttpErreur("Création de l'étudiant échouée", 500);
    return next(erreur);
  }
  reponse.status(201).json({ etudiant: nouveauEtudiant });
};

const updateEtudiant = async (requete, reponse, next) => {
  const {nom, prenom, numAdmission} = requete.body;
  const etudiantId = requete.params.etudiantId;

  let etudiant;

  try {
    etudiant = await Etudiant.findById(etudiantId);
    etudiant.nom = nom;
    etudiant.prenom = prenom;
    etudiant.numAdmission = numAdmission;

    await etudiant.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la mise à jour de l'étudiant", 500)
    );
  }

  reponse.status(200).json({ etudiant: etudiant.toObject({ getters: true }) });
};

const supprimerEtudiant = async (requete, reponse, next) => {
  const etudiantId = requete.params.etudiantId;
  let etudiant;

  try {
    etudiant = await Etudiant.findById(etudiantId);
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression de l'étudiant", 500)
    );
  }
  if(!etudiant){
    return next(new HttpErreur("Impossible de trouver l'étudiant'", 404));
  }

  try{

    await etudiant.remove();
    await UnCours.updateMany({ etudiant: etudiantId }, { $pull: { etudiants: etudiantId } });

  }catch{
    return next(
      new HttpErreur("Erreur lors de la suppression de l'étudiant", 500)
    );
  }
  reponse.status(200).json({ message: "Étudiant supprimé" });
};

exports.getEtudiantById = getEtudiantById;
exports.creerEtudiant = creerEtudiant;
exports.updateEtudiant = updateEtudiant;
exports.supprimerEtudiant = supprimerEtudiant;
