const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const   chatbox = document.querySelector(".chatbox");
const   chatbotToggler = document.querySelector(".chatbot-toggle");


let userMessage;
const API_KEY = "AIzaSyAYWJJFZjPghHJyOKo06mmUqrJV41RHJog";
const inputInHeight = chatInput.scrollHeight;

const createChatLi=(message , className) =>{
    // create a chat <li> element with passed message and className
    const chatLi = document.createElement('li');
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : ` <span class="material-symbols-outlined">
                smart_toy
            </span><p></p>`;

chatLi.innerHTML=chatContent;
chatLi.querySelector("p").textContent=message;
return chatLi;
}


const generateResponse = (incomingChatLI) =>{
    const API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAYWJJFZjPghHJyOKo06mmUqrJV41RHJog";

    const messageElement=incomingChatLI.querySelector("p")
  const requestOptions ={
    method: "POST" ,
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        contents: [{
          role:"user",
          parts:[{text:userMessage}]
        }]
    })

  }
  //send post request t5o API , get response
  fetch(API_URL,requestOptions).then(res => res.json()).then(data=>{
    messageElement.textContent=data.candidates[0].content.parts[0].text;
    console.log(data)
  }).catch((error)=>{
    console.log(error);
  }).finally(()=> chatbox.scrollTo(0,chatbox.scrollHeight));

}


const handleChat =() => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value ="";
    chatInput.style.height = `${inputInHeight}px`;


    //Append the used message into chatbox
    chatbox.appendChild(createChatLi(userMessage,"outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight);

    setTimeout(()=>{
        //Display thinking message while waiting for response
        const incomingChatLI=createChatLi("Thinking...","incoming")
        chatbox.appendChild(incomingChatLI);
        chatbox.scrollTo(0,chatbox.scrollHeight);

        generateResponse(incomingChatLI);
    }, 600);


}
chatInput.addEventListener("input", () =>{
  //adjust input height based on its content
chatInput.style.height = `${inputInHeight}px`;
chatInput.style.height = `${chatInput.scrollHeight}px`;
});
chatInput.addEventListener("keydown", (e) =>{
  
  if(e.key=="Enter" && !e.shiftKey && window.innerWidth> 800){
    e.preventDefault();
    handleChat();
  }
});

chatbotToggler.addEventListener("click",()=> document.body.classList.toggle("show-chatbot"));
sendChatBtn.addEventListener("click",handleChat);