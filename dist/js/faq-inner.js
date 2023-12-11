window.onload = () => {
  const faqDetail = document.querySelector("#faqDetail");
  const url = "https://api.tongitongu.xyz";
  var currentURL = window.location.href;
  var matches = currentURL.match(/\/faq-inner\/(\d+)/);

  if (matches) {
    var faqId = matches[1];
  } else {
    alert("URL에서 값을 찾을 수 없음.");
  }
  loadPage();
  function loadPage() {
    axios
      .get(url + `/qna/${faqId}`)
      .then((res) => {
        if (res.data.success == true) {
          const content = res.data.data;
          const createdAt = new Date(content.createdAt);
          const description = content.description;
          const formattedDate = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, "0")}-${createdAt.getDate().toString().padStart(2, "0")}
        ${createdAt.getHours().toString().padStart(2, "0")}:${createdAt.getMinutes().toString().padStart(2, "0")}`;

          faqDetail.innerHTML = "";
          faqDetail.innerHTML = `
        <div class="status">
            <img src="../assets/images/right_arrow.png" alt="right_arrow" class="right_arrow"> &nbsp;&nbsp;FAQ 관리 - 상세 조회
          </div>
          <span class="category-text">${content.category} ></span>
          <span class="title-text2">${content.title}</span>
          <span class="text-time">${formattedDate}</span>
          <div class="text-box2">
            ${description.replace(/\n/g, "<br>")}
          </div>
          <div class="checkbox2">
            <ul class="check-button">
              <li><a class="faqList" href="javascript:void(0)">확인</a></li>
              <li><a class="faqDel" href="javascript:void(0)">삭제</a></li>
              <li><a class="edit" href="/faq-inner2/${faqId}">수정</a></li>
            </ul>
          </div>
        `;
          const delBtn = document.querySelector(".faqDel");
          delBtn.addEventListener("click", delConfirm);

          const listBtn = document.querySelector(".faqList");
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
      faqDelete();
    }
  }

  //faq 삭제
  function faqDelete() {
    const url = "https://api.tongitongu.xyz";
    var currentURL = window.location.href;
    var matches = currentURL.match(/\/faq-inner\/(\d+)/);

    if (matches) {
      var faqId = matches[1];
    } else {
      alert("URL에서 값을 찾을 수 없음");
      return;
    }

    //로그인시 토큰 입력
    const token = sessionStorage.getItem("authToken");

    const axiosInstance = axios.create({
      baseURL: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    axiosInstance
      .delete(url + `/qna/${faqId}?id=${faqId}`)
      .then((res) => {
        alert("삭제되었습니다");
        toList();
      })
      .catch((err) => {
        alert(err);
        //console.log(err);
      });
  }

  //목록으로(확인)
  function toList() {
    const listPage = sessionStorage.getItem('listPage');
    if (listPage) {
      window.location = listPage;
    } else {
      window.location.href = "/faq?page=0&size=10&sort=1"
    }
  }
};
