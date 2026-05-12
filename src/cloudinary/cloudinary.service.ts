import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'edrms-documents', // Folder otomatis di Cloudinary
          resource_type: 'auto', // Otomatis mendeteksi PDF/Gambar
        },
        (error, result) => {
          if (error) return reject(error);

          // TypeScript butuh kepastian bahwa 'result' tidak kosong (undefined)
          if (result) {
            resolve(result);
          } else {
            reject(new Error('Gagal mendapatkan balasan dari Cloudinary'));
          }
        },
      );

      // Mengalirkan buffer file langsung ke Cloudinary tanpa simpan di hardisk
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
