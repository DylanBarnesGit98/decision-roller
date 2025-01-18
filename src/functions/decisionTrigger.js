const { app } = require('@azure/functions');

app.http('decisionTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        let choices = [];

        // Check if method is GET and extract choices from query string
        if (request.method === 'GET') {
            choices = request.query.get('choices') ? request.query.get('choices').split(',') : [];
        }

        // Check if method is POST and extract choices from the body
        if (request.method === 'POST') {
            const body = await request.json();
            choices = body.choices ? body.choices : [];
        }

        // Validate that a valid list of options is provided
        if (choices.length === 0) {
            return { status: 400, body: 'Kannst du dich nicht entscheiden, was du essen möchtest? Gib mir deine Liste, und ich wähle für dich! In Postman POST Syntax: { "choices": ["Pizza", "Burger", "Salat"] }, oder als URL mit dem Anhang .../decisionTrigger?choices=Pizza,Burger,Salat' };
        }

        if (choices.length === 1) {
            return { status: 400, body: 'Bitte gib mehr als 1 Eintrag ein.' };
        }

        // Make a random decision
        const decision = choices[Math.floor(Math.random() * choices.length)];

        // Return the random decision
        return { body: JSON.stringify({ decision }) };
    }
});
