import { Router } from 'express';
import { getAllSubscriptions } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();



subscriptionRouter.get('/', getAllSubscriptions);

