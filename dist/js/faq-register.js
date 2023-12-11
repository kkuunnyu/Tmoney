window.onload = () => {
  const url = "https://api.tongitongu.xyz";
  const token = sessionStorage.getItem("authToken");
  const createBtn = document.querySelector(".save");
  createBtn.addEventListener("click", faqCreate); //faq 생성

  const noNewline = document.querySelector(".faq-title"); //타이틀 엔터키 막기
  noNewline.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  });

  //faq 생성
  function faqCreate() {
    const axiosInstance = axios.create({
      baseURL: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const category = document.querySelector(".faq-category").value;
    var categoryText = "";
    switch (category) {
      case "app_error":
        categoryText = "앱 오류";
        break;

      case "device":
        categoryText = "기기 오류";
        break;

      case "network":
        categoryText = "네트워크 오류";
        break;

      case "passenger":
        categoryText = "민원";
        break;

      case "acc":
        categoryText = "사고 관련";
        break;

      default:
        alert("카테고리를 선택해주세요");
        return;
    }

    const title = document.querySelector(".faq-title").value;
    const description = document
      .querySelector(".faq-textarea")
      .value
    //.replace(/\n/g, "%0D%0A");

    if (!title.trim()) {
      alert("제목을 작성해주세요");
      return;
    }

    if (!description.trim()) {
      alert("내용을 작성해주세요");
      return;
    }

    const createData = {
      category: categoryText,
      title: title,
      description: description,
    };
    axiosInstance
      .post(url + "/qna", {
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

    //목록으로(확인)
    function toList() {
      const listPage = sessionStorage.getItem('listPage');
      if (listPage) {
        window.location = listPage;
      } else {
        window.location.href = "/faq?page=0&size=10&sort=1"
      }
    }
};
