const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(req.url, req.method, req.headers);

    if (req.method === 'GET') {
        // Read messages from file
        const fileName = 'messages.txt';
        let existingMessages = '';

        try {
            existingMessages = fs.readFileSync(fileName, 'utf-8');
        } catch (error) {
            // Handle file not found error
            console.error('Error reading file:', error.message);
        }

        // Render the HTML form with existing messages
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.write('<html>');
        res.write('<head><title>Message Board</title></head>');
        res.write('<body>');
        res.write('<h1>Message Board</h1>');
        res.write('<div>');
        res.write('<h2>Existing Messages</h2>');
        res.write('<ul>');
        res.write(existingMessages.split('\n').map(msg => `<li>${msg}</li>`).join(''));
        res.write('</ul>');
        res.write('</div>');
        res.write('<form method="POST" action="/post-message">');
        res.write('<label for="message">New Message:</label><br>');
        res.write('<textarea name="message" rows="4" cols="50" required></textarea><br>');
        res.write('<input type="submit" value="Post Message">');
        res.write('</form>');
        res.write('</body>');
        res.write('</html>');
        res.end();
    } else if (req.method === 'POST' && req.url === '/post-message') {
        // Handle posting a new message
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const data = Buffer.concat(body);
            const newMessage = data.toString();

            // Append the new message to the file
            const fileName = 'messages.txt';
            fs.appendFileSync(fileName, `${newMessage}\n`, 'utf-8');

            // Redirect with a 302 response to avoid form resubmission
            res.writeHead(302, {
                'Location': '/'
            });
            res.end();
        });
    } else {
        // Handle other routes
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        res.write('Not Found');
        res.end();
    }
});

server.listen(3000);
console.log('Server running at http://localhost:3000');
