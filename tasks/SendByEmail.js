const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.handle = async function (to, headers, cells) {
  await sendgrid.send({
    personalizations: [{ to: [{ email: to }] }],
    content: [{
        type: "text/plain",
        value: "Here is your result: \n" + JSON.stringify([headers].concat(cells), null ,2)
    }],
    subject: "SW results",
    from: { email: "zenaton-tutorial@zenaton.com" }
  });
};
