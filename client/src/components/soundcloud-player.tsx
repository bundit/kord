import { LegacyRef, ReactElement } from "react";
import { default as SCPlayer } from "react-player/soundcloud";

interface SoundcloudPlayerProps {
  playerRef?: LegacyRef<SCPlayer>;
  isPlaying: boolean;
  onEnd: () => void;
  volume: number;
  sourceUrl: string;
}

function SoundcloudPlayer({
  playerRef,
  isPlaying,
  onEnd,
  volume,
  sourceUrl
}: SoundcloudPlayerProps): ReactElement {
  return (
    <SCPlayer
      style={{
        pointerEvents: "none",
        position: "absolute",
        bottom: -Number.MAX_SAFE_INTEGER,
        opacity: 0
      }}
      ref={playerRef}
      url={sourceUrl}
      playing={isPlaying}
      onEnded={onEnd}
      volume={volume}
    />
  );
}

export default SoundcloudPlayer;
