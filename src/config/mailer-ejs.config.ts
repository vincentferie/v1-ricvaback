import { MailerAsyncOptions } from "@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface";
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

const pathTemplate = `${__dirname.split('dist')[0]}/src/mails/custom/`; // imperative for use

export const mailerEjs: MailerAsyncOptions = {
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
            adapter: new EjsAdapter(),
            options: {
                strict: true,
            },
        },
    })

};