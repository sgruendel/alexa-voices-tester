'use strict';

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

const femaleVoiceNames = {
    'en-US': [
        'Ivy', 'Joanna', 'Kendra', 'Kimberly', 'Salli',
    ],
    'en-AU': [
        'Nicole',
    ],
    'en-GB': [
        'Amy', 'Emma',
    ],
    'en-IN': [
        'Aditi', 'Raveena',
    ],
    // No names for 'en-CA' yet.
    'de-DE': [
        'Marlene', 'Vicki',
    ],
    'es-ES': [
        'Conchita',
    ],
    'it-IT': [
        'Carla',
    ],
    'ja-JP': [
        'Mizuki',
    ],
    'fr-FR': [
        'Celine', 'Lea',
    ],
};

const maleVoiceNames = {
    'en-US': [
        'Joey', 'Justin', 'Matthew',
    ],
    'en-AU': [
        'Russell',
    ],
    'en-GB': [
        'Brian',
    ],
    // No male names for 'en-IN' yet.
    // No names for 'en-CA' yet.
    'de-DE': [
        'Hans',
    ],
    'es-ES': [
        'Enrique',
    ],
    'it-IT': [
        'Giorgio',
    ],
    'ja-JP': [
        'Takumi',
    ],
    'fr-FR': [
        'Mathieu',
    ],
};

var exports = module.exports = {};

function getSpeechOutputFor(nationality, lang, voiceNames) {
    if (voiceNames[lang]) {
        const voiceName = voiceNames[lang][Math.floor(Math.random() * voiceNames[lang].length)];
        var iAm;
        if (lang.startsWith('de')) {
            iAm = 'Ich spreche deutsch und mein Name ist';
        } else if (lang.startsWith('en')) {
            iAm = 'I speak English and my name is';
        } else if (lang.startsWith('es')) {
            iAm = 'Hablo español y mi nombre es';
        } else if (lang.startsWith('it')) {
            iAm = 'Parlo italiano e mi chiamo';
        } else if (lang.startsWith('ja')) {
            iAm = '私は日本語を話し、私の名前は';
        } else if (lang.startsWith('fr')) {
            iAm = "Je parle français et je m'appelle";
        } else {
            logger.error('unsupported language ' + lang);
            iAm = '<lang xml:lang="en-US">I try to speak English and my name is</lang>';
        }
        return '<voice name="' + voiceName + '">' + nationality + ': <lang xml:lang="' + lang + '">' + iAm + ' Alexa.</lang></voice>';
    }
    logger.error('lang not found: ' + lang);
};

exports.getFemaleSpeechOutputFor = (nationality, lang) => {
    return getSpeechOutputFor(nationality, lang, femaleVoiceNames);
};

exports.getMaleSpeechOutputFor = (nationality, lang) => {
    return getSpeechOutputFor(nationality, lang, maleVoiceNames);
};
