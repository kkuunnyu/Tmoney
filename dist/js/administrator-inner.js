const url = "https://api.tongitongu.xyz";
var currentURL = window.location.href;
var matches = currentURL.match(/\/administrator-inner\/([^\/]+)/);

if (matches) {
    var userName = matches[1];
} else {
    alert("URL에서 값을 찾을 수 없음.");
}

let token = sessionStorage.getItem('authToken');
let userRole = '';


window.onload = () => {
    loadRole();
    loadPage();
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
            }
        })
        .catch((err) => {
            console.error("페이지 로드 중 오류 발생:", err);
            alert("페이지 로드 중 오류가 발생했습니다.")
        });
}

function loadPage() {
    const axiosInstance = axios.create({
        baseURL: url,
        headers: {
            Authorization: `Bearer ${token}`,
            role: `${userRole}`
        }
    })

    axiosInstance.get(`${url}/user/${userName}`)
        .then((res) => {

            if (res.data.success == true) {
                const content = res.data.data;

                //유저네임  ID
                const userName = document.querySelector('#userName');
                userName.textContent = content.username;

                //관리자 권한                
                const adminAuth = document.querySelector('#adminAuth');
                let auth = content.role === 'ROLE_ADMIN' ? '최고관리자' : '관리자';
                adminAuth.textContent = auth;

                //활성화 여부

                if (content.role === 'ROLE_ADMIN') {
                    document.querySelector('#radioBox').style.display = 'none'; // 라디오 버튼 숨김
                    document.querySelector('.save').style.display = 'none';
                } else {
                    let isActive = content.active;
                    switch (isActive) {
                        case true:
                            document.querySelector('#agree1').checked = true;
                            break;
                        case false:
                            document.querySelector('#agree2').checked = true;
                            break;
                    }
                }

                //닉네임
                const nickname = document.querySelector('#nickname');
                nickname.textContent = content.nickname;

                //전화번호
                const phone = document.querySelector('#phone');
                phone.textContent = content.phone;



            }
        })
        .catch((err) => {
            alert(err);
            //console.log(err);
        });

}

function actUpdate() {

    let isActive = document.getElementsByName("agree");
    let selectedValue = null;
    for (var i = 0; i < isActive.length; i++) {
        var selectedActive = isActive[i];

        if (selectedActive.checked) {
            selectedValue = selectedActive.value;
            break;
        }
    }


    const axiosInstance = axios.create({
        baseURL: url,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })

    const updateActive = {
        username: document.querySelector('#userName').textContent,
        active: selectedValue,
    }
    axiosInstance.post(`${url}/user/setActive?username=${updateActive.username}&active=${updateActive.active}`)
        .then((res) => {
            alert('현재 상태를 저장하였습니다.')
            toList();
        })
        .catch((err) => {
            console.log("업데이트에 실패하였습니다.", err);
            alert('업데이트에 실패하였습니다.')

        })
}

document.querySelector('.save').addEventListener("click", function () {
    if (confirm('현재 상황을 저장하시겠습니까?')) {
        actUpdate();
    }
})

//목록으로(확인버튼)
const listBtn = document.querySelector(".toList");
listBtn.addEventListener("click", toList);
function toList() {
    const listPage =  sessionStorage.getItem('listPage');
  if (listPage) {
    window.location = listPage;
  } else {
    window.location.href = "/administrator"
  }
}