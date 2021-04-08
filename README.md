Week7 作業 - https://youtingluo.github.io/jsStream-week7/

# 函式分工

- 分成多種函示執行
    1. 撈遠端資料初始化

    ```jsx
    // 初始化
    function init() {
      axios
        .get(
          "https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json"
        )
        .then((res) => {
          data = res.data;
          console.log(data);
          renderHTML();
          renderC3();
        });
    }
    ```

    2.  撈遠端資料初始化

    ```jsx
    // 渲染 HTML
    function renderHTML() {
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
    }
    ```

    3.  渲染C3

    ```jsx
    // 渲染D3 圖表
    function renderC3() {
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
    ```

    4.   篩選地區功能

    ```jsx
    function filterData() {
      let cacheData = [];
      if (regionSearchDom.value === "全部") {
        cacheData = data.filter((item) => item);
        renderHTML(cacheData);
        renderC3(cacheData);
        searchResultText.textContent = `全部資料共${cacheData.length} 筆`;
      } else {
        cacheData = data.filter((item) => regionSearchDom.value == item.area);
        renderHTML(cacheData);
        renderC3(cacheData);
        searchResultText.textContent = `本次搜尋共${cacheData.length} 筆`;
      }
    }
    ```

    5.  新增套票功能

    ```jsx
    function addTicket() {
      const ticketName = document.querySelector("#ticketName");
      //const ticketImgUrl = document.querySelector("#ticketImgUrl");
      const ticketRegion = document.querySelector("#ticketRegion");
      const ticketPrice = document.querySelector("#ticketPrice");
      const ticketNum = document.querySelector("#ticketNum");
      const ticketRate = document.querySelector("#ticketRate");
      const ticketDescription = document.querySelector("#ticketDescription");
      const addTicketForm = document.querySelector(".addTicket-form");
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
      // 經過驗證後再將資料塞入
      data.push(ticketObj);
      // 重新渲染畫面
      renderHTML(data);
      renderC3(data);
      // 清除表單文字
      addTicketForm.reset();
      // 顯示文字
      searchResultText.textContent = `全部資料共${data.length} 筆`;
    }
    ```

    6.  驗證表單

    ```jsx
    // 表單驗證是否未輸入
    function isValueLegal(e) {
      let message = `${e.id}-message`;
      let alert = document.querySelector(`#${message}`);
      let alertMessage = alert;
      if (e.value.trim() == "") {
        alertMessage.setAttribute("style", "display:block");
        return true;
      } else {
        alertMessage.setAttribute("style", "display:none");
        return false;
      }
    }
    ```

    7.  驗證表單格式

    ```jsx
    // 表單驗證格式
    function isFormatValue(num) {
      let message = `${num.id}-message`;
      let alert = document.querySelector(`#${message}`);
      let alertMessage = alert;
      // 驗證數字是否小於等於 0
      if ((num.id == "ticketNum" || num.id == "ticketPrice") && num.value <= 0) {
        alertMessage.setAttribute("style", "display:block");
        alertMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i>
      <span>不得為零!</span>`;
        return true;
        // 驗證星級是否介於 1~10
      } else if (num.id == "ticketRate" && (num.value < 1 || num.value > 10)) {
        alertMessage.setAttribute("style", "display:block");
        alertMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i>
      <span>星級需介於 1-10!</span>`;
        return true;
    		// 當驗證都正確，回復為預設提示
      } else {
        alertMessage.setAttribute("style", "display:none");
        alertMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i>
      <span>必填!</span>`;
        return false;
      }
    }
    ```
