window.onload = () => {
  const url = "https://api.tongitongu.xyz";
  const token = sessionStorage.getItem("authToken");
  const noticeEditBox = document.querySelector("#noticeEditBox");
  var currentURL = window.location.href;
  var matches = currentURL.match(/\/notice-inner2\/(\d+)/);
  if (matches) {
    var noticeId = matches[1];
  } else {
    alert("URL에서 값을 찾을 수 없음");
  }

  //초기화면
  axios
    .get(url + `/notice/${noticeId}`)
    .then((res) => {
      if (res.data.success == true) {
        const content = res.data.data;
        var beforeCategory = content.category;

        noticeEditBox.innerHTML = "";
        noticeEditBox.innerHTML = `
        <div class="status">
        <img src="../assets/images/right_arrow.png" alt="right_arrow" class="right_arrow"> &nbsp;&nbsp;공지사항 관리 - 상세 조회
      </div>
      <div class="category">
        <label for="lang">카테고리</label>
        <select name="languages" id="lang" class="notice-category">
            <option value="choice">==선택==</option>
            <option value="app_error">긴급</option>
            <option value="device">업데이트</option>
        </select>
        <div class="inner-title">
          <h4>제목</h4>
          <textarea spellcheck="false" name="title-text" id="title-text" class="notice-title" cols="50" rows="1">${content.title}</textarea>
        </div>
    </div>
    <h4>내용</h4>
    <div class="text">
    <textarea spellcheck="false" name="textbox" id="textbox" class="notice-textarea" cols="100%" rows="12">${content.description}</textarea>
    </div>
    <div class="checkbox2">
      <ul class="check-button">
        <li class="noticeEdit"><a class="save">저장</a></li>
      </ul>
    </div> 
    `;
        var langSelect = document.querySelector(".notice-category");
        switch (beforeCategory) {
          case "긴급":
            langSelect.value = "app_error";
            break;
          case "업데이트":
            langSelect.value = "device";
            break;
          default:
            langSelect.value = "choice";
            break;
        }

        const editBtn = document.querySelector(".noticeEdit");
        editBtn.addEventListener("click", noticeUpdate);
      }
    })
    .catch((err) => {
      alert(err);
      //console.log(err);
    });

  //notice 수정
  function noticeUpdate() {
    const axiosInstance = axios.create({
      baseURL: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const category = document.querySelector(".notice-category").value;
    
    var categoryText = "";
    switch (category) {
      case "app_error":
        categoryText = "긴급";
        break;
      case "device":
        categoryText = "업데이트";
        break;
      default:
        alert("카테고리를 선택해주세요");
        return;
    }
    console.log("categoryText: " + categoryText);

    const updateData = {
      category: categoryText,
      title: document.querySelector(".notice-title").value,
      description: document
        .querySelector(".notice-textarea")
        .value.replace(/\n/g, "%0D%0A"),
    };
    axiosInstance
      .patch(
        url +
        `/notice/${noticeId}?category=${updateData.category}&title=${updateData.title}&description=${updateData.description}`
      )
      .then((res) => {
        alert("수정되었습니다.");
        //window.history.back();
        window.location.href = `/notice-inner/${noticeId}`
      })
      .catch((err) => {
        alert(err);
    
      });
  }
};
