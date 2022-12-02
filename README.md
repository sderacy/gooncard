# The G.O.O.N. Card

---

The Generated Optional Online Networking (GOON) card is a digital business card with emphasis on **optional** - now you can choose exactly _which_ social media accounts you wish to share with the world! Dynamically select as many or as few of your linked accounts as you wish, and create a customized business card on the fly.

Created at TCNJ in the Fall 2022 semester by The Goon Squad:

- Payton shaltis
- Leah Kazenmayer
- Nisha Reddy
- Sterly Deracy
- Shane Matyi

## Table of Contents

1. [Project Structure](#project-structure)
2. [Running the Application Locally](#running-the-application-locally)
3. [Development Process](#development-process)
4. [Accessibility](#accessibility)
5. [Features](#features)
6. [Use Cases](#use-cases)
7. [Concerns/Guidelines](#concernsguidelines)
8. [Routes](#configured-routes)

## Project Structure

---

### File and Directory Structure

The GOON card is a web application at heart, and its file and directory structure attempts to reflect that. The general flow of file interaction in our project involves the following:

1. The user accesses one of many routes that have been defined in our server.
2. The server processes the user's request based on the current route and any information that has been sent by the user.
3. The server responds with a view that is rendered by the client, including HTML, CSS, and JavaScript files.

#### Files

The root directory contains the following files:

- `.gitignore`: Files to be ignored by git and GitHub.
- `.prettierrc`: Configuration file for the Prettier extension.
- `LICENSE`: The license for the project.
- `package.json`: The file that contains the project's metadata, as well as the list of dependencies. This file is used by `npm`, our dependency manager for the project, in order to install the dependencies. Read more about dependencies [here](#dependencies).
- `package-lock.json`: Created after installing all dependencies locally. Used only to specify the exact version of each dependency that was installed.
- `README.md`: The file you are currently reading.
- `server.js`: The most important file in the entire project. This is the entry point for the application, and is responsible for starting the server and listening for requests. It also contains the code for setting up the database connection, as well as the code for setting up the routes for the application. Because routes are defined in their own modules, this file simply imports the routes and sets them up. For this reason, our server file is very modular and easy to maintain at less than 60 lines of code.

#### Subdirectories

The root directory contains the following subdirectories:

- `db`: Contains the SQLite database file, the original schema SQL file used for generating the database, as well as a number of JavaScript modules that define the interfaces for accessing data from each database table. Read more about the database and its schema [here](#database-schema).
- `docs`: Contains development documentation for the project, including the design diagrams for multiple iterations of the database schema.
- `node_modules`: The application uses `npm` in order to manage dependencies. Cloning the project from GitHub will not create this directory by default, but it can be created by running `npm install` in the root directory of the project. See more about dependencies [here](#dependencies).
- `public`: Contains the static assets and commonly shared files that make up the application, such as CSS styles and background images.
- `routes`: Contains the JavaScript modules that define the routes for the application. Each set of routes has been logically divided into their own module according to type. Read more about routes [here](#configured-routes).
- `util`: This folder contains any of the utility functions that are used throughout the application. These functions are not specific to any one module, and are instead used by multiple modules in the application. The main utility in this folder is the middleware used by routes to ensure that a user is logged in.
- `views`: Contains the HTML Embedded Java Script (EJS), CSS, and JavaScript files for each page. Each page's set of files is logically separated into its own subdirectory based on the page's purpose. These are the files that get served when a user accesses a valid route. EJS was used over HTML in many cases since it can be templated to dynamically generate HTML based on the data passed to it.

### Dependencies

Our project uses Node Package Manager (`npm`) for managing and installing dependencies. The list of dependencies can be found in the `package.json` file in the root directory of the project. The dependencies are listed in the `dependencies` section of the file. The `devDependencies` section contains the dependencies that are only used during development, such as the `nodemon` package that automatically restarts the server when changes are made to the code or the `prettier` package that formats the code to a consistent style.

Some of the more critical non-development dependencies are as follows:

- `express` and `express-session`: These packages are used as the main NodeJS server framework and session management library, respectively.
- `sqlite3` and `knex`: These packages are used to connect to the SQLite database and execute SQL queries.
- `bcrypt`: Used for hashing and salting passwords. All passwords are stored hashed in the database.
- `body-parser` and `ejs`: These packages are used to parse the request body and render the EJS files, respectively.
- `uuid`, `address`: Utilities used in various places throughout the application to simplify IP address resolution and UUID generation.

#### Versions and Installing Dependencies

In order to install dependencies, make sure that you have `node` and `npm` installed. Navigate to the root of the project and run the following command to install all of the dependencies listed in the `package.json` file:

```bash
npm install
```

This will create the `node_modules` subdirectory with all required dependencies installed locally. The `package-lock.json` file will also be created, which specifies the exact version of each dependency that was installed.

**The versions required for each dependency are specified in the `package.json` file.** This ensures that the same versions of each dependency are used by all developers working on the project. `npm` does not always specify the exact version used (for example, `^5.1.0` indicates any version at or above `5.1.0`), so exact versions will vary based on when `npm i` or `npm install` is run to install the dependencies.

### Database

The project uses an SQLite database, which is a file-based database. The database file is not included in the GitHub repository, so it will need to be created after cloning the repo. A description of the schema and instructions on setting up the database are included below.

#### Database Schema

We are using an SQLite database in order to store users' preferred settings as well as their account information. Below is a diagram of the database's current schema.

![Database Schema](./docs/db/db-schema-v2.png)

- Because each user will have the same set of options, it makes more sense to store this as a JSON object within the `users` table and parse it later.
- Because each user will likely have a different number of social media accounts, it makes more sense to store these in a seperate table and link the two with a foreign key.
- The `card_entries` table will be used to keep track of which social media accounts are linked to which card. This will allow us to quickly and efficiently generate new Goon Cards without needing to create a new file for each card.

#### Local Database Setup

In order to run the app locally, the database also needs to exist in the project directory. In order to prevent the database from being committed to the repo, it is ignored by git. To create the database, run `npm run seed` in the main project directory. This will:

1. Delete the database file if it already exists.
2. Create a new database file.
3. Create the tables.
4. Seed the database with some sample data from `./seed.js`.

When testing the application locally, any data that you add will be deleted and the database reseeded with another run of `npm run seed`. This configuration is just for testing the application while we develop; once we start testing with other users, we can change the configuration to persist data.

## Running the Application Locally

---

After understanding the structure of the application and how to install dependencies and set up the database, the server can be run to begin listening for requests. Follow the instructions below in order to begin running the application:

1. Make sure that you have installed all dependencies as described in the [dependencies section](#dependencies).
2. (Required on first run) Make sure that you have configured the database as described in the [database section](#database).
3. Run `npm start` to start the server locally on port 3000. Make sure that no other processes are running on port 3000 or this command will exit with an error.
4. You can access the server at `http://localhost:3000`, or on other computers on the same network if you know your local IP address.

## Development Process

---

GitHub allows us to develop in a mostly individual manner, but still allows us to collaborate on the same codebase. While there were plenty of times that we worked together on the same code at the same time, the issue of keeping things consistent naturally came up rather early in the process.

Throughout development of the project, a number of utilities were taken advantage of in order to streamline the contribution process. Below includes some of the main tools used for development:

### Prettier Formatting

The `.prettierrc` file stores the formatting rules for the project. It is used by the `prettier` package to format the code. You can format all code in the project by running `npm run format` after writing code in order to adjust whitespace, indentation, and blank lines between code. This should hopefully avoid commits that include mostly formatting changes.

Currently, Prettier doesn't support `.ejs`, but you can get around this by using the VSCode extension and setting your default formatter in VSCode to Prettier and adjust the `.ejs` association to `HTML` like in [this link](<https://stackoverflow.com/questions/59238175/visual-studio-code-isnt-recognising-ejs#:~:text=5-,Working%20solution,-(September%202021)>). The extension allows you to use the VSCode option to auto-format on save, which is definitely recommended.

### Scripts

There are 6 development scripts used in this project. These are used to run the server, format the code, and seed the database. The scripts are as follows:

#### For Local Development

The following scripts should only be run on your local machine:

1. `npm start` - Starts up the server locally so that you can use the application.
2. `npm run cleanStart` - Runs a combination of the format, seed, and start commands in order.

#### For HPC Cluster Development

The following scripts should only be run on the HPC cluster:

3. `npm run start-vm` - Runs the server on the TCNJ VM with the appropriate gooncard.hpc.tcnj.edu web address.
4. `npm run cleanStart-vm` - Runs a combination of the format, seed, and start commands in order, but again, specifically for the VM.

#### For All Development

The following scripts can be run on either your local machine or the HPC cluster:

5. `npm run format` - Formats the application code using Prettier formatting as described in the [Prettier formatting section](#prettier-formatting).
6. `npm run seed` - Deletes the existing database file (if there is one), creates a new database file, creates the tables, and seeds the database with sample data for two GOON card users.

When you make a change (at least on the front-end side), you should just be able to refresh the page. Changes to routes or backend files require a restart of the server.

Before you push the code to the repo to make a Pull Request, make sure to run `npm run format` to format the code so that it matches the repo's white space and indentation.

If you get a message about files being modified and changing from LF to CLF for example, do `git add -A` to fix the issue.

## Accessibility

---

Below are some accessibility features and concerns that the application has.

## Features

---

Below are a number of features that the GOON Card application curreently includes:

- Settings Page allows users to customize their display. For example, a user can modify their name, font-size, font-family, contrast, and theme. This functionality was implemented to let users with visual or other limitations to have a more user-friendly accessible application.
- The web application is responsive on both mobile versions and desktop versions for users with a wide variety of devices.
- We will implement a speech recognition feature where users can dictate a command into the device's microphone after selecting the microphone icon and have the action be carried out. This feature is to help users with physical impairments or restrictions.
- Visual displays such as icons or codes or potentially unrecognizable entities will have alt tags for users with screen readers to be able to identify.

## Use Cases

---

- A user can register an account on this application
- A user can input, edit, and delete their social media information.
- A user can select which social media information to share and generate a QR code associated with their selections to share with others.

## Concerns/Guidelines

---

- Check out [this link](https://www.smashingmagazine.com/2021/03/complete-guide-accessible-front-end-components/) for accessiblity guidelines to consider.

## Configured Routes

---

As mentioned in the [file and directory structure section](#file-and-directory-structure), routes are the lifeblood of the application's backend. Each route defines a certain set of actions that the user can take, as well as the appropriate page view files that will be sent back as a response. The section linked above includes the location for all routes if closer inspection is required, but a more general outline of the routes is included below:

### `home` Routes

- `GET /` - Loads the home page if logged in, otherwise redirects to the login page. The home page is passed the user object for displaying information about the user.
- `GET /home/style` - Serves the home page's stylesheet.
- `GET /home/main` - Serves the home page's JavaScript.

### `account/login` Routes

- `GET /account/login` - Loads the login page, passing it an error that can be optionally displayed.
- `GET /account/login/style` - Serves the login page's stylesheet.
- `GET /account/login/main` - Serves the login page's JavaScript.
- `POST /account/login` - Attempts to log the user in. If successful, redirects to the home page. If unsuccessful, redirects to the login page with an error message. Used in form submission.

### `account/logout` Routes

- `GET /account/logout` - Logs the user out and redirects to the login page. This is implemented as a GET method in order to use it in an `<a>` tag.

### `account/signup` Routes

- `GET /account/signup`- Loads the signup page, passing it an error that can be optinally displayed.
- `GET /account/signup/style` - Serves the signup page's stylesheet.
- `GET /account/signup/main` - Serves the signup page's JavaScript.
- `POST /account/signup` - Attempts to create a new user. If successful, redirects to the home page. If unsuccessful, redirects to the signup page with an error message. Used in form submission.

### `account/profile` Routes

- `GET /account/profile` - Loads the profile page, passing it the user object for displaying information about the user.
- `GET /account/profile/style` - Serves the profile page's stylesheet.
- `GET /account/profile/main` - Serves the profile page's JavaScript.
- `GET /account/profile/getsettings` - Returns the users selected settings
- `GET /account/profile/getall` - Returns all the user_accounts associated with the user or null if the user has no accounts.
- `POST /account/profile/update` - Updates the user's settings. Used in form submission.

### `account/settings` Routes

- `GET /account/settings` - Loads the settings page, passing it the user object for displaying information about the user.
- `GET /account/settings/style` - Serves the settings page's stylesheet.
- `GET /account/settings/main` - Serves the settings page's JavaScript.
- `GET /account/settings/update` - Updates the user's settings. Used in form submission.

### `aboutus` Routes

- `GET /aboutus` - Loads the about us page if logged in, otherwise redirects to the login page.
- `GET /aboutus/style` - Serves the about us page's stylesheet.
- `GET /aboutus/main` - Serves the about us page's JavaScript.

### `displaycard` Routes

- `GET /displaycard` - Loads the page to display a single GOON card. Requires the query parameter `id` to be set to the ID of the card to display. If the card does not exist, the user is redirected to the 404 page.
- `GET /displaycard/style` - Serves the display card page's stylesheet.
- `GET /displaycard/main` - Serves the display card page's JavaScript.

### `notfound` Routes

- `GET /notfound` - Loads the 404 page. This page should only be directed to if the user tries accessing a GOON card that does not exist.
- `GET /notfound/style` - Serves the 404 page's stylesheet.
- `GET /notfound/main` - Serves the 404 page's JavaScript.
