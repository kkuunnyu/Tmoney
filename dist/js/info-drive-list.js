const cacmList = document.querySelector('#cacmList');
const url = "https://api.tongitongu.xyz"
const queryParams = new URLSearchParams(window.location.search);
let page = Number(queryParams.get("page")) || 0;
let size = queryParams.get("size") || 10;
let sort = queryParams.get("sort") || 0;
let keyword = queryParams.get("keyword") || null;
let totalPages;
let totalElements;
const pageOption = { page, size, sort, keyword }

window.onload = () => {
    sessionStorage.removeItem('listPage');
    loadPage(pageOption);
    searchChk(pageOption);
}

function loadPage(pageOption) {
    let requestURL = url + `/cacm?page=${page}&size=${size}&sort=${sort}`;
    if (keyword !== null && keyword !== undefined) {
        requestURL += `&keyword=${keyword}`
    }

    axios
        .get(requestURL)
        .then((res) => {
            if (res.data.success == true) {
                const content = res.data.data.content;
                //console.log("requestURL: ", requestURL)
                totalPages = res.data.data.totalPages;
                totalElements = res.data.data.totalElements;
                if (totalElements === 0) {
                    cacmList.innerHTML = ""
                    cacmList.innerHTML = `
                    <tr>
                    <td width="100px" bgcolor="#f0f0f0" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">No</td>
                    <td width="150px" bgcolor="#f0f0f0" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">운수사 코드</td>
                    <td width="180px" bgcolor="#f0f0f0" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">운수사 이름</td>
                    <td width="180px" bgcolor="#f0f0f0" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">운수사단축명</td>
                    <td width="400px" bgcolor="#f0f0f0" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">주소</td>
                    <td width="150px" bgcolor="#f0f0f0" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">전화번호</td>
                </tr>
                      `
                } else {

                    cacmList.innerHTML = ""
                    cacmList.innerHTML = `
                    <tr>
                    <td width="100px" bgcolor="#f0f0f0" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">No</td>
                    <td width="150px" bgcolor="#f0f0f0" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">운수사 코드</td>
                    <td width="180px" bgcolor="#f0f0f0" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">운수사 이름</td>
                    <td width="180px" bgcolor="#f0f0f0" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">운수사단축명</td>
                    <td width="400px" bgcolor="#f0f0f0" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">주소</td>
                    <td width="150px" bgcolor="#f0f0f0" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">전화번호</td>
                </tr>`;
                    for (let i = 0; i < content.length; i++) {
                        const value = content[i];

                        const row = document.createElement("tr");
                        row.className = "details";

                        row.addEventListener("click", function () {
                            sessionStorage.setItem('listPage', window.location.href);
                            location.href = "/drive-list-inner/" + value.BUS_CACM_CD;
                        });

                        // 날짜 포맷
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

                        //전화번호 포맷
                        const numbersOnly = value.BUS_CACM_TEL_NO;
                        let formattedPhone = '';

                        if (numbersOnly) {
                            switch (numbersOnly.length) {
                                case 8:
                                    formattedPhone = numbersOnly.replace(/(\d{4})(\d{4})/, '$1-$2');
                                    break;
                                case 9:
                                    formattedPhone = numbersOnly.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
                                    break;
                                case 10:
                                    formattedPhone = numbersOnly.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                                    break;
                                case 11:
                                    formattedPhone = numbersOnly.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
                                    break;
                                default:
                                    formattedPhone = numbersOnly;
                            }
                        }

                        const displayNumber = sort === '0' ? page * size + (i + 1) : totalElements - (page * size + i);

                        row.innerHTML = `
                          <td>${displayNumber}</td>
                          <td>${value.BUS_CACM_CD}</td>
                          <td>${value.BUS_CACM_NM}</td>
                          <td>${value.BUS_CACM_SHCT_NM}</td>
                          <td>${value.BUS_CACM_ADDR}</td>
                          <td>${formattedPhone}</td>
                          `;

                        cacmList.appendChild(row);
                    }
                }
                // "이전 페이지" 버튼 활성화/비활성화 관리
                const prevButton = document.getElementById("prevBtn");
                prevButton.style.display = page > 0 ? "block" : "none";

                // "다음 페이지" 버튼 활성화/비활성화 관리
                const nextButton = document.getElementById("nextBtn");
                nextButton.style.display = page < totalPages - 1 ? "block" : "none";

                updatePaginationBtn();

                document.querySelector('#searchInput').addEventListener('keypress', function (e) {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        document.querySelector('#searchBtn').click();
                    }
                })

            }
        })
        .catch((err) => {
            alert(err);
            //console.log(err);
        });
}

//페이징
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

        // 페이지 번호와 배열 인덱스 조정
        if (pageNum === page + 1) {
            pageButton.classList.add("btn-selected");
        }

        pageButton.addEventListener("click", () => {
            page = pageNum - 1; //
            updateURLParameter("page", page);
            if (keyword) {
                updateURLParameter("keyword", keyword);
            }
            loadPage(pageOption);
        });

        pageNumbers.appendChild(pageButton);
    }
}

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

// //등록버튼
// document.querySelector(".createBtn").addEventListener("click", () => {
//     window.location.href = "/trml-register";
// });

//검색버튼
document.querySelector("#searchBtn").addEventListener("click", function () {

    //키워드 검색
    keyword = document.querySelector('#searchInput').value.trim();
    if (keyword === '') {
        keyword = null;
    }

    page = 0;
    updateURLParameter("page", page);
    updateURLParameter("keyword", keyword);
    loadPage(pageOption);
})


//리셋 버튼
document.querySelector("#resetBtn").addEventListener("click", function () {

    window.location.href = "info-drive-list?page=0&size=10&sort=0";

});

// size 필터
var sizeOpt = document.querySelector('#sizeOpt');
sizeOpt.addEventListener('change', function () {
    var selectedSize = sizeOpt.value;
    size = selectedSize;
    page = 0;
    updateURLParameter("size", selectedSize);
    loadPage();
});

// search 필터체크
function searchChk({ keyword, size }) {
    document.querySelector('#searchInput').value = keyword;
    document.querySelector('#sizeOpt').value = size;
}
