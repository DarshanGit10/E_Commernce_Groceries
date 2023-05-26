const AWS = require("aws-sdk");
require('dotenv').config();

const SES_CONFIG = {
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: 'ap-south-1',
};

const AWS_SES = new AWS.SES(SES_CONFIG);

module.exports = async (email, subject, html) => {
  const user = process.env.USER_EMAIL;
 // Verify the user-entered email address
//  await AWS_SES.verifyEmailIdentity({ EmailAddress: email }).promise();
  try {
    const params = {
      Source: user,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: html,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
    };

   

    const emailSent = await AWS_SES.sendEmail(params).promise();
    if (emailSent) {
      console.log('Email Sent');
    }
  } catch (error) {
    console.log(error);
  }
};
