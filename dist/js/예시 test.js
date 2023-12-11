window.onload(() => {
  const test = document.getElementById("test");
  var page = 0;
  var size = 10;
  var sort = 0;

  axios
    .get(
      `http://110.165.17.67/report?page=${page}&size=${size}&sort=${sort}`
    )
    .then((res) => {
      if (res.success == true) {
        const content = res.data.content;
        content.foreach((value) => {
          test.innerText += `
            <tr class="details" onClick="location.href='/accident-inner'">
                <td>${value.id}</td>
                <td>${value.title}</a></td>
                <td>삼진고속</td>
                <td>서울시 행당구 동작...</td>
                <td>가나다라 마바사 아...</td>
                <td>홍길동</td>
                <td>15</td>
                <td>2023-07-05</td>
            </tr>
            `;
        });
      }
    })
    .catch((err) => { });

  const accessToken = sessionStorage.getItem("accessToken");

  //   axios.get("https://kauth.kakao.com/v2/user/me", {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });

  axios
    .post(`http://110.165.17.67/report`, {
      title: "string",
      description: "string",
      dispatchId: 255345345,
      latitude: 0,
      longitude: 0,
    })
    .then((res) => {
      if (res.success == true) {
        const content = res.data.content;
        content.foreach((value) => {
          test.innerText += `
                <tr class="details" onClick="location.href='/accident-inner'">
                    <td>${value.id}</td>
                    <td>${value.title}</a></td>
                    <td>삼진고속</td>
                    <td>서울시 행당구 동작...</td>
                    <td>가나다라 마바사 아...</td>
                    <td>홍길동</td>
                    <td>15</td>
                    <td>2023-07-05</td>
                </tr>
                `;
        });
      }
    })
    .catch((err) => { });
});
