import { Request, Response } from "express";

export async function main_get(req: Request, res: Response) {
    res.json({
        message: 'Hi bor!',
        user: req.user,
        token: req.query.secret_token
    })
}
