import { Request, Response } from "express";
import { resolve } from "path";
import { getCustomRepository } from "typeorm";

import { AppError } from "../errors/AppError";

import SendMailService from "../services/SendMailService";

import { SurveysRepository } from "../repositories/SurveyRepository";
import { UsersRepository } from "../repositories/UserRepository";
import { SurveysUsersRepository } from "../repositories/SurveyUserRepository";

class SendMailController {

  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({email});

    if(!user) {
      throw new AppError("User does not exists!");
    };

    const survey = await surveysRepository.findOne({id: survey_id});
  
    if(!survey) {
      throw new AppError("Survey User does not exists!");
    };

    const npsPath = resolve(
      __dirname,
      "..",
      "views",
      "emails",
      "npsMail.hbs"
    );

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where:{
        user_id: user.id,
        value: null,
      },
      relations: ["user", "survey"],
    });

    const varialbes = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL,
    };

    if(surveyUserAlreadyExists) {
      varialbes.id = surveyUserAlreadyExists.id;

      await SendMailService.execute(
        email,
        survey.title,
        varialbes,
        npsPath
      );

      return res.json(surveyUserAlreadyExists);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id,
    });

    await surveysUsersRepository.save(surveyUser);

    varialbes.id = surveyUser.id;

    await SendMailService.execute(
      email,
      survey.title,
      varialbes,
      npsPath,
    );

    return res.json(surveyUser);
  }

};

export { SendMailController };
