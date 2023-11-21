const { program } = require('commander');
const dotenv = require('dotenv');
const { devLogger, stageLogger, prodLogger } = require('../utils/logger/logger');

program.version('1.0.0').description('Program to build our server with a specific environment').option('-m, --mode <mode>', 'Execution environment', 'development').option('-p, --persistence <persistence>', 'Persistence type', 'MONGO').parse();

const args = program.opts();
let envFilePath = '';
if (args.mode === 'production') {
  envFilePath = './.env.production';
  prodLogger.info('→ Starting Production environment');
} else if (args.mode === 'staging') {
  envFilePath = './.env.staging';
  stageLogger.info('→ Starting Staging environment');
} else if (args.mode === 'staging') {
} else {
  envFilePath = './.env.development';
  devLogger.info('→ Starting Development environment');
}
dotenv.config({
  path: envFilePath,
});
const config = {
  port: process.env.PORT,
  cookie_key: process.env.COOKIE_KEY,
  secret_key: process.env.SECRET_KEY,
  github_client_id: process.env.GITHUB_CLIENT_ID,
  github_secret_key: process.env.GITHUB_SECRET_KEY,
  github_callback_url: process.env.GITHUB_CALLBACK_URL,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires: process.env.JWT_EXPIRES_IN,
  jwt_algorithm: process.env.JWT_ALGORITHM,
  nodemailer_user: process.env.NODE_MAILER_USER,
  nodemailer_pass: process.env.NODE_MAILER_PASSWORD,
  twilio_sid: process.env.TWILIO_ACCOUNT_SID,
  twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
  twilio_phone_number: process.env.TWILIO_PHONE_NUMBER,
  stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
};
const db = {
  mongo_local: process.env.MONGO_URL_LOCAL,
  mongo_atlas: process.env.MONGO_URL_ATLAS,
  dbName: process.env.DB_NAME,
};
module.exports = {
  args,
  config,
  db,
  persistence: args.persistence,
};
