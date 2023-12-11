window.onload = () => {

  const versionDetail = document.querySelector("#versionDetail");
  const url = "https://api.tongitongu.xyz";
  var currentURL = window.location.href;
  var matches = currentURL.match(/\/version-inner\/(\d+)/);

  if (matches) {
    var versionId = matches[1];
  } else {
    alert("URL에서 값을 찾을 수 없음.");
  }

  axios
    .get(url + `/app-version/${versionId}`)
    .then((res) => {
      if (res.data.success == true) {
        const content = res.data.data;

        const createdAt = new Date(content.createdAt);

        const createDate = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, "0")}-${createdAt.getDate().toString().padStart(2, "0")}
        ${createdAt.getHours().toString().padStart(2, "0")}:${createdAt.getMinutes().toString().padStart(2, "0")}`;

        const modifiedAt = new Date(content.modifiedAt);
        const modifiedDate = `${modifiedAt.getFullYear()}-${(modifiedAt.getMonth() + 1).toString().padStart(2, "0")}-${modifiedAt.getDate().toString().padStart(2, "0")}
          ${modifiedAt.getHours().toString().padStart(2, "0")}:${modifiedAt.getMinutes().toString().padStart(2, "0")}`;

        let isForced = '';
        switch (content.forcedUpdate) {
          case true: {
            isForced = "필수";
            break;
          }
          case false: {
            isForced = "선택";
            break;
          }
        }

        let platform = '';
        switch (content.fileEnum) {
          case "FILE_ANDROID": {
            platform = "Android"
            break;
          }
          case "FILE_IOS": {
            platform = "iOS"
            break;
          }
        }
        versionDetail.innerHTML = "";
        versionDetail.innerHTML = `
        <tr>
        <td width="15%" bgcolor="#f0f0f0" style="font-weight: 600;">버전코드</td>
        <td width="30%" class="left-text">${content.versionCode}</td>
        <td width="15%" bgcolor="#f0f0f0" style="font-weight: 600;">날짜</td>
        <td width="30%" class="left-text">${createDate}</td>
      </tr>
      <tr>
        <td bgcolor="#f0f0f0" style="font-weight: 600;">플랫폼</td>
        <td colspan="3" class="left-text">${platform}</td>
      </tr>
      <tr>
        <td bgcolor="#f0f0f0" style="font-weight: 600;">강제 업데이트 여부</td>
        <td colspan="3" class="left-text">${isForced}</td>
      </tr>
      <tr>
        <td bgcolor="#f0f0f0" style="font-weight: 600;">업데이트 내용</td>
        <td colspan="3" height="300px" class="left-text">${content.description.replace(/\n/g, "<br>")}</td>
      </tr>
      <tr>
        <td bgcolor="#f0f0f0" style="font-weight: 600;">파일 다운로드</td>
        <td colspan="3" class="left-text"><a href=${content.downloadUrl} target="_blank">${content.fileName}</td>

      </tr>
      <tr>
        <td bgcolor="#f0f0f0" style="font-weight: 600;">파일 이름</td>
        <td colspan="3" class="left-text">${content.fileName}</td>
      </tr>
      <tr>
        <td bgcolor="#f0f0f0" style="font-weight: 600;">등록인</td>
        <td colspan="3" class="left-text"></td>
      </tr>
      <tr>
        <td bgcolor="#f0f0f0" style="font-weight: 600;">등록일자</td>
        <td colspan="3" class="left-text">${createDate}</td>
      </tr>
      <tr>
        <td bgcolor="#f0f0f0" style="font-weight: 600;">수정인</td>
        <td colspan="3" class="left-text"></td>
      </tr>
      <tr>
        <td bgcolor="#f0f0f0" style="font-weight: 600;">수정일자</td>
        <td colspan="3" class="left-text">${modifiedDate}</td>
      </tr>
          `;
        const delBtn = document.querySelector(".versionDel");
        delBtn.addEventListener("click", delConfirm);

        const editBtn = document.querySelector(".edit");
        editBtn.addEventListener("click", editPage);

        const listBtn = document.querySelector(".termList");
        listBtn.addEventListener("click", toList);
      }
    })
    .catch((err) => {
      alert(err);
      //console.log(err);
    });

  function delConfirm() {
    if (confirm("삭제하시겠습니까")) {
      faqDelete();
    }
  }

  //faq 삭제
  function faqDelete() {
    const url = "https://api.tongitongu.xyz";
    const token = sessionStorage.getItem("authToken");
    var currentURL = window.location.href;
    var matches = currentURL.match(/\/version-inner\/(\d+)/);

    if (matches) {
      var versionId = matches[1];
    } else {
      alert("URL에서 값을 찾을 수 없음");
      return;
    }

    const axiosInstance = axios.create({
      baseURL: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    axiosInstance
      .delete(url + `/app-version/${versionId}?id=${versionId}`)
      .then((res) => {
        alert("삭제되었습니다");
        toList();
      })
      .catch((err) => {
        alert(err);
        //console.log(err);
      });
  }
  //수정페이지로
  function editPage() {
    window.location.href = `/version-inner2/${versionId}`
  }
  //목록으로(확인)
  function toList() {
    const listPage = sessionStorage.getItem('listPage');
    if (listPage) {
      window.location = listPage;
    } else {
      window.location.href = "/version?page=0&size=10&sort=1"
    }
  }
};
