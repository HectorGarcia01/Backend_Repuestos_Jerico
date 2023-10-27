const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { 
    CLIENT_ID_MAIL, 
    CLIENT_SECRET_MAIL, 
    REDIRECT_URI_MAIL, 
    REFRESH_TOKEN_MAIL 
} = require('../config/config');

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID_MAIL,
    CLIENT_SECRET_MAIL,
    REDIRECT_URI_MAIL
);

oAuth2Client.setCredentials({ 
    refresh_token: REFRESH_TOKEN_MAIL 
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'hg2779948@gmail.com',
        clientId: CLIENT_ID_MAIL,
        clientSecret: CLIENT_SECRET_MAIL,
        refreshToken: REFRESH_TOKEN_MAIL,
        accessToken: oAuth2Client.getAccessToken()
    }
});

module.exports = transporter;