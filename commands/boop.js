const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Furaffinity = require('furaffinity-api');
const { Type, Page, Rating } = require('furaffinity-api');

const dateTime = new Date();
console.log(dateTime.toLocaleString() + " -> The 'boop' command is loaded.")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boop')
        .setDescription('Boop a member!')
        .addUserOption(option => option.setName("user").setDescription("User to boop").setRequired(true)),
    execute: async (interaction, bot) => {
        const user = interaction.options.getUser("user")

        Furaffinity.Search('sfw boop', { Type, Rating, Page }).then(res => {

            const randomNumber = res.length;
            const randomImage = Math.floor(Math.random() * randomNumber);
            const imageSent = res[randomImage].thumb.large;

            const embed = new MessageEmbed()
                .setImage(imageSent)
                .setColor("2f3136")

            return interaction.reply({
                embeds: [embed],
                content: "<@" + user.id + ">, you got boop by <@" + interaction.user.id + ">"
            })
        });
    }
};