var User = require('../models/user')
var Note = require('../models/note')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
var j_decoo = require('jwt-decode')
const jwt_decode = require('jwt-decode');

const jwtt = require('jsonwebtoken');

var functions = {
    addNew: function (req, res) {
        if ((!req.body.name) || (!req.body.password)) {
            res.json({ success: false, msg: 'Entrez tous les champs' })
        }
        else {
            var newUser = new User({
                name: req.body.name,
                password: req.body.password
            });
            newUser.save()
                .then(() => {
                    var token = jwt.encode(newUser, config.secret);
                    res.json({ success: true, msg: 'Enregistré avec succès', token: token })
                })
                .catch((err) => {
                    res.json({ success: false, msg: 'Enregistrement échoué' })
                });
        }
    },

    authenticate: function (req, res) {
        User.findOne({ name: req.body.name })
            .then(user => {
                if (!user) {
                    res.status(403).send({ success: false, msg: 'Authentication Failed, User not found' });
                } else {
                    user.comparePassword(req.body.password)
                        .then(isMatch => {
                            if (isMatch) {
                                var token = jwt.encode(user, config.secret);
                                res.json({ success: true, token: token });
                            } else {
                                res.status(403).send({ success: false, msg: 'Authentication failed, wrong password' });
                            }
                        })
                        .catch(err => {
                            res.status(500).send({ success: false, msg: 'Error comparing password' });
                        });
                }
            })
            .catch(err => {
                res.status(500).send({ success: false, msg: 'Error finding user' });
            });
    },

    getinfo: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            try {
                //var decodedtoken = jwt_decode(token);
                var decodedtoken = jwtt.verify(token, config.secret);
                if (decodedtoken && decodedtoken.name) {
                    //return res.json({ success: true, msg: 'Hello ' + decodedtoken.name });
                    return res.json({ success: true, msg: decodedtoken.name });
                } else {
                    return res.json({ success: false, msg: 'Invalid token or missing data' });
                }
            } catch (error) {
                return res.json({ success: false, msg: 'Error decoding token', error: error.message });
            }
        } else {
            return res.json({ success: false, msg: 'No Headers' });
        }
    },

    // Ajouter une note
    addNote: async function (req, res) {
        try {
            //const { title, subtitle } = req.body;
            var newNote = new Note({
                title: req.body.title,
                subtitle: req.body.subtitle,
                userId: req.user._id // L'ID de l'utilisateur est extrait du token
            });
            const savedNote = await newNote.save();
            res.json({ success: true, note: savedNote });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Supprimer une note
    deleteNote: async function(req, res) {
        try {
            const noteId = req.params.noteId;
            const deletedNote = await Note.findByIdAndDelete(noteId);
            if (!deletedNote) {
                return res.status(404).json({ success: false, msg: 'La note n\'a pas été trouvée' });
            }
            res.json({ success: true, msg: 'Note supprimée avec succès' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },    
    
    // Mettre à jour une note
    updateNote: async function(req, res) {
        try {
            const noteId = req.params.noteId;
            const updatedNote = await Note.findByIdAndUpdate(noteId, req.body, { new: true });
            if (!updatedNote) {
                return res.status(404).json({ success: false, msg: 'La note n\'a pas été trouvée' });
            }
            res.json({ success: true, note: updatedNote });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Afficher toutes les notes de l'utilisateur connecté
    getNotes: async function (req, res) {
        try {
            const notes = await Note.find({ userId: req.user._id });
            res.json({ success: true, notes });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },


}

module.exports = functions