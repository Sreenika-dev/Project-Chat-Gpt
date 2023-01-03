import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector("form");
const container =  document.querySelector("#container");


let loadInterval;


//function to load the dots on the textarea that starts from zero to three and to go back to empty string again
function loader(ele){
  ele.textContent = '';          
  loadInterval = setInterval(() => {
    ele.textContent += '.';
    if (ele.textContent === '....'){
      ele.textContent = '';
    }
  }, 400) 
}



//function to let AI execute the text line by line
function typer(ele, text)
{
  let index = 0;
  let interval = setInterval(() =>{
   if(index<text.length) {
    ele.innerHTML += text.charAt(index)   //as the ai types the index keeps changing and the innerHtml of the element keeps changing
    index++;
   }
   else{
   clearInterval(interval);
  }
  }, 20)
}


//this function generates unique id by taking time and random integers as hex for every message
function generateUniqueId(){
  const timeStamp = Date.now();
  const randomNum = Math.random();
  const hexadecimalString = randomNum.toString(16)
  return `id-${timeStamp}-${hexadecimalString}`;
}

//stripes that appear for every turn(Ai and user)
function stripes (isAi, value, uniqueId){
  return(
    `
    <div class = "wrapper ${isAi && 'ai'}">
       <div class="chat">
          <div class="profile">
              <im g src=${isAi ? bot : user}>
           </div>
           <div class="msg" id=${uniqueId}>${value}</div>
        </div>
    </div>
    `
  )

}


//getting the ai response

const handleSubmit = async (e) => {
  e.preventDefault()

  const data = new FormData(form)
  container.innerHTML += stripes(false, data.get('prompt'))

  // to clear the textarea input 
  form.reset()

  // bot's chatstripe
  const uniqueId = generateUniqueId()
  container.innerHTML += stripes(true, " ", uniqueId)

  // to focus scroll to the bottom 
  container.scrollTop = container.scrollHeight;

  // specific message div 
  const messageDiv = document.getElementById(uniqueId)

  // messageDiv.innerHTML = "..."
  loader(messageDiv)

  const response = await fetch('http://localhost:5000', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          prompt: data.get('prompt')
      })
  })

  clearInterval(loadInterval)
  messageDiv.innerHTML = " "

  if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

      typer(messageDiv, parsedData)
  } else {
      const err = await response.text()

      messageDiv.innerHTML = "Something went wrong"
      alert(err)
  }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
      handleSubmit(e)
  }
})