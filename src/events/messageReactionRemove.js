//  ______   __                      __                                  
// /      \ |  \                    |  \                                 
//|  $$$$$$\| $$  _______  ______  _| $$_     ______   ______   ________ 
//| $$__| $$| $$ /       \|      \|   $$ \   /      \ |      \ |        \
//| $$    $$| $$|  $$$$$$$ \$$$$$$\\$$$$$$  |  $$$$$$\ \$$$$$$\ \$$$$$$$$
//| $$$$$$$$| $$| $$      /      $$ | $$ __ | $$   \$$/      $$  /    $$ 
//| $$  | $$| $$| $$_____|  $$$$$$$ | $$|  \| $$     |  $$$$$$$ /  $$$$_ 
//| $$  | $$| $$ \$$     \\$$    $$  \$$  $$| $$      \$$    $$|  $$    \
// \$$   \$$ \$$  \$$$$$$$ \$$$$$$$   \$$$$  \$$       \$$$$$$$ \$$$$$$$$
//=======================================================================                                                                      
//● Crée par GalackQSM le 09 novembre 2019 Update and cover by LeZ in 2025
//● Serveur Discord: https://discord.gg/zch
//● Github: https://github.com/GalackQSM/Alcatraz                                                      
//=======================================================================                                                                      

module.exports = async (client, messageReaction, user) => {

  if (client.user === user) return;

  const { message, emoji } = messageReaction;

  if (emoji.name === '⭐' && message.author != user) {
    const starboardChannelId = client.db.settings.selectStarboardChannelId.pluck().get(message.guild.id);
    const starboardChannel = message.guild.channels.cache.get(starboardChannelId);
    if (
      !starboardChannel || 
      !starboardChannel.viewable ||
      !starboardChannel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS']) ||
      message.channel === starboardChannel
    ) return;

    const emojis = ['⭐', '🌟', '✨', '💫', '☄️'];
    const messages = await starboardChannel.messages.fetch({ limit: 100 });

    const starred = messages.find(m => {
      return emojis.some(e => {
        return m.content.startsWith(e) &&
          m.embeds[0] &&
          m.embeds[0].footer &&
          m.embeds[0].footer.text == message.id;
      });
    });

    if (starred) {

      const starCount = parseInt(starred.content.split(' ')[1].slice(2)) - 1;

      let emojiType;
      if (starCount > 20) emojiType = emojis[4];
      else if (starCount > 15) emojiType = emojis[3];
      else if (starCount > 10) emojiType = emojis[2];
      else if (starCount > 5) emojiType = emojis[1];
      else emojiType = emojis[0];

      const starMessage = await starboardChannel.messages.fetch(starred.id);
      await starMessage.edit(`${emojiType} **${starCount}  |**  ${message.channel}`);

      if (starCount == 0)
        await starMessage.delete().catch(err => client.logger.error(err.stack));
    }
  }
};