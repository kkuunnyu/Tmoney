window.onload = () => {
  const url = "https://api.tongitongu.xyz";
  const token = sessionStorage.getItem("authToken");
  const faqEditBox = document.querySelector("#faqEditBox");
  var currentURL = window.location.href;
  var matches = currentURL.match(/\/faq-inner2\/(\d+)/);
  if (matches) {
    var faqId = matches[1];
  } else {
    alert("URL에서 값을 찾을 수 없음 - faq-inner2");
  }

  //초기화면
  axios
    .get(url + `/qna/${faqId}`)
    .then((res) => {
      if (res.data.success == true) {
        const content = res.data.data;
        const description = content.description;
        //const lineBreaksToNewlines = description.replace(/<br>/g, "\n");
        var beforeCategory = content.category;
        faqEditBox.innerHTML = "";
        faqEditBox.innerHTML = `
      <div class="status">
        <img src="../assets/images/right_arrow.png" alt="right_arrow" class="right_arrow"> &nbsp;&nbsp;FAQ 관리 - 상세 조회
      </div>
      <div class="category">
        <label for="lang">카테고리</label>
        <select name="languages" id="lang" class="faq-category">
            <option value="choice">==선택==</option>
            <option value="app_error">앱 오류</option>
            <option value="device">기기 오류</option>
            <option value="network">네트워크 오류</option>
            <option value="passenger">민원</option>
            <option value="acc">사고 관련</option>
        </select>
      
        <div class="inner-title">
          <h4>제목</h4>
          <textarea spellcheck="false" name="title-text" id="title-text" class="faq-title" cols="50" rows="1">${content.title}</textarea>
        </div>
      </div>
      <h4>내용</h4>
      <div class="text">
      <textarea spellcheck="false" name="textbox" id="textbox" class="faq-textarea" cols="100%" rows="12">${description}</textarea>
      </div>
      <div class="checkbox2">
        <ul class="check-button">
          <li class="faqEdit"><a class="save">저장</a></li>
        </ul>
      </div>   
    `;
        var langSelect = document.querySelector(".faq-category");
        switch (beforeCategory) {
          case "앱 오류":
            langSelect.value = "app_error";
            break;

          case "기기 오류":
            langSelect.value = "device";
            break;

          case "네트워크 오류":
            langSelect.value = "network";
            break;

          case "민원":
            langSelect.value = "passenger";
            break;

          case "사고 관련":
            langSelect.value = "acc";
            break;

          default:
            langSelect.value = "choice";
            break;
        }
        const editBtn = document.querySelector(".faqEdit");
        editBtn.addEventListener("click", faqUpdate);
      }
    })
    .catch((err) => {
      alert(err);
      //console.log(err);
    });

  //faq 수정
  function faqUpdate() {
    if (matches) {
      var faqId = matches[1];
    } else {
      alert("URL에서 값을 찾을 수 없음");
      return;
    }

    const axiosInstance = axios.create({
      baseURL: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const category = document.querySelector(".faq-category").value;
    var categoryText = "";
    switch (category) {
      case "app_error":
        categoryText = "앱 오류";
        break;

      case "device":
        categoryText = "기기 오류";
        break;

      case "network":
        categoryText = "네트워크 오류";
        break;

      case "passenger":
        categoryText = "민원";
        break;

      case "acc":
        categoryText = "사고 관련";
        break;

      default:
        alert("카테고리를 선택해주세요");
        return;
    }

    const updateData = {
      category: categoryText,
      title: document.querySelector(".faq-title").value,
      description: document
        .querySelector(".faq-textarea")
        .value.replace(/\n/g, "%0D%0A"),
    };
    axiosInstance
      .patch(
        url +
        `/qna/${faqId}?category=${updateData.category}&title=${updateData.title}&description=${updateData.description}`
      )
      .then((res) => {
        alert("수정되었습니다.");
        window.location = document.referrer;
      })
      .catch((err) => {
        alert(err);
        //console.log(err);
      });
    
  }
};
