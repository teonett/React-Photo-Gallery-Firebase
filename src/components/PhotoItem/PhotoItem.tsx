import React from "react";
import * as C from "./styles";

type PhotoItemProps = {
  url: string;
  name: string;
};

const PhotoItem = ({ url, name }: PhotoItemProps) => {
  return (
    <C.Container>
      <img src={url} alt={name} />
      {name}
    </C.Container>
  );
};

export default PhotoItem;
