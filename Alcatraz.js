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
//● Créé par GalackQSM le 09 novembre 2019
//● Serveur Discord: https://discord.gg/zch
//● Github: https://github.com/GalackQSM/Alcatraz                                                      
//=======================================================================

/* 
   FICHIER PRINCIPAL DE VOTRE BOT "ALCATRAZ" 
   Assure le lancement et l'intégration de toutes les fonctionnalités.
*/

const config = require('./config.json');
const Client = require('./src/Client.js');
const { Intents, Collection } = require('discord.js');
const Discord = require('discord.js');
const DBL = require('dblapi.js');
const fetch = require('node-fetch');
const snekfetch = require('snekfetch');
const { GiveawaysManager } = require('discord-giveaways');
const moment = require('moment');
const fs = require('fs');
const db = require('quick.db');
const BOATS = require('boats.js');

// Ajustements des seuils d'affichage pour Moment.js
moment.relativeTimeThreshold('s', 60);
moment.relativeTimeThreshold('ss', 5);
moment.relativeTimeThreshold('m', 60);
moment.relativeTimeThreshold('h', 60);
moment.relativeTimeThreshold('d', 24);
moment.relativeTimeThreshold('M', 1);

// Rendre __dirname disponible globalement
global.__basedir = __dirname;

// Préparation des intents (nécessaires pour les events)
const intents = new Intents();
intents.add(
  'GUILD_PRESENCES',
  'GUILD_MEMBERS',
  'GUILDS',
  'GUILD_VOICE_STATES',
  'GUILD_MESSAGES',
  'GUILD_MESSAGE_REACTIONS'
);

// Initialisation du client personnalisé
const client = new Client(config, { ws: { intents: intents } });

// Chargement du préfixe défini dans le config.json (si vous l'utilisez dans d'autres commandes)
const prefix = config.prefix || '!';

// Fonction d'initialisation du bot
function init() {
  client.loadEvents('./src/events');        // Charge tous les events
  client.loadCommands('./src/commands');    // Charge toutes les commandes
  client.login(client.token);               // Connexion à Discord
}

init();

/* ===========================
   LOGIQUE POUR GUILD CREATE
   =========================== */
client.on('guildCreate', async guild => {
  let canal = client.channels.cache.get('877212912966594591');
  if (!canal) return; // Évite une erreur si le canal n'existe pas ou est inaccessible.

  const embed = new Discord.MessageEmbed()
    .setThumbnail(guild.iconURL())
    .setTitle('`➕` ' + config.NomBot + ' a rejoint un serveur')
    .setDescription(
      `Merci à **${guild.owner.user.tag}** de m'avoir ajouté dans son serveur, ` +
      `je suis maintenant dans **${client.guilds.cache.size} serveurs**.\n\n__Informations du serveur :__\n` +
      `• :pencil: **Nom:** ${guild.name}\n` +
      `• :earth_americas: **Région:** ${guild.region}\n` +
      `• :mortar_board: **Rôles:** ${guild.roles.cache.size}\n` +
      `• :man_detective: **Membres:** ${guild.memberCount}\n` +
      `• :id: **ID:** ${guild.id}\n` +
      `• :crown: **Propriétaire:** ${guild.owner.user.tag}`
    )
    .setTimestamp()
    .setColor('1fd10f')
    .setFooter(config.footer);

  canal.send({ embed });
});

/* ===========================
   LOGIQUE POUR GUILD DELETE
   =========================== */
client.on('guildDelete', async guild => {
  let canal = client.channels.cache.get('877212912966594591');
  if (!canal) return; // Évite une erreur si le canal n'existe pas ou est inaccessible.

  const embed = new Discord.MessageEmbed()
    .setThumbnail(guild.iconURL())
    .setTitle('`➖` ' + config.NomBot + ' a quitté un serveur')
    .setDescription(
      `Dommage **${guild.owner.user.tag}** viens de m'exclure de son serveur, ` +
      `je ne suis plus que dans **${client.guilds.cache.size} serveurs**.\n\n__Informations du serveur :__\n` +
      `• :pencil: **Nom:** ${guild.name}\n` +
      `• :earth_americas: **Région:** ${guild.region}\n` +
      `• :mortar_board: **Rôles:** ${guild.roles.cache.size}\n` +
      `• :man_detective: **Membres:** ${guild.memberCount}\n` +
      `• :id: **ID:** ${guild.id}\n` +
      `• :crown: **Propriétaire:** ${guild.owner.user.tag}`
    )
    .setTimestamp()
    .setColor('d90e0b')
    .setFooter(config.footer);

  canal.send({ embed });
});

/* ===========================
   FILTRE ANTI-INSULTE
   =========================== */
   client.on('message', message => {
    if (!message.guild || message.author.bot) return;
    const content = message.content.toLowerCase();
    const hasDirectInsulte = config.ANTI_INSULTE.some(word => content.includes(word.toLowerCase()));
    const hasBypassInsulte = config.ANTI_INSULTE_BYPASS.some(pattern => {
      const regex = new RegExp(pattern, 'i');
      return regex.test(content);
    });
    if (hasDirectInsulte || hasBypassInsulte) {
      const antiinsulte = new Discord.MessageEmbed()
        .setTitle(':no_entry: Filtre anti-insulte détecté')
        .setDescription(`**${message.author.username}**, merci de ne pas utiliser d'insultes ou de contournements.`)
        .setTimestamp()
        .setColor('#2f3136')
        .setFooter(config.footer);
      message.channel.send(antiinsulte).then(msg => {
        setTimeout(() => msg.delete().catch(() => {}), 5000);
      });
      message.delete().catch(() => {});
    }
  });
  

