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
                says: 'Ich kann mit verschiedenen weiblichen und männlichen Stimmen in unterschiedlichen Sprachen reden, z.B. als Deutscher oder Deutsche, Amerikaner oder Amerikanerin, Australier oder Australierin, Brite oder Britin, Inderin, Spanier oder Spanierin, Italiener oder Italienerin, Japaner oder Japanerin, Franzose oder Französin. Welche Stimme soll ich benutzen?',
                reprompts: 'Welche Nationalität soll ich benutzen: Deutscher oder Deutsche, Amerikaner oder Amerikanerin, Australier oder Australierin, Brite oder Britin, Inderin, Spanier oder Spanierin, Italiener oder Italienerin, Japaner oder Japanerin, Franzose oder Französin?',
                shouldEndSession: false,
            },
        ]);
    });

    describe('CountryIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_f: 'australierin' }),
                    'country_f', LIST_OF_COUNTRIES_F, 'Australierin', 'en-AU'),
                says: '<voice name="Nicole">So klingt es wenn ich rede wie eine Australierin: <lang xml:lang="en-AU">I speak English and my name is Alexa.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_f: 'spanierin' }),
                    'country_f', LIST_OF_COUNTRIES_F, 'Spanierin', 'es-ES'),
                says: '<voice name="Conchita">So klingt es wenn ich rede wie eine Spanierin: <lang xml:lang="es-ES">Hablo español y mi nombre es Alexa.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_f: 'italienerin' }),
                    'country_f', LIST_OF_COUNTRIES_F, 'Italienerin', 'it-IT'),
                says: '<voice name="Carla">So klingt es wenn ich rede wie eine Italienerin: <lang xml:lang="it-IT">Parlo italiano e mi chiamo Alexa.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_f: 'japanerin' }),
                    'country_f', LIST_OF_COUNTRIES_F, 'Japanerin', 'ja-JP'),
                says: '<voice name="Mizuki">So klingt es wenn ich rede wie eine Japanerin: <lang xml:lang="ja-JP">私は日本語を話し、私の名前は Alexa.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'australier' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Australier', 'en-AU'),
                says: '<voice name="Russell">So klingt es wenn ich rede wie ein Australier: <lang xml:lang="en-AU">I speak English and my name is Alexa.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'brite' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Brite', 'en-GB'),
                says: '<voice name="Brian">So klingt es wenn ich rede wie ein Brite: <lang xml:lang="en-GB">I speak English and my name is Alexa.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'deutscher' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Deutscher', 'de-DE'),
                says: '<voice name="Hans">So klingt es wenn ich rede wie ein Deutscher: <lang xml:lang="de-DE">Ich spreche deutsch und mein Name ist Alexa.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'spanier' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Spanier', 'es-ES'),
                says: '<voice name="Enrique">So klingt es wenn ich rede wie ein Spanier: <lang xml:lang="es-ES">Hablo español y mi nombre es Alexa.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'italiener' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Italiener', 'it-IT'),
                says: '<voice name="Giorgio">So klingt es wenn ich rede wie ein Italiener: <lang xml:lang="it-IT">Parlo italiano e mi chiamo Alexa.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'japaner' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Japaner', 'ja-JP'),
                says: '<voice name="Takumi">So klingt es wenn ich rede wie ein Japaner: <lang xml:lang="ja-JP">私は日本語を話し、私の名前は Alexa.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'franzose' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Franzose', 'fr-FR'),
                says: '<voice name="Mathieu">So klingt es wenn ich rede wie ein Franzose: <lang xml:lang="fr-FR">Je parle français et je m\'appelle Alexa.</lang></voice>',
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
