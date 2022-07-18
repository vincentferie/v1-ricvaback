import { ISendMailOptions } from "@nestjs-modules/mailer";
import { IsOptional, IsString, IsArray, IsObject, IsNumber } from "class-validator";
import { Address, TextEncoding } from "@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface";

export class MailOptionsModel implements ISendMailOptions {
    @IsOptional()
    @IsString()
    to: string | Address;

    @IsOptional()
    @IsString()
    cc: string | Address;

    @IsOptional()
    @IsString()
    noreply: string | Address;

    @IsOptional()
    @IsString()
    encoding: string;

    @IsOptional()
    @IsString()
    date: string;

    @IsOptional()
    @IsString()
    bcc: string | Address;

    @IsOptional()
    @IsString()
    replyTo: string | Address;

    @IsOptional()
    @IsString()
    sender: string | Address;

    @IsOptional()
    @IsString()
    from: string | Address;

    @IsOptional()
    @IsString()
    subject: string;

    @IsOptional()
    @IsString()
    text: string;

    @IsOptional()
    @IsString()
    html: string;

    @IsOptional()
    @IsString()
    template: string;

    @IsOptional()
    @IsObject()
    context: ContextWelcomeToRicva | object;

    @IsOptional()
    attachments: Attachment[];

    @IsOptional()
    @IsString()
    headers: any;

    @IsOptional()
    @IsString()
    inReplyTo: string | Address;

    @IsOptional()
    @IsString()
    raw: string | Buffer;

    @IsOptional()
    @IsString()
    references: string | string[];

    @IsOptional()
    @IsString()
    textEncoding: TextEncoding;

    @IsOptional()
    @IsString()
    transporterName: string;

}

interface Attachment {
    filename: string,
    content: any,
    path: string,
    contentType: string;
    cid: string;
}

interface ContextWelcomeToRicva {
    username: string;
    password: string;
    link: string;
    name: string;
    logo: string;
}