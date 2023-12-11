window.onload = () => {
  const url = "https://api.tongitongu.xyz";
  const token = sessionStorage.getItem("authToken");
  const termsEditBox = document.querySelector("#termsEditBox");
  var currentURL = window.location.href;
  var matches = currentURL.match(/\/terms-inner2\/(\d+)/);
  if (matches) {
    var termsId = matches[1];
  } else {
    alert("URL에서 값을 찾을 수 없음");
  }

  //초기화면
  axios
    .get(url + `/term/${termsId}`)
    .then((res) => {
      if (res.data.success == true) {
        const content = res.data.data;
        var beforeCategory = content.category;

        termsEditBox.innerHTML = "";
        termsEditBox.innerHTML = `
        <div class="status">
        <img src="../assets/images/right_arrow.png" alt="right_arrow" class="right_arrow"/>
         &nbsp;&nbsp;약관 관리 - 상세 조회
        </div>
        <div class="category">
            <label for="lang">카테고리</label>
            <select name="languages" id="lang" class="terms-category">
              <option value="choice">==선택==</option>
              <option value="terms1">약관(1)</option>
              <option value="terms2">약관(2)</option>
            </select>

        <div class="inner-title">
          <h4>제목</h4>
          <textarea spellcheck="false" name="title-text" id="title-text" class="terms-title" cols="50" rows="1">${content.title}</textarea          >
        </div>
      </div>
      <h4>내용</h4>
      <div class="text">
        <textarea spellcheck="false" name="textbox" id="textbox" class="terms-textarea" cols="100%" rows="12">${content.description}</textarea>
      </div>
      <div class="checkbox2">
        <ul class="check-button">
          <li class="termsEdit"><a class="save">저장</a></li>
        </ul>
      </div>
      `;
        var langSelect = document.querySelector(".terms-category");

        switch (beforeCategory) {
          case "약관(1)":
            langSelect.value = "terms1";
            break;
          case "약관(2)":
            langSelect.value = "terms2";
            break;
          default:
            langSelect.value = "choice";
            break;
        }

        const editBtn = document.querySelector(".termsEdit");
        editBtn.addEventListener("click", termsUpdate);
      }
    })
    .catch((err) => {
      alert(err);
      //console.log(err);
    });

  //terms 수정
  function termsUpdate() {
    const axiosInstance = axios.create({
      baseURL: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const category = document.querySelector(".terms-category").value;

    var categoryText = "";
    switch (category) {
      case "terms1":
        categoryText = "약관(1)";
        break;
      case "terms2":
        categoryText = "약관(2)";
        break;
      default:
        alert("카테고리를 선택해주세요");
        return;
    }

    const updateData = {
      category: categoryText,
      title: document.querySelector(".terms-title").value,
      description: document
        .querySelector(".terms-textarea")
        .value.replace(/\n/g, "%0D%0A"),
    };
    axiosInstance
      .patch(
        url +
        `/term/${termsId}?category=${updateData.category}&title=${updateData.title}&description=${updateData.description}`
      )
      .then((res) => {
        alert("수정되었습니다.");
        //window.history.back();
        window.location = document.referrer;
      })
      .catch((err) => {
        alert(err);
        //console.log(err);
      });
  }
};
