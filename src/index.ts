import { run, HandlerContext } from "@xmtp/message-kit";

// // save messages
// let messages = [];
// // save just the content.  for more clear logging
// let messageContents:string[] = []; 

run(async (context: HandlerContext) => {
  // Get the message and the address from the sender
  const { content, sender } = context.message;

  //console.log('Sender:', sender, 'Content:', content);
  console.log(content.content);

  // // Save the message content in the array
  // messages.push(context.message);
  // messageContents.push(content.content);

  // // Log the current state of the messages array (optional)
  // console.log('Stored messages:', messageContents);

  // if (content.content == "/new") {
  //   // new conversation started.  clear the messages
  //   messages = [];
  //   messageContents = [];
    
  //   // To reply, just call `reply` on the HandlerContext.
  //   await context.send(`New conversation started!!!  :)`);
  // }

  // To reply, just call `reply` on the HandlerContext.
  await context.send(`gm`);
});
