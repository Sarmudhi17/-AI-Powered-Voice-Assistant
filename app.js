const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
const speakBtn = document.querySelector("#speak");
const time = document.querySelector("#time");
const battery = document.querySelector("#battery");
const internet = document.querySelector("#internet");
const turn_on = document.querySelector("#turn_on");

//document.querySelector("#start_jarvis_btn").addEventListener("click",=>{
  //recognition.start()
//})
function weather(location) {
  const weatherCont = document.querySelector(".temp").querySelectorAll("*");

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function () {
    if (this.status === 200) {
      let data = JSON.parse(this.responseText);
      weatherCont[0].textContent = `Location : ${data.name}`;
      weatherCont[1].textContent = `Country : ${data.sys.country}`;
      weatherCont[2].textContent = `Weather type : ${data.weather[0].main}`;
      weatherCont[3].textContent = `Weather description : ${data.weather[0].description}`;
      weatherCont[4].src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weatherCont[5].textContent = `Original Temperature : ${ktc(
        data.main.temp
      )}`;
      weatherCont[6].textContent = `feels like ${ktc(data.main.feels_like)}`;
      weatherCont[7].textContent = `Min temperature ${ktc(data.main.temp_min)}`;
      weatherCont[8].textContent = `Max temperature ${ktc(data.main.temp_max)}`;
      weatherStatement = `sir the weather in ${data.name} is ${
        data.weather[0].description
      } and the temperature feels like ${ktc(data.main.feels_like)}`;
    } else {
      weatherCont[0].textContent = "Weather Info Not Found";
    }
  };

  xhr.send();
}

function ktc(k) {
  k = k - 273.15;
  return k.toFixed(2);
}

//weather("salem")
if (localStorage.getItem("jarvis_setup_middle") !== null) {
  weather(JSON.parse(localStorage.getItem("jarvis_setup_middle")).location);
}

const setup = document.querySelector(".jarvis_setup_middle");
setup.style.display = "none";
if (localStorage.getItem("jarvis_setup_middle") === null) {
  setup.style.display = "flex";
  setup.querySelector("button").addEventListener("click", userInfo);
}

function userInfo() {
  let setupInfo = {
    name: setup.querySelectorAll("input")[0].value,
    bio: setup.querySelectorAll("input")[1].value,
    location: setup.querySelectorAll("input")[2].value,
    instagram: setup.querySelectorAll("input")[3].value,
    twitter: setup.querySelectorAll("input")[4].value,
    github: setup.querySelectorAll("input")[5].value,
  };

  let testArr = [];

  setup.querySelectorAll("input").forEach((e) => {
    testArr.push(e.value);
  });

  if (testArr.includes("")) {
    readOut("please enter your complete information");
  } else {
    localStorage.clear();
    localStorage.setItem("jarvis_setup_middle", JSON.stringify(setupInfo));
    setup.style.display = "none";
    weather(JSON.parse(localStorage.getItem("jarvis_setup_middle")).location);
  }
}

let date = new Date();
let hrs = date.getHours();
let mins = date.getMinutes();
let secs = date.getSeconds();
window.onload = () => {
  time.textContent = `${hrs}:${mins}:${secs}`;
  setInterval(() => {
    let date = new Date();
    let hrs = date.getHours();
    let mins = date.getMinutes();
    let secs = date.getSeconds();
    time.textContent = `${hrs}:${mins}:${secs}`;
  }, 1000);

  let batteryPromise = navigator.getBattery();
  batteryPromise.then(batteryCallback);

  function batteryCallback(batteryObject) {
    printBatteryStatus(batteryObject);
    setInterval(() => {
      printBatteryStatus(batteryObject);
    }, 5000);
  }
  function printBatteryStatus(batteryObject) {
    document.querySelector("#battery").textContent = `${(
      batteryObject.level * 100
    ).toFixed(2)}%`;
    charge = batteryObject.level * 100;
    if (batteryObject.charging === true) {
      document.querySelector(".battery").style.width = "200px";
      document.querySelector("#battery").textContent = `${(
        batteryObject.level * 100
      ).toFixed(2)}% Charging`;
      chargeStatus = "plugged in";
    }
  }

  if (navigator.onLine) {
    document.querySelector("#internet").textContent = "online";
    connectivity = "online";
  } else {
    document.querySelector("#internet").textContent = "offline";
    connectivity = "offline";
  }

  setInterval(() => {
    if (navigator.onLine) {
      document.querySelector("#internet").textContent = "online";
      connectivity = "online";
    } else {
      document.querySelector("#internet").textContent = "offline";
      connectivity = "offline";
    }
  }, 60000);
};

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = function () {
  console.log("vr active");
};

