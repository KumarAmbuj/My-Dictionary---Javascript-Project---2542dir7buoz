console.log("hello");
let API = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const mainSection = document.getElementById("mainSection");
const historyButton = document.getElementById("historyButton");

let historyData = [];
if (localStorage.getItem("history") == null) {
  localStorage.setItem("history", JSON.stringify([]));
} else {
  historyData = JSON.parse(localStorage.getItem("history"));
}

async function FetchAPI(word) {
  loading();
  let data = await fetch(API + word);
  data = await data.json();
  //alert("word came");
  if (Array.isArray(data)) {
    //handling showing data
    let obj = { word: "", audio: "", meaning1: "", meaning2: "", example: "" };
    console.log(data);
    obj["word"] = data[0]["word"];
    let audioArray = data[0]["phonetics"];
    let meaningArray = data[0]["meanings"];
    for (let x of audioArray) {
      if (x.audio.length > 0) {
        obj["audio"] = x.audio;
        break;
      }
    }
    for (let x of meaningArray) {
      let arr = x["definitions"];
      //console.log(arr);
      for (let m of arr) {
        //console.log("m", m);
        if (obj["meaning1"].length === 0) {
          obj["meaning1"] = m["definition"];
        } else if (obj["meaning2"].length === 0) {
          obj["meaning2"] = m["definition"];
        }
        //
        if (obj["example"].length === 0) {
          if (Object.keys(m).includes("example")) {
            //obj["example"] = m["example"];
            if (m["example"].length > 0) obj["example"] = m["example"];
          }
        }
      }
    }
    console.log(obj);
    historyData = historyData.filter((val) => {
      return obj["word"] != val["word"];
    });
    historyData.unshift(obj);
    localStorage.setItem("history", JSON.stringify(historyData));
    displayMeaning(obj);
  } else {
    // hnadling no meaning word
    console.log(data);
    showError(data);
  }
}
function showError(obj) {
  mainSection.innerHTML = "";
  mainSection.innerHTML = `<div class="errorNoWord">
  <div class="closeBtn" id="closeBtn">
    <button>X</button>
  </div>
  <div
    class="errorMessage"
    style="
      color: rgb(182, 16, 16);
      margin-top: 30px;
      text-align: center;
    "
  >
    ${obj.title}
  </div>
  <div class="errorMessage">
  ${obj.message}
  </div>
  <div class="errorMessage">
  ${obj.resolution}
  </div>`;
  document.getElementById("closeBtn").addEventListener("click", () => {
    location.reload();
    //showHomePage();
  });
  setTimeout(() => {
    location.reload();
    //showHomePage();
  }, 4000);
}

function loading() {
  mainSection.textContent = "";
  mainSection.style.alignItems = "center";
  mainSection.style.backgroundColor = "black";
  mainSection.innerHTML = ` <div class="loading">
     <img src="./images/bookflip.gif" />
   </div>`;
}

function displayMeaning(obj) {
  mainSection.style.backgroundColor = "black";
  mainSection.style.alignItems = "center";
  mainSection.innerHTML = ` <div class="meaningCard">
    <div class="closeBtn" id="closeBtn">
      <button>X</button>
    </div>
    <div class="word">${
      obj["word"][0].toUpperCase() +
      obj["word"].slice(1, obj["word"].length).toLowerCase()
    }</div>

    <div class="meaning">
      <span class="mainHeading">Meaning 1: </span>${obj["meaning1"]}
    </div>
    <div class="meaning">
      <span class="mainHeading">Meaning 2: </span>${
        obj["meaning2"].length > 0 ? obj["meaning2"] : "Not Found"
      }
    </div>
    <div class="meaning">
      <span class="mainHeading">Example: </span>${
        obj["example"].length > 0 ? obj["example"] : "Sorry Example not Found."
      }
    </div>
    <div class="audioDelete">
      <div class="audio" >
        <i class="fa fa-volume-up" aria-hidden="true"></i>
      </div>
    </div>
  </div>`;

  document.querySelector(".meaningCard").addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-volume-up")) {
      let x = new Audio(obj["audio"]);
      x.play();
    }
  });
  document.getElementById("closeBtn").addEventListener("click", () => {
    location.reload();
  });
}

