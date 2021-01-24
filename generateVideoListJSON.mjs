/*
This is the template of the JSON file
{
  "ab12(hash)": {
    "title": "Big Buck Bunny",
    "path": "test_data/BigBuckBunny.mp4",
    "video_type": "video/mp4",
    "description": "This is the Big Buck Bunny video",
    "thumbnail_path": "test_data/thumbnail.png",
    "caption_path": "/some/path"
  }
}
*/

import crypto from 'crypto'
import { join, resolve, extname, basename } from 'path'
import fs from 'fs'

const files = {}

const acceptedTypes = {
  mkv: 'video/mp4',
  mp4: 'video/mp4'
}

const createHash = (s) => {
  return crypto.createHash('sha1').update(s).digest('hex')
}

function traverse (path) {
  const dir = fs.readdirSync(path, { withFileTypes: true })
  for (const dirent of dir) {
    if (dirent.isDirectory()) {
      traverse(join(path, dirent.name))
    }
    // remove the dot with [substr(1)]
    // if the extension is in uppercase make it lowercase
    const ext = extname(dirent.name)
    const fileType = ext.substr(1).toLocaleLowerCase()
    if (fileType in acceptedTypes) {
      const absPath = resolve(join(path, dirent.name))
      const fileName = basename(dirent.name, ext)
      const videoID = createHash(absPath).substr(7, 25)
      files[videoID] = {}
      files[videoID].path = absPath
      files[videoID].title = fileName
      files[videoID].video_type = acceptedTypes[fileType]
      files[videoID].description = ''
      files[videoID].thumbnail_path = ''
      files[videoID].caption_path = ''
    }
  }
}
traverse('./')

fs.writeFileSync('files.json', JSON.stringify(files, null, 2))