recognition.onresult = function (event) {
  let current = event.resultIndex;
  let transcript = event.results[current][0].transcript;
  transcript = transcript.toLowerCase();
  console.log(transcript);
  if (transcript.includes("hi ")||transcript.includes("hello")) {
    readOut("hey hi");
  }
  if (transcript.includes("youtube")) {
    readOut("opening youtube");
    window.open("https://www.youtube.com/");
  }
  if (transcript.includes("github")) {
    readOut("opening github");
    window.open("https://www.github.com/");
  }
  if (transcript.includes("blackboard")) {
    readOut("opening blackboard");
    window.open("https://www.sonalearn.org/");
  }
  if (transcript.includes("search for")) {
    readOut("here's the result");
    let input = transcript.split("");
    input.splice(0, 11);
    //input.pop();
    input = input.join("").split("").join("");
    console.log(input);
    window.open(`https://www.google.com/search?q=${input}`);
  }
  if (transcript.includes("current charge")) {
    readOut(`the current charge is ${charge}`);
  }
  if (transcript.includes("charging status")) {
    readOut(`the current charging status is ${chargeStatus}`);
  }
  
  if (transcript.includes("connection status")) {
    readOut(`you are ${connectivity}`);
  }
  if (transcript.includes("about yourself")) {
    readOut(
      "i am a jarvis, a conversational voice assistant made for browsers using javascript"
    );
  }
  if (transcript.includes("current time")) {
    readOut(`${hrs} ${mins}`);
  }
  if (transcript.includes("change my information")) {
    readOut("Opening the information tab");
    localStorage.clear();
    
    if(window.innerWidth <= 400 ){
      window.resizeTo(screen.width,screen.height)
    }
    setup.style.display = "flex";
    setup.querySelector("button").addEventListener("click", userInfo);
  }
  if (transcript.includes("bad")) {
    readOut("Why? May I know what is the reason");
  }
  if (transcript.includes("good")||transcript.includes("fine")) {
    readOut("great");
  }
  if (transcript.includes("tell me a joke")||transcript.includes("tell a joke")) {
    readOut("Most people are shocked when they find out how bad I am as an electrician");
  }
  if (transcript.includes("how are you")) {
    readOut("I'm fine What about you");
  }
  if (transcript.includes("what are you doing")) {
    readOut("talking with you");
  }
  if (transcript.includes("are you single")||transcript.includes("are you married")||transcript.includes("do you have any girlfriend")) {
    readOut("i'm always single");
  }
  if (transcript.includes("can you hear me")) {
    readOut("oh yes i can hear you");
  }
  if (transcript.includes("bye")||transcript.includes("see you")||transcript.includes("take care")) {
    readOut("ok then, see you");
    recognition.stop();
  }
  if (transcript.includes("stop listening")) {
    readOut("stopping");
    recognition.stop();
  }
};

recognition.onend = function () {
  console.log("vr deactive");
};

recognition.continuous = true;

startBtn.addEventListener("click", () => {
  recognition.start();
});

stopBtn.addEventListener("click", () => {
  recognition.stop();
});

function readOut(message) {
  const speech = new SpeechSynthesisUtterance();
  //const allVoices = speechSynthesis.getVoices();
  speech.text = message;
  //speech.voice = allVoices[0]
  speech.volume = 1;
  window.speechSynthesis.speak(speech);
  console.log("Speaking... ");
}


