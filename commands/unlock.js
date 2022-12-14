const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Color = require("../config/color.json");
const Message = require("../config/message.json");
const Config = require("../config/config.json");
const LanguageFR = require("../languages/fr.json");
const LanguageEN = require("../languages/en.json");
const LanguageDE = require("../languages/de.json");
const LanguageSP = require("../languages/sp.json");
const LanguageNL = require("../languages/nl.json");

const fr = LanguageFR.unlock;
const en = LanguageEN.unlock;
const de = LanguageDE.unlock;
const sp = LanguageSP.unlock;
const nl = LanguageNL.unlock;

const dateTime = new Date();
console.log(dateTime.toLocaleString() + " -> The '" + en.Name + "' command is loaded.");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(en.Name)
        .setNameLocalizations({
            fr: fr.Name,
            de: de.Name,
            SpanishES: sp.Name,
            nl: nl.Name
        })
        .setDescription(en.Description)
        .setDescriptionLocalizations({
            fr: fr.Description,
            de: de.Description,
            SpanishES: sp.Description,
            nl: nl.Description
        }),
    execute: async (interaction, bot, sequelize, Sequelize) => {
        try {
            const CommandFunction = sequelize.define("CommandFunction", {
                name: {
                    type: Sequelize.STRING,
                },
                value: {
                    type: Sequelize.STRING,
                },
            });

            const FindCommand = await CommandFunction.findOne({ where: { name: en.Name } });
            const MessageReason = require("../config/message.json");

            if (FindCommand) {
                if (FindCommand.value === "Disable") {
                    return interaction.reply({
                        content: MessageReason.CommandDisabled,
                        ephemeral: true,
                    });
                };
            };
            const Logging = sequelize.define("Logging", {
                GuildID: {
                    type: Sequelize.STRING,
                },
                ChannelIDBan: {
                    type: Sequelize.STRING,
                },
                Language: {
                    type: Sequelize.STRING,
                },
            });

            const LoggingData = await Logging.findOne({ where: { GuildID: interaction.guild.id } });

            let LanguageData = LoggingData.language;

            if (!LanguageData || LanguageData === "en") Language = LanguageEN;
            if (LanguageData === "fr") Language = LanguageFR;
            if (LanguageData === "de") Language = LanguageDE;
            if (LanguageData === "sp") Language = LanguageSP;
            if (LanguageData === "nl") Language = LanguageNL;

            if (interaction.member.permissions.has("MANAGE_MESSAGES")) {
                if (interaction.guild.me.permissions.has("MANAGE_CHANNELS")) {
                    interaction.channel.parent ? interaction.channel.lockPermissions() : interaction.channel.permissionOverwrites.edit(interaction.channel.guild.roles.everyone, { SEND_MESSAGES: true }), "Lockdown lifted by: " + interaction.user.tag;

                    return interaction.reply({
                        content: Language.unlock.default.Done,
                    });
                } else {
                    return interaction.reply({
                        content: Language.unlock.permission.Me,
                        ephemeral: true,
                    });
                };
            } else {
                return interaction.reply({
                    content: Language.unlock.permission.Myself,
                    ephemeral: true
                });
            };
        } catch (error) {
            let fetchGuild = interaction.client.guilds.cache.get(Config.guildId);
            let CrashChannel = fetchGuild.channels.cache.get(Config.CrashChannel);

            return CrashChannel.send({ content: "**Error in the '" + en.Name + "' Command:** \n\n```javascript\n" + error + "```" });
        };
    }
};