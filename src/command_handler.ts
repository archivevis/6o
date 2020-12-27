import { Message } from 'discord.js';
import { Command } from './commands/command';
import { Bonk } from './commands/fun/bonk';
import { HelpCommand } from './commands/help/help';
import { Avatar } from './commands/utilities/avatar';
import { Ping } from './commands/utilities/ping';
import { Weather } from './commands/utilities/weather';
import { CommandContext } from './models/command_context';
import { reactor } from './reactions/reactor';

/** Handler for bot commands issued by users. */
export class CommandHandler {
  private commands: Command[];

  private readonly prefix: string;

  constructor(prefix: string) {
    const commandClasses = [
      // TODO: Add more commands here.
      Ping,
      Avatar,
      Weather,
      Bonk,
    ];

    this.commands = commandClasses.map((CommandClass) => new CommandClass());
    this.commands.push(new HelpCommand(this.commands));
    this.prefix = prefix;
  }

  /** Executes user commands contained in a message if appropriate. */
  async handleMessage(message: Message): Promise<void> {
    if (message.author.bot || !this.isCommand(message)) {
      return;
    }

    const commandContext = new CommandContext(message, this.prefix);

    const allowedCommands = this.commands.filter((command) =>
      command.hasPermissionToRun(commandContext),
    );
    const matchedCommand = this.commands.find((command) =>
      command.commandNames.includes(commandContext.parsedCommandName),
    );

    if (!matchedCommand) {
      await message.channel.send("I don't recognize that command. Try m!help.");
      await reactor.failure(message);
    } else if (!allowedCommands.includes(matchedCommand)) {
      await message.reply(
        "you aren't allowed to use that command. Try m!help.",
      );
      await reactor.failure(message);
    } else {
      await matchedCommand
        .run(commandContext)
        .then(() => {
          reactor.success(message);
        })
        .catch((reason) => {
          reactor.failure(message);
        });
    }
  }

  /** Determines whether or not a message is a user command. */
  private isCommand(message: Message): boolean {
    return message.content.startsWith(this.prefix.toLowerCase());
  }
}
