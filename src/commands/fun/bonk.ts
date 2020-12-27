import Canvas from 'canvas';
import Discord from 'discord.js';
import { CommandContext } from '../../models/command_context';
import { Command } from '../command';

export class Bonk implements Command {
  commandNames = ['bonk'];

  getHelpMessage(commandPrefix: string): string {
    return `Sends someone to horny jail.
Usage: \`${commandPrefix}bonk [user]\``;
  }

  bonkEmbed = (author: string, mention: string, attachment: any) =>
    new Discord.MessageEmbed()
      .attachFiles(attachment)
      .setColor('YELLOW')
      .setTitle(`${author} sends ${mention} to horny jail!`)
      .setImage('attachment://bonk.png');

  async run(parsedUserCommand: CommandContext): Promise<void> {
    const mention = parsedUserCommand.originalMessage.mentions.users.first();
    const { author } = parsedUserCommand.originalMessage;

    if (!mention) {
      await parsedUserCommand.originalMessage.channel.send(
        'You need to send SOMEONE to horny jail!',
      );
    } else {
      try {
        const canvas = Canvas.createCanvas(1315, 934);
        const ctx = canvas.getContext('2d');
        // have to upload the image, sigh
        const background = await Canvas.loadImage(
          'https://kiri.s-ul.eu/xsGOXQeG.png',
        );

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        const selfAvatar = await Canvas.loadImage(
          author.displayAvatarURL({ format: 'jpg' }),
        );
        ctx.drawImage(selfAvatar, 310, 225, 200, 200);

        const otherAvatar = await Canvas.loadImage(
          mention.displayAvatarURL({ format: 'jpg' }),
        );
        ctx.drawImage(otherAvatar, 838, 575, 200, 200);

        const attachment = new Discord.MessageAttachment(
          canvas.toBuffer(),
          'bonk.png',
        );

        await parsedUserCommand.originalMessage.channel.send(
          this.bonkEmbed(author.username, mention.username, attachment),
        );
      } catch (error) {
        console.log(`An error occured: ${error}`);
      }
    }
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }
}
