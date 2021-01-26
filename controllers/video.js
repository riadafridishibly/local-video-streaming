import fs from 'fs'

const filesPath = JSON.parse(fs.readFileSync('files.json'))

const index = (req, res, next) => {
  res.render('index', { title: 'Homepage', filesPath: filesPath })
}

const videoController = (req, res, next) => {
  const videoID = req.params.video_id
  if (!filesPath[videoID]) {
    res.status(404).send(`Video nof found for: ${videoID}`)
  } else {
    res.render('video', {
      title: filesPath[videoID].title,
      video_src: '/video/data/' + videoID,
      video_type: filesPath[videoID].video_type
    })
  }
}

const getThumbnail = (req, res, next) => {
  const videoID = req.params.video_id
  if (!filesPath[videoID]) {
    res.status(404).send(`Video nof found for: ${videoID}`)
  } else {
    // Should I do this this way?
    const thumbnailPath = filesPath[videoID].thumbnail_path
    const thumnailStream = fs.createReadStream(thumbnailPath)
    thumnailStream.pipe(res)
  }
}

// The follwoing part borrowed from this link and modified...
// https://github.com/Abdisalan/blog-code-examples/blob/master/http-video-stream/index.js
const videoData = (req, res, next) => {
  const range = req.headers.range
  // html5 video send Range like this
  // Range: abcde-
  // here abcde is the start number
  if (!range) {
    res.status(400).send('Requires Range header')
  }

  const filePath = filesPath[req.params.video_id].path
  const contentType = filesPath[req.params.video_id].video_type
  const videoPath = filePath
  const videoSize = fs.statSync(filePath).size

  const CHUNK_SIZE = 10 ** 6 // 1mb
  const start = Number(range.replace(/\D/g, ''))
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1)

  const contentLength = end - start + 1
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(206, headers)

  const videoStream = fs.createReadStream(videoPath, { start, end })

  videoStream.pipe(res)
}

export default {
  videoController,
  videoData,
  index
}
