export function Slider({
  className,
  value,
  onChange,
  sliderTrackValue,
  ...props
}) {
  return (
    <input
      type="range"
      className={`slider ${className}`}
      value={value}
      onChange={onChange}
      style={{
        ["--value" as any]: sliderTrackValue,
      }}
      {...props}
    />
  );
}
