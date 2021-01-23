import fs from 'fs'

const filesPath = JSON.parse(fs.readFileSync('files.json'))

const videoController = (req, res, next) => {
  const videoID = req.params.video_id
  if (!filesPath[videoID]) {
    res.status(404).send(`Video nof found for: ${videoID}`)
  } else {
    // what if Video ID is invalid?
    // Render Error page maybe?
    res.render('index', {
      title: filesPath[videoID].title,
      video_src: '/video/data/' + videoID,
      video_type: filesPath[videoID].video_type
    })
    console.log(filesPath)
    next()
  }
}

// The follwoing part borrowed from this link...
// https://github.com/Abdisalan/blog-code-examples/blob/master/http-video-stream/index.js
const videoData = (req, res, next) => {
  const range = req.headers.range
  if (!range) {
    res.status(400).send('Requires Range header')
  }

  const filePath = filesPath[req.params.video_id].path
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
    'Content-Type': 'video/mp4'
  }
  console.log(headers)
  res.writeHead(206, headers)

  const videoStream = fs.createReadStream(videoPath, { start, end })

  videoStream.pipe(res)

  console.log(filesPath)
  next()
}

export default {
  videoController,
  videoData
}
