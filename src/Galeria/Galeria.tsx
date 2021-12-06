import React, { FormEvent, useEffect, useState } from "react";
import * as C from "./styles";
import * as Photos from "../services/photos";
import { Photo } from "../types/Photo";
import PhotoItem from "../components/PhotoItem";

const Galeria = () => {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const getPhotos = async () => {
      setLoading(true);
      setPhotos(await Photos.getAll());
      setLoading(false);
    };
    getPhotos();
  }, []);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("image") as File;
    if (file && file.size > 0) {
      setUploading(true);
      let result = await Photos.insert(file);
      setUploading(false);

      if (result instanceof Error) {
        alert(`${result.name} - ${result.message}`);
      } else {
        let newPhotosList = [...photos];
        newPhotosList.push(result);
        setPhotos(newPhotosList);
      }
    }
  };

  return (
    <C.Container>
      <C.Area>
        <C.Header> Galeria de Fotos</C.Header>
        {/* Area Upload */}
        <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type="file" name="image" />
          <input type="submit" value="Enviar" />
          {uploading && "Enviando arquivo...."}
        </C.UploadForm>
        {/* Lista de Fotos */}
        {loading && (
          <C.ScreenWarning>
            <span role="img" aria-label="carregando">
              🖐
            </span>
            <div>Carregando...</div>
          </C.ScreenWarning>
        )}
        {!loading && photos.length > 0 && (
          <C.PhotosList>
            {photos.map((item, index) => (
              <PhotoItem key={index} url={item.url} name={item.name} />
            ))}
          </C.PhotosList>
        )}
        {!loading && photos.length === 0 && (
          <C.ScreenWarning>
            <span role="img" aria-label="carregando">
              😔
            </span>
            <div>
              Não há imagens disnponíveis <br /> (diretório pode estar vazio).
            </div>
          </C.ScreenWarning>
        )}
      </C.Area>
    </C.Container>
  );
};

export default Galeria;
