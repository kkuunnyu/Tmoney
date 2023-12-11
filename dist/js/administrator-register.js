const token = sessionStorage.getItem("authToken");
const url = "https://api.tongitongu.xyz";
const addBtn = document.querySelector('.addAdmin');

document.addEventListener('DOMContentLoaded', function () {
  loadRole();
})

window.onload = () => {



  addBtn.addEventListener("click", function () {
    if (confirm('관리자를 추가하시겠습니까?')) {
      adminCreate();
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
      console.error("페이지 로드 중 오류 발생:", err);
      alert("페이지 로드 중 오류가 발생했습니다.")
    });
}



//admin 생성
function adminCreate() {
  const axiosInstance = axios.create({
    baseURL: url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const addUsername = document.querySelector('.addUsername').value;
  const addPw = document.querySelector('.addPw').value;
  const addNickname = document.querySelector('.addNickname').value;
  const addPhone = document.querySelector('.addPhone').value;

  if (!addUsername.trim()) {
    alert("관리자 아이디를 입력해주세요");
    return;
  }
  if (!addPw.trim()) {
    alert("비밀번호를 입력해주세요");
    return;
  }
  if (!addNickname.trim()) {
    alert("닉네임을 입력해주세요");
    return;
  }
  if (!addPhone.trim()) {
    alert("연락처를 입력해주세요");
    return;
  }

  const adminData = {
    username: addUsername,
    password: addPw,
    nickname: addNickname,
    phone: addPhone,
  }

  axiosInstance.post(`${url}/user/registerByAdmin`, adminData)
    .then((res) => {
      if (res.data.success == true) {
        alert("관리자를 추가하였습니다")
        alert('현재 상태를 저장하였습니다.')
        toList();

      }
    })
    .catch((err) => {
      console.error("페이지 로드 중 오류 발생:", err);
      alert("페이지 로드 중 오류가 발생했습니다.");
    })
}

function toList() {
  const listPage =  sessionStorage.getItem('listPage');
if (listPage) {
  window.location = listPage;
} else {
  window.location.href = "/administrator"
}
}

