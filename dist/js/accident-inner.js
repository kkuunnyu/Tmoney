window.onload = () => {
  const acdDetail = document.getElementById("acdDetail");
  const url = "https://api.tongitongu.xyz";
  var currentURL = window.location.href;
  var matches = currentURL.match(/\/accident-inner\/(\d+)/);
  if (matches) {
    var acdId = matches[1];
  } else {
    alert("URL에서 값을 찾을 수 없음.");
  }

  loadCategory();

  function loadCategory() {
    let categoryURL = url + `/cacm/list`;
    axios
      .get(categoryURL)
      .then((res) => {
        if (res.data.success == true) {
          const busCacms = res.data.data;
          loadPage(busCacms);
        }
      })
  }

  function loadPage(busCacms) {

    //화면
    axios
      .get(url + `/report/${acdId}`)
      .then((res) => {
        if (res.data.success == true) {
          const content = res.data.data;
          const description = content.description;
          const createdAtValue = new Date(content.createdAt);
          const formattedDate = `${createdAtValue.getFullYear()}-${(
            createdAtValue.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}
            -${createdAtValue.getDate().toString().padStart(2, "0")} 
            ${createdAtValue
              .getHours()
              .toString()
              .padStart(2, "0")}:${createdAtValue
                .getMinutes()
                .toString()
                .padStart(2, "0")}
            :${createdAtValue.getDate().toString().padStart(2, "0")}`;

          const matchingBusCacm = busCacms.find(busCacm => busCacm.BUS_CACM_CD === content.busCacmCd)
          const busCacmNm = matchingBusCacm ? matchingBusCacm.BUS_CACM_NM : content.busCacmCd;

          const busAcdnAcptTime = content.busAcdnAcptTime.replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3');
          const busAcdnAcptDt = content.busAcdnAcptDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1년 $2월 $3일')

          acdDetail.innerHTML = `
        <tr>
                <td width="10%" bgcolor="#f0f0f0" style="font-weight: 600;">타이틀</td>
                <td class="left-text">${content.title}</td>
                <td width="10%" bgcolor="#f0f0f0" style="font-weight: 600;">운수사</td>
                <td class="left-text">${busCacmNm}</td>
              </tr>
              <tr>
                <td bgcolor="#f0f0f0" style="font-weight: 600;">신고시간</td>
                <td colspan="3" class="left-text">${busAcdnAcptTime}</td>
              </tr>
              <tr>
                <td bgcolor="#f0f0f0" style="font-weight: 600;">사고위치</td>
                <td colspan="3" class="left-text">${content.latitude}, ${content.longitude}</td>
              </tr>
              <tr>
                <td bgcolor="#f0f0f0" style="font-weight: 600;">사고내용</td>
                <td colspan="3" height="300px" class="left-text">${description.replace(/\n/g, "<br>")}</td>
              </tr>
              <tr>
                <td bgcolor="#f0f0f0" style="font-weight: 600;">등록인</td>
                <td colspan="3" class="left-text">${content.busCacmEmpId}</td>
              </tr>
              <tr>
                <td bgcolor="#f0f0f0" style="font-weight: 600;">배차ID</td>
                <td colspan="3" class="left-text">${content.rotId}</td>
              </tr>
              <tr>
                <td bgcolor="#f0f0f0" style="font-weight: 600;">신고일자</td>
                <td colspan="3" class="left-text">${busAcdnAcptDt}</td>
              </tr>`;

          const delBtn = document.querySelector("#acdDel");
          delBtn.addEventListener("click", delConfirm);
          const listBtn = document.querySelector("#acdList");
          listBtn.addEventListener("click", toList);
        }
      })
      .catch((err) => {
        alert("페이지 로드 중 오류가 발생했습니다.");
        
      });
  }

  function delConfirm() {
    if (confirm("삭제하시겠습니까?")) {
      accidentDelete();
    }
  }

  //accident 삭제
  function accidentDelete() {
    const token = sessionStorage.getItem("authToken");


    const axiosInstance = axios.create({
      baseURL: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    axiosInstance
      .delete(url + `/report/${acdId}?id=${acdId}`)
      .then((res) => {
        alert("삭제되었습니다");
        window.location.href = document.referrer;
      })
      .catch((err) => {
        alert('페이지 로딩에 실패하였습니다');
        //console.log(err);
      });
  }

  //목록으로(확인버튼)
  function toList() {
    const listPage = sessionStorage.getItem('listPage');
  if (listPage) {
    window.location = listPage;
  } else {
    window.location.href = "/accident?page=0&size=10&sort=1"
  }
  }
};
