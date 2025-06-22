## AWS Amplify React+Vite Starter Template

This repository provides a starter template for creating applications using React+Vite and AWS Amplify, emphasizing easy setup for authentication, API, and database capabilities.

## Overview

This template equips you with a foundational React application integrated with AWS Amplify, streamlined for scalability and performance. It is ideal for developers looking to jumpstart their project with pre-configured AWS services like Cognito, AppSync, and DynamoDB.

## Features

- **Authentication**: Setup with Amazon Cognito for secure user authentication.
- **API**: Ready-to-use GraphQL endpoint with AWS AppSync.
- **Database**: Real-time database powered by Amazon DynamoDB.

## Running locally (via AWS Amplify Sandbox)

To run the application locally, follow these steps:
- aws configure sso (if not already configured)
- aws sso login --profile codexcommunion-profile
- npm run sandbox

then in another terminal:
- npm run dev

## Deploying to AWS

For detailed instructions on deploying your application, refer to the [deployment section](https://docs.amplify.aws/react/start/quickstart/#deploy-a-fullstack-app-to-aws) of our documentation.

There are a few prerequisites needed in Amplify:
- Various Environment Variables and Secrets. Check the `amplify.yml` file to see the variables that are referenced which need to be set in the Amplify Console.
- NOTE: some of these are sensitive and should be set as secrets in the Amplify Console (TODO)

The build/runner machine also needs to have Node 22, which is not the default, this needs to be changed.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.