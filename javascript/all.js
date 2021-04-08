// DOM
let data;
const alertBlockSuccess = document.querySelector(
  ".container .alert.alert-primary"
);
const alertBlockFail = document.querySelector(".container .alert.alert-danger");
const addTicketButton = document.querySelector(".addTicket-btn.btn");
const regionSearchDom = document.querySelector(".regionSearch");
const searchResultText = document.querySelector("#searchResult-text");
// 初始化
function init() {
  const url = `https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json`;
  axios.get(url).then((res) => {
    data = res.data;
    renderHTML(data);
    renderC3(data);
  });
}
// 渲染 HTML
function renderHTML(data) {
  const list = document.querySelector(".ticketCard-area");
  let str = "";
  data.forEach((item) => {
    str += `<li class="ticketCard">
    <div class="ticketCard-img">
      <a href="#">
        <img src="${item.imgUrl}" alt="">
      </a>
      <h3 class="ticketCard-name">${item.name}</h3>
      <div class="ticketCard-region">${item.area}</div>
      <div class="ticketCard-rank">${item.rate}</div>
    </div>
    <!--   ticketCard-content   -->
    <div class="ticketCard-content">
            <div>
              <p class="ticketCard-description">
                ${item.description}
              </p>
            </div>
            <div class="ticketCard-info">
              <p class="ticketCard-num">
                <span><i class="fas fa-exclamation-circle"></i></span>
                剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
              </p>
              <p class="ticketCard-price">
                TWD <span id="ticketCard-price">$${item.price}</span>
              </p>
            </div>
          </div>
  </li>`;
  });
  list.innerHTML = str;
  setTimeout(() => alertBlockSuccess.setAttribute("style", "opacity:0"), 3000);
}
// 渲染C3 圖表
function renderC3(data) {
  // 篩選地區，並累加數字上去
  // totalObj 會變成 {高雄: 2, 台北: 1, 台中: 2}
  let totalObj = {};
  data.forEach(function (item) {
    if (totalObj[item.area] == undefined) {
      totalObj[item.area] = 1;
    } else {
      totalObj[item.area] += 1;
    }
  });

  // newData = [["高雄", 2], ["台北",1], ["台中", 1]]
  let newData = [];
  let area = Object.keys(totalObj);
  // area output ["高雄","台北","台中"]
  area.forEach(function (item) {
    let ary = [];
    ary.push(item);
    ary.push(totalObj[item]);
    newData.push(ary);
  });
  // 將 newData 丟入 c3 產生器
  const chart = c3.generate({
    bindto: "#chart",
    data: {
      columns: newData,
      type: "donut",
      colors: {
        "高雄": "#E68618",
        "台中": "#5151D3",
        "台北": "#26BFC7",
      },
    },
    donut: {
      title: "套票地區比重",
      width: 10,
    },
    size: {
      height: 160,
      width: 200,
    },
  });
}
// 監聽 event
addTicketButton.addEventListener("click", addTicket, false);
regionSearchDom.addEventListener("change", filterData, false);
// 新增套票功能
function addTicket() {
  const ticketName = document.querySelector("#ticketName");
  //const ticketImgUrl = document.querySelector("#ticketImgUrl");
  const ticketRegion = document.querySelector("#ticketRegion");
  const ticketPrice = document.querySelector("#ticketPrice");
  const ticketNum = document.querySelector("#ticketNum");
  const ticketRate = document.querySelector("#ticketRate");
  const ticketDescription = document.querySelector("#ticketDescription");
  const addTicketForm = document.querySelector(".addTicket-form");
  if (
    isValueLegal(ticketName) ||
    isValueLegal(ticketRegion) ||
    isValueLegal(ticketPrice) ||
    isValueLegal(ticketNum) ||
    isValueLegal(ticketRate) ||
    isValueLegal(ticketDescription)
  ) {
    return;
  }

  const ticketObj = {
    id: data[data.length - 1].id + 1,
    name: ticketName.value,
    imgUrl:
      "https://images.unsplash.com/photo-1522383225653-ed111181a951?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1655&q=80",
    area: ticketRegion.value,
    description: ticketDescription.value,
    group: Number(ticketNum.value),
    price: Number(ticketPrice.value),
    rate: Number(ticketRate.value),
  };
  // 驗證格式
  if (
    isFormatValue(ticketPrice) ||
    isFormatValue(ticketNum) ||
    isFormatValue(ticketRate)
  ) {
    return;
  }
  // 經過驗證後再將資料塞入
  data.push(ticketObj);
  // 顯示成功加入提示
  setTimeout(() => alertBlockSuccess.setAttribute("style", "opacity:1"), 1000);
  // 重新渲染畫面
  renderHTML(data);
  renderC3(data);
  // 清除表單文字
  addTicketForm.reset();
  // 顯示資料筆數
  searchResultText.textContent = `全部資料共 ${data.length} 筆`;
  regionSearchDom.value = "全部";
}

// 篩選地區功能
function filterData() {
  // 篩選後的陣列
  let cacheData = [];
  if (regionSearchDom.value === "全部") {
    cacheData = data.filter((item) => item);
    renderHTML(cacheData);
    renderC3(cacheData);
    searchResultText.textContent = `全部資料共${cacheData.length} 筆`;
  } else {
    // 比對為 true，回傳相對應的陣列內容
    cacheData = data.filter((item) => regionSearchDom.value == item.area);
    renderHTML(cacheData);
    renderC3(cacheData);
    searchResultText.textContent = `本次搜尋共${cacheData.length} 筆`;
  }
}
// 表單驗證是否未輸入
function isValueLegal(e) {
  let message = `${e.id}-message`;
  let alert = document.querySelector(`#${message}`);
  let alertMessage = alert;
  if (e.value.trim() == "") {
    alertMessage.setAttribute("style", "display:block");
    showAlert();
    return true;
  } else {
    alertMessage.setAttribute("style", "display:none");
    alertBlockFail.setAttribute("style", "opacity:0");
    return false;
  }
}
// 表單驗證格式
function isFormatValue(num) {
  let message = `${num.id}-message`;
  let alert = document.querySelector(`#${message}`);
  let alertMessage = alert;
  // 驗證數字是否小於等於 0
  if ((num.id == "ticketNum" || num.id == "ticketPrice") && num.value <= 0) {
    showAlert();
    alertMessage.setAttribute("style", "display:block");
    alertMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i>
  <span>不得為零!</span>`;
    return true;
    // 驗證星級是否介於 1~10
  } else if (num.id == "ticketRate" && (num.value < 1 || num.value > 10)) {
    showAlert();
    //alertBlockFail.setAttribute("style", "opacity:1");
    alertMessage.setAttribute("style", "display:block");
    alertMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i>
  <span>星級需介於 1-10!</span>`;
    return true;
  } else {
    alertMessage.setAttribute("style", "display:none");
    alertMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i>
  <span>必填!</span>`;
    return false;
  }
}
function showAlert() {
  setTimeout(() => {
    alertBlockFail.setAttribute("style", "opacity:1");
  });
  setTimeout(() => {
    alertBlockFail.setAttribute("style", "opacity:0");
  }, 2000);
}
init();
