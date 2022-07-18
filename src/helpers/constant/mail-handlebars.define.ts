/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const MailerHandlebarshelpers = {
    handlebarsIntl: function (value) {
        let context = {
            value: value
        };

        var intlData = {
            locales: ['fr-Fr'],
        };

        // use the formatNumber helper from handlebars-intl
        const template = Handlebars.compile('{{formatNumber value}} est le resultat final!');

        const compiled = template(context, {
            data: { intl: intlData }
        });

        return compiled
    },
    otherHelper: function () { }
}