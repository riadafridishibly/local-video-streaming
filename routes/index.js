import express from "express";
import vc from "../controllers/video.js";

const router = express.Router();

router.get("/video/:video_id", vc.videoController);
router.get("/video/data/:video_id", vc.videoData);

export default router;
