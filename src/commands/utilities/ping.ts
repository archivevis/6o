import { client } from '../../main';
import { CommandContext } from '../../models/command_context';
import { Command } from '../command';

export class Ping implements Command {
  commandNames = ['ping'];

  getHelpMessage(commandPrefix: string): string {
    return `${commandPrefix}ping - tests Miyeon's connection.`;
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    const message = await parsedUserCommand.originalMessage.channel.send(
      'Pong! 🏓',
    );
    message.edit(
      `🏓 Ping: ${Math.round(
        message.createdTimestamp -
          parsedUserCommand.originalMessage.createdTimestamp -
          client.ws.ping,
      )}ms`,
    );
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }
}
