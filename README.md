# The G.O.O.N. Card Project

The Goon Squad's Goon Card Project for CSC 355 ('22)

<hr>

## -- Team Members --

- Payton shaltis
- Leah Kazenmayer
- Nisha Reddy
- Sterly Deracy
- Shane Matyi

## -- Backend Server --

Below are the instructions for running the backend server as well as an overview of the currently configured routes.

### Starting the Server

1. Make sure that you have downloaded all dependencies by running `npm install`.
2. Run `npm start` to start the server on its configured port.
3. You can access the server at `http://localhost:3000`, or on other computers on the same network if you know your local IP address.

### Configured Routes

#### `home` Routes

- `GET /` - Loads the home page if logged in, otherwise redirects to the login page. The home page is passed the user object for displaying information about the user.
- `GET /home/style` - Serves the home page's stylesheet.
- `GET /home/main` - Serves the home page's JavaScript.

#### `account/login` Routes

- `GET /account/login` - Loads the login page, passing it an error that can be optionally displayed.
- `POST /account/login` - Attempts to log the user in. If successful, redirects to the home page. If unsuccessful, redirects to the login page with an error message. Used in form submission.

#### `account/logout` Routes

- `GET /account/logout` - Logs the user out and redirects to the login page. This is implemented as a GET method in order to use it in an `<a>` tag.

#### `account/signup` Routes

- `GET /account/signup`- Loads the signup page, passing it an error that can be optinally displayed.
- `POST /account/signup` - Attempts to create a new user. If successful, redirects to the home page. If unsuccessful, redirects to the signup page with an error message. Used in form submission.
