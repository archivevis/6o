import { Player } from 'discord-music-player';
import { client } from '../../main';

export const player = new Player(client, {
  leaveOnEnd: false,
  leaveOnStop: false,
  leaveOnEmpty: false,
  quality: 'high',
});
