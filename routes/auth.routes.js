import {Router} from 'express';

const router = Router();

router.post('/login', (req, res) => {
    res.send({
        title: 'Login',
    })
});

router.post('/register', (req, res) => {
    res.send({
        title: 'Register',
    })
});

router.post('/logout', (req, res) => {
    res.send({
        title: 'Logout',
    })
});

export default router;