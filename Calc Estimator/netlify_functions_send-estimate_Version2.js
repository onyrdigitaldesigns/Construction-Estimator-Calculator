const nodemailer = require('nodemailer');

const ADMIN_EMAIL = "ryno@itsonyr.com";
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        const data = JSON.parse(event.body);

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS,
            }
        });

        const htmlMessage = `
            <h2>Construction Estimate</h2>
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Location:</strong> ${data.projectLocation}</p>
            <p><strong>Zip Code:</strong> ${data.zipCode}</p>
            <hr>
            <p><strong>Project Type:</strong> ${data.projectType}</p>
            <p><strong>Square Footage:</strong> ${data.squareFootage}</p>
            <p><strong>Quality Level:</strong> ${data.qualityLevel}</p>
            <p><strong>Complexity:</strong> ${data.complexity}</p>
            <p><strong>Location Type:</strong> ${data.location}</p>
            <hr>
            <p><strong>Base Estimate:</strong> $${parseInt(data.baseEstimate).toLocaleString()}</p>
            <p><strong>Total with Contingency:</strong> $${parseInt(data.totalEstimate).toLocaleString()}</p>
        `;

        const recipients = [data.email, ADMIN_EMAIL];
        for (const to of recipients) {
            await transporter.sendMail({
                from: `"Construction Estimator" <${EMAIL_USER}>`,
                to,
                subject: "Your Construction Cost Estimate",
                html: htmlMessage,
            });
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to send email." }),
        };
    }
};