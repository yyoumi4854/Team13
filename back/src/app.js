import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import { userAuthRouter } from "./routers/userRouter";
import { educationRouter } from "./routers/educationRouter";
import { projectRouter } from "./routers/projectRouter";
import { awardRouter } from "./routers/awardRouter";
import { certificateRouter } from "./routers/certificateRouter";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { login_required } from "./middlewares/login_required";

const app = express();

// CORS 에러 방지
app.use(cors());

// express 기본 제공 middleware
// express.json(): POST 등의 요청과 함께 오는 json형태의 데이터를 인식하고 핸들링할 수 있게 함.
// express.urlencoded: 주로 Form submit 에 의해 만들어지는 URL-Encoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 기본 페이지
app.get("/", (req, res) => {
  res.send("안녕하세요, 레이서 프로젝트 API 입니다.");
});

// router, service 구현 (userAuthRouter는 맨 위에 있어야 함.)
app.use(userAuthRouter);
app.use(educationRouter);
app.use(projectRouter);
app.use(awardRouter);
app.use(certificateRouter);

app.use(fileUpload());
app.post("/upload", login_required, (req, res, next) => {
  let uploadFile = req.files.file;
  let fileName = req.files.file.name;
  const fileNameArr = fileName.split(".");
  fileName = req.userId + "." + fileNameArr[1];
  uploadFile.mv(__dirname + "/../public/images/" + fileName, function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    res
      .status(201)
      .send({ imgUrl: `http://localhost:5001/images/${fileName}` });
  });
});
// 순서 중요 (router 에서 next() 시 아래의 에러 핸들링  middleware로 전달됨)
app.use(errorMiddleware);

export { app };
