import { useState, useEffect } from 'react';

export default function useImageAndBannerImage() {
  const [file, setFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const [onFileChange, setOnFileChange] = useState(false);
  const [onBannerFileChange, setOnBannerFileChange] = useState(false);

  const [newFile, setNewFile] = useState(null);
  const [newBannerFile, setNewBannerFile] = useState(null);

  const onChangeSetStates = (
    event,
    fileStateSetter,
    onChangeSetter,
    fileStateSetter2
  ) => {
    if (!event.file) {
      return;
    }
    const _file = event.file;
    if (_file) {
      onChangeSetter(true);
      fileStateSetter(_file);
      fileStateSetter2(_file);
    }
  };

  const onChangeFileUpload = (e) => {
    onChangeSetStates(e, setFile, setOnFileChange, setNewFile);
  };

  const onChangeBannerUpload = (e) => {
    onChangeSetStates(
      e,
      setBannerFile,
      setOnBannerFileChange,
      setNewBannerFile
    );
  };

  const reset = () => {
    setFile(null);
    setOnFileChange(null);
    setNewFile(null);
    setBannerFile(null);
    setOnBannerFileChange(null);
    setNewBannerFile(null);
  };

  useEffect(() => {}, [
    file,
    onFileChange,
    newFile,
    bannerFile,
    onBannerFileChange,
    newBannerFile,
  ]);

  return [
    {
      file,
      newFile,
      onFileChange,
      setFile,
      setNewFile,
      setOnFileChange,
      onChangeFileUpload,
    },
    {
      bannerFile,
      onBannerFileChange,
      newBannerFile,
      setBannerFile,
      setOnBannerFileChange,
      setNewBannerFile,
      onChangeBannerUpload,
    },
    reset,
  ];
}
