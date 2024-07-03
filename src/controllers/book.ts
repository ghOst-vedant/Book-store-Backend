import { NextFunction, Request, Response } from "express";

export const createBook = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const {} = req.body;
    res.json({});
};
