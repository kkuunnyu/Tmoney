window.onload = () => {
  const url = "https://api.tongitongu.xyz";
  const token = sessionStorage.getItem("authToken");
  const createBtn = document.querySelector(".save");
  createBtn.addEventListener("click", termsCreate);

  const noNewline = document.querySelector(".terms-title"); //타이틀 엔터키 막기
  noNewline.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  });

  //terms 생성
  function termsCreate() {
    const axiosInstance = axios.create({
      baseURL: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const category = document.querySelector(".terms-category").value;

    var categoryText = "";
    switch (category) {
      case "terms1":
        categoryText = "약관(1)";
        break;
      case "terms2":
        categoryText = "약관(2)";
        break;
      default:
        alert("카테고리를 선택해주세요");
        return;
    }

    const title = document.querySelector(".terms-title").value;
    const description = document.querySelector(".terms-textarea").value;
    //      .value.replace(/\n/g, "%0D%0A");

    if (!title.trim()) {
      alert("제목을 작성해주세요");
      document.querySelector(".terms-title").focus();
      return;
    }

    if (!description.trim()) {
      alert("내용을 작성해주세요");
      document.querySelector(".terms-textarea").focus();
      return;
    }

    const createData = {
      category: categoryText,
      title: title,
      description: description,
    };

    axiosInstance
      .post(url + "/term", {
        category: createData.category,
        title: createData.title,
        description: createData.description,
      })
      .then((res) => {
        alert("등록되었습니다");
        toList();
        
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
      window.location.href = "/terms"
    }
  }
};
