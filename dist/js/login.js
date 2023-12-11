window.onload = () => {
  const loginBtn = document.querySelector(".tologin");
  const loginId = document.querySelector(".login2");
  const loginPw = document.querySelector(".logout2");
  const url = "https://api.tongitongu.xyz";

  loginBtn.addEventListener("click", login);

  function login() {
    const userId = loginId.value;
    const userPw = loginPw.value;

    if (!userId) {
      alert("ID를 입력해주세요");
      $(".login2").focus();
      return;
    }

    if (!userPw) {
      alert("비밀번호를 입력해주세요");
      $(".logout2").focus();
      return;
    }

    axios
      .post(url + "/auth/getToken", {
        username: userId,
        password: userPw,
      })
      .then((res) => {
        sessionStorage.setItem("authToken", res.data.data.token);
        //console.log(sessionStorage.getItem("authToken"));
        window.location.href = "http://localhost:3000/index";
      })
      .catch((err) => {
        alert("아이디 혹은 비밀번호가 올바르지않습니다.");
        loginPw.value = "";
        //console.log(err);
      });
  }

  //로그인 ID에서 Enter
  loginId.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      login();
    }

    return;
  });

  //로그인 PW에서 Enter
  loginPw.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      login();
    }
  });
};
