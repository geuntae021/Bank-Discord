//call discord API
const Discord = require('discord.js');
const bot = new Discord.Client();

//start bot
console.log("[START_INFO][System]The bot is Online !" );


//Config of the bot
var fs = require("fs");
var config = JSON.parse(fs.readFileSync("config.json"));
var time = 0; //horodateur
var prefix = config.prefix;
var convert = config.convert;


//Patern for register ++ var forfind account
var AccountRegister = JSON.parse(fs.readFileSync("./UserAccount/patern_accountInfo.json"));
var IdUser;
var username;

//message command
bot.on('message', (message) => {
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    
    //extract args in command
    let command = message.content.split(" ")[0];
    command = command.slice(prefix.length);
    let args = message.content.split(" ").slice(1);
    
    //value for id and name of user
    IdUser = message.author.id;
    username = message.author.username;

    //display date and time in console
    if (time = 1){
    var timeInMs = new Date().toISOString().replace(/T/, ' ').replace(/\[p]+/, '');
    time = 0;
    }


//COMMAND 

//==================================
//register, delete and account info
//==================================

    //command for create an account
    if(command === "register"){
        time = time+1;
        AccountRegister.IdUser = IdUser;
        AccountRegister.username = username;
        AccountRegister.lastpel = timeInMs;
        console.log("["+timeInMs+"]" + "[System] " + username + " send the command > [p]register < " );
            //chech if account is already in the database ?
            if (fs.existsSync('./UserAccount/' + IdUser + '.json')) {
            console.log("["+timeInMs+"]" + "[System] The account of  < " + username + " >  is already in the db. Id of the account : " + IdUser + " :/" );
            message.reply("you already have an account in our register!");
            }
            //create an account in database if the account is not in database
            else {
            fs.writeFile('./UserAccount/' + IdUser + ".json", JSON.stringify(AccountRegister, null, 2));
            console.log("["+timeInMs+"]" + "[System] The account of " + username + " has been created ! Id of the account : " + IdUser + " :)" );
            message.reply("your account has been successfully created!");
            }
    }

    //command for check the money in the account
    else if(command === "myAccount") {
        time = time+1;
        console.log("["+timeInMs+"]" + "[System] " + username + " send the command > [p]myAccount < " );
        if (fs.existsSync('./UserAccount/' + IdUser + '.json')) {
            var AccountUser = JSON.parse(fs.readFileSync("./UserAccount/"+ IdUser + ".json"));
            result = AccountUser.amount * config.convert;
            if (IdUser == config.owner) { ColorStatusAccount = 11931400;} else{ ColorStatusAccount =3447003;}
            console.log("["+timeInMs+"]" + "[System] The account of " + username + " has "+ result + " € !" + " Id of the account : " + IdUser);
            message.channel.sendEmbed({color: ColorStatusAccount,author: {name: "Your customer area " + username,icon_url: bot.users.get(IdUser).displayAvatarURL,},fields: [{name: 'Nom du compte :',value: AccountUser.username},{name: 'ID de votre compte :',value: AccountUser.IdUser},{name: 'Type de compte :',value: AccountUser.status},{name: 'Solde de votre compte :',value: result + " €"},{name: 'Date de la dernière demande de PEL :',value: AccountUser.lastpel}],timestamp: new Date(),footer: {text: '© La Tablée'}});
        } else {
        console.log("["+timeInMs+"]" + "[System] The account of " + username + " is not in the db. Id of the user : " + IdUser);
        message.reply(" you do not have to create an account! Please make '[p] register' in the chat! ");}
    }
    else if(command === "infoAccount") {
        time = time+1;
        console.log("["+timeInMs+"]" + "[System] " + username + " send the command > [p]InfoAccount < " );
        let IdPart1 = parseInt(args[0]);
        let IdPart2 = parseInt(args[1]);
        InfoAccountId = ''+ IdPart1 + IdPart2;
        if (fs.existsSync('./UserAccount/' + InfoAccountId + '.json')) {
            if (InfoAccountId == config.owner) { ColorStatusAccount = 11931400;} else{ ColorStatusAccount =3447003;}
            var AccountUser = JSON.parse(fs.readFileSync("./UserAccount/"+ InfoAccountId + ".json"));
            console.log("["+timeInMs+"]" + "[System] Account_Name : " + AccountUser.username + " | ID_Account : "+ AccountUser.IdUser);
            console.log("["+timeInMs+"]" + "[System] Amount : " + (AccountUser.amount*config.convert) + " | Last_PEL : "+ AccountUser.lastpel);
            message.channel.sendEmbed({color: ColorStatusAccount,author:{name: "Account info of " + InfoAccountId,icon_url: bot.users.get(InfoAccountId).displayAvatarURL},fields:[{name: 'Username :',value: AccountUser.username},{name: 'ID of the Account :',value: AccountUser.IdUser},{name: 'Type of Account :',value: AccountUser.status},{name: 'Amount :',value: (AccountUser.amount*config.convert)+ " €"},{name: 'Last PEL Command :',value:AccountUser.lastpel}],timestamp: new Date(),footer: {text: '© La Tablée'}}); 
        } else {
        console.log("["+timeInMs+"]" + "[System] 0 Account found for the ID : " + InfoAccountId);
        message.reply(" No account is listed with the ID: " + InfoAccountId);}
    }
    //command for owner
    else if(command === "deleteAccount"){
        time = time+1;
        console.log("["+timeInMs+"]" + "[System] " + username + " send the command > [p]deleteaccount < " );
        if (IdUser == config.owner) {
            let IdPart1 = parseInt(args[0]);
            let IdPart2 = parseInt(args[1]);
            DeleteAccountId = ''+ IdPart1 + IdPart2;
            if (fs.existsSync('./UserAccount/' + DeleteAccountId + '.json')) {
                fs.unlink("./UserAccount/"+ DeleteAccountId + ".json",function(err){
                if(err) return console.log(err);
                console.log("["+timeInMs+"]" + "[System]"+username+" with id " + IdUser + " delete the account " + DeleteAccountId);});
                message.reply("The account " + DeleteAccountId + " has been removed!" );
            } else {
            console.log("["+timeInMs+"]" + "[System][ERROR]The account " + DeleteAccountId + " is not in the db ");
            message.reply(" The account you requested is not in the db !");}
        } else {
        console.log("["+timeInMs+"]" + "[System]"+ username + " with id " + IdUser + " don't have the permission for use this command " );
        message.reply(" please contact the bot manager to perform this operation!");}
    }
    
//======================= 
//addMoney , removeMoney
//=======================

    //command for owner    
    else if(command === "addMoney"){
        time = time+1;
        console.log("["+timeInMs+"]" + "[System] " + username + " send the command > [p]addMoney < " );
        //chech if player is the owner. If it's the owner then :
        if (IdUser == config.owner) {
            let moneyADD = parseInt(args[0]);
            let IdPart1 = parseInt(args[1]);
            let IdPart2 = parseInt(args[2]);
            AccountID = ''+ IdPart1 + IdPart2;
            if (fs.existsSync('./UserAccount/' + AccountID + '.json')) {
                var AccountUserMoney = JSON.parse(fs.readFileSync("./UserAccount/"+ AccountID + ".json"));
                AccountUserMoney.amount = AccountUserMoney.amount + moneyADD;
                fs.writeFile('./UserAccount/' + AccountID + '.json', JSON.stringify(AccountUserMoney, null, 2));
                console.log("["+timeInMs+"]" + "[System]"+username+" with id " + IdUser + " add "+ moneyADD + "(money) in the account " + AccountID);
                message.reply("The Account " + AccountID + " was credited with " +moneyADD+ " cents");
            } else {
            console.log("["+timeInMs+"]" + "[System][ERROR]The account " + AccountID + " is not in the db ");
            message.reply(" The account you requested is not in the db!");}
        } else {
        console.log("["+timeInMs+"]" + "[System]"+ username + " with id " + IdUser + " don't have the permission for use this command " );
        message.reply("please contact the bot manager to do this!");}
    }

    //command for owner
    else if(command === "removeMoney"){
        time = time+1;
        console.log("["+timeInMs+"]" + "[System] " + username + " send the command > [p]addMoney < " );
        //chech if player is the owner. If it's the owner then :
        if (IdUser == config.owner) {
            let moneyREMOVE = parseInt(args[0]);
            let IdPart1 = parseInt(args[1]);
            let IdPart2 = parseInt(args[2]);
            AccountID = ''+ IdPart1 + IdPart2;
            if (fs.existsSync('./UserAccount/' + AccountID + '.json')) {
                var AccountUserMoney = JSON.parse(fs.readFileSync("./UserAccount/"+ AccountID + ".json"));
                NewMoneyAmount = AccountUserMoney.amount - moneyREMOVE;
                if (NewMoneyAmount > 0) {
                AccountUserMoney.amount = NewMoneyAmount;
                fs.writeFile('./UserAccount/' + AccountID + '.json', JSON.stringify(AccountUserMoney, null, 2));
                console.log("["+timeInMs+"]" + "[System]"+username+" with id " + IdUser + " remove "+ moneyREMOVE + "(money) in the account " + AccountID);
                message.reply("The Account " + AccountID + " has been debited from" +moneyREMOVE+ " cents");
            } else {    
                console.log("["+timeInMs+"]" + "[System] The account " + AccountID + " doesn't have any money in the account !");
                message.reply("The Account " + AccountID + " do not have enough money on his account");}
        } else {
            console.log("["+timeInMs+"]" + "[System][ERROR]The account " + AccountID + " is not in the db ");
            message.reply("The account you requested is not in the db!");}
        } else {
        console.log("["+timeInMs+"]" + "[System]"+ username + " with id " + IdUser + " don't have the permission for use this command " );
        message.reply("please contact the bot manager to do this!");}
    }

//PEL command
    else if(command === "PEL"){
        time = time+1;
        console.log("["+timeInMs+"]" + "[System] " + username + " send the command > [p]PEL < " );
        if (fs.existsSync('./UserAccount/' + IdUser + '.json')) {
            var AccountUserDB = JSON.parse(fs.readFileSync("./UserAccount/"+ IdUser + ".json"));
            var date1 = new Date(AccountUserDB.lastpel);
            var date2 = new Date(timeInMs);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
            if(diffDays > 1 ){ // diffDays > 1  == +1 day or more
                AccountUserDB.lastpel = timeInMs;
                AccountUserDB.amount = AccountUserDB.amount + config.pelValue;
                fs.writeFile('./UserAccount/' + IdUser + '.json', JSON.stringify(AccountUserDB, null, 2));
                console.log("["+timeInMs+"]" + "[System]"+username+" with id " + IdUser + " add "+ config.pelValue + " (PEL_Command) in the account " + IdUser);
                message.reply(" your ID account :" + IdUser + " was credited with the ELP either " + config.pelValue + "cents!");
            } else {
                console.log("["+timeInMs+"]" + "[System]" + username + " didn't waiting 24h. PEL Transaction Denied on the account "+ IdUser);
                message.reply(" you have to wait 24 hours before claiming your PEL!");}
        } else {
            console.log("["+timeInMs+"]" + "[System] The account of " + username + " is not in the db. Id of the user : " + IdUser);
            message.reply("you do not have to create an account! Please make '[p]register' in the chat!");}
    }




//Info COMMAND
    //command for the information about the bot
    else if(command === "AboutBot") {
        time = time+1;
        console.log("["+timeInMs+"]" + "[System] " + username + " send the command > [p]AboutBot < " );
        const embed = new Discord.RichEmbed().setAuthor(bot.user.username, 'https://cdn4.iconfinder.com/data/icons/keynote-and-powerpoint-icons/256/Money-32.png').setThumbnail('https://yt3.ggpht.com/-hgoKcvX8liw/AAAAAAAAAAI/AAAAAAAAAAA/Dxr1P16Ll6Y/s900-c-k-no-mo-rj-c0xffffff/photo.jpg').setColor(0x00AE86).setFooter('© La Tablée').setTimestamp().addField('Créer par :','[La Tablée © | Tout droit réservé ](http://latablee.galilol.xyz/)').addField('Version du bot :', config.version, true).addField('\u200b', '\u200b', true).addField('Dernière mise à jour le :', config.lastUpdate, true);
        message.channel.sendEmbed(embed);    
    }
    //command for the id of the client
    else if(command === "myID") {
        time = time+1;
        message.reply(" l'id de votre compte : " + IdUser);
        console.log("["+timeInMs+"]" + "[System] " + username + " send the command > [p]myId < " );
    }

    else if(command === "CmdBot") {
        time = time+1;
        console.log("["+timeInMs+"]" + "[System] " + username + " send the command > [p]CmdBot < " );
        message.channel.sendMessage("```[p]register \r\n ->Create your account in the bot```\r\n```[p]myAccount \r\n-> Displays the amount of your account```\r\n```[p]AboutBot \r\n-> Displays bot info.```");
    }


//test space command
     else if(command === "test"){
        time = time+1;
        IdUser = message.author.id;
        username = message.author.username;
        console.log("["+timeInMs+"]" + "[System] " + username + " send the command > [p]test < " );
            //chech if player is the owner. If it's the owner then :
            if (IdUser == config.owner) {
            console.log("["+timeInMs+"]" + "[System]"+username+" with id " + IdUser + " is my master ! LOVE YOU MY CREATOR !" );
            message.reply("Jack Marten");
        }
        //if the player is not owner, then : 
        else {
        console.log("["+timeInMs+"]" + "[System]"+ username + " with id " + IdUser + " can't launch this command. Reason : Not my master :/" );
        message.reply(" you're not my master !");
        }
    }
    else if(command === "testForm") {
        time = time+1;
        console.log("["+timeInMs+"]" + "[System] " + username + " send the command > [p]testForm < " );
        message.reply("Jack Marten");    
    }

    

   
    
});

bot.login(config.key);
