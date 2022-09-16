import { Request, Response } from "express";

export async function profile_get(req: Request, res: Response) {
    res.json({
        message: 'Hi!',
        user: req.user,
        token: req.query.secret_token
    })
}
