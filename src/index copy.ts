import { run, HandlerContext } from "@xmtp/message-kit";
import axios from 'axios';

// save messages
let messages = [];
// save just the content.  for more clear logging
let messageContents:string[] = []; 

// New function to make a POST request to the GPT service
async function callGPTService(input: string): Promise<string> {
  try {
    const response = await axios.post('http://localhost:4545/gptcall', { input });
    return response.data;
  } catch (error) {
    console.error('Error calling GPT service:', error);
    return 'Sorry, there was an error processing your request.';
  }
}

run(async (context: HandlerContext) => {
  // Get the message and the address from the sender
  const { content, sender } = context.message;

  //console.log('Sender:', sender, 'Content:', content);
  console.log(content.content);

  // Save the message content in the array
  messages.push(context.message);
  messageContents.push(content.content);

  // Log the current state of the messages array (optional)
  console.log('Stored messages:', messageContents);

  if (content.content == "/new") {
    // new conversation started.  clear the messages
    messages = [];
    messageContents = [];
    
    // To reply, just call `reply` on the HandlerContext.
    await context.reply(`New conversation started!!!  :)`);
  }

  if (content.content == "/contract" || content.content == "Please create a contract") {
    await context.send(`SAMPLE RENTAL AGREEMENT \n\n\n THIS AGREEMENT made this 15th Day of June, 2012, by and between ABC Properties, herein called
“Landlord,” and Silvia Mando, herein called “Tenant.” Landlord hereby agrees to rent to Tenant the dwelling
located at 9876 Cherry Avenue, Apartment 426 under the following terms and conditions.\n\n\n`);
  }

  // New condition to call the GPT service
  if (content.content.toLowerCase().includes("software service contract") || content.content.toLowerCase().includes("penetration test")) {
    const gptResponse = await callGPTService(`Mike: ${content.content}`);
    await context.send(gptResponse);
  }

  //To reply, just call `reply` on the HandlerContext.
  //await context.send(`gm`);
});
