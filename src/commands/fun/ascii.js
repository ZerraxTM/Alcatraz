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
const figlet = require("figlet");
const util = require("util");
const figletAsync = util.promisify(figlet);
const config = require('../../../config.json');

module.exports = class Ascii extends Command {

  constructor (client) {
    super(client, {
      name: 'ascii',
      usage: 'ascii <texte>',
      description: 'Transformez votre texte en caractères ascii ! (moins de 20 caractères)',
      type: client.types.FUN,
      examples: ['ascii Bonjour tout le monde!']

    });
  }

	async run (message, args) {

    const text = args.join(" ");

    if(!text.length > 20){
      return message.error("Veuillez préciser un texte valide !");
    }

		const rendered = await figletAsync(text);
		message.channel.send("```" + rendered + "```");

	}

};