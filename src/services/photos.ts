import { getDownloadURL, listAll, ref, uploadBytes } from "@firebase/storage";
import { firebaseStorage } from "../libs/firebase";
import { Photo } from "../types/Photo";
import { v4 as createId } from "uuid";

export const getAll = async () => {
  let list: Photo[] = [];

  const imagesFolder = ref(firebaseStorage, "images");
  const photoList = await listAll(imagesFolder);

  for (let i in photoList.items) {
    let photoUrl = await getDownloadURL(photoList.items[i]);

    list.push({
      name: photoList.items[i].name,
      url: photoUrl,
    });
  }

  return list;
};

export const insert = async (file: File) => {
  if (["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
    let randomName = createId();
    let newFile = ref(firebaseStorage, `images/${randomName}`);
    let upload = await uploadBytes(newFile, file);
    let photoUrl = await getDownloadURL(upload.ref);
    return {
      name: upload.ref.name,
      url: photoUrl,
    } as Photo;
  } else {
    return new Error("Tipo de arquivo não permitido.");
  }
};
