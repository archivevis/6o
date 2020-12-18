import Discord, { Message } from 'discord.js';
import { CommandHandler } from './command_handler';
import { BotConfig, config } from './config/config';

/** Pre-startup validation of the bot config. */
function validateConfig(botConf: BotConfig) {
  if (!botConf.token) {
    throw new Error('Bot token not specified...');
  }
}

validateConfig(config);

const commandHandler = new CommandHandler(config.prefix);

const client = new Discord.Client();
export { client };

client.on('ready', () => {
  console.log('Miyeon is ready!');
  client.user?.setActivity('m!help', { type: 'WATCHING' });
});

client.on('message', (message: Message) => {
  commandHandler.handleMessage(message);
});

client.on('error', (e) => {
  console.error('Discord client error!', e);
});

client.login(config.token);
