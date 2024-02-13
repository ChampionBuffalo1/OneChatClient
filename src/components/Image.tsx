type ImageProps = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

export default function Image({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  decoding = 'async'
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      decoding={decoding}
    />
  );
}
