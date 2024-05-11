import readMetadata from "gulp-scale-images/read-metadata.js";
import path from "path";

export const computeScaleInstructions = (file, _, cb) => {
    console.log(file.path)
    readMetadata(file, (err, meta) => {
        if (err) return cb(err)
        file = file.clone()
        file.scale = {
            maxWidth: Math.floor(meta.width * 2),
            maxHeight: Math.floor(meta.height * 2)
        }
        cb(null, file)
    })
}
export const computeFileName = (output, scale, cb) => {
    const fileName = [
        path.basename(output.path, output.extname),
        '@2x',
        scale.format || output.extname
    ].join('')
    cb(null, fileName)
}