/* ===========================
   TOP.GG (anciennement DBL)
   =========================== */
const dbl = new DBL(config.Topgg, client);
dbl.on('posted', () => {
  console.log('Nombre de serveurs publié sur top.gg !');
});
dbl.on('error', e => {
  console.log(`Erreur top.gg : ${e}`);
});

/* ===========================
   BOATS.JS (BOATS)
   =========================== */
const Boats = new BOATS(config.BOATS);
Boats.postStats(client.guilds.cache.size, config.BotID)
  .then(() => {
    console.log('Nombre de serveurs mis à jour avec succès sur boats.js.');
  })
  .catch(err => {
    console.error('Erreur boats.js :', err);
  });

/* ===========================
   VOIDBOTS
   =========================== */
fetch(`https://voidbots.net/api/auth/stats/${config.BotID}`, {
  method: 'POST',
  headers: {
    Authorization: '' + config.VoidBots + '',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ server_count: client.guilds.cache.size })
})
  .then(response => response.text())
  .then(console.log)
  .catch(console.error);

/* ===========================
   SPACE BOT LIST
   =========================== */
snekfetch
  .post(`https://space-bot-list.xyz/api/bots/${config.BotID}`)
  .set('Authorization', '' + config.SpaceBotList + '')
  .send({ guilds: client.guilds.cache.size, users: client.users.cache.size })
  .then(req => req.body)
  .catch(err => console.error('Erreur Space Bot List :', err));

/* ===========================
   GESTIONNAIRE DE GIVEAWAYS
   =========================== */

// Création d'une classe personnalisée pour gérer la base de données Quick.DB
class GiveawayManagerWithOwnDatabase extends GiveawaysManager {
  // Récupère tous les giveaways
  async getAllGiveaways() {
    return db.get('giveaways');
  }

  // Sauvegarde d'un nouveau giveaway
  async saveGiveaway(messageID, giveawayData) {
    db.push('giveaways', giveawayData);
    return true;
  }

  // Modification d'un giveaway
  async editGiveaway(messageID, giveawayData) {
    const giveaways = db.get('giveaways');
    const newGiveawaysArray = giveaways.filter((g) => g.messageID !== messageID);
    newGiveawaysArray.push(giveawayData);
    db.set('giveaways', newGiveawaysArray);
    return true;
  }

  // Suppression d'un giveaway
  async deleteGiveaway(messageID) {
    const newGiveawaysArray = db.get('giveaways').filter((g) => g.messageID !== messageID);
    db.set('giveaways', newGiveawaysArray);
    return true;
  }
}

// Initialise le tableau des giveaways si inexistant
if (!db.get('giveaways')) db.set('giveaways', []);

// Instancie le manager des giveaways
const manager = new GiveawayManagerWithOwnDatabase(client, {
  storage: false,
  updateCountdownEvery: 5000,
  default: {
    botsCanWin: false,
    embedColor: 'RANDOM',
    reaction: '🎉'
  }
});
client.giveawaysManager = manager;

// Écoute les événements relatifs aux giveaways
client.giveawaysManager.on('giveawayReactionAdded', (giveaway, member, reaction) => {
  console.log(`${member.user.tag} est entré(e) dans le giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

client.giveawaysManager.on('giveawayReactionRemoved', (giveaway, member, reaction) => {
  console.log(`${member.user.tag} a retiré sa participation au giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

/* ===========================
   SYSTÈME DE NIVEAUX (LEVELS)
   =========================== */
client.on('message', async message => {
  // Ignore les messages de bots ou en MP
  if (message.author.bot || message.channel.type === 'dm') return;

  // Vérifie si le système de messages est activé sur ce serveur
  let messageFetch = db.fetch(`guildMessages_${message.guild.id}`);
  if (messageFetch === null) return;

  // Incrémente le nombre de messages de l'utilisateur
  db.add(`messages_${message.guild.id}_${message.author.id}`, 1);
  let messagefetch = db.fetch(`messages_${message.guild.id}_${message.author.id}`);

  // On vérifie si on se trouve sur un palier spécial pour incrémenter le level
  // (Ici, tous les 100 messages jusqu'à 10 000)
  if (messagefetch % 100 === 0 && messagefetch <= 10000) {
    db.add(`level_${message.guild.id}_${message.author.id}`, 1);
    let levelfetch = db.fetch(`level_${message.guild.id}_${message.author.id}`);

    let levelembed = new Discord.MessageEmbed()
      .setColor('#2f3136')
      .setDescription(`**${message.author}, vous avez atteint le niveau ${levelfetch} !**`)
      .setFooter(`${prefix}offxp pour désactiver les messages de niveau.`);

    message.channel.send(levelembed);
  }
});

/* ===========================
   GESTION DES ERREURS
   =========================== */
process.on('unhandledRejection', err => {
  // On suppose que client.logger.error est géré dans votre Client.js
  // Sinon, utilisez console.error(err) ou un autre logger.
  if (client.logger && typeof client.logger.error === 'function') {
    client.logger.error(err);
  } else {
    console.error('Unhandled Rejection:', err);
  }
});
