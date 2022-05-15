# Contributing to GradeJS Backend

Before doing the further actions,
install [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com),
clone this repository,
open a terminal in the root of the repository
and run:

```bash
yarn install
```

The required Node.js version is specified in the `package.json` file. Consider using [NVM](https://github.com/nvm-sh/nvm) utility to switch to the correct version.

## Running locally

For some unit tests, such as API route testing, you will need to use a local PostgreSQL instance. A local database is also needed for running the application locally.

Create a docker container with a local PostgreSQL instance by running this commands:

```bash
docker-compose up -d db

# Create all required tables.
yarn --cwd packages/shared migration:run
```

```bash
# Run later to stop the database service:
docker-compose down
```

Run the server API:

```bash
yarn --cwd packages/public-api build
yarn --cwd packages/public-api start
```

Run the web application:

```bash
yarn --cwd packages/web start
```

In order to view database logs, consider enabling [TypeORM logging](https://orkhan.gitbook.io/typeorm/docs/logging) in the `connection.ts` file at the `@gradejs/public-api` package or using the following command:

```bash
docker logs -f db
```

## Server Deployment

### Initial setup

1. Sign in to [AWS](https://console.aws.amazon.com/).
2. Consider creating a PostgreSQL table before the first deployment:

- Open the [AWS RDS](https://us-east-2.console.aws.amazon.com/rds/home) page.
- In the database list click on the `Create Database` button.
- Select the following parameters: Standart create, Amazon Aurora PostgreSQL-Compatible Edition version 13, Production template.
- Enter the database name, for example `gradejs-public`.
- Select a burstable DB instance class: `db.t3.medium`
- Select `Don't create an Aurora Replica` option.
- Consider disabling public access for the production environment.
- In the `Additional configuration` section set the `Initial database name` to `gradejs`.
- Click in the create button. The initial migration will be executed by the application during the first deployment.

3. Create an [AWS Elastic Beanstalk](https://us-east-2.console.aws.amazon.com/elasticbeanstalk/home) application:

- Open the [AWS Elastic Beanstalk](https://us-east-2.console.aws.amazon.com/elasticbeanstalk/home) page, select the `Applications` section and click on the `Create a new application` button.
- Enter or select the application name, for example `gradejs`.

4. Create an [AWS Elastic Beanstalk](https://us-east-2.console.aws.amazon.com/elasticbeanstalk/home) API environment:

- Open the [AWS Elastic Beanstalk](https://us-east-2.console.aws.amazon.com/elasticbeanstalk/home) page and click on the `Create a new environment` button.
- Select `Web server environment` option.
- Type the newly created application name (`gradejs`).
- Specify an environment name, for example `gradejs-public-api`. Leave the domain and description name fileds blank.
- Select the latest version of Node.js 16 managed platform on Amazon Linux 2. The version minimal required version is 5.5.1.
- Use the sample application code and click on the `Configure more options` button.
- Select the `Custom configuration` configuration preset.
- In the `Software` section click on the `Edit` button.
- Enable the `CloudWatch` log streaming with a 5 day retention.
- Specify the `AWS_REGION` environment variable. It should be the same as your current AWS environemnt. For example, `us-east-2`.
- Specify the `DB_URL` environment variable. It should point to the newly created RDS database. For example: `postgres://postgres:<secret>@<hostname>/gradejs`.
- Specify the `INTERNAL_API_ORIGIN` environment variable. Consider using our staging internal API origin: `http://fpjs-dev-gradejs-internal-api.eba-fybi4md5.us-east-1.elasticbeanstalk.com`
- Click on the `Save` button and then click on the `Create environment` button.

5. Setting up a `Continuous Deploy` pipeline:

- Go to the [AWS CodePipeline](https://us-east-2.console.aws.amazon.com/codesuite/codepipeline/pipelines) page and click on the `Create pipeline` page.
- Type a pipeline name `gradejs-public@production-deploy` and click on the `Next` button.
- Select the `Github 2` source provider and select the `gradejs` repository. For the production environment a `branch name` should be `master` and for staging -- `develop`.
- Click on the `Next` button.
- Select the `AWS CodeBuild` build provider.
- Create a `AWS CodeBuild` project. The name of a project should be `gradejs-public`. Select the `Ubuntu` operating system with the latest version of the `aws/codebuild/standart:5.0` image. Click on the `privileged` flag. Leave the rest as defaults and click on the `Continue to CodePipeline` button.
- Set the buildspec name to `packages/public-api/buildspec.yml`
- Click on the `Next` button on the build stage page.
- Select the `AWS Elastic Beanstalk` deploy provider.
- Select the `gradejs-public-api` environment name.
- Click on `Next` button and then on the `Create pipeline` button.
