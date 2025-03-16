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
                                                                       
const Command = require('../Alcatraz.js');
const Reactions = require('../../../reactions.js');
const { MessageEmbed } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');
const config = require('../../../config.json');
const emojiData = require('../../utils/emojis.json');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      usage: 'help [commande]',
      description: 'Affiche une liste de toutes les commandes actuelles, triées par catégorie. Peut être utilisé en conjonction avec une commande pour plus d\'informations.',
      type: client.types.INFO,
      examples: ['help ping']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;

    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); 
    const { capitalize } = message.client.utils;
    
    const command = message.client.commands.get(args[0]) || message.client.aliases.get(args[0]);
    if (command && command.type != message.client.types.OWNER && !disabledCommands.includes(command.name)) {
      
      const embed = new MessageEmbed() 
        .setTitle(`Information de la commandes: \`${command.name}\``)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(command.description)
        .addField('Usage', `\`${prefix}${command.usage}\``, true)
        .addField('Catégorie', `\`${capitalize(command.type)}\``, true)
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136");
      if (command.aliases) embed.addField('Aliases', command.aliases.map(c => `\`${c}\``).join(' '));
      if (command.examples) embed.addField('Exemples', command.examples.map(c => `\`${prefix}${c}\``).join('\n'));

      message.channel.send(embed);

    } else if (args.length > 0) {
      return this.sendErrorMessage(message, `Impossible de trouver la commande \`${args[0]}\`. Veuillez saisir une commande valide.`);

    } else {

      const commands = {};
      for (const type of Object.values(message.client.types)) {
        commands[type] = [];
      }

      const { INFO, FUN, COULEUR, POINTS, NFSW, GENERAL, JEUX, ECONOMY, LEVEL, AVATAR, BACKUP, MOD, ANTIRAID, ADMIN, OWNER } = message.client.types;

      const emojis = [
        emojiData.info,        
        emojiData.fun,         
        emojiData.couleur,    
        emojiData.points,       
        emojiData.nsfw,        
        emojiData.general,      
        emojiData.jeux,      
        emojiData.economie,  
        emojiData.level,       
        emojiData.avatar,       
        emojiData.utilitaire,  
        emojiData.moderation,  
        emojiData.antiraid,  
        emojiData.admin,      
        emojiData.owner,    
        emojiData.liens,        
      ];

      message.client.commands.forEach(command => {
        if (!disabledCommands.includes(command.name)) commands[command.type].push(`\`${command.name}\`,`);
      });

      const json = new MessageEmbed()
        .setTitle(`Panel des commandes de ${config.NomBot}`)
        .setDescription(stripIndent`
          **Prefix:** \`${prefix}\`
          **Plus d'information:** \`${prefix}help [commande]\`
          **Nombre de commandes:** \`${message.client.commands.size}\`
        `)
        .addField(`<:alcatraz_liens:1349409767994425395> Liens`, `**[Ajouter ${config.NomBot}](https://discordapp.com/oauth2/authorize?client_id=${config.BotID}&scope=bot&permissions=2146958847) | [${config.NomServeur}](${config.Support}) | [Github](https://github.com/ZerraxTM/Alcatraz) | [Site](https://alcatraz-bot.com) | [Dons](https://paypal.me/zerrax271) | [Vote](https://top.gg/bot/${config.BotID}/vote)**`)
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136");

      const embed = new MessageEmbed() 
        .setTitle(`Commandes de ${config.NomBot}`)
        .setDescription(`Bienvenue à toi **${member.displayName}** sur le menu des commandes, si tu as un problème avec **${config.NomBot}**, n'hésite pas à rejoindre notre serveur support [${config.NomServeur}](${config.Support}) est créé un ticket dans le salon <#${config.ticketChannelId}>.`)
        .addField(`${emojis[0]} ${capitalize(INFO)}`, `\`${commands[INFO].length}\` commandes`, true)
        .addField(`${emojis[1]} ${capitalize(FUN)}`, `\`${commands[FUN].length}\` commandes`, true)
        .addField(`${emojis[2]} ${capitalize(COULEUR)}`, `\`${commands[COULEUR].length}\` commandes`, true)
        .addField(`${emojis[3]} ${capitalize(POINTS)}`, `\`${commands[POINTS].length}\` commandes`, true)
        .addField(`${emojis[4]} ${capitalize(NFSW)}`, `\`${commands[NFSW].length}\` commandes`, true)
        .addField(`${emojis[5]} ${capitalize(GENERAL)}`, `\`${commands[GENERAL].length}\` commandes`, true)
        .addField(`${emojis[6]} ${capitalize(JEUX)}`, `\`${commands[JEUX].length}\` commandes`, true)
        .addField(`${emojis[7]} ${capitalize(ECONOMY)}`, `\`${commands[ECONOMY].length}\` commandes`, true)
        .addField(`${emojis[8]} ${capitalize(LEVEL)}`, `\`${commands[LEVEL].length}\` commandes`, true)
        .addField(`${emojis[9]} ${capitalize(AVATAR)}`, `\`${commands[AVATAR].length}\` commandes`, true)
        .addField(`${emojis[10]} ${capitalize(BACKUP)}`, `\`${commands[BACKUP].length}\` commandes`, true)
        .addField(`${emojis[11]} ${capitalize(MOD)}`, `\`${commands[MOD].length}\` commandes`, true)
        .addField(`${emojis[12]} ${capitalize(ANTIRAID)}`, `\`${commands[ANTIRAID].length}\` commandes`, true)
        .addField(`${emojis[13]} ${capitalize(ADMIN)}`, `\`${commands[ADMIN].length}\` commandes`, true)
        .addField(`${emojis[14]} ${capitalize(OWNER)}`, `\`${commands[OWNER].length}\` commandes`, true)
        .addField(`<:alcatraz_liens:1349409767994425395> Liens`, `**[Ajouter ${config.NomBot}](https://discordapp.com/oauth2/authorize?client_id=${config.BotID}&scope=bot&permissions=2146958847) | [${config.NomServeur}](${config.Support}) | [Github](https://github.com/GalackQSM/Alcatraz) | [Site](https://alcatraz-bot.com) | [Dons](https://paypal.me/zerrax271) | [Vote](https://top.gg/bot/${config.BotID}/vote)**`)
        .setFooter(config.footer)
        .setTimestamp()
        .setImage('https://i.imgur.com/1jlqgj9.png')
        .setColor("#2f3136");

        const reactions = {
          '1349409764211167303': new MessageEmbed(json).spliceFields(0, 0, { 
            name: `${emojis[0]} ${capitalize(INFO)}`, 
            value: commands[INFO].join(' ')
          }),
          '1349409757232107521': new MessageEmbed(json).spliceFields(0, 0, { 
            name: `${emojis[1]} ${capitalize(FUN)}`, 
            value: commands[FUN].join(' ')
          }),
          '1349409642211442748': new MessageEmbed(json).spliceFields(0, 0, { 
            name: `${emojis[2]} ${capitalize(COULEUR)}`, 
            value: commands[COULEUR].join(' ')
          }),
          '1349409900882563172': new MessageEmbed(json).spliceFields(0, 0, { 
            name: `${emojis[3]} ${capitalize(POINTS)}`, 
            value: commands[POINTS].join(' ')
          }),
          '1349409895941935196': new MessageEmbed(json).spliceFields(0, 0, { 
            name: `${emojis[4]} ${capitalize(NFSW)}`, 
            value: commands[NFSW].join(' ')
          }),
          '1349409827880702003': new MessageEmbed(json).spliceFields(0, 0, { 
            name: `${emojis[5]} ${capitalize(GENERAL)}`, 
            value: commands[GENERAL].join(' ')
          }),
          '1349409753700499486': new MessageEmbed(json).spliceFields(0, 0, { 
            name: `${emojis[6]} ${capitalize(JEUX)}`, 
            value: commands[JEUX].join(' ')
          }),
          '1349409623333142669': new MessageEmbed(json).spliceFields(0, 0, { 
            name: `${emojis[7]} ${capitalize(ECONOMY)}`, 
            value: commands[ECONOMY].join(' ')
          }),
          '1349409628223569980': new MessageEmbed(json).spliceFields(0, 0, { 
            name: `${emojis[8]} ${capitalize(LEVEL)}`, 
            value: commands[LEVEL].join(' ')
          }),
          '1349409903747403787': new MessageEmbed(json).spliceFields(0, 0, { 
            name: `${emojis[9]} ${capitalize(AVATAR)}`, 
            value: commands[AVATAR].join(' ')
          }),
          '1349410047993712640': new MessageEmbed(json).spliceFields(0, 0, { 
            name: `${emojis[10]} ${capitalize(BACKUP)}`, 
            value: commands[BACKUP].join(' ')
          }),
          '1349409749481033839': new MessageEmbed(json).spliceFields(0, 0, { 
            name: `${emojis[11]} ${capitalize(MOD)}`, 
            value: commands[MOD].join(' ')
          }),
          '1349409755940257926': new MessageEmbed(json).spliceFields(0, 0, { 
            name: `${emojis[12]} ${capitalize(ANTIRAID)}`, 
            value: commands[ANTIRAID].join(' ')
          }),
          '1349409624725520414': new MessageEmbed(json).spliceFields(0, 0, { 
            name: `${emojis[13]} ${capitalize(ADMIN)}`, 
            value: commands[ADMIN].join(' ')
          }),
          '1349409897099563118': new MessageEmbed(json).spliceFields(0, 0, { 
            name: `${emojis[14]} ${capitalize(OWNER)}`, 
            value: commands[OWNER].join(' ')
          }),
        };    

      new Reactions(message.channel, message.member, embed, reactions, 180000);
    }
  }
};
