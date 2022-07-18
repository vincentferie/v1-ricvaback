import { MailerAsyncOptions } from "@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerOptions } from "@nestjs-modules/mailer/dist/interfaces/mailer-options.interface";
import { MailerHandlebarshelpers } from "src/helpers/constant/mail-handlebars.define";
import * as global from 'config';

const pathTemplate = `${__dirname.split('dist')[0]}/src/mails/custom/`; // imperative for use
const params = global.get('mail');


export const mailerHandlebars: MailerAsyncOptions = {
    useFactory: () => ({
        transport: {
            host: params.host,
            port: params.port.mailtrap, // 587 tls port
            secure: params.secure.non,
            //tls: { ciphers: 'SSLv3', }, // gmail
            auth: {
                user: params.auth.user,
                pass: params.auth.pass,
            },
        },
        defaults: {
            from: params.from,
            noreply: params.noreply
        },
        template: {
            dir: pathTemplate,
            adapter: new HandlebarsAdapter(MailerHandlebarshelpers),
            options: {
                strict: true,
            },
        },
    })
};

export const mailerHandlebarsPartial: MailerOptions = {
    defaults: {
        from: '"No Reply" <noreply@example.com>',
    },
    template: {
        dir: process.env.PWD + 'templates/pages',
        adapter: new HandlebarsAdapter(),
        options: {
            strict: true,
        },
    },
    options: {
        partials: {
            dir: process.env.PWD + 'templates/partials',
            options: {
                strict: true,
            },
        }
    }
}