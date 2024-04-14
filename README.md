## Codebase

This NestJS application is a modern and scalable backend solution built to provide robust API services. It follows the principles of clean architecture, leveraging the modular structure of NestJS to promote code reusability and maintainability.

### Features:

- **RESTful API:** Provides a RESTful API architecture for easy integration with frontend applications and third-party services.
- **MongoDB Integration:** Utilizes MongoDB as the primary database, providing flexibility and scalability for handling large volumes of data.
- **Redis Integration:** Implements Redis for caching and session management, improving performance and scalability.
- **JWT Authentication:** Secures API endpoints using JSON Web Tokens (JWT), ensuring secure authentication and authorization.
- **Dockerized Environment:** Utilizes Docker and Docker Compose for containerization, making the development and deployment process consistent across different environments.
- **Mongo Express and Redis Commander:** Includes web-based admin interfaces for MongoDB and Redis management using Mongo Express and Redis Commander respectively.

### Structure:

The codebase is organized into modules, each responsible for a specific domain or feature. This modular structure promotes code organization, separation of concerns, and ease of maintenance.

### Development Workflow:

1. **Setup:** Clone the repository and install dependencies using `npm install`.

2. **Environment Configuration:** Create `.env.dev` file for local development and `.env` for production, and configure environment variables as per the provided examples.

3. **Start Development Server:** Run `npm run docker:dev` to start the development server and access the API endpoints locally.

4. **Database Management:** Access MongoDB and Redis databases using Mongo Express and Redis Commander web interfaces respectively.

5. **Deployment:** Use Docker Compose to deploy the application in production environments, ensuring consistency and reliability across deployments.

## Environment Configuration

| Variable Name                     | Example                                           | Description                                       |
|----------------------------------|---------------------------------------------------|---------------------------------------------------|
| PORT                             | 3000                                              | The port on which the server will run             |
| DATABASE_NAME                    |                                                   | Name of the MongoDB database                      |
| DATABASE_USERNAME                |                                                   | Username for MongoDB authentication               |
| DATABASE_PASSWORD                |                                                   | Password for MongoDB authentication               |
| DATABASE_PORT                    | 27017                                             | Port on which MongoDB is running                  |
| DATABASE_HOST                    |                                                   | Host where MongoDB is located                     |
| DATABASE_URI                     | mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}                                                 | Connection URI for MongoDB                        |
| REDIS_HOST                       |                                                   | Host where Redis is located                       |
| REDIS_PORT                       | 6379                                              | Port on which Redis is running                    |
| REDIS_COMMANDER_USER             |                                                   | Username for accessing Redis Commander            |
| REDIS_COMMANDER_PASS             |                                                   | Password for accessing Redis Commander            |
| JWT_ACCESS_TOKEN_SECRET          |                                                   | Secret key used to sign JWT access tokens         |
| JWT_REFRESH_TOKEN_SECRET         |                                                   | Secret key used to sign JWT refresh tokens        |
| JWT_ACCESS_TOKEN_EXPIRATION_TIME | 1800 (30 min)                                     | Expiration time for JWT access tokens (in seconds)|
| JWT_REFRESH_TOKEN_EXPIRATION_TIME| 25200 (1 week)                                    | Expiration time for JWT refresh tokens (in seconds)|

Make sure to configure these environment variables either through a `.env.dev` file for local development or `.env` for production before running the application.

**Note:** To ensure easy reference and save time during deployment, please remember to update this table with any new environment variables you add to the project.

## Using Mongo Express and Redis Commander
After run project with docker you can using `Mongo Express` and `Redis Commander`.

### Mongo Express

Mongo Express is a web-based MongoDB admin interface. To access Mongo Express:

- Once the containers are running, open your web browser and go to `http://localhost:8002`.

- Log in using the MongoDB username and password specified in your `.env.dev` or `.env` file.

### Redis Commander

Redis Commander is a web-based Redis client and admin tool. To access Redis Commander:

- Once the containers are running, open your web browser and go to `http://localhost:8001`.

- Log in using the MongoDB username and password specified in your `.env.dev` or `.env` file.

## Reminder: Install Dev Containers Extension for Visual Studio Code

To ensure proper code suggestions and compatibility with the Docker development environment, we recommend installing the `Dev Containers` extension for Visual Studio Code.