const bccList = document.getElementById("bccList");
const url = "https://api.tongitongu.xyz";
const queryParams = new URLSearchParams(window.location.search);
let page = Number(queryParams.get("page")) || 0;
let size = queryParams.get("size") || 10;
let sort = queryParams.get("sort") || 1;
let keyword = queryParams.get("keyword") || null;
let totalPages;
let totalElements;
const pageOption = { page, size, sort, keyword, }


window.onload = () => {
  loadPage(pageOption);

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


//카테고리

// 화면

function loadPage(pageOption) {
  const requestParams = {
    page, size, sort, keyword,
  };

  axios.get(`${url}/cls`, { params: requestParams })
    .then((res) => {
      if (res.data.success == true) {
        //console.log(`${url}/cls`, { params: requestParams });
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
      console.error("페이지 로드 중 오류 발생:", err);
      alert("페이지 로드 중 오류가 발생했습니다.")
    })
}

// 기초 테이블
function initTable(noContent) {
  bccList.innerHTML = "";
  bccList.innerHTML = `
    <tr>
        <td bgcolor="#f0f0f0" class="table-no" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">No</td>
        <td bgcolor="#f0f0f0" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">버스등급코드</td>
        <td bgcolor="#f0f0f0" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">버스등급명</td>
        <td bgcolor="#f0f0f0" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">버스등급단축명</td>
    </tr>
    `
  if (noContent) {
    bccList.innerHTML += `
        <tr>
            <td colspan=4> 검색에 해당하는 내용이 없습니다. </td>
        </tr>
        `
    document.getElementById("pageNumbers").innerHTML = "";
  }
}

// render 내용
async function renderContent(content) {
  const rows = [];
  for (let i = 0; i < content.length; i++) {
    const value = content[i];
    const row = document.createElement("tr");
    const displayNumber = sort === '0' ? page * size + (i + 1) : totalElements - (page * size + i);
    row.className = "details3";

    row.innerHTML = `
                <td class="table-no">${displayNumber}</td>
                <td>${value.BUS_CLS_CD}</td>
                <td>${value.BUS_CLS_NM}</td>
                <td>${value.BUS_CLS_SHCT_NM}</td>
                `;

    rows.push(row);
  }
  bccList.append(...rows);
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
      updateURLParameter("keyword", keyword);
      loadPage(pageOption);
    });

    pageNumbers.appendChild(pageButton);
  }
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


// 검색버튼 클릭
document.querySelector("#searchBtn").addEventListener("click", function () {



  // 키워드 검색
  keyword = document.querySelector('#searchInput').value.trim();
  if (keyword === '') {
    keyword = null;
  }
  page = 0;

  updateURLParameter("page", page);
  updateURLParameter("size", size);
  updateURLParameter("sort", sort);
  updateURLParameter("keyword", keyword);

  loadPage(pageOption);

});

// 리셋버튼 클릭
document.querySelector("#resetBtn").addEventListener("click", function () {

  window.location.href = "info-bus-class-code?page=0&size=10&sort=1"
});

// size 필터
var sizeOpt = document.querySelector('#sizeOpt');
sizeOpt.addEventListener('change', function () {
  var selectedSize = sizeOpt.value;
  size = selectedSize;
  page = 0;
  updateURLParameter("size", selectedSize);
  updateURLParameter("page", page);
  loadPage();
});
