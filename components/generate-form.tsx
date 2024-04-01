"use client";

import { FormEvent, useState } from "react";
import { cn, delay } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectVoice } from "@/components/select-voice";

import { BotMessageSquare, Loader } from "lucide-react";

export function GenerateForm() {
  const [text, setText] = useState<string>("");
  const [voiceId, setVoiceId] = useState<string>("");
  const [audioURL, setAudioURL] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectError, setSelectError] = useState<boolean>(false);
  const [inputError, setInputError] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const textTrim = text.trim();
    if (!textTrim || !voiceId) return;

    try {
      setIsLoading(true);
      await delay(1000);
      //..
      const res = await fetch("api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textTrim,
          voice_id: voiceId,
        }),
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      //..
    } catch (error) {
      setIsLoading(false);
      console.log("Error:", error);
      throw new Error("Failed to fetch api");
      //..
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      name="generate-form"
      className="flex flex-col items-center w-full max-w-md px-8 py-10 space-y-6 rounded-lg select-none sm:space-y-10 sm:shadow-md sm:border"
    >
      <h2 className="relative text-2xl font-semibold tracking-tight border-b sm:text-3xl scroll-m-20 first:mt-0">
        <span className="text-3xl font-extrabold text-primary">AI</span> Voice
        Generator
        <BotMessageSquare className="absolute w-6 h-6 -top-4 -right-6 text-primary" />
      </h2>

      {isLoading ? (
        <span className="flex justify-center items-center w-full h-[54px]">
          <Loader className="animate-spin" />
        </span>
      ) : (
        <audio controls autoPlay>
          <source src={audioURL} type="audio/mpeg" />
        </audio>
      )}

      <SelectVoice
        voiceId={voiceId}
        setVoiceId={setVoiceId}
        selectError={selectError}
        setSelectError={setSelectError}
      />

      <Input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setInputError(false);
        }}
        type="search"
        placeholder="Type text here..."
        className={cn("placeholder:italic", {
          "border-destructive animate-pulse": inputError,
        })}
        maxLength={40}
        disabled={isLoading}
      />

      <Button
        type="submit"
        disabled={isLoading}
        size={"lg"}
        variant={"default"}
        className="w-full text-xs font-bold tracking-widest uppercase"
        onClick={() => {
          !voiceId ? setSelectError(true) : setSelectError(false);
          !text.trim() ? setInputError(true) : setInputError(false);
        }}
      >
        Generate Voice
      </Button>
    </form>
  );
}
