import Discord from 'discord.js';
import { CommandContext } from '../../models/command_context';
import { Command } from '../command';

export class Avatar implements Command {
  commandNames = ['avatar', 'av', 'avi', 'pfp'];

  getHelpMessage(commandPrefix: string): string {
    return `Grabs the avatar of one user (you by default).
Usage: \`${commandPrefix}avatar [user - optional]\``;
  }

  aviEmbed = (username: string, tag: string, image: string) =>
    new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle(`${username}#${tag}'s avatar`)
      .setImage(image);

  async run(parsedUserCommand: CommandContext): Promise<void> {
    let mention = parsedUserCommand.originalMessage.mentions.users.first();

    if (!mention) {
      mention = parsedUserCommand.originalMessage.author;
    }

    const avatarURL = mention.avatarURL({ size: 256, dynamic: true });

    if (!avatarURL) {
      await parsedUserCommand.originalMessage.reply('No profile image!');
      return;
    }

    await parsedUserCommand.originalMessage.channel.send(
      this.aviEmbed(mention.username, mention.tag, avatarURL),
    );
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }
}
