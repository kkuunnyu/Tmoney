window.onload = () => {
  const url = "https://api.tongitongu.xyz";

  var currentURL = window.location.href;
  var matches = currentURL.match(/\/drive-list-inner\/([a-zA-Z0-9]+)/);
  const cacmDatail = document.querySelector("#cacmDetail");
  if (matches) {
    var cacmCd = matches[1];
    
  } else {
    alert("URL에서 값을 찾을 수 없음.");
  }

  loadPage();

  function loadPage() {
    axios
      .get(url + `/cacm/${cacmCd}`)
      .then((res) => {
        if (res.data.success == true) {
          const content = res.data.data;
          //전화번호 포맷
          const numbersOnly = content.BUS_CACM_TEL_NO;
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
          cacmDatail.innerHTML = `
          <div class="status">
            <img src="../assets/images/right_arrow.png" alt="right_arrow" class="right_arrow"> &nbsp;&nbsp;운수사 목록 - 상세 조회
          </div>
          <table class="inner-table">
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">운수사 코드</td>
              <td class="left-text">${content.BUS_CACM_CD}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">운수사 이름</td>
              <td class="left-text">${content.BUS_CACM_NM}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">운수사단축명</td>
              <td class="left-text">${content.BUS_CACM_SHCT_NM}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">주소</td>
              <td class="left-text">${content.BUS_CACM_ADDR}</td>
            </tr>
            <tr>
              <td bgcolor="#f0f0f0" style="font-weight: 600;">전화번호</td>
              <td class="left-text">${formattedPhone}</td>
            </tr>
            </table>
            <div class="checkbox2">
              <ul class="check-button">
                <li class="cacmList"><a href="javascript:void(0)">확인</a></li>
              </ul>
            </div>
                `;
          // const delBtn = document.querySelector(".cacmDel");
          // delBtn.addEventListener("click", delConfirm);

          const listBtn = document.querySelector(".cacmList");
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
    const listPage = sessionStorage.getItem('listPage');
  if (listPage) {
    window.location = listPage;
  } else {
    window.location.href = "/drive-list?page=0&size=10&sort=1"
  }
  }


  ///////////////////////////////////////////////////////////////////
};