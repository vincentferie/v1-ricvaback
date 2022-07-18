import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { MailOptionsModel } from "./mailer.dto";

@Injectable()
export class MailSendService {
    constructor(private readonly mailerService: MailerService) { }

    async send(input: MailOptionsModel): Promise<any> {
        return this.mailerService.sendMail(input)
            .then(
                (sent: any) => { return sent.response.indexOf('250 2.0.0 Ok') !== -1 ? true : false; },
                (rejected: any) => { return rejected; },
            )
            .catch(
                (error: any) => { throw error; }
            )
            .finally(() => null);

    }
}