"use client";

import Image, {type ImageProps} from "next/image";
import {useState} from "react";

type ImageWithFallbackProps = Omit<ImageProps, "src"> & {
  src: string;
  fallbackSrc: string;
};

export function ImageWithFallback({src, fallbackSrc, alt, ...props}: ImageWithFallbackProps) {
  const [activeSrc, setActiveSrc] = useState(src);

  return <Image {...props} alt={alt} src={activeSrc} onError={() => setActiveSrc(fallbackSrc)}/>;
}
