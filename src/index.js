'use strict';

const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const dashbot = process.env.DASHBOT_API_KEY ? require('dashbot')(process.env.DASHBOT_API_KEY).alexa : undefined;
const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
    exitOnError: false,
});

const utils = require('./utils');

const SKILL_ID = 'amzn1.ask.skill.279fec18-3b4b-4d66-a3d2-d53680b6696a';
const ER_SUCCESS_MATCH = 'ER_SUCCESS_MATCH';
const ER_SUCCESS_NO_MATCH = 'ER_SUCCESS_NO_MATCH';

const languageStrings = {
    de: {
        translation: {
            HELP_MESSAGE: 'Ich kann mit verschiedenen weiblichen und männlichen Stimmen in unterschiedlichen Sprachen reden. Welche Stimme soll ich benutzen?',
            HELP_REPROMPT: 'Welche Stimme soll ich benutzen: Ivy, Joanna, Kendra, Kimberly, Salli, Joey, Justin, Matthew, Nicole, Russell, Amy, Emma, Brian, Aditi, Raveena, Marlene, Vicki, Hans, Conchita, Enrique, Carla, Giorgio, Mizuki, Takumi, Celine, Lea oder Mathieu?',
            STOP_MESSAGE: '<say-as interpret-as="interjection">bis dann</say-as>.',
            UNKNOWN_VOICENAME: 'Ich kenne diese Stimme leider nicht.',
            NOT_UNDERSTOOD_MESSAGE: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
        },
    },
};

const VoiceNameIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'LaunchRequest'
            || (request.type === 'IntentRequest' && request.intent.name === 'VoiceNameIntent');
    },
    handle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        logger.debug('request', request);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const slots = request.intent && request.intent.slots;
        if (!slots) {
            return handlerInput.responseBuilder
                .speak('Welche Stimme soll ich benutzen?')
                .reprompt(requestAttributes.t('HELP_REPROMPT'))
                .getResponse();
        }
        logger.debug('voicename slot', slots.voicename);

        const rpa = slots.voicename
            && slots.voicename.resolutions
            && slots.voicename.resolutions.resolutionsPerAuthority[0];
        switch (rpa.status.code) {
        case ER_SUCCESS_NO_MATCH:
            // should never happen, as unmatched first names should go to UnsupportedFirstNameIntentHandler
            logger.error('no match for voicename ' + slots.voicename.value);
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('UNKNOWN_VOICENAME'))
                .getResponse();

        case ER_SUCCESS_MATCH:
            if (rpa.values.length > 1) {
                logger.info('multiple matches for ' + slots.voicename.value);
                var prompt = 'Welche Stimme';
                const size = rpa.values.length;

                rpa.values.forEach((element, index) => {
                    prompt += ((index === size - 1) ? ' oder ' : ', ') + element.value.name;
                });

                prompt += '?';
                logger.info('eliciting voicename slot: ' + prompt);
                return handlerInput.responseBuilder
                    .speak(prompt)
                    .reprompt(prompt)
                    .addElicitSlotDirective(slots.voicename.name)
                    .getResponse();
            }
            break;

        default:
            logger.error('unexpected status code ' + rpa.status.code);
        }

        const value = rpa.values[0].value;
        logger.info('voicename value', value);

        return handlerInput.responseBuilder
            .speak('Hier ist die Stimme ' + value.name + ': ' + utils.getSpeechOutputFor(value.name))
            .getResponse();
    },
};

const UnsupportedFirstNameIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'UnsupportedFirstNameIntent';
    },
    handle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        logger.debug('request', request);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('UNKNOWN_VOICENAME'))
            .getResponse();
    },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        logger.debug('request', request);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('HELP_MESSAGE'))
            .reprompt(requestAttributes.t('HELP_REPROMPT'))
            .getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        logger.debug('request', request);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechOutput = requestAttributes.t('STOP_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        try {
            if (request.reason === 'ERROR') {
                logger.error(request.error.type + ': ' + request.error.message);
            }
        } catch (err) {
            logger.error(err, request);
        }

        logger.debug('session ended', request);
        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        logger.error(error.message,
            { request: handlerInput.requestEnvelope.request, stack: error.stack, error: error });
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechOutput = requestAttributes.t('NOT_UNDERSTOOD_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    },
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true,
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = (...args) => {
            return localizationClient.t(...args);
        };
    },
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        VoiceNameIntentHandler,
        UnsupportedFirstNameIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler)
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .withSkillId(SKILL_ID)
    .lambda();
if (dashbot) exports.handler = dashbot.handler(exports.handler);
