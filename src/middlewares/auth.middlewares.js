import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import userService from "../services/user.service.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.sendStatus(401);
        }

        const parts = authorization.split(" ");
        const [schema, token] = parts;

        if (parts.length !== 2 || schema !== "Bearer") {
            return res.sendStatus(401);
        }

        jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
            if (error) {
                return res.status(401).send({ message: "Token invalid." });
            }

            const user = await userService.findByIdService(decoded.id);

            if (!user || !user.id) {
                return res.status(401).send({ message: "Token invalid." });
            }

            req.userId = user.id;
            return next();
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
