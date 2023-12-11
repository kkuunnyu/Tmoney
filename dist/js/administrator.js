const userList = document.getElementById('userList');
const queryParams = new URLSearchParams(window.location.search);
const url = "https://api.tongitongu.xyz";
let page = Number(queryParams.get("page")) || 0;
let size = queryParams.get("size") || 10;
let sort = queryParams.get("sort") || 0;
let totalPages;
let totalElements;
const pageOption = { page, size, sort }
const token = sessionStorage.getItem("authToken")
let userRole = ''
window.onload = () => {
    sessionStorage.removeItem('listPage');
    loadRole();

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

function loadRole() {
    const axiosUserInstance = axios.create({
        baseURL: url,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    axiosUserInstance.get(`${url}/user`)
        .then((res) => {
            if (res.data.success == true) {
                userRole = res.data.data.role;
                if (userRole != 'ROLE_ADMIN') {
                    alert("접근 권한이 없습니다");
                    window.location.replace("/index");
                    return;
                }
            }
        })
        .catch((err) => {
            //("페이지 로드 중 오류 발생:", err);
            alert("페이지 로드 중 오류가 발생했습니다.")
        });
}

function loadPage(pageOption) {

    const requestParams = {
        page, size, sort
    };

    const axiosInstance = axios.create({
        baseURL: url,
        headers: {
            Authorization: `Bearer ${token}`,
            role: `${userRole}`,
        },
    });

    axiosInstance.get(`${url}/user/list`, { params: requestParams })
        .then((res) => {
            if (res.data.success == true) {
                //console.log(`${url}/user/list`, { params: requestParams });
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
    sessionStorage.setItem('listPage', window.location.href);
    userList.innerHTML = `
    <tr>
    <td bgcolor="#f0f0f0" width="70px" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">No</td>
    <td bgcolor="#f0f0f0" width="150px" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">권한</td>
    <td bgcolor="#f0f0f0" width="300px" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">Username</td>
    <td bgcolor="#f0f0f0" width="300px" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">Nickname</td>
    <td bgcolor="#f0f0f0" width="200px" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">계정활성화</td>
  </tr>
    `
    if (noContent) {
        userList.innerHTML += `
        <tr>
            <td colspan=7> 표시할 내용이 없습니다. </td>
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
        row.className = "details";
        row.addEventListener("click", function () {
            location.href = "/administrator-inner/" + value.username;
        })

        let isActive = value.active === true ? '활성' : '비활성'
        let role = value.role === 'ROLE_ADMIN' ? '최고관리자' : '관리자';

        const displayNumber = sort === 0 ? page * size + (i + 1) : totalElements - (page * size + i);

        row.innerHTML = `
            <td>${displayNumber}</td>
            <td>${role}</td>
            <td>${value.username}</td>
            <td>${value.nickname}</td>
            <td>${isActive} </td>
        `
        rows.push(row);

    }
    userList.append(...rows);
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
            loadPage(pageOption);
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



/*
// size 필터
var sizeOpt = document.querySelector('#sizeOpt');
sizeOpt.addEventListener('change', function () {
    var selectedSize = sizeOpt.value;
    size = selectedSize;
    page = 0;
    updateURLParameter("size", selectedSize);
    loadPage();
});
*/

//등록버튼
document.querySelector(".createBtn").addEventListener("click", function () {
    window.location.href = "/administrator-register";
});