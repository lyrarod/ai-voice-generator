//..
import { useEffect, useState } from "react";
import { cn, delay } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { Loader2, Play } from "lucide-react";

type VoiceType = {
  name?: string;
  voice_id: string;
  preview_url: string;
  isPlaying: boolean;
};

type SelectVoiceType = {
  voiceId: string;
  setVoiceId: React.Dispatch<React.SetStateAction<string>>;
  selectError?: boolean;
  setSelectError: React.Dispatch<React.SetStateAction<boolean>>;
};

let audio: HTMLAudioElement;

export function SelectVoice({
  voiceId,
  setVoiceId,
  selectError,
  setSelectError,
}: SelectVoiceType) {
  const [voices, setVoices] = useState<VoiceType[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("");
  const [voicesIsLoading, setVoicesIsLoading] = useState<boolean>(true);

  useEffect(() => {
    audio = new Audio();

    (async () => {
      await delay(1000);
      const res = await fetch("api/voices");
      const { voices } = await res.json();
      setVoices(voices);
      setVoicesIsLoading(false);
    })();
  }, []);

  const handleClick = ({ voice_id, preview_url, isPlaying }: VoiceType) => {
    setVoices((state) => [
      ...state.map((s) => {
        if (s.voice_id === voice_id) {
          return {
            ...s,
            isPlaying: !s.isPlaying,
          };
        }
        return {
          ...s,
          isPlaying: false,
        };
      }),
    ]);

    if (!isPlaying) {
      audio.src = preview_url;
      audio.play();
      setSelectedVoiceId(voice_id);
    } else {
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
    }
  };

  useEffect(() => {
    const handleEnded = () => {
      setVoices((state) => [
        ...state.map((s) => {
          if (s.voice_id === selectedVoiceId) {
            return {
              ...s,
              isPlaying: false,
            };
          }
          return {
            ...s,
          };
        }),
      ]);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [selectedVoiceId]);

  return (
    <Select
      value={voiceId}
      onValueChange={(value) => {
        setVoiceId(value);
        setSelectError(false);
      }}
      disabled={voicesIsLoading}
    >
      <SelectTrigger
        className={cn("w-full", {
          "border-destructive animate-pulse": selectError,
        })}
      >
        <SelectValue
          placeholder={voicesIsLoading ? "Loading voices..." : "Select a voice"}
        />
      </SelectTrigger>
      <SelectContent className="z-50">
        {voices?.map(({ name, voice_id, preview_url, isPlaying }) => {
          return (
            <div key={voice_id} className="flex items-center py-1 gap-x-1">
              <Button
                onClick={() =>
                  handleClick({ voice_id, preview_url, isPlaying })
                }
                size={"sm"}
                variant={"default"}
              >
                {isPlaying ? (
                  <Loader2 className="animate-spin size-4" />
                ) : (
                  <Play className="size-4 fill-background" />
                )}
              </Button>
              <SelectItem value={voice_id}>{name}</SelectItem>
            </div>
          );
        })}
      </SelectContent>
    </Select>
  );
}
