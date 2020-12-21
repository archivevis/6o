import { client } from '../../main';
import { CommandContext } from '../../models/command_context';
import { Command } from '../command';

export class Weather implements Command {
  commandNames = ['weather'];

  getHelpMessage(commandPrefix: string): string {
    return `${commandPrefix}weather - fetches the weather from OpenWeatherAPI.`;
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    return;
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }
}
