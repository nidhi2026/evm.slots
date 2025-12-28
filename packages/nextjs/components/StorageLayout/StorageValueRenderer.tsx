export const renderHighlightedValue = (value: string, offset: number, numberOfBytes: number) => {
  if (!value.startsWith("0x")) return value;

  const hex = value.slice(2).padStart(64, "0");
  const TOTAL_BYTES = 32;

  const endByte = TOTAL_BYTES - offset;
  const startByte = endByte - numberOfBytes;
  const endHex = endByte * 2;
  const startHex = startByte * 2;

  const before = hex.slice(0, startHex);
  const main = hex.slice(startHex, endHex);
  const after = hex.slice(endHex);

  return (
    <span className="font-mono break-all">
      <span className="opacity-30">0x{before}</span>
      <span>{main}</span>
      <span className="opacity-30">{after}</span>
    </span>
  );
};
