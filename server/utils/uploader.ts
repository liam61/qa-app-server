import multer, { Instance } from 'multer';

export default class Uploader {
  acceptsArr = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

  fileName = '';

  multer: Instance;

  constructor(public url: string) {
    this.multer = this.initMulter();
  }

  initMulter() {
    const storage = multer.diskStorage({
      destination: (_req, _file, callback) => callback(null, this.url),
      filename: (_req, file, callback) => {
        // const timestamp = new Date().toISOString();
        const [name, ext] = file.originalname.split('.');
        this.fileName = `${name}-${Date.now()}.${ext}`;
        callback(null, this.fileName);
      },
    });

    // const mUpload = multer({ dest: 'uploads/' }); // 绝对位置
    return multer({
      storage,
      limits: { fileSize: 3 * 1000 * 1000 },
      fileFilter: (_req, file, callback) => {
        const type = file.mimetype;
        if (!this.acceptsArr.includes(type)) {
          const imgExtError = new Error('illegal image extension');
          imgExtError.name = 'ImageExtError';

          callback(imgExtError, false);
          // callback(null, false);

          return;
        }

        callback(null, true);
      },
    });
  }
}
