const http = require('http');
const static = require('node-static');
const querystring = require('node:querystring');

const port = process.env.PORT || 5002;

// Static file server to serve files from the exercise folder
const file = new static.Server('./exercise');

const server = http.createServer((req, res) => {
  // Main route to serve the welcome page
  if (req.method === 'GET' && req.url === '/') {
    file.serveFile('/welcome.html', 200, {}, req, res);
  }

  // Form route to serve the form page
  else if (req.method === 'GET' && req.url === '/form') {
    file.serveFile('/form.html', 200, {}, req, res);
  }

  // Form submission route to handle submitted form data
  else if (req.method === 'POST' && req.url === '/formExerciseSubmit') {
    let body = '';

    // Listener to collect form data as it is received
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    // Listener to process the form data after it is fully received
    req.on('end', () => {
      const userdata = querystring.parse(body);

      // Variables to store submitted name and email values
      const name = userdata.usernameInput;
      const email = userdata.emailInput;

      // Response page that displays the submitted information
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<p>Thank you for submitting your information:</p>');
      res.write(`<p>Name: ${name}</p>`);
      res.write(`<p>Email: ${email}</p>`);
      res.end();
    });
  }

  // Fallback route for any unknown page
  else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
