const express = require('express')
const actions = require('../methods/actions')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')


router.get('/', (req, res) => {
    res.send('Hello World')
})

router.get('/pass', (req, res) => {
    res.json({succes:true,name:'TICKET_RECONNU_PASS'})
})

router.get('/used', (req, res) => {
    res.json({succes:true,name:'TICKET_RECONNU_USED'})
})

router.get('/dashboard', (req, res) => {
    res.send('Dashboard')
})



//@desc Adding new user
//@route POST /adduser
router.post('/adduser', actions.addNew)

//@desc Authenticate a user
//@route POST /authenticate
router.post('/authenticate', actions.authenticate)

//@desc Get info on a user
//@route GET /getinfo
router.get('/getinfo', actions.getinfo)

router.post('/addnote', verifyToken, actions.addNote)

/* router.delete('/deletenote/:id', verifyToken, actions.deleteNote)

router.put('/updatenote/:id', verifyToken, actions.updateNote) */

router.delete('/deletenote/:noteId', verifyToken, actions.deleteNote);

router.put('/updatenote/:noteId', verifyToken, actions.updateNote);

router.get('/getnote', verifyToken, actions.getNotes)

module.exports = router