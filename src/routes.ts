import { Router } from "express";
import { SurveyController } from "./controllers/SurveyController";
import { UserController } from "./controllers/UserController";
import { SendMailController } from  "./controllers/SendMailController";

const router = Router();

const userController = new UserController();
const surveysController = new SurveyController();
const sendMailController = new SendMailController();


router.post("/users", userController.create);

router.get("/surveys", surveysController.show);
router.post("/surveys", surveysController.create);

router.post("/send-mail", sendMailController.execute)

export { router }

