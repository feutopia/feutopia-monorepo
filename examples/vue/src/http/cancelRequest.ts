import { Http } from "@feutopia/http";

const http = new Http();
http.interceptors.response.use((response) => {
  return response.data;
});

const init = async () => {
  const request = http.get<{ name: string }>({
    url: "/api/test.json",
  });

  // 取消请求
  request.cancel();

  try {
    const res = await request;
    console.log(res);
  } catch (e: unknown) {
    console.log("catch ======= ", e);
  }
};

init();
