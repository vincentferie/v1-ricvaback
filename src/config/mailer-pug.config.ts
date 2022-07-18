import { MailerAsyncOptions } from "@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface";
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

const pathTemplate = `${__dirname.split('dist')[0]}/src/mails/custom/`; // imperative for use

export const mailerPug: MailerAsyncOptions = {
    useFactory: () => ({
        transport: {
            host: '',
            port: 465, // 587 tls port
            secure: true,
            //tls: { ciphers: 'SSLv3', }, // gmail
            auth: {
                user: '',
                pass: '',
            },
        },
        defaults: {
            from: '"Ricva" <ricva-no-reply@ricva.com>',
            noreply: '"Ricva" <ricva-no-reply@ricva.com>'
        },
        template: {
            dir: pathTemplate,
            adapter: new PugAdapter(),
            options: {
                strict: true,
            },
        },
    })
};