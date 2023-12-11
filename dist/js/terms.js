const termsList = document.querySelector("#termsList");
const url = "https://api.tongitongu.xyz";
const token = sessionStorage.getItem("authToken");
const queryParams = new URLSearchParams(window.location.search);
let startDateTime = queryParams.get("startDateTime") || null;
let endDateTime = queryParams.get("endDateTime") || null;
const searchBtn = document.querySelector("#searchBtn")
var checkedCount = 0;
let totalElements;

window.onload = () => {
  sessionStorage.removeItem('listPage');
  loadPage(startDateTime, endDateTime);
  searchChk({startDateTime, endDateTime});
}

function loadPage(startDate, endDate) {
  const requestParams = {
    startDate, endDate
  };

  axios.get(`${url}/term`, { params: requestParams })
    .then((res) => {
      if (res.data.success == true) {
        //console.log(`${url}/term`, { params: requestParams });
        const content = res.data.data;
        totalElements = res.data.data.totalElements;

        initTable(content.length === 0);
        if (content.length > 0) {

        }
        renderContent(content);
      }
    })
    .catch((err) => {
      console.error("페이지 로드 중 오류 발생:", err);
      alert("페이지 로드 중 오류가 발생했습니다.")
    })
}

// 기초 테이블
function initTable(noContent) {
  termsList.innerHTML = "";
  termsList.innerHTML = `
            <tr>
              <td bgcolor="#f0f0f0" class="table-no" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">NO</td>
              <td bgcolor="#f0f0f0" class="table-category" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">카테고리</td>
              <td bgcolor="#f0f0f0" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">제목</td>
              <td bgcolor="#f0f0f0" class="table-date" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">등록일자</td>
              <td bgcolor="#f0f0f0" class="table-terms" style="border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 600;">약관 표출</td>
            </tr>
            `
  if (noContent) {
    termsList.innerHTML += `
          <tr>
            <td colspan=5> 검색에 해당하는 내용이 없습니다. </td>
          </tr>
          `
  }
}

// render 내용
async function renderContent(content) {
  for (let i = 0; i < content.length; i++) {
    const value = content[i];
    const row = document.createElement("tr");
    row.className = "details";

    row.addEventListener("click", function (event) {
      if (!event.target.classList.contains("toggleTd")
        && !event.target.classList.contains("toggleActBtn")
        && !event.target.classList.contains("terms-yes")) {
        sessionStorage.setItem('listPage', window.location.href);
        location.href = "/terms-inner/" + value.id;
      }
    })

    //날짜 포맷       오늘(hh:mm) / 아닌것 (yyyy-MM-dd)
    const currentDate = new Date();
    const createdAtValue = new Date(value.createdAt);
    let formattedDate = '';

    if (currentDate.getFullYear() === createdAtValue.getFullYear() &&
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
    const truncDescription =
      newlines.length > 45 ? newlines.slice(0, 45) + "..." : newlines;

    const displayNumber = i + 1

    row.innerHTML = `
         <td>${displayNumber}</td>
         <td>${value.category}</td>
         <td class="short-text">${value.title}</td>
         <td>${formattedDate}</td>
         <td class="toggleTd">
            <input type="checkbox" value=${value.id} id=${value.id} class="toggleActBtn" ${value.active ? 'checked' : ''}>
            <label for=${value.id} class="terms-yes"></label>
         </td>`
    termsList.appendChild(row);

    if (value.active) {
      checkedCount++;
    }
  }
  //체크박스 이벤트
  const checkboxes = document.querySelectorAll('.toggleActBtn');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      handleCheckboxChange(this);
    });
  });

}

function handleCheckboxChange(checkbox) {
  if (checkbox.checked) {
    //체크가 되었을 때
    actToggle(checkbox.value, true);
    
    /*
    if (checkedCount < 3) {
      //체크가 3개이하
      checkedCount++;
      actToggle(checkbox.value, true);

    } else {
      //체크가 4개이상
      alert("최대3개까지만 선택 가능합니다");
      checkbox.checked = false;
    }
    */

  } else {
    //체크가 해제된경우
    checkedCount--;
    actToggle(checkbox.value, false);
  }
}


function actToggle(termsId, isActive) {
  const axiosInstance = axios.create({
    baseURL: url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const activeUpdate = {
    active: isActive,
  }

  axiosInstance
    .patch(url +
      `/term/${termsId}?isActive=${activeUpdate.active}`)
    .then((res) => {
    })
    .catch((err) => {
      alert(err);
    })
}

function setChecked(termsId, isActive) {
  const checkbox = document.querySelector(`.toggleActBtn[id='${termsId}']`);
  if (checkbox) {
    checkbox.checked = isActive;
    if (isActive) {
      if (!checkbox.getAttribute('data-already-checked')) {
        checkbox.setAttribute('data-already-checked', 'true');
        checkedCount++;
      }
    } else {
      checkbox.removeAttribute('data-already-checked');
      checkedCount--;
    }
  }
}



// 등록 버튼
document.querySelector(".createBtn").addEventListener("click", () => {
  window.location.href = "/terms-register";
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

//검색버튼
searchBtn.addEventListener("click", function () {
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

 
  updateURLParameter("startDateTime", startDateTime);
  updateURLParameter("endDateTime", endDateTime);
  loadPage(startDateTime, endDateTime);
});

//리셋버튼
document.querySelector("#resetBtn").addEventListener("click", function () {

  window.location.href = "terms"
});


// search 필터체크
function searchChk ({startDateTime, endDateTime, size}) {
  document.querySelector('.stDt').value = startDateTime ? startDateTime.split('T')[0].trim() : '';
  document.querySelector('.edDt').value = endDateTime ? endDateTime.split('T')[0].trim() : '';
  //document.querySelector('#sizeOpt').value = size;
}