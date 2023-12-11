const authToken = sessionStorage.getItem("authToken");
const username = document.querySelector('#username');
window.onload = () => { };

if (!authToken) {
    alert("로그인이 필요합니다.");
    window.location.href = "http://localhost:3000";

} else {
    //유저네임 호출
    loadUsername();

    //로그아웃 기능
    document.querySelector(".logout").addEventListener("click", function () {
        sessionStorage.clear();
        window.location.href = "/";
    });
}


function loadUsername() {
    let url = "https://api.tongitongu.xyz";

    const axiosInstance = axios.create({
        baseURL: url,
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });


    axiosInstance.get(`${url}/user`)
        .then((res) => {
            if (res.data.success == true) {
                //console.log(`${url}/user`);
                const content = res.data.data;
                username.textContent = content.username;
                //console.log(content.role);
                if (content.role == 'ROLE_ADMIN') {
                    document.querySelector('.adminOnly').style.display = 'block';
                } else {
                    document.querySelector('.adminOnly').style.display = 'none';
                }
            }
        })
        .catch((err) => {
            console.error("페이지 로드 중 오류 발생:", err);
            alert("페이지 로드 중 오류가 발생했습니다.");
        })
}
