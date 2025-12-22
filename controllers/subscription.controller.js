import Subscription from '../models/subscription.model.js';
export const getAllSubscriptions = async (req, res, next) => {
    try
    {
        const subscriptions = await Subscription.find();
        res.status(200).send({
            success: true,
            message: 'Subscription fetched successfully',
            data: subscriptions
        })
    }
    catch (error)
    {
        next(error)
    }
}


