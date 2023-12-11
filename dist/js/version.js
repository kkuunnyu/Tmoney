const versionList = document.querySelector("#versionList");
const url = "https://api.tongitongu.xyz";
const queryParams = new URLSearchParams(window.location.search);
let page = Number(queryParams.get("page")) || 0;
let size = queryParams.get("size") || 10;
let sort = queryParams.get("sort") || 1;
let fileEnum = queryParams.get("fileEnum") || null;
let isForcedUpdate = queryParams.get("isForcedUpdate") || 2;
let keyword = queryParams.get("keyword") || null;
let startDateTime = queryParams.get("startDateTime") || null;
let endDateTime = queryParams.get("endDateTime") || null;
const pageOption = { page, size, sort, fileEnum, isForcedUpdate, startDateTime, endDateTime, keyword }
let totalPages;
let totalElements;

// window.addEventListener('focus', function () {
//   this.location.reload();
// })

window.onload = () => {
  sessionStorage.removeItem('listPage');
  loadPage(pageOption);
  searchChk(pageOption);

  // "이전 페이지" 버튼 클릭
  document.getElementById("prevBtn").addEventListener("click", () => {
    if (page > 0) {
      page--;
      updateURLParameter("page", page);
      loadPage(pageOption);
    }
  });

  // "다음 페이지" 버튼 클릭
  document.getElementById("nextBtn").addEventListener("click", () => {
    if (page < totalPages - 1) {
      page++;
      updateURLParameter("page", page);
      loadPage(pageOption);
    }
  });
}
loadCategory(fileEnum, isForcedUpdate);

// 화면
function loadPage(pageOption) {
  const requestParams = {
    page, size, sort, fileEnum, isForcedUpdate, startDateTime, endDateTime, keyword
  }

  axios.get(`${url}/app-version`, { params: requestParams })
    .then((res) => {
      if (res.data.success == true) {
        //console.log(`${url}/app-version`, { params: requestParams });
        const content = res.data.data.content;
        totalPages = res.data.data.totalPages;
        totalElements = res.data.data.totalElements;

        initTable(content.length === 0);

        if (content.length > 0) {
          renderContent(content);
        }
        updateUI(totalPages);
      }
    })
    .catch((err) => {
      //console.error("페이지 로드 중 오류 발생:", err);
      alert("페이지 로드 중 오류가 발생했습니다.");
    })
}
function initTable(noContent) {
  versionList.innerHTML = "";
  versionList.innerHTML = `
  <tr>
    <td bgcolor="#f0f0f0" width="1%" class="table-no" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">NO</td>
    <td bgcolor="#f0f0f0" width="45%" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">버전</td>
    <td bgcolor="#f0f0f0" width="40%" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">플랫폼</td>
    <td bgcolor="#f0f0f0" width="14%" class="table-date" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">업데이트 날짜</td>
  </tr>
  `
  if (noContent) {
    versionList.innerHTML += `
    <tr>
      <td colspan = 4> 검색에 해당하는 내용이 없습니다</td>
    </tr>
    `

    document.querySelector("#pageNumbers").innerHTML = "";
  }
}

