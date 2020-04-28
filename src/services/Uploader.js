import axiosInstance from 'services/AxiosInstance';
import cuid from 'cuid';

import * as AwsS3 from '@uppy/aws-s3';
import * as Uppy from '@uppy/core';

class UploadService {
  async upload({
    name,
    mime_type,
    uploaded_by_user_id,
    fileable_type,
    fileable_id,
    binaryFile,
  }) {
    const uppy = Uppy();
    const newFileName = `${cuid()}_${name}`;

    uppy.use(AwsS3, {
      getUploadParameters() {
        return axiosInstance
          .post('/files/generate_presigned_url', {
            name: newFileName,
          })
          .then(({ data }) => {
            return {
              method: 'PUT',
              url: data.url,
              fields: [],
              headers: [],
            };
          });
      },
    });

    uppy.addFile({
      name: newFileName,
      type: mime_type,
      data: binaryFile,
      source: 'Local',
    });

    const result = await uppy.upload();

    if (result.successful && result.successful.length) {
      const file = await axiosInstance.post('/files', {
        name: name,
        location: newFileName,
        mime_type,
        fileable_id,
        fileable_type,
        uploaded_by_user_id,
      });

      return { success: true, file };
    } else {
      return { success: false };
    }
  }
}

export default new UploadService();
