const queryParams = new URLSearchParams(window.location.search);
let page = Number(queryParams.get("page")) || 0;
let size = queryParams.get("size") || 10;
let sort = queryParams.get("sort") || 1;
let keyword = queryParams.get("keyword") || null;
let startDateTime = queryParams.get("startDateTime") || null;
let endDateTime = queryParams.get("endDateTime") || null;
const url = "https://api.tongitongu.xyz";
const drList = document.querySelector('#drList');
let isSearching = false; // 검색 요청 변수
let totalPages;
const token = sessionStorage.getItem('authToken');
const pageOption = { page, size, sort, startDateTime, endDateTime, keyword }

window.onload = () => {
    sessionStorage.removeItem('listPage');
    loadPage(pageOption);
    searchChk(pageOption);

    //"이전 페이지" 버튼 클릭
    document.querySelector('#prevBtn').addEventListener('click', () => {
        if (page > 0) {
            page--;
            updateURLParameter("page", page);

            loadPage(pageOption);
        }
    })
    //"다음 페이지" 버튼 클릭
    document.querySelector('#nextBtn').addEventListener('click', () => {
        
        if (page < totalPages - 1) {
            page++;
            updateURLParameter("page", page);
            loadPage(pageOption);
        }
    });
}

function loadPage(pageOption) {
    const requestParams = {
        page,
        size,
        sort,
        startDateTime,
        endDateTime,
        keyword,
    };

    const axiosInstance = axios.create({
        baseURL: url,
        headers: {
            Authorization: `Bearer ${token}`
        },
    });

    axiosInstance.get(`${url}/busLog`, { params: requestParams })
        .then((res) => {
            if (res.data.success) {
                //console.log(`${url}/busLog`, { params: requestParams });
                const content = res.data.data.content;
                totalPages = res.data.data.totalPages;

                initTable(content.length === 0);
                if (content.length > 0) {
                    renderContent(content);
                }
                updateUI(totalPages);
            }
        })
        .catch((err) => {
            console.error("페이지 로드 중 오류 발생:", err);
            alert("페이지 로드 중 오류가 발생했습니다.");
        })
}

// 기초 테이블
function initTable(noContent) {
    drList.innerHTML = "";
    drList.innerHTML = `
    <tr>
                    <td bgcolor="#f0f0f0" width="20px" class="table-no" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">No</td>
                    <td bgcolor="#f0f0f0" class="skip" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">노선ID</td>
                    <td bgcolor="#f0f0f0" width="180px" class="table-terminal" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">터미널</td>
                    <td bgcolor="#f0f0f0" width="140px" class="table-date" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">버스운행일자</td>
                    <td bgcolor="#f0f0f0" width="120px" class="table-date" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">버스운행시각</td>
                    <td bgcolor="#f0f0f0" width="100px" class="table-turn" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">노선순번</td>
                    <td bgcolor="#f0f0f0" width="120px" class="skip table-date" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">배차일자</td>
                    <td bgcolor="#f0f0f0" width="100px" class="table-turn" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">배차순번</td>
                    <td bgcolor="#f0f0f0" width="140px" class="acc-table-company" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">운수사</td>
                    <td bgcolor="#f0f0f0" width="140px" class="table-drive-code" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">버스운행이력종류</td>
                </tr>
    `
    if (noContent) {
        drList.innerHTML += `
        <tr>
            <td colspan=10> 검색에 해당하는 내용이 없습니다. </td>
        </tr>
        `
        document.getElementById("pageNumbers").innerHTML = "";
    }
}

