import { run, HandlerContext } from "@xmtp/message-kit";
import axios from 'axios';

// save messages
let messages:any[] = [];
// save just the content.  for more clear logging
let messageContents:string[] = []; 

let userMap = {
  "0xababcc8788bd4fd62755811a50de899ceb5aa60c": "Emily",
  "0x42ab57335941eb00535e95cbf64d78654cb0f66a": "Sol",
  "0x85c2aac4fa0a637e4d4e10cc8aad46d4e5d08b3c": "Randy",
};
  

// New function to make a POST request to the GPT service
async function callGPTService(input: string): Promise<string> {
  try {
    console.log(`text to send:\n${input}`);
    const response = await axios.post('http://localhost:4545/gptcall', { "input": input });
    return response.data;
  } catch (error) {
    console.error('Error calling GPT service:', error);
    return 'Sorry, there was an error processing your request.';
  }
}

run(async (context: HandlerContext) => {
  // Get the message and the address from the sender
  const { content, sender } = context.message;

  console.log('Sender:', sender, 'Content:', content);
  //console.log(content.content);

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

  if (content.content.toLowerCase() == "/contractnow" || content.content.toLowerCase() == "Please create a contract now") {
    await context.send(`SAMPLE RENTAL AGREEMENT \n\n\n THIS AGREEMENT made this 15th Day of June, 2012, by and between ABC Properties, herein called
“Landlord,” and Silvia Mando, herein called “Tenant.” Landlord hereby agrees to rent to Tenant the dwelling
located at 9876 Cherry Avenue, Apartment 426 under the following terms and conditions.\n\n\n`);
  }

  // New condition to call the GPT service
  if (content.content.toLowerCase() == "/contract" || content.content.toLowerCase() == "Please create a contract") {
    const gptResponse = await callGPTService(`Mike: I need a software service contract on penetration test on our developing product.`);
    await context.send(gptResponse);
  }

  if (content.content.toLowerCase() == "/contractplus" || content.content.toLowerCase().includes("Software service contract") || content.content.toLowerCase().includes("please create a contract based on the conversation")) {

    // Call the function to flatten messages
    const flattenedMessages = flattenMessages(messages);
    console.log(flattenedMessages);

    // Call GPT service with the flattened messages
    const gptResponse = await callGPTService(flattenedMessages);

    // Send the GPT response
    await context.send(gptResponse);
  }

  //To reply, just call `reply` on the HandlerContext.
  //await context.send(`gm`);
});

// Function to flatten messages
function flattenMessages(messages: any[]): string {
  return messages.map(msg => 
    `${userMap[msg.sender.address as keyof typeof userMap] || msg.sender.address}: ${msg.content.content}`
  ).slice(0, -1).join('\n\n');
}