async function renderContent(content) {

  for (let i = 0; i < content.length; i++) {
    const value = content[i];
    const row = document.createElement("tr");

    row.className = "details";
    row.addEventListener("click", function () {
      sessionStorage.setItem('listPage', window.location.href);
      location.href = "/version-inner/" + value.id;
    });

    // 날짜 포맷 오늘(hh:mm) / 아닌것 (yyyy-MM-dd)
    const currentDate = new Date();
    const createdAtValue = new Date(value.createdAt);
    let formattedDate = '';

    if (
      currentDate.getFullYear() === createdAtValue.getFullYear() &&
      currentDate.getMonth() === createdAtValue.getMonth() &&
      currentDate.getDate() === createdAtValue.getDate()
    ) {
      formattedDate = `${createdAtValue.getHours().toString().padStart(2, "0")}:${createdAtValue.getMinutes().toString().padStart(2, "0")}`
    } else {
      formattedDate = `${createdAtValue.getFullYear()}-${(createdAtValue.getMonth() + 1).toString().padStart(2, "0")}-${createdAtValue.getDate().toString().padStart(2, "0")}`
    }

    //리스트 개행제거
    const description = value.description;
    const newlines = description.replace(/<br>/g, " ");

    //글자 수 제한
    const truncDescription =
      newlines.length > 40 ? newlines.slice(0, 40) + "..." : newlines;

    var platform = "";
    switch (value.fileEnum) {
      case "FILE_ANDROID":
        platform = "Android";
        break;
      case "FILE_IOS":
        platform = "iOS";
        break;
      default:
        platform = "버전미선택";
        break;
    }

    const displayNumber = sort === '0' ? page * size + (i + 1) : totalElements - (page * size + i);

    row.innerHTML = `<td>${displayNumber}</td>
                <td>${value.versionCode}</td>
                <td>${platform}</td>
                <td>${formattedDate}</td>`;

    versionList.appendChild(row);
  }
}

// UI 업데이트 (이전, 다음 페이지 버튼 활성/비활성)
function updateUI(totalPages) {
  // "이전 페이지" 버튼 활성화/비활성화 관리
  const prevButton = document.getElementById("prevBtn");
  prevButton.style.display = page > 0 ? "block" : "none";

  // "다음 페이지" 버튼 활성화/비활성화 관리
  const nextButton = document.getElementById("nextBtn");
  nextButton.style.display = page < totalPages - 1 ? "block" : "none";

  updatePaginationBtn(totalPages);
}

// 페이징
function updatePaginationBtn() {
  const pageNumbers = document.getElementById("pageNumbers");
  pageNumbers.innerHTML = "";

  const pageRange = 5;
  const startPage = Math.floor(page / pageRange) * pageRange + 1;
  const endPage = Math.min(startPage + pageRange - 1, totalPages);

  for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
    const pageButton = document.createElement("button");
    pageButton.classList.add("btn-page");
    pageButton.textContent = pageNum;

    if (pageNum === page + 1) {
      // 페이지 번호와 배열 인덱스 조정
      pageButton.classList.add("btn-selected");
    }

    pageButton.addEventListener("click", () => {
      page = pageNum - 1; //
      updateURLParameter("page", page);
      updateURLParameter("size", size);
      updateURLParameter("sort", sort);
      updateURLParameter("fileEnum", fileEnum);
      updateURLParameter("isForcedUpdate", isForcedUpdate);
      updateURLParameter("startDateTime", startDateTime);
      updateURLParameter("endDateTime", endDateTime);
      updateURLParameter("keyword", keyword);
      loadPage(pageOption);
    });

    pageNumbers.appendChild(pageButton);
  }
}

// 카테고리
function loadCategory(fileEnum, isforcedUpdate) {
  switch (fileEnum) {
    case "FILE_ANDROID":
      fileEnum = "FILE_ANDROID";
      break;
    case "FILE_IOS":
      fileEnum = "FILE_IOS";
      break;
    default:
      fileEnum = null;
      break;
  }
  const fileEnumSelectElement = document.querySelector(".searchCategory");
  const selectedFileEnum = fileEnum || "whole";
  fileEnumSelectElement.value = selectedFileEnum;

  //업데이트여부

  switch (isforcedUpdate) {
    case '0':
      forcedUpdateCategory = "choose";
      break;
    case '1':
      forcedUpdateCategory = "must";
      break;
    default:
      forcedUpdateCategory = "whole";
      break;
  }
  const forcedUpdateSelectElement = document.querySelector(".searchCategory2");
  const selectedForcedUpdate = forcedUpdateCategory || "whole";
  forcedUpdateSelectElement.value = selectedForcedUpdate;
}

