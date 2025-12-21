import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.send({
        title: 'All Users',
    })
});

router.get('/:id', (req, res) => {
    res.send({
        title:'User Details',
    })
})

router.post('/', (req, res) => {
    res.send({
        title: 'Create User',
    })
});

router.put('/:id', (req, res) => {
    res.send({
        title: 'Update User',
    })
})

router.delete('/:id', (req, res) => {
    res.send({
        title: 'Delete User',
    })
})

export default router;
