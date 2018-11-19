'use strict';

// include the testing framework
const alexaTest = require('alexa-skill-test-framework');

// custom slot types
const LIST_OF_COUNTRIES_F = 'LIST_OF_COUNTRIES_F';
const LIST_OF_COUNTRIES_M = 'LIST_OF_COUNTRIES_M';

// initialize the testing framework
alexaTest.initialize(
    require('../src/index'),
    'amzn1.ask.skill.279fec18-3b4b-4d66-a3d2-d53680b6696a',
    'amzn1.ask.account.VOID');
alexaTest.setLocale('de-DE');

describe('Stimmentester Skill', () => {

    describe('ErrorHandler', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest(''),
                says: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
                reprompts: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
                shouldEndSession: false,
            },
        ]);
    });

    describe('HelpIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.HelpIntent'),
                says: 'Ich kann mit verschiedenen weiblichen und männlichen Stimmen in unterschiedlichen Sprachen reden, z.B. als Deutscher oder Deutsche, Amerikaner oder Amerikanerin, Australier oder Australierin, Brite oder Britin, Inderin, Spanier oder Spanierin, Italiener oder Italienerin, Japaner oder Japanerin, Franzose oder Französin. Welche Stimme soll ich benutzen?',
                reprompts: 'Welche Nationalität soll ich benutzen: Deutscher oder Deutsche, Amerikaner oder Amerikanerin, Australier oder Australierin, Brite oder Britin, Inderin, Spanier oder Spanierin, Italiener oder Italienerin, Japaner oder Japanerin, Franzose oder Französin?',
                shouldEndSession: false,
            },
        ]);
    });

    describe('SessionEndedRequest', () => {
        alexaTest.test([
            {
                request: alexaTest.getSessionEndedRequest(),
                saysNothing: true, repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('CancelIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.CancelIntent'),
                says: '<say-as interpret-as="interjection">bis dann</say-as>.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('StopIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.StopIntent'),
                says: '<say-as interpret-as="interjection">bis dann</say-as>.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('LaunchRequest', () => {
        alexaTest.test([
            {
                request: alexaTest.getLaunchRequest(),
                says: 'Als wer soll ich reden?',
                reprompts: 'Welche Nationalität soll ich benutzen: Deutscher oder Deutsche, Amerikaner oder Amerikanerin, Australier oder Australierin, Brite oder Britin, Inderin, Spanier oder Spanierin, Italiener oder Italienerin, Japaner oder Japanerin, Franzose oder Französin?',
                shouldEndSession: false,
            },
        ]);
    });

    describe('CountryIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'deutscher' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Deutscher', 'de-DE'),
                says: 'So klingt ein Deutscher: <voice name="Hans"><lang xml:lang="de-DE">Ich spreche deutsch und mein Name ist Alex.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_f: 'spanierin' }),
                    'country_f', LIST_OF_COUNTRIES_F, 'Spanierin', 'es-ES'),
                says: 'So klingt eine Spanierin: <voice name="Conchita"><lang xml:lang="es-ES">Hablo español y mi nombre es Alexa.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionNoMatchToRequest(
                    alexaTest.getIntentRequest('CountryIntent'), 'country_f', LIST_OF_COUNTRIES_F, 'Klingone'),
                says: 'Ich kenne diese Nationalität leider nicht.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });
});
