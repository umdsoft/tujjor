const router = require('express').Router();
const InfoController = require('../controllers/InfoController')

router.post('/create', InfoController.create);
router.get('/all', InfoController.getAll);
router.get('/:slug', InfoController.getOne);
router.put('/:id', InfoController.edit);
router.delete('/:id', InfoController.delete);

module.exports = router;