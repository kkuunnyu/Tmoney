const acdList = document.getElementById("acdList");
const url = "https://api.tongitongu.xyz";
const queryParams = new URLSearchParams(window.location.search);
let page = Number(queryParams.get("page")) || 0;
let size = queryParams.get("size") || 10;
let sort = queryParams.get("sort") || 1;
let busCacmCd = queryParams.get("busCacmCd") || null;
let keyword = queryParams.get("keyword") || null;
let startDateTime = queryParams.get("startDateTime") || null;
let endDateTime = queryParams.get("endDateTime") || null;
let totalPages;
let totalElements;
const pageOption = { page, size, sort, busCacmCd, startDateTime, endDateTime, keyword, }

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

loadCategory(busCacmCd);
// 화면

function loadPage(pageOption) {
  const requestParams = {
    page, size, sort, busCacmCd, startDateTime, endDateTime, keyword,
  };

  axios.get(`${url}/report`, { params: requestParams })
    .then((res) => {
      if (res.data.success == true) {
        //console.log(`${url}/report`, { params: requestParams });
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
      alert("페이지 로드 중 오류가 발생했습니다.")
    })
}

// 기초 테이블
function initTable(noContent) {
  acdList.innerHTML = "";
  acdList.innerHTML = `
    <tr>
      <td bgcolor="#f0f0f0" width="100px" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">No</td>
      <td bgcolor="#f0f0f0" width="250px" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">제목</td>
      <td bgcolor="#f0f0f0" width="180px" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">운수사</td>
      <td bgcolor="#f0f0f0" width="180px" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;" class="skip-mobile">사고 위치</td>
      <td bgcolor="#f0f0f0" width="220px" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;" class="skip">등록인</td>
      <td bgcolor="#f0f0f0" width="220px" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;" class="skip">배차 ID</td>
      <td bgcolor="#f0f0f0" width="130px" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">신고일자</td>
    </tr>
    `
  if (noContent) {
    acdList.innerHTML += `
        <tr>
            <td colspan=7> 검색에 해당하는 내용이 없습니다. </td>
        </tr>
        `
    document.getElementById("pageNumbers").innerHTML = "";
  }
}

// render 내용
async function renderContent(content) {
  for (let i = 0; i < content.length; i++) {
    const value = content[i];
    const row = document.createElement("tr");

    row.className = "details";
    row.addEventListener("click", function () {
      sessionStorage.setItem('listPage', window.location.href);
      location.href = "/accident-inner/" + value.id;
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
      formattedDate = `${createdAtValue
        .getHours()
        .toString()
        .padStart(2, "0")}:${createdAtValue
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
    } else {
      formattedDate = `${createdAtValue.getFullYear()}-${(
        createdAtValue.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${createdAtValue
          .getDate()
          .toString()
          .padStart(2, "0")}`;
    }


    const displayNumber = sort === '0' ? page * size + (i + 1) : totalElements - (page * size + i);

    row.innerHTML = `
                <td>${displayNumber}</td>
                <td class="short-text">${value.title}</td>
                <td>${value.busCacmName}</td>
                <td class="skip-mobile">${value.latitude}, ${value.longitude}</td>
                <td class="skip">${value.busCacmEmpId}</td>
                <td class="skip">${value.rotId}</td>
                <td>${formattedDate}</td>
                `;

    acdList.appendChild(row);
  }
}

// UI 업데이트 (이전, 다음 페이지 버튼 활성/비활성)
function updateUI(totalPages) {

  // "이전 페이지" 버튼
  const prevButton = document.getElementById("prevBtn");
  prevButton.style.display = page > 0 ? "block" : "none";

  // "다음 페이지" 버튼
  const nextButton = document.getElementById("nextBtn");
  nextButton.style.display = page < totalPages - 1 ? "block" : "none";

  updatePaginationBtn(totalPages);
}


// 페이징
function updatePaginationBtn(totalPages) {
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
      updateURLParameter("busCacmCd", busCacmCd);
      updateURLParameter("startDateTime", startDateTime);
      updateURLParameter("endDateTime", endDateTime);
      updateURLParameter("keyword", keyword);
      loadPage(pageOption);
    });

    pageNumbers.appendChild(pageButton);
  }
}

// 카테고리
function loadCategory(busCacmCd) {
  let categoryURL = url + '/cacm/list';
  axios
    .get(categoryURL)
    .then((res) => {
      if (res.data.success == true) {
        const categories = res.data.data;
        const selectElement = document.querySelector(".searchCategory");
        for (let i = 0; i < categories.length; i++) {
          const optionElment = document.createElement("option");
          optionElment.value = categories[i].BUS_CACM_CD;
          optionElment.textContent = categories[i].BUS_CACM_NM;
          selectElement.appendChild(optionElment);
        }
        const selectedValue = busCacmCd || "whole";
        selectElement.value = selectedValue;
      }
    })
}

// 엔터키 막기
document.querySelector("#searchInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    document.querySelector("#searchBtn").click();
  }
});

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

// 최근사고조회
document.querySelector('.latestBtn').addEventListener("click", accLatest);

function accLatest() {
  let requestURL = url + `/report/latest`;

  axios
    .get(requestURL)
    .then((res) => {
      if (res.data.success == true) {
        const accData = res.data.data;
        location.href = "/accident-inner/" + accData.id;
      }
    })
    .catch((err) => {
      alert('페이지 로딩에 실패하였습니다');
      //console.log(err);
    });
}

// 검색버튼 클릭
document.querySelector("#searchBtn").addEventListener("click", function () {
  var searchCategory = document.querySelector(".searchCategory").value;

  switch (searchCategory) {
    case "whole":
      searchCategory = null;
      break;

    default:
      searchCategory = searchCategory;
      break;
  }

  busCacmCd = searchCategory;

  // 시간
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

  // 키워드 검색
  keyword = document.querySelector('#searchInput').value.trim();
  if (keyword === '') {
    keyword = null;
  }
  page = 0;

  updateURLParameter("page", page);
  updateURLParameter("size", size);
  updateURLParameter("sort", sort);
  updateURLParameter("busCacmCd", busCacmCd);
  updateURLParameter("startDateTime", startDateTime);
  updateURLParameter("endDateTime", endDateTime);
  updateURLParameter("keyword", keyword);

  loadPage(pageOption);

});

// 리셋버튼 클릭
document.querySelector("#resetBtn").addEventListener("click", function () {

  window.location.href = "accident?page=0&size=10&sort=1"
});


// size 필터
var sizeOpt = document.querySelector('#sizeOpt');
sizeOpt.addEventListener('change', function () {
  var selectedSize = sizeOpt.value;
  size = selectedSize;
  page = 0;
  updateURLParameter("size", size);
  updateURLParameter("page", page);
  loadPage();
});

// search 필터체크
function searchChk ({busCacmCd, startDateTime, endDateTime, keyword, size}) {
  
  document.querySelector(".searchCategory").value = busCacmCd || 'whole';
  document.querySelector('#searchInput').value = keyword;
  document.querySelector('.stDt').value = startDateTime ? startDateTime.split('T')[0].trim() : '';
  document.querySelector('.edDt').value = endDateTime ? endDateTime.split('T')[0].trim() : '';
  document.querySelector('#sizeOpt').value = size;
}