// 엔터키 막기
document.querySelector('#searchInput').addEventListener('keypress', function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    document.querySelector('#searchBtn').click();
  }
})

// URL 매개변수 업데이트
function updateURLParameter(param, value) {
  const url = new URL(window.location.href);
  if (value == null) {
    url.searchParams.delete(param);
  } else {
    url.searchParams.set(param, value);

  }
  window.history.replaceState({}, "", url);
}

// 검색버튼
document.querySelector("#searchBtn").addEventListener("click", function () {
  //플랫폼
  let searchCategory = document.querySelector(".searchCategory").value;

  switch (searchCategory) {
    case "FILE_ANDROID":
      searchCategory = "FILE_ANDROID";
      break;
    case "FILE_IOS":
      searchCategory = "FILE_IOS";
      break;
    default:
      searchCategory = null;
      break;
  }
  fileEnum = searchCategory;

  //업데이트여부
  isForcedUpdate = document.querySelector(".searchCategory2").value;

  switch (isForcedUpdate) {
    case "choose":
      isForcedUpdate = 0;
      break;
    case "must":
      isForcedUpdate = 1;
      break;
    default:
      isForcedUpdate = 2;
      break;
  }



  //시간
  let startDate = document.querySelector('.stDt').value;
  let endDate = document.querySelector('.edDt').value;

  startDateTime = startDate ? startDate + 'T00:00:00' : null;
  endDateTime = endDate ? endDate + 'T00:00:00' : null;

  if (endDate) {
    const endDateObj = new Date(endDate);
    endDateObj.setDate(endDateObj.getDate() + 1);
    endDateTime = endDateObj.toISOString().split('T')[0] + 'T00:00:00';
  }

  // startDate와 endDate가 모두 선택되었을 경우에는 endDate가 startDate를 앞설 수 없게 alert를 띄움
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    alert("종료일은 시작일보다 앞설 수 없습니다.");
    return;
  }

  //키워드 검색
  keyword = document.querySelector('#searchInput').value.trim();
  if (keyword === '') {
    keyword = null;
  }
  page = 0;
  updateURLParameter("page", page);
  updateURLParameter("size", size);
  updateURLParameter("sort", sort);
  updateURLParameter("fileEnum", fileEnum);
  updateURLParameter("isForcedUpdate", isForcedUpdate);
  updateURLParameter("startDateTime", startDateTime);
  updateURLParameter("endDateTime", endDateTime);
  updateURLParameter("keyword", keyword);

  loadPage(pageOption);

});

//리셋버튼
document.querySelector("#resetBtn").addEventListener("click", function () {
  // page = 0;
  // size = 10;
  // sort = 1;
  // startDateTime = null;
  // keyword = null;
  // updateURLParameter("page", page);
  // updateURLParameter("size", size);
  // updateURLParameter("sort", sort);
  // updateURLParameter("startDateTime", startDateTime);
  // updateURLParameter("endDateTime", endDateTime);
  // updateURLParameter("keyword", keyword);

  // loadPage(page, size, sort, startDateTime, endDateTime, keyword);

  window.location.href = "version?page=0&size=10&sort=1"
});

// size 필터
var sizeOpt = document.querySelector('#sizeOpt');
sizeOpt.value = size;
sizeOpt.addEventListener('change', function () {
  var selectedSize = sizeOpt.value;
  size = selectedSize;
  page = 0;
  updateURLParameter("size", selectedSize);
  updateURLParameter("page", page);
  loadPage();
});

// search 필터체크
function searchChk ({category, startDateTime, endDateTime, keyword, size}) {
  
  document.querySelector(".searchCategory").value = category || 'whole';
  document.querySelector('#searchInput').value = keyword;
  document.querySelector('.stDt').value = startDateTime ? startDateTime.split('T')[0].trim() : '';
  document.querySelector('.edDt').value = endDateTime ? endDateTime.split('T')[0].trim() : '';
  document.querySelector('#sizeOpt').value = size;
}