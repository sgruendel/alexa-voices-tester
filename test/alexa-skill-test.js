'use strict';

// include the testing framework
const alexaTest = require('alexa-skill-test-framework');

// custom slot types
const LIST_OF_VOICES = 'LIST_OF_VOICES';

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
                says: 'Ich kann mit verschiedenen weiblichen und männlichen Stimmen in unterschiedlichen Sprachen reden. Welche Stimme soll ich benutzen?',
                reprompts: 'Welche Stimme soll ich benutzen: Ivy, Joanna, Kendra, Kimberly, Salli, Joey, Justin, Matthew, Nicole, Russell, Amy, Emma, Brian, Aditi, Raveena, Marlene, Vicki, Hans, Conchita, Enrique, Carla, Giorgio, Mizuki, Takumi, Celine, Lea oder Mathieu?',
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
                says: 'Welche Stimme soll ich benutzen?',
                reprompts: 'Welche Stimme soll ich benutzen: Ivy, Joanna, Kendra, Kimberly, Salli, Joey, Justin, Matthew, Nicole, Russell, Amy, Emma, Brian, Aditi, Raveena, Marlene, Vicki, Hans, Conchita, Enrique, Carla, Giorgio, Mizuki, Takumi, Celine, Lea oder Mathieu?',
                shouldEndSession: false,
            },
        ]);
    });

    describe('VoiceNameIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('VoiceNameIntent', { voicename: 'Kendra' }),
                    'voicename', LIST_OF_VOICES, 'Kendra'),
                says: 'Hier ist die Stimme Kendra: <voice name="Kendra"><lang xml:lang="en-US">I speak English and my name is Kendra.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionNoMatchToRequest(
                    alexaTest.getIntentRequest('VoiceNameIntent'), 'voicename', LIST_OF_VOICES, 'Otto'),
                says: 'Ich kenne diese Stimme leider nicht.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });
});
