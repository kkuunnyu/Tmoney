const config = {
  url: "https://api.tongitongu.xyz",
  currentURL: window.location.href,
  token: sessionStorage.getItem("authToken"),
  noticeId: null,
  noticeDetail: document.querySelector("#noticeDetail"),
}

window.onload = () => {
  config.noticeId = getNoticeId();
  loadPage(config.noticeDetail);
}

//noticeId 값
function getNoticeId() {
  const matches = config.currentURL.match(/\/notice-inner\/(\d+)/);
  return matches ? matches[1] : alert('URL에서 값을 찾을 수 없음')
}

//axios token포함
const axiosInstance = axios.create({
  baseURL: config.url,
  headers: {
    Authorization: `Bearer ${config.token}`,
  },
});

//화면
function loadPage(noticeDetail) {

  axios
    .get(config.url + `/notice/${config.noticeId}`)
    .then((res) => {
      if (res.data.success == true) {
        const content = res.data.data;
        const createdAt = new Date(content.createdAt);
        const description = content.description;
        const formattedDate = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, "0")}-${createdAt.getDate().toString().padStart(2, "0")} 
          ${createdAt.getHours().toString().padStart(2, "0")}:${createdAt.getMinutes().toString().padStart(2, "0")}`;

        noticeDetail.innerHTML = `
          <div class="status">
          <img src="../assets/images/right_arrow.png" alt="right_arrow" class="right_arrow"> &nbsp;&nbsp;공지사항 관리 - 상세 조회
          </div>
          <span class="category-text">${content.category} ></span>
          <span class="title-text2">${content.title}</span>
          <span class="text-time">${formattedDate}</span>
          <div class="text-box2">${description.replace(/\n/g, "<br>")}</div>
          <div class="checkbox2">
            <ul class="check-button">
              <li><a class="toList" href="javascript:void(0)">확인</a></li>
              <li><a class="noticeDel" href="javascript:void(0)">삭제</a></li>
              <li><a class="edit" href="/notice-inner2/${config.noticeId}">수정</a></li>
            </ul>
          </div>
        </div>   
                `;


        //notice 삭제버튼
        const delBtn = document.querySelector(".noticeDel");
        delBtn.addEventListener("click", delConfirm);
        
        //목록버튼
        const listBtn = document.querySelector(".toList");
        listBtn.addEventListener("click", toList);
      }
    })
    .catch((err) => {
      handleRequestError(err);
    });
}

//notice 삭제 confirm
function delConfirm() {
  if (confirm("삭제하시겠습니까")) {
    noticeDelete();
  }
}

//notice 삭제
function noticeDelete() {

  axiosInstance
    .delete(config.url + `/notice/${config.noticeId}?id=${config.noticeId}`)
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
  const listPage =  sessionStorage.getItem('listPage');
  if (listPage) {
    window.location = listPage;
  } else {
    window.location.href = "/notice?page=0&size=10&sort=1"
  }
}

function handleRequestError(err) {
  alert('페이지 로딩에 실패하였습니다.');
  console.error('페이지 로딩에 오류가 발생하였습니다.', err);
}