searchButton.addEventListener("click", () => {
  let word = searchInput.value;
  FetchAPI(word);
});

//history show

function displayHistoryData(data) {
  mainSection.innerHTML = "";
  mainSection.style.alignItems = "";
  mainSection.style.backgroundColor = "rgb(63,3,3)";
  let colorArr = [
    " #30b90e",
    "lightpink",
    "lightblue",
    "lightbrown",
    "pink",
    "cyan",
    "lightgreen",
    "yellow",
    "red",
    "lightgreen",
  ];

  if (data.length > 0) {
    data.forEach((val) => {
      let k = Math.floor(Math.random() * colorArr.length);
      mainSection.innerHTML += `<div class="historyCard" style="background-color:${colorArr[k]}">
        <div class="pin"><img src="./images/pin.jpg" /></div>
        <div class="word">${val["word"]}</div>

        <div class="meaning">
          <span class="mainHeading">Meaning 1: </span>${val["meaning1"]}
        </div>
        <div class="meaning">
          <span class="mainHeading">Meaning 2: </span>${val["meaning2"]}
        </div>
        <div class="meaning">
          <span class="mainHeading">Example: </span>${val["example"]}
        </div>
        <div class="audioDelete">
          <div class="audio" id="audio">
            <i class="fa fa-volume-up" id=${val["audio"]} aria-hidden="true"></i>
          </div>
          <div class="delete" ">
            <i class="fa fa-trash" id="${val["word"]}"></i>
          </div>
        </div>`;
    });
  } else {
    showHistoryNoData();
  }
}
function showHistoryNoData() {
  mainSection.innerHTML = "";
  mainSection.style.alignItems = "center";
  mainSection.innerHTML = `<div class="historyNoData">
  <div class="closeBtn" id="closeBtn">
    <button>X</button>
  </div>
  <div>No Data Found</div>
  <div>Search for new Words....</div>
</div>`;
  document.getElementById("closeBtn").addEventListener("click", () => {
    location.reload();
    //showHomePage();
  });
  setTimeout(() => {
    location.reload();
    //showHomePage();
  }, 3000);
}

historyButton.addEventListener("click", () => {
  historyData = JSON.parse(localStorage.getItem("history"));
  displayHistoryData(historyData);
});

//targeting history element

mainSection.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-volume-up")) {
    let x = new Audio(e.target.id);
    x.play();
  }
  if (e.target.classList.contains("fa-trash")) {
    historyData = historyData.filter((val) => {
      return val["word"] != e.target.id;
    });
    localStorage.setItem("history", JSON.stringify(historyData));
    displayHistoryData(historyData);
  }
});

//select section
//corporate
document.getElementById("corporateWords").addEventListener("change", () => {
  let word = document.getElementById("corporateWords").value;
  FetchAPI(word);
});

//Technical words
document.getElementById("technicalWords").addEventListener("change", () => {
  let word = document.getElementById("technicalWords").value;
  FetchAPI(word);
});

//front end words
document.getElementById("frontEndWords").addEventListener("change", () => {
  let word = document.getElementById("frontEndWords").value;
  FetchAPI(word);
});

//back end words
document.getElementById("backEndWords").addEventListener("change", () => {
  let word = document.getElementById("backEndWords").value;
  FetchAPI(word);
});

//medical  words
document.getElementById("medicalWords").addEventListener("change", () => {
  let word = document.getElementById("medicalWords").value;
  FetchAPI(word);
});

//sports end words
document.getElementById("sportsWords").addEventListener("change", () => {
  let word = document.getElementById("sportsWords").value;
  FetchAPI(word);
});

//home words
document.getElementById("homeWords").addEventListener("change", () => {
  let word = document.getElementById("homeWords").value;
  FetchAPI(word);
});

//nature words
document.getElementById("natureWords").addEventListener("change", () => {
  let word = document.getElementById("natureWords").value;
  FetchAPI(word);
});

//ministry words
document.getElementById("ministryWords").addEventListener("change", () => {
  let word = document.getElementById("ministryWords").value;
  FetchAPI(word);
});

//finance words
document.getElementById("financeWords").addEventListener("change", () => {
  let word = document.getElementById("financeWords").value;
  FetchAPI(word);
});

document.getElementById("logoName").addEventListener("click", () => {
  location.reload();
});
