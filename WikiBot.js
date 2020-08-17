// Import the discord.js module + initialize prefix and token
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const pythonBridge = require('python-bridge');
let python = pythonBridge();
// Create an instance of a Discord client
const client = new Discord.Client();
//python function for wiki
python.ex`
from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as beaut

def getWiki(item):
    try:
      wiki = 'https://en.wikipedia.org/wiki/' + item
      #get html page of wikipedia
      uClient = uReq(wiki)
      page_html = uClient.read()
      uClient.close()
    except:
      return 'I didnt find it'

    page_soup = beaut(page_html, 'html.parser')
    paras = page_soup.findAll("p", {"class":"" })
    info = paras[0].get_text()
    if 'may refer to:' in info:
      moreInfo = page_soup.findAll("ul", {"class":"" })
      info = info + moreInfo[0].get_text()
    elif len(info) < 300:
      info = info + paras[1].get_text()
    
    return info`

//function to replace spaces in a string with underscores
function space_to_us(word){
  newWord = '';
  for (var i = 0; i < word.length; i++){
      if (word[i] == ' '){
          newWord = newWord + '_';
      }
      else{
          newWord = newWord + word[i];
      }
    }
  return newWord;
}

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});


client.on('message', message => {

  var wikiCall = message.content;
  if (wikiCall.substring(0,5) == '/wiki'){
    item = space_to_us(wikiCall.substring(6));
    python`getWiki(${item})`.then(x => message.reply(x))
  }
})

//leave and enter
client.on('message', message => {
  if (message.content == '/reach'){
    message.member.voiceChannel.join()
  }
  if (message.content == '/dip'){
    message.member.voiceChannel.leave()
  }
})

client.login(token);