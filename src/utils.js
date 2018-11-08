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

// first line females, second line males
const voiceNames = {
    'en-US': [
        'Ivy', 'Joanna', 'Kendra', 'Kimberly', 'Salli',
        'Joey', 'Justin', 'Matthew',
    ],
    'en-AU': [
        'Nicole',
        'Russell',
    ],
    'en-GB': [
        'Amy', 'Emma',
        'Brian',
    ],
    'en-IN': [
        'Aditi', 'Raveena',
        // no male names yet
    ],
    // No names for 'en-CA' yet,
    'de-DE': [
        'Marlene', 'Vicki',
        'Hans',
    ],
    'es-ES': [
        'Conchita',
        'Enrique',
    ],
    'it-IT': [
        'Carla',
        'Giorgio',
    ],
    'ja-JP': [
        'Mizuki',
        'Takumi',
    ],
    'fr-FR': [
        'Celine', 'Lea',
        'Mathieu',
    ],
};

var exports = module.exports = {};

exports.getSpeechOutputFor = (voiceName) => {
    for (var lang in voiceNames) {
        for (var i = 0; i < voiceNames[lang].length; i++) {
            if (voiceName === voiceNames[lang][i]) {
                var iAm;
                if (lang.startsWith('de')) {
                    iAm = 'Ich spreche deutsch und mein Name ist';
                } else if (lang.startsWith('en')) {
                    iAm = 'I speak English and my name is';
                } else if (lang.startsWith('es')) {
                    iAm = 'Hablo español y mi nombre es';
                } else if (lang.startsWith('it')) {
                    iAm = 'Parlo francese e mi chiamo';
                } else if (lang.startsWith('ja')) {
                    iAm = '私はフランス語を話し、私の名前は';
                } else if (lang.startsWith('fr')) {
                    iAm = "Je parle français et je m'appelle";
                } else {
                    logger.error('unsupported language ' + lang);
                    iAm = '<lang xml:lang="en-US">I try to speak English and my name is</lang>';
                }
                return '<voice name="' + voiceName + '"><lang xml:lang="' + lang + '">' + iAm + ' ' + voiceName + '.</lang></voice>';
            }
        }
    }
    logger.error('voice name not found: ' + voiceName);
};
