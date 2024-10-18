const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 4175;

const app = http.createServer((req, res) => {

    // Serve index.html
    if (req.url === '/main' && req.method === 'GET') {
        const myPath = path.join(__dirname, 'index.html');
        fs.readFile(myPath, 'utf8', (err, data) => {
            if (!err) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    // Serve main1.css
    else if (req.url === '/main1.css' && req.method === 'GET') {
        const myPath = path.join(__dirname, 'main1.css');
        fs.readFile(myPath, 'utf8', (err, data) => {
            if (!err) {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data);
            }
        });
    }

    // Serve login.html
    else if (req.url === '/login' && req.method === 'GET') {
        const myPath = path.join(__dirname, 'login.html');
        fs.readFile(myPath, 'utf8', (err, data) => {
            if (!err) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    // Serve register.html
    else if (req.url === '/register' && req.method === 'GET') {
        const myPath = path.join(__dirname, 'register.html');
        fs.readFile(myPath, 'utf8', (err, data) => {
            if (!err) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    // Serve static image files
    else if (req.url.match(/\.(jpg|jpeg|png)$/)) {
        const imagePath = path.join(__dirname, req.url);
        fs.readFile(imagePath, (err, data) => {
            if (!err) {
                const ext = path.extname(req.url).substring(1);
                const mimeType = {
                    jpg: 'image/jpeg',
                    jpeg: 'image/jpeg',
                    png: 'image/png'
                }[ext];
                res.writeHead(200, { 'Content-Type': mimeType });
                res.end(data);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image not found');
            }
        });
    }

    // Handle POST request for registration
    else if (req.url === '/register' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const formData = new URLSearchParams(body);
            const registrationData = {
                name: formData.get('fullname'),
                email: formData.get('email'),
                password: formData.get('password')
            };

            const jsonFilePath = path.join(__dirname, 'registrations.json');
            fs.readFile(jsonFilePath, 'utf8', (err, data) => {
                let registrations = [];
                if (!err && data) {
                    registrations = JSON.parse(data);
                }

                const email = formData.get('email');
                const emailExist = registrations.find(registration => registration.email === email);
                if (emailExist) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end('<script>alert("User already registered!"); window.location.href="/register";</script>');
                    return;
                }

                registrations.push(registrationData);
                fs.writeFile(jsonFilePath, JSON.stringify(registrations, null, 2), (err) => {
                    if (!err) {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end('<script>alert("Registration Successful"); window.location.href="/login";</script>');
                    }
                });
            });
        });
    }

    // Serve login POST request
    else if (req.url === '/login' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const formData = new URLSearchParams(body);
            const email = formData.get('email');
            const password = formData.get('password');

            const jsonFilePath = path.join(__dirname, 'registrations.json');
            fs.readFile(jsonFilePath, 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end("Error reading registrations data.");
                    return;
                }

                const registrations = JSON.parse(data || '[]');
                const user = registrations.find(reg => reg.email === email && reg.password === password);

                if (user) {
                    const successPage = `
                        <html>
                            <body>
                                <h1>Login successful!</h1>
                                <a href="/main">Go to Main</a>
                            </body>
                        </html>`;
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(successPage);
                } else {
                    const errorPage = `
                        <html>
                            <body>
                                <h1>Invalid email or password!</h1>
                                <a href="/login">Try again</a>
                            </body>
                        </html>`;
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(errorPage);
                }
            });
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}...`);
});
