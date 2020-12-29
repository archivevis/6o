import { client } from '../../main';
import { CommandContext } from '../../models/command_context';
import { Command } from '../command';
import { player } from '/player';

export class PlaySong implements Command {
  commandNames = ['play', 'p'];

  getHelpMessage(commandPrefix: string): string {
    return `Plays a song from YouTube.
Usage: \`${commandPrefix}play [YouTube URL/search query]\``;
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    try {
      // check for if author is in voice channel
      const voiceChannel =
        parsedUserCommand.originalMessage.member?.voice.channel;
      // check for ability to connect + speak
      const canConnect = parsedUserCommand.originalMessage.guild?.me?.hasPermission(
        'CONNECT',
      );
      const canSpeak = parsedUserCommand.originalMessage.guild?.me?.hasPermission(
        'SPEAK',
      );

      if (!voiceChannel) {
        parsedUserCommand.originalMessage.channel.send(
          'You need to be in a voice channel to play music!',
        );
        return;
      }

      if (!canConnect || !canSpeak) {
        parsedUserCommand.originalMessage.channel.send(
          "I can't join or speak in the voice channel!",
        );
        return;
      }
      // check if queue is empty first
      if (!player.getQueue(parsedUserCommand.originalMessage.guild.id)) {
        const isPlaying = player.isPlaying
      }

    } catch (error) {
      console.log(error);
    }
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }
}
