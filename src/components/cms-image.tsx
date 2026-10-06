import Image, { type ImageProps } from "next/image";

type Props = Omit<ImageProps, "src"> & {
  src: string;
};

/** next/image wrapper — local CMS uploads skip optimizer */
export function CmsImage({ src, alt, ...rest }: Props) {
  const local = src.startsWith("/media/");
  return (
    <Image
      src={src}
      alt={alt}
      {...rest}
      unoptimized={local || rest.unoptimized}
    />
  );
}
