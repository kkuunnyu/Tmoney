window.onload = () => {
  const url = "https://api.tongitongu.xyz";

  var currentURL = window.location.href;
  var matches = currentURL.match(/\/terminal-inner\/(\d+)/);
  const trmlDetail = document.querySelector("#trmlDetail");
  if (matches) {
    var trmlCd = matches[1];
    //console.log(trmlCd);
  } else {
    alert("URL에서 값을 찾을 수 없음.");
  }

  loadPage();

  function loadPage() {
    axios
      .get(url + `/terminal/${trmlCd}`)
      .then((res) => {
        if (res.data.success == true) {
          const content = res.data.data;
          const createdAt = new Date(content.createdAt);
          const description = content.description;
          const formattedDate = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, "0")}-${createdAt.getDate().toString().padStart(2, "0")} 
          ${createdAt.getHours().toString().padStart(2, "0")}:${createdAt.getMinutes().toString().padStart(2, "0")}`;

          trmlDetail.innerHTML = `
          <div class="status">
            <img src="../assets/images/right_arrow.png" alt="right_arrow" class="right_arrow"> &nbsp;&nbsp;터미널/경유지 정보 - 상세 조회
          </div>
          <table class="inner-table">
            <tr>
              <td width="20%" bgcolor="#f0f0f0">터미널 코드</td>
              <td class="left-text">${content.TRML_CD}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0">터미널 이름</td>
              <td class="left-text">${content.TRML_NM}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0">터미널단축명</td>
              <td class="left-text">${content.TRML_SHCT_NM}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0">터미널 위·경도</td>
              <td class="left-text">${content.TRML_LTTD}, ${content.TRML_LNGT}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0">주소</td>
              <td class="left-text">${content.TRML_ADDR}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0">우편번호</td>
              <td class="left-text">${content.TRML_ZIP}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0">버스코드</td>
              <td class="left-text">${content.CTY_BUS_SYS_DVS_CD}</td>
            </tr>
          </table>
          <div class="checkbox2">
            <ul class="check-button">
              <li class="trmlList"><a href="javascript:void(0)">확인</a></li>
            </ul>
          </div>
                `;
          
          const listBtn = document.querySelector(".trmlList");
          listBtn.addEventListener("click", toList);
        }
      })
      .catch((err) => {
        alert(err);
        //console.log(err);
      });
  }
  

  //목록으로(확인버튼)
  function toList() {
    const listPage =  sessionStorage.getItem('listPage');
  if (listPage) {
    window.location = listPage;
  } else {
    window.location.href = "/terminal?page=0&size=10&sort=1"
  }
  }


  ///////////////////////////////////////////////////////////////////
};