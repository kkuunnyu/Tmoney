window.onload = () => {
  const url = "https://api.tongitongu.xyz";
  var currentURL = window.location.href;
  var matches = currentURL.match(/\/terms-inner\/(\d+)/);
  const termsDetail = document.querySelector("#termsDetail");
  if (matches) {
    var termsId = matches[1];
  } else {
    alert("URL에서 값을 찾을 수 없음.");
  }

  loadPage();

  //화면
  function loadPage() {
    axios
      .get(url + `/term/${termsId}`)
      .then((res) => {
        if (res.data.success == true) {
          const content = res.data.data;
          const description = content.description;

          //날짜 포맷
          const createdAtValue = new Date(content.createdAt);
          const formattedDate = `${createdAtValue.getFullYear()}-${(createdAtValue.getMonth() + 1).toString().padStart(2, "0")}-${createdAtValue.getDate().toString().padStart(2, "0")} 
          ${createdAtValue.getHours().toString().padStart(2, "0")}:${createdAtValue.getMinutes().toString().padStart(2, "0")}`;

          termsDetail.innerHTML = "";
          termsDetail.innerHTML = `
          <div class="status">
          <img src="../assets/images/right_arrow.png" alt="right_arrow" class="right_arrow"> &nbsp;&nbsp;약관 관리 - 상세 조회
        </div>
        <span class="category-text">약관 ></span>
        <span class="title-text2">${content.title}</span>
        <span class="text-time">${formattedDate}</span>
        <div class="text-box2">
        ${description.replace(/\n/g, "<br>")}
        </div>
        <div class="checkbox2">
          <ul class="check-button">
            <li><a class="termsList">확인</a></li>
            <li><a class="termsDel">삭제</a></li>
            <li><a class="edit" href="/terms-inner2/${termsId}">수정</a></li>
          </ul>
        </div>
                    `;
          const delBtn = document.querySelector(".termsDel");
          delBtn.addEventListener("click", delConfirm);

          const listBtn = document.querySelector(".termsList");
          listBtn.addEventListener("click", toList);
        }
      })
      .catch((err) => {
        alert(err);
        //console.log(err);
      });
  }
  function delConfirm() {
    if (confirm("삭제하시겠습니까")) {
      termsDelete();
    }
  }

  //terms 삭제
  function termsDelete() {
    const token = sessionStorage.getItem("authToken");

    const axiosInstance = axios.create({
      baseURL: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    axiosInstance
      .delete(url + `/term/${termsId}?id=${termsId}`)
      .then((res) => {
        alert("삭제되었습니다");
        toList();
      })
      .catch((err) => {
        alert(err);
        //console.log(err);
      });
  }

  //목록으로(확인버튼)
  function toList() {
    const listPage = sessionStorage.getItem('listPage');
    if (listPage) {
      window.location = listPage;
    } else {
      window.location.href = "/terms"
    }
  }
};
