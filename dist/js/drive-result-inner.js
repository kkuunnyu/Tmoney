const drDetail = document.querySelector('#drDetail');
const url = "https://api.tongitongu.xyz";
const token = sessionStorage.getItem('authToken');
var currentURL = window.location.href;
var matches = currentURL.match(/\/drive-result-inner\/(\d+)/);
if (matches) {
  var drId = matches[1];
} else {
  alert("URL에서 값을 찾을 수 없음");
}

window.onload = () => {
  loadPage();
}

function driveResultDate(date) {
  const oprnYear = parseInt(date.substring(0, 4), 10);
  const oprnMonth = parseInt(date.substring(4, 6), 10);
  const oprnDay = parseInt(date.substring(6, 8), 10);
  return `${oprnYear}-${oprnMonth}-${oprnDay}`
}

async function loadPage() {
  let requestURL = url + `/busLog/${drId}`;

  const axiosInstance = axios.create({
    baseURL: url,
    headers: {
      Authorization: `Bearer ${token}`
    },
  });

  axiosInstance
    .get(requestURL)
    .then(async (res) => {
      if (res.data.success == true) {
        const content = res.data.data;
        
        //버스운행일자 (yyyy-MM-dd)
        let formattedOprnDt = driveResultDate(content.busOprnDt);

        //버스운행시각 포맷 (hh:mm)
        const busTime = new Date(content.busOprnTime);
        let formattedBusTime = '';
        formattedBusTime = `${busTime.getHours().toString().padStart(2, '0')}:${busTime.getMinutes().toString().padStart(2, '0')} `;

        //배차일자 (yyyy-MM-dd)
        let formattedAlacnDt = driveResultDate(content.alcnDt);

        //async(res), await 비동기
        const busClsNm = await loadBusClsNm(content.busClsCd);
        const busCacmNm = await loadCacmNm(content.busCacmCd);
        const trmlNm = await loadTrmlNm(content.trmlCd);
        const busOprnHstKndNm = await loadbusOprnHstKndNm(content.busOprnHstKndCd);
        const busOprnHstReqNm = await loadbusOprnHstReqNm(content.busOprnHstReqCd);

        drDetail.innerHTML = "";
        drDetail.innerHTML = `
            <tr>
              <td bgcolor="#f0f0f0" width="15%" style="font-weight: 600;">NO</td>
              <td class="left-text">${content.id}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">버스타입</td>
              <td class="left-text">${busClsNm}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">노선ID</td>
              <td class="left-text">${content.rotId}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">노선순번</td>
              <td class="left-text">${content.rotSqno}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">터미널</td>
              <td class="left-text">${trmlNm}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">터미널 위·경도</td>
              <td class="left-text">${content.trmlLttd}, ${content.trmlLngt}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">배차일자</td>
              <td class="left-text">${formattedAlacnDt}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">배차순번</td>
              <td class="left-text">${content.alcnSqno}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">운행일자</td>
              <td class="left-text">${formattedOprnDt}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">운행일시</td>
              <td class="left-text">${formattedBusTime}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">운수사</td>
              <td class="left-text">${busCacmNm}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">운수사원</td>
              <td class="left-text">${content.busCacmEmpId}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">차량번호</td>
              <td class="left-text">${content.busVhclNo}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">승차수</td>
              <td class="left-text">${content.rideNum}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">하차수</td>
              <td class="left-text">${content.alghNum}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">잔여수</td>
              <td class="left-text">${content.rmnNum}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">배차방식구분코드</td>
              <td class="left-text">${content.alcnWayDvsCd}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">좌석제 사용여부</td>
              <td class="left-text">${content.satiUseYn}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">정기임시여부</td>
              <td class="left-text">${content.perdTempYn}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">버스운행이력종류</td>
              <td class="left-text">${busOprnHstKndNm}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">버스운행이력요청</td>
              <td class="left-text">${busOprnHstReqNm}</td>
            </tr>
                        `
      }
    }
    )
    .catch((err) => {
      alert(err);
      console.log(err);
    });
}

//버스등급코드 -> 버스등급
async function loadBusClsNm(busClsCd) {
  const requestURL = url + `/cls/${busClsCd}`
  try {
    const res = await axios.get(requestURL);
    if (res.data.data == null) {
      return "버스등급을 불러오지못하였습니다"
    }
    return res.data.data.BUS_CLS_NM;
  } catch {
    alert("버스등급을 불러오지못하였습니다");
    return "버스등급 오류";
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

//터미널코드 -> 터미널명
async function loadTrmlNm(trmlCd) {
  const requestURL = url + `/terminal/${trmlCd}`
  try {
    const res = await axios.get(requestURL);
    return res.data.data.TRML_NM;
  } catch (err) {
    alert("터미널명을 불러오지못하였습니다.");
    return "터미널명 오류";
  }

}

//버스운행이력 종류코드
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

//버스운행이력 요청코드
async function loadbusOprnHstReqNm(busOprnHstReqCd) {
  switch (busOprnHstReqCd) {
    case '1':
      return "수동";
    case '2':
      return "자동";
  }
}

//목록으로(확인버튼)
document.querySelector('.listBtn').addEventListener('click', toList);

function toList() {
  const listPage = sessionStorage.getItem('listPage');
  if (listPage) {
    window.location = listPage;
  } else {
    window.location.href = "/drive-result?page=0&size=10&sort=1"
  }
}
