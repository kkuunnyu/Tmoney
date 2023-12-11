window.onload = () => {
  const url = "https://api.tongitongu.xyz";
  const token = sessionStorage.getItem("authToken");
  const createBtn = document.querySelector(".save");
  createBtn.addEventListener("click", upLoad);
  var currentURL = window.location.href;
  var matches = currentURL.match(/\/version-inner2\/(\d+)/);
  if (matches) {
    var versionId = matches[1];
  } else {
    alert("URLㅇ에서 값을 찾을 수 없음 - version-inner2")
  }

  //초기화면
  axios
    .get(url + `/app-version/${versionId}`)
    .then((res) => {
      if (res.data.success == true) {
        const content = res.data.data;

        //버전코드 versionCode
        const versionCode = document.querySelector('#version_code');
        versionCode.value = content.versionCode;

        //플랫폼 선택라디오
        const platformRadio = document.getElementsByName("agree");
        var selectedForcedValue = content.fileEnum;
        switch (selectedForcedValue) {
          case "FILE_ANDROID": document.querySelector('#agree1').checked = true;
            break;
          case "FILE_IOS": document.querySelector('#agree2').checked = true;
            break;
        }

        //강제 업데이트 라디오
        const forcedUpdateRadio = document.getElementsByName("agree2");
        var selectedForcedValue = content.forcedUpdate;
        switch (selectedForcedValue) {
          case true: document.querySelector("#agree5").checked = true;
            break;
          case false: document.querySelector("#agree6").checked = true;
            break;
        }

        //업데이트 내용
        const description = document.querySelector('#version_update_inner');
        description.value = content.description;


        //파일 업로드
        const serverFileUrl = content.downloadUrl;
        const alreadyUpload = document.querySelector('#alreadyUpload');
        const versionUpload = document.querySelector('#version_upload');
        if (serverFileUrl) {
          const fileLink = document.createElement("a");
          fileLink.textContent = "기존 업로드 된 파일";
          fileLink.href = serverFileUrl;
          fileLink.classList.add("file-link");
          alreadyUpload.innerHTML = "";
          alreadyUpload.appendChild(fileLink);
        } else {
          versionUpload.style.display = "block";
          alreadyUpload.style.display = "none";
        }
        versionUpload.addEventListener("click", function () {
          versionUpload.value = null;
        })


        //파일 이름
        const fileName = document.querySelector("#version_file");
        fileName.value = content.fileName;
      }
    })

  function upLoad() {
    const axiosInstance = axios.create({
      baseURL: url,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    //버전코드 versionCode
    const versionCode = document.querySelector("#version_code").value;
    if (!versionCode) {
      alert("버전코드를 입력해주세요.");
      document.querySelector("#version_code").focus();
      return;
    }

    //플랫폼 선택라디오 fileEnum
    const platformRadio = document.getElementsByName("agree");
    var selectedPlatformValue = null;
    for (var i = 0; i < platformRadio.length; i++) {
      var selectedPlatform = platformRadio[i];
      if (selectedPlatform.checked) {
        selectedPlatformValue = selectedPlatform.value;
        break;
      }
    }
    if (selectedPlatformValue == null) {
      alert("플랫폼을 선택해주세요");
      return;
    }

    //강제 업데이트 라디오 isForcedUpdate
    const forcedUpdateRadio = document.getElementsByName("agree2");
    var selectedForcedValue = null;
    for (var i = 0; i < forcedUpdateRadio.length; i++) {
      var selectedUpdate = forcedUpdateRadio[i];

      if (selectedUpdate.checked) {
        selectedForcedValue = selectedUpdate.value;
        break;
      }
    }
    if (selectedForcedValue == null) {
      alert("강제 업데이트 여부를 선택하세요");
      return;
    }

    //업데이트 내용
    const description = document.querySelector("#version_update_inner").value;
    if (!description) {
      alert("업데이트 내용을 작성해주세요.");
      document.querySelector("#version_update_inner").focus();
      return;
    }

    //파일 업로드 file
    const fileUpload = document.querySelector("#version_upload");

    const formData = new FormData();
    formData.append("description", description);
    formData.append("isForcedUpdate", selectedForcedValue);
    formData.append("fileEnum", selectedPlatformValue);
    formData.append("versionCode", versionCode);
    //수정 파일 업로드 했을때만
    if (fileUpload.files.length > 0) {
      formData.append("file", fileUpload.files[0]);
    }

    //formData.append("fileName", fileName);

    axiosInstance
      .patch(url + `/app-version/${versionId}`, formData)
      .then((res) => {
        alert("수정 되었습니다");
        //window.history.back();
        window.location = document.referrer;
        
      })
      .catch((err) => {
        alert(err);
        ///console.log(err);
      });
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
