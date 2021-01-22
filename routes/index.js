import express from 'express'
import controller from '../controllers/video.js'

const router = express.Router()

router.get('/video/:video_id', controller)

export default router;