// Date객체 날짜 포맷팅 (yyyy-MM-dd)
function formatDate(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDay().toString().padStart(2, '0')}`
}

// Date객체 시간 포맷팅 (hh:mm)
function formatTime(date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// yyyy-mm-dd값을 그대로 줄때
function driveResultDate(date) {
    const oprnYear = parseInt(date.substring(0, 4), 10);
    const oprnMonth = parseInt(date.substring(4, 6), 10);
    const oprnDay = parseInt(date.substring(6, 8), 10);
    return `${oprnYear}-${oprnMonth}-${oprnDay}`
}


// render 내용
async function renderContent(content) {
    const rows = [];

    for (let i = 0; i < content.length; i++) {
        const value = content[i];
        const row = document.createElement("tr");
        row.className = "details";
        row.addEventListener("click", function () {
            sessionStorage.setItem('listPage', window.location.href);
            location.href = "/drive-result-inner/" + value.id;
        });

        //버스운행일자 (yyyy-MM-dd)
        let formattedOprnDt = driveResultDate(value.busOprnDt);


        //버스운행시각 (hh:mm)
        const busTime = value.busOprnTime;
        const busHour = parseInt(busTime.substring(0, 2), 10);
        const busMin = parseInt(busTime.substring(2, 4), 10);
        const busSec = parseInt(busTime.substring(4, 6), 10);

        let formattedBusTime = `${busHour.toString().padStart(2, '0')}:${busMin.toString().padStart(2, '0')}`


        //배차일자 (yyyy-MM-dd)
        let formattedAlacnDt = driveResultDate(value.alcnDt);


        //터미널명, 운수사명
        const trmlNm = await loadTrmlNm(value.trmlCd);
        const cacmNm = await loadCacmNm(value.busCacmCd);

        //버스운행이력종류
        const busOprnHstKndNm = await loadbusOprnHstKndNm(value.busOprnHstKndCd);


        row.innerHTML = `
                    <td>${value.id}</ >
                    <td class="skip">${value.rotId}</td>
                    <td>${trmlNm}</td>
                    <td>${formattedOprnDt}</td>
                    <td>${formattedBusTime}</td>
                    <td>${value.rotSqno}</td>
                    <td class="skip">${formattedAlacnDt}</td>
                    <td>${value.alcnSqno}</td>
                    <td>${cacmNm}</td>
                    <td>${busOprnHstKndNm}</td>
                    `;

        rows.push(row);
    }
    drList.append(...rows);
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

// 페이징 번호 관리
function updatePaginationBtn(totalPages) {
    const pageNumbers = document.querySelector('#pageNumbers');
    pageNumbers.innerHTML = "";

    const pageRange = 5;
    const startPage = Math.floor(page / pageRange) * pageRange + 1;
    const endPage = Math.min(startPage + pageRange - 1, totalPages);

    for (let pageNum = startPage; pageNum <= endPage; pageNum++) {

        const pageButton = document.createElement("button");
        pageButton.classList.add('btn-page');
        pageButton.textContent = pageNum;

        if (pageNum === page + 1) {
            pageButton.classList.add('btn-selected');
        }

        pageButton.addEventListener("click", () => {
            page = pageNum - 1;
            updateURLParameter("page", page);
            updateURLParameter("size", size);
            updateURLParameter("sort", sort);
            updateURLParameter("startDateTime", startDateTime);
            updateURLParameter("endDateTime", endDateTime);
            updateURLParameter("keyword", keyword);
            loadPage(page, size, sort, startDateTime, endDateTime, keyword);
        });

        pageNumbers.appendChild(pageButton);
    }
}



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

//엔터키 막기
document.getElementById('searchInput').addEventListener("keypress", function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchBtn.click();
    }
})


// 검색버튼 클릭
const searchBtn = document.querySelector('#searchBtn')
searchBtn.addEventListener('click', function () {

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
    updateURLParameter("startDateTime", startDateTime);
    updateURLParameter("endDateTime", endDateTime);
    updateURLParameter("keyword", keyword);


    loadPage(page, size, sort, startDateTime, endDateTime, keyword)
});


// 리셋버튼 클릭
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

    window.location.href = "drive-result?page=0&size=10&sort=1"
})

//터미널코드 -> 터미널명
async function loadTrmlNm(trmlCd) {
    const requestURL = url + `/terminal/${trmlCd}`
    try {
        const res = await axios.get(requestURL);
        return res.data.data.TRML_NM;
    } catch {
        alert("터미널명을 불러오지못하였습니다.");
        return "터미널명 오류";
    }
}

//운수사코드 -> 운수사명
async function loadCacmNm(busCacmCd) {
    const requestURL = url + `/cacm/${busCacmCd}`
    try {
        const res = await axios.get(requestURL);
        return res.data.data.BUS_CACM_NM;
    } catch (err) {
        alert("운수사를 불러오지못하였습니다.");
        return "터미널명 오류"
    }
}

//버스운행이력 종류코드 -> 운행이력
async function loadbusOprnHstKndNm(busOprnHstKndCd) {
    switch (busOprnHstKndCd) {
        case '1':
            return "출발";
        case '2':
            return "도착";
        case '3':
            return "경유출발";
        case '4':
            return "경유도착";
    }
}

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
function searchChk({ startDateTime, endDateTime, keyword, size }) {
    document.querySelector('.stDt').value = startDateTime ? startDateTime.split('T')[0].trim() : '';
    document.querySelector('.edDt').value = endDateTime ? endDateTime.split('T')[0].trim() : '';
    document.querySelector('#searchInput').value = keyword;
    document.querySelector('#sizeOpt').value = size;
}