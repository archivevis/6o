import { CommandContext } from '../../models/command_context';
import { Command } from '../command';

export class HelpCommand implements Command {
  readonly commandNames = ['help', 'halp', 'hlep'];

  private commands: Command[];

  constructor(commands: Command[]) {
    this.commands = commands;
  }

  async run(commandContext: CommandContext): Promise<void> {
    const allowedCommands = this.commands.filter((command) =>
      command.hasPermissionToRun(commandContext),
    );

    if (commandContext.args.length === 0) {
      // No command specified, give the user a list of all commands they can use.
      const commandNames = allowedCommands.map(
        (command) => command.commandNames[0],
      );
      await commandContext.originalMessage.channel.send(
        `Available commands: ${commandNames.join(', ')}` +
          "\nBuilt using hopskipnfall's TypeScript template, v0.4: https://github.com/hopskipnfall/discord-typescript-bot",
      );
      return;
    }

    const matchedCommand = this.commands.find((command) =>
      command.commandNames.includes(commandContext.args[0]),
    );
    if (!matchedCommand) {
      await commandContext.originalMessage.channel.send(
        "I don't know about that command :(. Try m!help to find all commands you can use.",
      );
      throw Error('Unrecognized command');
    }
    if (allowedCommands.includes(matchedCommand)) {
      await commandContext.originalMessage.channel.send(
        this.buildHelpMessageForCommand(matchedCommand, commandContext),
      );
    }
  }

  // Makes command aliases optional and only visible if there even are aliases.
  hasAliases(commandNames: string[]): boolean {
    return commandNames.length > 1;
  }

  private buildHelpMessageForCommand(
    command: Command,
    context: CommandContext,
  ): string {
    let message = `${command.getHelpMessage(context.commandPrefix)}\n`;
    if (this.hasAliases(command.commandNames)) {
      message += `Command aliases: ${command.commandNames.join(', ')}`;
    }

    return message;
  }

  hasPermissionToRun(commandContext: CommandContext): boolean {
    return true;
  }

  getHelpMessage(commandPrefix: string) {
    return `Shows help. I think. \nMiyeon's prefix: ${commandPrefix}`;
  }
}
