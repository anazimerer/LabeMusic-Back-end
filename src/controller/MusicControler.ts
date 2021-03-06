import { GenreBusiness } from './../business/GenreBusiness';
import { MusicBusiness } from './../business/MusicBusiness';
import { Request, Response } from 'express';
import { MusicInputDTO } from "../model/Music";
import { IdGenerator } from '../services/IdGenerator';
import { MusicDatabase } from '../data/MusicDatabase';
import { Authenticator } from '../services/Authenticator';
import { BaseDatabase } from '../data/BaseDatabase';
import { GenreDatabase } from '../data/GenreDatabase';

export class MusicController {
    private static musicBusiness = new MusicBusiness(
        new MusicDatabase(),
        new GenreDatabase(),
        new IdGenerator(),
        new Authenticator())

    private static genreBusiness = new GenreBusiness(
        new GenreDatabase(),
        new IdGenerator(),
        new Authenticator()
    )

    async createMusic(req: Request, res: Response): Promise<void> {
        try {
            const input: MusicInputDTO = {
                title: req.body.title,
                author: req.body.author,
                date: req.body.date,
                file: req.body.file,
                album: req.body.album,
                urlPhoto: req.body.url_photo
            }


            const genre: string[] = req.body.genre

            const token = req.headers.authorization as string

            await MusicController.musicBusiness.createMusic(input, genre, token)

            res.status(200).send("Music created successfully")

        } catch (error) {
            res.status(error.errorCode || 400).send({ message: error.message });
        }


    }

    async getMusic(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id
            const token = req.headers.authorization as string  //
            const result = await MusicController.musicBusiness.getMusicById(id, token)  //
            res.status(200).send(result);  //
        } catch (error) {
            res.status(error.errorCode || 400).send({ message: error.message });
        }

    }

    async getFeed(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string

            const result = await MusicController.musicBusiness.getFeed(token)

            res.status(200).send({ result })
        } catch (error) {
            res.status(error.errorCode || 400).send({ message: error.message });
        }
    }
}

