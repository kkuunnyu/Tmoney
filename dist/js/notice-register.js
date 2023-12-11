const config = {
  url: "https://api.tongitongu.xyz", //URL
  token: sessionStorage.getItem("authToken"), //token
};

const NoticeCategory = {
  APP_ERROR: "app_error",
  DEVICE: "device"
};

const createBtn = document.querySelector(".save"); //저장버튼
createBtn.addEventListener("click", noticeCreate);

//axios에 token포함
const axiosInstance = axios.create({
  baseURL: config.url,
  headers: {
    Authorization: `Bearer ${config.token}`,
  },
});

//타이틀 엔터키 막기
const noNewline = document.querySelector(".notice-title");
noNewline.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
  }
});

//notice 생성
function noticeCreate() {
  const category = document.querySelector(".notice-category").value;
  const title = document.querySelector(".notice-title").value;
  const description = document.querySelector(".notice-textarea").value;
  const categoryText = getCategoryText(category);

  if (!categoryText || !isValidInput(title, "제목", "notice-title") || !isValidInput(description, "내용", "notice-textarea")) return;

  const createData = {
    category: categoryText,
    title: title,
    description: description,
  };

  axiosInstance
    .post(config.url + "/notice", createData)
    .then((res) => {
      alert("등록되었습니다");
      toList();
    })
    .catch((err) => {
      handleRequestError(err);
    });
}


function getCategoryText(category) {
  switch (category) {
    case NoticeCategory.APP_ERROR:
      return "긴급";

    case NoticeCategory.DEVICE:
      return "업데이트";

    default:
      alert("카테고리를 선택해주세요");
      return null;
  }
}
/**
 * 
 * @param {*값} value 
 * @param {*필드명} fieldName 
 * @param {*클래스명} className 
 * @returns 
 */
function isValidInput(value, fieldName, className) {
  if (!value.trim()) {
    alert(`${fieldName}을(를)작성해주세요`);
    document.querySelector(`.${className.toLowerCase()}`).focus();
    return false;
  }
  return true;
}

function handleRequestError(err) {
  alert('페이지 로딩에 실패하였습니다.');
  console.error('페이지 로딩에 오류가 발생하였습니다.', err);
}


//목록으로(확인버튼)
function toList() {
  const listPage = sessionStorage.getItem('listPage');
  if (listPage) {
    window.location = listPage;
  } else {
    window.location.href = "/notice?page=0&size=10&sort=1"
  }
}
