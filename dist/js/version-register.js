const url = "https://api.tongitongu.xyz";
const token = sessionStorage.getItem("authToken");
const createBtn = document.querySelector(".save");
createBtn.addEventListener("click", upLoad);
const progressText = document.getElementById("progressText");

//progressBar test
var progressBar = document.getElementById("uploadProgress");
var modal = document.getElementById("myModal");
modal.style.display = "none";

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

  //파일 업로드체크 file
  if (!fileUpload.files[0]) {
    alert("파일을 업로드해주세요.");
    return;
  }


  const formData = new FormData();
  formData.append("description", description);
  formData.append("isForcedUpdate", selectedForcedValue);
  formData.append("fileEnum", selectedPlatformValue);
  formData.append("versionCode", versionCode);
  formData.append("file", fileUpload.files[0]);
  //formData.append("fileName", fileName);



  axiosInstance
    .post(url + "/app-version", formData, {
      onUploadProgress: (progressEvent) => {
        //modal 보이기
        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        //progressText.innerText = `진행 중... ${percentage}%`;
        modal.style.display = "flex";
        progressBar.value = `${percentage}`;
      }
    })
    .then((res) => {
      modal.style.display = "none";
      alert("업로드 되었습니다");
      //window.location = document.referrer;
      toList();
    })
    .catch((err) => {
      modal.style.display = "none";
      alert(err);
      //console.log(err);
    });

  //목록으로(확인)
  function toList() {
    const listPage = sessionStorage.getItem('listPage');
    if (listPage) {
      window.location = listPage;
    } else {
      window.location.href = "/version?page=0&size=10&sort=1"
    }
  }
}



